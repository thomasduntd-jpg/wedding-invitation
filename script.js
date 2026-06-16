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