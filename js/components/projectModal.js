/**
 * Sawa United — Projects modal
 * Self-contained, language-aware and independent from reveal animations.
 */
(() => {
  const data = {
    sawa: {
      sector: { en: 'REAL ESTATE', ar: 'العقارات', fr: 'IMMOBILIER' },
      title: { en: 'SAWA UNITED', ar: 'سوا يونايتد', fr: 'SAWA UNITED' },
      desc: {
        en: 'A modern business destination designed around connected workspaces, premium services and long-term commercial value.',
        ar: 'وجهة أعمال حديثة تجمع بين مساحات العمل المتصلة والخدمات المتميزة والقيمة التجارية طويلة الأجل.',
        fr: 'Une destination d’affaires moderne pensée autour d’espaces connectés, de services premium et d’une valeur commerciale durable.'
      },
      meta: ['EGYPT', '2026'],
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=75',
      url: 'https://sawa-united.net/'
    },
    northstar: {
      sector: { en: 'AUTOMOTIVE', ar: 'السيارات', fr: 'AUTOMOBILE' },
      title: { en: 'MASHARY CARS', ar: 'ماشيري كارز', fr: 'MASHARY CARS' },
      desc: {
        en: 'A mobility platform focused on connected automotive services, practical customer solutions and regional partnerships.',
        ar: 'منصة للتنقل تركز على خدمات السيارات المتصلة والحلول العملية للعملاء والشراكات الإقليمية.',
        fr: 'Une plateforme de mobilité axée sur les services automobiles connectés, les solutions clients et les partenariats régionaux.'
      },
      meta: ['UAE', '2025'],
      image: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=75',
      url: 'https://masharycar.net/'
    },
    horizon: {
      sector: { en: 'PETROLEUM', ar: 'البترول', fr: 'PÉTROLE' },
      title: { en: 'START WALK', ar: 'ستارت ووك', fr: 'START WALK' },
      desc: {
        en: 'A petroleum initiative focused on practical operations, supply opportunities and long-term value creation.',
        ar: 'مبادرة في قطاع البترول تركز على العمليات العملية وفرص التوريد وخلق قيمة طويلة الأجل.',
        fr: 'Une initiative pétrolière axée sur les opérations, les opportunités d’approvisionnement et la création de valeur à long terme.'
      },
      meta: ['EGYPT', '2026'],
      image: 'https://images.unsplash.com/photo-1516199423456-1f1e91b06f25?auto=format&fit=crop&w=1200&q=75',
      url: 'https://startwalk.net/'
    },
    crossmarket: {
      sector: { en: 'FOOD', ar: 'الأغذية', fr: 'AGROALIMENTAIRE' },
      title: { en: 'SAWA FOOD', ar: 'سوا فود', fr: 'SAWA FOOD' },
      desc: {
        en: 'A food platform connecting sourcing, distribution and market opportunities across the MENA region.',
        ar: 'منصة غذائية تربط بين التوريد والتوزيع وفرص الأسواق في منطقة الشرق الأوسط وشمال أفريقيا.',
        fr: 'Une plateforme alimentaire reliant approvisionnement, distribution et opportunités de marché dans la région MENA.'
      },
      meta: ['MENA', '2024'],
      image: 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?auto=format&fit=crop&w=1200&q=75',
      url: 'https://sawafood.net/'
    }
  };

  const modal = document.getElementById('projectModal');
  if (!modal) return;

  const card = modal.querySelector('.project-modal-card');
  const sectorEl = document.getElementById('projectModalSector');
  const titleEl = document.getElementById('projectModalTitle');
  const descriptionEl = document.getElementById('projectModalDescription');
  const imageEl = document.getElementById('projectModalImage');
  const metaEl = document.getElementById('projectModalMeta');
  const ctaEl = document.getElementById('projectModalCta');
  const contentEl = modal.querySelector('.project-modal-panel');
  const mediaEl = modal.querySelector('.project-modal-media');
  const closeButton = modal.querySelector('.project-modal-close');
  let current = null;
  let lastTrigger = null;
  const imageCache = new Map();

  // Keep project images external, but warm the browser cache before the modal opens.
  const preloadImage = (url) => {
    if (!url) return Promise.reject(new Error('Missing image URL'));
    if (imageCache.has(url)) return imageCache.get(url);
    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error(`Failed to load ${url}`));
      img.src = url;
    });
    imageCache.set(url, promise);
    return promise;
  };

  const warmProjectImages = () => {
    Object.values(data).forEach(project => {
      preloadImage(project.image).catch(() => {});
    });
  };

  const getLang = () => {
    const value = document.documentElement.lang;
    return value === 'ar' || value === 'fr' ? value : 'en';
  };

  const render = () => {
    const project = data[current];
    if (!project) return;
    const lang = getLang();
    const text = (obj) => obj?.[lang] || obj?.en || '';

    sectorEl.textContent = text(project.sector);
    titleEl.textContent = text(project.title);
    descriptionEl.textContent = text(project.desc);
    imageEl.alt = text(project.title);
    imageEl.setAttribute('decoding', 'async');
    imageEl.setAttribute('loading', 'eager');
    imageEl.setAttribute('fetchpriority', 'high');
    imageEl.removeAttribute('data-image-error');
    imageEl.removeAttribute('data-image-retry');
    imageEl.style.visibility = 'visible';
    imageEl.style.opacity = '1';
    if (mediaEl) mediaEl.style.backgroundImage = `url(\"${project.image}\")`;
    imageEl.onerror = () => {
      // The project cards already use the direct Unsplash CDN. Keep the modal on the
      // exact same origin instead of routing through a third-party image proxy.
      const retryUrl = project.image.includes('?') ? `${project.image}&cb=1` : `${project.image}?cb=1`;
      if (imageEl.dataset.imageRetry !== retryUrl) {
        imageEl.dataset.imageRetry = retryUrl;
        imageEl.src = retryUrl;
        if (mediaEl) mediaEl.style.backgroundImage = `url(\"${retryUrl}\")`;
      } else {
        imageEl.dataset.imageError = 'true';
      }
    };
    imageEl.onload = () => {
      imageEl.removeAttribute('data-image-error');
      imageEl.removeAttribute('data-image-retry');
      if (typeof imageEl.decode === 'function') imageEl.decode().catch(() => {});
    };
    metaEl.replaceChildren(...project.meta.map(value => {
      const span = document.createElement('span');
      span.textContent = value;
      return span;
    }));

    // Send visitors to the project's own website instead of a generic contact link.
    if (ctaEl && project.url) ctaEl.href = project.url;

    // Hard guarantee: the content panel is isolated from all legacy/reveal rules.
    card.classList.add('content-ready');
    if (contentEl) contentEl.classList.add('is-ready');
  };

  const open = (trigger) => {
    const id = trigger?.dataset.project;
    if (!id || !data[id]) return;
    current = id;
    lastTrigger = trigger;
    const project = data[id];
    // Use the warmed cache when possible; opening remains immediate and never blocks the UI.
    preloadImage(project.image).catch(() => {});
    render();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    document.documentElement.classList.add('project-modal-active');
    // Mobile browsers are more reliable when the dynamic image is assigned after
    // the modal has entered the visible layout, rather than while visibility:hidden.
    requestAnimationFrame(() => {
      imageEl.src = project.image;
      if (mediaEl) mediaEl.style.backgroundImage = `url(\"${project.image}\")`;
    });
    if (closeButton) requestAnimationFrame(() => closeButton.focus({ preventScroll: true }));
  };

  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    document.documentElement.classList.remove('project-modal-active');
    if (lastTrigger && typeof lastTrigger.focus === 'function') lastTrigger.focus({ preventScroll: true });
  };

  document.querySelectorAll('.project-open[data-project]').forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault();
      open(trigger);
    });
  });

  modal.querySelectorAll('[data-close-project]').forEach(element => element.addEventListener('click', close));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('open')) close();
  });
  window.addEventListener('luna:languagechange', () => { if (current) render(); });

  // Warm the external images after the page has become interactive.
  const warm = () => warmProjectImages();
  if ('requestIdleCallback' in window) requestIdleCallback(warm, { timeout: 2500 });
  else window.setTimeout(warm, 1200);

  // Also warm the exact image when a user is about to open a project.
  document.querySelectorAll('.project-open[data-project]').forEach(trigger => {
    const warm = () => {
      const project = data[trigger.dataset.project];
      if (project) preloadImage(project.image).catch(() => {});
    };
    trigger.addEventListener('pointerenter', warm, { passive: true });
    trigger.addEventListener('focus', warm, { passive: true });
    trigger.addEventListener('touchstart', warm, { passive: true, once: true });
  });

  // Allow direct links such as projects.html#project-horizon.
  const hashId = location.hash.replace('#project-', '');
  if (data[hashId]) {
    const trigger = document.querySelector(`.project-open[data-project="${hashId}"]`);
    if (trigger) open(trigger);
  }
})();
