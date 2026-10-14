/* Buzzin contractor portal — interactive redesign prototype.
   Plain JS, no build step. All data is sample data kept in this browser only. */
(() => {
'use strict';

/* ================= Utilities ================= */
// The PDF viewer runs on the page itself (vendor/pdf.worker.min.js is loaded as a script), so it also works from a local file.
if (window.pdfjsLib) window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js';
const TODAY = '2026-10-12';
const KEY = 'buzzin-redesign-v5';
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
};
const ic = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clone = o => JSON.parse(JSON.stringify(o));
const uid = p => p + Math.random().toString(36).slice(2, 7);
const D = s => new Date(s + 'T00:00:00');
const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const addDays = (s, n) => { const d = D(s); d.setDate(d.getDate() + n); return iso(d); };
const fmt = s => s ? D(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const fmtS = s => D(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
const range = (a, b) => !a ? 'Dates not set' : (!b || a === b) ? fmt(a) : (a.slice(0, 4) === b.slice(0, 4) ? fmtS(a) + ' – ' + fmt(b) : fmt(a) + ' – ' + fmt(b));
const days = s => Math.round((D(s) - D(TODAY)) / 864e5);
const initials = n => String(n || '?').split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
const plural = (n, w, p) => `${n} ${n === 1 ? w : (p || w + 's')}`;
const sizeTxt = b => !b ? '' : b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
function expiry(date, noExp) {
  if (noExp) return { tone: 'neutral', label: 'No expiry' };
  if (!date) return { tone: 'neutral', label: 'Not set' };
  const n = days(date);
  if (n < 0) return { tone: 'bad', label: 'Expired ' + fmt(date) };
  if (n <= 30) return { tone: 'warn', label: `Expires in ${plural(n, 'day')}` };
  return { tone: 'ok', label: 'Valid to ' + fmt(date) };
}
const badge = (label, tone = 'neutral') => `<span class="badge badge-${tone}"><i></i>${esc(label)}</span>`;
const STATUS = {
  draft: ['Draft', 'neutral'], review: ['Under review', 'info'], changes: ['Changes requested', 'warn'],
  payment: ['Payment pending', 'warn'], approved: ['Approved', 'ok'], inspection: ['Final inspection', 'info'], completed: ['Completed', 'neutral'],
  expired: ['Expired', 'bad'], revoked: ['Revoked', 'bad'], suspended: ['Suspended', 'bad'], cancelled: ['Cancelled', 'neutral'],
};
const statusBadge = s => badge(...(STATUS[s] || [s, 'neutral']));
function btn(label, o = {}) {
  const v = o.v || 'secondary';
  const attrs = [o.go ? `data-go="${o.go}"` : '', o.act ? `data-act="${o.act}"` : '', o.id ? `data-id="${esc(o.id)}"` : '', o.pop ? `data-pop="${o.pop}"` : '', o.disabled ? 'disabled' : '', o.title ? `title="${esc(o.title)}" aria-label="${esc(o.title)}"` : '', o.attrs || ''].join(' ');
  return `<button type="button" class="btn btn-${v} ${o.sm ? 'btn-sm' : ''} ${o.icon && !label ? 'btn-icon' : ''} ${o.cls || ''}" ${attrs}>${o.icon ? ic(o.icon) : ''}${label ? esc(label) : ''}${o.iconR ? ic(o.iconR) : ''}</button>`;
}

/* ================= Reference data ================= */
// Fees, limits and closure rules. The community side uses the same values. maxDays 0 = no limit.
const CURRENCY = 'AED';
const PERMIT_TYPES = [
  { id: 'general', name: 'General work permit', desc: 'Repairs, installations and general contractor work.', docs: ['scope'], optional: ['risk'], paid: false, closure: false, maxEmployees: 10, maxDays: 30 },
  { id: 'fitout', name: 'Minor fit-out work', desc: 'Partitions, flooring, ceilings and joinery.', docs: ['scope', 'drawings'], optional: ['risk'], paid: true, model: 'fixed', amount: 150, closure: true, maxEmployees: 8, maxDays: 60 },
  { id: 'maintenance', name: 'Maintenance work', desc: 'Planned or reactive maintenance, including AMC visits.', docs: ['scope'], optional: ['risk', 'amc'], paid: false, closure: true, maxEmployees: 6, maxDays: 14, amcAllowed: true },
  { id: 'hot', name: 'Hot work', desc: 'Welding, cutting, grinding or any open flame.', docs: ['scope', 'risk', 'hotwork'], optional: [], paid: true, model: 'fixed', amount: 250, closure: true, maxEmployees: 4, maxDays: 5 },
  { id: 'delivery', name: 'Delivery & material movement', desc: 'Deliveries by truck or van. Priced per trip by vehicle weight.', docs: ['scope'], optional: [], paid: true, model: 'trip', tiers: [{ upTo: 1, price: 50 }, { upTo: 2, price: 100 }, { upTo: null, price: 200 }], closure: false, maxEmployees: 2, maxDays: 0 },
];
const typeOf = id => PERMIT_TYPES.find(t => t.id === id) || { id, name: id === 'visitor' ? 'Visitor pass' : 'Work permit', docs: [], optional: [], paid: false, closure: false, maxEmployees: 0, maxDays: 0 };
const aed = n => CURRENCY + ' ' + Number(n || 0).toLocaleString('en-US');
const tierPrice = (t, tons) => { const r = (t.tiers || []).find(x => x.upTo == null || Number(tons) <= x.upTo); return r ? r.price : 0; };
const tierLabel = (t, i) => { const r = t.tiers[i], prev = i ? t.tiers[i - 1].upTo : 0; return r.upTo == null ? `Over ${prev} ${prev === 1 ? 'ton' : 'tons'}` : i ? `Over ${prev} up to ${r.upTo} ${r.upTo === 1 ? 'ton' : 'tons'}` : `Up to ${r.upTo} ${r.upTo === 1 ? 'ton' : 'tons'}`; };
// Trips for one vehicle on a draft or permit. Older drafts kept one shared "trips" value.
const tripsOf = (x, vid) => { const n = Math.floor(Number(x.tripsBy && x.tripsBy[vid])); if (n >= 1) return n; const o = Number(x.trips); return o >= 1 ? o : 1; };
const amcOn = x => x.type === 'maintenance' && (x.amc === 'yes' || (x.amc && x.amc.freq));
const FREQ = { daily: ['Daily', 'day'], weekly: ['Weekly', 'week'], monthly: ['Monthly', 'month'], annual: ['Annual', 'year'] };
// Fee for a draft or a permit: { total, lines: [{ label, amount }] }
function feeFor(x) {
  const t = typeOf(x.type), lines = [];
  if (!t.paid) return { total: 0, lines };
  const workers = (x.workers || []).length;
  if (t.model === 'fixed') lines.push({ label: t.name + ' fee', amount: t.amount });
  else if (t.model === 'employee') lines.push({ label: `${workers} ${workers === 1 ? 'worker' : 'workers'} × ${aed(t.amount)}`, amount: t.amount * workers });
  else if (t.model === 'trip') {
    (x.noVehicles ? [] : (x.vehicles || [])).forEach(id => {
      const v = S && vehicle(id); if (!v) return;
      const n = tripsOf(x, id), price = tierPrice(t, v.tons);
      lines.push({ label: `${v.plate} · ${v.tons || 0} t · ${plural(n, 'trip')} × ${aed(price)}`, amount: n * price });
    });
  }
  return { total: lines.reduce((a, l) => a + l.amount, 0), lines };
}
const feeShort = t => !t.paid ? 'Free' : t.model === 'trip' ? `From ${aed(Math.min(...t.tiers.map(r => r.price)))} per trip` : t.model === 'employee' ? `${aed(t.amount)} per worker` : aed(t.amount);
const limitsShort = t => `Up to ${plural(t.maxEmployees, 'worker')}${t.maxDays ? ` · ${plural(t.maxDays, 'day')} at most` : ''}`;
const fmtDT = s => !s ? '—' : fmt(s.slice(0, 10)) + (s.length > 10 ? ', ' + s.slice(11, 16) : '');


const DOCS = {
  scope: { name: 'Scope of Work Form', hint: 'Describe the tasks and exact work area. Use the community template.', template: true, noExp: true },
  risk: { name: 'Risk assessment', hint: 'Needed for work at height, noisy work, chemicals or electrical isolation.', template: true, noExp: true },
  drawings: { name: 'Approved layout drawings', hint: 'PDF of the approved layout with dimensions.', noExp: true },
  hotwork: { name: 'Hot work method statement', hint: 'Fire watch, extinguishers and isolation plan.', template: true, noExp: true },
  amc: { name: 'Annual maintenance contract', hint: 'Upload the signed AMC if this work is covered by one.', noExp: false },
};
const PROPERTIES = ['Buzzin offices', 'Buzzin residences', 'Buzzin retail plaza'];
const UNITS = ['Unit 101', 'Unit 102', 'Unit 123', 'Unit 204', 'Unit 305', 'Unit 410', 'Unit 512', 'Unit 909', 'Retail R-03', 'Common area – Lobby', 'Common area – Roof'];
const GEO = {
  'United Arab Emirates': { 'Abu Dhabi': ['Abu Dhabi', 'Al Ain', 'Ruwais'], Dubai: ['Dubai', 'Hatta'], Sharjah: ['Sharjah', 'Khor Fakkan', 'Kalba'], 'Ajman Emirate': ['Ajman', 'Masfout'], 'Umm Al Quwain': ['Umm Al Quwain'], 'Ras Al Khaimah': ['Ras Al Khaimah'], Fujairah: ['Fujairah', 'Dibba'] },
  'Saudi Arabia': { Riyadh: ['Riyadh'], Makkah: ['Jeddah', 'Makkah'], 'Eastern Province': ['Dammam', 'Khobar'] },
  Oman: { Muscat: ['Muscat', 'Seeb'], Dhofar: ['Salalah'] },
  Qatar: { Doha: ['Doha'], 'Al Rayyan': ['Al Rayyan'] },
  Bahrain: { Capital: ['Manama'], Muharraq: ['Muharraq'] },
  Kuwait: { 'Al Asimah': ['Kuwait City'], Hawalli: ['Salmiya', 'Hawalli'] },
};
const STEPS = [['details', 'Work details'], ['materials', 'Materials'], ['workvehicles', 'Vehicles'], ['personnel', 'Workers'], ['documents', 'Documents'], ['pdf', 'Sign terms'], ['review', 'Review & submit']];
const SAMPLE_FIELDS = [{"id": "b1", "page": 1, "x": 11.34, "y": 27.45, "size": 2.8, "label": "I agree: Working hours", "required": true}, {"id": "b2", "page": 1, "x": 11.34, "y": 38.68, "size": 2.8, "label": "I agree: Access and ID", "required": true}, {"id": "b3", "page": 1, "x": 11.34, "y": 49.92, "size": 2.8, "label": "I agree: Health and safety", "required": true}, {"id": "b4", "page": 1, "x": 11.34, "y": 59.63, "size": 2.8, "label": "I agree: Noise and dust", "required": true}, {"id": "b5", "page": 2, "x": 11.34, "y": 18.66, "size": 2.8, "label": "I agree: Waste and cleaning", "required": true}, {"id": "b6", "page": 2, "x": 11.34, "y": 28.38, "size": 2.8, "label": "I agree: Lifts and common areas", "required": true}, {"id": "b7", "page": 2, "x": 11.34, "y": 38.09, "size": 2.8, "label": "I agree: Damage and liability", "required": true}, {"id": "b8", "page": 2, "x": 11.34, "y": 47.81, "size": 2.8, "label": "I agree: Breach of terms", "required": true}];
const ALL_TYPES = PERMIT_TYPES.map(t => t.id);

function blankDraft(prefill) {
  return Object.assign({
    id: uid('DRAFT-'), community: S ? S.community : 'buzzin', property: '', units: [], type: 'general', title: '', description: '',
    contact: '', phone: '', from: '', to: '', start: '09:00', end: '17:00', amc: 'no',
    materials: [], noMaterials: false, vehicles: [], noVehicles: false, tripsBy: {}, workers: [], amcFreq: '', amcVisits: '',
    docs: {}, ticks: {}, signer: { name: S ? S.profile.name : '', position: S ? S.profile.title : '', sig: null, auth: false }, consent: false, reached: 0, saved: TODAY,
  }, prefill || {});
}
// Details the permit PDF shows. Real submissions store these too (see submitRequest).
function seedExtras(p) {
  if (p.kind !== 'work') return p;
  if (!p.description) p.description = `${p.title} at ${(p.units || []).join(', ')}.`;
  if (!['cancelled'].includes(p.status) && !p.signed) p.signed = { name: 'Contractor terms & community guidelines', version: 3, by: 'Alex Morgan', position: 'Operations manager', at: addDays(p.from, -9) + 'T09:00' };
  return p;
}
function seed() {
  return {
    v: 5, community: 'buzzin', nextRef: 1052, nextVp: 2211, nextInv: 413, rules: { workersAfterApproval: true, finalInspection: true },
    communities: [
      { id: 'buzzin', name: 'Buzzin community', area: 'Dubai Silicon Oasis', status: 'active', since: '2025-02-11', email: 'permits@buzzin-community.example', logo: { data: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22240%22%20height%3D%2272%22%20viewBox%3D%220%200%20240%2072%22%3E%3Ccircle%20cx%3D%2236%22%20cy%3D%2236%22%20r%3D%2226%22%20fill%3D%22%230E7C66%22/%3E%3Cpath%20d%3D%22M23%2042%2036%2022l13%2020z%22%20fill%3D%22%23fff%22/%3E%3Crect%20x%3D%2230%22%20y%3D%2238%22%20width%3D%2212%22%20height%3D%2210%22%20fill%3D%22%23fff%22/%3E%3Ctext%20x%3D%2274%22%20y%3D%2234%22%20font-family%3D%22Arial%2CHelvetica%2Csans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2224%22%20fill%3D%22%230B3B32%22%3EBuzzin%3C/text%3E%3Ctext%20x%3D%2275%22%20y%3D%2255%22%20font-family%3D%22Arial%2CHelvetica%2Csans-serif%22%20font-size%3D%2213%22%20letter-spacing%3D%223%22%20fill%3D%22%230E7C66%22%3ECOMMUNITY%3C/text%3E%3C/svg%3E', tone: 'dark', bg: 'auto' } },
      { id: 'marina', name: 'Marina Gate', area: 'Dubai Marina', status: 'active', since: '2025-08-03', email: 'fm@marinagate.example', logo: { data: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22240%22%20height%3D%2272%22%20viewBox%3D%220%200%20240%2072%22%3E%3Cpath%20d%3D%22M10%2044c10-10%2020-10%2030%200s20%2010%2030%200%22%20stroke%3D%22%23fff%22%20stroke-width%3D%225%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22/%3E%3Cpath%20d%3D%22M10%2030c10-10%2020-10%2030%200s20%2010%2030%200%22%20stroke%3D%22%23fff%22%20stroke-width%3D%225%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20opacity%3D%22.6%22/%3E%3Ctext%20x%3D%2284%22%20y%3D%2233%22%20font-family%3D%22Arial%2CHelvetica%2Csans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2222%22%20letter-spacing%3D%221%22%20fill%3D%22%23fff%22%3EMARINA%3C/text%3E%3Ctext%20x%3D%2285%22%20y%3D%2255%22%20font-family%3D%22Arial%2CHelvetica%2Csans-serif%22%20font-size%3D%2215%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%3EGATE%3C/text%3E%3C/svg%3E', tone: 'light', bg: 'auto' } },
      { id: 'palm', name: 'Palm Views', area: 'Palm Jumeirah', status: 'active', since: '2026-01-19', email: 'security@palmviews.example', logo: { data: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2272%22%20height%3D%2272%22%20viewBox%3D%220%200%2072%2072%22%3E%3Cpath%20d%3D%22M36%2064V30%22%20stroke%3D%22%236B4F2A%22%20stroke-width%3D%225%22%20stroke-linecap%3D%22round%22/%3E%3Cpath%20d%3D%22M36%2030C26%2016%2014%2016%208%2022c10-2%2018%202%2028%208zM36%2030c10-14%2022-14%2028-8-10-2-18%202-28%208zM36%2030c-4-14%202-22%2010-24-6%206-8%2014-10%2024z%22%20fill%3D%22%232F8F46%22/%3E%3C/svg%3E', tone: 'dark', bg: 'auto' } },
      { id: 'creek', name: 'Creek Residences', area: 'Dubai Creek Harbour', status: 'pending', since: null, email: '' },
      { id: 'greens', name: 'The Greens', area: 'Emirates Living', status: 'revoked', since: '2025-05-02', changedOn: '2026-09-28', email: 'contractors@thegreens.example' },
    ],
    directory: ['Arabian Ranches Community', 'Business Bay Towers', 'City Walk Residences', 'Jumeirah Lake Towers', 'Motor City Villas', 'The Greens', 'Town Square'],
    permits: [
      { id: 'BZ-1051', community: 'buzzin', kind: 'work', title: 'Ceiling tile delivery', type: 'delivery', property: 'Buzzin offices', units: ['Unit 410'], from: '2026-10-20', to: '2026-10-20', hours: '09:00–12:00', status: 'review', updated: '2026-10-11', workers: ['p1'], vehicles: ['v3'], tripsBy: { v3: 2 }, materials: 1, docs: ['Scope of Work Form'],
        approvals: [{ step: 'Security · Level 1', by: 'Omar Siddiqui', at: '2026-10-12T08:50', note: 'Vehicle and driver details are fine.', outcome: 'Approved' }] },
      { id: 'BZ-1050', community: 'buzzin', kind: 'work', title: 'Reception refurbishment', type: 'fitout', property: 'Buzzin offices', units: ['Unit 909'], from: '2026-10-26', to: '2026-11-06', hours: '08:00–18:00', status: 'payment', updated: '2026-10-10', workers: ['p2', 'p5'], vehicles: ['v2'], tripsBy: { v2: 1 }, materials: 5, docs: ['Scope of Work Form', 'Approved layout drawings'],
        approvals: [
          { step: 'Security · Level 1', by: 'Omar Siddiqui', at: '2026-10-08T09:30', note: 'Documents match the permit type.', outcome: 'Approved' },
          { step: 'Security · Level 2', by: 'Daniel Okoro', at: '2026-10-09T10:15', note: 'Drawings match the unit layout.', outcome: 'Approved' },
          { step: 'Operations · Level 1', by: 'Priya Rao', at: '2026-10-10T15:40', note: 'Work times are fine. Payment is now due.', outcome: 'Approved' }] },
      { id: 'BZ-1048', community: 'buzzin', kind: 'work', title: 'HVAC maintenance', type: 'maintenance', property: 'Buzzin offices', units: ['Unit 101'], from: '2026-10-19', to: '2026-10-23', hours: '09:00–17:00', status: 'review', updated: '2026-10-08', workers: ['p1', 'p3'], vehicles: ['v1'], tripsBy: { v1: 1 }, materials: 2, docs: ['Scope of Work Form', 'Risk assessment'],
        approvals: [{ step: 'Security · Level 1', by: 'Omar Siddiqui', at: '2026-10-09T11:05', note: 'Worker IDs checked.', outcome: 'Approved' }] },
      { id: 'BZ-1042', community: 'buzzin', kind: 'work', title: 'Office fit-out', type: 'fitout', property: 'Buzzin offices', units: ['Unit 909'], from: '2026-10-14', to: '2026-10-28', hours: '08:00–18:00', status: 'changes', updated: '2026-10-07', workers: ['p2', 'p5'], vehicles: ['v2'], tripsBy: { v2: 1 }, materials: 6, docs: ['Scope of Work Form', 'Approved layout drawings'], message: 'Please upload a revised Scope of Work Form that shows the exact work area. List any drilling or noisy work and the times it will happen.',
        approvals: [
          { step: 'Security · Level 1', by: 'Omar Siddiqui', at: '2026-10-06T09:30', note: 'Documents match the permit type.', outcome: 'Approved' },
          { step: 'Security · Level 2', by: 'Daniel Okoro', at: '2026-10-07T13:20', note: 'Please upload a revised Scope of Work Form that shows the exact work area. List any drilling or noisy work and the times it will happen.', outcome: 'Changes requested' }] },
      { id: 'BZ-1036', community: 'buzzin', kind: 'work', title: 'Electrical inspection', type: 'general', property: 'Buzzin offices', units: ['Unit 123'], from: '2026-10-09', to: '2026-10-13', hours: '09:00–17:00', status: 'approved', updated: '2026-10-05', workers: ['p3'], vehicles: [], materials: 1, docs: ['Scope of Work Form'],
        extraWorkers: [{ id: 'p4', added: '2026-10-08', revoked: { at: '2026-10-09', reason: 'Emirates ID copy was unclear.' } }],
        approvals: [
          { step: 'Security · Level 1', by: 'Omar Siddiqui', at: '2026-10-05T09:30', note: 'Documents match the permit type.', outcome: 'Approved' },
          { step: 'Operations · Level 1', by: 'Priya Rao', at: '2026-10-05T14:10', note: 'Work area and times are fine.', outcome: 'Approved' }] },
      { id: 'BZ-1031', community: 'buzzin', kind: 'work', title: 'Crane lift', type: 'hot', property: 'Buzzin retail plaza', units: ['Common area – Roof'], from: '2026-10-05', to: '2026-10-08', hours: '08:00–16:00', status: 'revoked', updated: '2026-10-07', workers: ['p1', 'p3'], vehicles: ['v1'], tripsBy: { v1: 1 }, materials: 2, docs: ['Scope of Work Form', 'Risk assessment', 'Hot work method statement'], message: 'Unsafe lifting practice reported by security.',
        approvals: [
          { step: 'Security · Level 1', by: 'Omar Siddiqui', at: '2026-10-01T09:30', note: 'Documents match the permit type.', outcome: 'Approved' },
          { step: 'Security · Level 2', by: 'Daniel Okoro', at: '2026-10-01T16:00', note: 'Method statement reviewed.', outcome: 'Approved' },
          { step: 'Operations · Level 1', by: 'Priya Rao', at: '2026-10-02T10:45', note: 'Roof access booked.', outcome: 'Approved' }] },
      { id: 'VP-2210', community: 'buzzin', kind: 'visitor', title: 'Site survey visit', type: 'visitor', property: 'Buzzin residences', units: ['Unit 305'], from: '2026-10-15', to: '2026-10-15', hours: '10:00–12:00', status: 'approved', updated: '2026-10-06', workers: ['p2'], vehicles: [], materials: 0, docs: [] },
      { id: 'BZ-1029', community: 'buzzin', kind: 'work', title: 'Plumbing repair', type: 'maintenance', property: 'Buzzin residences', units: ['Unit 204'], from: '2026-09-21', to: '2026-09-23', hours: '09:00–15:00', status: 'completed', updated: '2026-09-24', workers: ['p1'], vehicles: ['v1'], materials: 3, docs: ['Scope of Work Form'],
        description: 'Replace the leaking main shut-off valve in the kitchen and bathroom and test the water pressure.',
        approvals: [
          { step: 'Security · Level 1', by: 'Omar Siddiqui', at: '2026-09-17T09:30', note: 'Documents match the permit type.', outcome: 'Approved' },
          { step: 'Operations · Level 1', by: 'Priya Rao', at: '2026-09-18T14:10', note: 'Water shut-off is booked with the building team.', outcome: 'Approved' }],
        inspection: { status: 'closed', notes: 'Valve replaced and pressure tested. Area cleaned.', photos: ['valve-after.jpg'], at: '2026-09-23T16:20',
          rounds: [{ at: '2026-09-24T10:30', by: 'Priya Rao', decision: 'complete', comment: 'Valve replaced and pressure tested. Area is clean.', files: [] }],
          outcome: 'Completed', remark: 'Valve replaced and pressure tested. Area is clean.', closedBy: 'Priya Rao', closedAt: '2026-09-24T10:30', files: [] } },
      { id: 'BZ-1038', community: 'buzzin', kind: 'work', title: 'Lobby light repair', type: 'maintenance', property: 'Buzzin offices', units: ['Common area – Lobby'], from: '2026-10-05', to: '2026-10-07', hours: '09:00–15:00', status: 'inspection', updated: '2026-10-09', workers: ['p1'], vehicles: [], materials: 2, docs: ['Scope of Work Form'],
        description: 'Replace six failed ceiling lights in the main lobby.',
        approvals: [
          { step: 'Security · Level 1', by: 'Omar Siddiqui', at: '2026-10-01T09:30', note: 'Worker ID checked.', outcome: 'Approved' },
          { step: 'Operations · Level 1', by: 'Priya Rao', at: '2026-10-02T11:15', note: 'Work is outside peak lobby hours.', outcome: 'Approved' }],
        inspection: { status: 'pending', notes: 'Lights replaced and tested. Area cleaned.', photos: ['lobby-lights.jpg'], at: '2026-10-09T11:40', rounds: [] } },
      { id: 'BZ-1034', community: 'buzzin', kind: 'work', title: 'Ceiling tile repair', type: 'maintenance', property: 'Buzzin offices', units: ['Unit 512'], from: '2026-10-01', to: '2026-10-06', hours: '09:00–17:00', status: 'inspection', updated: '2026-10-09', workers: ['p2', 'p5'], vehicles: [], materials: 3, docs: ['Scope of Work Form'],
        description: 'Replace water-damaged ceiling tiles in the open-plan area.',
        approvals: [
          { step: 'Security · Level 1', by: 'Omar Siddiqui', at: '2026-09-28T09:30', note: 'Documents match the permit type.', outcome: 'Approved' },
          { step: 'Operations · Level 1', by: 'Priya Rao', at: '2026-09-29T10:05', note: 'Approved.', outcome: 'Approved' }],
        inspection: { status: 'waiting', notes: 'Ceiling tiles replaced.', photos: [], at: '2026-10-07T15:10',
          rounds: [{ at: '2026-10-08T10:20', by: 'Priya Rao', decision: 'not_ready', comment: 'Ceiling tiles near the window are not aligned. Fix and send again.', files: ['snag-photo-1.jpg'] }] } },
      { id: 'BZ-1017', community: 'buzzin', kind: 'work', title: 'Glass partition installation', type: 'fitout', property: 'Buzzin offices', units: ['Unit 410'], from: '2026-08-10', to: '2026-08-20', hours: '08:00–18:00', status: 'expired', updated: '2026-08-21', workers: ['p2', 'p4'], vehicles: ['v3'], tripsBy: { v3: 1 }, materials: 4, docs: ['Scope of Work Form', 'Approved layout drawings'],
        approvals: [
          { step: 'Security · Level 1', by: 'Omar Siddiqui', at: '2026-08-03T09:30', note: 'Documents match the permit type.', outcome: 'Approved' },
          { step: 'Security · Level 2', by: 'Daniel Okoro', at: '2026-08-03T15:20', note: 'Layout drawings are clear.', outcome: 'Approved' },
          { step: 'Operations · Level 1', by: 'Priya Rao', at: '2026-08-04T11:00', note: 'Approved. Payment is now due.', outcome: 'Approved' }] },
      { id: 'BZ-1011', community: 'buzzin', kind: 'work', title: 'Kitchen exhaust cleaning', type: 'maintenance', property: 'Buzzin retail plaza', units: ['Retail R-03'], from: '2026-08-02', to: '2026-08-02', hours: '22:00–02:00', status: 'cancelled', updated: '2026-07-30', workers: ['p1'], vehicles: [], materials: 0, docs: [] },
      { id: 'MG-0310', community: 'marina', kind: 'work', title: 'Balcony waterproofing', type: 'general', property: 'Tower A', units: ['Apt 2104'], from: '2026-10-11', to: '2026-10-18', hours: '09:00–17:00', status: 'approved', updated: '2026-10-03', workers: ['p2'], vehicles: ['v2'], materials: 3, docs: ['Scope of Work Form'] },
      { id: 'MG-0305', community: 'marina', kind: 'work', title: 'AC duct cleaning', type: 'maintenance', property: 'Tower B', units: ['Apt 1502'], from: '2026-10-20', to: '2026-10-21', hours: '09:00–13:00', status: 'review', updated: '2026-10-08', workers: ['p1'], vehicles: ['v1'], materials: 1, docs: ['Scope of Work Form'] },
      { id: 'PV-0088', community: 'palm', kind: 'work', title: 'Pool pump replacement', type: 'maintenance', property: 'Villa cluster 3', units: ['Villa 14'], from: '2026-09-02', to: '2026-09-03', hours: '09:00–17:00', status: 'completed', updated: '2026-09-04', workers: ['p1'], vehicles: ['v1'], materials: 2, docs: ['Scope of Work Form'] },
    ].map(seedExtras),
    people: [
      { id: 'p1', name: 'Alex Morgan', role: 'HVAC technician', phone: '+971 50 000 0001', email: 'alex@samplecontracting.ae', idType: 'Emirates ID', idNo: '784-1990-1234567-1', idExpiry: '2027-03-31', file: 'alex-morgan-eid.pdf' },
      { id: 'p2', name: 'Priya Nair', role: 'Site supervisor', phone: '+971 50 000 0002', email: 'priya@samplecontracting.ae', idType: 'Emirates ID', idNo: '784-1988-7654321-2', idExpiry: '2027-08-14', file: 'priya-nair-eid.pdf' },
      { id: 'p3', name: 'Omar Haddad', role: 'Electrician', phone: '+971 50 000 0003', email: '', idType: 'Emirates ID', idNo: '784-1993-1122334-5', idExpiry: '2026-10-24', file: 'omar-haddad-eid.pdf' },
      { id: 'p4', name: 'Daniel Reyes', role: 'Helper', phone: '+971 50 000 0004', email: '', idType: 'Passport', idNo: 'P1234567', idExpiry: '2026-09-30', file: 'daniel-reyes-passport.pdf' },
      { id: 'p5', name: 'Hassan Ali', role: 'Painter', phone: '+971 50 000 0005', email: '', idType: 'Emirates ID', idNo: '784-1995-9988776-3', idExpiry: '2028-01-05', file: 'hassan-ali-eid.pdf' },
    ],
    vehicles: [
      { id: 'v1', plate: 'Dubai N 12345', type: 'Van', make: 'Toyota Hiace', color: 'White', tons: 1.5, regExpiry: '2027-02-28', file: 'mulkiya-12345.pdf' },
      { id: 'v2', plate: 'Sharjah 3 45821', type: 'Pickup', make: 'Nissan Navara', color: 'Silver', tons: 1, regExpiry: '2026-10-30', file: 'mulkiya-45821.pdf' },
      { id: 'v3', plate: 'Ajman B 7710', type: 'Truck', make: 'Isuzu NPR', color: 'White', tons: 7, regExpiry: '2027-04-10', file: 'mulkiya-7710.pdf' },
    ],
    company: { name: 'Sample Contracting', trn: '100000678922', licence: { name: 'trade-licence-2026.pdf', size: 412000 }, licenceExpiry: '2027-03-14', logo: null },
    billing: { legal: 'Sample Contracting FZCO', addr1: 'Dubai Silicon Oasis', addr2: 'Technohub 1', country: 'United Arab Emirates', state: 'Dubai', city: 'Dubai', postal: '00000' },
    profile: { name: 'Alex Morgan', email: 'alex@samplecontracting.ae', phone: '+971 50 000 0000', title: 'Operations manager', lang: 'English', tz: 'Asia/Dubai (GST, UTC+4)', datefmt: 'DD MMM YYYY' },
    companyDocs: [
      { id: 'cd3', name: 'VAT registration certificate', noExpiry: true, file: 'vat-certificate.pdf' },
      { id: 'cd4', name: 'Company profile', noExpiry: true, file: null },
    ],
    notifPrefs: {
      submitted: { email: true, sms: false, app: true }, changes: { email: true, sms: true, app: true }, approved: { email: true, sms: true, app: true },
      expiring: { email: true, sms: false, app: true }, inspection: { email: true, sms: false, app: true }, news: { email: false, sms: false, app: false },
    },
    twofa: false,
    forms: [
      { id: 'frm1', community: 'buzzin', name: 'Contractor terms & community guidelines', fileName: 'buzzin-contractor-terms-v3.pdf', pdf: 'sample', pdfRev: 0, fields: clone(SAMPLE_FIELDS), appliesTo: [...ALL_TYPES], placement: 'bottom', updated: '2026-09-01',
        published: { version: 3, name: 'Contractor terms & community guidelines', fileName: 'buzzin-contractor-terms-v3.pdf', pdf: 'sample', fields: clone(SAMPLE_FIELDS), appliesTo: [...ALL_TYPES], placement: 'bottom', at: '2026-09-01' } },
    ],
    notifications: [
      { id: 'n0', title: 'Marina Gate gave you access', body: 'You were invited by email and your existing account now has access.', when: '3 days ago', go: 'communities', unread: true },
      { id: 'n5', title: 'Payment due for BZ-1050', body: 'Reception refurbishment is approved. Pay AED 150 online to get your QR codes.', when: 'Yesterday', go: 'permit-BZ-1050', unread: true },
      { id: 'n1', title: 'Changes requested on BZ-1042', body: 'Office fit-out needs a revised Scope of Work Form.', when: '2 h ago', go: 'permit-BZ-1042', unread: true },
      { id: 'n2', title: 'BZ-1036 approved', body: 'Your electrical inspection permit and QR codes are ready.', when: 'Yesterday', go: 'permit-BZ-1036', unread: true },
      { id: 'n3', title: 'Emirates ID expiring soon', body: "Omar Haddad's ID expires on 24 Oct 2026.", when: '2 days ago', go: 'people', unread: false },
    ],
    draft: blankDraft({
      id: 'DRAFT-07', community: 'buzzin', property: 'Buzzin residences', units: ['Unit 101'], type: 'general', title: 'Painting work',
      description: 'Repaint living room and bedroom walls. No drilling or noisy work.', contact: 'Priya Nair', phone: '+971 50 000 0002',
      from: '2026-10-14', to: '2026-10-16',
      materials: [{ id: 'm1', name: 'Emulsion paint', kind: 'Material', qty: 6, unit: 'buckets', removed: 'Yes', notes: '' }, { id: 'm2', name: 'Step ladder', kind: 'Equipment', qty: 1, unit: 'pcs', removed: 'Yes', notes: '' }],
      vehicles: ['v1'], tripsBy: { v1: 2 }, workers: ['p2', 'p5'], reached: 3, saved: TODAY,
      signer: { name: 'Alex Morgan', position: 'Operations manager', sig: null, auth: false },
    }),
    invoices: [
      { id: 'INV-2026-0412', permitId: 'BZ-1017', community: 'buzzin', amount: 150, lines: [{ label: 'Minor fit-out work fee', amount: 150 }], method: 'Online', paidAt: '2026-08-05T11:20', status: 'Paid' },
      { id: 'INV-2026-0398', permitId: 'BZ-1031', community: 'buzzin', amount: 250, lines: [{ label: 'Hot work fee', amount: 250 }], method: 'Online', paidAt: '2026-10-02T14:05', status: 'Paid' },
    ],
    visitor: { name: '', company: 'Sample Contracting', phone: '', idType: 'Emirates ID', idNo: '', purpose: 'Site survey', unit: '', date: '', from: '10:00', to: '12:00', plate: '', notes: '' },
  };
}

/* ================= State ================= */
let S = null;
try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S = null; }
// Saved preview data must have the current shape. Anything else (older versions, partial or broken data) starts fresh.
const validState = x => !!(x && x.v === 5 && ['communities', 'permits', 'people', 'vehicles', 'companyDocs', 'forms', 'notifications', 'directory', 'invoices'].every(k => Array.isArray(x[k])) && x.rules && x.communities.length && x.company && x.profile && x.billing && x.notifPrefs && x.visitor);
if (!validState(S)) { S = null; S = seed(); } // seed() must not read the broken data
const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); return true; } catch (e) { if (e && e.name === 'QuotaExceededError') toast('This browser is out of space for the preview. Use a smaller PDF.', { err: true }); return false; } };
if (S.draft && S.draft.docs) Object.values(S.draft.docs).forEach(x => { if (x && x.file && x.file.status === 'checking') { x.file.status = 'done'; delete x.file.step; } });
// Save the starting sample data so the preview behaves like stored data from the first load.
(() => { try { if (!localStorage.getItem(KEY)) persist(); } catch (e) { /* storage blocked: preview still works */ } })();
const ui = { pop: null, popRect: null, q: {}, modal: null, drawer: false, tab: 'all', search: {}, filters: {}, errs: {}, form: null, formTab: null, dirty: false, formErr: {}, signMode: 'draw', page: 1, pw: { current: '', next: '', confirm: '', show: false }, theme: null };
try { ui.theme = localStorage.getItem('buzzin-theme'); } catch (e) { /* ignore */ }
const applyTheme = () => { if (ui.theme) document.documentElement.setAttribute('data-theme', ui.theme); else document.documentElement.removeAttribute('data-theme'); };
applyTheme();

const community = () => S.communities.find(c => c.id === S.community) || S.communities[0] || { id: 'none', name: 'No community', area: '', status: 'left', changedOn: TODAY, email: '' };
const person = id => S.people.find(p => p.id === id);
const vehicle = id => S.vehicles.find(v => v.id === id);
function draftRow() {
  const d = S.draft;
  if (!d || d.community !== S.community) return null;
  return { id: d.id, community: d.community, kind: 'work', title: d.title || 'Untitled request', type: d.type, property: d.property, units: d.units, from: d.from, to: d.to, status: 'draft', updated: d.saved, draft: true };
}
const passesHere = () => [draftRow(), ...S.permits.filter(p => p.community === S.community)].filter(Boolean);
function expiringItems() {
  const out = [];
  S.people.forEach(p => { const e = expiry(p.idExpiry); if (e.tone !== 'ok') out.push({ icon: 'user', title: p.name, sub: `${p.idType} · ${e.label}`, tone: e.tone, go: 'people', date: p.idExpiry }); });
  S.vehicles.forEach(v => { const e = expiry(v.regExpiry); if (e.tone !== 'ok') out.push({ icon: 'car', title: v.plate, sub: `Registration · ${e.label}`, tone: e.tone, go: 'vehicles', date: v.regExpiry }); });
  S.companyDocs.forEach(c => { const e = expiry(c.expiry, c.noExpiry); if (e.tone === 'warn' || e.tone === 'bad') out.push({ icon: 'file', title: c.name, sub: e.label, tone: e.tone, go: 'settings-documents', date: c.expiry }); });
  const le = expiry(S.company.licenceExpiry); if (le.tone === 'warn' || le.tone === 'bad') out.push({ icon: 'file', title: 'Trade licence', sub: le.label, tone: le.tone, go: 'settings', date: S.company.licenceExpiry });
  return out.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
}

/* ================= Binding ================= */
function bindRoot(b) {
  const [r, ...path] = b.split('.');
  const obj = { d: S.draft, f: ui.form, m: ui.modal && ui.modal.data, v: S.visitor, p: ui.pw, s: S }[r];
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
    <span class="label" id="${o.id}-lbl">${esc(o.label)}${o.req ? '<span class="req">*</span>' : ''}</span>
    <div class="pop-anchor">
      <div class="combo-btn" role="combobox" tabindex="0" id="${o.id}" aria-labelledby="${o.id}-lbl" aria-expanded="${open}" data-pop="combo:${o.id}">${shown}${ic('down', 'chev')}</div>
      ${open ? `<div class="popover" role="listbox"><div class="pop-search">${ic('search')}<input id="${o.id}-q" data-q="${o.id}" placeholder="${esc(o.searchPh || 'Search')}" value="${esc(ui.q[o.id] || '')}" autocomplete="off"></div><div class="pop-list" id="${o.id}-list">${comboList(o)}</div></div>` : ''}
    </div>
    ${o.err ? `<span class="err">${ic('alert')}${esc(o.err)}</span>` : o.hint ? `<span class="hint">${o.hint}</span>` : ''}
  </div>`;
}
const COMBOS = {};
function comboList(o) {
  COMBOS[o.id] = o;
  const val = getB(o.bind);
  const q = (ui.q[o.id] || '').toLowerCase();
  const items = o.options.filter(x => !q || (x.label + ' ' + (x.meta || '')).toLowerCase().includes(q));
  if (!items.length) return `<div class="pop-empty">No matches for “${esc(ui.q[o.id])}”</div>`;
  return items.map(x => { const sel = Array.isArray(val) ? val.includes(x.value) : val === x.value; return `<button type="button" class="pop-item" role="option" aria-selected="${sel}" data-act="comboPick" data-id="${o.id}" data-v="${esc(x.value)}">${Array.isArray(val) ? `<input type="checkbox" tabindex="-1" ${sel ? 'checked' : ''} style="accent-color:var(--side)">` : ''}<span class="grow">${esc(x.label)}${x.meta ? `<small>${esc(x.meta)}</small>` : ''}</span>${sel && !Array.isArray(val) ? ic('check', 'tick') : ''}</button>`; }).join('');
}

/* ================= Company logo ================= */
// Logos are shown with object-fit: contain inside a fixed tile, so wide, tall and square logos all fit without cropping.
// The tile background follows the logo: white/light logos get a dark tile, dark logos a light one.
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
  // Average brightness of the visible pixels decides light or dark.
  const p = x.getImageData(0, 0, c.width, c.height).data;
  let sum = 0, n = 0, transparent = 0;
  for (let i = 0; i < p.length; i += 16) { const a = p[i + 3] / 255; if (a < 0.15) { transparent++; continue; } sum += (0.2126 * p[i] + 0.7152 * p[i + 1] + 0.0722 * p[i + 2]) / 255 * a; n += a; }
  const lum = n ? sum / n : 0.5;
  const hasTransparency = transparent > p.length / 16 * 0.05;
  return { data: c.toDataURL('image/png'), tone: hasTransparency && lum > 0.62 ? 'light' : 'dark', bg: 'auto', name: file.name };
}

/* ================= Shell ================= */
function route() { return decodeURIComponent(location.hash.slice(1)) || 'home'; }
function go(r) { if (route() === r) render(); else location.hash = r; }
const NAV = [
  ['Passes', [['home', 'Overview', 'home'], ['permits', 'Authorized passes', 'pass'], ['type', 'Request pass', 'plusCircle']]],
  ['Resources', [['people', 'Employees', 'users'], ['vehicles', 'Vehicles', 'car'], ['settings', 'Settings', 'gear']]],
  ['Support', [['help', 'Help & contact', 'help']]],
];
function navKey(r) {
  if (r.startsWith('permit-') || r.startsWith('completion') || r === 'permits') return 'permits';
  if (r === 'type' || r === 'visitor' || r.startsWith('submitted') || STEPS.some(s => s[0] === r)) return 'type';
  if (r.startsWith('settings')) return 'settings';
  return r;
}
function sidebar(r) {
  const nk = navKey(r);
  const action = passesHere().filter(p => ['changes', 'payment'].includes(p.status)).length;
  return `${communityCard()}
  <nav class="side-nav" aria-label="Main">${NAV.map(([g, items]) => `<div class="side-label">${g}</div>${items.map(([k, l, i]) => `<button class="nav-item ${nk === k ? 'active' : ''}" data-go="${k}" ${nk === k ? 'aria-current="page"' : ''}>${ic(i)}<span>${l}</span>${k === 'permits' && action ? `<span class="count" title="${action} need your action">${action}</span>` : ''}</button>`).join('')}`).join('')}</nav>
  <div class="side-foot">
    <div class="side-help"><strong>Need help with a pass?</strong><p>${esc(community().name)} reviews all requests. Include your pass reference when you contact them.</p>${btn('Contact community', { go: 'help', sm: true, icon: 'mail' })}</div>
    <div class="side-company">${logoTile(S.company.logo, S.company.name, 'sm')}<div><b>${esc(S.company.name)}</b>${esc(S.profile.name)} · ${esc(S.profile.title)}</div></div>
    <p class="preview-note">Design preview · sample data only</p>
  </div>`;
}
function communityCard() {
  const c = community();
  // Community logo only: the community name is already shown in the top bar.
  return `<div class="side-brand">${logoTile(c.logo, c.name, 'brand')}</div>`;
}
// Switching community is one click from the top bar. Only communities with active access can be opened.
function communitySwitcher() {
  const c = community(), open = ui.pop === 'community', q = (ui.q.community || '').toLowerCase();
  const list = S.communities.filter(x => !q || (x.name + ' ' + x.area).toLowerCase().includes(q)).sort((a, b) => (b.status === 'active') - (a.status === 'active'));
  return `<div class="pop-anchor">
    <button class="switcher" data-pop="community" aria-haspopup="listbox" aria-expanded="${open}" aria-label="Community: ${esc(c.name)}, contractor account. Change community">
      ${logoTile(c.logo, c.name, 'xs')}<span class="txt"><small>Community<span class="role-mini"> · Contractor</span></small><span class="name-row"><b>${esc(c.name)}</b><span class="role-pill">Contractor</span></span></span>${ic('down', 'chev')}
    </button>
    ${open ? `<div class="popover wide" role="dialog" aria-label="Switch community">
      <div class="pop-search">${ic('search')}<input id="community-q" data-q="community" placeholder="Search communities" value="${esc(ui.q.community || '')}" autocomplete="off"></div>
      <div class="pop-head"><span class="eyebrow">Your communities</span><span class="xs faint">${S.communities.filter(x => x.status === 'active').length} active</span></div>
      <div class="pop-list" id="community-list">${list.length ? list.map(x => { const ok = x.status === 'active'; return `<button class="pop-item" ${ok ? `data-act="switchCommunity" data-id="${x.id}"` : 'disabled'} aria-selected="${x.id === c.id}">${logoTile(x.logo, x.name, 'xs')}<span class="grow">${esc(x.name)}<small>${ok ? esc(x.area) : ACCESS[x.status][0]}</small></span>${x.id === c.id && ok ? ic('check', 'tick') : ''}</button>`; }).join('') : `<div class="pop-empty">No community matches “${esc(ui.q.community)}”</div>`}</div>
      <div class="pop-sep"></div>
      <button class="pop-item" data-act="requestAccess">${ic('plus')}<span class="grow">Request access to a community</span></button>
      <button class="pop-item" data-go="communities">${ic('layers')}<span class="grow">See all communities</span></button>
    </div>` : ''}
  </div>`;
}
function topbar() {
  const unread = S.notifications.filter(n => n.unread).length;
  const themeIcon = (ui.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark' ? 'sun' : 'moon';
  return `<header class="topbar">
    ${btn('', { icon: 'menu', v: 'ghost', act: 'openDrawer', title: 'Open menu', cls: 'menu-toggle' })}
    ${communitySwitcher()}
    <span class="spacer"></span>
    ${community().status !== 'active' ? '' : btn('Request pass', { v: 'primary', sm: true, icon: 'plus', go: 'type', cls: 'hide-sm' })}
    ${btn('', { icon: themeIcon, v: 'ghost', act: 'toggleTheme', title: 'Switch light or dark theme', cls: 'hide-sm' })}
    <div class="pop-anchor">
      <button class="btn btn-ghost btn-icon bell" data-pop="notif" aria-label="Notifications${unread ? `, ${unread} unread` : ''}">${ic('bell')}${unread ? '<span class="dot"></span>' : ''}</button>
      ${ui.pop === 'notif' ? `<div class="popover right wide"><div class="pop-head"><h3>Notifications</h3>${unread ? btn('Mark all as read', { v: 'link', act: 'readAll', cls: 'xs' }) : ''}</div><div class="pop-list">${S.notifications.map(n => `<button class="notif ${n.unread ? 'unread' : ''}" data-act="openNotif" data-id="${n.id}"><span class="u"></span><span class="stack-sm" style="gap:2px"><b class="small">${esc(n.title)}</b><p class="muted">${esc(n.body)}</p><span class="xs faint">${esc(n.when)}</span></span></button>`).join('')}</div><div class="pop-sep"></div><button class="pop-item" data-go="settings-notifications">${ic('gear')}<span class="grow">Notification settings</span></button></div>` : ''}
    </div>
    <div class="pop-anchor">
      <button class="btn btn-ghost" style="padding:0 6px;gap:8px" data-pop="user" aria-label="Account menu"><span class="avatar">${initials(S.profile.name)}</span><span class="hide-sm small" style="font-weight:600">${esc(S.profile.name)}</span>${ic('down', 'hide-sm')}</button>
      ${ui.pop === 'user' ? `<div class="popover right" style="min-width:240px"><div class="pop-head" style="display:grid;gap:0"><b>${esc(S.profile.name)}</b><span class="xs faint">${esc(S.profile.email)}</span></div><div class="pop-sep"></div>
        <button class="pop-item" data-go="settings-profile">${ic('user')}<span class="grow">My profile</span></button>
        <button class="pop-item" data-go="settings">${ic('briefcase')}<span class="grow">Company settings</span></button>
        <button class="pop-item" data-go="settings-security">${ic('lock')}<span class="grow">Password & security</span></button>
        <button class="pop-item" data-go="communities">${ic('layers')}<span class="grow">All communities</span></button>
        <button class="pop-item" data-act="toggleTheme">${ic(themeIcon)}<span class="grow">Switch theme</span></button>
        <div class="pop-sep"></div><button class="pop-item danger" data-act="signOut">${ic('logout')}<span class="grow">Sign out</span></button></div>` : ''}
    </div>
  </header>`;
}
function bottomNav(r) {
  const nk = navKey(r);
  const items = [['home', 'Overview', 'home'], ['permits', 'Passes', 'pass'], ['type', 'Request', 'plus'], ['people', 'Employees', 'users']];
  return `<nav class="bottom-nav" aria-label="Main">${items.map(([k, l, i]) => k === 'type' ? `<button class="fab" data-go="type" aria-label="Request pass"><span>${ic('plus')}</span>${l}</button>` : `<button class="${nk === k ? 'active' : ''}" data-go="${k}">${ic(i)}${l}</button>`).join('')}<button data-act="openDrawer">${ic('menu')}More</button></nav>`;
}
const pageHead = (title, sub, actions = '', crumbs = null) => `<div class="page-head"><div>${crumbs ? `<nav class="crumbs" aria-label="Breadcrumb">${crumbs.map(([l, g], i) => (i ? ic('right') : '') + (g ? `<button data-go="${g}">${esc(l)}</button>` : `<span>${esc(l)}</span>`)).join('')}</nav>` : ''}<h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div>${actions ? `<div class="row">${actions}</div>` : ''}</div>`;
const card = (title, body, o = {}) => `<section class="card ${o.cls || ''}" ${o.id ? `id="${o.id}"` : ''}>${title ? `<div class="card-head"><div><h2>${title}</h2>${o.sub ? `<p>${o.sub}</p>` : ''}</div>${o.action ? `<div class="row">${o.action}</div>` : ''}</div>` : ''}${o.raw ? body : `<div class="card-body ${o.tight ? 'tight' : ''}">${body}</div>`}${o.foot ? `<div class="card-foot">${o.foot}</div>` : ''}</section>`;
const alertBox = (tone, title, body = '', action = '', icon) => `<div class="alert alert-${tone}" role="${tone === 'bad' ? 'alert' : 'status'}">${ic(icon || ({ ok: 'check', warn: 'alert', bad: 'alert', info: 'info' }[tone]))}<div class="grow"><strong>${title}</strong>${body ? `<p>${body}</p>` : ''}</div>${action ? `<div class="row">${action}</div>` : ''}</div>`;

/* ================= Pages: Overview ================= */
function pHome() {
  const P = passesHere();
  const n = s => P.filter(p => p.status === s).length;
  const exp = expiringItems();
  const changes = P.filter(p => p.status === 'changes');
  const toPay = P.filter(p => p.status === 'payment');
  const upcoming = P.filter(p => p.status === 'approved' && p.to >= TODAY).sort((a, b) => a.from.localeCompare(b.from));
  const recent = P.filter(p => !p.draft).sort((a, b) => b.updated.localeCompare(a.updated)).slice(0, 5);
  const kpi = (label, val, icon, tone, sub, go) => `<button class="kpi" data-act="kpi" data-id="${go}"><span class="top">${label}<span class="ic tone-${tone}">${ic(icon)}</span></span><span class="val">${val}</span><span class="sub">${sub}</span></button>`;
  const hour = 9;
  return `${pageHead(`Good ${hour < 12 ? 'morning' : 'afternoon'}, ${esc(S.profile.name.split(' ')[0])}`, `Here's what's happening at ${esc(community().name)} today, ${fmt(TODAY)}.`, btn('Request pass', { v: 'primary', icon: 'plus', go: 'type', cls: 'btn-hide-sm' }))}
  ${toPay.map(p => alertBox('warn', `${esc(p.title)}: payment pending`, `${esc(community().name)} approved ${p.id}. Pay ${aed(feeFor(p).total)} online to get your QR codes.`, btn('Pay now', { sm: true, v: 'primary', act: 'payNow', id: p.id }))).join('')}
  ${changes.map(p => alertBox('warn', `${esc(p.title)} needs changes`, `${esc(community().name)} asked for an update on ${p.id}. Your work can't start until you resubmit.`, btn('Review changes', { sm: true, go: 'permit-' + p.id }))).join('')}
  <div class="kpis">
    ${kpi('Active passes', n('approved'), 'pass', 'ok', `${upcoming.length} with upcoming work`, 'approved')}
    ${kpi('Under review', n('review') + n('inspection'), 'clock', 'info', 'Waiting for the community', 'review')}
    ${kpi('Needs your action', n('changes') + n('draft') + n('payment'), 'alert', 'warn', `${plural(n('changes'), 'change request')} · ${plural(n('payment'), 'payment')} · ${plural(n('draft'), 'draft')}`, 'action')}
    ${kpi('Expiring documents', exp.length, 'file', exp.some(e => e.tone === 'bad') ? 'bad' : 'warn', 'IDs, vehicles and company files', 'expiring')}
  </div>
  <div class="layout-main">
    <div class="stack">
      ${S.draft && S.draft.community === S.community ? card('', `<div class="row between"><div class="row" style="gap:12px;flex-wrap:nowrap;min-width:0"><span class="list-row" style="padding:0"><span class="ic tone-neutral">${ic('edit')}</span></span><div style="min-width:0"><h3>Continue your draft: ${esc(S.draft.title || 'Untitled request')}</h3><p class="small muted">${esc([S.draft.property, S.draft.units.join(', ')].filter(Boolean).join(' · ') || 'Location not set')} · Step ${Math.min(S.draft.reached + 1, 7)} of 7 · Saved ${fmt(S.draft.saved)}</p></div></div><div class="row">${btn('Discard', { v: 'ghost', sm: true, act: 'discardDraft' })}${btn('Resume draft', { sm: true, act: 'resumeDraft', iconR: 'arrowR' })}</div></div><div class="progress" aria-label="Draft progress"><i style="width:${Math.round(((S.draft.reached + 1) / 7) * 100)}%"></i></div>`) : ''}
      ${card('Recent passes', recent.length ? permitTable(recent, true) : emptyState('pass', 'No passes yet', 'Request your first pass to get started.', btn('Request pass', { v: 'primary', sm: true, go: 'type', icon: 'plus' })), { raw: true, action: btn('View all', { v: 'ghost', sm: true, go: 'permits', iconR: 'arrowR' }) })}
    </div>
    <div class="stack">
      ${card('Upcoming work', upcoming.length ? upcoming.map(p => `<button class="list-row" style="width:100%;text-align:left" data-go="permit-${p.id}"><span class="ic tone-ok">${ic('calendar')}</span><span class="grow"><b>${esc(p.title)}</b><span>${range(p.from, p.to)} · ${esc(p.units.join(', '))}</span></span>${ic('right', 'faint')}</button>`).join('') : '<p class="muted small" style="padding:12px">No approved work scheduled.</p>', { tight: true })}
      ${card('Expiring soon', exp.length ? exp.slice(0, 5).map(e => `<button class="list-row" style="width:100%;text-align:left" data-go="${e.go}"><span class="ic tone-${e.tone}">${ic(e.icon)}</span><span class="grow"><b>${esc(e.title)}</b><span>${esc(e.sub)}</span></span>${ic('right', 'faint')}</button>`).join('') : '<p class="muted small" style="padding:12px">Everything is up to date.</p>', { tight: true, sub: 'Expired documents block new passes.' })}
    </div>
  </div>`;
}
const emptyState = (icon, title, body, action = '') => `<div class="empty"><span class="ic">${ic(icon)}</span><h3>${title}</h3><p class="small">${body}</p>${action}</div>`;

/* ================= Pages: Passes list ================= */
function permitTable(list, compact) {
  return `<div class="table-wrap"><table class="table responsive"><thead><tr><th>Pass</th><th>Location</th><th>Work dates</th><th>Status</th>${compact ? '' : '<th>Updated</th>'}<th class="t-actions"><span class="sr">Actions</span></th></tr></thead><tbody>
  ${list.map(p => `<tr class="clickable" data-go="${p.draft ? 'details' : 'permit-' + p.id}">
    <td><div class="t-main"><b>${esc(p.title)}</b><span>${p.draft ? 'Not submitted' : `<span class="mono">${p.id}</span>`} · ${esc(typeOf(p.type).name)}</span></div></td>
    <td data-m="sub">${esc(p.units.join(', ') || '—')}<div class="xs faint">${esc(p.property || '')}</div></td>
    <td data-m="hide" class="num">${p.draft && !p.from ? '<span class="faint">Not set</span>' : range(p.from, p.to)}</td>
    <td data-m="side">${statusBadge(p.status)}</td>
    ${compact ? '' : `<td data-m="hide" class="faint num">${fmt(p.updated)}</td>`}
    <td class="t-actions">${btn('View', { v: 'secondary', sm: true, go: p.draft ? 'details' : 'permit-' + p.id, title: `View ${p.title}` })}</td>
  </tr>`).join('')}</tbody></table></div>`;
}
function rowMenuItems(p) {
  const it = (icon, label, attrs, danger) => `<button class="pop-item ${danger ? 'danger' : ''}" ${attrs}>${ic(icon)}<span class="grow">${label}</span></button>`;
  const out = [];
  if (p.draft) { out.push(it('edit', 'Resume draft', 'data-act="resumeDraft"')); out.push('<div class="pop-sep"></div>'); out.push(it('trash', 'Delete draft', 'data-act="discardDraft"', true)); return out.join(''); }
  out.push(it('eye', 'View details', `data-go="permit-${p.id}"`));
  if (p.status === 'changes') out.push(it('edit', 'Update and resubmit', `data-act="updatePermit" data-id="${p.id}"`));
  if (p.status === 'payment') out.push(it('receipt', 'Pay now', `data-act="payNow" data-id="${p.id}"`));
  if (canDownload(p)) out.push(it('download', 'Download permit', `data-act="download" data-id="${p.id}"`));
  if (canComplete(p)) out.push(it('clipboard', 'Mark as completed', `data-act="markComplete" data-id="${p.id}"`));
  if (p.kind === 'work') out.push(it('copy', 'Duplicate as new request', `data-act="duplicate" data-id="${p.id}"`));
  out.push(it('mail', 'Contact community', 'data-go="help"'));
  if (['review', 'changes', 'payment', 'approved'].includes(p.status)) { out.push('<div class="pop-sep"></div>'); out.push(it('x', p.status === 'approved' ? 'Cancel pass' : 'Withdraw request', `data-act="cancelPermit" data-id="${p.id}"`, true)); }
  return out.join('');
}
// Final inspection can be switched off by the community (S.rules.finalInspection).
const inspOn = () => S.rules.finalInspection !== false;
const canDownload = p => !p.draft && ['approved', 'inspection', 'completed', 'expired', 'revoked', 'suspended'].includes(p.status);
// Only work that has started can be marked as completed (not upcoming permits).
const canComplete = p => inspOn() && p.kind === 'work' && !p.draft && ['approved', 'expired', 'revoked', 'suspended'].includes(p.status) && !!p.from && p.from <= TODAY;
const DECISION = { not_ready: ['Not complete yet', 'warn'], complete: ['Completed', 'ok'], incomplete: ['Closed as incomplete', 'bad'], resubmitted: ['Marked as completed again', 'ok'] };
// Closing details of a closed inspection: the final community round, or the summary fields on the inspection.
function closureOf(p) {
  const i = p.inspection; if (!i || i.status !== 'closed') return null;
  const r = [...(i.rounds || [])].reverse().find(x => x.decision === 'complete' || x.decision === 'incomplete');
  return { outcome: i.outcome || (r && r.decision === 'incomplete' ? 'Closed as incomplete' : 'Completed'), remark: r ? r.comment : (i.remark || ''), by: r ? r.by : (i.closedBy || ''), at: r ? r.at : (i.closedAt || ''), files: r ? (r.files || []) : (i.files || []) };
}
const fileChips = (arr = []) => arr.length ? `<span class="tl-files">${arr.map(f => `<span class="file-chip">${ic('file')}${esc(f)}</span>`).join('')}</span>` : '';
const timelineHtml = items => `<div class="timeline">${items.map(i => `<div class="tl ${i.t}"><span class="dot">${i.t === 'done' ? ic('check') : i.t === 'bad' ? ic('x') : i.t === 'warn' ? ic('alert') : ''}</span><div class="grow"><b>${i.title}</b><span>${i.sub}</span>${i.note ? `<q class="tl-note">${esc(i.note)}</q>` : ''}${fileChips(i.files)}</div></div>`).join('')}</div>`;
function inspectionTimeline(p) {
  const i = p.inspection, items = [{ t: 'done', title: 'Marked as completed', sub: `${esc(S.profile.name)} · ${fmtDT(i.at)}`, note: i.notes, files: i.photos }];
  (i.rounds || []).forEach(r => { const [label, tone] = DECISION[r.decision] || [r.decision, 'neutral']; items.push({ t: tone === 'ok' ? 'done' : tone === 'bad' ? 'bad' : 'warn', title: label, sub: `${esc(r.by)} · ${fmtDT(r.at)}`, note: r.comment, files: r.files }); });
  if (i.status === 'pending') items.push({ t: 'now', title: 'Community review', sub: 'The community will check the work and reply here.' });
  if (i.status === 'waiting') items.push({ t: 'now', title: 'Waiting for you', sub: 'Fix the items above, then mark it as completed again.' });
  return timelineHtml(items);
}
function inspectionCards(p) {
  const i = p.inspection; if (!i) return '';
  const cl = closureOf(p);
  const rep = cl ? card('Closure report', `<dl class="dl">
      <dt>Outcome</dt><dd>${badge(cl.outcome, cl.outcome === 'Completed' ? 'ok' : 'bad')}</dd>
      <dt>Closing remark</dt><dd>${esc(cl.remark || '—')}</dd>
      <dt>Closed by</dt><dd>${esc(cl.by || '—')}</dd>
      <dt>Closed on</dt><dd>${fmtDT(cl.at)}</dd>
      <dt>Attached files</dt><dd>${cl.files.length ? fileChips(cl.files) : '<span class="faint">None</span>'}</dd></dl>`, { foot: btn('View report', { sm: true, icon: 'eye', act: 'viewClosure', id: p.id }) + btn('Download report PDF', { sm: true, icon: 'download', act: 'downloadClosure', id: p.id }) }) : '';
  return rep + card('Final inspection', inspectionTimeline(p), { id: 'final-inspection', sub: i.status === 'closed' ? 'Closed' : i.status === 'waiting' ? 'Waiting for you' : 'Waiting for the community' });
}
function closureHtml(p) {
  const i = p.inspection, cl = closureOf(p), t = typeOf(p.type), c = communityOf(p.community);
  const list = a => a.length ? a.map(x => `<div>${x}</div>`).join('') : '<span class="faint">None</span>';
  const ws = [...(p.workers || []).map(person), ...(p.extraWorkers || []).map(x => person(x.id))].filter(Boolean).map(w => esc(`${w.name} · ${w.role}`));
  const vs = (p.vehicles || []).map(vehicle).filter(Boolean).map(v => esc(`${v.plate} · ${v.make}`));
  return `<div class="stack">
    <div class="row between" style="flex-wrap:wrap"><div><b>${esc(p.title)}</b><div class="xs faint"><span class="mono">${esc(p.id)}</span> · ${esc(t.name)}</div></div>${badge(cl.outcome, cl.outcome === 'Completed' ? 'ok' : 'bad')}</div>
    <dl class="dl"><dt>Community</dt><dd>${esc(c.name)}</dd><dt>Location</dt><dd>${esc(p.property)} · ${esc(p.units.join(', '))}</dd><dt>Work dates</dt><dd>${range(p.from, p.to)} · ${esc(p.hours || '')}</dd><dt>Workers</dt><dd>${list(ws)}</dd><dt>Vehicles</dt><dd>${list(vs)}</dd></dl>
    <div><span class="eyebrow">Contractor completion notes</span><q class="tl-note">${esc(i.notes || 'No notes')}</q>${fileChips(i.photos)}</div>
    <div><span class="eyebrow">Inspection history</span>${inspectionTimeline(p)}</div>
    <div><span class="eyebrow">Closing remark</span><q class="tl-note">${esc(cl.remark || '—')}</q><p class="xs faint" style="margin-top:6px">${esc(cl.by)} · ${fmtDT(cl.at)}</p></div></div>`;
}
function pPermits() {
  const P = passesHere();
  const tabs = [['all', 'All'], ['action', 'Needs action'], ['review', 'Under review'], ['approved', 'Approved'], ['stopped', 'Revoked & suspended'], ['past', 'Past']];
  const inTab = (p, t) => t === 'all' || (t === 'action' ? ['changes', 'draft', 'payment'].includes(p.status) : t === 'review' ? ['review', 'inspection'].includes(p.status) : t === 'stopped' ? ['revoked', 'suspended'].includes(p.status) : t === 'past' ? ['completed', 'expired', 'cancelled'].includes(p.status) : p.status === t);
  const q = (ui.search.permits || '').toLowerCase();
  const f = ui.filters;
  let list = P.filter(p => inTab(p, ui.tab))
    .filter(p => !q || [p.title, p.id, p.property, p.units.join(' ')].join(' ').toLowerCase().includes(q))
    .filter(p => !f.kind || p.kind === f.kind)
    .filter(p => !f.property || p.property === f.property)
    .filter(p => !f.from || (p.to || '9999') >= f.from)
    .filter(p => !f.to || (p.from || '0000') <= f.to);
  const sort = ui.sort || 'updated';
  list.sort((a, b) => sort === 'start' ? (b.from || '').localeCompare(a.from || '') : (b.updated || '').localeCompare(a.updated || ''));
  const nf = ['kind', 'property', 'from', 'to'].filter(k => f[k]).length;
  return `${pageHead('Authorized passes', `Work permits and visitor passes for ${esc(community().name)}.`, btn('Request pass', { v: 'primary', icon: 'plus', go: 'type' }))}
  <section class="card">
    <div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button class="tab ${ui.tab === k ? 'active' : ''}" role="tab" aria-selected="${ui.tab === k}" data-act="tab" data-id="${k}">${l}<span class="count">${P.filter(p => inTab(p, k)).length}</span></button>`).join('')}</div>
    <div class="toolbar">
      <div class="search">${ic('search')}<input class="input" id="permit-search" data-search="permits" placeholder="Search by work, reference or unit" value="${esc(ui.search.permits || '')}" aria-label="Search passes"></div>
      ${btn(nf ? `Filters (${nf})` : 'Filters', { sm: true, icon: 'filter', act: 'openFilters' })}
      ${nf ? btn('Clear', { v: 'ghost', sm: true, act: 'clearFilters' }) : ''}
      <span class="grow"></span>
      <label class="sr" for="permit-sort">Sort</label><select class="select" id="permit-sort" data-change="sort"><option value="updated" ${sort === 'updated' ? 'selected' : ''}>Recently updated</option><option value="start" ${sort === 'start' ? 'selected' : ''}>Work start date</option></select>
    </div>
    ${list.length ? permitTable(list) : emptyState('search', 'No passes match', q || nf ? 'Try a different search or clear the filters.' : 'Nothing in this list yet.', q || nf ? btn('Clear search and filters', { sm: true, act: 'clearFilters' }) : '')}
    <div class="pager"><span>Showing ${list.length} of ${P.length}</span><div class="row">${btn('', { v: 'secondary', sm: true, icon: 'left', disabled: true, title: 'Previous page' })}${btn('', { v: 'secondary', sm: true, icon: 'right', disabled: true, title: 'Next page' })}</div></div>
  </section>`;
}

/* ================= Pages: Pass detail ================= */
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
const invoiceOf = p => S.invoices.find(i => i.permitId === p.id);
const communityOf = id => S.communities.find(c => c.id === id) || community();
// Approval timeline: every step the community took, then what is still to come.
function approvalTimeline(p) {
  const fee = feeFor(p), inv = invoiceOf(p);
  const issued = ['approved', 'inspection', 'completed', 'expired', 'revoked', 'suspended'].includes(p.status) || (p.status === 'cancelled' && inv);
  const items = [{ t: 'done', title: 'Request submitted', sub: 'Sent to ' + communityOf(p.community).name }];
  (p.approvals || []).forEach(a => {
    const chg = a.outcome === 'Changes requested';
    items.push({ t: chg ? 'warn' : 'done', title: esc(a.step), sub: `${esc(a.outcome || 'Approved')} by ${esc(a.by)} · ${fmtDT(a.at)}`, note: a.note });
  });
  if (p.status === 'changes' && !(p.approvals || []).some(a => a.outcome === 'Changes requested')) items.push({ t: 'warn', title: 'Changes requested', sub: 'The community asked for an update', note: p.message });
  if (p.status === 'review') items.push({ t: 'now', title: 'Community review', sub: 'In progress. More approvals may follow.' });
  if (p.status === 'changes') items.push({ t: 'now', title: 'Waiting for you', sub: 'Update and resubmit the request.' });
  if (fee.total > 0) {
    if (inv) items.push({ t: 'done', title: 'Payment received', sub: `${aed(inv.amount)} · ${esc(inv.method)} · ${fmtDT(inv.paidAt)} · ${esc(inv.id)}` });
    else if (p.status === 'payment') items.push({ t: 'now', title: 'Payment pending', sub: `Pay ${aed(fee.total)} online to get your QR codes.` });
    else if (['review', 'changes'].includes(p.status)) items.push({ t: '', title: 'Payment', sub: `${aed(fee.total)} due after the community approves` });
  }
  if (issued) items.push({ t: 'done', title: 'Pass issued', sub: 'Permit and QR codes issued' });
  else if (!['cancelled'].includes(p.status)) items.push({ t: '', title: 'Pass issued', sub: 'After approval' + (fee.total > 0 ? ' and payment' : '') });
  if (p.status === 'revoked' || p.status === 'suspended') items.push({ t: 'bad', title: p.status === 'revoked' ? 'Revoked by the community' : 'Suspended by the community', sub: p.revokedAt ? fmt(p.revokedAt) : fmt(p.updated), note: p.message });
  if (p.status === 'completed') items.push({ t: 'done', title: 'Work completed', sub: fmt(p.updated) });
  if (p.status === 'inspection') items.push(p.inspection && p.inspection.status === 'waiting' ? { t: 'warn', title: 'Final inspection: not complete yet', sub: 'Fix the work and mark it as completed again.' } : { t: 'now', title: 'Final inspection', sub: 'The community is checking the work.' });
  if (p.status === 'expired') items.push({ t: 'bad', title: 'Pass expired', sub: 'The work dates have passed.' });
  if (p.status === 'cancelled') items.push({ t: 'bad', title: 'Cancelled', sub: fmt(p.updated) });
  return `<div class="timeline">${items.map(i => `<div class="tl ${i.t}"><span class="dot">${i.t === 'done' ? ic('check') : i.t === 'bad' ? ic('x') : i.t === 'warn' ? ic('alert') : ''}</span><div class="grow"><b>${i.title}</b><span>${i.sub}</span>${i.note ? `<q class="tl-note">${esc(i.note)}</q>` : ''}</div></div>`).join('')}</div>`;
}
function waitingAlert(p) {
  const r = [...(p.inspection.rounds || [])].reverse().find(x => x.decision === 'not_ready') || {};
  return alertBox('warn', 'Not complete yet', `${esc(communityOf(p.community).name)}${r.by ? ' (' + esc(r.by) + ')' : ''} says: “${esc(r.comment || 'Please fix the work and send it again.')}”${(r.files || []).length ? `<br>${fileChips(r.files)}` : ''}`, inspOn() ? btn("I've fixed it, mark as completed again", { v: 'primary', sm: true, icon: 'clipboard', act: 'resubmitInspection', id: p.id }) : '');
}
function feeLines(f) { return `<div class="fee-lines">${f.lines.map(l => `<div><span>${esc(l.label)}</span><b>${aed(l.amount)}</b></div>`).join('')}<div class="total"><span>Total</span><b>${aed(f.total)}</b></div></div>`; }
function pPermit(id) {
  const p = S.permits.find(x => x.id === id);
  if (!p) return pageHead('Pass not found', 'It may have been removed.', btn('Back to passes', { go: 'permits' }));
  const t = typeOf(p.type), fee = feeFor(p), inv = invoiceOf(p);
  const actions = [];
  if (p.status === 'payment') actions.push(btn('Pay now', { v: 'primary', icon: 'receipt', act: 'payNow', id: p.id }));
  if (canDownload(p)) actions.push(btn('Download permit', { v: p.kind === 'work' ? 'secondary' : 'primary', icon: 'download', act: 'download', id: p.id }));
  if (canComplete(p)) actions.push(btn('Mark as completed', { v: 'secondary', icon: 'clipboard', act: 'markComplete', id: p.id }));
  if (p.status === 'changes') actions.push(btn('Update and resubmit', { v: 'primary', icon: 'edit', act: 'updatePermit', id: p.id }));
  actions.push(`<div class="pop-anchor">${btn('', { icon: 'more', act: 'rowMenu', id: p.id, title: 'More actions' })}</div>`);
  const workers = (p.workers || []).map(person).filter(Boolean);
  const extras = (p.extraWorkers || []).map(x => ({ x, p: person(x.id) })).filter(e => e.p);
  const vehicles = (p.vehicles || []).map(vehicle).filter(Boolean);
  const live = p.status === 'approved' && p.kind === 'work';
  const room = t.maxEmployees ? t.maxEmployees - workers.length - extras.filter(e => !e.x.revoked).length : 99;
  const workerRow = (w, ex) => `<div class="list-row"><span class="avatar">${initials(w.name)}</span><span class="grow"><b>${esc(w.name)}</b><span>${esc(w.role)} · ${esc(w.idType)}${ex ? ` · Added ${fmt(ex.added)}` : ''}</span>${ex && ex.revoked ? `<span class="rev-reason">${ic('alert')}Reason: ${esc(ex.revoked.reason || 'No reason given')}${ex.revoked.at ? ' · ' + fmt(ex.revoked.at) : ''}</span>` : ''}</span><span class="row" style="gap:6px;justify-content:flex-end">${ex ? (ex.revoked ? badge('Revoked by the community', 'bad') : badge('Added after approval', 'info')) : ''}${ex && ex.revoked ? '' : badge(expiry(w.idExpiry).label, expiry(w.idExpiry).tone)}</span></div>`;
  const addBtn = live ? (S.rules.workersAfterApproval ? `<div class="list-row" style="justify-content:space-between"><span class="small muted">${room > 0 ? `You can add up to ${plural(room, 'more worker')}.` : `This permit type allows ${t.maxEmployees} workers. The limit is reached.`}</span>${btn('Add worker', { sm: true, icon: 'plus', act: 'addWorker', id: p.id, disabled: room <= 0 })}</div>` : `<p class="xs faint" style="padding:8px 12px 12px">${esc(communityOf(p.community).name)} does not allow adding workers after approval.</p>`) : '';
  const payCard = inv ? card('Payment', `<dl class="dl"><dt>Amount</dt><dd>${aed(inv.amount)}</dd><dt>Method</dt><dd>${esc(inv.method)}</dd><dt>Paid on</dt><dd>${fmtDT(inv.paidAt)}</dd><dt>Invoice</dt><dd><span class="mono">${esc(inv.id)}</span> ${badge(inv.status, 'ok')}</dd></dl>`, { foot: btn('View invoice', { sm: true, icon: 'eye', act: 'viewInvoice', id: inv.id }) + btn('Download invoice PDF', { sm: true, icon: 'download', act: 'downloadInvoice', id: inv.id }) })
    : fee.total > 0 && ['payment', 'review', 'changes'].includes(p.status) ? card(p.status === 'payment' ? 'Payment due' : 'Fee', feeLines(fee) + (p.status === 'payment' ? '' : `<p class="xs faint">Payment is due after the community approves. You get your QR codes once payment is made.</p>`), p.status === 'payment' ? { foot: btn('Pay now', { v: 'primary', icon: 'receipt', act: 'payNow', id: p.id }) } : {}) : '';
  return `${pageHead(`${esc(p.title)} ${statusBadge(p.status)}`, `<span class="mono">${p.id}</span> · ${esc(t.name)} · Last updated ${fmt(p.updated)}`, actions.join(''), [['Authorized passes', 'permits'], [p.id]])}
  ${p.status === 'changes' ? alertBox('warn', 'Changes requested by ' + esc(communityOf(p.community).name), esc(p.message), btn('Update and resubmit', { sm: true, act: 'updatePermit', id: p.id })) : ''}
  ${p.status === 'payment' ? alertBox('warn', `Payment pending: ${aed(fee.total)}`, 'The community approved your request. Pay online to get your QR codes. Work can start only after payment.', btn('Pay now', { sm: true, v: 'primary', act: 'payNow', id: p.id })) : ''}
  ${p.status === 'approved' ? alertBox('ok', 'Approved. Your pass is ready.', 'Show the QR code at the gate. Follow the work dates, hours and conditions on the permit.') : ''}
  ${p.status === 'revoked' || p.status === 'suspended' ? alertBox('bad', `${p.status === 'revoked' ? 'Revoked' : 'Suspended'} by ${esc(communityOf(p.community).name)}`, esc(p.message || 'No reason was given.') + ' QR codes no longer work at the gate. Contact the community to ask what happens next.', btn('Contact community', { sm: true, go: 'help' })) : ''}
  ${p.inspection && p.inspection.status === 'pending' ? alertBox('info', 'Final inspection requested', 'You marked the work as completed. The community will check it and reply here. Your permit closes when they confirm.') : ''}
  ${p.inspection && p.inspection.status === 'waiting' ? waitingAlert(p) : ''}
  ${p.status === 'review' ? alertBox('info', 'Waiting for community review', 'You will get an email and a notification when the community responds. Work can start only after approval.') : ''}
  <div class="layout-main">
    <div class="stack">
      ${inspectionCards(p)}
      ${card('Work details', `<dl class="dl">
        <dt>Pass type</dt><dd>${esc(t.name)}</dd>
        <dt>Location</dt><dd>${esc(p.property)} · ${esc(p.units.join(', '))}</dd>
        <dt>Work dates</dt><dd>${range(p.from, p.to)}</dd>
        <dt>Daily hours</dt><dd>${esc(p.hours || '—')}</dd>
        <dt>Materials</dt><dd>${p.materials ? plural(p.materials, 'item') : 'None'}</dd>
        ${p.amc && p.amc.freq ? `<dt>Maintenance contract</dt><dd>${esc(FREQ[p.amc.freq][0])} · ${plural(Number(p.amc.visits), 'visit')} each ${FREQ[p.amc.freq][1]}</dd>` : ''}
        ${fee.total > 0 ? `<dt>Fee</dt><dd>${aed(fee.total)}</dd>` : ''}
      </dl>`)}
      ${card('Workers & vehicles', `${workers.map(w => workerRow(w)).join('')}${extras.map(e => workerRow(e.p, e.x)).join('')}${addBtn}${vehicles.map(v => `<div class="list-row"><span class="ic tone-neutral">${ic('car')}</span><span class="grow"><b>${esc(v.plate)}</b><span>${esc(v.make)} · ${esc(v.color)}${v.tons ? ' · ' + v.tons + ' t' : ''}${t.model === 'trip' || (p.tripsBy && p.tripsBy[v.id] > 1) ? ' · ' + plural(tripsOf(p, v.id), 'trip') : ''}</span></span>${badge(expiry(v.regExpiry).label, expiry(v.regExpiry).tone)}</div>`).join('')}${!workers.length && !vehicles.length ? '<p class="muted small" style="padding:12px">No workers or vehicles on this pass.</p>' : ''}`, { tight: true })}
      ${card('Documents', (p.docs || []).length ? p.docs.map(d => `<div class="list-row"><span class="ic tone-bad" style="font-size:10px;font-weight:800">PDF</span><span class="grow"><b>${esc(d)}</b><span>Submitted ${fmt(p.updated)}</span></span>${btn('', { v: 'ghost', sm: true, icon: 'download', act: 'download', id: d, title: 'Download ' + d })}</div>`).join('') : '<p class="muted small" style="padding:12px">No documents were needed.</p>', { tight: true })}
    </div>
    <div class="stack">
      ${p.status === 'approved' ? card('Entry QR code', `<div class="row" style="gap:16px;flex-wrap:nowrap"><div class="qr">${qrSvg(p.id)}</div><div class="stack-sm"><p class="small muted">One code covers the permit. Each worker also gets a personal code by SMS.</p>${btn('Share codes', { sm: true, icon: 'send', act: 'shareCodes', id: p.id })}</div></div><p class="xs faint">Design placeholder. This is not a real access code.</p>`) : ''}
      ${payCard}
      ${card('Approval timeline', approvalTimeline(p), { id: 'approval-timeline' })}
      ${card('Questions?', `<p class="small muted">Contact ${esc(communityOf(p.community).name)} and quote <span class="mono">${p.id}</span>.</p><div class="row">${btn('Copy reference', { sm: true, icon: 'copy', act: 'copy', id: p.id })}${btn('Contact community', { sm: true, v: 'ghost', go: 'help' })}</div>`)}
    </div>
  </div>`;
}

/* ================= Pages: Request type ================= */
function pType() {
  return `${pageHead('Request a pass', `What do you need at ${esc(community().name)}?`, '', [['Authorized passes', 'permits'], ['Request pass']])}
  <div class="grid-2">
    ${card('', `<div class="row" style="gap:12px;flex-wrap:nowrap;align-items:flex-start"><span class="list-row" style="padding:0"><span class="ic tone-warn">${ic('briefcase')}</span></span><div class="stack-sm"><h2>Work permit</h2><p class="muted">For maintenance, fit-out, repairs and any contractor work inside the community.</p><p class="small faint">About 10 minutes · 7 steps · Draft saves as you go</p></div></div><div class="row">${btn('Start work permit', { v: 'primary', act: 'startPermit', iconR: 'arrowR' })}${btn('See what you need', { v: 'ghost', act: 'checklist' })}</div>`)}
    ${card('', `<div class="row" style="gap:12px;flex-wrap:nowrap;align-items:flex-start"><span class="list-row" style="padding:0"><span class="ic tone-info">${ic('ticket')}</span></span><div class="stack-sm"><h2>Visitor pass</h2><p class="muted">For a site survey, meeting or delivery with no contractor work.</p><p class="small faint">About 2 minutes · One page</p></div></div><div class="row">${btn('Start visitor pass', { go: 'visitor', iconR: 'arrowR' })}</div>`)}
  </div>
  ${alertBox('info', 'Allow time for review', `${esc(community().name)} needs requests at least 2 days before work starts. Expired IDs, vehicle registrations or company documents will block approval.`)}`;
}
function checklistModal() {
  const t = typeOf(ui.modal.data.type || 'general');
  return modalFrame({ title: 'Before you start', sub: 'Prepare these files so you can finish in one go.', size: 'lg', body: `
    <div class="segmented" role="radiogroup" aria-label="Permit type">${PERMIT_TYPES.map(x => `<label><input type="radio" name="cl-type" value="${x.id}" data-bind="m.type" data-rerender ${t.id === x.id ? 'checked' : ''}><span>${esc(x.name)}</span></label>`).join('')}</div>
    <div class="stack-sm"><span class="eyebrow">Required for ${esc(t.name)}</span>${t.docs.map(d => `<div class="list-row" style="border:1px solid var(--border);border-radius:8px"><span class="ic tone-ok">${ic('check')}</span><span class="grow"><b>${DOCS[d].name}</b><span>${DOCS[d].hint}</span></span>${DOCS[d].template ? btn('Template', { v: 'ghost', sm: true, icon: 'download', act: 'download', id: DOCS[d].name + ' template' }) : ''}</div>`).join('')}</div>
    ${t.optional.length ? `<div class="stack-sm"><span class="eyebrow">May also be requested</span>${t.optional.map(d => `<div class="list-row"><span class="ic tone-neutral">${ic('file')}</span><span class="grow"><b>${DOCS[d].name}</b><span>${DOCS[d].hint}</span></span></div>`).join('')}</div>` : ''}
    <div class="stack-sm"><span class="eyebrow">Also check</span><div class="list-row"><span class="ic tone-neutral">${ic('users')}</span><span class="grow"><b>Worker IDs</b><span>Every worker's Emirates ID or passport must be valid for all work dates.</span></span></div><div class="list-row"><span class="ic tone-neutral">${ic('car')}</span><span class="grow"><b>Vehicle registration</b><span>Needed only if vehicles enter the community.</span></span></div></div>`,
  foot: btn('Close', { act: 'closeModal' }) + btn('I have these ready', { v: 'primary', act: 'startPermitFromChecklist', iconR: 'arrowR' }) });
}

/* ================= Wizard ================= */
function stepIndex(r) { return STEPS.findIndex(s => s[0] === r); }
function validate(step) {
  const d = S.draft, e = {};
  if (step === 'details') {
    if (!d.community) e.community = 'Choose a community.';
    if (!d.property) e.property = 'Choose the building where the work will happen.';
    if (!d.units.length) e.units = 'Choose at least one unit.';
    if (!d.title.trim()) e.title = 'Describe the work in a few words, for example “Painting work”.';
    if (!d.contact.trim()) e.contact = 'Enter the name of the person on site.';
    if (!/^\+?[\d\s-]{8,}$/.test(d.phone.trim())) e.phone = 'Enter a phone number with country code, for example +971 50 000 0000.';
    const min = addDays(TODAY, 2);
    if (!d.from) e.from = 'Choose a start date.'; else if (d.from < min) e.from = `Start on or after ${fmt(min)}. The community needs 2 days' notice.`;
    if (!d.to) e.to = 'Choose an end date.'; else if (d.from && d.to < d.from) e.to = 'The end date must be on or after the start date.';
    if (d.start && d.end && d.end <= d.start) e.end = 'Finish time must be after the start time.';
    const tt = typeOf(d.type);
    if (tt.maxDays && d.from && d.to && !e.to && Math.round((D(d.to) - D(d.from)) / 864e5) + 1 > tt.maxDays) e.to = `${tt.name} can last up to ${plural(tt.maxDays, 'day')}. Choose an earlier end date.`;
    if (tt.amcAllowed && d.amc === 'yes') {
      if (!FREQ[d.amcFreq]) e.amcFreq = 'Choose how often visits are needed.';
      if (!(Number(d.amcVisits) >= 1) || !Number.isInteger(Number(d.amcVisits))) e.amcVisits = 'Enter a whole number, 1 or more.';
    }
  }
  if (step === 'materials' && !d.noMaterials && !d.materials.length) e.materials = 'Add at least one item, or turn on “No materials or equipment”.';
  if (step === 'workvehicles') {
    const trip = typeOf(d.type).model === 'trip';
    if (trip && !d.vehicles.length) e.vehicles = 'A delivery needs at least one vehicle. Select a vehicle or add a new one.';
    else if (!trip && !d.noVehicles && !d.vehicles.length) e.vehicles = 'Select a vehicle, or turn on “No vehicles needed”.';
    if (trip || !d.noVehicles) {
      const noTons = d.vehicles.map(vehicle).filter(v => v && !(Number(v.tons) > 0));
      if (noTons.length) e.tons = `${noTons.map(v => v.plate).join(', ')}: add the vehicle weight in tons. Choose Edit weight below.`;
    }
  }
  if (step === 'personnel') {
    const lim = typeOf(d.type).maxEmployees;
    if (!d.workers.length) e.workers = 'Select at least one worker.';
    else if (lim && d.workers.length > lim) e.workers = `${typeOf(d.type).name} allows up to ${plural(lim, 'worker')}. Remove ${d.workers.length - lim}.`;
    const bad = d.workers.map(person).filter(p => p && p.idExpiry < TODAY);
    if (bad.length) e.workers = `${bad.map(p => p.name).join(', ')}: ID has expired. Upload the renewed ID or remove the worker.`;
  }
  if (step === 'documents') {
    typeOf(d.type).docs.forEach(k => {
      const doc = d.docs[k] || {};
      if (!doc.file) e['doc-' + k] = `Upload the ${DOCS[k].name}.`;
      else if (doc.file.status === 'checking') e['doc-' + k] = `Wait for the ${DOCS[k].name} check to finish.`;
      else if (!doc.noExpiry && !doc.expiry) e['doc-' + k] = `Enter the expiry date for the ${DOCS[k].name}, or mark it as having no expiry.`;
      else if (!doc.noExpiry && doc.expiry < TODAY) e['doc-' + k] = `The ${DOCS[k].name} has expired. Upload the renewed document.`;
    });
  }
  if (step === 'pdf') {
    const forms = formsFor(d);
    forms.forEach(f => { const t = (d.ticks || {})[formKey(f)] || {}; const miss = f.published.fields.filter(x => x.required && !t[x.id]).length; if (miss) e['form-' + f.id] = `Tick ${plural(miss, 'more box', 'more boxes')} in “${f.published.name}”.`; });
    if (forms.length) {
      const g = d.signer || {};
      if (!(g.name || '').trim()) e['sg-name'] = 'Enter your full name.';
      if (!(g.position || '').trim()) e['sg-position'] = 'Enter your position, for example Site supervisor.';
      if (!g.sig) e['sg-sig'] = 'Draw or upload your signature.';
      if (!g.auth) e['sg-auth'] = 'Confirm you are authorised to sign.';
    }
  }
  if (step === 'review' && !d.consent) e.consent = 'Confirm the information is correct.';
  if (step === 'review') {
    if (S.company.licenceExpiry && S.company.licenceExpiry < TODAY) e.licence = 'Your trade licence has expired. Upload the renewed licence in Settings › Company & billing.';
  }
  return e;
}
function errSummary(step) {
  if (!ui.errs[step]) return '';
  const e = validate(step);
  const keys = Object.keys(e);
  if (!keys.length) return '';
  return `<div class="alert alert-bad" role="alert" id="err-summary" tabindex="-1">${ic('alert')}<div class="grow"><strong>${plural(keys.length, 'thing')} to fix before you continue</strong><ul>${keys.map(k => `<li><a data-act="focus" data-id="f-${k}">${esc(e[k])}</a></li>`).join('')}</ul></div></div>`;
}
const errOf = (step, k) => ui.errs[step] ? validate(step)[k] : '';
function wizard(r, body) {
  const i = stepIndex(r);
  const d = S.draft;
  const isLast = r === 'review';
  return `<div class="wizard">
    <aside class="steps" aria-label="Request steps">
      <div class="meta"><span class="eyebrow">Work permit</span><b>${esc(d.title || 'New request')}</b><span class="xs faint">${esc(community().name)}</span></div>
      ${STEPS.map(([k, l], j) => { const done = j < i || (j <= d.reached && j !== i); const cur = j === i; return `<button class="step ${cur ? 'current' : done ? 'done' : ''}" ${done || cur || j <= d.reached ? `data-act="gotoStep" data-id="${k}"` : 'disabled'} ${cur ? 'aria-current="step"' : ''}><span class="n">${done && !cur ? ic('check') : j + 1}</span>${l}</button>`; }).join('')}
      <div class="discard">${btn('Discard draft', { v: 'danger-ghost', sm: true, icon: 'trash', act: 'discardDraft', cls: 'btn-block' })}</div>
    </aside>
    <div class="stack">
      <div class="wz-mobile"><div class="row between"><span class="eyebrow">Step ${i + 1} of ${STEPS.length}</span><span class="xs faint">${STEPS[i + 1] ? 'Next: ' + STEPS[i + 1][1] : 'Last step'}</span></div><div class="progress"><i style="width:${Math.round(((i + 1) / STEPS.length) * 100)}%"></i></div></div>
      ${pageHead(STEPS[i][1], WZ_SUB[r] || '', '', [['Request pass', 'type'], ['Work permit']])}
      ${errSummary(r)}
      ${body}
    </div>
  </div>
  <footer class="actionbar">
    ${btn('Back', { icon: 'arrowL', act: 'wzBack' })}
    <span class="save-state" id="save-state" role="status">${ic('check')}Draft saved</span>
    <span class="spacer"></span>
    ${btn('Save & exit', { v: 'ghost', act: 'saveExit', cls: 'hide-sm' })}
    ${isLast ? btn('Submit request', { v: 'primary', icon: 'send', act: 'submitRequest' }) : btn('Continue', { v: 'primary', iconR: 'arrowR', act: 'wzNext' })}
  </footer>`;
}
const WZ_SUB = {
  details: 'Where, when and what. The community uses this to plan access.',
  materials: 'List everything you will bring in. Security checks this list at the gate.',
  workvehicles: 'Choose the vehicles that need to enter the community.',
  personnel: 'Choose who will work on site. Their IDs must be valid for every work date.',
  documents: 'Upload the documents this permit type needs.',
  pdf: 'Read the community’s terms, tick every box, then sign once at the bottom.',
  review: 'Check everything before you send it. You cannot edit while it is under review.',
};
function feeBox(x, o = {}) {
  const t = typeOf(x.type);
  if (!t.paid) return `<div class="fee-box free"><div><b>No fee</b><p class="small muted">${esc(t.name)} is free.</p></div></div>`;
  const f = feeFor(x);
  let body;
  if (t.model === 'trip' && !f.lines.length) body = `<div class="fee-lines">${t.tiers.map((r, i) => `<div><span>${tierLabel(t, i)} · per trip</span><b>${aed(r.price)}</b></div>`).join('')}</div><p class="xs faint">Choose your vehicles on the Vehicles step to see the total.</p>`;
  else body = feeLines(f);
  return `<div class="fee-box"><div><b>${o.review ? 'Fee' : 'Fee estimate'}${f.total ? ': ' + aed(f.total) : ''}</b><p class="small muted">Payment is due after the community approves. You get your QR codes once payment is made.</p></div>${body}</div>`;
}
function pDetails() {
  const d = S.draft, E = k => errOf('details', k);
  const t = typeOf(d.type);
  return wizard('details', `
  ${card('Location', `<div class="grid-2">
    <div class="field"><span class="label">Community</span><div class="readonly-field">${logoTile(community().logo, community().name, 'xs')}<b>${esc(community().name)}</b></div><span class="hint">To request for another community, switch it from the top bar.</span></div>
    ${F({ id: 'f-property', label: 'Building', req: true, bind: 'd.property', options: PROPERTIES, ph: 'Choose a building', err: E('property') })}
    ${combo({ id: 'f-units', label: 'Units', req: true, bind: 'd.units', options: UNITS.map(u => ({ value: u, label: u })), ph: 'Search and select units', searchPh: 'Search units', full: true, err: E('units'), hint: 'Add more than one unit only if the same work happens in each.' })}
  </div>`)}
  ${card('Permit type', `<div class="choice-grid" role="radiogroup" aria-label="Permit type">${PERMIT_TYPES.map(x => `<label class="choice"><input type="radio" name="ptype" value="${x.id}" data-bind="d.type" data-rerender ${d.type === x.id ? 'checked' : ''}><span class="radio"></span><span class="grow"><b>${x.name}</b><small>${x.desc}</small><small class="faint">${plural(x.docs.length, 'required document')} · ${limitsShort(x)}</small><small class="fee-tag ${x.paid ? 'paid' : ''}">${feeShort(x)}${x.closure && inspOn() ? ' · Final inspection' : ''}</small></span></label>`).join('')}</div>
    ${feeBox(d)}
    ${alertBox('info', `${t.name} needs: ${t.docs.map(k => DOCS[k].name).join(', ')}`, t.optional.length ? `May also be requested: ${t.optional.map(k => DOCS[k].name).join(', ')}.` : '', btn('Checklist & templates', { sm: true, act: 'checklist' }))}`)}
  ${card('About the work', `<div class="grid-2">
    ${F({ id: 'f-title', label: 'Work title', req: true, bind: 'd.title', ph: 'For example, Painting work', err: E('title') })}
    ${F({ id: 'f-contact', label: 'Site contact', req: true, bind: 'd.contact', ph: 'Name of the person on site', err: E('contact'), attrs: 'list="people-list"' })}
    ${F({ id: 'f-description', label: 'Description', opt: true, bind: 'd.description', type: 'textarea', full: true, ph: 'Main tasks, noisy work, drilling, areas affected', hint: 'Mention any noisy work, drilling or water/power shutdowns.' })}
    ${F({ id: 'f-phone', label: 'Contact phone', req: true, bind: 'd.phone', type: 'tel', ph: '+971 50 000 0000', err: E('phone') })}
    ${t.amcAllowed ? `<div class="field"><span class="label">Annual maintenance contract?</span>${seg('amc', 'd.amc', [['no', 'No'], ['yes', 'Yes']], true)}<span class="hint">Choose Yes if this work is covered by an AMC.</span></div>` : ''}
  </div><datalist id="people-list">${S.people.map(p => `<option value="${esc(p.name)}">`).join('')}</datalist>`)}
  ${t.amcAllowed && d.amc === 'yes' ? card('Maintenance visits', `<div class="grid-2">
    ${F({ id: 'f-amcFreq', label: 'How often are visits needed?', req: true, bind: 'd.amcFreq', options: Object.entries(FREQ).map(([k, v]) => [k, v[0]]), ph: 'Choose how often', err: E('amcFreq') })}
    ${F({ id: 'f-amcVisits', label: 'Visits required each period', req: true, bind: 'd.amcVisits', type: 'number', attrs: 'min="1" step="1"', err: E('amcVisits'), hint: d.amcFreq ? `For example, 2 means 2 visits each ${FREQ[d.amcFreq][1]}.` : '' })}
  </div>`, { sub: 'Once approved, the work appears in the community’s maintenance contracts and under passes.' }) : ''}
  ${card('Dates & hours', `<div class="grid-2">
    ${F({ id: 'f-from', label: 'Start date', req: true, bind: 'd.from', type: 'date', err: E('from'), attrs: `min="${addDays(TODAY, 2)}"`, hint: `Earliest start: ${fmt(addDays(TODAY, 2))}` })}
    ${F({ id: 'f-to', label: 'End date', req: true, bind: 'd.to', type: 'date', err: E('to'), attrs: `min="${d.from || addDays(TODAY, 2)}"`, hint: t.maxDays ? `${t.name}: up to ${plural(t.maxDays, 'day')}` : 'No limit on the number of days' })}
    ${F({ id: 'f-start', label: 'Daily start time', bind: 'd.start', type: 'time' })}
    ${F({ id: 'f-end', label: 'Daily finish time', bind: 'd.end', type: 'time', err: E('end'), hint: 'Community working hours: 08:00–18:00, Saturday to Thursday.' })}
  </div>`, { sub: 'Times are in the community’s local time (GST, UTC+4).' })}`);
}
function pMaterials() {
  const d = S.draft;
  return wizard('materials', card('Materials & equipment', `
    ${sw('f-materials', 'd.noMaterials', 'No materials or equipment', 'Turn on if you are bringing nothing into the community.')}
    ${d.noMaterials ? '' : d.materials.length ? `<div class="table-wrap" style="border:1px solid var(--border);border-radius:8px"><table class="table responsive"><thead><tr><th>Item</th><th>Type</th><th>Quantity</th><th>Removed after work</th><th class="t-actions"><span class="sr">Actions</span></th></tr></thead><tbody>${d.materials.map(m => `<tr><td><div class="t-main"><b>${esc(m.name)}</b>${m.notes ? `<span>${esc(m.notes)}</span>` : ''}</div></td><td data-m="sub">${esc(m.kind)}</td><td data-m="side" class="num">${m.qty} ${esc(m.unit)}</td><td data-m="hide">${esc(m.removed)}</td><td class="t-actions">${btn('', { v: 'ghost', sm: true, icon: 'edit', act: 'editMaterial', id: m.id, title: 'Edit ' + m.name })}${btn('', { v: 'ghost', sm: true, icon: 'trash', act: 'removeMaterial', id: m.id, title: 'Remove ' + m.name })}</td></tr>`).join('')}</tbody></table></div>` : emptyState('box', 'No items yet', 'Add each material or piece of equipment separately.')}
    ${d.noMaterials ? '' : `<div class="row between"><span class="small muted">${plural(d.materials.length, 'item')} listed</span>${btn('Add item', { icon: 'plus', act: 'addMaterial', attrs: 'id="f-materials-add"' })}</div>`}
    ${errOf('materials', 'materials') ? `<span class="err">${ic('alert')}${errOf('materials', 'materials')}</span>` : ''}`));
}
function selectRows(kind) {
  const d = S.draft;
  if (kind === 'vehicles') {
    return S.vehicles.map(v => { const e = expiry(v.regExpiry); const blocked = e.tone === 'bad'; return `<label class="select-row ${blocked ? 'disabled' : ''}"><input type="checkbox" data-act-change="toggleSel" data-kind="vehicles" value="${v.id}" ${d.vehicles.includes(v.id) ? 'checked' : ''} ${blocked ? 'disabled' : ''}><span class="ic tone-neutral" style="width:34px;height:34px;border-radius:8px;display:grid;place-items:center">${ic('car')}</span><span class="grow"><b>${esc(v.plate)}</b><span>${esc(v.make)} · ${esc(v.type)} · ${esc(v.color)} · ${Number(v.tons) > 0 ? v.tons + ' t' : 'weight missing'}</span></span>${badge(e.label, e.tone)}${blocked ? btn('Renew', { v: 'link', act: 'editVehicle', id: v.id, cls: 'small' }) : ''}</label>`; }).join('');
  }
  const q = (ui.search.workers || '').toLowerCase();
  return S.people.filter(p => !q || (p.name + p.role + p.idNo).toLowerCase().includes(q)).map(p => { const e = expiry(p.idExpiry); const blocked = e.tone === 'bad'; return `<label class="select-row ${blocked ? 'disabled' : ''}"><input type="checkbox" data-act-change="toggleSel" data-kind="workers" value="${p.id}" ${d.workers.includes(p.id) ? 'checked' : ''} ${blocked ? 'disabled' : ''}><span class="avatar">${initials(p.name)}</span><span class="grow"><b>${esc(p.name)}</b><span>${esc(p.role)} · ${esc(p.idType)} ${esc(p.idNo)}</span></span>${badge(e.label, e.tone)}${blocked ? btn('Update ID', { v: 'link', act: 'editPerson', id: p.id, cls: 'small' }) : ''}</label>`; }).join('') || emptyState('search', 'No one matches', 'Try another name.');
}
function pVehiclesStep() {
  const d = S.draft, t = typeOf(d.type), trip = t.model === 'trip';
  if (trip && d.noVehicles) d.noVehicles = false;
  const sel = d.vehicles.map(vehicle).filter(Boolean);
  const tripRows = sel.map(v => {
    const price = trip ? tierPrice(t, v.tons) : 0, n = tripsOf(d, v.id);
    return `<div class="trip-row"><span class="grow"><b>${esc(v.plate)}</b><span class="xs faint">${Number(v.tons) > 0 ? v.tons + ' t' : 'Weight missing'}${trip && Number(v.tons) > 0 ? ' · ' + aed(price) + ' per trip' : ''}</span></span>
      <div class="trip-in">${F({ id: 'f-trips-' + v.id, label: 'Trips', bind: 'd.tripsBy.' + v.id, value: d.tripsBy && d.tripsBy[v.id] !== undefined ? d.tripsBy[v.id] : n, type: 'number', attrs: 'min="1" step="1" inputmode="numeric"' })}</div>
      ${trip ? `<b class="trip-fee" data-fee="${v.id}">${aed(n * price)}</b>` : ''}${btn('Edit weight', { v: 'ghost', sm: true, act: 'editVehicle', id: v.id, title: 'Edit ' + v.plate })}</div>`;
  }).join('');
  return wizard('workvehicles', expiryAlert(expiryWarnings(d, 'vehicles')) + card('Vehicles for this work', `
    ${trip ? '<p class="small muted">A delivery needs at least one vehicle. The fee is per trip, by vehicle weight.</p>' : sw('f-vehicles', 'd.noVehicles', 'No vehicles needed', 'Turn on if workers arrive on foot or by public transport.')}
    ${d.noVehicles ? '' : `<div class="stack-sm">${selectRows('vehicles')}</div>
    <div class="row between"><span class="small muted">${plural(sel.length, 'vehicle')} selected</span>${btn('Add a vehicle', { icon: 'plus', act: 'addVehicle' })}</div>`}
    ${errOf('workvehicles', 'vehicles') ? `<span class="err" id="f-vehicles-err">${ic('alert')}${errOf('workvehicles', 'vehicles')}</span>` : ''}`)
    + (!d.noVehicles && sel.length ? card('Trips per vehicle', `<div class="stack-sm">${tripRows}</div>${trip ? feeLines(feeFor(d)) : ''}${errOf('workvehicles', 'tons') ? `<span class="err">${ic('alert')}${errOf('workvehicles', 'tons')}</span>` : ''}`, { sub: trip ? 'How many times will each vehicle come in? Each trip is charged.' : 'How many times will each vehicle come in?' }) : ''));
}
function pPersonnel() {
  const d = S.draft;
  return wizard('personnel', expiryAlert(expiryWarnings(d, 'workers')) + card('Workers on site', `
    <div class="row between"><div class="search grow" style="max-width:360px">${ic('search')}<input class="input" id="f-workers" data-search="workers" placeholder="Search employees" value="${esc(ui.search.workers || '')}" aria-label="Search employees"></div>${btn('Add employee', { icon: 'plus', act: 'addPerson' })}</div>
    <div class="stack-sm" id="workers-list">${selectRows('workers')}</div>
    <div class="row between"><span class="small muted"><b>${d.workers.length}</b> selected${typeOf(d.type).maxEmployees ? ` · ${typeOf(d.type).name} allows up to ${typeOf(d.type).maxEmployees} workers` : ''}</span>${d.workers.length ? btn('Clear selection', { v: 'ghost', sm: true, act: 'clearWorkers' }) : ''}</div>
    ${errOf('personnel', 'workers') ? `<span class="err">${ic('alert')}${esc(errOf('personnel', 'workers'))}</span>` : ''}`));
}
const CHECK_STEPS = ['Uploading…', 'Checking the document…', 'Reading the expiry date…'];
function extractNote(x) {
  if (!x) return '';
  return x.expiry
    ? `<div class="extract ok" role="status">${ic('check')}<span>We read the expiry date <b>${fmt(x.expiry)}</b> from the document. Reading can make mistakes, so check it and change the date below if it’s wrong.</span></div>`
    : `<div class="extract warn" role="status">${ic('info')}<span>We couldn’t find an expiry date in this document. Enter it yourself${x.noExpOk ? ', or turn on “No expiry date” if it doesn’t expire' : ''}.</span></div>`;
}
// Hint under an expiry field that was filled in from the document. The field always stays editable.
function readHint(file, value) {
  const x = file && file.extracted;
  if (!x || !x.expiry) return 'Use the date printed on the document.';
  return value === x.expiry ? 'Filled in from the document. You can change it.' : 'You changed the date read from the document.';
}
function uploader(o) {
  const file = o.file;
  if (file && file.status === 'checking') {
    const st = file.step || 0;
    return `<div class="file-row checking" role="status" aria-live="polite"><span class="spin" aria-hidden="true"></span><span class="grow"><b>${esc(file.name)}</b><span>${CHECK_STEPS[st]}</span></span><span class="xs faint num">Step ${st + 1} of ${CHECK_STEPS.length}</span></div><div class="progress"><i style="width:${Math.round(((st + 1) / CHECK_STEPS.length) * 100)}%"></i></div>`;
  }
  return uploaderBase(o) + (file && file.extracted ? extractNote(file.extracted) : '');
}
function uploaderBase({ key, bind, label, accept = '.pdf,.jpg,.jpeg,.png', file }) {
  const id = 'up-' + key;
  return file && file.name
    ? `<div class="file-row"><span class="ic">${/\.(png|jpe?g)$/i.test(file.name) ? 'IMG' : 'PDF'}</span><span class="grow"><b>${esc(file.name)}</b><span>${file.source === 'company' ? 'From company documents' : `${sizeTxt(file.size) || 'Uploaded'} · Uploaded ${fmt(file.date || TODAY)}`}</span></span>${btn('', { v: 'ghost', sm: true, icon: 'eye', act: 'previewFile', id: file.name, title: 'Preview' })}<label class="btn btn-ghost btn-sm" for="${id}">Replace</label>${btn('', { v: 'danger-ghost', sm: true, icon: 'trash', act: 'removeFile', id: bind, title: 'Remove ' + file.name, attrs: `data-label="${esc(label)}"` })}<input class="file-input" type="file" id="${id}" accept="${accept}" data-file="${bind}"></div>`
    : `<label class="dropzone" for="${id}" data-drop="${bind}"><span class="ic">${ic('upload')}</span><b>Upload ${esc(label)}</b><span class="xs faint">Drag a file here or click to choose · PDF, JPG or PNG · Max 10 MB</span><input class="file-input" type="file" id="${id}" accept="${accept}" data-file="${bind}"></label>`;
}
function companyDocList() {
  return [{ id: 'licence', name: 'Trade licence', file: S.company.licence && S.company.licence.name, expiry: S.company.licenceExpiry }, ...S.companyDocs];
}
function companyDocChoice(k, doc) {
  const name = DOCS[k].name, match = companyDocList().find(c => c.name === name && c.file);
  if (!doc.file) return `<div class="or-row"><span class="faint small">or</span>${btn('Choose from company documents', { sm: true, icon: 'briefcase', act: 'pickCompanyDoc', id: k })}${match ? `<span class="xs faint">Your saved ${esc(name)} is there.</span>` : ''}</div>`;
  if (doc.file.source === 'company' || doc.file.status === 'checking') return '';
  return `<label class="check"><input type="checkbox" data-act-change="saveToCompany" data-key="${k}" ${doc.file.savedToCompany ? 'checked disabled' : ''}><span>${doc.file.savedToCompany ? 'Saved to company documents' : 'Save to company documents for future permits'}<small>${doc.file.savedToCompany ? 'You can choose it on your next permit.' : 'Next time, choose it instead of uploading again.'}</small></span></label>`;
}
function docCard(k, required) {
  const d = S.draft;
  d.docs[k] = d.docs[k] || { file: null, expiry: '', noExpiry: false };
  const doc = d.docs[k], meta = DOCS[k], err = errOf('documents', 'doc-' + k);
  return card(`${meta.name} ${required ? badge('Required', 'brand') : badge('Optional')}`, `
    <p class="small muted" style="margin-top:-4px">${meta.hint}</p>
    <div id="f-doc-${k}" tabindex="-1">${uploader({ key: k, bind: `d.docs.${k}.file`, label: meta.name, file: doc.file })}</div>
    ${companyDocChoice(k, doc)}
    <div class="grid-2" style="align-items:end">
      ${F({ id: `doc-${k}-exp`, label: 'Expiry date', bind: `d.docs.${k}.expiry`, type: 'date', rerender: true, disabled: doc.noExpiry, hint: doc.noExpiry ? 'Not needed. This document has no expiry date.' : readHint(doc.file, doc.expiry) })}
      ${meta.noExp ? `<div style="padding-bottom:22px">${sw(`doc-${k}-noexp`, `d.docs.${k}.noExpiry`, 'No expiry date', 'Only if the document does not expire.')}</div>` : '<p class="hint" style="padding-bottom:22px">This document must have an expiry date.</p>'}
    </div>
    ${err ? `<span class="err">${ic('alert')}${esc(err)}</span>` : ''}`, { action: meta.template ? btn('Template', { v: 'ghost', sm: true, icon: 'download', act: 'download', id: meta.name + ' template' }) : '' });
}
function pDocuments() {
  const t = typeOf(S.draft.type);
  const done = t.docs.filter(k => S.draft.docs[k] && S.draft.docs[k].file).length;
  return wizard('documents', `${expiryAlert(expiryWarnings(S.draft, 'documents'))}${alertBox(done === t.docs.length ? 'ok' : 'info', `${done} of ${t.docs.length} required documents uploaded`, `Documents for ${t.name} at ${esc(community().name)}. Only documents set up by the community are shown.`)}
    ${t.docs.map(k => docCard(k, true)).join('')}${t.optional.map(k => docCard(k, false)).join('')}`);
}
/* ================= Community PDF forms (terms & guidelines) ================= */
// Signature block position on the page, in % of page size.
const SIG_AREA = { bottom: { left: 9, top: 86, width: 82, height: 9 }, newpage: { left: 9, top: 13, width: 82, height: 12 } };
function formKey(f) { return `${f.id}@${f.published.version}`; }
function formsFor(d) { return S.forms.filter(f => f.community === d.community && f.published && f.published.appliesTo.includes(d.type)); }
const b64ToBytes = b64 => { const s = atob(b64); const u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; };
const bytesToB64 = u => { let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s); };
const formPdf = pdf => b64ToBytes(pdf === 'sample' ? window.BUZZIN_SAMPLE_TERMS : pdf);
const PAGES = {};
function pdfPages(key, pdf) {
  if (PAGES[key]) return PAGES[key];
  PAGES[key] = { loading: true };
  (async () => {
    try {
      if (!window.pdfjsLib) throw new Error('The PDF viewer did not load.');
      const doc = await window.pdfjsLib.getDocument({ data: formPdf(pdf) }).promise;
      const out = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const vp = page.getViewport({ scale: 1.5 });
        const c = document.createElement('canvas'); c.width = vp.width; c.height = vp.height;
        await page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
        const blob = await new Promise(r => c.toBlob(r, 'image/png'));
        out.push({ src: URL.createObjectURL(blob), w: vp.width, h: vp.height });
      }
      PAGES[key] = { pages: out };
    } catch (e) { PAGES[key] = { error: (e && e.message) || String(e) }; }
    render();
  })();
  return PAGES[key];
}
function docState(key, pdf) {
  const r = pdfPages(key, pdf);
  if (r.error) return alertBox('bad', 'This document could not be shown', esc(r.error) + ' Download the original instead.');
  return `<div class="pdf-loading">${ic('file')}<span>Loading document…</span></div>`;
}
function sigPreview(placement, signer) {
  const A = SIG_AREA[placement], g = signer || {};
  const style = `left:${A.left}%;top:${A.top}%;width:${A.width}%;height:${A.height}%`;
  if (!g.sig) return `<div class="pdf-sig" style="${style}"><span class="ph">Your name, position and signature are added here when you sign</span></div>`;
  return `<div class="pdf-sig signed" style="${style}"><div class="lines">${[['Company', S.company.name], ['Name', g.name], ['Position', g.position], ['Date', fmt(TODAY)]].map(([k, v]) => `<span><i>${k}</i><b>${esc(v || '—')}</b></span>`).join('')}</div><img src="${g.sig.data}" alt="Signature"></div>`;
}
function boxHtml(f, o, n) {
  const style = `left:${f.x}%;top:${f.y}%;width:${f.size}%`;
  const on = !!(o.ticks && o.ticks[f.id]);
  return `<button type="button" class="pdf-box ${on ? 'on' : ''} ${o.showErr && f.required && !on ? 'err' : ''}" role="checkbox" aria-checked="${on}" aria-label="${esc(f.label)}" title="${esc(f.label)}" data-act="tickBox" data-form="${o.formKey}" data-id="${f.id}" id="box-${o.formKey.replace(/\W/g, '')}-${f.id}" style="${style}">${ic('check')}</button>`;
}
function pdfDoc(pages, fields, o) {
  const n = pages.length + (o.placement === 'newpage' ? 1 : 0);
  const page = (pg, i) => `<div class="pdf-page" style="aspect-ratio:${pg.w}/${pg.h}"><img src="${pg.src}" alt="Page ${i + 1} of ${n}" draggable="false">${fields.filter(f => f.page === i + 1).map(f => boxHtml(f, o, fields.indexOf(f) + 1)).join('')}${o.placement === 'bottom' && i === pages.length - 1 ? sigPreview('bottom', o.signer) : ''}<span class="pdf-pno">${i + 1} / ${n}</span></div>`;
  const extra = o.placement === 'newpage' ? `<div class="pdf-page blank" style="aspect-ratio:${pages[0].w}/${pages[0].h}"><div class="pdf-newpage-head"><b>Contractor declaration</b><span>Signed for and on behalf of the contractor. Completed electronically through the Buzzin contractor portal.</span></div>${sigPreview('newpage', o.signer)}<span class="pdf-pno">${n} / ${n}</span></div>` : '';
  return `<div class="pdf-doc">${pages.map(page).join('')}${extra}</div>`;
}

/* Documents close to expiry warn but never block. Only expired documents block. */
function expiryWarnings(d, scope) {
  const out = [], end = d.to || TODAY;
  const check = (date, what, fix) => {
    if (!date || date < TODAY) return;
    const n = days(date);
    if (n <= 30 || date < end) out.push({ what, n, date, fix, beforeEnd: date < end });
  };
  if (!scope || scope === 'workers') d.workers.map(person).filter(Boolean).forEach(p => check(p.idExpiry, `${p.name}’s ${p.idType}`, `data-act="editPerson" data-id="${p.id}"`));
  if (!scope || scope === 'vehicles') if (!d.noVehicles) d.vehicles.map(vehicle).filter(Boolean).forEach(v => check(v.regExpiry, `${v.plate} registration`, `data-act="editVehicle" data-id="${v.id}"`));
  if (!scope || scope === 'documents') Object.keys(d.docs).forEach(k => { const x = d.docs[k]; if (x && x.file && !x.noExpiry) check(x.expiry, `The ${DOCS[k].name}`, `data-act="focus" data-id="f-doc-${k}"`); });
  if (!scope || scope === 'company') { check(S.company.licenceExpiry, 'Your trade licence', 'data-go="settings"'); S.companyDocs.forEach(c => { if (c.file && !c.noExpiry) check(c.expiry, `Your ${c.name}`, 'data-go="settings-documents"'); }); }
  return out;
}
function expiryList(list) {
  return `<ul class="warn-list">${list.map(w => `<li><b>${esc(w.what)}</b> expires in ${plural(w.n, 'day')} (${fmt(w.date)})${w.beforeEnd ? ', before the work ends' : ''}.</li>`).join('')}</ul>`;
}
function expiryAlert(list) {
  if (!list.length) return '';
  return `<div class="alert alert-warn" role="status">${ic('alert')}<div class="grow"><strong>${list.length === 1 ? 'A document is close to expiry' : `${list.length} documents are close to expiry`}</strong><p>You can still submit. The community may reject your permit if a document expires before or during the work. If you have an updated document, please upload it.</p><ul>${list.map(w => `<li>${esc(w.what)} expires in ${plural(w.n, 'day')} (${fmt(w.date)})${w.beforeEnd ? ', before the work ends' : ''}. <a ${w.fix} href="#" class="btn-link">Upload updated document</a></li>`).join('')}</ul></div></div>`;
}

function pPdf() {
  const d = S.draft;
  d.ticks = d.ticks || {};
  d.signer = d.signer || { name: S.profile.name, position: S.profile.title, sig: null, auth: false };
  const forms = formsFor(d);
  if (!forms.length) return wizard('pdf', card('', emptyState('check', 'Nothing to sign', `${esc(community().name)} has no terms to sign for ${esc(typeOf(d.type).name)}. Continue to review your request.`)));
  const E = k => errOf('pdf', k);
  const viewers = forms.map(f => {
    const P = f.published, key = formKey(f), ticks = d.ticks[key] || {};
    const req = P.fields.filter(x => x.required), done = req.filter(x => ticks[x.id]).length;
    const r = pdfPages(key, P.pdf);
    return `<section class="card" id="f-form-${f.id}" tabindex="-1">
      <div class="card-head"><div><h2>${esc(P.name)}</h2><p>Version ${P.version} from ${esc(community().name)} · Read each section and tick its box</p></div><div class="row">${badge(`${done} of ${req.length} ticked`, done === req.length ? 'ok' : 'warn')}${btn('Original', { v: 'ghost', sm: true, icon: 'download', act: 'downloadOriginal', id: f.id })}</div></div>
      ${E('form-' + f.id) ? `<div style="padding:12px 20px 0">${alertBox('bad', esc(E('form-' + f.id)), 'Boxes still to tick are outlined in red.')}</div>` : ''}
      ${r.pages ? pdfDoc(r.pages, P.fields, { ticks, formKey: key, showErr: !!ui.errs.pdf, placement: P.placement, signer: d.signer }) : `<div class="card-body">${docState(key, P.pdf)}</div>`}
    </section>`;
  }).join('');
  const g = d.signer;
  const signCard = card('Sign', `
    <div class="grid-2">
      ${F({ id: 'f-sg-name', label: 'Full name', req: true, bind: 'd.signer.name', err: E('sg-name'), rerender: true })}
      ${F({ id: 'f-sg-position', label: 'Position', req: true, bind: 'd.signer.position', ph: 'For example, Site supervisor', err: E('sg-position'), rerender: true })}
    </div>
    <div class="field" id="f-sg-sig" tabindex="-1"><span class="label">Signature<span class="req">*</span></span>
      ${g.sig ? `<div class="sig-pad-preview"><img src="${g.sig.data}" alt="Your signature"></div><div class="row">${btn('Change signature', { sm: true, icon: 'pen', act: 'openSign' })}${btn('Remove', { v: 'danger-ghost', sm: true, act: 'clearSign' })}<span class="xs faint">${g.sig.source === 'upload' ? 'Uploaded image' : 'Drawn'}</span></div>`
        : `<div class="row">${btn('Draw signature', { icon: 'pen', act: 'openSign', attrs: 'data-mode="draw"' })}${btn('Upload signature image', { icon: 'upload', act: 'openSign', attrs: 'data-mode="upload"' })}</div>`}
      ${E('sg-sig') ? `<span class="err">${ic('alert')}${E('sg-sig')}</span>` : '<span class="hint">Draw it, or upload a PNG or JPG of your signature.</span>'}
    </div>
    ${check('f-sg-auth', 'd.signer.auth', `I am authorised to sign for ${esc(S.company.name)}.`, 'Your name, position, signature and today’s date are added to the bottom of the document.', true)}
    ${E('sg-auth') ? `<span class="err">${ic('alert')}${E('sg-auth')}</span>` : ''}`,
    { sub: 'One signature covers every document on this page.', foot: forms.map(f => btn(forms.length > 1 ? `Download signed: ${f.published.name}` : 'Download signed PDF', { icon: 'download', act: 'downloadSigned', id: f.id })).join('') });
  return wizard('pdf', viewers + signCard);
}

/* Signature images */
const loadImg = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('This image could not be read. Use a PNG or JPG.')); i.src = src; });
function trimCanvas(c) {
  const x = c.getContext('2d'), { data } = x.getImageData(0, 0, c.width, c.height);
  let t = c.height, l = c.width, r = -1, b = -1;
  for (let y = 0; y < c.height; y++) for (let X = 0; X < c.width; X++) if (data[(y * c.width + X) * 4 + 3] > 10) { if (X < l) l = X; if (X > r) r = X; if (y < t) t = y; if (y > b) b = y; }
  if (r < 0) return c;
  const pad = 6; l = Math.max(0, l - pad); t = Math.max(0, t - pad); r = Math.min(c.width - 1, r + pad); b = Math.min(c.height - 1, b + pad);
  const o = document.createElement('canvas'); o.width = r - l + 1; o.height = b - t + 1;
  o.getContext('2d').drawImage(c, l, t, o.width, o.height, 0, 0, o.width, o.height);
  return o;
}
async function processSig(src, removeBg) {
  const img = await loadImg(src), scale = Math.min(1, 900 / img.width);
  const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(img.width * scale)); c.height = Math.max(1, Math.round(img.height * scale));
  const x = c.getContext('2d'); x.drawImage(img, 0, 0, c.width, c.height);
  if (removeBg) {
    const d = x.getImageData(0, 0, c.width, c.height), p = d.data;
    for (let i = 0; i < p.length; i += 4) { const m = Math.min(p[i], p[i + 1], p[i + 2]); if (m > 225) p[i + 3] = 0; else if (m > 180) p[i + 3] = Math.round(p[i + 3] * (225 - m) / 45); }
    x.putImageData(d, 0, 0);
  }
  return trimCanvas(c).toDataURL('image/png');
}

