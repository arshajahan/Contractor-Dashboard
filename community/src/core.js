/* Buzzin community dashboards: shared core.
   Used by all three files (Community Admin, Approver, Events). Plain JS, no build tools needed to run it. */
'use strict';
if (window.pdfjsLib) window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js';

/* ================= Constants & utilities ================= */
const TODAY = '2026-10-12';                 // The design preview "today" (a Monday)
const NOW = new Date('2026-10-12T09:30:00'); // and the time of day
const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  pass: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  plusCircle: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  file: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
  car: '<path d="M5 17H3v-5l2-5h14l2 5v5h-2"/><path d="M3 12h18"/><circle cx="7.5" cy="17" r="1.8"/><circle cx="16.5" cy="17" r="1.8"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 0 1 4.9.7c0 1.7-2.4 2.3-2.4 3.8M12 17h.01"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  right: '<path d="m9 6 6 6-6 6"/>',
  left: '<path d="m15 6-6 6 6 6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  alert: '<path d="M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 17v3h16v-3"/>',
  upload: '<path d="M12 16V4m-5 5 5-5 5 5M4 17v3h16v-3"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4"/>',
  more: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
  building: '<path d="M4 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17M15 9h4a1 1 0 0 1 1 1v11M8 7h3M8 11h3M8 15h3M3 21h18"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  box: '<path d="m21 8-9-5-9 5 9 5zM3 8v8l9 5 9-5V8M12 13v8"/>',
  pen: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  arrowR: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  arrowL: '<path d="M19 12H5m6-6-6 6 6 6"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  receipt: '<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2zM9 8h6M9 12h6"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
  send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
  qr: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 12l2 2 4-4"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3M15 8l2 2"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5zM3 13l9 5 9-5"/>',
  ticket: '<path d="M3 8a2 2 0 0 0 0 4v0a2 2 0 0 1 0 4v2h18v-2a2 2 0 0 1 0-4 2 2 0 0 0 0-4V6H3zM14 6v12"/>',
  chart: '<path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3M20 16V6"/>',
  sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  inbox: '<path d="M3 13h5l1 3h6l1-3h5M3 13l3-8h12l3 8v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>',
  scan: '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16"/>',
  userCheck: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 11l2 2 4-4"/>',
  userX: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M17 9l4 4M21 9l-4 4"/>',
  ban: '<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  tag: '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="8" cy="8" r="1.4"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1.2 0 2-.8 2-1.8 0-1.4-1-1.7-1-2.7 0-.9.7-1.5 1.6-1.5H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
  trend: '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  megaphone: '<path d="M3 11v2a1 1 0 0 0 1 1h3l8 4V6L7 10H4a1 1 0 0 0-1 1zM19 9a4 4 0 0 1 0 6"/>',
  gate: '<path d="M4 21V5M20 21V5M4 8h16M4 14h16M8 8v13M16 8v13"/>',
  hammer: '<path d="m14 7 3-3 3 3-3 3zM14 7 4 17l3 3 10-10M10 11l3 3"/>',
  save: '<path d="M5 4h11l3 3v13H5zM8 4v5h7M8 20v-6h8v6"/>',
  undo: '<path d="M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3"/>',
  grip: '<circle cx="9" cy="6" r="1.2"/><circle cx="15" cy="6" r="1.2"/><circle cx="9" cy="12" r="1.2"/><circle cx="15" cy="12" r="1.2"/><circle cx="9" cy="18" r="1.2"/><circle cx="15" cy="18" r="1.2"/>',
  up: '<path d="m6 15 6-6 6 6"/>',
  bold: '<path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z"/>',
  italic: '<path d="M10 5h8M6 19h8M14 5l-4 14"/>',
  zap: '<path d="M13 3 4 14h7l-1 7 9-11h-7z"/>',
  logIn: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>',
  building2: '<path d="M4 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17M15 9h4a1 1 0 0 1 1 1v11M8 7h3M8 11h3M8 15h3M3 21h18"/>',
  home2: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM9 21v-6h6v6"/>',
};

