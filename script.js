let hasUserInteracted = false;

function initMedia() {
  console.log("initMedia called");
  const backgroundVideo = document.getElementById('background');
  if (!backgroundVideo) {
    console.error("Background video element not found");
    return;
  }
  // Startet mit dem Slider-Standardwert (0.3 / 30% Lautstärke)
  backgroundVideo.volume = 0.3;
  backgroundVideo.muted = false; 

  backgroundVideo.play().catch(err => {
    console.error("Failed to play background video:", err);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const startScreen = document.getElementById('start-screen');
  const startText = document.getElementById('start-text');
  const profileName = document.getElementById('profile-name');
  const profileBio = document.getElementById('profile-bio');
  const resultsButtonContainer = document.getElementById('results-button-container');
  const resultsButton = document.getElementById('results-theme');
  const volumeIcon = document.getElementById('volume-icon');
  const volumeSlider = document.getElementById('volume-slider');
  const transparencySlider = document.getElementById('transparency-slider');
  const backgroundVideo = document.getElementById('background');
  const profileBlock = document.getElementById('profile-block');
  const skillsBlock = document.getElementById('skills-block');
  const pythonBar = document.getElementById('python-bar');
  const cppBar = document.getElementById('cpp-bar');
  const csharpBar = document.getElementById('csharp-bar');

  const cursor = document.querySelector('.custom-cursor');
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  if (isTouchDevice) {
    document.body.classList.add('touch-device');
    document.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      cursor.style.left = touch.clientX + 'px';
      cursor.style.top = touch.clientY + 'px';
      cursor.style.display = 'block';
    });
    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      cursor.style.left = touch.clientX + 'px';
      cursor.style.top = touch.clientY + 'px';
      cursor.style.display = 'block';
    });
    document.addEventListener('touchend', () => {
      cursor.style.display = 'none'; 
    });
  } else {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      cursor.style.display = 'block';
    });
    document.addEventListener('mousedown', () => {
      cursor.style.transform = 'scale(0.8) translate(-50%, -50%)';
    });
    document.addEventListener('mouseup', () => {
      cursor.style.transform = 'scale(1) translate(-50%, -50%)';
    });
  }

  // Typewriter für den Start-Screen
  const startMessage = "click to enter";
  let startTextContent = '';
  let startIndex = 0;
  let startCursorVisible = true;

  function typeWriterStart() {
    if (startIndex < startMessage.length) {
      startTextContent = startMessage.slice(0, startIndex + 1);
      startIndex++;
      setTimeout(typeWriterStart, 100);
    }
  }
  typeWriterStart();

  setInterval(() => {
    startCursorVisible = !startCursorVisible;
    if(startText) {
      startText.textContent = startTextContent + (startCursorVisible ? '|' : ' ');
    }
  }, 500);

  // Bio-Text
  const bioText = "hi. wsp, just a dev building stuff and hanging out.";
  let bioIndex = 0;

  function typeWriterBio() {
    if (bioIndex < bioText.length) {
      profileBio.textContent += bioText.charAt(bioIndex);
      bioIndex++;
      setTimeout(typeWriterBio, 50);
    }
  }

  // Start-Screen Interaktion (Video-Audio entsperren & UI einblenden)
  startScreen.addEventListener('click', () => {
    hasUserInteracted = true;
    startScreen.classList.add('hidden');
    
    if (backgroundVideo) {
      backgroundVideo.muted = false;
      backgroundVideo.play().catch(e => console.log("Video audio play error:", e));
    }

    // Zeige Profile und Skills-Button an
    gsap.to(profileBlock, { opacity: 1, duration: 1 });
    resultsButtonContainer.classList.remove('hidden');
    
    // Starte Bio-Typwriter
    typeWriterBio();
  });

  // Skills-Ansicht umschalten
  let showingSkills = false;
  resultsButton.addEventListener('click', () => {
    showingSkills = !showingSkills;
    if (showingSkills) {
      gsap.to(profileBlock, { opacity: 0, duration: 0.3, onComplete: () => {
        profileBlock.classList.add('hidden');
        skillsBlock.classList.remove('hidden');
        gsap.to(skillsBlock, { opacity: 1, duration: 0.3 });
        pythonBar.style.width = '87%';
        cppBar.style.width = '75%';
        csharpBar.style.width = '80%';
      }});
      resultsButton.textContent = "View Profile";
    } else {
      gsap.to(skillsBlock, { opacity: 0, duration: 0.3, onComplete: () => {
        skillsBlock.classList.add('hidden');
        profileBlock.classList.remove('hidden');
        gsap.to(profileBlock, { opacity: 1, duration: 0.3 });
      }});
      resultsButton.textContent = "View Skills";
    }
  });

  // Volume-Slider Steuerung (regelt jetzt direkt das Video-Audio)
  if (volumeSlider && backgroundVideo) {
    volumeSlider.addEventListener('input', (e) => {
      const vol = e.target.value;
      backgroundVideo.volume = vol;
      if (vol > 0 && backgroundVideo.muted) {
        backgroundVideo.muted = false;
      }
    });
  }

  // Mute / Unmute per Klick auf das Volume-Icon
  if (volumeIcon && backgroundVideo) {
    volumeIcon.addEventListener('click', () => {
      backgroundVideo.muted = !backgroundVideo.muted;
      volumeIcon.style.opacity = backgroundVideo.muted ? '0.5' : '1';
    });
  }

  // Transparenz-Slider Steuerung
  if (transparencySlider) {
    transparencySlider.addEventListener('input', (e) => {
      const val = e.target.value;
      profileBlock.style.background = `rgba(0, 0, 0, ${val})`;
      skillsBlock.style.background = `rgba(0, 0, 0, ${val})`;
    });
  }
});
