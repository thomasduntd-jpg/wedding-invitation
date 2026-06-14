/* ============================================================
   script.js
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------------------------
     1. HEADER LOGO — раздвигает кнопки при скролле
  ---------------------------------------------------------- */
  const headerLogoWrap = document.getElementById('header-logo-wrap');
  const heroSection    = document.getElementById('hero');

  function onScroll() {
    if (!heroSection || !headerLogoWrap) return;
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    if (heroBottom <= 80) {
      headerLogoWrap.classList.add('visible');
    } else {
      headerLogoWrap.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ----------------------------------------------------------
     2. 3D ЭФФЕКТ ФОТО
  ---------------------------------------------------------- */
  const photo3d = document.getElementById('photo3d');

  if (photo3d) {
    photo3d.addEventListener('mousemove', function (e) {
      const rect   = photo3d.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width  - 0.5;
      const y      = (e.clientY - rect.top)  / rect.height - 0.5;
      const rotateY =  x * 18;
      const rotateX = -y * 14;
      photo3d.style.transform =
        `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`;
    });

    photo3d.addEventListener('mouseleave', function () {
      photo3d.style.transform =
        'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    });

    photo3d.addEventListener('touchmove', function (e) {
      if (!e.touches[0]) return;
      const rect  = photo3d.getBoundingClientRect();
      const touch = e.touches[0];
      const x = (touch.clientX - rect.left) / rect.width  - 0.5;
      const y = (touch.clientY - rect.top)  / rect.height - 0.5;
      photo3d.style.transform =
        `perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 12}deg) scale3d(1.02,1.02,1.02)`;
    }, { passive: true });

    photo3d.addEventListener('touchend', function () {
      photo3d.style.transform =
        'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    });
  }


  /* ----------------------------------------------------------
     3. СМЕНЯЮЩИЙСЯ PNG — каждые 0.2 секунды ✅
  ---------------------------------------------------------- */
  const decorationImg  = document.getElementById('decoration-img');
  const decorationSrcs = [
    'images/decoration-1.png',
    'images/decoration-2.png',
    'images/decoration-3.png'
  ];
  let decorationIndex = 0;

  if (decorationImg) {
    setInterval(function () {

      /* Быстрый fade-out */
      decorationImg.classList.add('fade-out');

      setTimeout(function () {
        decorationIndex = (decorationIndex + 1) % decorationSrcs.length;
        decorationImg.src = decorationSrcs[decorationIndex];

        decorationImg.onload = function () {
          decorationImg.classList.remove('fade-out');
        };

        /* Если картинка уже в кэше */
        if (decorationImg.complete) {
          decorationImg.classList.remove('fade-out');
        }

      }, 200); /* задержка = время transition */

    }, 200); /* ✅ сменяется каждые 0.2 секунды */
  }


  /* ----------------------------------------------------------
     4. ТАЙМЕР
  ---------------------------------------------------------- */
  const targetDate = new Date('2026-09-19T15:30:00');

  const tDays    = document.getElementById('t-days');
  const tHours   = document.getElementById('t-hours');
  const tMinutes = document.getElementById('t-minutes');
  const tSeconds = document.getElementById('t-seconds');

  function pad(n, len) {
    return String(n).padStart(len || 2, '0');
  }

  function updateTimer() {
    const now  = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (tDays)    tDays.textContent    = '000';
      if (tHours)   tHours.textContent   = '00';
      if (tMinutes) tMinutes.textContent = '00';
      if (tSeconds) tSeconds.textContent = '00';
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (tDays)    tDays.textContent    = pad(days, 3);
    if (tHours)   tHours.textContent   = pad(hours);
    if (tMinutes) tMinutes.textContent = pad(minutes);
    if (tSeconds) tSeconds.textContent = pad(seconds);
  }

  updateTimer();
  setInterval(updateTimer, 1000);


  /* ----------------------------------------------------------
     5. КАРУСЕЛЬ
  ---------------------------------------------------------- */
  const carouselTrack = document.getElementById('carousel-track');
  const btnPrev       = document.getElementById('carousel-prev');
  const btnNext       = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');

  const slides      = carouselTrack
    ? Array.from(carouselTrack.querySelectorAll('.carousel-slide'))
    : [];
  let currentSlide  = 0;
  const totalSlides = slides.length;

  if (dotsContainer && totalSlides > 0) {
    slides.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', 'Слайд ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function () { goToSlide(i); });
      dotsContainer.appendChild(dot);
    });
  }

  function getDots() {
    return dotsContainer
      ? Array.from(dotsContainer.querySelectorAll('.carousel-dot'))
      : [];
  }

  function goToSlide(index) {
    if (!carouselTrack) return;
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;
    carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    getDots().forEach(function (dot, i) {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  if (btnPrev) btnPrev.addEventListener('click', function () { goToSlide(currentSlide - 1); });
  if (btnNext) btnNext.addEventListener('click', function () { goToSlide(currentSlide + 1); });

  /* Свайп на мобильном */
  if (carouselTrack) {
    let touchStartX = 0;

    carouselTrack.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    carouselTrack.addEventListener('touchend', function (e) {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
      }
    }, { passive: true });
  }

  /* Клик по слайду → лайтбокс */
  slides.forEach(function (slide, i) {
    slide.addEventListener('click', function () { openLightbox(i); });
  });


  /* ----------------------------------------------------------
     6. ЛАЙТБОКС
  ---------------------------------------------------------- */
  const lightbox        = document.getElementById('lightbox');
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxMainImg = document.getElementById('lightbox-main-img');
  const lightboxClose   = document.getElementById('lightbox-close');
  const lightboxPrev    = document.getElementById('lightbox-prev');
  const lightboxNext    = document.getElementById('lightbox-next');
  const lightboxThumbs  = document.getElementById('lightbox-thumbnails');

  let lightboxIndex = 0;

  const carouselImages = slides.map(function (slide) {
    const img = slide.querySelector('img');
    return { src: img ? img.src : '', alt: img ? img.alt : '' };
  });

  if (lightboxThumbs && carouselImages.length > 0) {
    carouselImages.forEach(function (item, i) {
      const thumb = document.createElement('img');
      thumb.src   = item.src;
      thumb.alt   = item.alt;
      thumb.classList.add('lightbox-thumb');
      if (i === 0) thumb.classList.add('active');
      thumb.addEventListener('click', function () { showLightboxImage(i); });
      lightboxThumbs.appendChild(thumb);
    });
  }

  function getThumbs() {
    return lightboxThumbs
      ? Array.from(lightboxThumbs.querySelectorAll('.lightbox-thumb'))
      : [];
  }

  function showLightboxImage(index) {
    if (index < 0) index = carouselImages.length - 1;
    if (index >= carouselImages.length) index = 0;
    lightboxIndex = index;

    if (lightboxMainImg && carouselImages[index]) {
      lightboxMainImg.src = carouselImages[index].src;
      lightboxMainImg.alt = carouselImages[index].alt;
    }

    getThumbs().forEach(function (t, i) {
      t.classList.toggle('active', i === lightboxIndex);
    });

    const activeTh = getThumbs()[lightboxIndex];
    if (activeTh && lightboxThumbs) {
      activeTh.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  function openLightbox(index) {
    if (!lightbox || !lightboxOverlay) return;
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

  if (lightboxClose)   lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
  if (lightboxPrev)    lightboxPrev.addEventListener('click', function () { showLightboxImage(lightboxIndex - 1); });
  if (lightboxNext)    lightboxNext.addEventListener('click', function () { showLightboxImage(lightboxIndex + 1); });

  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowLeft')  showLightboxImage(lightboxIndex - 1);
    if (e.key === 'ArrowRight') showLightboxImage(lightboxIndex + 1);
    if (e.key === 'Escape')     closeLightbox();
  });

  if (lightbox) {
    let lbTouchStart = 0;
    lightbox.addEventListener('touchstart', function (e) {
      lbTouchStart = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      const diff = lbTouchStart - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        showLightboxImage(diff > 0 ? lightboxIndex + 1 : lightboxIndex - 1);
      }
    }, { passive: true });
  }


  /* ----------------------------------------------------------
     7. ФОРМА — Google Sheets
     Вставь свою ссылку из Apps Script в FORM_URL
  ---------------------------------------------------------- */
  var FORM_URL    = 'https://script.google.com/macros/s/AKfycbx5OrpWhGt0xhQ8KEZZT3MmgjYhueVi4bBUuJLsAN-eWwbYtxuXuUnJHDzAXOkc1ahT/exec';

  var surveyForm  = document.getElementById('survey-form');
  var submitBtn   = document.getElementById('submit-btn');
  var formSuccess = document.getElementById('form-success');
  var formError   = document.getElementById('form-error');

  if (surveyForm) {
    surveyForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var fullName   = document.getElementById('full-name').value.trim();
      var attendance = surveyForm.querySelector('input[name="attendance"]:checked');
      var nameInput  = document.getElementById('full-name');
      var question   = surveyForm.querySelector('.form-question');

      /* Валидация имени */
      if (!fullName) {
        nameInput.style.borderBottomColor = '#c0392b';
        nameInput.focus();
        return;
      }

      /* Валидация выбора */
      if (!attendance) {
        if (question) {
          question.style.color = '#c0392b';
          setTimeout(function () { question.style.color = ''; }, 2000);
        }
        return;
      }

      /* Загрузка */
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Отправляем...';
        submitBtn.disabled = true;
      }
      if (formSuccess) formSuccess.classList.remove('visible');
      if (formError)   formError.classList.remove('visible');

      /* Отправляем как FormData (без заголовков) → без префлайта */
      var fd = new FormData();
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

        /* Сброс формы */
        nameInput.value = '';
        var checked = surveyForm.querySelector('input[name="attendance"]:checked');
        if (checked) checked.checked = false;

        setTimeout(function () {
          if (formSuccess) formSuccess.classList.remove('visible');
        }, 6000);
      })
      .catch(function (err) {
        console.error('Ошибка:', err);
        if (submitBtn) {
          submitBtn.classList.remove('loading');
          submitBtn.textContent = 'Отправить';
          submitBtn.disabled = false;
        }
        if (formError) formError.classList.add('visible');
      });

      /* Сброс красной подсветки при вводе */
      if (nameInput) {
        nameInput.addEventListener('input', function () {
          nameInput.style.borderBottomColor = '';
        }, { once: true });
      }
    });
  }

}); /* конец DOMContentLoaded */