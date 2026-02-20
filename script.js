/* ── script.js ── */

/* ═══════════════════════════════
   NAVBAR — scroll + hamburger
═══════════════════════════════ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ═══════════════════════════════
   ACTIVE NAV LINK on scroll
═══════════════════════════════ */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  let current    = '';

  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });

  links.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

/* ═══════════════════════════════
   PROJECTS SLIDER
═══════════════════════════════ */
const track      = document.getElementById('projectsTrack');
const btnLeft    = document.getElementById('projLeft');
const btnRight   = document.getElementById('projRight');
const dotsWrap   = document.getElementById('projDots');

const CARD_WIDTH  = 300 + 24; // card + gap
const VISIBLE     = getVisibleCount();
const TOTAL       = track.children.length;
let   currentIdx  = 0;

function getVisibleCount() {
  if (window.innerWidth <= 480) return 1;
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 1100) return 2;
  return 3;
}

// Build dots
function buildDots() {
  dotsWrap.innerHTML = '';
  const vis   = getVisibleCount();
  const pages = TOTAL - vis + 1;
  for (let i = 0; i < pages; i++) {
    const dot = document.createElement('button');
    dot.classList.add('proj-dot');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  }
}

function updateDots() {
  document.querySelectorAll('.proj-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIdx);
  });
}

function goTo(idx) {
  const vis   = getVisibleCount();
  const max   = TOTAL - vis;
  currentIdx  = Math.max(0, Math.min(idx, max));

  const cardW = track.children[0].offsetWidth + 24;
  track.style.transform = `translateX(-${currentIdx * cardW}px)`;

  btnLeft.disabled  = currentIdx === 0;
  btnRight.disabled = currentIdx >= max;
  updateDots();
}

btnLeft.addEventListener('click',  () => goTo(currentIdx - 1));
btnRight.addEventListener('click', () => goTo(currentIdx + 1));

// Touch / swipe support
let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
track.addEventListener('touchend',   e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) goTo(currentIdx + (dx < 0 ? 1 : -1));
});

buildDots();
goTo(0);

window.addEventListener('resize', () => {
  buildDots();
  goTo(Math.min(currentIdx, TOTAL - getVisibleCount()));
});

/* ═══════════════════════════════
   CONTACT FORM
═══════════════════════════════ */
const form    = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');

form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
  btn.disabled  = true;

  setTimeout(() => {
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    btn.disabled  = false;
    success.classList.add('show');
    form.reset();
    setTimeout(() => success.classList.remove('show'), 5000);
  }, 1600);
});

/* ═══════════════════════════════
   SCROLL REVEAL (Intersection Observer)
═══════════════════════════════ */
const revealEls = document.querySelectorAll(
  '.service-card, .project-card, .about-img-card, .value-item, .detail-item, .stat'
);

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity  = '1';
      entry.target.style.transform = entry.target.style.transform.replace('translateY(30px)', 'translateY(0)');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach((el, i) => {
  el.style.opacity   = '0';
  el.style.transform = (el.style.transform || '') + ' translateY(30px)';
  el.style.transition = `opacity 0.55s ease ${i * 0.06}s, transform 0.55s ease ${i * 0.06}s, border-color 0.35s, box-shadow 0.35s, background 0.35s`;
  io.observe(el);
});
