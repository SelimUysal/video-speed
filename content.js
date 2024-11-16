// content.js
/*
 */
// videoRef'i bir DOM düğümüne referans olarak ayarlayın
let videoRef = null;
let playbackRate = 1.5; 
const checkForVideo = setInterval(() => {
  videoRef = document.querySelector('video');

  if (videoRef) {
    clearInterval(checkForVideo);

    // Başlangıç hızını localStorage'dan oku ve video hızını ayarla
    const storedRate = localStorage.getItem('playbackRate');
    if (storedRate) {
      playbackRate = parseFloat(storedRate);
    } else {
      playbackRate = 1.5; 
    }

    // Video hızını ayarla ve göster
    videoRef.playbackRate = playbackRate; // Video hızını ayarlıyoruz
    playbackRateDisplay.textContent = playbackRate.toFixed(2); // Ekranda gösterim

    // Kontrol panelini video elementinin hemen sonrasına ekle
    videoRef.insertAdjacentElement('afterend', controlFrame);
  }
}, 1000);

// Kontrol panelini gösterip gizlemek için bir değişken
let showControls = false;

// Sürükleme işlemi için değişkenler
let isDragging = false;
let offset = { x: 0, y: 0 };
let draggedButton = null; // Sürüklenecek butonu takip etmek için
let position = { x: 35, y: 35 }; // Çerçevenin başlangıç konumu

// Kontrol panelini oluşturma
const controlFrame = document.createElement('div');
controlFrame.id = 'control-frame';
controlFrame.classList.add('control-frame');
controlFrame.style.position = 'absolute'; 
controlFrame.style.top = '55px'; 
controlFrame.style.left = '35px';
controlFrame.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; 
controlFrame.style.padding = '5px'; 
controlFrame.style.borderRadius = '10px'; 
controlFrame.style.display = 'flex';
controlFrame.style.alignItems = 'center';
controlFrame.style.zIndex = '9999'; 

// Fare kontrol panelinin üzerinden geçtiğinde opasiteyi artır
controlFrame.addEventListener('mouseenter', () => {
  controlFrame.style.opacity = '1.0'; 
});

// Fare kontrol panelinin üzerinden çıktığında opasiteyi azalt
controlFrame.addEventListener('mouseleave', () => {
  controlFrame.style.opacity = '0.4'; 
});

// Oynatma hızını gösteren metin elemanı
const playbackRateDisplay = document.createElement('div');
playbackRateDisplay.classList.add('playback-rate');
playbackRateDisplay.textContent = playbackRate.toFixed(2);
controlFrame.appendChild(playbackRateDisplay);

// Oynatma hızı metnine fare üzerindeyken gölge eklemek için olay dinleyicileri
playbackRateDisplay.addEventListener('mouseenter', () => {
  playbackRateDisplay.style.textShadow = '0 0 5px red'; 
});

playbackRateDisplay.addEventListener('mouseleave', () => {
  playbackRateDisplay.style.textShadow = ''; 
});

// Butonları içeren bir div
const buttonsContainer = document.createElement('div');
buttonsContainer.classList.add('buttons');
buttonsContainer.style.display = 'none'; 
controlFrame.appendChild(buttonsContainer);

// Geri alma butonu
const rewindButton = document.createElement('button');
rewindButton.classList.add('button', 'backward');
rewindButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>'; 
rewindButton.addEventListener('click', (e) => {
  e.stopPropagation(); // Olayın yukarı yayılmasını engeller
  rewind(10) 
});
buttonsContainer.appendChild(rewindButton);

// İleri alma butonu
const forwardButton = document.createElement('button');
forwardButton.classList.add('button', 'forward');
forwardButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>'; 
forwardButton.addEventListener('click', (e) => {
  e.stopPropagation(); // Olayın yukarı yayılmasını engeller
  forward(10);
});
buttonsContainer.appendChild(forwardButton);

// Hızı azaltma butonu
const decreaseSpeedButton = document.createElement('button');
decreaseSpeedButton.classList.add('button', 'minus');
decreaseSpeedButton.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" d="M19 13H5v-2h14v2z"/>
  </svg>
