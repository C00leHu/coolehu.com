let hasUserInteracted = false;

document.addEventListener('DOMContentLoaded', () => {
  const startScreen = document.getElementById('start-screen');
  const startText = document.getElementById('start-text');
  const profileBio = document.getElementById('profile-bio');
  const resultsButtonContainer = document.getElementById('results-button-container');
  const resultsButton = document.getElementById('results-theme');
  const volumeSlider = document.getElementById('volume-slider');
  const transparencySlider = document.getElementById('transparency-slider');
  const backgroundVideo = document.getElementById('background');
  const profileBlock = document.getElementById('profile-block');
  const skillsBlock = document.getElementById('skills-block');
  const pythonBar = document.getElementById('python-bar');
  const cppBar = document.getElementById('cpp-bar');
  const csharpBar = document.getElementById('csharp-bar');
  const volumeControl = document.querySelector('.volume-control');

  // Use the local SVG background unless a real background video can play.
  if (backgroundVideo) {
    backgroundVideo.addEventListener('playing', () => {
      backgroundVideo.classList.add('is-playing');
    });
    backgroundVideo.addEventListener('error', () => {
      if (volumeControl) volumeControl.classList.add('hidden');
    });
    if (backgroundVideo.error && volumeControl) {
      volumeControl.classList.add('hidden');
    }
    backgroundVideo.play().catch(err => console.log("Video autoplay prevented:", err));
  }

  const cursor = document.querySelector('.custom-cursor');
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  if (!isTouchDevice) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      cursor.style.display = 'block';
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
    if (startText) {
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

  // Start-Screen Klick: Schaltet den Ton des Videos frei & blendet UI ein
  startScreen.addEventListener('click', () => {
    hasUserInteracted = true;
    startScreen.classList.add('hidden');
    
    if (backgroundVideo) {
      backgroundVideo.muted = false; // Ton einschalten nach Klick
      backgroundVideo.volume = volumeSlider ? volumeSlider.value : 0.3;
      backgroundVideo.play().catch(e => console.log("Video audio error:", e));
    }

    gsap.to(profileBlock, { opacity: 1, duration: 1 });
    resultsButtonContainer.classList.remove('hidden');
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

  // Lautstärke über den Slider steuern
  if (volumeSlider && backgroundVideo) {
    volumeSlider.addEventListener('input', (e) => {
      backgroundVideo.volume = e.target.value;
      if (e.target.value > 0 && backgroundVideo.muted) {
        backgroundVideo.muted = false;
      }
    });
  }

  // Transparenz-Slider
  if (transparencySlider) {
    transparencySlider.addEventListener('input', (e) => {
      const val = e.target.value;
      profileBlock.style.background = `rgba(0, 0, 0, ${val})`;
      skillsBlock.style.background = `rgba(0, 0, 0, ${val})`;
    });
  }
});
