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
    if (location.pathname.includes('estanco-el20')) return { code: 'PANCHITA-10',  ctaText: 'Usar descuento' };
    if (location.pathname.includes('lacurva'))      return { code: 'TECNO-15',     ctaText: 'Usar descuento' };
    if (location.pathname.includes('adidas'))       return { code: 'PROMO RULETA', ctaText: 'Girar Ruleta' };
    return { code: 'PROMO MOVIL 360', ctaText: 'Explorar promos' };
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

    /* ====== RULETA ADIDAS ====== */
  const adidasWheelModal = document.getElementById('adidas-wheel-modal');
  let adidasWheel, adidasPrizeText, adidasSpinBtn, adidasCloseBtn, adidasBackdrop;
  let adidasIsSpinning = false;
  let adidasCurrentRotation = 0;

  const adidasPrizes = [
    '2x1 en calzado seleccionado',
    '20% de descuento',
    '10% de descuento',
    '5% de descuento (premio de consolación)',
    '2x1 en calzado seleccionado',
    '20% de descuento',
    '10% de descuento',
    '5% de descuento (premio de consolación)'
  ];

  function openAdidasWheel() {
    if (!adidasWheelModal) return;
    adidasWheelModal.classList.add('show');
    adidasWheelModal.setAttribute('aria-hidden', 'false');

    if (adidasPrizeText) {
      adidasPrizeText.textContent = 'Lista para girar…';
    }
  }

  function closeAdidasWheel() {
    if (!adidasWheelModal) return;
    adidasWheelModal.classList.remove('show');
    adidasWheelModal.setAttribute('aria-hidden', 'true');
  }

  if (adidasWheelModal) {
    adidasWheel = adidasWheelModal.querySelector('.adidas-wheel');
    adidasPrizeText = adidasWheelModal.querySelector('#adidas-prize-text');
    adidasSpinBtn = adidasWheelModal.querySelector('#adidas-spin-btn');
    adidasCloseBtn = adidasWheelModal.querySelector('.wheel-close');
    adidasBackdrop = adidasWheelModal.querySelector('.wheel-backdrop');

    adidasCloseBtn?.addEventListener('click', closeAdidasWheel);
    adidasBackdrop?.addEventListener('click', closeAdidasWheel);

if (adidasSpinBtn && adidasWheel && adidasPrizeText) {
  adidasSpinBtn.addEventListener('click', () => {
    if (adidasIsSpinning) return;
    adidasIsSpinning = true;

    adidasPrizeText.textContent = 'Girando… 🎡';

    const totalSegments = adidasPrizes.length;
    const degreesPerSegment = 360 / totalSegments;

    // índice del premio donde queremos que caiga
    const randomIndex = Math.floor(Math.random() * totalSegments);

    // ángulo EXACTO del centro del segmento
    const centerAngle = randomIndex * degreesPerSegment + (degreesPerSegment / 2);

    // vueltas completas para que se vea bonito
    const extraTurns = 4 + Math.floor(Math.random() * 3); // 4–6 vueltas

    // rotación final (ya no usamos sumas acumuladas cerca del borde)
    const finalRotation = extraTurns * 360 + centerAngle;

    adidasWheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    adidasWheel.style.transform = `rotate(${finalRotation}deg)`;

    const chosenPrize = adidasPrizes[randomIndex];

    setTimeout(() => {
      adidasPrizeText.innerHTML = `🎉 Tu premio: <strong>${chosenPrize}</strong>`;
      adidasIsSpinning = false;
    }, 4000);
  });
}

  }


  // HOME: click "Ver más detalles"
  document.querySelectorAll('.promo-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || link.href || '#';
      const isEstanco = href.includes('estanco-el20');
      const isCurva = href.includes('lacurva');
      const isAdidas = href.includes('adidas');

      // Si es Adidas, abrimos la ruleta y no mostramos el modal de cupón
      if (isAdidas) {
        return;
      }

      // Para las demás promos, seguimos con el flujo normal del modal
      e.preventDefault();

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
        icon: '🎁',
        confetti: 200,
        sparkles: 30
      };

      reward.open(cfg);
    });
  });


