# Video Speed

A lightweight Chrome browser extension for controlling video playback directly from a popup or page controls.

## Features
- Quick navigation backward and forward in videos
- Playback controls implemented in JavaScript
- Chrome Extension **Manifest V3**

## Installation (developer mode)
1. Download or clone this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Select **Load unpacked** and choose this repository's folder.
5. Open a webpage containing an HTML5 video and try the extension.

## Project structure
- `manifest.json` — extension configuration
- `content.js` — page-level video interactions
- `popup.html` and `popup.js` — popup user interface
- `styles.css` — interface styles

## Notes
This is a personal software project. Features may work differently depending on the website or video player. The extension requests access to web pages through its content script; review permissions before installing.

See [Privacy Policy](PRIVACY_POLICY.md).
