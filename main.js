/* ============================================
   EL NAVEGANTE — MAIN.JS v2
   Secuencia cinematográfica + interacciones
   ============================================ */

/* ---- LOADER ---- */
window.addEventListener('load', () => {
  const loader  = document.getElementById('loader');
  const bar     = document.getElementById('loader-bar');

  // Anima la barra de progreso
  bar.style.width = '100%';

  setTimeout(() => {
    loader.classList.add('hidden');
    startHeroSequence();
  }, 1400);
});

/* ---- SECUENCIA DE ENTRADA HERO ---- */
function startHeroSequence() {
  const tl = anime.timeline({ easing: 'easeOutExpo' });

  // 1. Marca de agua aparece
  tl.add({
    targets: '.hero-watermark img',
    opacity: [0, 0.06],
    scale:   [0.7, 1],
    duration: 1200,
  })

  // 2. Badge / eyebrow
  .add({
    targets: '.hero-eyebrow',
    opacity:     [0, 1],
    translateY:  [20, 0],
    duration:    500,
  }, '-=600')

  // 3. Palabras del título en stagger
  .add({
    targets: '.hero-title .word',
    translateY: [80, 0],
    opacity:    [0, 1],
    duration:   700,
    delay: anime.stagger(100),
    easing: 'easeOutBack',
  }, '-=200')

  // 4. Subtítulo
  .add({
    targets: '.hero-subtitle',
    opacity:    [0, 1],
    translateY: [24, 0],
    duration:   500,
  }, '-=200')

  // 5. Botones CTA
  .add({
    targets: '.hero-ctas',
    opacity:    [0, 1],
    translateY: [20, 0],
    duration:   500,
  }, '-=200')

  // 6. Doodles decorativos
  .add({
    targets: '.hero-doodle',
    opacity:  [0, 0.8],
    scale:    [0.3, 1],
    duration: 500,
    delay: anime.stagger(120),
    easing: 'easeOutBack',
  }, '-=300')

  // 7. Scroll indicator
  .add({
    targets: '#scroll-indicator',
    opacity:    [0, 1],
    translateY: [10, 0],
    duration:   400,
  }, '-=100');

  // Partículas flotantes
  spawnParticles();

  // Stats bar contadores
  setTimeout(animateStats, 1800);
}

/* ---- PARTÍCULAS FLOTANTES ---- */
function spawnParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const emojis  = ['🌮','🎸','⭐','🎤','🔥','✨'];
  const colors  = ['#E8A317','#C41E24','#FFD966','rgba(255,248,240,0.6)'];
  const count   = window.innerWidth < 600 ? 8 : 16;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    const useEmoji = Math.random() > 0.5;

    if (useEmoji) {
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.fontSize = (Math.random() * 18 + 12) + 'px';
    } else {
      el.style.width  = (Math.random() * 5 + 3) + 'px';
      el.style.height = el.style.width;
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
    }

    el.className = 'particle';
    el.style.left = Math.random() * 100 + '%';
    el.style.bottom = '-20px';
    el.style.animationDuration  = (Math.random() * 8 + 6) + 's';
    el.style.animationDelay     = (Math.random() * 5) + 's';

    container.appendChild(el);
  }
}

/* ---- CONTADORES ANIMADOS (STATS) ---- */
function animateStats() {
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      anime({
        targets: entry.target.querySelectorAll('.stat-item'),
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        delay: anime.stagger(100),
        easing: 'easeOutExpo',
      });

      entry.target.querySelectorAll('.stat-num').forEach(el => {
        const target = parseInt(el.dataset.target);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || (target >= 1000 ? '+' : '');
        anime({
          targets: el,
          innerHTML: [0, target],
          round: 1,
          duration: 1800,
          easing: 'easeOutExpo',
          update: (anim) => {
            const val = Math.round(anim.animations[0].currentValue);
            el.textContent = prefix + val.toLocaleString('es-MX') + suffix;
          }
        });
      });

      statObserver.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) statObserver.observe(statsBar);
}

/* ---- NAVBAR: scroll effect ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else                      navbar.classList.remove('scrolled');
}, { passive: true });

/* ---- MENÚ MÓVIL ---- */
document.getElementById('hamburger')?.addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.add('open');
});
document.getElementById('menu-close')?.addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.remove('open');
});
document.querySelectorAll('#mobile-menu a').forEach(a =>
  a.addEventListener('click', () => document.getElementById('mobile-menu').classList.remove('open'))
);