/* Signed copy: ticks drawn in each box, signature block stamped at the bottom (or on a new last page). */
async function signedPdf(f, d) {
  if (!window.PDFLib) throw new Error('The PDF tools did not load.');
  const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
  const P = f.published, doc = await PDFDocument.load(formPdf(P.pdf));
  const font = await doc.embedFont(StandardFonts.Helvetica), bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const pages = doc.getPages(), ticks = (d.ticks || {})[formKey(f)] || {}, ink = rgb(0.06, 0.2, 0.45), grey = rgb(0.4, 0.45, 0.52);
  P.fields.forEach(fd => {
    if (!ticks[fd.id]) return;
    const pg = pages[fd.page - 1]; if (!pg) return;
    const { width, height } = pg.getSize(), s = fd.size / 100 * width;
    pg.drawSvgPath(`M ${-s * 0.32} 0 L ${-s * 0.08} ${s * 0.24} L ${s * 0.34} ${-s * 0.3}`, { x: fd.x / 100 * width, y: height - fd.y / 100 * height, borderColor: ink, borderWidth: Math.max(1.5, s * 0.14) });
  });
  let page = pages[pages.length - 1];
  const { width, height } = page.getSize();
  if (P.placement === 'newpage') {
    page = doc.addPage([width, height]);
    page.drawText('Contractor declaration', { x: width * 0.09, y: height * 0.92, size: 14, font: bold, color: rgb(0.1, 0.13, 0.2) });
    page.drawText('Signed for and on behalf of the contractor. Completed electronically through the Buzzin contractor portal.', { x: width * 0.09, y: height * 0.9, size: 9, font, color: grey });
  }
  const A = SIG_AREA[P.placement], bx = A.left / 100 * width, bw = A.width / 100 * width, top = height - A.top / 100 * height, bh = A.height / 100 * height;
  const g = d.signer;
  [['Company', S.company.name], ['Name', g.name], ['Position', g.position], ['Date', fmt(TODAY)]].forEach(([k, v], i) => {
    const y = top - 12 - i * 15;
    page.drawText(k, { x: bx, y, size: 9, font, color: grey });
    page.drawText(String(v || ''), { x: bx + 58, y, size: 10.5, font: bold, color: rgb(0.08, 0.12, 0.2) });
  });
  const png = await doc.embedPng(b64ToBytes(g.sig.data.split(',')[1]));
  const maxW = bw * 0.36, maxH = bh - 20, sc = Math.min(maxW / png.width, maxH / png.height, 1);
  const iw = png.width * sc, ih = png.height * sc, sx = bx + bw - maxW + (maxW - iw) / 2, sy = top - 4 - ih;
  page.drawImage(png, { x: sx, y: sy, width: iw, height: ih });
  page.drawLine({ start: { x: bx + bw - maxW, y: sy - 3 }, end: { x: bx + bw, y: sy - 3 }, thickness: 0.8, color: rgb(0.6, 0.64, 0.7) });
  page.drawText('Signature', { x: bx + bw - maxW, y: sy - 12, size: 8, font, color: grey });
  page.drawText(`Signed electronically on ${fmt(TODAY)} via the Buzzin contractor portal · ${Object.values(ticks).filter(Boolean).length} of ${P.fields.length} boxes ticked · Version ${P.version} · Ref ${d.resubmit || d.id}`, { x: bx, y: top - bh - 6, size: 6.5, font, color: grey });
  return doc.save();
}
function saveBytes(bytes, name) {
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
  const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/* ================= Permit and invoice PDFs (built in the browser with pdf-lib) ================= */
// pdf-lib's Helvetica only encodes WinAnsi. Swap common symbols for plain text and replace anything else with "?".
const pdfClean = t => String(t ?? '')
  .replace(/[→⇒➜➔›▶]/g, '>').replace(/[←‹]/g, '<').replace(/[✓✔✅]/g, 'Yes').replace(/[✕✖✗✘❌]/g, 'No')
  .replace(/−/g, '-').replace(/[‐‑‒]/g, '-').replace(/[     ]/g, ' ').replace(/[​-‍﻿­]/g, '').replace(/\t/g, ' ').replace(/\r\n?/g, '\n')
  .replace(/[^\n\x20-\x7E\xA1-\xFF–—‘’“”•…€]/gu, '?');
async function pdfKit() {
  if (!window.PDFLib) throw new Error('The PDF tools did not load.');
  const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica), bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const W = 595.28, H = 841.89, M = 42, ink = rgb(0.08, 0.12, 0.2), grey = rgb(0.4, 0.45, 0.52), rule = rgb(0.84, 0.87, 0.91), soft = rgb(0.95, 0.96, 0.98);
  const K = { doc, font, bold, W, H, M, ink, grey, rule, soft, rgb, y: H - M, page: doc.addPage([W, H]) };
  K.wrap = (t, f, size, maxW) => {
    const out = [];
    pdfClean(t).split('\n').forEach(par => { let cur = ''; par.split(/\s+/).filter(Boolean).forEach(w => { const tr = cur ? cur + ' ' + w : w; if (f.widthOfTextAtSize(tr, size) <= maxW) cur = tr; else { if (cur) out.push(cur); cur = w; } }); out.push(cur); });
    return out.length ? out : [''];
  };
  K.need = h => { if (K.y - h < M) { K.page = doc.addPage([W, H]); K.y = H - M; } };
  K.text = (t, x, y, o = {}) => K.page.drawText(pdfClean(t).replace(/\n/g, ' '), { x, y, size: o.size || 10, font: o.bold ? bold : font, color: o.color || ink });
  K.para = (t, x, maxW, o = {}) => { const size = o.size || 10, lh = o.lh || size + 3.5; K.wrap(t, o.bold ? bold : font, size, maxW).forEach(l => { K.need(lh); K.text(l, x, K.y - size, o); K.y -= lh; }); };
  K.heading = t => { K.need(75); K.y -= 10; K.text(t.toUpperCase(), M, K.y - 9, { size: 8.5, bold: true, color: grey }); K.y -= 14; K.page.drawLine({ start: { x: M, y: K.y }, end: { x: W - M, y: K.y }, thickness: 0.7, color: rule }); K.y -= 8; };
  K.row = (label, value, w = 110) => { const lines = K.wrap(value || '—', font, 10, W - 2 * M - w); K.need(lines.length * 13 + 2); K.text(label, M, K.y - 10, { size: 9, color: grey }); lines.forEach((l, i) => K.text(l, M + w, K.y - 10 - i * 13)); K.y -= lines.length * 13 + 3; };
  K.footer = label => { const n = doc.getPageCount(); doc.getPages().forEach((pg, i) => { const t = pdfClean(`${label} · Page ${i + 1} of ${n}`); pg.drawText(t, { x: W - M - font.widthOfTextAtSize(t, 8), y: 22, size: 8, font, color: grey }); }); };
  K.hex = c => { let h = c.replace('#', ''); if (h.length === 3) h = h.split('').map(x => x + x).join(''); return rgb(parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255); };
  K.table = (cols, rows) => {
    // cols: [{ h, w, right }]. Rows are arrays of strings.
    const draw = (cells, head) => {
      const wrapped = cells.map((c, i) => K.wrap(c, head ? bold : font, 9, cols[i].w - 8)), n = Math.max(...wrapped.map(l => l.length)), h = n * 11.5 + 8;
      K.need(h);
      if (head) K.page.drawRectangle({ x: M, y: K.y - h, width: W - 2 * M, height: h, color: soft });
      let x = M;
      wrapped.forEach((ls, i) => { ls.forEach((l, j) => { const tw = (head ? bold : font).widthOfTextAtSize(l, 9); K.text(l, cols[i].right ? x + cols[i].w - 6 - tw : x + 4, K.y - 13 - j * 11.5, { size: 9, bold: head, color: head ? grey : ink }); }); x += cols[i].w; });
      K.y -= h; K.page.drawLine({ start: { x: M, y: K.y }, end: { x: W - M, y: K.y }, thickness: 0.5, color: rule });
    };
    draw(cols.map(c => c.h), true); rows.forEach(r => draw(r, false));
  };
  return K;
}
const stepNote = a => a.step + (a.outcome && a.outcome !== 'Approved' ? ` (${a.outcome})` : '');
function pdfApprovals(K, p) {
  const { W, M } = K, ap = p.approvals || [];
  K.heading('Approvals');
  if (ap.length) K.table([{ h: 'Step', w: 118 }, { h: 'Approved by', w: 92 }, { h: 'Date and time', w: 98 }, { h: 'Comment', w: W - 2 * M - 308 }], ap.map(a => [stepNote(a), a.by, fmtDT(a.at), a.note || '-']));
  else K.para('No approvals recorded yet.', M + 4, 400);
}
function pdfPeople(K, p, t) {
  const { W, M } = K;
  K.heading('Workers');
  const ws = (p.workers || []).map(person).filter(Boolean).map(w => [w.name, w.role || '-', `${w.idType}`, fmt(w.idExpiry), 'On permit']);
  (p.extraWorkers || []).forEach(x => { const w = person(x.id); if (w) ws.push([w.name, w.role || '-', w.idType, fmt(w.idExpiry), x.revoked ? `Extra worker, added ${fmt(x.added)}, revoked` : `Extra worker, added ${fmt(x.added)}`]); });
  if (ws.length) K.table([{ h: 'Name', w: 110 }, { h: 'Role', w: 90 }, { h: 'ID type', w: 80 }, { h: 'ID expiry', w: 80 }, { h: 'Note', w: W - 2 * M - 360 }], ws); else K.para('None', M + 4, 400);
  K.heading('Vehicles');
  const vs = (p.vehicles || []).map(vehicle).filter(Boolean);
  if (vs.length) K.table([{ h: 'Plate', w: 105 }, { h: 'Vehicle', w: 130 }, { h: 'Weight', w: 55 }, { h: 'Trips', w: 45 }, { h: 'Registration to', w: W - 2 * M - 335 }], vs.map(v => [v.plate, `${v.make || v.type}${v.color ? ', ' + v.color : ''}`, v.tons ? v.tons + ' t' : '-', String(tripsOf(p, v.id)), fmt(v.regExpiry)])); else K.para('None', M + 4, 400);
}
async function permitPdf(p) {
  const K = await pdfKit(), { W, H, M } = K;
  const t = typeOf(p.type), c = communityOf(p.community), inv = invoiceOf(p), fee = feeFor(p), co = S.company, b = S.billing;
  K.text(c.name, M, K.y - 12, { size: 13, bold: true });
  K.text(p.kind === 'visitor' ? 'VISITOR PASS' : 'WORK PERMIT', M, K.y - 28, { size: 8.5, bold: true, color: K.grey });
  K.y -= 38;
  const qw = 92, qx = W - M - qw, qy = H - M - qw - 6;
  K.page.drawRectangle({ x: qx - 4, y: qy - 4, width: qw + 8, height: qw + 8, color: K.rgb(1, 1, 1), borderColor: K.rule, borderWidth: 0.8 });
  const k = qw / 21;
  [...qrSvg(p.id).matchAll(/<rect x="(\d+)" y="(\d+)" width="(\d+)" height="(\d+)" fill="(#[0-9a-fA-F]{3,6})"\/>/g)].forEach(m => K.page.drawRectangle({ x: qx + m[1] * k, y: qy + (21 - Number(m[2]) - Number(m[4])) * k, width: m[3] * k, height: m[4] * k, color: K.hex(m[5]) }));
  K.text('Sample code', qx + 18, qy - 16, { size: 7.5, color: K.grey });
  K.para(p.title, M, W - 2 * M - qw - 20, { size: 19, bold: true, lh: 24 });
  K.text(p.id, M, K.y - 11, { size: 11, bold: true, color: K.grey }); K.y -= 20;
  K.text(`Status: ${(STATUS[p.status] || [p.status])[0]}`, M, K.y - 10, { size: 9.5, color: K.grey }); K.y -= 16;
  K.y = Math.min(K.y, qy - 22);
  K.heading('Work details');
  K.row('Permit type', t.name); K.row('Description', p.description || '-'); K.row('Location', `${p.property} · ${p.units.join(', ')}`); K.row('Work dates', range(p.from, p.to)); K.row('Daily hours', p.hours || '-');
  if (p.amc && p.amc.freq) K.row('Maintenance contract', `${FREQ[p.amc.freq][0]} · ${plural(Number(p.amc.visits), 'visit')} each ${FREQ[p.amc.freq][1]}`);
  K.row('Last updated', fmt(p.updated));
  K.heading('Company');
  K.row('Company', co.name); K.row('TRN', co.trn || '-'); K.row('Trade licence', co.licence ? `${co.licence.name}${co.licenceExpiry ? ' · valid to ' + fmt(co.licenceExpiry) : ''}` : '-');
  if (b && (b.legal || b.addr1)) K.row('Address', [b.legal, b.addr1, b.addr2, b.city, b.country].filter(Boolean).join(', '));
  K.heading('Documents attached');
  const dx = n => { const base = String(n).replace(/ \(signed\)$/, ''); if (p.docExpiry && base in p.docExpiry) return p.docExpiry[base] ? 'Valid to ' + fmt(p.docExpiry[base]) : 'No expiry'; if (/\(signed\)$/.test(n)) return 'Signed'; const d = Object.values(DOCS).find(x => x.name === base); return d && d.noExp ? 'No expiry' : 'Not recorded'; };
  if ((p.docs || []).length) K.table([{ h: 'Document', w: W - 2 * M - 150 }, { h: 'Expiry', w: 150 }], p.docs.map(n => [n, dx(n)])); else K.para('None', M + 4, 400);
  pdfPeople(K, p, t);
  K.heading('Materials and equipment');
  if (p.materialList && p.materialList.length) K.table([{ h: 'Item', w: W - 2 * M - 230 }, { h: 'Type', w: 100 }, { h: 'Quantity', w: 130 }], p.materialList.map(m => [m.name, m.kind || '-', `${m.qty} ${m.unit || ''}`])); else K.para(p.materials ? plural(p.materials, 'item') + ' listed in the request.' : 'None', M + 4, W - 2 * M - 4);
  K.heading('Terms signed');
  if (p.signed) { K.row('Document', `${p.signed.name} (v${p.signed.version})`); K.row('Signed by', `${p.signed.by}, ${p.signed.position}`); K.row('Signed on', fmtDT(p.signed.at)); } else K.para('No terms to sign for this request.', M + 4, 400);
  pdfApprovals(K, p);
  if (fee.total > 0 || inv) { K.heading('Payment'); (inv ? inv.lines : fee.lines).forEach(l => K.row(l.label, aed(l.amount), 230)); K.row('Total', aed(inv ? inv.amount : fee.total)); K.row('Status', inv ? `Paid ${String(inv.method).toLowerCase()} on ${fmtDT(inv.paidAt)}` : 'Not paid yet'); if (inv) K.row('Invoice', inv.id); }
  if (p.inspection) {
    const cl = closureOf(p);
    K.heading('Final inspection');
    K.row('Result', cl ? cl.outcome : ({ pending: 'Waiting for the community', waiting: 'Not complete yet. Contractor to fix and send again' }[p.inspection.status] || p.inspection.status));
    K.row('Contractor notes', p.inspection.notes || '-'); K.row('Marked completed', fmtDT(p.inspection.at));
    if (cl) { K.row('Closing remark', cl.remark || '-'); K.row('Closed by', `${cl.by}, ${fmtDT(cl.at)}`); }
    if ((p.inspection.rounds || []).length) K.table([{ h: 'Date', w: 88 }, { h: 'By', w: 78 }, { h: 'Decision', w: 90 }, { h: 'Comment', w: W - 2 * M - 256 }], p.inspection.rounds.map(r => [fmtDT(r.at), r.by, (DECISION[r.decision] || [r.decision])[0], (r.comment || '-') + ((r.files || []).length ? ' Files: ' + r.files.join(', ') : '')]));
  }
  K.need(30); K.y -= 14;
  K.para(`Issued through the Buzzin contractor portal on ${fmt(TODAY)}. Show the entry code at the gate. This permit is only valid on the dates and hours above.`, M, W - 2 * M, { size: 8, color: K.grey });
  K.footer(p.id + ' permit');
  return K.doc.save();
}
async function closurePdf(p) {
  const K = await pdfKit(), { W, M } = K, t = typeOf(p.type), c = communityOf(p.community), i = p.inspection, cl = closureOf(p);
  K.text(c.name, M, K.y - 12, { size: 13, bold: true }); K.text('CLOSURE REPORT', M, K.y - 28, { size: 8.5, bold: true, color: K.grey }); K.y -= 40;
  K.para(p.title, M, W - 2 * M, { size: 19, bold: true, lh: 24 });
  K.text(p.id, M, K.y - 11, { size: 11, bold: true, color: K.grey }); K.y -= 20;
  K.text(`Outcome: ${cl.outcome}`, M, K.y - 11, { size: 11, bold: true, color: cl.outcome === 'Completed' ? K.rgb(0.05, 0.5, 0.3) : K.rgb(0.75, 0.2, 0.2) }); K.y -= 18;
  K.heading('Permit');
  K.row('Reference', p.id); K.row('Title', p.title); K.row('Permit type', t.name); K.row('Community', c.name); K.row('Location', `${p.property} · ${p.units.join(', ')}`); K.row('Work dates', range(p.from, p.to)); K.row('Daily hours', p.hours || '-'); K.row('Company', `${S.company.name}${S.company.trn ? ' · TRN ' + S.company.trn : ''}`);
  pdfPeople(K, p, t);
  pdfApprovals(K, p);
  K.heading('Contractor completion notes');
  K.para(i.notes || 'No notes.', M + 4, W - 2 * M - 4); K.row('Marked completed', fmtDT(i.at)); K.row('Photos', (i.photos || []).join(', ') || 'None');
  K.heading('Inspection rounds');
  if ((i.rounds || []).length) K.table([{ h: 'Date', w: 88 }, { h: 'By', w: 78 }, { h: 'Decision', w: 90 }, { h: 'Comment', w: W - 2 * M - 256 - 90 }, { h: 'Files', w: 90 }], i.rounds.map(r => [fmtDT(r.at), r.by, (DECISION[r.decision] || [r.decision])[0], r.comment || '-', (r.files || []).join(', ') || '-'])); else K.para('No rounds recorded.', M + 4, 400);
  K.heading('Closing remark');
  K.para(cl.remark || '-', M + 4, W - 2 * M - 4); K.row('Closed by', cl.by || '-'); K.row('Closed on', fmtDT(cl.at)); K.row('Attached files', cl.files.join(', ') || 'None');
  K.heading('Outcome');
  K.para(cl.outcome, M + 4, W - 2 * M - 4, { size: 12, bold: true });
  K.need(30); K.y -= 14;
  K.para(`Created through the Buzzin contractor portal on ${fmt(TODAY)}.`, M, W - 2 * M, { size: 8, color: K.grey });
  K.footer(p.id + ' closure report');
  return K.doc.save();
}
function invoiceHtml(inv) {
  const p = S.permits.find(x => x.id === inv.permitId) || { title: inv.permitId, id: inv.permitId }, c = communityOf(inv.community || p.community), b = S.billing;
  return `<div class="invoice">
    <div class="inv-top"><div class="inv-from">${logoTile(c.logo, c.name, 'xs')}<div><b>${esc(c.name)}</b><span>${esc(c.area)}</span><span>${esc(c.email || '')}</span></div></div><div class="inv-no"><h3>Invoice</h3><span class="mono">${esc(inv.id)}</span><span>Date: ${fmtDT(inv.paidAt)}</span></div></div>
    <div class="inv-bill"><span class="eyebrow">Bill to</span><b>${esc(b.legal || S.company.name)}</b><span>${esc([b.addr1, b.addr2].filter(Boolean).join(', '))}</span><span>${esc([b.city, b.state, b.country].filter(Boolean).join(', '))}</span><span>TRN: ${esc(S.company.trn || '—')}</span></div>
    <div class="inv-for"><span class="eyebrow">For</span><span>${esc(p.title)} · <span class="mono">${esc(p.id)}</span></span></div>
    <table class="inv-table"><thead><tr><th>Description</th><th class="r">Amount</th></tr></thead><tbody>${inv.lines.map(l => `<tr><td>${esc(l.label)}</td><td class="r">${aed(l.amount)}</td></tr>`).join('')}</tbody><tfoot><tr><td>Total</td><td class="r">${aed(inv.amount)}</td></tr></tfoot></table>
    <div class="inv-foot"><span class="inv-status">${esc(inv.status)}</span><span>Paid ${esc(inv.method.toLowerCase())} on ${fmtDT(inv.paidAt)}</span></div></div>`;
}
async function invoicePdf(inv) {
  const K = await pdfKit(), { W, M } = K;
  const p = S.permits.find(x => x.id === inv.permitId) || { title: inv.permitId, id: inv.permitId }, c = communityOf(inv.community || p.community), b = S.billing;
  K.text(c.name, M, K.y - 14, { size: 15, bold: true }); K.text(c.area + (c.email ? ' · ' + c.email : ''), M, K.y - 30, { size: 9, color: K.grey });
  const right = (t, y, o) => { const f = o.bold ? K.bold : K.font, w = f.widthOfTextAtSize(pdfClean(t), o.size || 10); K.text(t, W - M - w, y, o); };
  right('INVOICE', K.y - 14, { size: 20, bold: true }); right(inv.id, K.y - 30, { size: 10, bold: true, color: K.grey }); right('Date: ' + fmtDT(inv.paidAt), K.y - 44, { size: 9, color: K.grey });
  K.y -= 66; K.page.drawLine({ start: { x: M, y: K.y }, end: { x: W - M, y: K.y }, thickness: 0.8, color: K.rule }); K.y -= 14;
  K.text('BILL TO', M, K.y - 8, { size: 8, bold: true, color: K.grey }); K.y -= 16;
  [b.legal || S.company.name, [b.addr1, b.addr2].filter(Boolean).join(', '), [b.city, b.state, b.country].filter(Boolean).join(', '), 'TRN: ' + (S.company.trn || '—')].forEach((l, i) => K.para(l, M, 300, { size: 10, bold: i === 0 }));
  K.y -= 6; K.text('FOR', M, K.y - 8, { size: 8, bold: true, color: K.grey }); K.y -= 16; K.para(`${p.title} (${p.id})`, M, W - 2 * M);
  K.y -= 14;
  K.table([{ h: 'Description', w: W - 2 * M - 120 }, { h: 'Amount', w: 120, right: true }], inv.lines.map(l => [l.label, aed(l.amount)]).concat([['Total', aed(inv.amount)]]));
  K.y -= 18; K.text('STATUS', M, K.y - 8, { size: 8, bold: true, color: K.grey }); K.text(inv.status.toUpperCase(), M + 50, K.y - 9, { size: 11, bold: true, color: K.rgb(0.05, 0.5, 0.3) });
  K.y -= 18; K.para(`Paid ${inv.method.toLowerCase()} on ${fmtDT(inv.paidAt)}.`, M, W - 2 * M, { size: 9, color: K.grey });
  K.y -= 20; K.para('Sample invoice from the Buzzin contractor portal design preview. Not a tax document.', M, W - 2 * M, { size: 8, color: K.grey });
  return K.doc.save();
}