`;

decreaseSpeedButton.addEventListener('click', (event) => {
  event.stopPropagation(); // Olayın yukarı yayılmasını engeller
  updatePlaybackRate(playbackRate - 0.1); // Hızı azaltır
});

buttonsContainer.appendChild(decreaseSpeedButton);

// Hızı artırma butonu
const increaseSpeedButton = document.createElement('button');
increaseSpeedButton.classList.add('button', 'plus');
increaseSpeedButton.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" d="M19 13H13v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
`; 

increaseSpeedButton.addEventListener('click', (event) => {
  event.stopPropagation(); // Olayın yukarı yayılmasını engeller
  updatePlaybackRate(playbackRate + 0.1); // Hızı artırır
});

buttonsContainer.appendChild(increaseSpeedButton);

// Hızı sıfırlama butonu
const resetSpeedButton = document.createElement('button');
resetSpeedButton.classList.add('button', 'reset');
// Yeni ikon (refresh ikonu)
resetSpeedButton.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" d="M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 1 0 8 8h-2a6 6 0 1 1-6-6c1.48 0 2.83.54 3.88 1.42L13 11h7V4l-2.35 2.35z"/>
  </svg>
`; 
resetSpeedButton.addEventListener('click', (event) => {
  event.stopPropagation(); // Olayın yukarı yayılmasını engeller
  updatePlaybackRate(1); // Hızı 1.0'a sıfırlar
});

buttonsContainer.appendChild(resetSpeedButton);

// Butonların stilini ayarla
const buttons = buttonsContainer.querySelectorAll('button');
buttons.forEach(button => {
  button.style.backgroundColor = '#777'; 
  button.style.border = 'none'; 
  button.style.borderRadius = '50%'; 
  button.style.color = 'white'; 
  button.style.fontSize = '14px'; 
  button.style.padding = '5px'; 
  button.style.margin = '0 3px'; 
  button.style.width = '30px'; 
  button.style.height = '25px'; 
  button.style.display = 'flex'; 
  button.style.justifyContent = 'center'; 
  button.style.alignItems = 'center'; 

  button.addEventListener('mouseenter', () => {
    button.style.backgroundColor = '#b16d54'; // Turuncu renk
  });

  // Butonun üzerinden ayrıldığında renk eski haline dönsün
  button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = '#777'; // Eski renk
  });

});

// Oynatma hızını gösteren metin elemanının stilini ayarla
playbackRateDisplay.style.backgroundColor = '#333'; 
playbackRateDisplay.style.color = '#ffffff'; 
playbackRateDisplay.style.padding = '5px 10px'; 
playbackRateDisplay.style.borderRadius = '9px'; 
playbackRateDisplay.style.marginRight = '5px'; 

// Video üzerine gelindiğinde kontrol panelini göster
controlFrame.addEventListener('mouseenter', () => {
  showControls = true;
  buttonsContainer.style.display = 'flex'; 
});

// Kontrol panelinden ayrıldığında gizle
controlFrame.addEventListener('mouseleave', () => {
  showControls = false;
  buttonsContainer.style.display = 'none'; 
});

// Sürükleme olaylarını yönetme
buttons.forEach(button => {
  button.addEventListener('mousedown', handleMouseDownButtons);
  button.addEventListener('mouseup', handleMouseUpButtons);
});



// Sürükleme esnasında konumu güncelleme
document.addEventListener('mousemove', handleMouseMoveButtons);
function handleMouseMoveButtons(e) {
  if (isDragging) {
    let newX = e.clientX - offset.x;
    let newY = e.clientY - offset.y;

    // Sınır kontrolü (gerekirse ekleyin)
    const videoRect = videoRef.getBoundingClientRect(); // Videonun sınırlarını al
    
    // Butonun sağ kenarını videonun sağ kenarından uzak tut
    if (newX + draggedButton.offsetWidth > videoRect.right) {
      newX = videoRect.right - draggedButton.offsetWidth;
    }

    // Butonun sol kenarını videonun sol kenarından uzak tut
    if (newX < videoRect.left) {
      newX = videoRect.left;
    }

    // Butonun alt kenarını videonun alt kenarından uzak tut
    if (newY + draggedButton.offsetHeight > videoRect.bottom) {
      newY = videoRect.bottom - draggedButton.offsetHeight;
    }

    // Butonun üst kenarını videonun üst kenarından uzak tut
    if (newY < videoRect.top) {
      newY = videoRect.top;
    }

    draggedButton.style.left = `${newX}px`;
    draggedButton.style.top = `${newY}px`;
  }
}




// Sürüklemeyi başlatma
function handleMouseDownButtons(e) {
  isDragging = true;
  draggedButton = e.target; 
  offset = {
    x: e.clientX - draggedButton.offsetLeft,
    y: e.clientY - draggedButton.offsetTop,
  };
}

// Mouse aşağıdayken sürüklemeyi başlat
controlFrame.addEventListener('mousedown', (e) => {
  isDragging = true;
  // Fare ve çerçevenin pozisyonları arasındaki farkı hesapla
  offset = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
  };
  e.preventDefault(); // Seçim olaylarını engelle
});

// Mouse hareket ederken çerçevenin pozisyonunu güncelle
document.addEventListener('mousemove', (e) => {
  if (isDragging) {
      // Yeni pozisyonu hesapla
      position = {
          x: e.clientX - offset.x,
          y: e.clientY - offset.y,
      };
      // Çerçevenin stilini güncelle
      controlFrame.style.left = `${position.x}px`;
      controlFrame.style.top = `${position.y}px`;
  }
});

// Mouse tuşu bırakıldığında sürüklemeyi sonlandır
document.addEventListener('mouseup', () => {
  isDragging = false; // Sürükleme sona erdi
});


// Sürüklemeyi sonlandırma
function handleMouseUpButtons() {
  isDragging = false;
}



function updatePlaybackRate(rate) {
  const newRate = Math.max(0.1, Math.min(16, rate));
  playbackRate = newRate;
  videoRef.playbackRate = newRate;
  playbackRateDisplay.textContent = newRate.toFixed(2); 
  localStorage.setItem('playbackRate', newRate.toString());
}


// Geri alma fonksiyonu
function rewind(seconds) {
  videoRef.currentTime -= seconds;
}

// İleri alma fonksiyonu
function forward(seconds) {
  videoRef.currentTime += seconds;
}

// Klavye kısayollarını yönetme
document.addEventListener('keydown', handleKeyDown);

// Klavye kısayolları
function handleKeyDown(event) {
  if (videoRef) {
    let newRate;
    switch (event.keyCode) {
      case 90: // 'z' tuşu
        videoRef.currentTime -= 10;
        break;

      case 88: // 'x' tuşu
        videoRef.currentTime += 10;
        break;

      case 68: // 'd' tuşu
        if (videoRef.playbackRate < 16) {
          newRate = Math.min(videoRef.playbackRate + 0.1, 16);
          updatePlaybackRate(newRate);
        }
        break;

      case 83: // 's' tuşu
        if (videoRef.playbackRate >= 0.1) {
          newRate = Math.max(videoRef.playbackRate - 0.1, 0.1);
          updatePlaybackRate(newRate);
        }
        break;

      case 82: // 'r' tuşu
        videoRef.playbackRate = 1;
        updatePlaybackRate(1);
        break;

      case 69: // 'e' tuşu
        videoRef.playbackRate = 2.5;
        updatePlaybackRate(2.5);
        break;

      case 81: // 'q' tuşu
        videoRef.playbackRate = 3;
        updatePlaybackRate(3);
        break;

      default:
        break;
    }
  }
}

// Mesaj dinleyicisi
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "increaseSpeed") {
    updatePlaybackRate(request.playbackRate); // Hızı artır
  } else if (request.action === "decreaseSpeed") {
    updatePlaybackRate(request.playbackRate); // Hızı azalt
  } else if (request.action === "rewind") {
    rewind(10); // 10 saniye geri sar
  } else if (request.action === "forward") {
    forward(10); // 10 saniye ileri sar
  }
});