/* ---- SCROLL REVEAL genérico ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---- MENÚ: stagger en scroll ---- */
const menuObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    anime({
      targets: entry.target.querySelectorAll('.menu-card'),
      translateY: [50, 0],
      opacity:    [0, 1],
      scale:      [0.95, 1],
      duration:   600,
      delay: anime.stagger(80),
      easing: 'easeOutBack',
    });
    menuObserver.unobserve(entry.target);
  });
}, { threshold: 0.05 });
const menuGrid = document.querySelector('.menu-grid');
if (menuGrid) menuObserver.observe(menuGrid);

/* ---- BENEFICIOS ---- */
const benefitsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    anime({
      targets: entry.target.querySelectorAll('.benefit-card'),
      translateY: [40, 0],
      opacity:    [0, 1],
      duration:   550,
      delay: anime.stagger(90),
      easing: 'easeOutExpo',
    });
    benefitsObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });
const benefitsGrid = document.querySelector('.benefits-grid');
if (benefitsGrid) benefitsObserver.observe(benefitsGrid);

/* ---- SERVICIOS ---- */
const servicesObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    anime({
      targets: entry.target.querySelectorAll('.service-item'),
      translateX: [-30, 0],
      opacity:    [0, 1],
      duration:   500,
      delay: anime.stagger(80),
      easing: 'easeOutExpo',
    });
    servicesObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });
const servicesCards = document.querySelector('.services-cards');
if (servicesCards) servicesObserver.observe(servicesCards);

/* ---- CONTACTO ---- */
const contactObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    anime({
      targets: ['.contact-form', '.contact-map', '.contact-info-item'],
      scale:      [0.94, 1],
      opacity:    [0, 1],
      duration:   600,
      delay: anime.stagger(100),
      easing: 'easeOutBack',
    });
    contactObserver.unobserve(entry.target);
  });
}, { threshold: 0.08 });
const contactSection = document.querySelector('.section-contact');
if (contactSection) contactObserver.observe(contactSection);

/* ---- MENU CARDS: 3D tilt hover ---- */
document.querySelectorAll('.menu-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect  = card.getBoundingClientRect();
    const x     = (e.clientX - rect.left) / rect.width  - 0.5;
    const y     = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px) scale(1.01)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ---- FILTROS DE MENÚ ---- */
const filters = document.querySelectorAll('.menu-filter');
const cards   = document.querySelectorAll('.menu-card');

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const cat = btn.dataset.cat;
    cards.forEach(card => {
      card.classList.toggle('hidden', cat !== 'all' && card.dataset.cat !== cat);
    });

    const visible = [...cards].filter(c => !c.classList.contains('hidden'));
    anime({
      targets: visible,
      scale:   [0.92, 1],
      opacity: [0, 1],
      duration: 400,
      delay: anime.stagger(60),
      easing: 'easeOutBack',
    });
  });
});

/* ---- FORMULARIO → REDIRIGE EL MENSAJE A WHATSAPP ---- */
const NUMERO_WHATSAPP_FORMULARIO = '528995072712';

document.getElementById('contact-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('[type="submit"]');

  const nombre   = form.nombre.value.trim();
  const telefono = form.telefono.value.trim();
  const asunto   = form.asunto.value.trim();
  const mensaje  = form.mensaje.value.trim();

  // Nota: sin emojis aquí a propósito — WhatsApp los corrompe (los vuelve "�")
  // al procesar la redirección de wa.me en algunos casos.
  const lineas = [`¡Hola! Soy ${nombre}.`];
  if (asunto)   lineas.push(`Asunto: ${asunto}`);
  if (telefono) lineas.push(`Mi teléfono: ${telefono}`);
  if (mensaje)  lineas.push(mensaje);

  const texto = encodeURIComponent(lineas.join('\n'));

  const original = btn.textContent;
  btn.textContent = '¡Te llevamos a WhatsApp! 🚀';
  btn.disabled = true;
  anime({ targets: btn, scale: [1, 1.06, 1], duration: 400, easing: 'easeInOutQuad' });

  window.open(`https://wa.me/${NUMERO_WHATSAPP_FORMULARIO}?text=${texto}`, '_blank', 'noopener');

  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
    form.reset();
  }, 2500);
});

/* ---- PARALLAX SUTIL en hero doodles ---- */
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  document.querySelectorAll('.hero-doodle').forEach((d, i) => {
    const speed = 0.05 + i * 0.03;
    d.style.transform = `translateY(${y * speed}px)`;
  });
}, { passive: true });
