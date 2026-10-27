# Video Speed 🎬

**Control HTML5 video playback speed and skip through videos with ease.**

Video Speed is a lightweight Chrome extension with an on-page playback controller, convenient keyboard shortcuts, and a simple popup for jumping forward or backward.

[![Install on Chrome](https://img.shields.io/badge/Install_on-Chrome_Web_Store-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/video-speed/cmjafmcaccbhfgcjnfldaahebnbbppje)

**[Get Video Speed from the Chrome Web Store](https://chromewebstore.google.com/detail/video-speed/cmjafmcaccbhfgcjnfldaahebnbbppje)** · [View source code](https://github.com/SelimUysal/video-speed)

## ✨ Features

- **Adjust playback speed:** Increase or decrease the speed in **0.1× steps**, reset to **1×**, or use keyboard presets.
- **Skip through videos:** Move **10 seconds backward or forward** using the on-page controls, keyboard, or extension popup.
- **On-page controls:** Hover over the playback speed indicator to show the control buttons.
- **Movable panel:** Drag the on-page controller to reposition it.
- **Remember your speed:** The extension stores the selected speed in your browser's local storage for subsequent video loads on the same website.

The source code starts with a default playback speed of **1.5×** when there is no previously saved speed for that website.

## 🚀 Install & Get Started

1. Open **[Video Speed on the Chrome Web Store](https://chromewebstore.google.com/detail/video-speed/cmjafmcaccbhfgcjnfldaahebnbbppje)**.
2. Select **Add to Chrome** and confirm the installation.
3. Open or refresh a webpage that contains an HTML5 video.
4. Find the playback speed indicator near the video. **Hover over it** to reveal the controls.
5. Use the buttons or keyboard shortcuts below to control playback.

**Tip:** You can also open the extension from Chrome's toolbar to jump backward or forward by 10 seconds.

## ⌨️ Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `D` | Increase speed by 0.1× |
| `S` | Decrease speed by 0.1× |
| `R` | Reset speed to 1× |
| `E` | Set speed to 2.5× |
| `Q` | Set speed to 3× |
| `Z` | Rewind 10 seconds |
| `X` | Forward 10 seconds |

Shortcuts work through the webpage while a supported video is detected. Because they are handled at page level, they may conflict with typing or other site shortcuts.

## 🎛️ On-Page Controls

| Control | Action |
| --- | --- |
| Back | Rewind 10 seconds |
| Forward | Skip ahead 10 seconds |
| − / + | Decrease / increase playback speed |
| Reset | Return to normal (1×) playback |
| Speed indicator | Displays the current playback speed |

## 🧩 Run from Source (Developers)

If you prefer to try the repository version locally:

1. Clone the repository or download its ZIP archive:

   ```bash
   git clone https://github.com/SelimUysal/video-speed.git
   ```
2. In Chrome, open `chrome://extensions`.
3. Turn on **Developer mode**.
4. Choose **Load unpacked** and select the `video-speed` repository folder.
5. Open a page with an HTML5 video (or refresh an existing tab).

The repository uses **JavaScript, HTML, CSS, and Chrome Extension Manifest V3**. No build step is required for the source files in this repository.

## ℹ️ Compatibility & Privacy

- The extension works by finding an HTML5 `<video>` element on a page. Compatibility can vary with websites, embedded players, and dynamically loaded video content.
- The current code targets the first video element it finds on a page.
- The extension injects a content script on websites and uses browser-local storage for playback preferences. Review the [Privacy Policy](PRIVACY_POLICY.md) for the project's published privacy statement.
- If the controls don't appear, try refreshing the video page after installing the extension.

---

Found an issue or have an idea? [Open a GitHub issue](https://github.com/SelimUysal/video-speed/issues).
