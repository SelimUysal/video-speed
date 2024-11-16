// popup.js 
/*
// Başlangıçta localStorage'den hız okuma
let currentPlaybackRate = localStorage.getItem('playbackRate') ? parseFloat(localStorage.getItem('playbackRate')) : 1.0;
document.getElementById("speedDisplay").textContent = currentPlaybackRate.toFixed(2) + "x";

// Mesaj dinleyicisi
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateSpeed") {
    currentPlaybackRate = request.playbackRate; // Alınan hız değerini currentPlaybackRate'e kaydet
    document.getElementById("speedDisplay").textContent = currentPlaybackRate.toFixed(2) + "x";
  }
});

// Hız artırma
document.getElementById("increaseSpeed").addEventListener("click", () => {
  currentPlaybackRate += 0.1;
  document.getElementById("speedDisplay").textContent = currentPlaybackRate.toFixed(2) + "x";

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "increaseSpeed", playbackRate: currentPlaybackRate });
  });
});

// Hız azaltma
document.getElementById("decreaseSpeed").addEventListener("click", () => {
  currentPlaybackRate -= 0.1;
  document.getElementById("speedDisplay").textContent = currentPlaybackRate.toFixed(2) + "x";

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "decreaseSpeed", playbackRate: currentPlaybackRate });
  });
});
*/
// Geri alma
document.getElementById("rewind").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "rewind" });
  });
});

// İleri alma
document.getElementById("forward").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "forward" });
  });
});
