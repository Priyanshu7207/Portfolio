/* NAVBAR & FOOTER AUTO-INJECT (appears on every page) */
const HOME = 'index.html'; // change if needed

function isHomePage() {
  const p = location.pathname.replace(/\/+$/, '');
  const last = p.split('/').pop();
  return last === '' || last === HOME;
}
function navHref(id){ return isHomePage() ? `#${id}` : `${HOME}#${id}`; }

function ensureNavbar(){
  if(document.querySelector('.header')) return;
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="scrollbar" aria-hidden="true"></div>
    <header class="header" id="top">
      <nav class="nav container" aria-label="Primary">
        <a href="${navHref('home')}" class="logo" aria-label="Go to home">PS</a>
        <button class="nav-toggle" aria-label="Open menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <ul class="nav-links">
          <li><a class="nav-link" href="${navHref('home')}">Home</a></li>
          <li><a class="nav-link" href="${navHref('about')}">About</a></li>
          <li><a class="nav-link" href="${navHref('skills')}">Skills</a></li>
          <li><a class="nav-link" href="${navHref('projects')}">Projects</a></li>
          <li><a class="nav-link" href="${navHref('resume')}">Resume</a></li>
          <li><a class="nav-link" href="${navHref('contact')}">Contact</a></li>
        </ul>
      </nav>
    </header>
  `);
}
function ensureFooter(){
  if(document.querySelector('.footer')) return;
  document.body.insertAdjacentHTML('beforeend', `
    <footer class="footer">
      <div class="container">
        <div class="footer-top">
          <div class="brand">
            <span class="logo">PS</span>
            <span class="brand-name">Priyanshu Sanjel</span>
          </div>
          <div class="footer-socials" aria-label="Footer social links">
            <a class="foot-social" href="https://www.linkedin.com/in/your-username" target="_blank" rel="noopener" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9h4v12H3zM14.5 9c-2.2 0-3.5 1.2-4 2v-2H7v12h4v-6c0-1.6 1.3-3 3-3s2.5 1 2.5 3v6H21v-6.5C21 11.6 18.7 9 16 9z"/></svg>
              LinkedIn
            </a>
            <a class="foot-social" href="https://www.facebook.com/your-username" target="_blank" rel="noopener" aria-label="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 22v-9h3l1-4h-4V7c0-1.1.4-2 2-2h2V2h-3c-3 0-5 2-5 5v2H7v4h2v9h4z"/></svg>
              Facebook
            </a>
            <a class="foot-social" href="mailto:priyanshu@example.com" aria-label="Email">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"/></svg>
              Email
            </a>
          </div>
        </div>
        <div class="footer-divider"></div>
        <div class="footer-bottom">
          <p class="copy">©️ <span id="year"></span> Priyanshu Sanjel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `);
}

ensureNavbar();
ensureFooter();

/* Layout helper: keep content below the fixed header */
function padForHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  function apply() { document.body.style.paddingTop = header.offsetHeight + 'px'; }
  apply();
  window.addEventListener('resize', apply);
}
padForHeader();

/* Footer year */
const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

/* Mobile nav toggle */
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

/* Scroll progress bar */
const bar = document.querySelector('.scrollbar');
function setScrollProgress() {
  const h = document.body.scrollHeight - innerHeight;
  const pct = Math.min(100, Math.max(0, (scrollY / (h || 1)) * 100));
  if (bar) bar.style.width = pct + '%';
}
addEventListener('scroll', setScrollProgress);
setScrollProgress();

/* Active nav link on scroll (home only) */
const sections = [...document.querySelectorAll('section[id]')];
const navLinks = document.querySelectorAll('.nav-link');
function setActiveLink() {
  if (!isHomePage()) return;
  const pos = scrollY + 140;
  let cur = 'home';
  sections.forEach(s => { if (pos >= s.offsetTop) cur = s.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${cur}`));
}
addEventListener('scroll', setActiveLink);
setActiveLink();

/* Reveal (slide & fade) */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===== Hero role rotator ===== */
const roles = ['C/C++ Developer', 'DevOps Enthusiast', 'Agile Practitioner', 'Problem Solver'];
const rotator = document.getElementById('rotator');
let idx = 0;
setInterval(() => {
  if (!rotator) return;
  idx = (idx + 1) % roles.length;
  rotator.style.opacity = 0; rotator.style.transform = 'translateY(8px)';
  setTimeout(() => { rotator.textContent = roles[idx]; rotator.style.opacity = 1; rotator.style.transform = 'translateY(0)'; }, 220);
}, 2600);

/* Card tilt */
function addTilt(el) {
  const damp = 20;
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const rx = ((y / r.height) - 0.5) * -damp;
    const ry = ((x / r.width) - 0.5) * damp;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = 'translateY(0)'; });
}
document.querySelectorAll('[data-tilt]').forEach(addTilt);

/* Stats count-up */
const counters = document.querySelectorAll('.stat .num');
const counterObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target || el.getAttribute('data-target') || '0', 10);
    let cur = 0; const step = Math.ceil(target / 60);
    const t = setInterval(() => {
      cur += step; if (cur >= target) { cur = target; clearInterval(t); }
      el.textContent = cur;
    }, 16);
    obs.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach(c => counterObserver.observe(c));

/* Contact form (frontend only) */
const form = document.getElementById('contactForm');
const response = document.getElementById('formResponse');
if (form && response) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      response.textContent = 'Please fill out all fields.'; response.style.color = '#ff7a7a'; return;
    }
    response.textContent = 'Thanks! Your message has been sent.'; response.style.color = 'var(--accent)';
    form.reset(); setTimeout(()=> response.textContent='', 4000);
  });
}

/* Back-to-top arrow (show/hide + smooth scroll) */
const toTop = document.querySelector('.to-top-fab');
function toggleToTop() {
  if (!toTop) return;
  if (scrollY > 300) toTop.classList.remove('hidden'); else toTop.classList.add('hidden');
}
toggleToTop();
addEventListener('scroll', toggleToTop);

if (toTop) {
  toTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
function setActiveLink() {
  if (!isHomePage()) return;
  const pos = scrollY + 140;
  let cur = 'home';
  sections.forEach(s => { if (pos >= s.offsetTop) cur = s.id; });
  navLinks.forEach(a => {
    const on = a.getAttribute('href') === `#${cur}`;
    a.classList.toggle('active', on);
    if (on) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}