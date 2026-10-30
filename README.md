# Video Speed

[Chrome Web Store](https://chromewebstore.google.com/detail/video-speed/cmjafmcaccbhfgcjnfldaahebnbbppje)

Lightweight HTML5 video controls, with one playback-speed and panel-position preference **per website**. YouTube can stay at 3× while another site stays at 16×. Same-site tabs share the setting. The on-video controller starts in the upper-left, can be dragged, opens on hover and fades when unused. Mouse-wheel speed control only blocks page scrolling while the pointer is over the speed label. Dynamic video discovery handles single-page navigation and open Shadow DOM players where accessible. Multiple-player pages prioritize the selected/playing visible video.

The extension uses Chrome local storage only; it does not track usage or send browsing data. Some DRM or restricted players may reject playback-rate changes.

## Controls

| Shortcut | Action |
| --- | --- |
| Q | 3× |
| E | 2.5× |
| D / S | Speed +0.1× / −0.1× (hold to change continuously) |
| R | 1× |
| Z / X | 10 seconds backward / forward |

The speed range is 0.1×–16×. Shortcuts are ignored while editing text or using page controls, or with Ctrl/Alt/Meta held. Some sites may use overlapping shortcuts. Some protected players, non-HTML5 media, closed-shadow-root players, or platforms that override playback speed may not be supported.

## Install locally

Download repository, open `chrome://extensions`, enable **Developer mode**, then choose **Load unpacked** and the directory containing `manifest.json`.

## Release 1.2.0

This release includes refreshed icons, bilingual extension metadata, site-specific speed/position preferences, mouse-wheel control, and updated privacy documentation. The current Chrome Web Store listing is managed in the Developer Dashboard.

## Publishing

GitHub Actions manually checks store connection; pushing a tag matching `v` + `manifest.json` version packages the extension and submits it for Google review. See [Privacy Policy](PRIVACY_POLICY.md).

## Independent website settings

Speed and controller position are now remembered separately for each website. YouTube at 3× does not change another site's 16× setting. Multiple tabs of one site share that site's preferences. The popup controls the active site's speed. Legacy global settings are not copied to every site; each new site starts at 1.5× and the top-left panel until customized.