// DETALLE: lógica de recompensas
const seenKey = 'pm360_seen_reward_ok_' + location.pathname;
const isAdidasDetail = location.pathname.includes('adidas') && !!adidasWheelModal;
const url = new URL(location.href);

// ADIDAS: al entrar a la landing mostramos siempre la ruleta
if (isAdidasDetail) {
  openAdidasWheel();
}


  // ADIDAS: asegurar modal "Promo lista para usar" al entrar al detalle (solo una vez por sesión)
  if (isAdidasDetail && !hasQRFlag() && !sessionStorage.getItem('pm360_seen_adidas_detail')) {
    sessionStorage.setItem('pm360_seen_adidas_detail', '1');
    const { code } = pageCoupon();
    const icon = '🎡';

    setTimeout(() => {
      reward.open({
        coupon: code,
        title: '🎉 ¡Promo lista para usar!',
        sub: `Descuento <strong>${code}</strong> activado. <br>Muestra el <strong>QR de esta página</strong> al pagar.`,
        ctaText: 'Entendido',
        ctaHref: '#',
        icon,
        confetti: 230,
        sparkles: 38
      });
    }, 550);
  }

  // DETALLE: llegada por QR => confeti + instrucción de usar el QR de la página
  if (hasQRFlag() && !sessionStorage.getItem(seenKey)) {
    sessionStorage.setItem(seenKey, '1');
    const { code, ctaText } = pageCoupon();
    
    const icon = location.pathname.includes('estanco') ? '🥂' : 
                 location.pathname.includes('lacurva') ? '💻' :
                 location.pathname.includes('adidas')  ? '🎡' : '🎁';
    
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
  // (para Adidas ya lo manejamos arriba)
  if (!isAdidasDetail && url.searchParams.get('src') === 'grid') {
    const { code } = pageCoupon();
    
    const icon = location.pathname.includes('estanco') ? '🥂' : 
                 location.pathname.includes('lacurva') ? '💻' :
                 location.pathname.includes('adidas')  ? '🎡' : '🎁';
    
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

  // Primera visita sin QR ni src=grid: micro-momento (todas las promos)
  if (!hasQRFlag() && url.searchParams.get('src') !== 'grid' && !sessionStorage.getItem(seenKey)) {
    sessionStorage.setItem(seenKey, '1');
    const { code, ctaText } = pageCoupon();
    
    const icon = location.pathname.includes('estanco') ? '🥂' : 
                 location.pathname.includes('lacurva') ? '💻' :
                 location.pathname.includes('adidas')  ? '🎡' : '🎁';
    
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


  // CONTADOR DE VENCIMIENTO
  function updateCountdowns() {
    document.querySelectorAll('[id^="countdown-"]').forEach(el => {
      const expiryDate = new Date(el.dataset.expiry);
      const now = new Date();
      const diff = expiryDate - now;

      if (diff <= 0) {
        el.textContent = 'Expirado';
        el.parentElement.classList.add('urgent');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      if (days > 30) {
        const months = Math.floor(days / 30);
        el.textContent = `${months} ${months === 1 ? 'mes' : 'meses'}`;
      } else if (days > 0) {
        el.textContent = `${days} ${days === 1 ? 'día' : 'días'}`;
        if (days <= 7) el.parentElement.classList.add('urgent');
      } else {
        el.textContent = `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
        el.parentElement.classList.add('urgent');
      }
    });
  }

  // SIMULACIÓN DE VIEWERS
  function updateViewers() {
    document.querySelectorAll('[id^="viewers-"]').forEach(el => {
      const baseCount = parseInt(el.textContent);
      const variation = Math.floor(Math.random() * 7) - 3; // -3 a +3
      const newCount = Math.max(1, baseCount + variation);
      el.textContent = newCount;
    });
  }

  // COMPARTIR
  function sharePromo(promoName) {
    if (navigator.share) {
      navigator.share({
        title: `Promoción: ${promoName}`,
        text: `¡Mira esta increíble promoción en ${promoName}!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      alert(`¡Comparte esta promo de ${promoName}!`);
    }
  }

  // INIT
  updateCountdowns();
  setInterval(updateCountdowns, 60000); // cada minuto
  updateViewers();
  setInterval(updateViewers, 8000); // cada 8 s

});

        // Configuración Supabase
        const SUPABASE_URL = "https://xjzkernuaqyfsfeowrsl.supabase.co";
        const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhqemtlcm51YXF5ZnNmZW93cnNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NjE5OTIsImV4cCI6MjA3NzQzNzk5Mn0.MSgTsMXHQ847X0NKl8Ly05kFczqwn9XC01dzsZ_cY-8";

        // Premios
const prizes = [
  { name: '2x1 en calzado',      color: '#FF3B30', icon: '🎁' }, // rojo intenso
  { name: '20% de descuento',    color: '#FF9500', icon: '🎁' }, // naranja brillante
  { name: '10% de descuento',    color: '#FFCC00', icon: '🎁' }, // amarillo
  { name: '5% de descuento',     color: '#34C759', icon: '🎁' }, // verde lima
  { name: '2x1 en calzado',      color: '#007AFF', icon: '🎁' }, // azul fuerte
  { name: '20% de descuento',    color: '#5856D6', icon: '🎁' }, // violeta
  { name: '10% de descuento',    color: '#AF52DE', icon: '🎁' }, // púrpura brillante
  { name: '5% de descuento',     color: '#FF2D55', icon: '🎁' }  // rosado
];

          const segmentAngle = 360 / prizes.length; // 90° por segmento

        let currentRotation = 0;
        let isSpinning = false;
        let hasSpun = false;
        let prizeWon = null;

        // Inicializar
        window.addEventListener('DOMContentLoaded', () => {
            buildWheel();
            checkIfAlreadySpun();
            openWheel();
        });

        function buildWheel() {
            const wheel = document.getElementById('wheelCircle');
            prizes.forEach((prize, i) => {
                const segment = document.createElement('div');
                segment.className = 'wheel-segment';
                segment.style.transform = `rotate(${i * segmentAngle}deg)`;
                segment.style.backgroundColor = prize.color;

                segment.innerHTML = `
                    <div class="wheel-segment-content">
                        <span class="wheel-segment-icon">${prize.icon}</span>
                        
                    </div>
                `;

                wheel.appendChild(segment);
            });

            // Centro
            const center = document.createElement('div');
            center.className = 'wheel-center';
            center.innerHTML = '<i class="fas fa-star"></i>';
            wheel.appendChild(center);
        }

            function checkIfAlreadySpun() {
                const spunId = localStorage.getItem('adidas_wheel_id');
                if (spunId) {
                    // Solo aviso, no bloqueo (modo pruebas)
                    showMessage(`Ya participaste antes con la cédula ${spunId} (modo pruebas)`, 'warning');
                }
            }


        function openWheel() {
            document.getElementById('wheelModalV2').classList.add('show');
        }

        function closeWheel() {
            document.getElementById('wheelModalV2').classList.remove('show');
        }

        async function spinWheel() {
            if (isSpinning) return;

            isSpinning = true;
            document.getElementById('spinBtn').disabled = true;
            document.getElementById('spinBtn').innerHTML = '<span class="spinner"></span> Girando...';
            hideMessage();

            const spins = 5 + Math.floor(Math.random() * 3);
            const extraDegrees = Math.floor(Math.random() * 360);
            const totalRotation = currentRotation + (spins * 360) + extraDegrees;
            
            currentRotation = totalRotation;
            document.getElementById('wheelCircle').style.transform = `rotate(${totalRotation}deg)`;

            setTimeout(() => {

              const normalizedRotation = totalRotation % 360;

            // corregimos el desfase sumando medio segmento
            const prizeIndex = Math.floor(
              ((360 - normalizedRotation) + (segmentAngle / 2)) / segmentAngle
            ) % prizes.length;

            prizeWon = prizes[prizeIndex];

              

                showFormView();
                isSpinning = false;
            }, 4000);
        }

        function showFormView() {
            document.getElementById('wheelView').style.display = 'none';
            document.getElementById('formView').style.display = 'block';
            document.getElementById('prizeIconBig').textContent = prizeWon.icon;
            document.getElementById('prizeName').textContent = prizeWon.name;
        }

async function submitForm() {
    const nombre = document.getElementById('inputNombre').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const telefono = document.getElementById('inputTelefono').value.trim();
    const cedula = document.getElementById('inputCedula').value.trim();

    // Validación básica
    if (!nombre || !email || !telefono || !cedula) {
        showFormMessage('⚠️ Completa todos los campos', 'warning');
        return;
    }

    if (!validateEmail(email)) {
        showFormMessage('⚠️ Email inválido', 'warning');
        return;
    }

    document.getElementById('submitBtn').disabled = true;
    document.getElementById('submitBtn').innerHTML = '<span class="spinner"></span> Guardando...';

    try {
        // ⛔ Verificar si ya participó (aquí sale el mensaje que quieres)
        const alreadySpun = await checkParticipation(cedula);

        if (alreadySpun) {
            showFormMessage('❌ Esta cédula ya participó anteriormente', 'error');
            // No bloqueamos giros ni cerramos el modal en modo pruebas
            document.getElementById('submitBtn').disabled = false;
            document.getElementById('submitBtn').innerHTML = '<i class="fas fa-gift"></i> Reclamar Premio';
            return;
        }

        // ✅ Guardar en Supabase
        const response = await fetch(`${SUPABASE_URL}/rest/v1/wheel_participants`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                nombre: nombre,
                email: email,
                telefono: telefono,
                identificacion: cedula,
                premio: prizeWon.name,
                fecha: new Date().toISOString()
            })
        });

        if (response.ok) {
            // Guardamos la cédula solo como referencia
            localStorage.setItem('adidas_wheel_id', cedula);

            showFormMessage('✅ ¡Premio registrado! Muestra esta pantalla en tienda', 'success');
            document.getElementById('submitBtn').innerHTML = '<i class="fas fa-check-circle"></i> Premio Registrado';
            // Si quieres que se cierre solo en producción, puedes dejar este setTimeout:
            // setTimeout(() => closeWheel(), 4000);
        } else {
            throw new Error('Error al guardar');
        }
    } catch (error) {
        console.error('Error:', error);
        showFormMessage('⚠️ Error de conexión. Intenta de nuevo', 'warning');
        document.getElementById('submitBtn').disabled = false;
        document.getElementById('submitBtn').innerHTML = '<i class="fas fa-gift"></i> Reclamar Premio';
    }
}


        async function checkParticipation(cedula) {
            try {
                const response = await fetch(
                    `${SUPABASE_URL}/rest/v1/wheel_participants?identificacion=eq.${cedula}&select=*`,
                    {
                        headers: {
                            'apikey': SUPABASE_KEY,
                            'Authorization': `Bearer ${SUPABASE_KEY}`
                        }
                    }
                );
                const data = await response.json();
                return data && data.length > 0;
            } catch (error) {
                console.error('Error verificando participación:', error);
                return false;
            }
        }

        function validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        function showMessage(msg, type) {
            const box = document.getElementById('messageBox');
            box.className = `message-box message-${type}`;
            box.textContent = msg;
            box.style.display = 'block';
        }

        function hideMessage() {
            document.getElementById('messageBox').style.display = 'none';
        }

        function showFormMessage(msg, type) {
            const box = document.getElementById('formMessageBox');
            box.className = `message-box message-${type}`;
            box.textContent = msg;
            box.style.display = 'block';
        }

        // Registro de scan en Supabase
        (async () => {
            const slug = "ADIDAS-RULETA";
            const ua = navigator.userAgent;

            try {
                const ipResp = await fetch("https://api.ipify.org?format=json");
                const ipData = await ipResp.json();
                const ip_hash = btoa(ipData.ip);

                await fetch(`${SUPABASE_URL}/rest/v1/scans`, {
                    method: "POST",
                    headers: {
                        apikey: SUPABASE_KEY,
                        Authorization: `Bearer ${SUPABASE_KEY}`,
                        "Content-Type": "application/json",
                        Prefer: "return=minimal"
                    },
                    body: JSON.stringify({ promo_slug: slug, ua, ip_hash })
                });
            } catch (err) {
                console.error("Error registrando scan:", err);
            }
        })();