function pReview() {
  const d = S.draft, t = typeOf(d.type);
  const sec = (title, step, rows) => card(title, `<dl class="dl">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v || '<span class="faint">Not provided</span>'}</dd>`).join('')}</dl>`, { action: btn('Edit', { v: 'ghost', sm: true, icon: 'edit', act: 'gotoStep', id: step }) });
  const docs = t.docs.concat(t.optional).filter(k => d.docs[k] && d.docs[k].file).map(k => `${DOCS[k].name} <span class="faint">· ${d.docs[k].noExpiry ? 'No expiry' : 'Valid to ' + fmt(d.docs[k].expiry)}</span>`).join('<br>');
  return wizard('review', `${expiryAlert(expiryWarnings(d))}${alertBox('info', 'Submitting does not approve your request', `${esc(community().name)} reviews every request. Work can start only after approval.`)}
    ${feeBox(d, { review: true })}
    ${sec('Work details', 'details', [['Community', esc(community().name)], ['Location', esc([d.property, d.units.join(', ')].filter(Boolean).join(' · '))], ['Permit type', esc(t.name)], ['Work', esc(d.title)], ['Description', esc(d.description)], ['Site contact', esc([d.contact, d.phone].filter(Boolean).join(' · '))], ['Dates', d.from ? range(d.from, d.to) + ` · ${d.start}–${d.end}` : ''], ['AMC', t.amcAllowed ? (d.amc === 'yes' && FREQ[d.amcFreq] ? `Yes · ${FREQ[d.amcFreq][0]} · ${plural(Number(d.amcVisits) || 0, 'visit')} each ${FREQ[d.amcFreq][1]}` : 'No') : '']])}
    ${sec('Materials', 'materials', [['Items', d.noMaterials ? 'None' : d.materials.map(m => `${esc(m.name)} × ${m.qty} ${esc(m.unit)}`).join('<br>')]])}
    ${sec('Vehicles', 'workvehicles', [['Vehicles', d.noVehicles ? 'None' : d.vehicles.map(vehicle).filter(Boolean).map(v => esc(`${v.plate} · ${v.make} · ${v.tons || '?'} t · ${plural(tripsOf(d, v.id), 'trip')}`)).join('<br>')]])}
    ${sec('Workers', 'personnel', [['On site', d.workers.map(person).filter(Boolean).map(p => esc(`${p.name} · ${p.role}`)).join('<br>')]])}
    ${sec('Documents', 'documents', [['Uploaded', docs]])}
    ${sec('Terms & signature', 'pdf', [['Terms', formsFor(d).length ? formsFor(d).map(f => `${esc(f.published.name)} · v${f.published.version} <span class="faint">· ${Object.values((d.ticks || {})[formKey(f)] || {}).filter(Boolean).length} of ${f.published.fields.length} ticked</span>`).join('<br>') : 'Nothing to sign'], ['Signed by', d.signer && d.signer.sig ? esc(`${d.signer.name} · ${d.signer.position}`) : '']])}
    <div class="card"><div class="card-body">${check('f-consent', 'd.consent', 'I confirm the information in this request is correct and complete.', 'False information can lead to the pass being cancelled.', true)}${errOf('review', 'consent') ? `<span class="err">${ic('alert')}${errOf('review', 'consent')}</span>` : ''}</div></div>`);
}
function pSubmitted(id) {
  const p = S.permits.find(x => x.id === id) || { id, title: 'Your request', kind: 'work' };
  return `<div style="max-width:640px;margin:24px auto 0;width:100%">${card('', `
    <div class="stack" style="justify-items:center;text-align:center">
      <span class="success-ic">${ic('check')}</span>
      <h1>Request submitted</h1>
      <p class="muted">${esc(community().name)} has received your ${p.kind === 'visitor' ? 'visitor pass' : 'work permit'} request for <b>${esc(p.title)}</b>.</p>
      <div class="ref-box"><span class="xs faint">Reference</span><b class="mono" style="font-size:15px">${esc(p.id)}</b>${btn('', { v: 'ghost', sm: true, icon: 'copy', act: 'copy', id: p.id, title: 'Copy reference' })}</div>
    </div>
    <div class="divider"></div>
    <div class="timeline">
      <div class="tl done"><span class="dot">${ic('check')}</span><div class="grow"><b>Submitted</b><span>${fmt(TODAY)}</span></div></div>
      <div class="tl now"><span class="dot"></span><div class="grow"><b>Community review</b><span>We'll email ${esc(S.profile.email)} when there's an update.</span></div></div>
      <div class="tl"><span class="dot"></span><div class="grow"><b>Permit & QR codes</b><span>Available here after approval.</span></div></div>
    </div>`, { foot: btn('Back to overview', { v: 'ghost', go: 'home' }) + btn('Request another', { go: 'type' }) + btn('View request', { v: 'primary', go: 'permit-' + p.id }) })}</div>`;
}

/* ================= Visitor pass & inspection ================= */
function pVisitor() {
  const E = k => ui.errs.visitor ? vValidate()[k] : '';
  return `${pageHead('Visitor pass', 'For a visit with no contractor work. Approved passes are sent to the visitor by SMS.', '', [['Request pass', 'type'], ['Visitor pass']])}
  ${ui.errs.visitor && Object.keys(vValidate()).length ? alertBox('bad', 'Check the highlighted fields', Object.values(vValidate()).join(' ')) : ''}
  ${card('Visitor', `<div class="grid-2">
    ${F({ id: 'v-name', label: 'Visitor name', req: true, bind: 'v.name', err: E('name'), attrs: 'list="people-list"' })}
    ${F({ id: 'v-company', label: 'Company', bind: 'v.company', opt: true })}
    ${F({ id: 'v-phone', label: 'Mobile number', req: true, bind: 'v.phone', type: 'tel', ph: '+971 50 000 0000', err: E('phone'), hint: 'The pass is sent to this number.' })}
    <div class="grid-2" style="gap:12px">${F({ id: 'v-idtype', label: 'ID type', bind: 'v.idType', options: ['Emirates ID', 'Passport', 'Driving licence'] })}${F({ id: 'v-idno', label: 'ID number', req: true, bind: 'v.idNo', err: E('idNo') })}</div>
  </div><datalist id="people-list">${S.people.map(p => `<option value="${esc(p.name)}">`).join('')}</datalist>`)}
  ${card('Visit', `<div class="grid-2">
    ${combo({ id: 'v-unit', label: 'Unit to visit', req: true, bind: 'v.unit', options: UNITS.map(u => ({ value: u, label: u })), ph: 'Search units', err: E('unit') })}
    ${F({ id: 'v-purpose', label: 'Reason for visit', req: true, bind: 'v.purpose', options: ['Site survey', 'Meeting', 'Delivery', 'Quotation', 'Other'] })}
    ${F({ id: 'v-date', label: 'Visit date', req: true, bind: 'v.date', type: 'date', err: E('date'), attrs: `min="${addDays(TODAY, 1)}"` })}
    <div class="grid-2" style="gap:12px">${F({ id: 'v-from', label: 'Arrive', bind: 'v.from', type: 'time' })}${F({ id: 'v-to', label: 'Leave', bind: 'v.to', type: 'time', err: E('to') })}</div>
    ${F({ id: 'v-plate', label: 'Vehicle plate', opt: true, bind: 'v.plate', ph: 'For example, Dubai N 12345' })}
    ${F({ id: 'v-notes', label: 'Notes for security', opt: true, bind: 'v.notes', type: 'textarea', rows: 2 })}
  </div>`, { foot: btn('Cancel', { v: 'ghost', go: 'type' }) + btn('Submit visitor pass', { v: 'primary', icon: 'send', act: 'submitVisitor' }) })}`;
}
function vValidate() {
  const v = S.visitor, e = {};
  if (!v.name.trim()) e.name = 'Enter the visitor’s name.';
  if (!/^\+?[\d\s-]{8,}$/.test(v.phone.trim())) e.phone = 'Enter a mobile number with country code.';
  if (!v.idNo.trim()) e.idNo = 'Enter the ID number.';
  if (!v.unit) e.unit = 'Choose the unit to visit.';
  if (!v.date) e.date = 'Choose the visit date.'; else if (v.date <= TODAY) e.date = 'Choose a date from tomorrow.';
  if (v.from && v.to && v.to <= v.from) e.to = 'Leave time must be after arrival.';
  return e;
}
function pCompletion(id) {
  const p = S.permits.find(x => x.id === id);
  if (!p) return pageHead('Pass not found', 'It may have been removed.', btn('Back to passes', { go: 'permits' }));
  if (!inspOn()) return `${pageHead('Mark as completed', `${esc(p.title)} · <span class="mono">${p.id}</span>`, '', [['Authorized passes', 'permits'], [p.id, 'permit-' + p.id], ['Mark as completed']])}${alertBox('info', 'Not available', `${esc(communityOf(p.community).name)} has turned off final inspections.`, btn('Back to pass', { sm: true, go: 'permit-' + p.id }))}`;
  if (!canComplete(p)) return `${pageHead('Mark as completed', `${esc(p.title)} · <span class="mono">${p.id}</span>`, '', [['Authorized passes', 'permits'], [p.id, 'permit-' + p.id], ['Mark as completed']])}${alertBox('info', 'This pass cannot be marked as completed', 'Only work that has started can be marked as completed, and only once.', btn('Back to pass', { sm: true, go: 'permit-' + p.id }))}`;
  if (!ui.inspect || ui.inspect.id !== p.id) ui.inspect = { id: p.id, notes: 'Work completed and the area has been cleaned.', c0: true, c1: false, c2: false, photos: [] };
  const I = ui.inspect;
  return `${pageHead('Mark as completed', `${esc(p.title)} · <span class="mono">${p.id}</span>`, '', [['Authorized passes', 'permits'], [p.id, 'permit-' + p.id], ['Mark as completed']])}
  ${alertBox('info', 'Tell the community the work is finished', 'The community checks the work and replies. They may ask you to fix something first. Your permit closes when they confirm.')}
  ${card('Completion details', `<div class="grid-2">
    ${F({ id: 'i-notes', label: 'Completion notes', type: 'textarea', value: I.notes, full: true, attrs: 'data-ins="notes"' })}
  </div>
  <div class="stack-sm"><span class="label">Before you mark it completed</span>${['All tools and materials removed', 'Common areas cleaned and debris removed', 'Snagging items fixed'].map((l, i) => `<label class="check"><input type="checkbox" data-ins="c${i}" ${I['c' + i] ? 'checked' : ''}>${l}</label>`).join('')}</div>
  <div class="stack-sm"><span class="label">Completion photos <span class="opt">(optional)</span></span>${I.photos.map((n, k) => `<div class="file-row"><span class="ic">IMG</span><span class="grow"><b>${esc(n)}</b><span>Ready to send</span></span>${btn('', { v: 'danger-ghost', sm: true, icon: 'trash', act: 'removeInspectPhoto', id: String(k), title: 'Remove ' + n })}</div>`).join('')}${I.photos.length < 5 ? `<label class="dropzone" for="i-photos"><span class="ic">${ic('image')}</span><b>Add photos</b><span class="xs faint">JPG or PNG · Up to 5 photos</span><input class="file-input" type="file" id="i-photos" accept=".jpg,.jpeg,.png" multiple data-ins-file></label>` : ''}</div>`,
  { foot: btn('Cancel', { v: 'ghost', go: 'permit-' + p.id }) + btn('Mark as completed', { v: 'primary', icon: 'clipboard', act: 'submitInspection', id: p.id }) })}`;
}

/* ================= Help ================= */
function pHelp() {
  const c = community();
  return `${pageHead('Help & contact', `Questions about a pass go to ${esc(c.name)}. Questions about the portal go to Buzzin support.`)}
  <div class="layout-main"><div class="stack">
    ${card('Message ' + esc(c.name), `<div class="grid-2">
      ${F({ id: 'h-ref', label: 'Pass', options: [['', 'General question'], ...passesHere().filter(p => !p.draft).map(p => [p.id, `${p.id} · ${p.title}`])], value: ui.helpRef || '', attrs: 'data-change="helpRef"' })}
      ${F({ id: 'h-topic', label: 'Topic', options: ['Status of my request', 'Changes requested', 'Access at the gate', 'Final inspection', 'Something else'], value: 'Status of my request' })}
      ${F({ id: 'h-msg', label: 'Message', type: 'textarea', full: true, rows: 5, value: '', ph: 'Write your question. Include dates and unit numbers if relevant.' })}
    </div>`, { foot: btn('Send message', { v: 'primary', icon: 'send', act: 'sendHelp' }) })}
    ${card('Common questions', ['How long does review take?|It depends on the community. Most communities review requests within 1–2 working days. Submit at least 2 days before work starts.', 'What does “Changes requested” mean?|The community needs something fixed before approving, usually a document. Open the pass, read the message and choose “Update and resubmit”.', 'A worker’s ID expired. What now?|Update the ID under Employees. Expired IDs block new passes, and approved passes may be stopped at the gate.', 'Can I extend approved work dates?|Duplicate the pass with new dates, or contact the community if the extension is short.'].map(x => { const [q, a] = x.split('|'); return `<details class="faq"><summary>${esc(q)}${ic('down')}</summary><p>${esc(a)}</p></details>`; }).join(''))}
  </div><div class="stack">
    ${card('Community contact', `<div class="list-row" style="padding:0"><span class="ic tone-warn">${ic('building')}</span><span class="grow"><b>${esc(c.name)}</b><span>${esc(c.area)}</span></span></div><div class="ref-box" style="justify-content:space-between"><span class="small mono">${esc(c.email || 'Not provided')}</span>${btn('', { v: 'ghost', sm: true, icon: 'copy', act: 'copy', id: c.email, title: 'Copy email' })}</div><p class="xs faint">Sample address. The live portal shows the address set by each community.</p>`)}
    ${card('Portal support', `<p class="small muted">Trouble signing in, uploading or using the portal?</p><div class="ref-box" style="justify-content:space-between"><span class="small mono">support@buzzin.example</span>${btn('', { v: 'ghost', sm: true, icon: 'copy', act: 'copy', id: 'support@buzzin.example', title: 'Copy email' })}</div>`)}
  </div></div>`;
}

/* ================= Employees & vehicles ================= */
function pPeople() {
  const q = (ui.search.people || '').toLowerCase(), f = ui.peopleFilter || 'all';
  const list = S.people.filter(p => !q || (p.name + p.role + p.idNo + p.phone).toLowerCase().includes(q)).filter(p => f === 'all' || expiry(p.idExpiry).tone === f);
  const cnt = t => S.people.filter(p => expiry(p.idExpiry).tone === t).length;
  return `${pageHead('Employees', 'Save workers once and add them to any pass. IDs must be valid for the work dates.', btn('Add employee', { v: 'primary', icon: 'plus', act: 'addPerson' }))}
  ${cnt('bad') ? alertBox('bad', `${plural(cnt('bad'), 'employee')} with an expired ID`, 'They cannot be added to new passes until the ID is updated.', btn('Show', { sm: true, act: 'peopleFilter', id: 'bad' })) : ''}
  <section class="card">
    <div class="toolbar"><div class="search">${ic('search')}<input class="input" id="people-search" data-search="people" placeholder="Search name, role, ID or phone" value="${esc(ui.search.people || '')}" aria-label="Search employees"></div>
      <div class="segmented" role="radiogroup" aria-label="ID status">${[['all', 'All'], ['ok', 'Valid'], ['warn', 'Expiring'], ['bad', 'Expired']].map(([k, l]) => `<label><input type="radio" name="pf" ${f === k ? 'checked' : ''} data-change="peopleFilter" value="${k}"><span>${l}</span></label>`).join('')}</div></div>
    ${list.length ? `<div class="table-wrap"><table class="table responsive"><thead><tr><th>Name</th><th>Phone</th><th>ID</th><th>ID status</th><th class="t-actions"><span class="sr">Actions</span></th></tr></thead><tbody>${list.map(p => { const e = expiry(p.idExpiry); return `<tr><td><div class="person"><span class="avatar">${initials(p.name)}</span><div class="t-main"><b>${esc(p.name)}</b><span>${esc(p.role)}</span></div></div></td><td data-m="hide" class="num">${esc(p.phone)}</td><td data-m="sub">${esc(p.idType)} · <span class="mono">${esc(p.idNo)}</span></td><td data-m="side">${badge(e.label, e.tone)}</td><td class="t-actions">${btn('Edit', { v: 'ghost', sm: true, act: 'editPerson', id: p.id })}${btn('', { v: 'ghost', sm: true, icon: 'trash', act: 'removePerson', id: p.id, title: 'Remove ' + p.name })}</td></tr>`; }).join('')}</tbody></table></div>` : emptyState('users', 'No employees found', 'Try another search or filter.')}
    <div class="pager"><span>${list.length} of ${S.people.length} employees</span></div>
  </section>`;
}
function pVehicles() {
  const q = (ui.search.vehicles || '').toLowerCase();
  const list = S.vehicles.filter(v => !q || (v.plate + v.make + v.type).toLowerCase().includes(q));
  return `${pageHead('Vehicles', 'Save vehicle details once and reuse them on any pass.', btn('Add vehicle', { v: 'primary', icon: 'plus', act: 'addVehicle' }))}
  <section class="card">
    <div class="toolbar"><div class="search">${ic('search')}<input class="input" id="vehicle-search" data-search="vehicles" placeholder="Search plate, make or type" value="${esc(ui.search.vehicles || '')}" aria-label="Search vehicles"></div></div>
    ${list.length ? `<div class="table-wrap"><table class="table responsive"><thead><tr><th>Plate</th><th>Vehicle and weight</th><th>Registration</th><th class="t-actions"><span class="sr">Actions</span></th></tr></thead><tbody>${list.map(v => { const e = expiry(v.regExpiry); return `<tr><td><div class="person"><span class="avatar navy" style="border-radius:8px">${ic('car')}</span><div class="t-main"><b>${esc(v.plate)}</b><span>${esc(v.type)}</span></div></div></td><td data-m="sub">${esc(v.make)} · ${esc(v.color)} · ${Number(v.tons) > 0 ? v.tons + ' t' : 'weight missing'}</td><td data-m="side">${badge(e.label, e.tone)}</td><td class="t-actions">${btn('Edit', { v: 'ghost', sm: true, act: 'editVehicle', id: v.id })}${btn('', { v: 'ghost', sm: true, icon: 'trash', act: 'removeVehicle', id: v.id, title: 'Remove ' + v.plate })}</td></tr>`; }).join('')}</tbody></table></div>` : emptyState('car', 'No vehicles found', 'Try another search.')}
    <div class="pager"><span>${list.length} of ${S.vehicles.length} vehicles</span></div>
  </section>`;
}

/* ================= Settings ================= */
const SET_TABS = [
  ['general', 'Company & billing', 'building', 'Account'], ['profile', 'My profile', 'user', 'Account'], ['security', 'Password & security', 'lock', 'Account'],
  ['documents', 'Company documents', 'file', 'Company'], ['communities', 'Communities', 'layers', 'Company'],
  ['notifications', 'Notifications', 'bell', 'Preferences'],
];
function initForm(tab) {
  if (tab === 'general') return { company: clone(S.company), billing: clone(S.billing) };
  if (tab === 'profile') return clone(S.profile);
  if (tab === 'notifications') return clone(S.notifPrefs);
  return {};
}
function pSettings(r) {
  const tab = r.split('-')[1] || 'general';
  if (!SET_TABS.some(t => t[0] === tab)) return pSettings('settings-general');
  if (ui.formTab !== tab || !ui.form) { ui.form = initForm(tab); ui.formTab = tab; ui.dirty = false; ui.formErr = {}; }
  const expDocs = S.companyDocs.filter(c => ['warn', 'bad'].includes(expiry(c.expiry, c.noExpiry).tone)).length + (['warn', 'bad'].includes(expiry(S.company.licenceExpiry).tone) ? 1 : 0);
  let group = '';
  const nav = SET_TABS.map(([k, l, i, g]) => { const head = g !== group ? `<div class="side-label">${g}</div>` : ''; group = g; return head + `<button class="set-link ${tab === k ? 'active' : ''}" data-go="settings-${k}" ${tab === k ? 'aria-current="page"' : ''}>${ic(i)}${l}${k === 'documents' && expDocs ? badge(String(expDocs), 'warn') : ''}</button>`; }).join('');
  const body = { general: setGeneral, profile: setProfile, security: setSecurity, documents: setDocuments, communities: setCommunities, notifications: setNotifications }[tab]();
  const savable = ['general', 'profile', 'notifications'].includes(tab);
  return `${pageHead('Settings', 'Manage your company, account and how Buzzin contacts you.')}
  <div class="settings"><nav class="set-nav" aria-label="Settings">${nav}</nav><div class="stack">${body}</div></div>
  ${savable ? `<div class="savebar" id="savebar" role="region" aria-label="Unsaved changes" ${ui.dirty ? '' : 'hidden'}>${ic('info')}<span class="small">You have unsaved changes</span>${btn('Discard', { v: 'ghost', sm: true, act: 'discardForm' })}${btn('Save changes', { v: 'primary', sm: true, act: 'saveForm' })}</div>` : ''}`;
}
const fe = k => ui.formErr[k];
function setGeneral() {
  const c = ui.form.company, b = ui.form.billing;
  const states = Object.keys(GEO[b.country] || {}), cities = (GEO[b.country] || {})[b.state] || [];
  const le = expiry(c.licenceExpiry);
  return `<section class="card" data-dirty>
    <div class="card-head"><div><h2>Company details</h2><p>Shown to communities on every pass you submit.</p></div></div>
    <div class="form-sec"><div><h3>Company</h3><p>Your trading name and tax registration.</p></div><div class="grid-2">
      ${F({ id: 'c-name', label: 'Company name', req: true, bind: 'f.company.name', err: fe('name') })}
      ${F({ id: 'c-trn', label: 'Tax Registration Number (TRN)', bind: 'f.company.trn', hint: '8–15 digits (varies by country)', err: fe('trn'), attrs: 'inputmode="numeric"' })}
    </div></div>
    <div class="form-sec"><div><h3>Trade licence</h3><p>Communities check this before approving work. ${le.tone !== 'ok' ? badge(le.label, le.tone) : ''}</p></div><div class="grid-2">
      <div class="field full" id="c-licence"><span class="label">Trade licence<span class="req">*</span></span>${uploader({ key: 'licence', bind: 'f.company.licence', label: 'trade licence', file: c.licence })}${fe('licence') ? `<span class="err">${ic('alert')}${fe('licence')}</span>` : ''}</div>
      ${F({ id: 'c-licexp', label: 'Trade licence expiry date', req: true, bind: 'f.company.licenceExpiry', type: 'date', err: fe('licenceExpiry'), hint: c.licence && c.licence.extracted && c.licence.extracted.expiry ? readHint(c.licence, c.licenceExpiry) : 'We remind you 30 days before it expires.', rerender: true })}
    </div></div>
    <div class="form-sec"><div><h3>Logo</h3><p>Appears on your passes and permits. PNG, JPG, SVG or WebP. Transparent PNGs work best, in any shape and colour.</p></div>
      <div class="stack-sm" style="gap:12px"><div class="logo-up">${logoTile(c.logo, c.name, 'lg')}<div class="row"><label class="btn btn-secondary btn-sm" for="logo-up">${ic('upload')}${c.logo ? 'Replace logo' : 'Upload logo'}</label><input class="file-input" id="logo-up" type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp,.png,.jpg,.jpeg,.svg,.webp" data-file="f.company.logo">${c.logo ? btn('Remove', { v: 'danger-ghost', sm: true, act: 'removeLogo' }) : ''}</div></div>
      ${c.logo ? `<div class="field"><span class="label">Background behind the logo</span><div class="segmented" role="radiogroup" aria-label="Logo background">${[['auto', `Automatic (${c.logo.tone === 'light' ? 'dark' : 'light'})`], ['light', 'Light'], ['dark', 'Dark']].map(([v, l]) => `<label><input type="radio" name="logo-bg" value="${v}" data-bind="f.company.logo.bg" data-rerender ${(c.logo.bg || 'auto') === v ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div><span class="hint">We pick dark for white logos and light for dark logos. Change it if your logo is hard to see.</span></div>` : ''}</div>
    </div>
  </section>
  <section class="card" data-dirty>
    <div class="card-head"><div><h2>Billing information</h2><p>Used on invoices and receipts.</p></div></div>
    <div class="form-sec"><div><h3>Legal entity</h3><p>As registered on your trade licence.</p></div><div class="grid-2">
      ${F({ id: 'b-legal', label: 'Legal name', req: true, bind: 'f.billing.legal', full: true, err: fe('legal') })}
    </div></div>
    <div class="form-sec"><div><h3>Billing address</h3></div><div class="grid-2">
      ${F({ id: 'b-addr1', label: 'Address line 1', req: true, bind: 'f.billing.addr1', err: fe('addr1') })}
      ${F({ id: 'b-addr2', label: 'Address line 2', opt: true, bind: 'f.billing.addr2' })}
      ${F({ id: 'b-country', label: 'Country', req: true, bind: 'f.billing.country', options: Object.keys(GEO), rerender: true, attrs: 'data-reset="state,city"' })}
      ${F({ id: 'b-state', label: 'State / Emirate', req: true, bind: 'f.billing.state', options: states, ph: 'Choose', rerender: true, err: fe('state'), attrs: 'data-reset="city"' })}
      ${F({ id: 'b-city', label: 'City', req: true, bind: 'f.billing.city', options: cities, ph: b.state ? 'Choose' : 'Choose a state first', disabled: !b.state, err: fe('city') })}
      ${F({ id: 'b-postal', label: 'Postal code', req: true, bind: 'f.billing.postal', err: fe('postal'), hint: 'Use 00000 if you have no postal code.' })}
    </div></div>
  </section>`;
}
function setProfile() {
  return `<section class="card" data-dirty>
    <div class="card-head"><div><h2>Update your profile</h2><p>Your name and contact details as the account holder.</p></div></div>
    <div class="form-sec"><div><h3>Photo</h3><p>Shown to communities with your requests.</p></div><div class="logo-up"><span class="avatar lg">${initials(ui.form.name)}</span><div class="row">${btn('Upload photo', { sm: true, icon: 'upload', act: 'demo', id: 'Photo upload' })}${btn('Remove', { v: 'ghost', sm: true, act: 'demo', id: 'Photo removed' })}</div></div></div>
    <div class="form-sec"><div><h3>Personal details</h3></div><div class="grid-2">
      ${F({ id: 'pr-name', label: 'Name', req: true, bind: 'f.name', err: fe('name') })}
      ${F({ id: 'pr-title', label: 'Job title', opt: true, bind: 'f.title' })}
      ${F({ id: 'pr-email', label: 'Email address', req: true, bind: 'f.email', type: 'email', err: fe('email'), hint: 'Sign-in and pass updates go to this address. Changing it needs email confirmation.' })}
      ${F({ id: 'pr-phone', label: 'Phone number', bind: 'f.phone', type: 'tel', err: fe('phone'), hint: 'For SMS alerts and two-step verification.' })}
    </div></div>
    <div class="form-sec"><div><h3>Regional settings</h3><p>How dates and times appear to you.</p></div><div class="grid-2">
      ${F({ id: 'pr-lang', label: 'Language', bind: 'f.lang', options: ['English', 'العربية (Arabic)'] })}
      ${F({ id: 'pr-tz', label: 'Time zone', bind: 'f.tz', options: ['Asia/Dubai (GST, UTC+4)', 'Asia/Riyadh (AST, UTC+3)', 'Asia/Muscat (GST, UTC+4)', 'Asia/Qatar (AST, UTC+3)'] })}
      ${F({ id: 'pr-date', label: 'Date format', bind: 'f.datefmt', options: ['DD MMM YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'] })}
    </div></div>
  </section>`;
}
function pwScore(p) { return [p.length >= 8, /[A-Z]/.test(p) && /[a-z]/.test(p), /\d/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length; }
function setSecurity() {
  const P = ui.pw, s = pwScore(P.next);
  const rule = (ok, l) => `<li class="${ok ? 'ok' : ''}">${ic(ok ? 'check' : 'info')}${l}</li>`;
  const type = P.show ? 'text' : 'password';
  return `${card('Change password', `<div class="grid-2">
      ${F({ id: 'pw-current', label: 'Current password', req: true, bind: 'p.current', type, err: fe('current'), attrs: 'autocomplete="current-password"', full: true })}
      <div class="field">${F({ id: 'pw-next', label: 'New password', req: true, bind: 'p.next', type, err: fe('next'), ph: 'Start typing a new password', attrs: 'autocomplete="new-password" data-pwmeter' })}<div class="pw-meter" id="pw-meter" data-s="${P.next ? s : 0}"><i></i><i></i><i></i><i></i></div>
        <ul class="rules" id="pw-rules">${rule(P.next.length >= 8, 'At least 8 characters')}${rule(/[A-Z]/.test(P.next) && /[a-z]/.test(P.next), 'Upper and lower case letters')}${rule(/\d/.test(P.next), 'At least one number')}${rule(/[^A-Za-z0-9]/.test(P.next), 'At least one symbol')}</ul></div>
      ${F({ id: 'pw-confirm', label: 'Confirm password', req: true, bind: 'p.confirm', type, err: fe('confirm'), ph: 'Confirm password', attrs: 'autocomplete="new-password"' })}
    </div><label class="check"><input type="checkbox" data-change="showPw" ${P.show ? 'checked' : ''}>Show passwords</label>`,
    { sub: 'Use a password you don’t use anywhere else.', foot: btn('Change password', { v: 'primary', act: 'changePassword' }) })}
  ${card('Two-step verification', `${sw('twofa', '', 'Require a code when signing in', S.twofa ? `On · Codes are sent by SMS to ${esc(S.profile.phone)}` : 'Off · Add a one-time SMS code to protect your account', false, 'twofa')}`.replace('type="checkbox" id="twofa"', `type="checkbox" id="twofa" ${S.twofa ? 'checked' : ''}`), { sub: 'Recommended for owners and admins.' })}
  ${card('Deactivate account', `<p class="small muted">Deactivating removes your company’s access to all communities. Approved passes are cancelled. Records are kept for 90 days as required by communities, then deleted.</p>`, { cls: 'danger-zone', foot: btn('Deactivate account', { v: 'danger', act: 'deactivate' }) })}`;
}
function setDocuments() {
  const rows = [{ id: 'licence', name: 'Trade licence', file: S.company.licence && S.company.licence.name, expiry: S.company.licenceExpiry, required: true, fixed: true }, ...S.companyDocs];
  return card('Company documents', `<div class="table-wrap"><table class="table responsive"><thead><tr><th>Document</th><th>File</th><th>Status</th><th class="t-actions"><span class="sr">Actions</span></th></tr></thead><tbody>${rows.map(d => { const e = d.file ? expiry(d.expiry, d.noExpiry) : { tone: 'bad', label: 'Missing' }; return `<tr><td><div class="t-main"><b>${esc(d.name)} ${d.required ? '<span class="xs faint">· Required</span>' : ''}</b><span>${d.noExpiry ? 'No expiry date' : d.expiry ? 'Expires ' + fmt(d.expiry) : ''}</span></div></td><td data-m="sub">${d.file ? `<span class="mono">${esc(d.file)}</span>` : '<span class="faint">Not uploaded</span>'}</td><td data-m="side">${badge(e.label, e.tone)}</td><td class="t-actions">${d.fixed ? btn('Edit', { v: 'ghost', sm: true, go: 'settings-general' }) : `${btn(d.file ? 'Replace' : 'Upload', { v: 'ghost', sm: true, act: 'editCompanyDoc', id: d.id })}${btn('', { v: 'ghost', sm: true, icon: 'trash', act: 'removeCompanyDoc', id: d.id, title: 'Remove ' + d.name })}`}</td></tr>`; }).join('')}</tbody></table></div>`,
    { raw: true, sub: 'Upload once and reuse: choose these on any permit instead of uploading again. Communities can see them, and we remind you before they expire.', action: btn('Add document', { v: 'primary', sm: true, icon: 'plus', act: 'addCompanyDoc' }) });
}
const ACCESS = {
  active: ['Active', 'ok'], pending: ['Waiting for approval', 'info'],
  revoked: ['Access removed by the community', 'bad'], left: ['You left', 'neutral'],
};
function accessLine(c) {
  if (c.status === 'active') return 'Access since ' + fmt(c.since);
  if (c.status === 'pending') return 'Request sent · Waiting for the community to approve';
  if (c.status === 'revoked') return `${esc(c.name)} removed your company’s access on ${fmt(c.changedOn)}`;
  return `You left on ${fmt(c.changedOn)}`;
}
function accessActions(c, where) {
  if (c.status === 'active') return where === 'hub' ? btn('Open', { v: 'primary', sm: true, act: 'openCommunity', id: c.id, iconR: 'arrowR' }) : (c.id !== S.community ? btn('Switch', { v: 'ghost', sm: true, act: 'switchCommunity', id: c.id }) : '') + btn('Leave', { v: 'danger-ghost', sm: true, act: 'leaveCommunity', id: c.id });
  if (c.status === 'pending') return btn('Withdraw request', { v: 'ghost', sm: true, act: 'withdrawAccess', id: c.id });
  return btn('Request access again', { sm: true, act: 'requestAgain', id: c.id });
}
/* Main dashboard: the contractor picks a community here before entering the portal. */
function pHub() {
  const active = S.communities.filter(c => c.status === 'active'), other = S.communities.filter(c => c.status !== 'active');
  const tile = c => `<div class="hub-card ${c.status !== 'active' ? 'off' : ''}">${logoTile(c.logo, c.name, 'brand')}<div class="stack-sm" style="gap:4px"><b>${esc(c.name)}</b><span class="small muted">${esc(c.area)}</span>${badge(...ACCESS[c.status])}<span class="xs faint">${accessLine(c)}</span></div><div class="row">${accessActions(c, 'hub')}</div></div>`;
  return `<div class="hub-head"><div><h1>Your communities</h1><p class="muted">Choose a community to request and manage work permits and visitor passes. Each community decides who has access.</p></div>${btn('Request access to a community', { icon: 'plus', act: 'requestAccess' })}</div>
  ${active.length ? `<div class="hub-grid">${active.map(tile).join('')}</div>` : `<section class="card"><div class="empty" style="padding:48px 20px"><span class="ic">${ic('building')}</span><h2>You don’t have access to any community</h2><p class="small" style="max-width:52ch">You can’t request work permits until a community gives your company access. Request access, or ask the community’s management office to invite you.${other.some(c => c.status === 'revoked') ? ' Communities that removed your access are listed below.' : ''}</p>${btn('Request access to a community', { v: 'primary', icon: 'plus', act: 'requestAccess' })}</div></section>`}
  ${other.length ? `<h2 style="margin-top:8px">Other communities</h2><div class="hub-grid">${other.map(tile).join('')}</div>` : ''}`;
}
function pNoAccess() {
  const c = community(), [label, tone] = ACCESS[c.status];
  const why = c.status === 'revoked' ? `${esc(c.name)} removed your company’s access on ${fmt(c.changedOn)}. You can’t request new passes here, and approved passes no longer work at the gate.`
    : c.status === 'left' ? `Your company left ${esc(c.name)} on ${fmt(c.changedOn)}. You can’t request new passes here.`
    : `${esc(c.name)} hasn’t approved your access yet. You can request passes once they do.`;
  return `<div style="max-width:620px;margin:32px auto 0;width:100%">${card('', `<div class="stack" style="justify-items:center;text-align:center">${logoTile(c.logo, c.name, 'lg')}${badge(label, tone)}<h1>You don’t have access to ${esc(c.name)}</h1><p class="muted">${why}</p>${c.email ? `<p class="small muted">Questions? Contact the community at <span class="mono">${esc(c.email)}</span>.</p>` : ''}</div>`,
    { foot: (c.status === 'pending' ? '' : btn('Request access again', { act: 'requestAgain', id: c.id })) + btn('Back to main dashboard', { v: 'primary', icon: 'arrowL', act: 'mainDashboard' }) })}</div>`;
}
function setCommunities() {
  return card('Communities', S.communities.map(c => `<div class="list-row">${logoTile(c.logo, c.name, 'xs')}<span class="grow"><b>${esc(c.name)} ${c.id === S.community && c.status === 'active' ? badge('Current', 'brand') : ''}</b><span>${esc(c.area)} · ${accessLine(c)}</span></span>${c.status !== 'active' ? badge(...ACCESS[c.status]) : ''}${accessActions(c, 'settings')}</div>`).join(''),
    { tight: true, sub: 'Communities where your company can request passes. Switch between them from the top bar.', action: btn('Request access', { v: 'primary', sm: true, icon: 'plus', act: 'requestAccess' }) });
}
function setNotifications() {
  const rows = [['submitted', 'Request submitted', 'Confirmation when a pass is sent'], ['changes', 'Changes requested', 'The community needs something from you'], ['approved', 'Pass approved or rejected', 'Decision on your request'], ['expiring', 'Documents expiring', 'IDs, registrations and company documents, 30 days ahead'], ['inspection', 'Final inspection', 'Inspection booked or completed'], ['news', 'Product news', 'New features and tips']];
  return `<section class="card" data-dirty>${`<div class="card-head"><div><h2>Notifications</h2><p>Choose how we tell you about your passes.</p></div></div>`}<div class="card-body"><div class="table-wrap"><table class="matrix"><thead><tr><th>Event</th><th>Email</th><th>SMS</th><th>In portal</th></tr></thead><tbody>${rows.map(([k, l, s]) => `<tr><td><b>${l}</b><span>${s}</span></td>${['email', 'sms', 'app'].map(ch => `<td><input type="checkbox" aria-label="${l} by ${ch}" data-bind="f.${k}.${ch}" ${ui.form[k][ch] ? 'checked' : ''}></td>`).join('')}</tr>`).join('')}</tbody></table></div>
    <p class="xs faint">Emails go to ${esc(S.profile.email)}. SMS goes to ${esc(S.profile.phone)}.</p></div></section>`;
}

/* ================= Modals ================= */
function modalFrame({ title, sub, body, foot, size = '', icon, tone, drawer }) {
  if (drawer) return `<div class="overlay drawer-overlay" data-overlay><div class="drawer" role="dialog" aria-modal="true" aria-labelledby="m-title"><div class="modal-head"><div class="grow"><h2 id="m-title">${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>${btn('', { v: 'ghost', sm: true, icon: 'x', act: 'closeModal', title: 'Close' })}</div><div class="modal-body">${body}</div><div class="modal-foot">${foot}</div></div></div>`;
  return `<div class="overlay" data-overlay><div class="modal ${size}" role="dialog" aria-modal="true" aria-labelledby="m-title">
    <div class="modal-head">${icon ? `<span class="modal-ic tone-${tone || 'info'}">${ic(icon)}</span>` : ''}<div class="grow"><h2 id="m-title">${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>${icon ? '' : btn('', { v: 'ghost', sm: true, icon: 'x', act: 'closeModal', title: 'Close' })}</div>
    ${body ? `<div class="modal-body">${body}</div>` : '<div style="height:12px"></div>'}
    <div class="modal-foot">${foot}</div></div></div>`;
}
function renderModal() {
  const m = ui.modal;
  if (!m) return '';
  if (m.type === 'confirm') {
    const tone = m.tone === 'danger' ? 'bad' : m.tone === 'warn' ? 'warn' : 'info';
    const body = (m.extra ? m.extra() : '') + (m.requireText ? F({ id: 'm-typed', label: `Type ${m.requireText} to confirm`, bind: 'm.typed', attrs: 'autocomplete="off" data-require' }) : '');
    return modalFrame({ title: m.title, sub: m.message, icon: m.icon || (m.tone === 'danger' ? 'trash' : m.tone === 'warn' ? 'alert' : 'info'), tone, size: 'sm', body,
      foot: btn(m.cancelText || 'Cancel', { act: 'closeModal' }) + (m.alt ? btn(m.alt.label, { act: 'confirmAlt', v: m.alt.v || 'secondary' }) : '') + btn(m.confirmText || 'Confirm', { v: m.tone === 'danger' ? 'danger' : 'primary', act: 'confirmOk', disabled: m.requireText && (m.data.typed || '') !== m.requireText, attrs: 'id="m-ok"' }) });
  }
  if (m.type === 'checklist') return checklistModal();
  if (m.type === 'filters') return modalFrame({ drawer: true, title: 'Filter passes', body: `
    ${F({ id: 'fl-kind', label: 'Pass type', bind: 'm.kind', options: [['', 'All types'], ['work', 'Work permits'], ['visitor', 'Visitor passes']] })}
    ${F({ id: 'fl-prop', label: 'Building', bind: 'm.property', options: [['', 'All buildings'], ...PROPERTIES.map(p => [p, p])] })}
    <div class="grid-2">${F({ id: 'fl-from', label: 'Work from', bind: 'm.from', type: 'date' })}${F({ id: 'fl-to', label: 'Work to', bind: 'm.to', type: 'date' })}</div>`,
    foot: btn('Clear all', { v: 'ghost', act: 'clearFilters' }) + btn('Apply filters', { v: 'primary', act: 'applyFilters' }) });
  if (m.type === 'material') { const E = m.errs || {}; return modalFrame({ title: m.data.id ? 'Edit item' : 'Add item', sub: 'Add each material or piece of equipment separately.', body: `<div class="grid-2">
    ${F({ id: 'mt-name', label: 'Item name', req: true, bind: 'm.name', full: true, err: E.name, ph: 'For example, Step ladder' })}
    ${F({ id: 'mt-kind', label: 'Type', bind: 'm.kind', options: ['Material', 'Equipment', 'Tool', 'Chemical'] })}
    <div class="grid-2" style="gap:8px">${F({ id: 'mt-qty', label: 'Quantity', req: true, bind: 'm.qty', type: 'number', attrs: 'min="1"', err: E.qty })}${F({ id: 'mt-unit', label: 'Unit', bind: 'm.unit', options: ['pcs', 'boxes', 'buckets', 'bags', 'cylinders', 'litres', 'kg', 'm²'] })}</div>
    <div class="field full"><span class="label">Will it be removed after the work?</span>${seg('mt-removed', 'm.removed', [['Yes', 'Yes, removed'], ['No', 'No, stays installed']])}</div>
    ${F({ id: 'mt-notes', label: 'Notes', opt: true, bind: 'm.notes', type: 'textarea', full: true, rows: 2 })}</div>`,
    foot: btn('Cancel', { act: 'closeModal' }) + (m.data.id ? '' : btn('Save & add another', { act: 'saveMaterial', id: 'again' })) + btn(m.data.id ? 'Save changes' : 'Add item', { v: 'primary', act: 'saveMaterial' }) }); }
  if (m.type === 'person') { const E = m.errs || {}; return modalFrame({ title: m.data.id ? 'Edit employee' : 'Add employee', sub: 'Saved employees can be added to any pass.', size: 'lg', body: `<div class="grid-2">
    ${F({ id: 'ps-name', label: 'Full name', req: true, bind: 'm.name', err: E.name, hint: 'As shown on the ID.' })}
    ${F({ id: 'ps-role', label: 'Role', bind: 'm.role', opt: true, ph: 'For example, Electrician' })}
    ${F({ id: 'ps-phone', label: 'Mobile number', req: true, bind: 'm.phone', type: 'tel', err: E.phone, hint: 'Their QR code is sent here.' })}
    ${F({ id: 'ps-email', label: 'Email', opt: true, bind: 'm.email', type: 'email' })}
    ${F({ id: 'ps-idtype', label: 'ID type', bind: 'm.idType', options: ['Emirates ID', 'Passport', 'GCC national ID'] })}
    ${F({ id: 'ps-idno', label: 'ID number', req: true, bind: 'm.idNo', err: E.idNo })}
    ${F({ id: 'ps-idexp', label: 'ID expiry date', req: true, bind: 'm.idExpiry', type: 'date', rerender: true, err: E.idExpiry, hint: m.data.fileObj && m.data.fileObj.extracted && m.data.fileObj.extracted.expiry ? readHint(m.data.fileObj, m.data.idExpiry) : 'Must cover the work dates of every pass.' })}
    <div class="field full"><span class="label">ID copy<span class="req">*</span></span>${uploader({ key: 'pid', bind: 'm.fileObj', label: 'ID copy (front and back)', file: m.data.fileObj })}${E.file ? `<span class="err">${ic('alert')}${E.file}</span>` : ''}</div></div>`,
    foot: btn('Cancel', { act: 'closeModal' }) + btn(m.data.id ? 'Save changes' : 'Add employee', { v: 'primary', act: 'savePerson' }) }); }
  if (m.type === 'vehicle') { const E = m.errs || {}; return modalFrame({ title: m.data.id ? 'Edit vehicle' : 'Add vehicle', sub: 'Registration must be valid on the work dates.', size: 'lg', body: `<div class="grid-2">
    ${F({ id: 'vh-plate', label: 'Plate number', req: true, bind: 'm.plate', err: E.plate, ph: 'For example, Dubai N 12345' })}
    ${F({ id: 'vh-type', label: 'Vehicle type', req: true, bind: 'm.type', options: ['Car', 'Van', 'Pickup', 'Truck', 'Motorbike'] })}
    ${F({ id: 'vh-tons', label: 'Vehicle weight', req: true, bind: 'm.tons', type: 'number', addon: 'tons', attrs: 'min="0.1" step="0.1" inputmode="decimal"', err: E.tons, hint: 'Loaded weight in tons. Delivery fees depend on it.' })}
    ${F({ id: 'vh-make', label: 'Make and model', opt: true, bind: 'm.make' })}
    ${F({ id: 'vh-color', label: 'Colour', opt: true, bind: 'm.color' })}
    ${F({ id: 'vh-exp', label: 'Registration expiry', req: true, bind: 'm.regExpiry', type: 'date', rerender: true, err: E.regExpiry, hint: readHint(m.data.fileObj, m.data.regExpiry) })}
    <div class="field full"><span class="label">Registration card (Mulkiya)<span class="req">*</span></span>${uploader({ key: 'vreg', bind: 'm.fileObj', label: 'registration card, both sides', file: m.data.fileObj })}${E.file ? `<span class="err">${ic('alert')}${E.file}</span>` : ''}</div></div>`,
    foot: btn('Cancel', { act: 'closeModal' }) + btn(m.data.id ? 'Save changes' : 'Add vehicle', { v: 'primary', act: 'saveVehicle' }) }); }
  if (m.type === 'sign') { const E = m.errs || {}; return modalFrame({ title: 'Add your signature', sub: 'Draw it or upload an image. It is added to the bottom of the signed document.', size: 'lg', body: `
    <div class="segmented" role="radiogroup" aria-label="Signature method">${[['draw', 'Draw'], ['upload', 'Upload image']].map(([k, l]) => `<label><input type="radio" name="sigmode" value="${k}" data-change="signMode" ${ui.signMode === k ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div>
    ${ui.signMode === 'draw'
      ? `<canvas class="sig" id="sig-canvas" aria-label="Draw your signature"></canvas><div class="row between"><span class="hint">Sign with your mouse, finger or stylus.</span>${btn('Clear', { v: 'ghost', sm: true, act: 'sigClear' })}</div>`
      : (m.data.upload
        ? `<div class="sig-pad-preview lg"><img src="${m.data.upload}" alt="Uploaded signature"></div><div class="row between"><label class="check"><input type="checkbox" data-change="sigBg" ${m.data.removeBg ? 'checked' : ''}>Remove white background</label><div class="row"><label class="btn btn-ghost btn-sm" for="sig-file">Choose another</label>${btn('Remove', { v: 'danger-ghost', sm: true, act: 'sigUploadClear' })}</div></div>`
        : `<label class="dropzone" for="sig-file" data-sigdrop><span class="ic">${ic('upload')}</span><b>Upload a signature image</b><span class="xs faint">PNG or JPG · Max 2 MB · A PNG with a transparent background looks best</span></label>`)
        + '<input class="file-input" type="file" id="sig-file" accept=".png,.jpg,.jpeg,image/png,image/jpeg" data-sigfile>'}
    ${E.sig ? `<span class="err">${ic('alert')}${E.sig}</span>` : ''}`,
    foot: btn('Cancel', { act: 'closeModal' }) + btn('Apply signature', { v: 'primary', act: 'saveSign' }) }); }
  if (m.type === 'companyDoc') { const E = m.errs || {}; return modalFrame({ title: m.data.id ? 'Replace document' : 'Add company document', body: `
    ${F({ id: 'cd-name', label: 'Document', req: true, bind: 'm.name', options: ['VAT registration certificate', 'Company profile', 'Letter of authority', 'Other'], disabled: !!m.data.id })}
    <div class="field"><span class="label">File<span class="req">*</span></span>${uploader({ key: 'cdoc', bind: 'm.fileObj', label: 'document', file: m.data.fileObj })}${E.file ? `<span class="err">${ic('alert')}${E.file}</span>` : ''}</div>
    ${F({ id: 'cd-exp', label: 'Expiry date', bind: 'm.expiry', type: 'date', rerender: true, disabled: m.data.noExpiry, err: E.expiry, hint: readHint(m.data.fileObj, m.data.expiry) })}
    ${sw('cd-noexp', 'm.noExpiry', 'No expiry date', 'Only for documents that never expire.')}`,
    foot: btn('Cancel', { act: 'closeModal' }) + btn('Save document', { v: 'primary', act: 'saveCompanyDoc' }) }); }
  if (m.type === 'access') { const E = m.errs || {}; return modalFrame({ title: 'Request access to a community', sub: 'The community reviews your company documents before giving access.', body: `
    ${combo({ id: 'ac-comm', label: 'Community', req: true, bind: 'm.community', options: S.directory.map(n => ({ value: n, label: n })), ph: 'Search communities', searchPh: 'Type a community name', err: E.community })}
    ${F({ id: 'ac-msg', label: 'Message', opt: true, bind: 'm.message', type: 'textarea', rows: 3, ph: 'For example, We maintain HVAC systems for several owners in your community.' })}
    ${alertBox('info', 'Shared with the community', 'Company name, trade licence and TRN.')}`,
    foot: btn('Cancel', { act: 'closeModal' }) + btn('Send request', { v: 'primary', icon: 'send', act: 'sendAccess' }) }); }
  if (m.type === 'drawer') return `<div class="overlay drawer-overlay" data-overlay style="place-items:stretch start"><div class="drawer left sidebar" role="dialog" aria-modal="true" aria-label="Menu" style="position:static;height:100%"><div class="side-inner">${sidebar(route())}</div></div></div>`;
  if (m.type === 'pickDoc') {
    const k = m.data.key, want = DOCS[k].name;
    const list = companyDocList().sort((a, b) => (b.name === want) - (a.name === want));
    return modalFrame({ title: 'Choose from company documents', sub: `For: ${want}. The file and its expiry date are copied into this permit.`, body: `<div class="stack-sm">${list.map(c => { const e = c.file ? expiry(c.expiry, c.noExpiry) : { tone: 'bad', label: 'Not uploaded' }; const off = !c.file || e.tone === 'bad'; return `<button type="button" class="select-row ${off ? 'disabled' : ''}" ${off ? 'disabled' : `data-act="useCompanyDoc" data-id="${c.id}"`}><span class="ic tone-neutral" style="width:34px;height:34px;border-radius:8px;display:grid;place-items:center">${ic('file')}</span><span class="grow"><b>${esc(c.name)}</b><span>${c.file ? esc(c.file) : 'No file yet'}</span></span>${c.name === want ? badge('Best match', 'info') : ''}${badge(e.label, e.tone)}</button>`; }).join('')}</div><p class="xs faint">Expired documents can’t be used. Renew them in Settings › Company documents.</p>`,
      foot: btn('Cancel', { act: 'closeModal' }) + btn('Manage company documents', { v: 'ghost', go: 'settings-documents' }) });
  }
  if (m.type === 'pay') { const E = m.errs || {}, p = S.permits.find(x => x.id === m.data.permitId), f = feeFor(p); return modalFrame({ title: 'Pay online', sub: `${esc(p.title)} · ${p.id}`, body: `
    ${feeLines(f)}
    <div class="grid-2">
    ${F({ id: 'pay-no', label: 'Card number', req: true, bind: 'm.cardNo', full: true, ph: '1234 5678 9012 3456', err: E.cardNo, attrs: 'inputmode="numeric" autocomplete="off"' })}
    ${F({ id: 'pay-exp', label: 'Expiry (MM/YY)', req: true, bind: 'm.exp', ph: 'MM/YY', err: E.exp, attrs: 'inputmode="numeric" autocomplete="off"' })}
    ${F({ id: 'pay-cvc', label: 'CVC', req: true, bind: 'm.cvc', ph: '123', err: E.cvc, attrs: 'inputmode="numeric" autocomplete="off"' })}
    ${F({ id: 'pay-name', label: 'Name on card', req: true, bind: 'm.holder', full: true, err: E.holder, attrs: 'autocomplete="off"' })}
    </div><p class="xs faint">Sample payment form. No real card is charged. Try 4242 4242 4242 4242.</p>`,
    foot: btn('Cancel', { act: 'closeModal' }) + btn(`Pay ${aed(f.total)}`, { v: 'primary', icon: 'lock', act: 'payConfirm' }) }); }
  if (m.type === 'invoice') { const inv = S.invoices.find(x => x.id === m.data.id); return modalFrame({ title: 'Invoice ' + esc(inv.id), size: 'lg', body: invoiceHtml(inv), foot: btn('Close', { act: 'closeModal' }) + btn('Download invoice PDF', { v: 'primary', icon: 'download', act: 'downloadInvoice', id: inv.id }) }); }
  if (m.type === 'closure') { const p = S.permits.find(x => x.id === m.data.id); return modalFrame({ title: 'Closure report', sub: `${esc(p.title)} · ${p.id}`, size: 'lg', body: closureHtml(p), foot: btn('Close', { act: 'closeModal' }) + btn('Download report PDF', { v: 'primary', icon: 'download', act: 'downloadClosure', id: p.id }) }); }
  if (m.type === 'addWorker') {
    const p = S.permits.find(x => x.id === m.data.permitId), t = typeOf(p.type);
    const on = new Set([...(p.workers || []), ...(p.extraWorkers || []).map(x => x.id)]);
    const list = S.people.filter(x => !on.has(x.id)), sel = m.data.sel || [];
    return modalFrame({ title: 'Add worker', sub: `Add people to ${esc(p.title)} after approval. ${esc(communityOf(p.community).name)} can revoke them.`, body: list.length ? `<div class="stack-sm">${list.map(x => { const e = expiry(x.idExpiry), off = e.tone === 'bad'; return `<button type="button" class="select-row ${off ? 'disabled' : ''}" ${off ? 'disabled' : `data-act="pickExtra" data-id="${x.id}"`} aria-pressed="${sel.includes(x.id)}"><input type="checkbox" tabindex="-1" ${sel.includes(x.id) ? 'checked' : ''} ${off ? 'disabled' : ''}><span class="avatar">${initials(x.name)}</span><span class="grow"><b>${esc(x.name)}</b><span>${esc(x.role)} · ${esc(x.idType)}</span></span>${badge(e.label, e.tone)}</button>`; }).join('')}</div>${m.errs && m.errs.pick ? `<span class="err">${ic('alert')}${m.errs.pick}</span>` : ''}` : '<p class="muted">Everyone in your company is already on this permit. Add a new employee under Employees first.</p>',
      foot: btn('Cancel', { act: 'closeModal' }) + btn(sel.length ? `Add ${plural(sel.length, 'worker')}` : 'Add worker', { v: 'primary', act: 'addWorkerConfirm', disabled: !list.length }) });
  }
  if (m.type === 'preview') return modalFrame({ title: esc(m.data.name), sub: 'File preview', size: 'lg', body: `<div class="paper" style="max-width:none;min-height:320px;place-content:center;text-align:center"><p>Preview of <b>${esc(m.data.name)}</b></p><p class="small">The live portal shows the uploaded file here.</p></div>`, foot: btn('Close', { act: 'closeModal' }) });
  return '';
}
function openConfirm(o) { ui.pop = null; ui.modal = Object.assign({ type: 'confirm', data: {} }, o); render(); }

/* ================= Toasts ================= */
function toast(msg, o = {}) {
  const box = document.getElementById('toasts');
  const el = document.createElement('div');
  el.className = 'toast' + (o.err ? ' err' : '');
  el.innerHTML = `${ic(o.err ? 'alert' : 'check')}<span class="grow">${esc(msg)}</span>${o.undo ? '<button class="btn btn-ghost btn-sm" type="button">Undo</button>' : ''}`;
  if (o.undo) el.querySelector('button').onclick = () => { o.undo(); el.remove(); };
  box.appendChild(el);
  setTimeout(() => el.remove(), o.undo ? 7000 : 4000);
}

/* ================= Render ================= */
const LEGACY = { community: 'home', unit: 'details', filters: 'permits', addMaterial: 'materials', password: 'settings-security', menu: 'home', sign: 'pdf', validation: 'details', documentsNoExpiry: 'documents', pdfSaved: 'pdf', pending: 'permit-BZ-1048', approved: 'permit-BZ-1036', changes: 'permit-BZ-1042', permitChecklist: 'type', addPerson: 'people', addVehicle: 'vehicles' };
function handleLegacy(r) {
  if (!LEGACY[r]) return false;
  closeAll();
  const after = { filters: () => { ui.modal = { type: 'filters', data: clone(ui.filters) }; }, addMaterial: () => ACT.addMaterial(), sign: () => ACT.openSign(), validation: () => { ui.errs.details = true; }, menu: () => { ui.modal = { type: 'drawer', data: {} }; }, permitChecklist: () => { ui.modal = { type: 'checklist', data: { type: S.draft ? S.draft.type : 'general' } }; }, addPerson: () => ACT.addPerson(), addVehicle: () => ACT.addVehicle(), unit: () => { ui.pop = 'combo:f-units'; } }[r];
  if (STEPS.some(s => s[0] === LEGACY[r]) && !S.draft) S.draft = blankDraft();
  history.replaceState(null, '', '#' + LEGACY[r]);
  current = LEGACY[r];
  render();
  if (after) { after(); render(); }
  return true;
}
function page(r) {
  if (STEPS.some(s => s[0] === r)) {
    if (!S.draft) return pType();
    return { details: pDetails, materials: pMaterials, workvehicles: pVehiclesStep, personnel: pPersonnel, documents: pDocuments, pdf: pPdf, review: pReview }[r]();
  }
  if (r.startsWith('permit-')) return pPermit(r.slice(7));
  if (r.startsWith('submitted-')) return pSubmitted(r.slice(10));
  if (r.startsWith('completion')) return pCompletion(r.slice(11));
  if (r.startsWith('settings')) return pSettings(r);
  return ({ home: pHome, permits: pPermits, type: pType, visitor: pVisitor, help: pHelp, people: pPeople, vehicles: pVehicles }[r] || pHome)();
}
const TITLES = { home: 'Overview', permits: 'Authorized passes', type: 'Request pass', visitor: 'Visitor pass', help: 'Help & contact', people: 'Employees', vehicles: 'Vehicles' };
function render() {
  const r = route();
  const a = document.activeElement;
  const focusId = a && a.id && a !== document.body ? a.id : null;
  const sel = focusId && a.selectionStart != null ? [a.selectionStart, a.selectionEnd] : null;
  if (r === 'communities') {
    document.getElementById('app').innerHTML = `<div class="hub"><header class="hub-top"><div class="logo"><span class="wm">buzz<span>in</span></span><small>Contractor</small></div><span class="spacer"></span><span class="hub-company">${logoTile(S.company.logo, S.company.name, 'sm')}<span><b>${esc(S.company.name)}</b><span class="xs faint">${esc(S.profile.name)}</span></span></span>${btn('Sign out', { v: 'ghost', sm: true, icon: 'logout', act: 'signOut' })}</header><main class="hub-main" id="main">${pHub()}</main></div>${renderModal()}`;
    document.title = 'Your communities · Buzzin';
    return;
  }
  const blocked = community().status !== 'active' && !r.startsWith('settings') && r !== 'help';
  const inWizard = !blocked && STEPS.some(s => s[0] === r) && S.draft;
  document.getElementById('app').innerHTML = `<div class="app ${inWizard ? 'has-actionbar' : ''}">
    <aside class="sidebar"><div class="side-inner">${sidebar(r)}</div></aside>
    <div class="main">${topbar()}<main class="content" id="main">${blocked ? pNoAccess() : page(r)}</main>${bottomNav(r)}</div>
  </div>${rowMenuLayer()}${renderModal()}`;
  document.title = (TITLES[r] || (r.startsWith('settings') ? 'Settings' : r.startsWith('permit-') ? r.slice(7) : STEPS.find(s => s[0] === r)?.[1]) || 'Buzzin') + ' · Buzzin contractor portal';
  if (focusId) {
    const el = document.getElementById(focusId);
    if (el) { el.focus({ preventScroll: true }); if (sel && el.setSelectionRange) try { el.setSelectionRange(sel[0], sel[1]); } catch (e) { /* date inputs */ } }
  }
  if (ui.pop && ui.pop.startsWith('combo:')) { const q = document.getElementById(ui.pop.slice(6) + '-q'); if (q && !focusId) q.focus(); }
  if (ui.pop === 'community' && !focusId) { const q = document.getElementById('community-q'); if (q) q.focus(); }
  if (ui.modal && ui.modal.type === 'sign' && ui.signMode === 'draw') setupCanvas();
  if (ui.modal && !document.querySelector('.overlay').contains(document.activeElement)) { const f = document.querySelector('.overlay .modal-body input:not([disabled]), .overlay .modal-body select, .overlay .modal-body textarea, .overlay button'); if (f) f.focus({ preventScroll: true }); }
}
function rowMenuLayer() {
  if (!ui.pop || !ui.pop.startsWith('row:') || !ui.popRect) return '';
  const id = ui.pop.slice(4);
  const p = passesHere().find(x => x.id === id);
  if (!p) return '';
  const r = ui.popRect, below = r.bottom + 280 < innerHeight;
  return `<div class="pop-anchor" style="position:fixed;z-index:70;${below ? `top:${r.bottom + 4}px` : `bottom:${innerHeight - r.top + 4}px`};right:${Math.max(8, innerWidth - r.right)}px"><div class="popover right" style="position:static;min-width:220px" role="menu">${rowMenuItems(p)}</div></div>`;
}

/* ================= Signature canvas ================= */
let sigDirty = false;
function setupCanvas() {
  const c = document.getElementById('sig-canvas');
  if (!c) return;
  const ratio = devicePixelRatio || 1, w = c.clientWidth, h = c.clientHeight;
  c.width = w * ratio; c.height = h * ratio;
  const x = c.getContext('2d'); x.scale(ratio, ratio); x.lineWidth = 2.2; x.lineCap = 'round'; x.lineJoin = 'round'; x.strokeStyle = '#102A5C';
  sigDirty = false;
  let drawing = false;
  const pos = e => { const b = c.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  c.onpointerdown = e => { drawing = true; c.setPointerCapture(e.pointerId); x.beginPath(); x.moveTo(...pos(e)); };
  c.onpointermove = e => { if (!drawing) return; x.lineTo(...pos(e)); x.stroke(); sigDirty = true; };
  c.onpointerup = c.onpointercancel = () => { drawing = false; };
}

/* ================= Actions ================= */
let current = route();
const closeAll = () => { ui.pop = null; ui.modal = null; };
window.__androidBack = () => { if (ui.modal || ui.pop || ui.drawer) { ui.modal = null; ui.pop = null; ui.drawer = false; render(); return true; } return false; };
function wzGo(step) { ui.errs[step] = false; go(step); window.scrollTo(0, 0); }
function persistDraft() { if (S.draft) S.draft.saved = TODAY; persist(); const s = document.getElementById('save-state'); if (s) { s.innerHTML = `${ic('refresh')}Saving…`; clearTimeout(persistDraft.t); persistDraft.t = setTimeout(() => { s.innerHTML = `${ic('check')}Draft saved`; }, 500); } }
const ACT = {
  closeModal() { ui.modal = null; render(); },
  openDrawer() { ui.pop = null; ui.modal = { type: 'drawer', data: {} }; render(); },
  toggleTheme() { const now = ui.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); ui.theme = now === 'dark' ? 'light' : 'dark'; try { localStorage.setItem('buzzin-theme', ui.theme); } catch (e) { /* ignore */ } applyTheme(); ui.pop = null; render(); },
  confirmOk() { const m = ui.modal; ui.modal = null; m.onConfirm(m.data); render(); },
  confirmAlt() { const m = ui.modal; ui.modal = null; m.alt.fn(); render(); },
  readAll() { S.notifications.forEach(n => { n.unread = false; }); persist(); render(); },
  openNotif(t) { const n = S.notifications.find(x => x.id === t.dataset.id); n.unread = false; persist(); ui.pop = null; go(n.go); },
  signOut() { openConfirm({ title: 'Sign out?', message: 'Any draft is saved. You will need your email and password to sign in again.', confirmText: 'Sign out', icon: 'logout', tone: 'warn', onConfirm: () => { BuzzinSession.clear(); location.href = '../index.html'; } }); },
  requestAccess() { ui.pop = null; ui.modal = { type: 'access', data: { community: '', message: '' } }; render(); },
  sendAccess() { const m = ui.modal; if (!m.data.community) { m.errs = { community: 'Choose a community.' }; render(); return; } openConfirm({ title: 'Send access request?', message: `${m.data.community} will see your company details and documents.`, confirmText: 'Send request', icon: 'send', onConfirm: () => { S.communities.push({ id: uid('c'), name: m.data.community, area: 'Dubai', status: 'pending', since: null, email: '' }); S.directory = S.directory.filter(x => x !== m.data.community); persist(); toast(`Access requested from ${m.data.community}`); } }); },
  withdrawAccess(t) { const c = S.communities.find(x => x.id === t.dataset.id); openConfirm({ title: `Withdraw request to ${c.name}?`, message: 'You can request access again later.', confirmText: 'Withdraw', tone: 'danger', icon: 'x', onConfirm: () => { S.communities = S.communities.filter(x => x !== c); S.directory.push(c.name); persist(); toast('Request withdrawn'); } }); },
  leaveCommunity(t) { const c = S.communities.find(x => x.id === t.dataset.id); const open = S.permits.filter(p => p.community === c.id && ['review', 'changes', 'payment', 'approved'].includes(p.status)).length; openConfirm({ title: `Leave ${c.name}?`, message: `Your company will lose access. ${open ? `${plural(open, 'open pass', 'open passes')} will be cancelled.` : 'You have no open passes there.'} You will need to request access again to return.`, confirmText: 'Leave community', tone: 'danger', icon: 'logout', requireText: 'LEAVE', onConfirm: () => { c.status = 'left'; c.changedOn = TODAY; S.permits.forEach(p => { if (p.community === c.id && ['review', 'changes', 'payment', 'approved'].includes(p.status)) p.status = 'cancelled'; }); persist(); toast(`You left ${c.name}`); if (c.id === S.community) go('communities'); } }); },
  requestAgain(t) { const c = S.communities.find(x => x.id === t.dataset.id); openConfirm({ title: `Request access to ${c.name} again?`, message: `${c.name} will see your company details and documents and decide whether to give access.`, confirmText: 'Send request', icon: 'send', onConfirm: () => { c.status = 'pending'; c.changedOn = TODAY; persist(); toast(`Access requested from ${c.name}`); } }); },
  openCommunity(t) { S.community = t.dataset.id; ui.tab = 'all'; persist(); go('home'); },
  kpi(t) { const k = t.dataset.id; if (k === 'expiring') { const e = expiringItems()[0]; go(e ? e.go : 'people'); return; } ui.tab = k; go('permits'); },
  tab(t) { ui.tab = t.dataset.id; render(); },
  rowMenu(t, e) { e.stopPropagation(); const k = 'row:' + t.dataset.id; if (ui.pop === k) { ui.pop = null; } else { ui.pop = k; ui.popRect = t.getBoundingClientRect(); } render(); },
  openFilters() { ui.modal = { type: 'filters', data: clone(ui.filters) }; render(); },
  applyFilters() { ui.filters = clone(ui.modal.data); ui.modal = null; render(); },
  clearFilters() { ui.filters = {}; ui.search.permits = ''; ui.modal = null; render(); },
  resumeDraft() { ui.pop = null; const i = Math.min(S.draft.reached, STEPS.length - 1); if (S.draft.community !== S.community) S.community = S.draft.community; wzGo(STEPS[i][0]); },
  discardDraft() { const d = S.draft; openConfirm({ title: 'Delete this draft?', message: `“${d.title || 'Untitled request'}” and everything you entered will be deleted. This cannot be undone.`, confirmText: 'Delete draft', tone: 'danger', onConfirm: () => { S.draft = null; persist(); toast('Draft deleted', { undo: () => { S.draft = d; persist(); render(); } }); go('home'); } }); },
  startPermit() {
    const start = () => { S.draft = blankDraft({ community: S.community, contact: S.profile.name, phone: S.profile.phone }); persist(); ui.errs = {}; wzGo('details'); };
    if (S.draft) openConfirm({ title: 'You already have a draft', message: `Continue “${S.draft.title || 'Untitled request'}”, or delete it and start a new request?`, confirmText: 'Continue draft', icon: 'edit', alt: { label: 'Start new', v: 'danger-ghost', fn: () => openConfirm({ title: 'Delete the current draft?', message: 'Starting a new request deletes your current draft. This cannot be undone.', confirmText: 'Delete and start new', tone: 'danger', onConfirm: start }) }, onConfirm: () => ACT.resumeDraft() });
    else start();
  },
  checklist() { ui.modal = { type: 'checklist', data: { type: S.draft ? S.draft.type : 'general' } }; render(); },
  startPermitFromChecklist() { const t = ui.modal.data.type; ui.modal = null; if (S.draft && STEPS.some(s => s[0] === route())) { S.draft.type = t; persist(); render(); return; } ACT.startPermit(); if (S.draft && !S.draft.title) { S.draft.type = t; persist(); render(); } },
  duplicate(t) {
    const p = S.permits.find(x => x.id === t.dataset.id); ui.pop = null;
    const doIt = () => { S.draft = blankDraft({ community: p.community, property: p.property, units: [...p.units], type: p.type, title: p.title, workers: [...(p.workers || [])].filter(id => expiry(person(id)?.idExpiry).tone !== 'bad'), vehicles: [...(p.vehicles || [])], tripsBy: clone(p.tripsBy || {}), contact: S.profile.name, phone: S.profile.phone }); persist(); toast(`New draft created from ${p.id}. Choose new dates.`); wzGo('details'); };
    if (S.draft) openConfirm({ title: 'Replace your current draft?', message: `Duplicating ${p.id} replaces your draft “${S.draft.title || 'Untitled request'}”.`, confirmText: 'Replace draft', tone: 'warn', onConfirm: doIt }); else doIt();
  },
  updatePermit(t) { const p = S.permits.find(x => x.id === t.dataset.id); ui.pop = null; openConfirm({ title: 'Update and resubmit?', message: `We'll open ${p.id} as a draft so you can fix what the community asked for, then submit it again.`, confirmText: 'Open for editing', icon: 'edit', onConfirm: () => { S.draft = blankDraft({ id: p.id, resubmit: p.id, community: p.community, property: p.property, units: [...p.units], type: p.type, title: p.title, from: p.from, to: p.to, contact: S.profile.name, phone: S.profile.phone, workers: [...p.workers], vehicles: [...p.vehicles], tripsBy: clone(p.tripsBy || {}), noMaterials: true, reached: 4 }); persist(); wzGo('documents'); } }); },
  cancelPermit(t) {
    const p = S.permits.find(x => x.id === t.dataset.id); ui.pop = null;
    const was = p.status;
    openConfirm({ title: p.status === 'approved' ? `Cancel pass ${p.id}?` : `Withdraw request ${p.id}?`, message: p.status === 'approved' ? 'QR codes stop working immediately and workers will not be let in. This cannot be undone.' : 'The community will stop reviewing it. You can duplicate it later to submit again.', confirmText: p.status === 'approved' ? 'Cancel pass' : 'Withdraw request', tone: 'danger', icon: 'x',
      extra: () => F({ id: 'cx-reason', label: 'Reason', bind: 'm.reason', options: ['Work no longer needed', 'Dates changed', 'Submitted by mistake', 'Other'], ph: 'Choose a reason' }),
      onConfirm: () => { p.status = 'cancelled'; p.updated = TODAY; persist(); toast(`${p.id} cancelled`, { undo: () => { p.status = was; persist(); render(); } }); } });
  },
  async download(t) {
    ui.pop = null; render();
    const p = S.permits.find(x => x.id === t.dataset.id);
    if (!p) { toast(`${t.dataset.id} downloaded (preview)`); return; }
    try { saveBytes(await permitPdf(p), p.id + '-permit.pdf'); toast('Permit PDF downloaded'); }
    catch (e) { toast('Could not create the permit PDF. ' + e.message, { err: true }); }
  },
  async downloadInvoice(t) {
    const inv = S.invoices.find(x => x.id === t.dataset.id);
    try { saveBytes(await invoicePdf(inv), inv.id + '.pdf'); toast('Invoice PDF downloaded'); }
    catch (e) { toast('Could not create the invoice PDF. ' + e.message, { err: true }); }
  },
  viewInvoice(t) { ui.pop = null; ui.modal = { type: 'invoice', data: { id: t.dataset.id } }; render(); },
  payNow(t) { ui.pop = null; const p = S.permits.find(x => x.id === t.dataset.id); ui.modal = { type: 'pay', data: { permitId: p.id, cardNo: '', exp: '', cvc: '', holder: S.profile.name } }; render(); },
  payConfirm() {
    const m = ui.modal, d = m.data, e = {};
    if (!/^\d{13,19}$/.test(d.cardNo.replace(/\s/g, ''))) e.cardNo = 'Enter the card number (13 to 19 digits).';
    const mm = /^(\d{2})\s*\/\s*(\d{2})$/.exec(d.exp.trim());
    if (!mm || +mm[1] < 1 || +mm[1] > 12) e.exp = 'Enter the expiry as MM/YY, for example 08/29.'; else if (iso(new Date(2000 + +mm[2], +mm[1], 0)) < TODAY) e.exp = 'This card has expired.';
    if (!/^\d{3,4}$/.test(d.cvc.trim())) e.cvc = 'Enter the 3 or 4 digit code on the card.';
    if (!d.holder.trim()) e.holder = 'Enter the name on the card.';
    if (Object.keys(e).length) { m.errs = e; render(); return; }
    m.errs = null;
    const p = S.permits.find(x => x.id === d.permitId), f = feeFor(p);
    openConfirm({ title: `Pay ${aed(f.total)}?`, message: `Your card ending ${d.cardNo.replace(/\s/g, '').slice(-4)} will be charged ${aed(f.total)} for ${p.id}. Your QR codes are ready straight after.`, confirmText: `Pay ${aed(f.total)}`, icon: 'lock', onConfirm: () => {
      const inv = { id: 'INV-2026-' + String(S.nextInv++).padStart(4, '0'), permitId: p.id, community: p.community, amount: f.total, lines: f.lines, method: 'Online', paidAt: TODAY + 'T' + new Date().toTimeString().slice(0, 5), status: 'Paid' };
      S.invoices.unshift(inv); p.status = 'approved'; p.updated = TODAY;
      S.notifications.unshift({ id: uid('n'), title: `Payment received for ${p.id}`, body: `${aed(inv.amount)} paid online. Your QR codes are ready.`, when: 'Just now', go: 'permit-' + p.id, unread: false });
      persist(); toast(`Payment received. ${inv.id} is ready and your QR codes are available.`);
    } });
    ui.modal.onCancel = m;
  },
  markComplete(t) {
    ui.pop = null; const p = S.permits.find(x => x.id === t.dataset.id);
    if (typeOf(p.type).closure) { go('completion-' + p.id); return; }
    const was = p.status;
    openConfirm({ title: 'Mark as completed?', message: `${p.title} (${p.id}) will be closed. QR codes stop working and workers cannot enter. This type of work needs no final inspection.`, confirmText: 'Mark as completed', icon: 'clipboard', onConfirm: () => { p.status = 'completed'; p.updated = TODAY; persist(); toast(`${p.id} marked as completed`, { undo: () => { p.status = was; persist(); render(); } }); } });
  },
  addWorker(t) { ui.pop = null; ui.modal = { type: 'addWorker', data: { permitId: t.dataset.id, sel: [] } }; render(); },
  pickExtra(t) { const d = ui.modal.data, id = t.dataset.id; d.sel = d.sel.includes(id) ? d.sel.filter(x => x !== id) : [...d.sel, id]; if (ui.modal.errs) ui.modal.errs = null; render(); },
  addWorkerConfirm() {
    const m = ui.modal, p = S.permits.find(x => x.id === m.data.permitId), sel = m.data.sel, tt = typeOf(p.type);
    if (!sel.length) { m.errs = { pick: 'Choose at least one person.' }; render(); return; }
    const now = (p.workers || []).length + (p.extraWorkers || []).filter(x => !x.revoked).length;
    if (tt.maxEmployees && now + sel.length > tt.maxEmployees) { m.errs = { pick: `${tt.name} allows up to ${tt.maxEmployees} workers. You can add ${Math.max(0, tt.maxEmployees - now)} more.` }; render(); return; }
    openConfirm({ title: `Add ${plural(sel.length, 'worker')} to ${p.id}?`, message: `${sel.map(id => person(id).name).join(', ')} will get entry codes by SMS. ${communityOf(p.community).name} can revoke them.`, confirmText: 'Add to permit', icon: 'users', onConfirm: () => { p.extraWorkers = p.extraWorkers || []; sel.forEach(id => p.extraWorkers.push({ id, added: TODAY, revoked: null })); persist(); toast(`${plural(sel.length, 'worker')} added`); } });
    ui.modal.onCancel = m;
  },
  shareCodes(t) { openConfirm({ title: 'Send QR codes to workers?', message: `Each worker on ${t.dataset.id} gets their personal entry code by SMS.`, confirmText: 'Send codes', icon: 'send', onConfirm: () => toast('QR codes sent by SMS') }); },
  copy(t) { const v = t.dataset.id; const done = () => toast(`Copied ${v}`); try { navigator.clipboard.writeText(v).then(done, () => toast('Copy not available here. Select the text instead.', { err: true })); } catch (e) { toast('Copy not available here. Select the text instead.', { err: true }); } },
  demo(t) { toast(`${t.dataset.id} (preview)`); },
  focus(t) { const el = document.getElementById(t.dataset.id) || document.getElementById(t.dataset.id + '-add'); if (el) { el.scrollIntoView({ block: 'center' }); el.focus({ preventScroll: true }); } },
  gotoStep(t) { wzGo(t.dataset.id); },
  wzBack() { const i = stepIndex(route()); if (i <= 0) go('type'); else wzGo(STEPS[i - 1][0]); },
  wzNext() { const r = route(), i = stepIndex(r); if (Object.keys(validate(r)).length) { ui.errs[r] = true; render(); const s = document.getElementById('err-summary'); if (s) { s.scrollIntoView({ block: 'center' }); s.focus({ preventScroll: true }); } return; } const next = () => { S.draft.reached = Math.max(S.draft.reached, i + 1); persistDraft(); wzGo(STEPS[i + 1][0]); };
    const scope = { workvehicles: 'vehicles', personnel: 'workers', documents: 'documents' }[r];
    const warn = scope ? expiryWarnings(S.draft, scope) : [];
    if (!warn.length) { next(); return; }
    openConfirm({ title: warn.length === 1 ? 'A document is close to expiry' : `${warn.length} documents are close to expiry`, message: 'You can still continue. The community may reject your permit if a document expires before or during the work. If you have an updated document, please upload it.', icon: 'alert', tone: 'warn', extra: () => expiryList(warn), confirmText: 'OK, continue', cancelText: 'Stay and update', onConfirm: next });
  },
  saveExit() { persist(); toast('Draft saved. Continue it any time from the Overview.'); go('home'); },
  submitRequest() {
    const bad = STEPS.map(s => s[0]).find(s => Object.keys(validate(s)).length);
    if (bad) { ui.errs[bad] = true; if (bad === 'review') { render(); return; } toast(`Finish “${STEPS.find(s => s[0] === bad)[1]}” before submitting`, { err: true }); wzGo(bad); ui.errs[bad] = true; render(); return; }
    const d = S.draft;
    const warn = expiryWarnings(d);
    openConfirm({ extra: warn.length ? () => `<div class="alert alert-warn">${ic('alert')}<div class="grow"><strong>Close to expiry. The community may reject your permit.</strong>${expiryList(warn)}</div></div>` : null, title: d.resubmit ? `Resubmit ${d.resubmit}?` : 'Submit this request?', message: `${d.title} will be sent to ${community().name} for review. You can't edit it while it's under review.`, confirmText: d.resubmit ? 'Resubmit request' : 'Submit request', icon: 'send', onConfirm: () => {
      let id;
      const rec = { community: d.community, kind: 'work', title: d.title, type: d.type, property: d.property, units: d.units, from: d.from, to: d.to, hours: `${d.start}–${d.end}`, status: 'review', updated: TODAY, workers: d.workers, vehicles: d.noVehicles ? [] : d.vehicles, tripsBy: Object.fromEntries((d.noVehicles ? [] : d.vehicles).map(id => [id, tripsOf(d, id)])), amc: amcOn(d) ? { freq: d.amcFreq, visits: Number(d.amcVisits) } : null, approvals: [], materials: d.noMaterials ? 0 : d.materials.length, docs: Object.keys(d.docs).filter(k => d.docs[k].file).map(k => DOCS[k].name).concat(formsFor(d).map(f => f.published.name + ' (signed)')),
        description: d.description, docExpiry: Object.fromEntries(Object.keys(d.docs).filter(k => d.docs[k].file).map(k => [DOCS[k].name, d.docs[k].noExpiry ? '' : (d.docs[k].expiry || '')])), materialList: d.noMaterials ? [] : d.materials.map(m => ({ name: m.name, kind: m.kind, qty: m.qty, unit: m.unit })),
        signed: formsFor(d).length ? { name: formsFor(d).map(f => f.published.name).join(', '), version: formsFor(d)[0].published.version, by: d.signer.name, position: d.signer.position, at: TODAY + 'T' + new Date().toTimeString().slice(0, 5) } : null };
      if (d.resubmit) { id = d.resubmit; const old = S.permits.find(p => p.id === id); Object.assign(old, rec, { message: '', approvals: old.approvals || [] }); } else { id = 'BZ-' + S.nextRef++; S.permits.unshift(Object.assign({ id }, rec)); }
      S.notifications.unshift({ id: uid('n'), title: `${id} submitted`, body: `${d.title} was sent to ${community().name}.`, when: 'Just now', go: 'permit-' + id, unread: false });
      S.draft = null; ui.errs = {}; persist(); go('submitted-' + id);
    } });
  },
  submitVisitor() {
    if (Object.keys(vValidate()).length) { ui.errs.visitor = true; render(); window.scrollTo(0, 0); return; }
    const v = S.visitor;
    openConfirm({ title: 'Submit visitor pass?', message: `${v.name} · ${v.unit} · ${fmt(v.date)} ${v.from}–${v.to}. The pass is sent to ${v.phone} once approved.`, confirmText: 'Submit visitor pass', icon: 'send', onConfirm: () => {
      const id = 'VP-' + S.nextVp++;
      S.permits.unshift({ id, community: S.community, kind: 'visitor', title: `${v.purpose}: ${v.name}`, type: 'visitor', property: PROPERTIES[0], units: [v.unit], from: v.date, to: v.date, hours: `${v.from}–${v.to}`, status: 'review', updated: TODAY, workers: [], vehicles: [], materials: 0, docs: [] });
      S.visitor = seed().visitor; ui.errs.visitor = false; persist(); go('submitted-' + id);
    } });
  },
  submitInspection(t) {
    const p = S.permits.find(x => x.id === t.dataset.id), I = ui.inspect; if (!p || !I || !canComplete(p)) return;
    const unticked = !(I.c0 && I.c1 && I.c2);
    openConfirm({ title: 'Mark as completed?', message: `${community().name} will check ${p.title} (${p.id}) and tell you if it is complete.${unticked ? ' Some of the checks are not ticked. The community may ask you to fix things.' : ''}`, confirmText: 'Mark as completed', icon: 'clipboard', tone: unticked ? 'warn' : undefined, onConfirm: () => ACT.doInspect(p) });
  },
  doInspect(p) {
    const I = ui.inspect || { notes: '', photos: [] };
    p.status = 'inspection'; p.updated = TODAY;
    p.inspection = { status: 'pending', notes: (I.notes || '').trim(), photos: [...(I.photos || [])], at: TODAY + 'T' + new Date().toTimeString().slice(0, 5), rounds: [] };
    ui.inspect = null;
    S.notifications.unshift({ id: uid('n'), title: `${p.id} marked as completed`, body: `${community().name} will check the work and reply.`, when: 'Just now', go: 'permit-' + p.id, unread: false });
    persist(); toast(`${p.id} marked as completed. Waiting for the community.`); go('permit-' + p.id);
  },
  resubmitInspection(t) {
    ui.pop = null; const p = S.permits.find(x => x.id === t.dataset.id); if (!p || !p.inspection || p.inspection.status !== 'waiting') return;
    openConfirm({ title: 'Mark as completed again?', message: `${communityOf(p.community).name} will check ${p.title} (${p.id}) again.`, confirmText: 'Mark as completed', icon: 'clipboard',
      extra: () => F({ id: 'ri-note', label: 'Note', opt: true, bind: 'm.note', type: 'textarea', rows: 2, ph: 'For example, The tiles are now aligned.' }),
      onConfirm: d => { p.inspection.rounds.push({ at: TODAY + 'T' + new Date().toTimeString().slice(0, 5), by: S.profile.name, decision: 'resubmitted', comment: ((d && d.note) || '').trim(), files: [] }); p.inspection.status = 'pending'; p.updated = TODAY; persist(); toast(`${p.id} sent for inspection again`); } });
  },
  removeInspectPhoto(t) { const k = Number(t.dataset.id), name = ui.inspect.photos[k]; openConfirm({ title: 'Remove this photo?', message: name, confirmText: 'Remove', tone: 'danger', onConfirm: () => { ui.inspect.photos.splice(k, 1); } }); },
  viewClosure(t) { ui.pop = null; ui.modal = { type: 'closure', data: { id: t.dataset.id } }; render(); },
  async downloadClosure(t) {
    const p = S.permits.find(x => x.id === t.dataset.id);
    try { saveBytes(await closurePdf(p), p.id + '-closure-report.pdf'); toast('Closure report downloaded'); }
    catch (e) { toast('Could not create the closure report. ' + e.message, { err: true }); }
  },
  sendHelp() { const msg = document.getElementById('h-msg'); if (!msg.value.trim()) { toast('Write your message first', { err: true }); msg.focus(); return; } openConfirm({ title: `Send to ${community().name}?`, message: 'They reply to your email address. Replies also appear in your notifications.', confirmText: 'Send message', icon: 'send', onConfirm: () => toast('Message sent (preview)') }); },
  openSign(t) { ui.signMode = (t && t.dataset.mode) || ui.signMode || 'draw'; ui.modal = { type: 'sign', data: { upload: null, orig: null, removeBg: true } }; render(); },
  sigClear() { setupCanvas(); },
  sigUploadClear() { Object.assign(ui.modal.data, { upload: null, orig: null }); render(); },
  saveSign() {
    const m = ui.modal;
    let data;
    if (ui.signMode === 'draw') {
      if (!sigDirty) { m.errs = { sig: 'Draw your signature in the box, or upload an image instead.' }; render(); return; }
      data = trimCanvas(document.getElementById('sig-canvas')).toDataURL('image/png');
    } else {
      if (!m.data.upload) { m.errs = { sig: 'Upload an image of your signature, or draw it instead.' }; render(); return; }
      data = m.data.upload;
    }
    S.draft.signer.sig = { data, source: ui.signMode };
    ui.modal = null; persistDraft(); toast('Signature added'); render();
  },
  clearSign() { openConfirm({ title: 'Remove your signature?', message: 'You will need to sign again before submitting.', confirmText: 'Remove signature', tone: 'danger', onConfirm: () => { S.draft.signer.sig = null; persistDraft(); } }); },
  tickBox(t) { const d = S.draft, k = t.dataset.form, id = t.dataset.id; d.ticks[k] = d.ticks[k] || {}; d.ticks[k][id] = !d.ticks[k][id]; persistDraft(); render(); },
  async downloadSigned(t) {
    const f = S.forms.find(x => x.id === t.dataset.id);
    if (Object.keys(validate('pdf')).length) { ui.errs.pdf = true; render(); toast('Tick every box and sign before downloading the signed copy.', { err: true }); return; }
    try { saveBytes(await signedPdf(f, S.draft), f.published.fileName.replace(/\.pdf$/i, '') + '-signed.pdf'); toast('Signed PDF downloaded'); }
    catch (e) { toast('Could not create the signed PDF. ' + e.message, { err: true }); }
  },
  downloadOriginal(t) { const f = S.forms.find(x => x.id === t.dataset.id); saveBytes(formPdf(f.published ? f.published.pdf : f.pdf), f.published ? f.published.fileName : f.fileName); },
  addMaterial() { ui.modal = { type: 'material', data: { name: '', kind: 'Material', qty: 1, unit: 'pcs', removed: 'Yes', notes: '' } }; render(); },
  editMaterial(t) { ui.modal = { type: 'material', data: clone(S.draft.materials.find(m => m.id === t.dataset.id)) }; render(); },
  saveMaterial(t) {
    const m = ui.modal, d = m.data, errs = {};
    if (!String(d.name).trim()) errs.name = 'Enter the item name.';
    if (!(Number(d.qty) >= 1)) errs.qty = 'Enter 1 or more.';
    if (Object.keys(errs).length) { m.errs = errs; render(); return; }
    d.qty = Number(d.qty);
    if (d.id) Object.assign(S.draft.materials.find(x => x.id === d.id), d); else S.draft.materials.push(Object.assign({}, d, { id: uid('m') }));
    S.draft.noMaterials = false; persistDraft(); toast(d.id ? 'Item updated' : `${d.name} added`);
    if (t.dataset.id === 'again') ACT.addMaterial(); else { ui.modal = null; render(); }
  },
  removeMaterial(t) { const i = S.draft.materials.findIndex(m => m.id === t.dataset.id), item = S.draft.materials[i]; openConfirm({ title: `Remove ${item.name}?`, message: 'It will be taken off this request’s materials list.', confirmText: 'Remove item', tone: 'danger', onConfirm: () => { S.draft.materials.splice(i, 1); persistDraft(); toast(`${item.name} removed`, { undo: () => { S.draft.materials.splice(i, 0, item); persistDraft(); render(); } }); } }); },
  clearWorkers() { S.draft.workers = []; persistDraft(); render(); },
  addPerson() { ui.modal = { type: 'person', data: { name: '', role: '', phone: '', email: '', idType: 'Emirates ID', idNo: '', idExpiry: '', fileObj: null }, fromWizard: route() === 'personnel' }; render(); },
  editPerson(t) { const p = clone(person(t.dataset.id)); p.fileObj = p.file ? { name: p.file } : null; ui.modal = { type: 'person', data: p }; render(); },
  savePerson() {
    const m = ui.modal, d = m.data, errs = {};
    if (!d.name.trim()) errs.name = 'Enter the full name.';
    if (!/^\+?[\d\s-]{8,}$/.test(d.phone.trim())) errs.phone = 'Enter a mobile number with country code.';
    if (!d.idNo.trim()) errs.idNo = 'Enter the ID number.';
    if (!d.idExpiry) errs.idExpiry = 'Enter the expiry date.'; else if (d.idExpiry < TODAY) errs.idExpiry = 'This ID has expired. Upload a valid ID.';
    if (!d.fileObj) errs.file = 'Upload a copy of the ID.'; else if (d.fileObj.status === 'checking') errs.file = 'Wait for the document check to finish.';
    if (Object.keys(errs).length) { m.errs = errs; render(); return; }
    const rec = { name: d.name, role: d.role || 'Worker', phone: d.phone, email: d.email, idType: d.idType, idNo: d.idNo, idExpiry: d.idExpiry, file: d.fileObj.name };
    if (d.id) Object.assign(person(d.id), rec); else { const id = uid('p'); S.people.push(Object.assign({ id }, rec)); if (m.fromWizard) S.draft.workers.push(id); }
    ui.modal = null; persist(); toast(d.id ? `${d.name} updated` : `${d.name} added`); render();
  },
  removePerson(t) { const p = person(t.dataset.id), i = S.people.indexOf(p); const used = S.permits.filter(x => ['review', 'approved', 'changes'].includes(x.status) && (x.workers || []).includes(p.id)); openConfirm({ title: `Remove ${p.name}?`, message: used.length ? `${p.name} is on ${plural(used.length, 'open pass', 'open passes')} (${used.map(x => x.id).join(', ')}). They stay on those passes but can't be added to new ones.` : 'They will be removed from your saved employees.', confirmText: 'Remove employee', tone: 'danger', onConfirm: () => { S.people.splice(i, 1); if (S.draft) S.draft.workers = S.draft.workers.filter(x => x !== p.id); persist(); toast(`${p.name} removed`, { undo: () => { S.people.splice(i, 0, p); persist(); render(); } }); } }); },
  peopleFilter(t) { ui.peopleFilter = t.dataset.id; render(); },
  addVehicle() { ui.modal = { type: 'vehicle', data: { plate: '', type: 'Van', make: '', color: '', tons: '', regExpiry: '', fileObj: null }, fromWizard: route() === 'workvehicles' }; render(); },
  editVehicle(t) { const v = clone(vehicle(t.dataset.id)); v.fileObj = v.file ? { name: v.file } : null; ui.modal = { type: 'vehicle', data: v }; render(); },
  saveVehicle() {
    const m = ui.modal, d = m.data, errs = {};
    if (!d.plate.trim()) errs.plate = 'Enter the plate number.';
    if (!(Number(d.tons) > 0)) errs.tons = 'Enter the weight in tons, for example 1.5.';
    if (!d.regExpiry) errs.regExpiry = 'Enter the registration expiry date.'; else if (d.regExpiry < TODAY) errs.regExpiry = 'This registration has expired.';
    if (!d.fileObj) errs.file = 'Upload the registration card.'; else if (d.fileObj.status === 'checking') errs.file = 'Wait for the document check to finish.';
    if (Object.keys(errs).length) { m.errs = errs; render(); return; }
    const rec = { plate: d.plate, type: d.type, make: d.make || d.type, color: d.color || '—', tons: Number(d.tons), regExpiry: d.regExpiry, file: d.fileObj.name };
    if (d.id) Object.assign(vehicle(d.id), rec); else { const id = uid('v'); S.vehicles.push(Object.assign({ id }, rec)); if (m.fromWizard) { S.draft.vehicles.push(id); S.draft.noVehicles = false; } }
    ui.modal = null; persist(); toast(d.id ? `${d.plate} updated` : `${d.plate} added`); render();
  },
  removeVehicle(t) { const v = vehicle(t.dataset.id), i = S.vehicles.indexOf(v); openConfirm({ title: `Remove ${v.plate}?`, message: 'It stays on existing passes but cannot be added to new ones.', confirmText: 'Remove vehicle', tone: 'danger', onConfirm: () => { S.vehicles.splice(i, 1); if (S.draft) S.draft.vehicles = S.draft.vehicles.filter(x => x !== v.id); persist(); toast(`${v.plate} removed`, { undo: () => { S.vehicles.splice(i, 0, v); persist(); render(); } }); } }); },
  previewFile(t) { ui.modal = { type: 'preview', data: { name: t.dataset.id } }; render(); },
  removeFile(t) {
    const b = t.dataset.id, f = getB(b), label = t.dataset.label;
    const inModal = b.startsWith('m.');
    const prev = inModal ? ui.modal : null;
    openConfirm({ title: `Remove ${label}?`, message: `${f.name} will be removed. You can upload another file.`, confirmText: 'Remove file', tone: 'danger', onConfirm: () => {
      if (inModal) { ui.modal = prev; setB(b, null); return; }
      setB(b, null);
      if (b.startsWith('d.')) persistDraft(); else if (b.startsWith('f.')) ui.dirty = true;
    } });
    if (inModal) { ui.modal.onCancel = prev; }
  },
  mainDashboard() { ui.pop = null; go('communities'); },
  switchCommunity(t) {
    const c = S.communities.find(x => x.id === t.dataset.id); ui.pop = null;
    if (!c || c.id === S.community) { render(); return; }
    const doIt = () => { S.community = c.id; ui.tab = 'all'; persist(); toast(`Switched to ${c.name}`); go('home'); };
    if (STEPS.some(s => s[0] === route()) && S.draft) openConfirm({ title: `Switch to ${c.name}?`, message: 'Your request is saved as a draft. Switch back to this community to continue it.', confirmText: 'Switch community', tone: 'warn', onConfirm: doIt });
    else doIt();
  },
  pickCompanyDoc(t) { ui.modal = { type: 'pickDoc', data: { key: t.dataset.id } }; render(); },
  useCompanyDoc(t) {
    const k = ui.modal.data.key, c = companyDocList().find(x => x.id === t.dataset.id), d = S.draft;
    const before = d.docs[k];
    d.docs[k] = { file: { name: c.file, size: 0, date: TODAY, source: 'company', companyId: c.id }, expiry: c.noExpiry ? '' : (c.expiry || ''), noExpiry: !!c.noExpiry };
    ui.modal = null; persistDraft(); toast(`${c.name} added from company documents`, { undo: () => { d.docs[k] = before; persistDraft(); render(); } }); render();
  },
  removeLogo() { openConfirm({ title: 'Remove your logo?', message: 'Passes will show your company initials instead. Save changes to apply.', confirmText: 'Remove logo', tone: 'danger', onConfirm: () => { ui.form.company.logo = null; ui.dirty = true; } }); },
  discardForm() { openConfirm({ title: 'Discard unsaved changes?', message: 'Your edits on this page will be lost.', confirmText: 'Discard changes', tone: 'danger', onConfirm: () => { ui.form = initForm(ui.formTab); ui.dirty = false; ui.formErr = {}; } }); },
  saveForm() {
    const tab = ui.formTab, f = ui.form, e = {};
    if (tab === 'general') {
      if (!f.company.name.trim()) e.name = 'Enter the company name.';
      if (f.company.trn && !/^\d{8,15}$/.test(f.company.trn.replace(/\s/g, ''))) e.trn = 'TRN must be 8–15 digits.';
      if (!f.company.licence) e.licence = 'Upload your trade licence.'; else if (f.company.licence.status === 'checking') e.licence = 'Wait for the trade licence check to finish.';
      if (!f.company.licenceExpiry) e.licenceExpiry = 'Enter the licence expiry date.'; else if (f.company.licenceExpiry < TODAY) e.licenceExpiry = 'This licence has expired. Upload the renewed licence.';
      ['legal', 'addr1', 'state', 'city', 'postal'].forEach(k => { if (!String(f.billing[k] || '').trim()) e[k] = 'This field is required.'; });
    }
    if (tab === 'profile') {
      if (!f.name.trim()) e.name = 'Enter your name.';
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) e.email = 'Enter a valid email address, for example name@company.com.';
      if (f.phone && !/^\+?[\d\s-]{8,}$/.test(f.phone)) e.phone = 'Enter a phone number with country code.';
    }
    ui.formErr = e;
    if (Object.keys(e).length) { render(); toast(`Fix ${plural(Object.keys(e).length, 'field')} before saving`, { err: true }); const first = document.querySelector('.field.invalid input, .field.invalid select'); if (first) { first.scrollIntoView({ block: 'center' }); first.focus({ preventScroll: true }); } return; }
    const apply = () => {
      if (tab === 'general') { S.company = clone(f.company); S.billing = clone(f.billing); }
      if (tab === 'profile') S.profile = clone(f);
      if (tab === 'notifications') S.notifPrefs = clone(f);
      ui.dirty = false; persist(); toast('Changes saved');
    };
    if (tab === 'general') openConfirm({ title: 'Save company details?', message: 'Communities will see the updated details on new and open passes.', confirmText: 'Save changes', icon: 'building', onConfirm: apply });
    else if (tab === 'profile' && f.email !== S.profile.email) openConfirm({ title: 'Change your email?', message: `We'll send a confirmation link to ${f.email}. You'll sign in with the new address after confirming.`, confirmText: 'Save and send link', icon: 'mail', onConfirm: apply });
    else { apply(); render(); }
  },
  changePassword() {
    const P = ui.pw, e = {};
    if (!P.current) e.current = 'Enter your current password.';
    if (pwScore(P.next) < 4) e.next = 'Use at least 8 characters with upper and lower case letters, a number and a symbol.';
    if (P.next && P.confirm !== P.next) e.confirm = 'Passwords do not match.';
    if (!P.confirm) e.confirm = 'Confirm your new password.';
    ui.formErr = e;
    if (Object.keys(e).length) { render(); return; }
    openConfirm({ title: 'Change your password?', message: 'You will use the new password the next time you sign in.', confirmText: 'Change password', icon: 'key', onConfirm: () => { ui.pw = { current: '', next: '', confirm: '', show: false }; persist(); toast('Password changed'); } });
  },
  deactivate() { openConfirm({ title: 'Deactivate your account?', message: `${S.company.name} loses access to every community. Approved passes are cancelled.`, confirmText: 'Deactivate account', tone: 'danger', icon: 'alert', requireText: 'DEACTIVATE', onConfirm: () => toast('Account deactivation requested (preview)') }); },
  addCompanyDoc() { ui.modal = { type: 'companyDoc', data: { name: 'Letter of authority', fileObj: null, expiry: '', noExpiry: false } }; render(); },
  editCompanyDoc(t) { const d = S.companyDocs.find(x => x.id === t.dataset.id); ui.modal = { type: 'companyDoc', data: { id: d.id, name: d.name, fileObj: d.file ? { name: d.file } : null, expiry: d.expiry || '', noExpiry: !!d.noExpiry } }; render(); },
  saveCompanyDoc() {
    const m = ui.modal, d = m.data, errs = {};
    if (!d.fileObj) errs.file = 'Upload the file.'; else if (d.fileObj.status === 'checking') errs.file = 'Wait for the document check to finish.';
    if (!d.noExpiry && !d.expiry) errs.expiry = 'Enter the expiry date, or turn on “No expiry date”.';
    if (Object.keys(errs).length) { m.errs = errs; render(); return; }
    const rec = { name: d.name, file: d.fileObj.name, expiry: d.noExpiry ? '' : d.expiry, noExpiry: d.noExpiry };
    if (d.id) Object.assign(S.companyDocs.find(x => x.id === d.id), rec); else S.companyDocs.push(Object.assign({ id: uid('cd') }, rec));
    ui.modal = null; persist(); toast(`${d.name} saved`); render();
  },
  removeCompanyDoc(t) { const i = S.companyDocs.findIndex(x => x.id === t.dataset.id), d = S.companyDocs[i]; openConfirm({ title: `Remove ${d.name}?`, message: d.required ? 'This document is required by your communities. New passes may be rejected without it.' : 'Communities will no longer see this document.', confirmText: 'Remove document', tone: 'danger', onConfirm: () => { S.companyDocs.splice(i, 1); persist(); toast(`${d.name} removed`, { undo: () => { S.companyDocs.splice(i, 0, d); persist(); render(); } }); } }); },
};
const CHANGE = {
  sort(el) { ui.sort = el.value; render(); },
  peopleFilter(el) { ui.peopleFilter = el.value; render(); },
  helpRef(el) { ui.helpRef = el.value; },
  showPw(el) { ui.pw.show = el.checked; render(); },
  signMode(el) { ui.signMode = el.value; if (ui.modal) ui.modal.errs = null; render(); },
  async sigBg(el) { const d = ui.modal.data; d.removeBg = el.checked; d.upload = await processSig(d.orig, d.removeBg); render(); },
  twofa(el) {
    el.checked = S.twofa;
    if (S.twofa) openConfirm({ title: 'Turn off two-step verification?', message: 'Your account will be protected by your password only.', confirmText: 'Turn off', tone: 'danger', icon: 'shield', onConfirm: () => { S.twofa = false; persist(); toast('Two-step verification turned off'); } });
    else openConfirm({ title: 'Turn on two-step verification?', message: `We'll text a 6-digit code to ${S.profile.phone} each time you sign in on a new device.`, confirmText: 'Turn on', icon: 'shield', onConfirm: () => { S.twofa = true; persist(); toast('Two-step verification is on'); } });
  },
};

/* ================= Events ================= */
document.addEventListener('click', e => {
  const overlay = e.target.closest('[data-overlay]');
  if (overlay && e.target === overlay) { ui.modal = ui.modal && ui.modal.onCancel ? ui.modal.onCancel : null; render(); return; }
  const t = e.target.closest('[data-act],[data-go],[data-pop]');
  if (ui.pop && !e.target.closest('.pop-anchor') && !(t && t.dataset.act === 'rowMenu')) { ui.pop = null; if (!t) { render(); return; } }
  if (!t) return;
  if (t.tagName === 'LABEL' || (t.closest('label') && !t.dataset.act)) return;
  if (t.dataset.act === 'closeModal' && ui.modal && ui.modal.onCancel) { e.preventDefault(); ui.modal = ui.modal.onCancel; render(); return; }
  if (t.dataset.go) { e.preventDefault(); ui.pop = null; if (ui.modal) ui.modal = null; go(t.dataset.go); return; }
  if (t.dataset.pop) { e.preventDefault(); const k = t.dataset.pop; ui.pop = ui.pop === k ? null : k; ui.q = {}; render(); return; }
  if (t.dataset.act === 'comboPick') {
    e.preventDefault();
    const o = COMBOS[t.dataset.id], v = t.dataset.v, cur = getB(o.bind);
    if (Array.isArray(cur)) { setB(o.bind, cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v]); }
    else { setB(o.bind, v); ui.pop = null; }
    if (o.bind.startsWith('d.')) persistDraft(); else if (o.bind.startsWith('v.')) persist();
    render(); return;
  }
  if (t.dataset.act === 'comboRemove') { e.preventDefault(); const o = COMBOS[t.dataset.id]; setB(o.bind, getB(o.bind).filter(x => x !== t.dataset.v)); if (o.bind.startsWith('d.')) persistDraft(); render(); return; }
  if (t.dataset.act && ACT[t.dataset.act]) { e.preventDefault(); ACT[t.dataset.act](t, e); }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (ui.modal) { ui.modal = ui.modal.onCancel || null; render(); } else if (ui.pop) { ui.pop = null; render(); } }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="combobox"]')) { e.preventDefault(); e.target.click(); }
  if (e.key === 'Enter' && e.target.matches('.tl, .kpi')) e.target.click();
});
document.addEventListener('input', e => {
  const el = e.target;
  if (el.dataset.q) { ui.q[el.dataset.q] = el.value; if (el.dataset.q === 'community') { render(); return; } const o = COMBOS[el.dataset.q]; const list = document.getElementById(el.dataset.q + '-list'); if (o && list) list.innerHTML = comboList(o); return; }
  if (el.dataset.search) { ui.search[el.dataset.search] = el.value; if (el.dataset.search === 'workers') { document.getElementById('workers-list').innerHTML = selectRows('workers'); return; } render(); return; }
  if (el.dataset.ins) { ui.inspect[el.dataset.ins] = el.type === 'checkbox' ? el.checked : el.value; return; }
  if (el.dataset.bind && el.type !== 'checkbox' && el.type !== 'radio' && el.tagName !== 'SELECT' && el.type !== 'file') {
    setB(el.dataset.bind, el.value);
    onBound(el);
    if (el.id && el.id.startsWith('f-trips-')) render();
    if (el.dataset.signame !== undefined) { const s = document.getElementById('sig-typed'); if (s) s.textContent = el.value || ' '; }
    if (el.dataset.pwmeter !== undefined) { const s = pwScore(el.value); document.getElementById('pw-meter').dataset.s = el.value ? s : 0; const rules = [el.value.length >= 8, /[A-Z]/.test(el.value) && /[a-z]/.test(el.value), /\d/.test(el.value), /[^A-Za-z0-9]/.test(el.value)]; document.querySelectorAll('#pw-rules li').forEach((li, i) => { li.className = rules[i] ? 'ok' : ''; li.querySelector('svg').outerHTML = ic(rules[i] ? 'check' : 'info'); }); }
    if (el.dataset.require !== undefined) { const ok = document.getElementById('m-ok'); if (ok) ok.disabled = el.value !== ui.modal.requireText; }
  }
});
function onBound(el) {
  const b = el.dataset.bind;
  if (b.startsWith('d.')) persistDraft();
  else if (b.startsWith('v.')) persist();
  else if (b.startsWith('f.') && el.closest('[data-dirty]')) { ui.dirty = true; const sb = document.getElementById('savebar'); if (sb) sb.hidden = false; }
}
document.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset.change && CHANGE[el.dataset.change]) { CHANGE[el.dataset.change](el); return; }
  if (el.dataset.actChange === 'saveToCompany') {
    const k = el.dataset.key, doc = S.draft.docs[k], name = DOCS[k].name;
    el.checked = false;
    if (!doc.noExpiry && !doc.expiry) { toast('Enter the expiry date first, or turn on “No expiry date”.', { err: true }); return; }
    const existing = S.companyDocs.find(c => c.name === name);
    const save = () => { const rec = { file: doc.file.name, expiry: doc.noExpiry ? '' : doc.expiry, noExpiry: !!doc.noExpiry }; if (existing) Object.assign(existing, rec); else S.companyDocs.push(Object.assign({ id: uid('cd'), name }, rec)); doc.file.savedToCompany = true; persistDraft(); toast(`${name} saved to company documents`); };
    if (existing && existing.file) openConfirm({ title: `Replace your saved ${name}?`, message: `Company documents already has ${existing.file}. It will be replaced with ${doc.file.name}.`, confirmText: 'Replace saved copy', tone: 'warn', onConfirm: save });
    else { save(); render(); }
    return;
  }
  if (el.dataset.actChange === 'toggleSel') { const k = el.dataset.kind, arr = S.draft[k]; S.draft[k] = el.checked ? [...new Set([...arr, el.value])] : arr.filter(x => x !== el.value); persistDraft(); render(); return; }
  if (el.dataset.ins !== undefined && el.type === 'checkbox') { ui.inspect[el.dataset.ins] = el.checked; return; }
  if (el.dataset.insFile !== undefined && el.files[0]) { ui.inspect.photos = [...ui.inspect.photos, ...[...el.files].map(f => f.name)].slice(0, 5); el.value = ''; render(); return; }
  if (el.dataset.file) { handleFile(el.dataset.file, el.files[0]); el.value = ''; return; }
  if (el.dataset.bind) {
    if (el.type === 'checkbox') setB(el.dataset.bind, el.checked);
    else if (el.type === 'radio') { if (el.checked) setB(el.dataset.bind, el.value); }
    else if (el.tagName === 'SELECT' || el.type === 'date' || el.type === 'time') setB(el.dataset.bind, el.value);
    if (el.dataset.reset) { const base = el.dataset.bind.split('.').slice(0, -1).join('.'); el.dataset.reset.split(',').forEach(k => setB(base + '.' + k, '')); }
    if (el.dataset.bind.endsWith('.noExpiry') && el.checked) { const base = el.dataset.bind.replace(/\.noExpiry$/, '.expiry'); setB(base, ''); }
    onBound(el);
    if (el.hasAttribute('data-rerender') || el.closest('[data-rerender-all]')) render();
  }
});
/* ================= Signature upload ================= */
async function takeSigFile(file) {
  if (!file) return;
  if (!/^image\/(png|jpe?g)$/.test(file.type)) { toast('Use a PNG or JPG image of your signature.', { err: true }); return; }
  if (file.size > 2 * 1048576) { toast('This image is larger than 2 MB. Choose a smaller one.', { err: true }); return; }
  const orig = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(file); });
  try { const d = ui.modal.data; d.orig = orig; d.removeBg = true; d.upload = await processSig(orig, true); ui.modal.errs = null; render(); }
  catch (e) { toast(e.message, { err: true }); }
}
document.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset.sigfile !== undefined) { const f = el.files[0]; el.value = ''; takeSigFile(f); return; }
}, true);
document.addEventListener('drop', e => { const z = e.target.closest('[data-sigdrop]'); if (z) { e.preventDefault(); takeSigFile(e.dataTransfer.files[0]); } });
document.addEventListener('dragover', e => { if (e.target.closest('[data-sigdrop]')) e.preventDefault(); });
function handleFile(bind, file) {
  if (!file) return;
  if (file.size > 10 * 1048576) { toast(`${file.name} is larger than 10 MB. Choose a smaller file.`, { err: true }); return; }
  if (bind === 'f.company.logo') {
    if (!/^image\/(png|jpe?g|svg\+xml|webp|gif)$/.test(file.type)) { toast('Choose a PNG, JPG, SVG or WebP image.', { err: true }); return; }
    if (file.size > 5 * 1048576) { toast('This image is larger than 5 MB. Choose a smaller one.', { err: true }); return; }
    prepareLogo(file).then(logo => { ui.form.company.logo = logo; ui.dirty = true; render(); toast(`Logo ready on a ${logo.tone === 'light' ? 'dark' : 'light'} background. Save changes to apply.`); }).catch(e => toast(e.message, { err: true }));
    return;
  }
  if (!/\.(pdf|jpe?g|png)$/i.test(file.name)) { toast('Use a PDF, JPG or PNG file.', { err: true }); return; }
  const fileObj = { name: file.name, size: file.size, date: TODAY, status: 'checking', step: 0 };
  const [fileHost, fileKey] = bindSlot(bind);
  const target = expiryBindFor(bind);
  const [expHost, expKey] = target ? bindSlot(target) : [null, null];
  setB(bind, fileObj);
  if (bind.startsWith('d.')) persistDraft(); else if (bind.startsWith('f.')) ui.dirty = true;
  if (ui.modal && ui.modal.errs) delete ui.modal.errs.file;
  render();
  checkDocument(fileObj, bind).then(result => {
    if (fileHost[fileKey] !== fileObj) return; // replaced or removed while checking
    fileObj.status = 'done'; delete fileObj.step; fileObj.extracted = result;
    const noExp = expHost && expHost[expKey.replace(/expiry$/i, 'noExpiry')] === true;
    if (result.expiry && expHost && !noExp) expHost[expKey] = result.expiry;
    if (bind.startsWith('d.')) persistDraft(); else if (bind.startsWith('f.')) ui.dirty = true;
    render();
    toast(result.expiry ? `${file.name} checked. Expiry date filled in: ${fmt(result.expiry)}` : `${file.name} checked. Enter the expiry date yourself.`, { err: !result.expiry && !result.noExpOk });
  });
}
// The object and key a bind path points at, so async work can tell whether it is still current.
function bindSlot(b) {
  const { obj, path } = bindRoot(b);
  let o = obj;
  for (let i = 0; i < path.length - 1; i++) o = o[path[i]] ?? (o[path[i]] = {});
  return [o, path[path.length - 1]];
}
function expiryBindFor(bind) {
  const m = /^d\.docs\.(\w+)\.file$/.exec(bind);
  if (m) return `d.docs.${m[1]}.expiry`;
  if (bind === 'f.company.licence') return 'f.company.licenceExpiry';
  if (bind === 'm.fileObj' && ui.modal) return { person: 'm.idExpiry', vehicle: 'm.regExpiry', companyDoc: 'm.expiry' }[ui.modal.type] || null;
  return null;
}
/* Design preview of the document check. The live product sends the file to the expiry-extraction service
   and gets back { expiry: 'YYYY-MM-DD' | null }. Here the steps are timed and the date is made up. */
