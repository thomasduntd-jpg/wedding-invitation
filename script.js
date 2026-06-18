document.addEventListener('DOMContentLoaded', function () {
  /* =========================================================
     ТАЙМЕР
  ========================================================= */
  const targetDate = new Date('2026-09-19T15:30:00');

  const tDays = document.getElementById('t-days');
  const tHours = document.getElementById('t-hours');
  const tMinutes = document.getElementById('t-minutes');
  const tSeconds = document.getElementById('t-seconds');

  function pad(n, len = 2) {
    return String(n).padStart(len, '0');
  }

  function updateTimer() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (tDays) tDays.textContent = '000';
      if (tHours) tHours.textContent = '00';
      if (tMinutes) tMinutes.textContent = '00';
      if (tSeconds) tSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (tDays) tDays.textContent = pad(days, 3);
    if (tHours) tHours.textContent = pad(hours);
    if (tMinutes) tMinutes.textContent = pad(minutes);
    if (tSeconds) tSeconds.textContent = pad(seconds);
  }

  updateTimer();
  setInterval(updateTimer, 1000);

  /* =========================================================
     TILT EFFECT ДЛЯ ФОТО В HERO
  ========================================================= */
  const heroPhotoFrame = document.querySelector('.hero-photo-frame');
  const heroSection = document.getElementById('hero');

  if (heroPhotoFrame && heroSection) {
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let isInteract = false;
    let inactivityTimer;

    const updateTilt = () => {
      // 1. Расчет наклона при скролле (от 0 до 1 высоты экрана)
      const scrollY = window.scrollY;
      const threshold = window.innerHeight;
      const scrollProgress = Math.min(scrollY / threshold, 1);
      
      // Наклон "на нас" при скролле вниз (от 0 до -15 градусов)
      const scrollTiltX = scrollProgress * -15; 

      // 2. Сглаживание движения мыши/тапа (Lerp)
      const lerpFactor = 0.08; // Коэффициент "вязкости" анимации
      currentMouseX += (targetMouseX - currentMouseX) * lerpFactor;
      currentMouseY += (targetMouseY - currentMouseY) * lerpFactor;

      // Если взаимодействия нет, плавно возвращаемся в 0
      if (!isInteract) {
        targetMouseX *= 0.9;
        targetMouseY *= 0.9;
      }

      const mouseTiltY = currentMouseY * -20; // Инверсия по вертикали
      const mouseTiltX = currentMouseX * 20;

      // Итоговая трансформация: сумма скролла и движения мыши с ограничением в 30 градусов
      let rotateX = scrollTiltX + mouseTiltY;
      let rotateY = mouseTiltX;

      rotateX = Math.max(-30, Math.min(30, rotateX));
      rotateY = Math.max(-30, Math.min(30, rotateY));

      const transformValue = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      heroPhotoFrame.style.setProperty('--current-transform', transformValue);
      heroPhotoFrame.style.transform = transformValue;
      
      requestAnimationFrame(updateTilt);
    };

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      heroPhotoFrame.classList.remove('heartbeat-effect');
      heroPhotoFrame.style.animation = ''; // Сброс анимации
      inactivityTimer = setTimeout(() => {
        heroPhotoFrame.classList.add('heartbeat-effect');
      }, 3000);
    };

    heroPhotoFrame.addEventListener('animationend', (e) => {
      // Этот блок можно оставить пустым или удалить, если нет других анимаций для отслеживания
    });

    // Desktop: Движение мыши по всей секции Hero
    heroSection.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 900) return;
      isInteract = true;
      resetInactivityTimer();
      const rect = heroPhotoFrame.getBoundingClientRect();
      // Центрируем координаты относительно фото (диапазон -1...1)
      targetMouseX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      targetMouseY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    });

    heroSection.addEventListener('mouseleave', () => {
      isInteract = false;
      targetMouseX = 0;
      targetMouseY = 0;
      resetInactivityTimer();
    });

    // Mobile: Наклон по клику/тапу
    heroSection.addEventListener('click', (e) => {
      if (window.innerWidth > 900) return;
      isInteract = true;
      resetInactivityTimer();
      const rect = heroPhotoFrame.getBoundingClientRect();
      targetMouseX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      targetMouseY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      
      // Мягкий возврат через паузу
      setTimeout(() => { isInteract = false; }, 1000);
    });

    requestAnimationFrame(updateTilt);
    resetInactivityTimer(); // Initial timer start
  }

  /* =========================================================
     HERO SECTION - HT ANIMATION
  ========================================================= */
  const heroPhotoImg = document.querySelector('.hero-photo');
  const heroComp = document.querySelector('.hero-composition');
  const heroSect = document.getElementById('hero');

  if (heroPhotoImg && heroComp && heroSect) {
    const htImages = [
      'images/ht-1.png',
      'images/ht-2.png',
      'images/ht-3.png',
      'images/ht-4.png',
      'images/ht-5.png',
      'images/ht-6.png',
      'images/ht-7.png',
    ];

    let htInterval = null;
    let htTimeout = null;
    const activeHts = new Set();
    let isHeroHovering = false;

    const generateHt = () => {
      if (activeHts.size > 15) return;

      const ht = document.createElement('img');
      ht.src = htImages[Math.floor(Math.random() * htImages.length)];
      ht.className = 'generated-ht';
      
      const size = Math.random() * 40 + 40;
      ht.style.width = `${size}px`;
      ht.style.height = 'auto';

      const wrapRect = heroComp.getBoundingClientRect();
      const startX = Math.random() * (wrapRect.width - size);
      const startY = Math.random() * (wrapRect.height - size);
      
      ht.style.left = `${startX}px`;
      ht.style.top = `${startY}px`;

      heroComp.appendChild(ht);
      activeHts.add(ht);

      void ht.offsetWidth;

      const moveX = (Math.random() - 0.5) * 400;
      const moveY = (Math.random() - 0.5) * 250;
      const scale = Math.random() * 0.4 + 0.8;

      ht.style.opacity = 1;
      ht.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;

      setTimeout(() => {
        ht.style.opacity = 0;
        ht.style.transform = `translate(${moveX + (Math.random() - 0.5) * 30}px, ${moveY + (Math.random() - 0.5) * 30}px) scale(${scale * 0.7})`;
        setTimeout(() => {
          ht.remove();
          activeHts.delete(ht);
        }, 500);
      }, 1500);
    };

    const startHtAnimation = () => {
      if (htInterval) return;
      htInterval = setInterval(generateHt, 200);
      htTimeout = setTimeout(() => {
        clearInterval(htInterval);
        htInterval = null;
      }, 10000);
    };

    const stopHtAnimation = () => {
      clearInterval(htInterval);
      clearTimeout(htTimeout);
      htInterval = null;
      htTimeout = null;

      activeHts.forEach(ht => {
        ht.style.opacity = 0;
        ht.style.transform += ` scale(0.5)`;
        setTimeout(() => { ht.remove(); activeHts.delete(ht); }, 500);
      });
    };

    heroPhotoImg.addEventListener('mouseenter', () => {
      isHeroHovering = true;
      startHtAnimation();
    });
    heroPhotoImg.addEventListener('mouseleave', () => {
      isHeroHovering = false;
      stopHtAnimation();
    });

    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          stopHtAnimation();
        } else if (isHeroHovering && !htInterval) {
          startHtAnimation();
        }
      });
    }, { threshold: 0.1 });

    heroObserver.observe(heroSect);
  }

  /* =========================================================
     WISHES SECTION - FLOWER ANIMATION
  ========================================================= */
  const wishesFlowers = document.querySelector('.wishes-flowers');
  const wishesDecorWrap = document.querySelector('.wishes-decor-wrap');
  const wishesSection = document.getElementById('wishes');

  if (wishesFlowers && wishesDecorWrap && wishesSection) {
    const flowerImages = [
      'images/fl-1.png',
      'images/fl-2.png',
      'images/fl-3.png',
      'images/fl-4.png',
      'images/fl-5.png',
      'images/fl-6.png',
      'images/fl-7.png',
    ];

    let generationInterval = null;
    let generationTimeout = null;
    const activeFlowers = new Set(); // To keep track of generated flowers
    let isHovering = false; // Flag to track mouse hover state

    const generateFlower = () => {
      if (activeFlowers.size > 15) return; // Limit the number of flowers to avoid clutter

      const flower = document.createElement('img');
      flower.src = flowerImages[Math.floor(Math.random() * flowerImages.length)];
      flower.className = 'generated-flower';
      
      // Random size between 40px and 80px
      const size = Math.random() * 40 + 40;
      flower.style.width = `${size}px`;
      flower.style.height = 'auto'; // Maintain aspect ratio

      // Random initial position within wishesDecorWrap
      const wrapRect = wishesDecorWrap.getBoundingClientRect();
      // Position relative to the wishesDecorWrap, considering its padding/border if any
      const startX = Math.random() * (wrapRect.width - size);
      const startY = Math.random() * (wrapRect.height - size);
      
      flower.style.left = `${startX}px`;
      flower.style.top = `${startY}px`;

      wishesDecorWrap.appendChild(flower);
      activeFlowers.add(flower);

      // Force reflow for transition to work
      void flower.offsetWidth;

      // Random target position for movement (relative to initial position)
      const moveX = (Math.random() - 0.5) * 400; // Увеличен разлет по горизонтали
      const moveY = (Math.random() - 0.5) * 250; // Увеличен разлет по вертикали
      const scale = Math.random() * 0.4 + 0.8; // Scale between 0.8 and 1.2

      flower.style.opacity = 1;
      flower.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;

      // Fade out and remove after 2 seconds
      setTimeout(() => {
        flower.style.opacity = 0;
        // Continue moving slightly while fading out
        flower.style.transform = `translate(${moveX + (Math.random() - 0.5) * 30}px, ${moveY + (Math.random() - 0.5) * 30}px) scale(${scale * 0.7})`;
        setTimeout(() => {
          flower.remove();
          activeFlowers.delete(flower);
        }, 500); // CSS transition is 0.5s for opacity
      }, 1500); // Start fading out after 1.5 seconds, total lifecycle 2s
    };

    const startFlowerAnimation = () => {
      if (generationInterval) return; // Already running
      generationInterval = setInterval(generateFlower, 200); // Generate a flower every 200ms
      generationTimeout = setTimeout(() => {
        clearInterval(generationInterval);
        generationInterval = null;
      }, 10000); // Stop generation after 10 seconds
    };

    const stopFlowerAnimation = () => {
      clearInterval(generationInterval);
      clearTimeout(generationTimeout);
      generationInterval = null;
      generationTimeout = null;

      activeFlowers.forEach(flower => {
        flower.style.opacity = 0;
        flower.style.transform += ` scale(0.5)`; // Shrink slightly while fading
        setTimeout(() => { flower.remove(); activeFlowers.delete(flower); }, 500);
      });
    };

    wishesFlowers.addEventListener('mouseenter', () => {
      isHovering = true;
      startFlowerAnimation();
    });
    wishesFlowers.addEventListener('mouseleave', () => {
      isHovering = false;
      stopFlowerAnimation(); // Stop generation and fade out all flowers immediately
    });

    // Intersection Observer for section visibility
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          stopFlowerAnimation();
        } else if (isHovering && !generationInterval) { // If section becomes visible and mouse is hovering, restart generation
          startFlowerAnimation();
        }
      });
    }, { threshold: 0 }); // Trigger as soon as the section enters the frame

    observer.observe(wishesSection);
  }

  /* =========================================================
     КАРУСЕЛИ
  ========================================================= */
  let activeGalleryImages = [];
  let lightboxIndex = 0;

  function createCarousel(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const prevBtn = carousel.querySelector('.carousel-btn-prev');
    const nextBtn = carousel.querySelector('.carousel-btn-next');
    const dotsWrap = carousel.querySelector('.carousel-dots');
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));

    let currentSlide = 0;
    const totalSlides = slides.length;

    const images = slides.map((slide) => {
      const img = slide.querySelector('img');
      return {
        src: img.src,
        alt: img.alt
      };
    });

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      if (index === 0) dot.classList.add('active');

      dot.addEventListener('click', function (e) {
        e.stopPropagation();
        goToSlide(index);
      });

      dotsWrap.appendChild(dot);
    });

    function getDots() {
      return Array.from(dotsWrap.querySelectorAll('.carousel-dot'));
    }

    function goToSlide(index) {
      currentSlide = (index + totalSlides) % totalSlides;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;

      getDots().forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goToSlide(currentSlide - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goToSlide(currentSlide + 1);
      });
    }

    let touchStartX = 0;

    track.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      const diffX = touchStartX - e.changedTouches[0].clientX;

      if (Math.abs(diffX) > 50) {
        goToSlide(diffX > 0 ? currentSlide + 1 : currentSlide - 1);
      }
    }, { passive: true });

    slides.forEach((slide, index) => {
      slide.addEventListener('click', function () {
        activeGalleryImages = images;
        openLightbox(index);
      });
    });
  }

  /* =========================================================
     ЛАЙТБОКС
  ========================================================= */
  const lightbox = document.getElementById('lightbox');
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lbMainImg = document.getElementById('lightbox-main-img');
  const lbThumbs = document.getElementById('lightbox-thumbnails');
  const lbClose = document.getElementById('lightbox-close');
  const lbPrev = document.getElementById('lightbox-prev');
  const lbNext = document.getElementById('lightbox-next');

  function openLightbox(index) {
    if (!lightbox || !lightboxOverlay) return;

    lbThumbs.innerHTML = '';

    activeGalleryImages.forEach((imgData, i) => {
      const thumb = document.createElement('img');
      thumb.src = imgData.src;
      thumb.alt = imgData.alt;
      thumb.className = 'lightbox-thumb';
      thumb.addEventListener('click', function () {
        showLightboxImage(i);
      });
      lbThumbs.appendChild(thumb);
    });

    lightbox.classList.add('active');
    lightboxOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    showLightboxImage(index);
  }

  function closeLightbox() {
    if (!lightbox || !lightboxOverlay) return;
    lightbox.classList.remove('active');
    lightboxOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showLightboxImage(index) {
    lightboxIndex = (index + activeGalleryImages.length) % activeGalleryImages.length;
    const data = activeGalleryImages[lightboxIndex];

    lbMainImg.src = data.src;
    lbMainImg.alt = data.alt;

    const thumbs = lbThumbs.querySelectorAll('.lightbox-thumb');
    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === lightboxIndex);
    });
  }

  if (lbClose) {
    lbClose.addEventListener('click', closeLightbox);
  }

  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', closeLightbox);
  }

  if (lbPrev) {
    lbPrev.addEventListener('click', function () {
      showLightboxImage(lightboxIndex - 1);
    });
  }

  if (lbNext) {
    lbNext.addEventListener('click', function () {
      showLightboxImage(lightboxIndex + 1);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxImage(lightboxIndex - 1);
    if (e.key === 'ArrowRight') showLightboxImage(lightboxIndex + 1);
  });

  createCarousel('carousel-left');
  createCarousel('carousel-right');

  /* =========================================================
     ФОРМА
  ========================================================= */
  const FORM_URL = 'https://script.google.com/macros/s/AKfycbzGpi0tGNgTuhfI7I3taCnVDHh5oGS5f-2j66RJi2vZzs0pEWgBKUsr7sTnWbA1D7nq/exec';

  const surveyForm = document.getElementById('survey-form');
  const submitBtn = document.getElementById('submit-btn');
  const formSuccess = document.getElementById('form-success');
  const formError = document.getElementById('form-error');

  if (surveyForm) {
    surveyForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const fullName = document.getElementById('full-name').value.trim();
      const attendance = surveyForm.querySelector('input[name="attendance"]:checked');
      const nameInput = document.getElementById('full-name');
      const question = surveyForm.querySelector('.form-question');

      if (!fullName) {
        nameInput.style.borderBottomColor = '#c0392b';
        nameInput.focus();
        nameInput.addEventListener('input', function () {
          nameInput.style.borderBottomColor = '';
        }, { once: true });
        return;
      }

      const nameParts = fullName.split(/\s+/).filter(function (word) {
        return word.length > 0;
      });

      if (nameParts.length < 2) {
        alert('Введите имя и фамилию');
        nameInput.style.borderBottomColor = '#c0392b';
        nameInput.focus();
        nameInput.addEventListener('input', function () {
          nameInput.style.borderBottomColor = '';
        }, { once: true });
        return;
      }

      if (!attendance) {
        if (question) {
          question.style.color = '#c0392b';
          setTimeout(function () {
            question.style.color = '';
          }, 2000);
        }
        return;
      }

      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Отправляем...';
        submitBtn.disabled = true;
      }

      if (formSuccess) formSuccess.classList.remove('visible');
      if (formError) formError.classList.remove('visible');

      const fd = new FormData();
      fd.append('fullName', fullName);
      fd.append('attendance', attendance.value);

      fetch(FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: fd
      })
        .then(function () {
          if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Отправить';
            submitBtn.disabled = false;
          }

          if (formSuccess) formSuccess.classList.add('visible');

          nameInput.value = '';
          const checked = surveyForm.querySelector('input[name="attendance"]:checked');
          if (checked) checked.checked = false;

          setTimeout(function () {
            if (formSuccess) formSuccess.classList.remove('visible');
          }, 5000);
        })
        .catch(function () {
          if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Отправить';
            submitBtn.disabled = false;
          }

          if (formError) formError.classList.add('visible');
        });
    });
  }
});