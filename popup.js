/* Minimal popup: only controls the currently active page and its site's preferences. */
(() => {
  'use strict';

  const MIN_RATE = 0.1, MAX_RATE = 16, STEP = 0.1, DEFAULT_RATE = 1.5;
  const tr = /^tr/i.test(navigator.language || '');
  const $ = id => document.getElementById(id);
  const rateButtons = [...document.querySelectorAll('.speed button, .presets button, #reset')];
  const seekButtons = [$('rewind'), $('forward')];
  const presetButtons = [...document.querySelectorAll('[data-speed]')];

  const copy = tr ? {
    subtitle: 'Her site için ayrı ayarlar',
    heading: 'Oynatma hızı',
    state: 'Bu siteye özel',
    skipheading: 'Video kontrolleri',
    status: 'Video kontrol ediliyor…',
    none: 'Ana sayfada video yok; gömülü videoyu üstünden kontrol et',
    found: 'Video bulundu',
    unavailable: 'Bu sayfada uzantı kullanılamıyor',
    rewindLabel: '10 sn geri',
    forwardLabel: '10 sn ileri',
    reset: '1× sıfırla',
    error: 'Değişiklik kaydedilemedi'
  } : {
    subtitle: 'Independent site settings',
    heading: 'Playback speed',
    state: 'Saved for this site',
    skipheading: 'Video controls',
    status: 'Checking video…',
    none: 'No main-page video; use on-video controls for embeds',
    found: 'Video found',
    unavailable: 'Unavailable on this page',
    rewindLabel: '10s back',
    forwardLabel: '10s forward',
    reset: 'Reset to 1×',
    error: 'Could not save preference'
  };

  for (const [id, value] of Object.entries(copy)) {
    if ($(id)) $(id).textContent = value;
  }
  document.documentElement.lang = tr ? 'tr' : 'en';

  let speed = DEFAULT_RATE;
  let speedKey = null;
  let tabId = null;
  let hasMainVideo = false;

  function validSpeed(value) {
    return value !== null && value !== undefined && Number.isFinite(Number(value)) &&
      Number(value) >= MIN_RATE && Number(value) <= MAX_RATE;
  }
  function clampSpeed(value) {
    return Math.round(Math.min(MAX_RATE, Math.max(MIN_RATE, Number(value))) * 100) / 100;
  }
  function repaint() {
    $('value').textContent = Number(speed.toFixed(2)) + '×';
    for (const button of presetButtons) {
      button.setAttribute('aria-pressed', String(Number(button.dataset.speed) === speed));
    }
  }
  function updateButtons() {
    for (const button of rateButtons) button.disabled = !speedKey;
    for (const button of seekButtons) button.disabled = !hasMainVideo;
  }
  async function setSpeed(value) {
    if (!speedKey || !Number.isFinite(Number(value))) return;
    const previous = speed;
    speed = clampSpeed(value);
    repaint();
    try {
      await chrome.storage.local.set({ [speedKey]: speed });
    } catch (_) {
      speed = previous;
      repaint();
      $('state').textContent = copy.error;
    }
  }

  $('minus').addEventListener('click', () => setSpeed(speed - STEP));
  $('plus').addEventListener('click', () => setSpeed(speed + STEP));
  $('reset').addEventListener('click', () => setSpeed(1));
  for (const button of presetButtons) {
    button.addEventListener('click', () => setSpeed(Number(button.dataset.speed)));
  }

  async function seek(action) {
    if (!tabId || !hasMainVideo) return;
    try {
      // Without a frame target sendMessage can reach arbitrary video iframes.
      await chrome.tabs.sendMessage(tabId, { action }, { frameId: 0 });
    } catch (_) {
      hasMainVideo = false;
      $('status').textContent = copy.none;
      updateButtons();
    }
  }
  $('rewind').addEventListener('click', () => seek('rewind'));
  $('forward').addEventListener('click', () => seek('forward'));

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local' || !speedKey || !validSpeed(changes[speedKey]?.newValue)) return;
    speed = clampSpeed(changes[speedKey].newValue);
    repaint();
  });

  async function init() {
    updateButtons();
    repaint();
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      tabId = tabs[0]?.id;
      if (!tabId) throw new Error('No active tab');

      // The main document identifies the top-level site. Embedded players
      // receive site settings via storage but are never arbitrarily targeted.
      const status = await chrome.tabs.sendMessage(tabId, { action: 'getStatus' }, { frameId: 0 });
      const host = String(status?.siteHost || '').trim().toLowerCase();
      if (!host) throw new Error('No supported site');
      speedKey = 'videoSpeed.site.v1.speed.' + encodeURIComponent(host);
      hasMainVideo = !!status.hasVideo;

      const values = await chrome.storage.local.get([speedKey]);
      speed = validSpeed(values[speedKey]) ? clampSpeed(values[speedKey]) : DEFAULT_RATE;

      $('state').textContent = host + ' · ' + copy.state;
      $('status').textContent = hasMainVideo ? copy.found : copy.none;
    } catch (_) {
      $('state').textContent = copy.unavailable;
      $('status').textContent = copy.unavailable;
    }
    updateButtons();
    repaint();
  }

  init();
})();