function checkDocument(fileObj, bind) {
  const tick = (ms, step) => new Promise(r => setTimeout(() => { if (fileObj.status === 'checking') { fileObj.step = step; render(); } r(); }, ms));
  return tick(700, 1).then(() => tick(800, 2)).then(() => new Promise(r => setTimeout(r, 900))).then(() => {
    const noExpOk = /docs\.(scope|drawings|hotwork|risk)\./.test(bind);
    if (noExpOk || /scope|drawing|method|statement|profile/i.test(fileObj.name)) return { expiry: null, noExpOk: true };
    let h = 0; for (const ch of fileObj.name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return { expiry: addDays(TODAY, 120 + (h % 640)), noExpOk: false };
  });
}
document.addEventListener('dragover', e => { const z = e.target.closest('[data-drop]'); if (z) { e.preventDefault(); z.classList.add('drag'); } });
document.addEventListener('dragleave', e => { const z = e.target.closest('[data-drop]'); if (z) z.classList.remove('drag'); });
document.addEventListener('drop', e => { const z = e.target.closest('[data-drop]'); if (z) { e.preventDefault(); handleFile(z.dataset.drop, e.dataTransfer.files[0]); } });
window.addEventListener('scroll', () => { if (ui.pop && ui.pop.startsWith('row:')) { ui.pop = null; render(); } }, { passive: true });
window.addEventListener('resize', () => { if (ui.pop && ui.pop.startsWith('row:')) { ui.pop = null; render(); } });

let bypass = false;
window.addEventListener('hashchange', () => {
  if (bypass) return;
  const next = route();
  if (handleLegacy(next)) return;
  if (ui.dirty && next !== current) {
    bypass = true; history.replaceState(null, '', '#' + current); bypass = false;
    openConfirm({ title: 'Leave without saving?', message: 'You have unsaved changes on this page. They will be lost.', confirmText: 'Leave page', tone: 'danger', cancelText: 'Stay on page', onConfirm: () => { ui.dirty = false; ui.form = null; location.hash = next; } });
    return;
  }
  current = next; closeAll(); window.scrollTo(0, 0); render();
  const main = document.getElementById('main'); if (main && !location.hash.startsWith('#settings')) main.focus?.({ preventScroll: true });
});
window.addEventListener('beforeunload', e => { if (ui.dirty) { e.preventDefault(); e.returnValue = ''; } });
// Start-up. If saved preview data can't be read (for example it was saved by an older version), reset it and start again.
try {
  if (!handleLegacy(route())) render();
} catch (err) {
  console.error('Preview start-up failed, resetting sample data', err);
  try { localStorage.removeItem(KEY); } catch (e) { /* storage blocked */ }
  S = null; S = seed(); ui.modal = null; ui.pop = null;
  try { render(); toast('Sample data was reset because the saved preview data could not be read.'); }
  catch (err2) { document.getElementById('app').innerHTML = `<div class="boot"><b>The preview could not start.</b><span>${esc(err2.message)}</span><span>Open this file in Chrome, Edge or Safari.</span></div>`; }
}
})();
