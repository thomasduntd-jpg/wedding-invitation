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
  const wrappers = document.querySelectorAll('.photo-3d-wrapper');
  const photoGroup = document.querySelector('.hero-photo-group');
  let mobileOrder = [0, 1, 2]; // Индексы для управления слоями на мобильных

  function updateMobileClasses() {
    wrappers.forEach((el, i) => {
      const pos = mobileOrder.indexOf(i);
      el.classList.remove('pos-0', 'pos-1', 'pos-2');
      el.classList.add(`pos-${pos}`);
    });
  }

  if (wrappers.length > 0) {
    // Инициализируем мобильные классы сразу
    if (window.innerWidth <= 900) updateMobileClasses();

    wrappers.forEach(wrapper => {
      wrapper.addEventListener('mousemove', function (e) {
        if (window.innerWidth <= 900) return;

        const rect = wrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const idx = wrapper.getAttribute('data-index');
        let baseTranslate = 'translateX(0)';
        
        // Если мышь в зоне группы, сохраняем раздвинутое состояние
        if (photoGroup && photoGroup.matches(':hover')) {
          if (idx === "1") baseTranslate = 'translateX(-105%)';
          if (idx === "2") baseTranslate = 'translateX(105%)';
        }

        // Вместо none используем короткий переход для "гладкости" наклона
        wrapper.style.transition = 'transform 0.3s cubic-bezier(0.2, 0, 0.2, 1)';
        wrapper.style.transform = `${baseTranslate} perspective(1000px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) scale3d(1.05, 1.05, 1.05)`;
        
        // Сохраняем иерархию: центральная (0) всегда выше боковых (1, 2)
        wrapper.style.zIndex = (idx === "0") ? "20" : "5";
      });

      wrapper.addEventListener('mouseleave', function () {
        if (window.innerWidth <= 900) return;
        
        wrapper.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.3, 0.64, 1)';
        wrapper.style.transform = '';
        wrapper.style.zIndex = '';
      });
    });
  }

  // Для мобильной версии (перелистывание кликом)
  const photoStack = document.getElementById('photo-stack');
  if (photoStack) {
    photoStack.addEventListener('click', function() {
      if (window.innerWidth > 900) return;

      // Индекс текущей верхней фотографии
      const topIdx = mobileOrder[0];
      const topEl = wrappers[topIdx];

      if (topEl.classList.contains('switching')) return;

      // Начинаем анимацию ухода текущей фотографии
      topEl.classList.add('switching');
      topEl.style.zIndex = '0';

      // Мгновенно обновляем порядок в массиве и классы, 
      // чтобы следующая фотография начала движение вперед одновременно с улетом первой
      const shifted = mobileOrder.shift();
      mobileOrder.push(shifted);
      updateMobileClasses();

      setTimeout(() => {
        topEl.classList.remove('switching');
        topEl.style.zIndex = '';
      }, 500); // Длительность должна соответствовать времени перехода в CSS
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
        nameInput.addEventListener('input', function () {
          nameInput.style.borderBottomColor = '';
        }, { once: true });
        return;
      }

      /* Валидация: Минимум два слова (Имя и Фамилия) */
      var nameParts = fullName.split(/\s+/).filter(function(word) { 
        return word.length > 0; 
      });
      if (nameParts.length < 2) {
        alert('Введены неполные значения');
        nameInput.style.borderBottomColor = '#c0392b';
        nameInput.focus();
        nameInput.addEventListener('input', function () {
          nameInput.style.borderBottomColor = '';
        }, { once: true });
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

    });
  }

  /* ----------------------------------------------------------
     8. ОТСЛЕЖИВАНИЕ ЗАГОЛОВКОВ (IntersectionObserver)
  ---------------------------------------------------------- */
  const observerOptions = {
    root: null,
    rootMargin: '-80px 0px -20% 0px', // Срабатывает, когда заголовок под хедером
    threshold: 0
  };

  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Ищем заголовки внутри секции
      const titles = entry.target.querySelectorAll('.section-title-display, .section-title-serif');
      
      if (entry.isIntersecting) {
        titles.forEach(t => t.classList.add('gradient-text-animated'));
      } else {
        titles.forEach(t => t.classList.remove('gradient-text-animated'));
      }
    });
  }, observerOptions);

  // Секции, в которых нужно анимировать заголовки
  const sectionsWithTitles = [
    'details', 'timing', 'dresscode', 'wishes', 'form', 'address', 'timer'
  ];

  sectionsWithTitles.forEach(id => {
    const section = document.getElementById(id);
    if (section) titleObserver.observe(section);
  });

  /* ----------------------------------------------------------
     9. SCROLL-DRIVEN BACKGROUND GRADIENT
  ---------------------------------------------------------- */
  const scrollGradientBg = document.querySelector('.scroll-gradient-background');

  if (scrollGradientBg) {
    function updateGradientPosition() {
      const scrollY = window.scrollY;

      // Small multipliers to make the movement subtle and create a "shimmer" effect
      // Different multipliers for each gradient to ensure varied movement
      const moveX1 = scrollY * 0.15;
      const moveY1 = scrollY * 0.08;
      const moveX2 = scrollY * -0.12;
      const moveY2 = scrollY * 0.18;
      const moveX3 = scrollY * 0.22;
      const moveY3 = scrollY * -0.06;
      const moveX4 = scrollY * -0.09;
      const moveY4 = scrollY * 0.15;
      const moveX5 = scrollY * 0.18;
      const moveY5 = scrollY * 0.12;
      const moveX6 = scrollY * -0.15;
      const moveY6 = scrollY * -0.09;
      const moveX7 = scrollY * 0.11;
      const moveY7 = scrollY * 0.20;
      const moveX8 = scrollY * -0.18;
      const moveY8 = scrollY * 0.07;

      scrollGradientBg.style.setProperty('--bg-offset-x-1', `${moveX1}px`);
      scrollGradientBg.style.setProperty('--bg-offset-y-1', `${moveY1}px`);
      scrollGradientBg.style.setProperty('--bg-offset-x-2', `${moveX2}px`);
      scrollGradientBg.style.setProperty('--bg-offset-y-2', `${moveY2}px`);
      scrollGradientBg.style.setProperty('--bg-offset-x-3', `${moveX3}px`);
      scrollGradientBg.style.setProperty('--bg-offset-y-3', `${moveY3}px`);
      scrollGradientBg.style.setProperty('--bg-offset-x-4', `${moveX4}px`);
      scrollGradientBg.style.setProperty('--bg-offset-y-4', `${moveY4}px`);
      scrollGradientBg.style.setProperty('--bg-offset-x-5', `${moveX5}px`);
      scrollGradientBg.style.setProperty('--bg-offset-y-5', `${moveY5}px`);
      scrollGradientBg.style.setProperty('--bg-offset-x-6', `${moveX6}px`);
      scrollGradientBg.style.setProperty('--bg-offset-y-6', `${moveY6}px`);
      scrollGradientBg.style.setProperty('--bg-offset-x-7', `${moveX7}px`);
      scrollGradientBg.style.setProperty('--bg-offset-y-7', `${moveY7}px`);
      scrollGradientBg.style.setProperty('--bg-offset-x-8', `${moveX8}px`);
      scrollGradientBg.style.setProperty('--bg-offset-y-8', `${moveY8}px`);
    }

    window.addEventListener('scroll', updateGradientPosition, { passive: true });
    updateGradientPosition(); // Set initial position
  }

}); /* конец DOMContentLoaded */