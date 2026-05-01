/* ═══════════════════════════════════════════════════════════════════
   SBG Facility – Script
   ═══════════════════════════════════════════════════════════════════ */

// ── Sticky header ──────────────────────────────────────────────────
const header = document.getElementById('header');

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 20);
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// ── Mobile nav ─────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const nav       = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  nav.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});

// Close nav when a link is clicked
nav.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    nav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// Close nav on outside click
document.addEventListener('click', e => {
  if (!header.contains(e.target)) {
    hamburger.classList.remove('open');
    nav.classList.remove('open');
  }
});

// ── Active nav link on scroll ───────────────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

function highlightNav() {
  const scrollY = window.scrollY + 100;
  let current  = '';

  sections.forEach(s => {
    if (scrollY >= s.offsetTop) current = s.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle(
      'active',
      link.getAttribute('href') === '#' + current
    );
  });
}

window.addEventListener('scroll', highlightNav, { passive: true });
highlightNav();

// ── Scroll-to-top button ────────────────────────────────────────────
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

scrollTopBtn.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Fade-in on scroll (IntersectionObserver) ────────────────────────
const fadeEls = document.querySelectorAll(
  '.dienst-card, .sector-item, .testimonial, .kernwaarde, .hero-card, .ci'
);

fadeEls.forEach(el => el.classList.add('fade-up'));

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

fadeEls.forEach(el => observer.observe(el));

// ── Staggered animation for grid items ─────────────────────────────
document.querySelectorAll('.diensten-grid, .sectoren-grid, .testimonials-grid').forEach(grid => {
  grid.querySelectorAll(':scope > *').forEach((child, i) => {
    child.style.transitionDelay = `${i * 80}ms`;
  });
});

// ── Contact form submission ─────────────────────────────────────────
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    if (!validateForm()) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled    = true;
    btn.textContent = 'Verzenden…';

    // Simulate async send (replace with real fetch/API call)
    setTimeout(() => {
      form.reset();
      btn.disabled    = false;
      btn.textContent = 'Verstuur bericht';
      formSuccess.classList.add('visible');

      setTimeout(() => formSuccess.classList.remove('visible'), 6000);
    }, 1200);
  });
}

function validateForm() {
  let valid = true;

  form.querySelectorAll('[required]').forEach(field => {
    const group = field.closest('.form-group') || field.closest('.form-check');
    clearError(group);

    const empty = field.type === 'checkbox' ? !field.checked : !field.value.trim();

    if (empty) {
      showError(group, 'Dit veld is verplicht.');
      valid = false;
    } else if (field.type === 'email' && !isValidEmail(field.value)) {
      showError(group, 'Voer een geldig e-mailadres in.');
      valid = false;
    }
  });

  return valid;
}

function showError(group, msg) {
  if (!group) return;
  group.classList.add('has-error');
  let err = group.querySelector('.form-error');
  if (!err) {
    err = document.createElement('span');
    err.className = 'form-error';
    group.appendChild(err);
  }
  err.textContent = msg;
}

function clearError(group) {
  if (!group) return;
  group.classList.remove('has-error');
  const err = group.querySelector('.form-error');
  if (err) err.remove();
}

function isValidEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

// ── Smooth scroll for anchor links ─────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
