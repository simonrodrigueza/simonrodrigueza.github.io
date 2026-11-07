// Sigue el scroll: calcula en qué etapa va el disco, marca la sección
// activa, tiñe el fondo y maneja el interruptor de la animación.
import { Detector } from './detector.js';

const html = document.documentElement;
const root = document.querySelector('[data-page]');
const stages = JSON.parse(root.dataset.visuals);
const lang = root.dataset.lang;
const sections = [...document.querySelectorAll('[data-section]')];
const links = [...document.querySelectorAll('[data-target]')];
const plateCaption = document.querySelector('[data-plate-caption]');
const plateText = document.querySelector('[data-plate-text]');
const animSwitch = document.querySelector('[data-anim-switch]');
const langSwitch = document.querySelector('[data-lang-switch]');
const canvas = document.querySelector('[data-detector]');
const header = document.querySelector('[data-header]');

const hex = (v) => Math.round(v).toString(16).padStart(2, '0');
const mix = (a, b, f) => {
  const x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16);
  const ch = (n, s) => (n >> s) & 255;
  return '#' + [16, 8, 0].map((s) => hex(ch(x, s) + (ch(y, s) - ch(x, s)) * f)).join('');
};
const isNarrow = () => window.innerWidth <= 760;
const animOn = () => html.classList.contains('anim-on');

let detector = null;
let active = -1;

function ensureDetector() {
  if (!detector && canvas) {
    detector = new Detector(canvas, { stages, nameLines: JSON.parse(canvas.dataset.name), lang });
  }
}

// Zona de lectura: debajo del encabezado fijo (escritorio) o de la franja del detector (celular)
function readingTop() {
  if (isNarrow()) return animOn() ? 300 : 0;
  return header ? header.offsetHeight : 0;
}

// S es continuo. La sección i "empieza" cuando su borde superior llega a la línea de lectura:
// en ese momento el disco está exactamente en la etapa i, y avanza hacia la etapa i+1
// a medida que se lee esa sección. Así la sección que se lee y la etapa siempre coinciden.
function computeStage() {
  const top = readingTop();
  const lineY = top + (window.innerHeight - top) * 0.3; // línea de lectura, en px desde arriba
  const y = window.scrollY;
  const n = sections.length;
  const starts = sections.map((s, i) => (i === 0 ? 0 : Math.max(0, s.getBoundingClientRect().top + y - lineY)));
  const atBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 4;
  if (atBottom || y >= starts[n - 1]) return { S: n - 1, idx: n - 1 };
  for (let i = 0; i < n - 1; i++) {
    if (y >= starts[i] && y < starts[i + 1]) {
      const f = (y - starts[i]) / Math.max(1, starts[i + 1] - starts[i]);
      return { S: i + f, idx: i };
    }
  }
  return { S: 0, idx: 0 };
}

function setActive(idx) {
  if (idx === active) return;
  active = idx;
  const sec = sections[idx];
  const st = stages.find((x) => x.id === sec.dataset.section) || stages[idx];
  sections.forEach((s, i) => s.classList.toggle('is-active', i === idx));
  links.forEach((a) => {
    if (a.dataset.target === sec.dataset.section) {
      a.setAttribute('aria-current', 'true');
      const nav = a.parentElement;
      if (nav && nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: a.offsetLeft - 16, behavior: 'smooth' });
    } else a.removeAttribute('aria-current');
  });
  root.style.setProperty('--accent', st.color);
  root.style.setProperty('--ground', mix('#0B0C10', st.color, 0.07));
  if (plateCaption) plateCaption.textContent = `${lang === 'es' ? 'Lámina' : 'Plate'} ${st.roman}.`;
  if (plateText) plateText.textContent = st.plate[lang];
  if (langSwitch) langSwitch.hash = sec.dataset.section;
}

let ticking = false;
function update() {
  ticking = false;
  const { S, idx } = computeStage();
  setActive(idx);
  if (detector && animOn()) detector.setStage(S);
}
const requestUpdate = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
window.addEventListener('scroll', requestUpdate, { passive: true });
window.addEventListener('resize', requestUpdate);

function setAnim(on, save) {
  html.classList.toggle('anim-on', on);
  html.classList.toggle('anim-off', !on);
  if (animSwitch) {
    animSwitch.setAttribute('aria-checked', String(on));
    const state = animSwitch.querySelector('[data-anim-state]');
    if (state) state.textContent = on ? 'ON' : 'OFF';
  }
  if (save) { try { localStorage.setItem('sra-anim', on ? 'on' : 'off'); } catch (err) { /* sin almacenamiento */ } }
  if (on) ensureDetector();
  if (detector) detector.enable(on);
  requestUpdate();
}
if (animSwitch) animSwitch.addEventListener('click', () => setAnim(!animOn(), true));

function scrollToSection(id, smooth = true) {
  const sec = sections.find((s) => s.dataset.section === id);
  if (!sec) return;
  const idx = sections.indexOf(sec);
  const y = idx === 0 ? 0 : sec.getBoundingClientRect().top + window.scrollY - readingTop() + 1;
  window.scrollTo({ top: Math.max(0, y), behavior: smooth ? 'smooth' : 'auto' });
}
links.forEach((a) =>
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const id = a.dataset.target;
    history.replaceState(null, '', `#${id}`);
    scrollToSection(id);
  }),
);

setAnim(animOn(), false);
const fromHash = location.hash.slice(1);
if (fromHash && sections.some((s) => s.dataset.section === fromHash)) {
  requestAnimationFrame(() => scrollToSection(fromHash, false));
}
update();
