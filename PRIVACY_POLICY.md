# Video Speed Privacy Policy

Last updated: October 30, 2026.

Video Speed adjusts HTML5 video playback locally in Chrome. The extension does not run a backend, collect analytics, sell data, or transmit watched-video information to its developer.

## Access to web pages

Video Speed injects a content script into eligible websites and frames to detect HTML5 video elements, display controls, and adjust playback speed. Some browser and protected pages cannot be controlled. The extension does not send page content, URLs, browsing history, or videos to its developer.

## Preferences stored locally

The extension saves a numeric playback-speed preference (0.1×–16×) and, when moved, a normalized controller position in Chrome's `chrome.storage.local`. These records are keyed by website hostname so settings for different websites remain independent; tabs of the same website intentionally share preferences. The browser may expose a parent website's hostname for embedded video players so that preferences can follow the containing page. Settings persist across browser restarts until changed, cleared, or the extension is uninstalled. Old global preferences are not automatically copied to every site. The extension temporarily observes local input timing to respect intentional native player-speed changes; this timing is neither stored nor transmitted. Website hostnames and preference values are not transmitted to the developer.

## Sharing and control

Preferences are not transferred to the developer or third parties. Users can reset the speed or uninstall the extension to remove stored data. For questions contact uys.selim@gmail.com.
