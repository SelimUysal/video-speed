/* Video Speed: adaptive video detection, global rate, draggable compact controls. */
(() => {
  'use strict';
  if (globalThis.__vsInit) return;
  globalThis.__vsInit = true;

  // Store settings independently for the top-level website, including embedded players.
  function siteName() {
    let host = location.hostname.toLowerCase().replace(/^www\./, '');
    try {
      const list = location.ancestorOrigins;
      if (list?.length) {
        const top = new URL(list[list.length - 1]).hostname.toLowerCase().replace(/^www\./, '');
        if (top) host = top;
      }
    } catch (_) {}
    return host || 'local-page';
  }
  const SITE = siteName();
  const PREFIX = 'videoSpeed.site.v1.';
  const SPEED_KEY = PREFIX + 'speed.' + encodeURIComponent(SITE);
  const POSITION_KEY = PREFIX + 'position.' + encodeURIComponent(SITE);
  const DEFAULT_SPEED = 1.5;
  const INSET = 12;
  const videos = new Map();
  const policy = globalThis.VideoSpeedPolicy;
  let preferredVideo = null;
  let activeVideo = null;
  const pendingNodes = new Set();
  let discoveryScheduled = false;
  const observed = new WeakSet();
  const tr = /^tr/i.test(navigator.language || '');
  const valid = n => n !== undefined && n !== null && Number.isFinite(+n) && +n >= 0.1 && +n <= 16;
  const rounded = n => Math.round(Math.max(0.1, Math.min(16, Number(n))) * 100) / 100;
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  let rate = DEFAULT_SPEED, ready = false;
  let anchor = { x: 0, y: 0 }; // 0 = top left with 12px inset; 1 = bottom right.
  let expanded = false, queued = false, drag = null, ignoreClick = false;
  let hideTimer = null, fadeTimer = null, heldKey = null;
  let holdDelay = null, holdInterval = null, holdSince = 0, lastPersist = 0;
  let inputAt = 0, inputMode = 'pointer', lastSelected = null;

  const host = document.createElement('div');
  host.id = 'video-speed-controller-host';
  host.style.cssText = 'position:fixed!important;z-index:2147483647!important;display:none;left:0;top:0;touch-action:none!important';
  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `
    <style>
      *{box-sizing:border-box}
      .panel{display:flex;align-items:center;gap:1px;width:max-content;max-width:95vw;
        background:rgba(30,34,42,.91);color:#fff;padding:2px 3px;border:1px solid #ffffff22;
        border-radius:9px;box-shadow:0 2px 10px #0004;opacity:1;
        font:600 11px system-ui,-apple-system,sans-serif;transition:opacity .45s ease}
      .panel.idle{opacity:.38}.panel:hover,.panel:focus-within{opacity:1}
      button{background:transparent;color:inherit;border:0;min-width:28px;height:28px;
        padding:0 5px;font:inherit;border-radius:6px;cursor:pointer;touch-action:none}
      button:hover{background:#ffffff2c}button:focus-visible{outline:2px solid #b3d4ff;outline-offset:1px}
      #speed{min-width:44px;cursor:grab;font-variant-numeric:tabular-nums;user-select:none;-webkit-user-select:none}
      #speed.dragging{cursor:grabbing;background:#ffffff29}
      .controls{display:flex;align-items:center;gap:1px}.controls[hidden]{display:none}
      .controls button{font-size:14px;font-weight:500}
      @media(prefers-reduced-motion:reduce){.panel{transition:none}}
    </style>
    <div class="panel" role="group" aria-label="Video Speed">
      <button id="speed" aria-expanded="false"></button>
      <div class="controls" hidden></div>
    </div>`;
  const panel = shadow.querySelector('.panel');
  const speedButton = shadow.querySelector('#speed');
  const controls = shadow.querySelector('.controls');
  speedButton.title = tr ? 'Tekerlek: hız ayarı · Sürükle: taşı · Tıkla: kontroller' : 'Wheel: change speed · Drag: move · Click: controls';
  speedButton.setAttribute('aria-label', speedButton.title);

  function paint() { speedButton.textContent = `${Number(rate.toFixed(2))}×`; }
  function persistSpeed() { if (ready) chrome.storage.local.set({ [SPEED_KEY]: rate }).catch(() => {}); }
  function apply(video, force = false) {
    if (!ready || !video?.isConnected || video !== selectVideo()) return;
    try {
      const state = videos.get(video);
      if (state?.yieldUntil > Date.now() && !force) return;
      if (Math.abs(video.playbackRate - rate) > 0.001) {
        if (state) state.programmaticAt = Date.now();
        video.playbackRate = rate;
      }
      // Do not write defaultPlaybackRate: some players interpret it as another
      // competing controller and re-apply their own speed repeatedly.
    } catch (_) { /* Player can reject a playback-rate update. */ }
  }
  function setSpeed(value, persist = true) {
    if (!ready || !Number.isFinite(Number(value))) return;
    rate = rounded(value); paint();
    const selected = selectVideo();
    if (selected) apply(selected, true);
    wake(false);
    if (persist) persistSpeed();
  }

  function visible(video) {
    if (!video.isConnected) return false;
    const r = video.getBoundingClientRect(), s = getComputedStyle(video);
    return r.width >= 100 && r.height >= 60 && r.right > 0 && r.bottom > 0 &&
      r.left < innerWidth && r.top < innerHeight && s.display !== 'none' && s.visibility !== 'hidden';
  }
  function selectVideo() {
    if (preferredVideo && visible(preferredVideo)) return preferredVideo;
    let best = null, score = -1;
    for (const video of videos.keys()) {
      if (!visible(video)) continue;
      const rect = video.getBoundingClientRect();
      const points = policy.videoScore(rect.width, rect.height, video.paused, video.ended);
      if (points > score) { score = points; best = video; }
    }
    return best;
  }
  function markPreferred(video) {
    if (!video?.isConnected) return;
    preferredVideo = video;
    schedule();
  }
  function skip(seconds) {
    const video = selectVideo();
    if (!video) return false;
    try {
      video.currentTime = clamp(video.currentTime + seconds, 0,
        Number.isFinite(video.duration) ? video.duration : Infinity);
      return true;
    } catch (_) { return false; }
  }

  function validAnchor(value) {
    return !!value && typeof value === 'object' && Number.isFinite(value.x) &&
      Number.isFinite(value.y) && value.x >= 0 && value.x <= 1 && value.y >= 0 && value.y <= 1;
  }
  function bounds(video) {
    const r = video.getBoundingClientRect();
    const size = panel.getBoundingClientRect();
    const w = size.width || 55, h = size.height || 35;
    const maxViewportX = Math.max(6, innerWidth - w - 6);
    const maxViewportY = Math.max(6, innerHeight - h - 6);
    const minX = clamp(r.left + INSET, 6, maxViewportX);
    const minY = clamp(r.top + INSET, 6, maxViewportY);
    return {
      minX, minY,
      maxX: Math.max(minX, clamp(r.right - w - INSET, 6, maxViewportX)),
      maxY: Math.max(minY, clamp(r.bottom - h - INSET, 6, maxViewportY))
    };
  }
  function drawAt(x, y) {
    host.style.left = `${x}px`;
    host.style.top = `${y}px`;
  }
  function position() {
    const video = selectVideo();
    lastSelected = video;
    if (!ready || !video || document.fullscreenElement?.tagName === 'VIDEO') {
      host.style.display = 'none'; return;
    }
    const parent = document.fullscreenElement || document.body || document.documentElement;
    if (host.parentElement !== parent) parent.append(host);
    host.style.display = 'block';
    if (drag?.moved) return;
    const b = bounds(video);
    const r = video.getBoundingClientRect();
    drawAt(clamp(r.left + INSET + anchor.x * Math.max(1, r.width - INSET * 2), b.minX, b.maxX),
      clamp(r.top + INSET + anchor.y * Math.max(1, r.height - INSET * 2), b.minY, b.maxY));
  }
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      for (const [video, state] of videos) {
        if (video.isConnected) continue;
        if (video === preferredVideo) preferredVideo = null;
        state.listeners.forEach(([event, listener]) => video.removeEventListener(event, listener));
        clearTimeout(state.pending);
        videos.delete(video);
      }
      const selected = selectVideo();
      if (selected !== activeVideo) {
        activeVideo = selected;
        if (selected) apply(selected);
      }
      position();
    });
  }

  function trackVideo(video) {
    if (videos.has(video)) return;
    const state = { listeners: [], graceUntil: Date.now() + 1400,
      programmaticAt: 0, conflictSince: 0, conflicts: 0, pending: null, yieldUntil: 0 };
    videos.set(video, state);
    const on = (name, cb) => { video.addEventListener(name, cb); state.listeners.push([name, cb]); };
    for (const event of ['loadstart', 'loadedmetadata', 'emptied']) {
      on(event, () => {
        state.graceUntil = Date.now() + 1200;
        state.conflicts = 0;
        state.yieldUntil = 0;
        if (video === selectVideo()) apply(video);
        schedule();
      });
    }
    for (const event of ['canplay', 'play', 'playing']) {
      on(event, () => {
        if (event === 'play' && Date.now() - inputAt < 1200 && video !== preferredVideo) markPreferred(video);
        if (video === selectVideo()) apply(video);
        schedule();
      });
    }
    on('pointerdown', () => markPreferred(video));
    on('focusin', () => markPreferred(video));
    on('ratechange', () => {
      if (!ready || video !== selectVideo() || Math.abs(video.playbackRate - rate) < .001) return;
      const now = Date.now(), changed = video.playbackRate;
      if (state.yieldUntil > now) return;
      // A deliberate adjustment made with the website's own speed control wins.
      // Do not mistake the player resetting to 1x during load for a user preference.
      if (valid(changed) && video === selectVideo() && now > state.graceUntil &&
          now - inputAt < 1800 && now - state.programmaticAt > 120) {
        clearTimeout(state.pending);
        state.pending = setTimeout(() => {
          if (video.isConnected && valid(video.playbackRate) &&
              Math.abs(video.playbackRate - rate) > .001) setSpeed(video.playbackRate);
        }, 90);
        return;
      }
      if (now < state.graceUntil) { apply(video); return; }
      // Yield when another controller repeatedly forces a competing value.
      if (now - state.conflictSince > 3000) { state.conflictSince = now; state.conflicts = 0; }
      if (++state.conflicts <= 3) apply(video);
      else state.yieldUntil = now + 5000; // Let a stubborn player take control temporarily.
    });
    schedule();
  }
  // Discover each new subtree once, on the next animation frame. No polling.
  function discover(node) {
    if (!node || node.nodeType !== 1 || node === host) return;
    if (node.tagName === 'VIDEO') trackVideo(node);
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT);
    let element;
    while ((element = walker.nextNode())) {
      if (element === host) continue;
      if (element.tagName === 'VIDEO') trackVideo(element);
      if (element.shadowRoot) observe(element.shadowRoot);
    }
    if (node.shadowRoot) observe(node.shadowRoot);
  }
  function queueDiscovery(node) {
    if (!node || node.nodeType !== 1 || node === host) return;
    pendingNodes.add(node);
    if (discoveryScheduled) return;
    discoveryScheduled = true;
    requestAnimationFrame(() => {
      discoveryScheduled = false;
      const batch = [...pendingNodes];
      pendingNodes.clear();
      for (const element of batch) if (element.isConnected) discover(element);
      schedule();
    });
  }
  function observe(node) {
    if (observed.has(node)) return;
    observed.add(node);
    const observer = new MutationObserver(records => {
      let removed = false;
      for (const record of records) {
        if (record.type === 'attributes') {
          if (record.target.tagName === 'VIDEO') {
            trackVideo(record.target);
            if (record.target === selectVideo()) apply(record.target);
          }
        } else {
          for (const element of record.addedNodes) queueDiscovery(element);
          if (record.removedNodes.length) removed = true;
        }
      }
      if (removed) schedule();
    });
    observer.observe(node, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
    discover(node.nodeType === 1 ? node : node.host || node);
  }

  const labels = tr
    ? ['10 sn geri', 'Hızı azalt', 'Hızı artır', '1× sıfırla', '10 sn ileri']
    : ['Back 10 seconds', 'Decrease speed', 'Increase speed', 'Reset to 1×', 'Forward 10 seconds'];
  const actions = [() => skip(-10), () => setSpeed(rate - .1), () => setSpeed(rate + .1),
    () => setSpeed(1), () => skip(10)];
  ['↶', '−', '+', '⟲', '↷'].forEach((glyph, i) => {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = glyph;
    button.title = labels[i]; button.setAttribute('aria-label', labels[i]);
    button.addEventListener('click', event => { event.stopPropagation(); actions[i](); });
    controls.append(button);
  });

  function clearTimers() { clearTimeout(hideTimer); clearTimeout(fadeTimer); }
  function keyboardFocus() { return inputMode === 'keyboard' && !!shadow.activeElement; }
  function collapse() {
    if (!expanded) return;
    expanded = false; controls.hidden = true;
    speedButton.setAttribute('aria-expanded', 'false'); schedule();
  }
  function fadeAfter() {
    clearTimeout(fadeTimer);
    fadeTimer = setTimeout(() => {
      if (!drag && !host.matches(':hover') && !keyboardFocus()) panel.classList.add('idle');
    }, 2000);
  }
  function hideAfter() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (drag || host.matches(':hover') || keyboardFocus()) return;
      collapse(); fadeAfter();
    }, 900);
  }
  function wake(open = false) {
    panel.classList.remove('idle'); clearTimers();
    if (open && !expanded) {
      expanded = true; controls.hidden = false;
      speedButton.setAttribute('aria-expanded', 'true'); schedule();
    }
    if (!open && !host.matches(':hover') && !keyboardFocus() && !drag) {
      expanded ? hideAfter() : fadeAfter();
    }
  }
  host.addEventListener('pointerenter', () => wake(true));
  host.addEventListener('pointerleave', () => hideAfter());
  shadow.addEventListener('focusin', () => wake(true));
  shadow.addEventListener('focusout', () => setTimeout(() => {
    if (!keyboardFocus() && !host.matches(':hover')) hideAfter();
  }, 0));

  // Wheel input is scoped ONLY to the numeric speed button. A non-passive
  // listener prevents the page from scrolling while the pointer is there.
  // Discrete mouse-wheel notches change speed once; smaller trackpad deltas
  // accumulate to avoid overly sensitive speed jumps.
  let wheelAccum = 0, wheelAt = 0, wheelDirection = 0;
  speedButton.addEventListener('wheel', event => {
    // Preserve browser zoom / modifier gestures instead of hijacking them.
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.cancelable) event.preventDefault();
    event.stopPropagation();
    if (!ready || !selectVideo() || drag || !event.deltaY) return;

    const now = Date.now();
    const direction = Math.sign(event.deltaY);
    if (now - wheelAt > 240 || wheelDirection !== direction) wheelAccum = 0;
    wheelAt = now;
    wheelDirection = direction;

    const delta = Math.abs(event.deltaY);
    let steps = 0;
    if (event.deltaMode === 2) {
      // A page-based wheel step is one deliberate adjustment.
      steps = 1;
      wheelAccum = 0;
    } else if (event.deltaMode === 1) {
      // Each line-scrolling mouse notch should change speed by 0.1x.
      steps = Math.max(1, Math.min(3, Math.round(delta / 3)));
      wheelAccum = 0;
    } else if (delta >= 60) {
      // Common mouse wheels produce about 100px per notch.
      steps = Math.max(1, Math.min(3, Math.round(delta / 100)));
      wheelAccum = 0;
    } else {
      // Precision touchpads report a stream of small pixel deltas.
      wheelAccum += delta;
      steps = Math.floor(wheelAccum / 60);
      wheelAccum -= steps * 60;
    }
    if (steps) setSpeed(rate - direction * steps * .1);
  }, { passive: false });

  // Exact pixel pointer movement; store a normalized position for other video sizes.
  speedButton.addEventListener('pointerdown', e => {
    if (e.button !== 0 || drag) return;
    inputMode = 'pointer';
    clearTimers();
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY,
      left: parseFloat(host.style.left) || 0, top: parseFloat(host.style.top) || 0,
      moved: false };
    speedButton.setPointerCapture(e.pointerId);
  });
  speedButton.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 3) return;
    drag.moved = true; speedButton.classList.add('dragging');
    const video = selectVideo(); if (!video) return;
    const b = bounds(video);
    drawAt(clamp(drag.left + dx, b.minX, b.maxX), clamp(drag.top + dy, b.minY, b.maxY));
    e.preventDefault();
  });
  function endDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const moved = drag.moved;
    drag = null; speedButton.classList.remove('dragging');
    try { speedButton.releasePointerCapture(e.pointerId); } catch (_) {}
    if (moved) {
      const video = selectVideo();
      if (video) {
        const b = bounds(video);
        anchor = {
          x: clamp((parseFloat(host.style.left) - video.getBoundingClientRect().left - INSET) / Math.max(1, video.getBoundingClientRect().width - 2 * INSET), 0, 1),
          y: clamp((parseFloat(host.style.top) - video.getBoundingClientRect().top - INSET) / Math.max(1, video.getBoundingClientRect().height - 2 * INSET), 0, 1)
        };
        chrome.storage.local.set({ [POSITION_KEY]: anchor }).catch(() => {});
      }
      ignoreClick = true;
      setTimeout(() => { ignoreClick = false; }, 0);
    }
    schedule();
    if (!host.matches(':hover')) hideAfter();
  }
  speedButton.addEventListener('pointerup', endDrag);
  speedButton.addEventListener('pointercancel', endDrag);
  speedButton.addEventListener('click', e => {
    e.stopPropagation();
    if (ignoreClick) { ignoreClick = false; return; }
    if (expanded) { collapse(); if (!host.matches(':hover')) fadeAfter(); }
    else wake(true);
  });
  for (const event of ['click', 'dblclick', 'mousedown', 'pointerdown', 'keydown']) {
    panel.addEventListener(event, e => e.stopPropagation());
  }

  function stopHold() {
    if (!heldKey) return;
    heldKey = null; clearTimeout(holdDelay); clearInterval(holdInterval);
    holdDelay = null; holdInterval = null; persistSpeed();
  }
  function startHold(key) {
    if (heldKey === key) return;
    stopHold(); heldKey = key; holdSince = Date.now(); lastPersist = holdSince;
    const direction = key === 'd' ? 1 : -1;
    setSpeed(rate + direction * .1, false);
    holdDelay = setTimeout(() => {
      holdInterval = setInterval(() => {
        if (heldKey !== key) return;
        setSpeed(rate + direction * (Date.now() - holdSince > 1700 ? .2 : .1), false);
        if (Date.now() - lastPersist > 350) { lastPersist = Date.now(); persistSpeed(); }
      }, 75);
    }, 330);
  }
  function editing(event) {
    return (event.composedPath?.() || [event.target]).some(el =>
      el?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el?.tagName) ||
      el?.getAttribute?.('role') === 'textbox');
  }
  function onKeyDown(event) {
    if (!ready || !selectVideo() || event.defaultPrevented || event.isComposing ||
        event.ctrlKey || event.altKey || event.metaKey || editing(event) ||
        policy.isInteractivePath(event.composedPath?.() || [event.target])) return;
    const key = event.key.toLowerCase();
    if (key === 'd' || key === 's') { startHold(key); event.preventDefault(); return; }
    if (event.repeat) return;
    let handled = true;
    switch (key) {
      case 'q': stopHold(); setSpeed(3); break;
      case 'e': stopHold(); setSpeed(2.5); break;
      case 'r': stopHold(); setSpeed(1); break;
      case 'z': skip(-10); break;
      case 'x': skip(10); break;
      default: handled = false;
    }
    if (handled) event.preventDefault();
  }

  function init() {
    // Only real page interactions are candidates for an intentional native speed change.
    document.addEventListener('pointerdown', event => {
      inputMode = 'pointer';
      if (event.isTrusted && !event.composedPath().includes(host)) inputAt = Date.now();
    }, true);
    document.addEventListener('keydown', event => {
      inputMode = 'keyboard';
      if (event.isTrusted && !editing(event) &&
          !policy.isInteractivePath(event.composedPath?.() || [event.target])) inputAt = Date.now();
    }, true);
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') return;
      if (valid(changes[SPEED_KEY]?.newValue) && !heldKey) {
        rate = rounded(changes[SPEED_KEY].newValue); paint();
        const video = selectVideo();
        if (video) apply(video, true);
      }
      if (validAnchor(changes[POSITION_KEY]?.newValue) && !drag) {
        anchor = changes[POSITION_KEY].newValue; schedule();
      }
    });
    chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
      if (msg?.action === 'getStatus') { reply({ hasVideo: !!selectVideo(), rate, siteHost: SITE }); return; }
      if (msg?.action === 'rewind' || msg?.action === 'forward') {
        reply({ ok: skip(msg.action === 'rewind' ? -10 : 10) }); return;
      }
      if (msg?.action === 'setSpeed') { setSpeed(msg.rate); reply({ ok: true, rate }); }
    });
    observe(document.documentElement);
    addEventListener('scroll', schedule, true);
    addEventListener('resize', schedule);
    document.addEventListener('fullscreenchange', schedule);
    // Bubble phase: let the website handle its own shortcuts first.
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', e => {
      if (e.key.toLowerCase() === heldKey) { stopHold(); e.preventDefault(); }
    }, true);
    addEventListener('blur', stopHold);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopHold(); });
    chrome.storage.local.get([SPEED_KEY, POSITION_KEY]).then(data => {
      if (valid(data[SPEED_KEY])) rate = rounded(data[SPEED_KEY]);
      else rate = DEFAULT_SPEED;
      if (validAnchor(data[POSITION_KEY])) anchor = data[POSITION_KEY];
    }).catch(() => {}).finally(() => {
      ready = true; paint();
      const selected = selectVideo();
      if (selected) apply(selected);
      position(); fadeAfter();
    });
  }
  if (document.documentElement) init();
  else document.addEventListener('DOMContentLoaded', init, { once: true });
})();
