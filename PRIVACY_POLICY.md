# Video Speed Privacy Policy

Last updated: October 30, 2026.

Video Speed adjusts HTML5 video playback locally in Chrome. The extension does not run a backend, collect analytics, sell data, or transmit watched-video information to its developer.

## Access to web pages

Video Speed injects a content script into eligible websites and frames to detect HTML5 video elements, display controls, and adjust playback speed. Some browser and protected pages cannot be controlled. The extension does not send page content, URLs, browsing history, or videos to its developer.

## Preferences stored locally

The extension saves a numeric playback-speed preference (such as 4) and, when the user moves the floating controller, its normalized on-video position (two values between 0 and 1) in Chrome's `chrome.storage.local`. These preferences persist across pages, sites, tabs, and browser restarts until changed, cleared, or the extension is uninstalled. To respect deliberate native player speed choices, the extension temporarily observes local input timing in memory; this timing is not stored or transmitted. The first use after upgrading may import an older preference from a website's `localStorage` if no new preference exists. This old value is only used to initialize the local preference.

## Sharing and control

Preferences are not transferred to the developer or third parties. Users can reset the speed or uninstall the extension to remove stored data. For questions contact uys.selim@gmail.com.