const ic = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clone = o => JSON.parse(JSON.stringify(o));
const uid = p => p + Math.random().toString(36).slice(2, 7);
const D = s => new Date(s + 'T00:00:00');
const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const addDays = (s, n) => { const d = D(s); d.setDate(d.getDate() + n); return iso(d); };
const fmt = s => s ? D(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const fmtS = s => s ? D(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—';
const fmtDay = s => D(s).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
const range = (a, b) => !a ? 'Dates not set' : (!b || a === b) ? fmt(a) : (a.slice(0, 4) === b.slice(0, 4) ? fmtS(a) + ' – ' + fmt(b) : fmt(a) + ' – ' + fmt(b));
const days = s => Math.round((D(s) - D(TODAY)) / 864e5);
const hoursAgo = ts => Math.max(0, Math.round((NOW - new Date(ts)) / 36e5));
const fmtDT = ts => { const d = new Date(ts); return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); };
const fmtT = ts => new Date(ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
const initials = n => String(n || '?').split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
const plural = (n, w, p) => `${n} ${n === 1 ? w : (p || w + 's')}`;
const sizeTxt = b => !b ? '' : b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
const sum = a => a.reduce((x, y) => x + y, 0);
const uniq = a => [...new Set(a)];
const loadImg = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('This image could not be read. Use a PNG or JPG.')); i.src = src; });
function ageText(h) { return h < 24 ? `${h} h` : `${Math.floor(h / 24)} d ${h % 24} h`; }
function expiry(date, noExp) {
  if (noExp) return { tone: 'neutral', label: 'No expiry' };
  if (!date) return { tone: 'neutral', label: 'Not set' };
  const n = days(date);
  if (n < 0) return { tone: 'bad', label: 'Expired ' + fmt(date) };
  if (n <= 30) return { tone: 'warn', label: `Expires in ${plural(n, 'day')}` };
  return { tone: 'ok', label: 'Valid to ' + fmt(date) };
}
const badge = (label, tone = 'neutral') => `<span class="badge badge-${tone}"><i></i>${esc(label)}</span>`;
function btn(label, o = {}) {
  const v = o.v || 'secondary';
  const attrs = [o.go ? `data-go="${o.go}"` : '', o.act ? `data-act="${o.act}"` : '', o.id != null ? `data-id="${esc(o.id)}"` : '', o.pop ? `data-pop="${o.pop}"` : '', o.disabled ? 'disabled' : '', o.title ? `title="${esc(o.title)}" aria-label="${esc(o.title)}"` : '', o.attrs || ''].join(' ');
  return `<button type="button" class="btn btn-${v} ${o.sm ? 'btn-sm' : ''} ${o.icon && !label ? 'btn-icon' : ''} ${o.cls || ''}" ${attrs}>${o.icon ? ic(o.icon) : ''}${label ? esc(label) : ''}${o.iconR ? ic(o.iconR) : ''}</button>`;
}

/* ================= State ================= */
let S = null;                 // the data store for this file (Work permits, or Events)
let STORE_KEY = 'buzzin-community';
const ui = { pop: null, popRect: null, q: {}, modal: null, tab: {}, search: {}, filters: {}, form: null, formTab: null, dirty: false, errs: {}, chartView: {}, theme: null, sort: {}, sel: {}, openStage: null };
try { ui.theme = localStorage.getItem('buzzin-theme'); } catch (e) { /* ignore */ }
const applyTheme = () => { if (ui.theme) document.documentElement.setAttribute('data-theme', ui.theme); else document.documentElement.removeAttribute('data-theme'); };
applyTheme();
const persist = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); return true; } catch (e) { if (e && e.name === 'QuotaExceededError') toast('This browser is out of space for the preview. Use a smaller file.', { err: true }); return false; } };
const ACT = {}; const CHANGE = {}; const MODALS = {}; const ROUTES = {}; const PREFIX = [];
const registerRoute = (name, fn) => { ROUTES[name] = fn; };
const registerPrefix = (prefix, fn) => { PREFIX.push([prefix, fn]); };

