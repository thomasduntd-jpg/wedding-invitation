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
  let activeGalleryImages = []; // Ссылка на массив картинок текущей открытой галереи
  let lightboxIndex = 0;

  function createCarousel(carouselElementId) {
    const carouselElement = document.getElementById(carouselElementId);
    if (!carouselElement) return;
  
    const carouselTrack = carouselElement.querySelector('.carousel-track');
    const btnPrev       = carouselElement.querySelector('.carousel-btn-prev');
    const btnNext       = carouselElement.querySelector('.carousel-btn-next');
    const dotsContainer = carouselElement.querySelector('.carousel-dots');
    const slides        = Array.from(carouselTrack.querySelectorAll('.carousel-slide'));
    
    let currentSlide  = 0;
    const totalSlides = slides.length;

    // Собираем данные об изображениях этой конкретной карусели
    const images = slides.map(slide => {
      const img = slide.querySelector('img');
      return { src: img.src, alt: img.alt };
    });
  
    // Точки
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(i);
      });
      dotsContainer.appendChild(dot);
    });
  
    function getDots() {
      return Array.from(dotsContainer.querySelectorAll('.carousel-dot'));
    }
  
    function goToSlide(index) {
      currentSlide = (index + totalSlides) % totalSlides;
      carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      getDots().forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }
  
    if (btnPrev) btnPrev.addEventListener('click', function () { goToSlide(currentSlide - 1); });
    if (btnNext) btnNext.addEventListener('click', function () { goToSlide(currentSlide + 1); });
  
    // Свайп
    let touchStartX = 0;
    carouselTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    carouselTrack.addEventListener('touchend', (e) => {
      const diffX = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diffX) > 50) {
        goToSlide(diffX > 0 ? currentSlide + 1 : currentSlide - 1);
      }
    }, { passive: true });

    // Клик по слайду -> Открыть лайтбокс с контекстом этой карусели
    slides.forEach((slide, i) => {
      slide.addEventListener('click', () => {
        activeGalleryImages = images;
        openLightbox(i);
      });
    });
  }

  /* ----------------------------------------------------------
     6. ЛАЙТБОКС
  ---------------------------------------------------------- */
  const lightbox = document.getElementById('lightbox');
  const lbMainImg = document.getElementById('lightbox-main-img');
  const lbThumbs = document.getElementById('lightbox-thumbnails');
  const lbClose = document.getElementById('lightbox-close');

  function openLightbox(index) {
    if (!lightbox) return;
    
    // Генерируем миниатюры именно для той галереи, на которую нажали
    lbThumbs.innerHTML = '';
    activeGalleryImages.forEach((imgData, i) => {
      const thumb = document.createElement('img');
      thumb.src = imgData.src;
      thumb.classList.add('lightbox-thumb');
      thumb.onclick = () => showLightboxImage(i);
      lbThumbs.appendChild(thumb);
    });

    lightbox.classList.add('active');
    document.getElementById('lightbox-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    showLightboxImage(index);
  }

  function showLightboxImage(index) {
    lightboxIndex = (index + activeGalleryImages.length) % activeGalleryImages.length;
    const data = activeGalleryImages[lightboxIndex];
    lbMainImg.src = data.src;
    lbMainImg.alt = data.alt;

    const thumbs = lbThumbs.querySelectorAll('.lightbox-thumb');
    thumbs.forEach((t, i) => t.classList.toggle('active', i === lightboxIndex));
  }

  lbClose.onclick = () => {
    lightbox.classList.remove('active');
    document.getElementById('lightbox-overlay').classList.remove('active');
    document.body.style.overflow = '';
  };

  document.getElementById('lightbox-prev').onclick = () => showLightboxImage(lightboxIndex - 1);
  document.getElementById('lightbox-next').onclick = () => showLightboxImage(lightboxIndex + 1);

  // Инициализация
  createCarousel('carousel-left');
  createCarousel('carousel-right');

  /* ----------------------------------------------------------
     7. ФОРМА — Google Sheets
     Вставь свою ссылку из Apps Script в FORM_URL
  ---------------------------------------------------------- */
  var FORM_URL    = 'https://script.google.com/macros/s/AKfycbzGpi0tGNgTuhfI7I3taCnVDHh5oGS5f-2j66RJi2vZzs0pEWgBKUsr7sTnWbA1D7nq/exec'; // This URL is from the context, not changed.

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