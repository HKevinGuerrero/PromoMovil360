// script.js – versión con dopamina mejorada
document.addEventListener('DOMContentLoaded', function () {
  /* ====== UI existente (con validaciones) ====== */
  const promoCards = document.querySelectorAll('.promo-card');

  // Menú hamburguesa
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const navLinksContainer = document.querySelector('.nav-links-container');
  const icon = menuToggle?.querySelector('i');
  if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', function() {
      navLinksContainer.classList.toggle('show');
      if (!icon) return;
      if (navLinksContainer.classList.contains('show')) {
        icon.classList.remove('fa-bars'); icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times'); icon.classList.add('fa-bars');
      }
    });
  }

  // Categorías
  const dropdownContainer = document.querySelector('.dropdown-container');
  const categoryMenuLink = dropdownContainer?.querySelector('a');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  const categoryFilterLinks = document.querySelectorAll('.category-filter');
  if (categoryMenuLink && dropdownMenu) {
    categoryMenuLink.addEventListener('click', (e)=>{ e.preventDefault(); dropdownMenu.classList.toggle('show'); });
    window.addEventListener('click', (e)=>{ if (dropdownContainer && !dropdownContainer.contains(e.target)) dropdownMenu.classList.remove('show'); });
  }
  if (categoryFilterLinks.length) {
    categoryFilterLinks.forEach(link => link.addEventListener('click', (e)=>{
      e.preventDefault();
      const selectedCategory = link.getAttribute('data-category');
      promoCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        card.style.display = (selectedCategory === 'all' || selectedCategory === cardCategory) ? 'flex' : 'none';
      });
      dropdownMenu?.classList.remove('show');
    }));
  }

  // Búsqueda (solo si existe)
  const searchBar = document.getElementById('search-bar');
  if (searchBar) {
    searchBar.addEventListener('input', function () {
      const searchTerm = this.value.toLowerCase().trim();
      promoCards.forEach(card => {
        const cardContent = card.textContent.toLowerCase();
        card.style.display = cardContent.includes(searchTerm) ? 'flex' : 'none';
      });
    });
  }

  // Volver arriba (solo si existe)
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) scrollTopBtn.classList.add('show');
      else scrollTopBtn.classList.remove('show');
    });
    scrollTopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ====== Sistema de Recompensas MEJORADO ====== */
  
  // Confeti mejorado con más variedad
  function launchConfetti(container, count = 200) {
    const layer = container?.querySelector?.('.confetti-layer');
    if (!layer) return;
    
    const icons = ['🎉','✨','🟡','🟣','🟢','💥','🎊','⭐','🧡','💛','🌟','⚡','💫','🔥','🎁'];
    layer.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'confetti-piece';
      el.textContent = icons[Math.floor(Math.random() * icons.length)];
      el.style.left = (Math.random() * 100) + 'vw';
      el.style.setProperty('--x', (Math.random() * 400 - 200) + 'px');
      el.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg');
      el.style.animationDuration = (2000 + Math.random() * 2000) + 'ms';
      el.style.animationDelay = (Math.random() * 300) + 'ms';
      el.style.fontSize = (18 + Math.random() * 12) + 'px';
      layer.appendChild(el);
    }
  }

  // Sparkles (estrellas parpadeantes)
  function launchSparkles(container, count = 30) {
    const layer = container?.querySelector?.('.sparkles-layer');
    if (!layer) return;
    
    layer.innerHTML = '';
    const sparkleIcons = ['✨', '⭐', '💫', '🌟'];
    
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'sparkle';
      el.textContent = sparkleIcons[Math.floor(Math.random() * sparkleIcons.length)];
      el.style.left = (10 + Math.random() * 80) + '%';
      el.style.top = (10 + Math.random() * 80) + '%';
      el.style.animationDelay = (Math.random() * 2) + 's';
      el.style.animationDuration = (1 + Math.random() * 1.5) + 's';
      layer.appendChild(el);
    }
  }

  // Animación de progreso mejorada
  function animateProgress(fillElement, percentElement) {
    if (!fillElement || !percentElement) return;
    
    let progress = 0;
    const targetProgress = 99;
    const duration = 1200;
    const steps = 60;
    const increment = targetProgress / steps;
    const stepDuration = duration / steps;
    
    const interval = setInterval(() => {
      progress += increment;
      if (progress >= targetProgress) {
        progress = targetProgress;
        clearInterval(interval);
        
        // Efecto de "completado"
        setTimeout(() => {
          fillElement.style.background = 'linear-gradient(90deg, #4CAF50 0%, #45a049 100%)';
          percentElement.textContent = '100%';
          fillElement.style.width = '100%';
        }, 200);
      }
      
      fillElement.style.width = progress + '%';
      percentElement.textContent = Math.round(progress) + '%';
    }, stepDuration);
  }

  function hasQRFlag() {
    const q = new URLSearchParams(location.search);
    const h = location.hash.toLowerCase();
    return q.has('qr') || h.includes('qr') || h.includes('scan');
  }

  function pageCoupon() {
    if (location.pathname.includes('estanco-el20')) return { code: 'PANCHITA-10', ctaText: 'Usar descuento' };
    if (location.pathname.includes('lacurva'))      return { code: 'TECNO-15',    ctaText: 'Usar descuento' };
    return { code: 'PROMO-10', ctaText: 'Canjear ahora' };
  }

  // Modal recompensa mejorado
  const modal = document.getElementById('reward-modal');
  const reward = (() => {
    if (!modal) return { open(){}, close(){} };
    
    let ctaBtn = modal.querySelector('#reward-cta');
    const closeBtn = modal.querySelector('.reward-close');
    const fill = modal.querySelector('.progress-fill');
    const percentEl = modal.querySelector('.progress-percent');
    const codeEl = modal.querySelector('#reward-code');
    const titleEl = modal.querySelector('.reward-title');
    const subEl = modal.querySelector('.reward-sub');
    const iconEl = modal.querySelector('.reward-icon');

    function close() {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      
      // Limpiar efectos
      setTimeout(() => {
        const confettiLayer = modal.querySelector('.confetti-layer');
        const sparklesLayer = modal.querySelector('.sparkles-layer');
        if (confettiLayer) confettiLayer.innerHTML = '';
        if (sparklesLayer) sparklesLayer.innerHTML = '';
        if (fill) fill.style.width = '0%';
        if (percentEl) percentEl.textContent = '0%';
      }, 300);
    }

    function open({
      coupon = 'PROMO-10',
      title = '🎉 ¡Premio desbloqueado!',
      sub = `Cupón aplicado: <strong>${coupon}</strong>`,
      ctaText = 'Canjear ahora',
      ctaHref = '#',
      confetti = 200,
      sparkles = 30,
      icon = '🎁'
    } = {}) {
      
      // Actualizar contenido
      if (codeEl) codeEl.textContent = coupon;
      if (titleEl) titleEl.textContent = title;
      if (subEl) subEl.innerHTML = sub;
      if (iconEl) iconEl.textContent = icon;

      // Actualizar CTA
      if (ctaBtn) {
        const btnText = ctaBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = ctaText;
        ctaBtn.href = ctaHref || '#';

        const freshCTA = ctaBtn.cloneNode(true);
        ctaBtn.parentNode.replaceChild(freshCTA, ctaBtn);
        ctaBtn = freshCTA;

        ctaBtn.addEventListener('click', (e) => {
          const href = ctaBtn.getAttribute('href') || '#';
          if (href === '#' || href === '' || href === '#reward-applied') {
            e.preventDefault();
            close();
          }
        }, { once: true });

        ctaBtn.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { 
            e.preventDefault(); 
            ctaBtn.click(); 
          }
        }, { once: true });
      }

      // Mostrar modal
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');

      // Lanzar efectos visuales
      setTimeout(() => {
        launchConfetti(modal, confetti);
        launchSparkles(modal, sparkles);
      }, 100);

      // Animar progreso
      setTimeout(() => {
        const fillEl = modal.querySelector('.progress-fill');
        const percentEl = modal.querySelector('.progress-percent');
        animateProgress(fillEl, percentEl);
      }, 400);
    }

    closeBtn?.addEventListener('click', close);
    modal.addEventListener('click', (e) => { 
      if (e.target === modal) close(); 
    });

    // Exponer para pruebas
    window.Reward = { open, close };
    return { open, close };
  })();

  /* ====== Flujos de Interacción ====== */

  // HOME: click "Ver más detalles" -> modal (usuario decide navegar)
  document.querySelectorAll('.promo-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href') || link.href || '#';
      const isEstanco = href.includes('estanco-el20');
      const isCurva = href.includes('lacurva');

      const cfg = isEstanco ? {
        coupon: 'PANCHITA-10',
        title: '🎊 ¡Cupón desbloqueado!',
        sub: 'Descuento <strong>PANCHITA-10</strong> listo para usar.',
        ctaText: 'Ir a la promo',
        ctaHref: href + (href.includes('?') ? '&' : '?') + 'src=grid',
        icon: '🥂',
        confetti: 220,
        sparkles: 35
      } : isCurva ? {
        coupon: 'TECNO-15',
        title: '🎊 ¡Cupón desbloqueado!',
        sub: 'Descuento <strong>TECNO-15</strong> listo para usar.',
        ctaText: 'Ir a la promo',
        ctaHref: href + (href.includes('?') ? '&' : '?') + 'src=grid',
        icon: '💻',
        confetti: 220,
        sparkles: 35
      } : {
        coupon: 'PROMO-10',
        title: '🎊 ¡Cupón desbloqueado!',
        sub: 'Descuento <strong>PROMO-10</strong> listo para usar.',
        ctaText: 'Ir a la promo',
        ctaHref: href,
        confetti: 200,
        sparkles: 30
      };

      reward.open(cfg);
    });
  });

  // DETALLE: llegada por QR => confeti + instrucción de usar el QR de la página
  const seenKey = 'pm360_seen_reward_ok_' + location.pathname;
  if (hasQRFlag() && !sessionStorage.getItem(seenKey)) {
    sessionStorage.setItem(seenKey, '1');
    const { code, ctaText } = pageCoupon();
    
    const icon = location.pathname.includes('estanco') ? '🥂' : 
                 location.pathname.includes('lacurva') ? '💻' : '🎁';
    
    setTimeout(() => {
      reward.open({
        coupon: code,
        title: '🎊 ¡Ganaste una promo!',
        sub: `Descuento <strong>${code}</strong> listo. <br>Acércate con el <strong>QR de esta página</strong> para redimir.`,
        ctaText,
        ctaHref: '#',
        icon: icon,
        confetti: 250,
        sparkles: 40
      });
    }, 700);
  }

  // DETALLE: llegada desde la home (src=grid) => confeti + instrucción QR
  const url = new URL(location.href);
  if (url.searchParams.get('src') === 'grid') {
    const { code } = pageCoupon();
    
    const icon = location.pathname.includes('estanco') ? '🥂' : 
                 location.pathname.includes('lacurva') ? '💻' : '🎁';
    
    setTimeout(() => {
      reward.open({
        coupon: code,
        title: '🎉 ¡Promo lista para usar!',
        sub: `Descuento <strong>${code}</strong> activado. <br>Muestra el <strong>QR de esta página</strong> al pagar.`,
        ctaText: 'Entendido',
        ctaHref: '#',
        icon: icon,
        confetti: 230,
        sparkles: 38
      });
    }, 550);
  }

  // Primera visita sin QR ni src=grid: micro-momento
  if (!hasQRFlag() && url.searchParams.get('src') !== 'grid' && !sessionStorage.getItem(seenKey)) {
    sessionStorage.setItem(seenKey, '1');
    const { code, ctaText } = pageCoupon();
    
    const icon = location.pathname.includes('estanco') ? '🥂' : 
                 location.pathname.includes('lacurva') ? '💻' : '🎁';
    
    setTimeout(() => {
      reward.open({
        coupon: code,
        title: '🎉 ¡Premio desbloqueado!',
        sub: `Cupón aplicado: <strong>${code}</strong>`,
        ctaText,
        ctaHref: '#',
        icon: icon,
        confetti: 200,
        sparkles: 30
      });
    }, 1200);
  }
});