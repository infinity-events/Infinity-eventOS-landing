const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

menuToggle?.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const counter = entry.target;
    const target = Number(counter.dataset.count);
    const started = performance.now();
    const duration = 900;
    const tick = (now) => {
      const progress = Math.min((now - started) / duration, 1);
      counter.textContent = String(Math.round((1 - Math.pow(1 - progress, 3)) * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(counter);
  });
}, { threshold: 0.8 });

document.querySelectorAll('[data-count]').forEach((counter) => counterObserver.observe(counter));

// Lightweight pointer interactions: disabled for touch devices and reduced motion.
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canHover && !reducedMotion) {
  const spotlight = document.querySelector('.cursor-spotlight');
  const heroVisual = document.querySelector('.hero-visual');
  const featureCards = document.querySelectorAll('.feature-card');
  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let spotlightX = pointerX;
  let spotlightY = pointerY;
  let frameRequested = false;

  const renderPointer = () => {
    frameRequested = false;
    spotlightX += (pointerX - spotlightX) * 0.14;
    spotlightY += (pointerY - spotlightY) * 0.14;
    if (spotlight) spotlight.style.left = `${spotlightX}px`;
    if (spotlight) spotlight.style.top = `${spotlightY}px`;
    if (Math.abs(pointerX - spotlightX) > 0.5 || Math.abs(pointerY - spotlightY) > 0.5) {
      frameRequested = true;
      requestAnimationFrame(renderPointer);
    }
  };

  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    document.body.classList.add('has-pointer');
    if (!frameRequested) {
      frameRequested = true;
      requestAnimationFrame(renderPointer);
    }

    if (!heroVisual) return;
    const bounds = heroVisual.getBoundingClientRect();
    if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroVisual.classList.add('is-interactive');
    heroVisual.style.setProperty('--tilt-y', `${x * 7}deg`);
    heroVisual.style.setProperty('--tilt-x', `${y * -5}deg`);
    heroVisual.style.setProperty('--glow-x', `${x * 28}px`);
    heroVisual.style.setProperty('--glow-y', `${y * 22}px`);
    heroVisual.style.setProperty('--card-top-x', `${x * 18}px`);
    heroVisual.style.setProperty('--card-top-y', `${y * 14}px`);
    heroVisual.style.setProperty('--card-bottom-x', `${x * -14}px`);
    heroVisual.style.setProperty('--card-bottom-y', `${y * -10}px`);
  }, { passive: true });

  featureCards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      card.classList.add('is-tilting');
      card.style.setProperty('--card-tilt-y', `${(x - 0.5) * 5}deg`);
      card.style.setProperty('--card-tilt-x', `${(0.5 - y) * 5}deg`);
      card.style.setProperty('--shine-x', `${x * 100}%`);
      card.style.setProperty('--shine-y', `${y * 100}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-tilting');
      card.style.removeProperty('--card-tilt-y');
      card.style.removeProperty('--card-tilt-x');
      card.style.removeProperty('--shine-x');
      card.style.removeProperty('--shine-y');
    });
  });
}

const liveDemo = document.querySelector('[data-live-demo]');

if (liveDemo && !reducedMotion) {
  const steps = [...liveDemo.querySelectorAll('[data-demo-step]')];
  const status = liveDemo.querySelector('[data-demo-status]');
  const time = liveDemo.querySelector('[data-demo-time]');
  const attendees = liveDemo.querySelector('[data-demo-attendees]');
  const wallet = liveDemo.querySelector('[data-demo-wallet]');
  const walletChange = liveDemo.querySelector('[data-demo-wallet-change]');
  const action = liveDemo.querySelector('[data-demo-action]');
  const toast = liveDemo.querySelector('[data-demo-toast]');
  const toastTitle = liveDemo.querySelector('[data-demo-toast-title]');
  const toastCopy = liveDemo.querySelector('[data-demo-toast-copy]');
  const progress = liveDemo.querySelector('[data-demo-progress]');
  const bars = [...liveDemo.querySelectorAll('.demo-bars i')];
  const states = [
    { status: 'Ticket in attesa', action: 'In attesa di scansione', title: 'Ticket pronto', copy: 'Il prossimo ingresso è pronto', attendee: '3.842', wallet: '€ 0', walletChange: 'In attesa' },
    { status: 'QR validato', action: 'Ingresso autorizzato', title: 'Accesso registrato', copy: 'Alessia è appena entrata', attendee: '3.843', wallet: '€ 0', walletChange: 'Wallet da attivare' },
    { status: 'Braccialetto attivato', action: 'Profilo associato', title: 'Braccialetto attivo', copy: 'Profilo cashless sincronizzato', attendee: '3.843', wallet: '€ 0', walletChange: 'Pronto all’uso' },
    { status: 'Primo acquisto', action: 'Transazione completata', title: 'Wallet aggiornato', copy: 'Pagamento cashless confermato', attendee: '3.843', wallet: '€ 25', walletChange: '+€ 25 oggi' },
  ];
  let currentStep = 0;
  let timer;
  let demoVisible = false;

  const renderDemo = (step) => {
    const state = states[step];
    steps.forEach((item, index) => item.classList.toggle('is-active', index <= step));
    if (status) status.textContent = state.status;
    if (time) time.textContent = `21:4${2 + step}`;
    if (attendees) attendees.textContent = state.attendee;
    if (wallet) wallet.textContent = state.wallet;
    if (walletChange) walletChange.textContent = state.walletChange;
    if (action) action.textContent = state.action;
    if (toastTitle) toastTitle.textContent = state.title;
    if (toastCopy) toastCopy.textContent = state.copy;
    if (toast) {
      toast.classList.remove('is-visible');
      requestAnimationFrame(() => toast.classList.add('is-visible'));
    }
    if (progress) progress.style.width = `${((step + 1) / states.length) * 100}%`;
    bars.forEach((bar, index) => bar.classList.toggle('is-growing', index >= 8 - step && index < 9 + step));
  };

  const nextDemoStep = () => {
    currentStep = (currentStep + 1) % states.length;
    renderDemo(currentStep);
  };

  const startDemo = () => {
    if (timer || !demoVisible) return;
    renderDemo(currentStep);
    timer = window.setInterval(nextDemoStep, 2700);
  };

  const stopDemo = () => {
    window.clearInterval(timer);
    timer = undefined;
  };

  const demoObserver = new IntersectionObserver(([entry]) => {
    demoVisible = entry.isIntersecting;
    if (demoVisible) startDemo();
    else stopDemo();
  }, { threshold: 0.25 });
  demoObserver.observe(liveDemo);
}