/* ================= Binding (data-bind="f.company.name") ================= */
function bindRoot(b) {
  const [r, ...path] = b.split('.');
  const obj = { f: ui.form, m: ui.modal && ui.modal.data, s: S }[r];
  return { obj, path };
}
function getB(b) {
  if (!b) return '';
  let { obj: o, path } = bindRoot(b);
  for (const k of path) { if (o == null) return ''; o = o[k]; }
  return o ?? '';
}
function setB(b, val) {
  const { obj, path } = bindRoot(b);
  if (!obj) return;
  let o = obj;
  for (let i = 0; i < path.length - 1; i++) o = o[path[i]] ?? (o[path[i]] = {});
  o[path[path.length - 1]] = val;
}

/* ================= Form controls ================= */
function F(o) {
  const v = o.value !== undefined ? o.value : getB(o.bind);
  const err = o.err;
  const common = `id="${o.id}" ${o.bind ? `data-bind="${o.bind}"` : ''} ${o.rerender ? 'data-rerender' : ''} ${o.disabled ? 'disabled' : ''} ${err ? `aria-invalid="true" aria-describedby="${o.id}-err"` : ''} ${o.req ? 'aria-required="true"' : ''} ${o.attrs || ''}`;
  let ctl;
  if (o.options) {
    ctl = `<select class="select" ${common}>${o.ph ? `<option value="">${esc(o.ph)}</option>` : ''}${o.options.map(x => { const [val, lab] = Array.isArray(x) ? x : [x, x]; return `<option value="${esc(val)}" ${String(v) === String(val) ? 'selected' : ''}>${esc(lab)}</option>`; }).join('')}</select>`;
  } else if (o.type === 'textarea') {
    ctl = `<textarea class="textarea" rows="${o.rows || 3}" placeholder="${esc(o.ph || '')}" ${common}>${esc(v)}</textarea>`;
  } else {
    ctl = `<input class="input" type="${o.type || 'text'}" value="${esc(v)}" placeholder="${esc(o.ph || '')}" ${common}>`;
  }
  if (o.addon) ctl = `<div class="input-group">${ctl}<span class="addon">${esc(o.addon)}</span></div>`;
  if (o.searchIcon) ctl = `<div class="search">${ic('search')}${ctl}</div>`;
  return `<div class="field ${o.full ? 'full' : ''} ${err ? 'invalid' : ''}" ${o.wrapAttrs || ''}>${o.label ? `<label class="label" for="${o.id}">${esc(o.label)}${o.req ? '<span class="req" aria-hidden="true">*</span>' : ''}${o.opt ? '<span class="opt">(optional)</span>' : ''}</label>` : ''}${ctl}${err ? `<span class="err" id="${o.id}-err">${ic('alert')}${esc(err)}</span>` : o.hint ? `<span class="hint">${o.hint}</span>` : ''}</div>`;
}
const check = (id, bind, label, sub = '', rerender = false) => `<label class="check" for="${id}"><input type="checkbox" id="${id}" data-bind="${bind}" ${rerender ? 'data-rerender' : ''} ${getB(bind) ? 'checked' : ''}><span>${label}${sub ? `<small>${sub}</small>` : ''}</span></label>`;
const sw = (id, bind, label, sub = '', rerender = true, act = '') => `<label class="switch" for="${id}"><input type="checkbox" id="${id}" ${bind ? `data-bind="${bind}"` : ''} ${act ? `data-change="${act}"` : ''} ${rerender ? 'data-rerender' : ''} ${(bind ? getB(bind) : false) ? 'checked' : ''}><span class="track"></span><span class="txt"><b>${label}</b>${sub ? `<small>${sub}</small>` : ''}</span></label>`;
const seg = (name, bind, opts, rerender = false) => `<div class="segmented" role="radiogroup">${opts.map(([v, l]) => `<label><input type="radio" name="${name}" value="${v}" data-bind="${bind}" ${rerender ? 'data-rerender' : ''} ${getB(bind) === v ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div>`;

/* Searchable dropdown (combobox). Single value or multi (array). */
const COMBOS = {};
function combo(o) {
  COMBOS[o.id] = o;
  const val = getB(o.bind);
  const multi = Array.isArray(val);
  const open = ui.pop === 'combo:' + o.id;
  const lab = v => { const f = o.options.find(x => x.value === v); return f ? f.label : v; };
  const shown = multi
    ? (val.length ? `<span class="chips">${val.map(v => `<span class="chip">${esc(lab(v))}<button type="button" data-act="comboRemove" data-id="${o.id}" data-v="${esc(v)}" aria-label="Remove ${esc(lab(v))}">${ic('x')}</button></span>`).join('')}</span>` : `<span class="ph">${esc(o.ph || 'Select')}</span>`)
    : (val ? `<span class="grow">${esc(lab(val))}</span>` : `<span class="ph grow">${esc(o.ph || 'Select')}</span>`);
  return `<div class="field ${o.full ? 'full' : ''} ${o.err ? 'invalid' : ''}">
    <span class="label" id="${o.id}-lbl">${esc(o.label)}${o.req ? '<span class="req">*</span>' : ''}${o.opt ? '<span class="opt">(optional)</span>' : ''}</span>
    <div class="pop-anchor">
      <div class="combo-btn" role="combobox" tabindex="0" id="${o.id}" aria-labelledby="${o.id}-lbl" aria-expanded="${open}" data-pop="combo:${o.id}">${shown}${ic('down', 'chev')}</div>
      ${open ? `<div class="popover" role="listbox"><div class="pop-search">${ic('search')}<input id="${o.id}-q" data-q="${o.id}" placeholder="${esc(o.searchPh || 'Search')}" value="${esc(ui.q[o.id] || '')}" autocomplete="off"></div><div class="pop-list" id="${o.id}-list">${comboList(o)}</div></div>` : ''}
    </div>
    ${o.err ? `<span class="err">${ic('alert')}${esc(o.err)}</span>` : o.hint ? `<span class="hint">${o.hint}</span>` : ''}
  </div>`;
}
function comboList(o) {
  COMBOS[o.id] = o;
  const val = getB(o.bind);
  const q = (ui.q[o.id] || '').toLowerCase();
  const items = o.options.filter(x => !q || (x.label + ' ' + (x.meta || '')).toLowerCase().includes(q));
  if (!items.length) return `<div class="pop-empty">No matches for “${esc(ui.q[o.id])}”</div>`;
  return items.map(x => { const sel = Array.isArray(val) ? val.includes(x.value) : val === x.value; return `<button type="button" class="pop-item" role="option" aria-selected="${sel}" data-act="comboPick" data-id="${o.id}" data-v="${esc(x.value)}">${Array.isArray(val) ? `<input type="checkbox" tabindex="-1" ${sel ? 'checked' : ''} style="accent-color:var(--side)">` : ''}<span class="grow">${esc(x.label)}${x.meta ? `<small>${esc(x.meta)}</small>` : ''}</span>${sel && !Array.isArray(val) ? ic('check', 'tick') : ''}</button>`; }).join('');
}

/* ================= Logo tile ================= */
function logoTile(logo, name, size) {
  if (!logo || !logo.data) return `<span class="logo-tile ${size} initials" aria-label="${esc(name)}">${initials(name)}</span>`;
  const bg = logo.bg && logo.bg !== 'auto' ? logo.bg : (logo.tone === 'light' ? 'dark' : 'light');
  return `<span class="logo-tile ${size} on-${bg}"><img src="${logo.data}" alt="${esc(name)} logo"></span>`;
}
async function prepareLogo(file) {
  const src = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(file); });
  const img = await loadImg(src);
  const w0 = img.naturalWidth || 400, h0 = img.naturalHeight || 400, scale = Math.min(1, 480 / Math.max(w0, h0));
  const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w0 * scale)); c.height = Math.max(1, Math.round(h0 * scale));
  const x = c.getContext('2d'); x.drawImage(img, 0, 0, c.width, c.height);
  const p = x.getImageData(0, 0, c.width, c.height).data;
  let s = 0, n = 0, transparent = 0;
  for (let i = 0; i < p.length; i += 16) { const a = p[i + 3] / 255; if (a < 0.15) { transparent++; continue; } s += (0.2126 * p[i] + 0.7152 * p[i + 1] + 0.0722 * p[i + 2]) / 255 * a; n += a; }
  const lum = n ? s / n : 0.5, hasTransparency = transparent > p.length / 16 * 0.05;
  return { data: c.toDataURL('image/png'), tone: hasTransparency && lum > 0.62 ? 'light' : 'dark', bg: 'auto', name: file.name };
}

/* ================= Layout helpers ================= */
const pageHead = (title, sub, actions = '', crumbs = null) => `<div class="page-head"><div>${crumbs ? `<nav class="crumbs" aria-label="Breadcrumb">${crumbs.map(([l, g], i) => (i ? ic('right') : '') + (g ? `<button data-go="${g}">${esc(l)}</button>` : `<span>${esc(l)}</span>`)).join('')}</nav>` : ''}<h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div>${actions ? `<div class="row">${actions}</div>` : ''}</div>`;
const card = (title, body, o = {}) => `<section class="card ${o.cls || ''}" ${o.id ? `id="${o.id}"` : ''}>${title ? `<div class="card-head"><div><h2>${title}</h2>${o.sub ? `<p>${o.sub}</p>` : ''}</div>${o.action ? `<div class="row">${o.action}</div>` : ''}</div>` : ''}${o.raw ? body : `<div class="card-body ${o.tight ? 'tight' : ''}">${body}</div>`}${o.foot ? `<div class="card-foot">${o.foot}</div>` : ''}</section>`;
const alertBox = (tone, title, body = '', action = '', icon) => `<div class="alert alert-${tone}" role="${tone === 'bad' ? 'alert' : 'status'}">${ic(icon || ({ ok: 'check', warn: 'alert', bad: 'alert', info: 'info' }[tone]))}<div class="grow"><strong>${title}</strong>${body ? `<p>${body}</p>` : ''}</div>${action ? `<div class="row">${action}</div>` : ''}</div>`;
const emptyState = (icon, title, body, action = '') => `<div class="empty"><span class="ic">${ic(icon)}</span><h3>${title}</h3><p class="small">${body}</p>${action}</div>`;
const tabsBar = (id, tabs, current) => `<div class="tabs" role="tablist">${tabs.map(([k, l, n]) => `<button class="tab ${current === k ? 'active' : ''}" role="tab" aria-selected="${current === k}" data-act="tab" data-id="${id}:${k}">${l}${n != null ? `<span class="count">${n}</span>` : ''}</button>`).join('')}</div>`;
const curTab = (id, def) => ui.tab[id] || def;
function kpi({ label, value, sub, icon, tone = 'neutral', go, spark, subTone }) {
  return `<button class="kpi" ${go ? `data-go="${go}"` : 'disabled'}><span class="top">${label}<span class="ic tone-${tone}">${ic(icon)}</span></span><span class="val-row"><span class="val num">${value}</span>${spark ? sparkline(spark) : ''}</span><span class="sub ${subTone || ''}">${sub || ''}</span></button>`;
}
function qrSvg(seedStr) {
  let h = 0; for (const c of seedStr) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const n = 21; let cells = '';
  const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#142033"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#142033"/>`;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if ((x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12)) continue;
    h = (h * 1103515245 + 12345) >>> 0;
    if ((h >>> 16) & 1) cells += `<rect x="${x}" y="${y}" width="1" height="1" fill="#142033"/>`;
  }
  return `<svg viewBox="0 0 21 21" shape-rendering="crispEdges" role="img" aria-label="Sample QR placeholder"><rect width="21" height="21" fill="#fff"/>${cells}${finder(0, 0)}${finder(14, 0)}${finder(0, 14)}</svg>`;
}

