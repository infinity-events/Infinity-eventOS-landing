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

if (liveDemo) {
  const qr = liveDemo.querySelector('[data-demo-qr]');
  const phone = liveDemo.querySelector('[data-demo-phone]');
  const scanResult = liveDemo.querySelector('[data-scan-result]');
  const scanLine = liveDemo.querySelector('[data-scan-line]');
  const cameraHint = liveDemo.querySelector('[data-camera-hint]');
  const cameraStatus = liveDemo.querySelector('[data-camera-status]');
  const scanState = liveDemo.querySelector('[data-scan-state]');
  const stateTitle = liveDemo.querySelector('[data-state-title]');
  const stateCopy = liveDemo.querySelector('[data-state-copy]');
  const scanTitle = liveDemo.querySelector('[data-scan-title]');
  const scanCopy = liveDemo.querySelector('[data-scan-copy]');
  const person = liveDemo.querySelector('[data-scan-person]');
  const ticket = liveDemo.querySelector('[data-scan-ticket]');
  const entrance = liveDemo.querySelector('[data-scan-entrance]');
  const log = liveDemo.querySelector('[data-scan-log]');
  const logTime = liveDemo.querySelector('[data-scan-log-time]');
  const progress = liveDemo.querySelector('[data-demo-progress]');
  const states = [
    { hint: 'Inquadra il QR del ticket', camera: 'La fotocamera sta cercando un QR', title: 'In attesa della scansione', copy: 'Il ticket apparirà qui appena letto', result: 'QR pronto', resultCopy: 'Inquadra il codice per continuare', person: '—', ticket: '—', entrance: '—', log: 'In attesa di un nuovo evento', time: '—' },
    { hint: 'QR rilevato', camera: 'QR riconosciuto · VF-2026-AL4X9K', title: 'QR rilevato', copy: 'Codice letto dalla fotocamera', result: 'QR riconosciuto', resultCopy: 'VF-2026-AL4X9K', person: 'Alessia Verdi', ticket: 'VF-2026-AL4X9K', entrance: 'Verifica…', log: 'Lettura QR ricevuta', time: '21:42:10' },
    { hint: 'Verifica ticket…', camera: 'Controllo validità in corso', title: 'Verifica ticket', copy: 'Controllo festival, stato e ingresso', result: 'Controllo in corso', resultCopy: 'Verifica con Infinity EventOS…', person: 'Alessia Verdi', ticket: 'VF-2026-AL4X9K', entrance: 'Verifica…', log: 'Validazione ticket in corso', time: '21:42:11' },
    { hint: 'Ticket valido', camera: 'Ticket valido · accesso consentito', title: 'Accesso consentito', copy: 'Ingresso registrato nel festival', result: 'Ticket valido', resultCopy: 'Accesso consentito', person: 'Alessia Verdi', ticket: 'VF-2026-AL4X9K', entrance: 'Consentito', log: 'Ingresso QR registrato', time: '21:42:12' },
    { hint: 'Ticket registrato', camera: 'Scansione completata', title: 'Partecipante registrato', copy: 'La lista partecipanti è aggiornata', result: 'Ingresso registrato', resultCopy: 'Alessia è dentro all’evento', person: 'Alessia Verdi', ticket: 'VF-2026-AL4X9K', entrance: 'Entrato', log: 'Alessia Verdi · QR · ENTRY', time: '21:42:12' },
  ];

  const addQrCell = (filled) => {
    const cell = document.createElement('span');
    if (!filled) cell.className = 'is-empty';
    qr?.appendChild(cell);
  };

  const buildQr = () => {
    if (!qr || qr.children.length) return;
    const size = 21;
    const matrix = Array.from({ length: size }, () => Array(size).fill(null));
    const finder = (row, column) => {
      for (let y = -1; y < 8; y += 1) for (let x = -1; x < 8; x += 1) {
        const r = row + y;
        const c = column + x;
        if (r < 0 || c < 0 || r >= size || c >= size) continue;
        matrix[r][c] = y >= 0 && y < 7 && x >= 0 && x < 7 && (y === 0 || y === 6 || x === 0 || x === 6 || (y >= 2 && y <= 4 && x >= 2 && x <= 4));
      }
    };
    finder(0, 0); finder(0, 14); finder(14, 0);
    for (let row = 0; row < size; row += 1) for (let column = 0; column < size; column += 1) {
      if (matrix[row][column] === null) matrix[row][column] = (row * 17 + column * 11 + row * column) % 7 < 3;
      addQrCell(matrix[row][column]);
    }
  };

  buildQr();
  let currentStep = 0;
  let timer;
  let demoVisible = false;

  const renderDemo = (step) => {
    const state = states[step];
    phone?.classList.toggle('is-success', step >= 3);
    scanResult?.classList.toggle('is-visible', step >= 1);
    scanState?.classList.toggle('is-success', step >= 3);
    if (scanLine) scanLine.style.opacity = step === 2 ? '1' : step >= 3 ? '.35' : '';
    if (cameraHint) cameraHint.textContent = state.hint;
    if (cameraStatus) cameraStatus.textContent = state.camera;
    if (stateTitle) stateTitle.textContent = state.title;
    if (stateCopy) stateCopy.textContent = state.copy;
    if (scanTitle) scanTitle.textContent = state.result;
    if (scanCopy) scanCopy.textContent = state.resultCopy;
    if (person) person.textContent = state.person;
    if (ticket) ticket.textContent = state.ticket;
    if (entrance) entrance.textContent = state.entrance;
    if (log) log.textContent = state.log;
    if (logTime) logTime.textContent = state.time;
    if (progress) progress.style.width = `${((step + 1) / states.length) * 100}%`;
  };

  const startDemo = () => {
    if (timer || !demoVisible) return;
    renderDemo(currentStep);
    if (!reducedMotion) timer = window.setInterval(() => {
      currentStep = (currentStep + 1) % states.length;
      renderDemo(currentStep);
    }, 2300);
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
