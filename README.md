# Video Speed

[Chrome Web Store](https://chromewebstore.google.com/detail/video-speed/cmjafmcaccbhfgcjnfldaahebnbbppje)

Minimal, cross-website HTML5 video speed controls. Version 1.1.0 adds late-video detection, SPA/video replacement tracking, a hover-to-expand floating controller, drag-to-position support, native player speed-change compatibility, modern popup, bilingual labels and persistent preferences stored in Chrome's `chrome.storage.local`. Set 4× once and subsequent supported videos use 4×, even after closing Chrome. The controller starts at the video’s top-left with a small inset. Drag the speed indicator to reposition it by pixel, and the relative location is remembered across sites and window sizes. Controls collapse when the pointer leaves and the speed indicator fades. A speed deliberately chosen via a site's own player controls can become the new preference; player resets during video loading are ignored. Repeated conflicting forced speed changes are limited to avoid endless loops. Your old per-site speed is migrated on a best-effort basis.

## Controls

| Shortcut | Action |
| --- | --- |
| Q | 3× |
| E | 2.5× |
| D / S | Speed +0.1× / −0.1× (hold to change continuously) |
| R | 1× |
| Z / X | 10 seconds backward / forward |

The speed range is 0.1×–16×. Shortcuts are ignored while editing text or with Ctrl/Alt/Meta held. Some sites may use overlapping shortcuts. Some protected players, non-HTML5 media, closed-shadow-root players, or platforms that override playback speed may not be supported.

## Install locally

Download repository, open `chrome://extensions`, enable **Developer mode**, then choose **Load unpacked** and the directory containing `manifest.json`.

## Publishing

GitHub Actions manually checks store connection; pushing a tag matching `v` + `manifest.json` version packages the extension and submits it for Google review. See [Privacy Policy](PRIVACY_POLICY.md).