/* ================= Charts (HTML + SVG; every chart has hover tips and a table view) ================= */
const tipAttr = t => `data-tip="${esc(t)}"`;
function hbars(rows, o = {}) {
  const max = o.max || Math.max(1, ...rows.map(r => r.value));
  return `<div class="hbars" role="list">${rows.map(r => `<div class="hb ${r.go ? 'link' : ''}" role="listitem" ${r.go ? `data-go="${r.go}"` : ''} tabindex="0" ${tipAttr(r.tip || `${r.label}: ${r.value}`)}><span class="hb-l" title="${esc(r.label)}">${esc(r.label)}</span><span class="hb-t"><i style="width:${Math.max(r.value ? 2 : 0, r.value / max * 100)}%;background:${r.color || 'var(--seq-450)'}"></i></span><b class="hb-v num">${r.value}${o.unit || ''}</b></div>`).join('')}</div>`;
}
function stackBar(segs, o = {}) {
  const total = sum(segs.map(s => s.value)) || 1;
  return `<div class="stackbar" role="img" aria-label="${esc(segs.map(s => `${s.label} ${s.value}`).join(', '))}">${segs.filter(s => s.value > 0).map(s => `<span class="seg" style="flex:${s.value};background:${s.color}" tabindex="0" ${tipAttr(`${s.label}: ${s.value} (${Math.round(s.value / total * 100)}%)`)}></span>`).join('')}</div>`;
}
function legend(items) {
  return `<ul class="legend">${items.map(i => `<li><span class="sw" style="background:${i.color}"></span>${esc(i.label)}${i.value != null ? `<b class="num">${i.value}</b>` : ''}</li>`).join('')}</ul>`;
}
// Stacked or single columns. cols: [{label, sub, values:[n,...], flag, tip}], series: [{label,color}]
function columns(cols, series, o = {}) {
  const totals = cols.map(c => sum(c.values));
  const max = o.max || Math.max(1, ...totals), ticks = niceTicks(max), top = ticks[ticks.length - 1];
  return `<div class="cols" style="--n:${cols.length}"><div class="cols-y">${ticks.slice().reverse().map(t => `<span>${t}</span>`).join('')}</div><div class="cols-plot">
    <div class="cols-grid">${ticks.map(() => '<i></i>').join('')}</div>
    <div class="cols-bars">${cols.map((c, i) => `<div class="col ${c.flag ? 'flag' : ''}" ${c.go ? `data-go="${c.go}"` : ''} tabindex="0" ${tipAttr(c.tip || `${c.label}\n` + series.map((s, k) => `${s.label}: ${c.values[k]}`).join('\n'))}><div class="col-stack">${series.map((s, k) => c.values[k] ? `<span class="cseg" style="height:${c.values[k] / top * 100}%;background:${s.color}"></span>` : '').join('')}</div></div>`).join('')}</div>
    <div class="cols-x">${cols.map(c => `<span class="${c.flag ? 'flag' : ''}"><b>${esc(c.label)}</b>${c.sub ? `<small>${esc(c.sub)}</small>` : ''}</span>`).join('')}</div></div></div>`;
}
function niceTicks(max) {
  const step = max <= 4 ? 1 : max <= 10 ? 2 : max <= 20 ? 5 : max <= 50 ? 10 : max <= 100 ? 20 : Math.pow(10, String(Math.ceil(max / 5)).length - 1) * Math.ceil(max / 5 / Math.pow(10, String(Math.ceil(max / 5)).length - 1));
  const t = [0]; while (t[t.length - 1] < max) t.push(t[t.length - 1] + step); return t;
}
// Line chart. labels: x labels. series: [{label,color,values}]
function lineChart(labels, series, o = {}) {
  const max = o.max || Math.max(1, ...series.flatMap(s => s.values)), ticks = niceTicks(max), top = ticks[ticks.length - 1], n = labels.length;
  const X = i => n === 1 ? 50 : 4 + i * (92 / (n - 1)), Y = v => 100 - v / top * 100;
  const path = s => s.values.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(2)},${Y(v).toFixed(2)}`).join(' ');
  return `<div class="line"><div class="cols-y">${ticks.slice().reverse().map(t => `<span>${t}</span>`).join('')}</div><div class="line-plot">
    <div class="cols-grid">${ticks.map(() => '<i></i>').join('')}</div>
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${series.map((s, k) => `${series.length === 1 ? `<path d="${path(s)} L${X(n - 1)},100 L${X(0)},100 Z" fill="${s.color}" opacity=".1"/>` : ''}<path d="${path(s)}" fill="none" stroke="${s.color}" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/>`).join('')}</svg>
    ${series.map(s => `<span class="end-dot" style="left:${X(n - 1)}%;top:${Y(s.values[n - 1])}%;background:${s.color}"></span>`).join('')}
    <div class="line-hover" style="--n:${n}">${labels.map((l, i) => `<span tabindex="0" ${tipAttr(`${l}\n` + series.map(s => `${s.label}: ${s.values[i]}`).join('\n'))}></span>`).join('')}</div>
    <div class="line-x">${labels.map((l, i) => `<span style="left:${X(i)}%">${esc(l)}</span>`).join('')}</div></div></div>`;
}
function sparkline(vals, color = 'var(--series-1)') {
  const max = Math.max(...vals, 1), min = Math.min(...vals, 0), w = 72, h = 26, n = vals.length;
  const pts = vals.map((v, i) => [2 + i * (w - 4) / (n - 1), h - 3 - (v - min) / ((max - min) || 1) * (h - 6)]);
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" aria-hidden="true"><path d="${pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${pts[n - 1][0]}" cy="${pts[n - 1][1]}" r="3" fill="${color}"/></svg>`;
}
function meter(value, max, o = {}) {
  const pct = max ? Math.min(100, value / max * 100) : 0;
  return `<div class="meter ${o.tone || ''}" role="progressbar" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="${max}" ${tipAttr(o.tip || `${value} of ${max}`)}><i style="width:${pct}%"></i></div>`;
}
const dataTable = (head, rows) => `<div class="table-wrap"><table class="table"><thead><tr>${head.map((h, i) => `<th ${i ? 'style="text-align:right"' : ''}>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td class="${i ? 'num' : ''}" ${i ? 'style="text-align:right"' : ''}>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
// Wrapper with chart/table toggle and a "how this is counted" note.
function chartCard({ id, title, sub, chart, table, legendHtml = '', go, goLabel, how, span }) {
  const view = ui.chartView[id] || 'chart';
  return `<section class="card chart-card ${span ? 'span-' + span : ''}" id="cc-${id}">
    <div class="card-head"><div><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div><div class="row">
      <div class="segmented sm" role="radiogroup" aria-label="View as">${[['chart', 'Chart'], ['table', 'Table']].map(([k, l]) => `<label><input type="radio" name="cv-${id}" value="${k}" data-change="chartView" data-id="${id}" ${view === k ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div>
      ${how ? btn('', { v: 'ghost', sm: true, icon: 'info', act: 'how', id, title: 'How this is counted' }) : ''}
    </div></div>
    <div class="card-body">${view === 'chart' ? chart + legendHtml : table}</div>
    ${go ? `<div class="card-foot" style="justify-content:space-between"><span class="xs faint">Sample data for the design preview</span>${btn(goLabel || 'View records', { v: 'ghost', sm: true, go, iconR: 'arrowR' })}</div>` : ''}
  </section>`;
}
const HOW = {};

/* ================= Dialogs & toasts ================= */
function modalFrame({ title, sub, body, foot, size = '', icon, tone, drawer }) {
  if (drawer) return `<div class="overlay drawer-overlay" data-overlay><div class="drawer ${size}" role="dialog" aria-modal="true" aria-labelledby="m-title"><div class="modal-head"><div class="grow"><h2 id="m-title">${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>${btn('', { v: 'ghost', sm: true, icon: 'x', act: 'closeModal', title: 'Close' })}</div><div class="modal-body">${body}</div><div class="modal-foot">${foot}</div></div></div>`;
  return `<div class="overlay" data-overlay><div class="modal ${size}" role="dialog" aria-modal="true" aria-labelledby="m-title">
    <div class="modal-head">${icon ? `<span class="modal-ic tone-${tone || 'info'}">${ic(icon)}</span>` : ''}<div class="grow"><h2 id="m-title">${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>${icon ? '' : btn('', { v: 'ghost', sm: true, icon: 'x', act: 'closeModal', title: 'Close' })}</div>
    ${body ? `<div class="modal-body">${body}</div>` : '<div style="height:12px"></div>'}
    <div class="modal-foot">${foot}</div></div></div>`;
}
function renderModal() {
  const m = ui.modal;
  if (!m) return '';
  if (m.type === 'confirm') {
    const tone = m.tone === 'danger' ? 'bad' : m.tone === 'warn' ? 'warn' : m.tone === 'ok' ? 'ok' : 'info';
    const r = m.reason;
    const body = (m.extra ? m.extra() : '') +
      (r ? F({ id: 'm-reason', label: r.label || 'Reason', bind: 'm.reason', type: 'textarea', rows: 3, ph: r.ph || '', req: r.required !== false, hint: r.hint || (r.min ? `At least ${r.min} characters. The contractor sees this.` : ''), attrs: 'data-reasonreq' }) : '') +
      (m.requireText ? F({ id: 'm-typed', label: `Type ${m.requireText} to confirm`, bind: 'm.typed', attrs: 'autocomplete="off" data-require' }) : '');
    return modalFrame({ title: m.title, sub: m.message, icon: m.icon || (m.tone === 'danger' ? 'trash' : m.tone === 'warn' ? 'alert' : m.tone === 'ok' ? 'check' : 'info'), tone, size: 'sm', body,
      foot: btn(m.cancelText || 'Cancel', { act: 'closeModal' }) + (m.alt ? btn(m.alt.label, { act: 'confirmAlt', v: m.alt.v || 'secondary' }) : '') + btn(m.confirmText || 'Confirm', { v: m.tone === 'danger' ? 'danger' : 'primary', act: 'confirmOk', disabled: confirmBlocked(m), attrs: 'id="m-ok"' }) });
  }
  if (m.type === 'how') return modalFrame({ title: m.data.title, sub: 'How this is counted', size: 'sm', body: `<p class="muted">${m.data.text}</p>`, foot: btn('Close', { v: 'primary', act: 'closeModal' }) });
  if (MODALS[m.type]) return MODALS[m.type](m);
  return '';
}
function confirmBlocked(m) {
  if (m.requireText && (m.data.typed || '') !== m.requireText) return true;
  if (m.reason && m.reason.required !== false && String(m.data.reason || '').trim().length < (m.reason.min || 1)) return true;
  return false;
}
function openConfirm(o) { ui.pop = null; ui.modal = Object.assign({ type: 'confirm', data: {} }, o); render(); }
function toast(msg, o = {}) {
  const box = document.getElementById('toasts'); if (!box) return;
  const el = document.createElement('div');
  el.className = 'toast' + (o.err ? ' err' : '');
  el.innerHTML = `${ic(o.err ? 'alert' : 'check')}<span class="grow">${esc(msg)}</span>${o.action ? `<button class="btn btn-ghost btn-sm" type="button">${esc(o.action.label)}</button>` : ''}${o.undo ? '<button class="btn btn-ghost btn-sm" type="button">Undo</button>' : ''}`;
  const b = el.querySelector('button');
  if (o.undo && b) b.onclick = () => { o.undo(); el.remove(); };
  if (o.action && b) b.onclick = () => { o.action.fn(); el.remove(); };
  box.appendChild(el);
  setTimeout(() => el.remove(), o.undo || o.action ? 8000 : 4500);
}
const closeAll = () => { ui.pop = null; ui.modal = null; };

/* ================= Routing ================= */
function route() { return decodeURIComponent(location.hash.slice(1)) || (WS ? WS.home : ''); }
function go(r) { if (route() === r) render(); else location.hash = r; }
function pageFor(r) {
  if (ROUTES[r]) return ROUTES[r]('');
  for (const [p, fn] of PREFIX) if (r.startsWith(p)) return fn(r.slice(p.length));
  return null;
}
let WS = null;   // the workspace config for this file, set by the workspace script
