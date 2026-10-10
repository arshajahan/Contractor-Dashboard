/* Buzzin contractor portal — interactive redesign prototype.
   Plain JS, no build step. All data is sample data kept in this browser only. */
(() => {
'use strict';

/* ================= Utilities ================= */
// The PDF viewer runs on the page itself (vendor/pdf.worker.min.js is loaded as a script), so it also works from a local file.
if (window.pdfjsLib) window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js';
const TODAY = '2026-10-09';
const KEY = 'buzzin-redesign-v3';
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
  approved: ['Approved', 'ok'], inspection: ['Inspection requested', 'info'], completed: ['Completed', 'neutral'],
  expired: ['Expired', 'bad'], cancelled: ['Cancelled', 'neutral'],
};
const statusBadge = s => badge(...(STATUS[s] || [s, 'neutral']));
function btn(label, o = {}) {
  const v = o.v || 'secondary';
  const attrs = [o.go ? `data-go="${o.go}"` : '', o.act ? `data-act="${o.act}"` : '', o.id ? `data-id="${esc(o.id)}"` : '', o.pop ? `data-pop="${o.pop}"` : '', o.disabled ? 'disabled' : '', o.title ? `title="${esc(o.title)}" aria-label="${esc(o.title)}"` : '', o.attrs || ''].join(' ');
  return `<button type="button" class="btn btn-${v} ${o.sm ? 'btn-sm' : ''} ${o.icon && !label ? 'btn-icon' : ''} ${o.cls || ''}" ${attrs}>${o.icon ? ic(o.icon) : ''}${label ? esc(label) : ''}${o.iconR ? ic(o.iconR) : ''}</button>`;
}

/* ================= Reference data ================= */
const PERMIT_TYPES = [
  { id: 'general', name: 'General work permit', desc: 'Repairs, installations and general contractor work.', docs: ['scope'], optional: ['risk'] },
  { id: 'fitout', name: 'Minor fit-out work', desc: 'Partitions, flooring, ceilings and joinery.', docs: ['scope', 'drawings', 'car'], optional: ['risk'] },
  { id: 'maintenance', name: 'Maintenance work', desc: 'Planned or reactive maintenance, including AMC visits.', docs: ['scope'], optional: ['risk', 'amc'] },
  { id: 'hot', name: 'Hot work', desc: 'Welding, cutting, grinding or any open flame.', docs: ['scope', 'risk', 'hotwork'], optional: [] },
];
const typeOf = id => PERMIT_TYPES.find(t => t.id === id) || { id, name: id === 'visitor' ? 'Visitor pass' : 'Work permit', docs: [], optional: [] };
const DOCS = {
  scope: { name: 'Scope of Work Form', hint: 'Describe the tasks and exact work area. Use the community template.', template: true, noExp: true },
  risk: { name: 'Risk assessment', hint: 'Needed for work at height, noisy work, chemicals or electrical isolation.', template: true, noExp: true },
  drawings: { name: 'Approved layout drawings', hint: 'PDF of the approved layout with dimensions.', noExp: true },
  car: { name: 'Contractor all-risk insurance', hint: 'Must be valid for every work date.', noExp: false },
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
    materials: [], noMaterials: false, vehicles: [], noVehicles: false, trips: '', workers: [],
    docs: {}, ticks: {}, signer: { name: S ? S.profile.name : '', position: S ? S.profile.title : '', sig: null, auth: false }, consent: false, reached: 0, saved: TODAY,
  }, prefill || {});
}
function seed() {
  return {
    v: 3, community: 'buzzin', nextRef: 1049, nextVp: 2211,
    communities: [
      { id: 'buzzin', name: 'Buzzin community', area: 'Dubai Silicon Oasis', status: 'active', since: '2025-02-11', email: 'permits@buzzin-community.example' },
      { id: 'marina', name: 'Marina Gate', area: 'Dubai Marina', status: 'active', since: '2025-08-03', email: 'fm@marinagate.example' },
      { id: 'palm', name: 'Palm Views', area: 'Palm Jumeirah', status: 'active', since: '2026-01-19', email: 'security@palmviews.example' },
      { id: 'creek', name: 'Creek Residences', area: 'Dubai Creek Harbour', status: 'pending', since: null, email: '' },
    ],
    directory: ['Arabian Ranches Community', 'Business Bay Towers', 'City Walk Residences', 'Jumeirah Lake Towers', 'Motor City Villas', 'The Greens', 'Town Square'],
    permits: [
      { id: 'BZ-1048', community: 'buzzin', kind: 'work', title: 'HVAC maintenance', type: 'maintenance', property: 'Buzzin offices', units: ['Unit 101'], from: '2026-10-12', to: '2026-10-16', hours: '09:00–17:00', status: 'review', updated: '2026-10-08', workers: ['p1', 'p3'], vehicles: ['v1'], materials: 2, docs: ['Scope of Work Form', 'Risk assessment'] },
      { id: 'BZ-1042', community: 'buzzin', kind: 'work', title: 'Office fit-out', type: 'fitout', property: 'Buzzin offices', units: ['Unit 909'], from: '2026-10-14', to: '2026-10-28', hours: '08:00–18:00', status: 'changes', updated: '2026-10-07', workers: ['p2', 'p5'], vehicles: ['v2'], materials: 6, docs: ['Scope of Work Form', 'Approved layout drawings', 'Contractor all-risk insurance'], message: 'Please upload a revised Scope of Work Form that shows the exact work area. List any drilling or noisy work and the times it will happen.' },
      { id: 'BZ-1036', community: 'buzzin', kind: 'work', title: 'Electrical inspection', type: 'general', property: 'Buzzin offices', units: ['Unit 123'], from: '2026-10-09', to: '2026-10-13', hours: '09:00–17:00', status: 'approved', updated: '2026-10-05', workers: ['p3'], vehicles: [], materials: 1, docs: ['Scope of Work Form'] },
      { id: 'VP-2210', community: 'buzzin', kind: 'visitor', title: 'Site survey visit', type: 'visitor', property: 'Buzzin residences', units: ['Unit 305'], from: '2026-10-15', to: '2026-10-15', hours: '10:00–12:00', status: 'approved', updated: '2026-10-06', workers: ['p2'], vehicles: [], materials: 0, docs: [] },
      { id: 'BZ-1029', community: 'buzzin', kind: 'work', title: 'Plumbing repair', type: 'maintenance', property: 'Buzzin residences', units: ['Unit 204'], from: '2026-09-21', to: '2026-09-23', hours: '09:00–15:00', status: 'completed', updated: '2026-09-24', workers: ['p1'], vehicles: ['v1'], materials: 3, docs: ['Scope of Work Form'] },
      { id: 'BZ-1017', community: 'buzzin', kind: 'work', title: 'Glass partition installation', type: 'fitout', property: 'Buzzin offices', units: ['Unit 410'], from: '2026-08-10', to: '2026-08-20', hours: '08:00–18:00', status: 'expired', updated: '2026-08-21', workers: ['p2', 'p4'], vehicles: ['v3'], materials: 4, docs: ['Scope of Work Form'] },
      { id: 'BZ-1011', community: 'buzzin', kind: 'work', title: 'Kitchen exhaust cleaning', type: 'maintenance', property: 'Buzzin retail plaza', units: ['Retail R-03'], from: '2026-08-02', to: '2026-08-02', hours: '22:00–02:00', status: 'cancelled', updated: '2026-07-30', workers: ['p1'], vehicles: [], materials: 0, docs: [] },
      { id: 'MG-0310', community: 'marina', kind: 'work', title: 'Balcony waterproofing', type: 'general', property: 'Tower A', units: ['Apt 2104'], from: '2026-10-11', to: '2026-10-18', hours: '09:00–17:00', status: 'approved', updated: '2026-10-03', workers: ['p2'], vehicles: ['v2'], materials: 3, docs: ['Scope of Work Form'] },
      { id: 'MG-0305', community: 'marina', kind: 'work', title: 'AC duct cleaning', type: 'maintenance', property: 'Tower B', units: ['Apt 1502'], from: '2026-10-20', to: '2026-10-21', hours: '09:00–13:00', status: 'review', updated: '2026-10-08', workers: ['p1'], vehicles: ['v1'], materials: 1, docs: ['Scope of Work Form'] },
      { id: 'PV-0088', community: 'palm', kind: 'work', title: 'Pool pump replacement', type: 'maintenance', property: 'Villa cluster 3', units: ['Villa 14'], from: '2026-09-02', to: '2026-09-03', hours: '09:00–17:00', status: 'completed', updated: '2026-09-04', workers: ['p1'], vehicles: ['v1'], materials: 2, docs: ['Scope of Work Form'] },
    ],
    people: [
      { id: 'p1', name: 'Alex Morgan', role: 'HVAC technician', phone: '+971 50 000 0001', email: 'alex@samplecontracting.ae', idType: 'Emirates ID', idNo: '784-1990-1234567-1', idExpiry: '2027-03-31', file: 'alex-morgan-eid.pdf' },
      { id: 'p2', name: 'Priya Nair', role: 'Site supervisor', phone: '+971 50 000 0002', email: 'priya@samplecontracting.ae', idType: 'Emirates ID', idNo: '784-1988-7654321-2', idExpiry: '2027-08-14', file: 'priya-nair-eid.pdf' },
      { id: 'p3', name: 'Omar Haddad', role: 'Electrician', phone: '+971 50 000 0003', email: '', idType: 'Emirates ID', idNo: '784-1993-1122334-5', idExpiry: '2026-10-24', file: 'omar-haddad-eid.pdf' },
      { id: 'p4', name: 'Daniel Reyes', role: 'Helper', phone: '+971 50 000 0004', email: '', idType: 'Passport', idNo: 'P1234567', idExpiry: '2026-09-30', file: 'daniel-reyes-passport.pdf' },
      { id: 'p5', name: 'Hassan Ali', role: 'Painter', phone: '+971 50 000 0005', email: '', idType: 'Emirates ID', idNo: '784-1995-9988776-3', idExpiry: '2028-01-05', file: 'hassan-ali-eid.pdf' },
    ],
    vehicles: [
      { id: 'v1', plate: 'Dubai N 12345', type: 'Van', make: 'Toyota Hiace', color: 'White', regExpiry: '2027-02-28', file: 'mulkiya-12345.pdf' },
      { id: 'v2', plate: 'Sharjah 3 45821', type: 'Pickup', make: 'Nissan Navara', color: 'Silver', regExpiry: '2026-10-30', file: 'mulkiya-45821.pdf' },
      { id: 'v3', plate: 'Ajman B 7710', type: 'Truck', make: 'Isuzu NPR', color: 'White', regExpiry: '2026-09-15', file: 'mulkiya-7710.pdf' },
    ],
    company: { name: 'Sample Contracting', trn: '100000678922', licence: { name: 'trade-licence-2026.pdf', size: 412000 }, licenceExpiry: '2027-03-14', logo: true },
    billing: { legal: 'Sample Contracting FZCO', addr1: 'Dubai Silicon Oasis', addr2: 'Technohub 1', country: 'United Arab Emirates', state: 'Dubai', city: 'Dubai', postal: '00000' },
    profile: { name: 'Alex Morgan', email: 'alex@samplecontracting.ae', phone: '+971 50 000 0000', title: 'Operations manager', lang: 'English', tz: 'Asia/Dubai (GST, UTC+4)', datefmt: 'DD MMM YYYY' },
    companyDocs: [
      { id: 'cd1', name: 'Public liability insurance', expiry: '2026-10-28', file: 'pli-certificate-2026.pdf', required: true },
      { id: 'cd2', name: "Workmen's compensation insurance", expiry: '2027-01-31', file: 'wc-policy-2026.pdf', required: true },
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
      { id: 'n1', title: 'Changes requested on BZ-1042', body: 'Office fit-out needs a revised Scope of Work Form.', when: '2 h ago', go: 'permit-BZ-1042', unread: true },
      { id: 'n2', title: 'BZ-1036 approved', body: 'Your electrical inspection permit and QR codes are ready.', when: 'Yesterday', go: 'permit-BZ-1036', unread: true },
      { id: 'n3', title: 'Emirates ID expiring soon', body: "Omar Haddad's ID expires on 24 Oct 2026.", when: '2 days ago', go: 'people', unread: false },
      { id: 'n4', title: 'Insurance expiring soon', body: 'Public liability insurance expires on 28 Oct 2026.', when: '3 days ago', go: 'settings-documents', unread: false },
    ],
    draft: blankDraft({
      id: 'DRAFT-07', community: 'buzzin', property: 'Buzzin residences', units: ['Unit 101'], type: 'general', title: 'Painting work',
      description: 'Repaint living room and bedroom walls. No drilling or noisy work.', contact: 'Priya Nair', phone: '+971 50 000 0002',
      from: '2026-10-14', to: '2026-10-16',
      materials: [{ id: 'm1', name: 'Emulsion paint', kind: 'Material', qty: 6, unit: 'buckets', removed: 'Yes', notes: '' }, { id: 'm2', name: 'Step ladder', kind: 'Equipment', qty: 1, unit: 'pcs', removed: 'Yes', notes: '' }],
      vehicles: ['v1'], trips: '2', workers: ['p2', 'p5'], reached: 3, saved: TODAY,
      signer: { name: 'Alex Morgan', position: 'Operations manager', sig: null, auth: false },
    }),
    visitor: { name: '', company: 'Sample Contracting', phone: '', idType: 'Emirates ID', idNo: '', purpose: 'Site survey', unit: '', date: '', from: '10:00', to: '12:00', plate: '', notes: '' },
  };
}

/* ================= State ================= */
let S = null;
try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S = null; }
if (!S || S.v !== 3) S = seed();
const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); return true; } catch (e) { if (e && e.name === 'QuotaExceededError') toast('This browser is out of space for the preview. Use a smaller PDF.', { err: true }); return false; } };
const ui = { pop: null, popRect: null, q: {}, modal: null, drawer: false, tab: 'all', search: {}, filters: {}, errs: {}, form: null, formTab: null, dirty: false, formErr: {}, signMode: 'draw', page: 1, pw: { current: '', next: '', confirm: '', show: false }, theme: null };
try { ui.theme = localStorage.getItem('buzzin-theme'); } catch (e) { /* ignore */ }
const applyTheme = () => { if (ui.theme) document.documentElement.setAttribute('data-theme', ui.theme); else document.documentElement.removeAttribute('data-theme'); };
applyTheme();

const community = () => S.communities.find(c => c.id === S.community) || S.communities[0];
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
const seg = (name, bind, opts) => `<div class="segmented" role="radiogroup">${opts.map(([v, l]) => `<label><input type="radio" name="${name}" value="${v}" data-bind="${bind}" ${getB(bind) === v ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div>`;

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
  if (r.startsWith('admin')) return 'admin';
  return r;
}
function sidebar(r) {
  const nk = navKey(r);
  const action = passesHere().filter(p => p.status === 'changes').length;
  return `<div class="logo"><span class="wm">buzz<span>in</span></span><small>Contractor</small></div>
  <nav class="side-nav" aria-label="Main">${NAV.map(([g, items]) => `<div class="side-label">${g}</div>${items.map(([k, l, i]) => `<button class="nav-item ${nk === k ? 'active' : ''}" data-go="${k}" ${nk === k ? 'aria-current="page"' : ''}>${ic(i)}<span>${l}</span>${k === 'permits' && action ? `<span class="count" title="${action} need your action">${action}</span>` : ''}</button>`).join('')}`).join('')}</nav>
  <div class="side-foot">
    <div class="side-help"><strong>Need help with a pass?</strong><p>${esc(community().name)} reviews all requests. Include your pass reference when you contact them.</p>${btn('Contact community', { go: 'help', sm: true, icon: 'mail' })}</div>
    <div class="side-company"><div class="avatar navy">${initials(S.company.name)}</div><div><b>${esc(S.company.name)}</b>${esc(S.profile.name)} · ${esc(S.profile.title)}</div></div>
    <p class="preview-note">Design preview · sample data only</p>
  </div>`;
}
function communitySwitcher() {
  const c = community();
  const open = ui.pop === 'community';
  const q = (ui.q.community || '').toLowerCase();
  const list = S.communities.filter(x => !q || (x.name + x.area).toLowerCase().includes(q));
  return `<div class="pop-anchor">
    <button class="switcher" data-pop="community" aria-haspopup="listbox" aria-expanded="${open}" aria-label="Community: ${esc(c.name)}. Change community">
      <span class="mark">${ic('building')}</span><span class="txt"><small>Community</small><b>${esc(c.name)}</b></span>${ic('down', 'chev')}
    </button>
    ${open ? `<div class="popover wide" role="dialog" aria-label="Choose a community">
      <div class="pop-search">${ic('search')}<input id="community-q" data-q="community" placeholder="Search communities" value="${esc(ui.q.community || '')}" autocomplete="off"></div>
      <div class="pop-head"><span class="eyebrow">Your communities</span><span class="xs faint">${S.communities.filter(x => x.status === 'active').length} active</span></div>
      <div class="pop-list" id="community-list">${list.length ? list.map(x => `<button class="pop-item" data-act="switchCommunity" data-id="${x.id}" aria-selected="${x.id === c.id}" ${x.status !== 'active' ? 'disabled' : ''}>
        <span class="avatar" style="width:30px;height:30px;border-radius:8px;font-size:11px">${initials(x.name)}</span>
        <span class="grow">${esc(x.name)}<small>${esc(x.area)}${x.status === 'pending' ? ' · Access pending approval' : ''}</small></span>${x.id === c.id ? ic('check', 'tick') : ''}</button>`).join('') : `<div class="pop-empty">No community matches “${esc(ui.q.community)}”</div>`}</div>
      <div class="pop-sep"></div>
      <button class="pop-item" data-act="requestAccess">${ic('plus')}<span class="grow">Request access to a community</span></button>
      <button class="pop-item" data-go="settings-communities">${ic('gear')}<span class="grow">Manage communities</span></button>
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
    ${route().startsWith('admin') ? `<span class="badge badge-brand hide-sm"><i></i>Community admin view</span>` : btn('Request pass', { v: 'primary', sm: true, icon: 'plus', go: 'type', cls: 'hide-sm' })}
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
        <button class="pop-item" data-go="admin-forms">${ic('building')}<span class="grow">Community admin view<small>Design preview</small></span></button>
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
  const upcoming = P.filter(p => p.status === 'approved' && p.to >= TODAY).sort((a, b) => a.from.localeCompare(b.from));
  const recent = P.filter(p => !p.draft).sort((a, b) => b.updated.localeCompare(a.updated)).slice(0, 5);
  const kpi = (label, val, icon, tone, sub, go) => `<button class="kpi" data-act="kpi" data-id="${go}"><span class="top">${label}<span class="ic tone-${tone}">${ic(icon)}</span></span><span class="val">${val}</span><span class="sub">${sub}</span></button>`;
  const hour = 9;
  return `${pageHead(`Good ${hour < 12 ? 'morning' : 'afternoon'}, ${esc(S.profile.name.split(' ')[0])}`, `Here's what's happening at ${esc(community().name)} today, ${fmt(TODAY)}.`, btn('Request pass', { v: 'primary', icon: 'plus', go: 'type', cls: 'btn-hide-sm' }))}
  ${changes.map(p => alertBox('warn', `${esc(p.title)} needs changes`, `${esc(community().name)} asked for an update on ${p.id}. Your work can't start until you resubmit.`, btn('Review changes', { sm: true, go: 'permit-' + p.id }))).join('')}
  <div class="kpis">
    ${kpi('Active passes', n('approved'), 'pass', 'ok', `${upcoming.length} with upcoming work`, 'approved')}
    ${kpi('Under review', n('review') + n('inspection'), 'clock', 'info', 'Waiting for the community', 'review')}
    ${kpi('Needs your action', n('changes') + n('draft'), 'alert', 'warn', `${plural(n('changes'), 'change request')} · ${plural(n('draft'), 'draft')}`, 'action')}
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
    <td class="t-actions">${btn('', { v: 'ghost', sm: true, icon: 'more', act: 'rowMenu', id: p.id, title: `Actions for ${p.title}` })}</td>
  </tr>`).join('')}</tbody></table></div>`;
}
function rowMenuItems(p) {
  const it = (icon, label, attrs, danger) => `<button class="pop-item ${danger ? 'danger' : ''}" ${attrs}>${ic(icon)}<span class="grow">${label}</span></button>`;
  const out = [];
  if (p.draft) { out.push(it('edit', 'Resume draft', 'data-act="resumeDraft"')); out.push('<div class="pop-sep"></div>'); out.push(it('trash', 'Delete draft', 'data-act="discardDraft"', true)); return out.join(''); }
  out.push(it('eye', 'View details', `data-go="permit-${p.id}"`));
  if (p.status === 'changes') out.push(it('edit', 'Update and resubmit', `data-act="updatePermit" data-id="${p.id}"`));
  if (p.status === 'approved') { out.push(it('download', 'Download permit', `data-act="download" data-id="${p.id}"`)); if (p.kind === 'work') out.push(it('clipboard', 'Request final inspection', `data-go="completion-${p.id}"`)); }
  if (p.kind === 'work') out.push(it('copy', 'Duplicate as new request', `data-act="duplicate" data-id="${p.id}"`));
  out.push(it('mail', 'Contact community', 'data-go="help"'));
  if (['review', 'changes', 'approved'].includes(p.status)) { out.push('<div class="pop-sep"></div>'); out.push(it('x', p.status === 'approved' ? 'Cancel pass' : 'Withdraw request', `data-act="cancelPermit" data-id="${p.id}"`, true)); }
  return out.join('');
}
function pPermits() {
  const P = passesHere();
  const tabs = [['all', 'All'], ['action', 'Needs action'], ['review', 'Under review'], ['approved', 'Approved'], ['past', 'Past']];
  const inTab = (p, t) => t === 'all' || (t === 'action' ? ['changes', 'draft'].includes(p.status) : t === 'review' ? ['review', 'inspection'].includes(p.status) : t === 'past' ? ['completed', 'expired', 'cancelled'].includes(p.status) : p.status === t);
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
function pPermit(id) {
  const p = S.permits.find(x => x.id === id);
  if (!p) return pageHead('Pass not found', 'It may have been removed.', btn('Back to passes', { go: 'permits' }));
  const t = typeOf(p.type);
  const steps = [['Request submitted', 'Sent to ' + community().name, true], ['Community review', p.status === 'changes' ? 'Changes requested' : p.status === 'review' ? 'In progress' : 'Reviewed', !['review', 'changes'].includes(p.status)], ['Pass approved', 'Permit and QR codes issued', ['approved', 'inspection', 'completed', 'expired'].includes(p.status)], ['Work completed', 'Final inspection', p.status === 'completed']];
  const nowIdx = steps.findIndex(s => !s[2]);
  const actions = [];
  if (p.status === 'approved') { actions.push(btn('Download permit', { v: 'primary', icon: 'download', act: 'download', id: p.id })); if (p.kind === 'work') actions.push(btn('Request final inspection', { icon: 'clipboard', go: 'completion-' + p.id })); }
  if (p.status === 'changes') actions.push(btn('Update and resubmit', { v: 'primary', icon: 'edit', act: 'updatePermit', id: p.id }));
  actions.push(`<div class="pop-anchor">${btn('', { icon: 'more', act: 'rowMenu', id: p.id, title: 'More actions' })}</div>`);
  const workers = (p.workers || []).map(person).filter(Boolean);
  const vehicles = (p.vehicles || []).map(vehicle).filter(Boolean);
  return `${pageHead(`${esc(p.title)} ${statusBadge(p.status)}`, `<span class="mono">${p.id}</span> · ${esc(t.name)} · Last updated ${fmt(p.updated)}`, actions.join(''), [['Authorized passes', 'permits'], [p.id]])}
  ${p.status === 'changes' ? alertBox('warn', 'Changes requested by ' + esc(community().name), esc(p.message), btn('Update and resubmit', { sm: true, act: 'updatePermit', id: p.id })) : ''}
  ${p.status === 'approved' ? alertBox('ok', 'Approved. Your pass is ready.', 'Show the QR code at the gate. Follow the work dates, hours and conditions on the permit.') : ''}
  ${p.status === 'review' ? alertBox('info', 'Waiting for community review', 'You will get an email and a notification when the community responds. Work can start only after approval.') : ''}
  <div class="layout-main">
    <div class="stack">
      ${card('Work details', `<dl class="dl">
        <dt>Pass type</dt><dd>${esc(t.name)}</dd>
        <dt>Location</dt><dd>${esc(p.property)} · ${esc(p.units.join(', '))}</dd>
        <dt>Work dates</dt><dd>${range(p.from, p.to)}</dd>
        <dt>Daily hours</dt><dd>${esc(p.hours || '—')}</dd>
        <dt>Materials</dt><dd>${p.materials ? plural(p.materials, 'item') : 'None'}</dd>
      </dl>`)}
      ${card('Workers & vehicles', `${workers.map(w => `<div class="list-row"><span class="avatar">${initials(w.name)}</span><span class="grow"><b>${esc(w.name)}</b><span>${esc(w.role)} · ${esc(w.idType)}</span></span>${badge(expiry(w.idExpiry).label, expiry(w.idExpiry).tone)}</div>`).join('')}${vehicles.map(v => `<div class="list-row"><span class="ic tone-neutral">${ic('car')}</span><span class="grow"><b>${esc(v.plate)}</b><span>${esc(v.make)} · ${esc(v.color)}</span></span>${badge(expiry(v.regExpiry).label, expiry(v.regExpiry).tone)}</div>`).join('')}${!workers.length && !vehicles.length ? '<p class="muted small" style="padding:12px">No workers or vehicles on this pass.</p>' : ''}`, { tight: true })}
      ${card('Documents', (p.docs || []).length ? p.docs.map(d => `<div class="list-row"><span class="ic tone-bad" style="font-size:10px;font-weight:800">PDF</span><span class="grow"><b>${esc(d)}</b><span>Submitted ${fmt(p.updated)}</span></span>${btn('', { v: 'ghost', sm: true, icon: 'download', act: 'download', id: d, title: 'Download ' + d })}</div>`).join('') : '<p class="muted small" style="padding:12px">No documents were needed.</p>', { tight: true })}
    </div>
    <div class="stack">
      ${p.status === 'approved' ? card('Entry QR code', `<div class="row" style="gap:16px;flex-wrap:nowrap"><div class="qr">${qrSvg(p.id)}</div><div class="stack-sm"><p class="small muted">One code covers the permit. Each worker also gets a personal code by SMS.</p>${btn('Share codes', { sm: true, icon: 'send', act: 'shareCodes', id: p.id })}</div></div><p class="xs faint">Design placeholder. This is not a real access code.</p>`) : ''}
      ${card('Progress', `<div class="timeline">${steps.map((s, i) => `<div class="tl ${s[2] ? 'done' : i === nowIdx && !['cancelled', 'expired'].includes(p.status) ? 'now' : ''}"><span class="dot">${s[2] ? ic('check') : ''}</span><div class="grow"><b>${s[0]}</b><span>${s[1]}</span></div></div>`).join('')}</div>`)}
      ${card('Questions?', `<p class="small muted">Contact ${esc(community().name)} and quote <span class="mono">${p.id}</span>.</p><div class="row">${btn('Copy reference', { sm: true, icon: 'copy', act: 'copy', id: p.id })}${btn('Contact community', { sm: true, v: 'ghost', go: 'help' })}</div>`)}
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
  }
  if (step === 'materials' && !d.noMaterials && !d.materials.length) e.materials = 'Add at least one item, or turn on “No materials or equipment”.';
  if (step === 'workvehicles' && !d.noVehicles && !d.vehicles.length) e.vehicles = 'Select a vehicle, or turn on “No vehicles needed”.';
  if (step === 'personnel') {
    if (!d.workers.length) e.workers = 'Select at least one worker.';
    const bad = d.workers.map(person).filter(p => p && p.idExpiry < TODAY);
    if (bad.length) e.workers = `${bad.map(p => p.name).join(', ')}: ID has expired. Upload the renewed ID or remove the worker.`;
  }
  if (step === 'documents') {
    typeOf(d.type).docs.forEach(k => {
      const doc = d.docs[k] || {};
      if (!doc.file) e['doc-' + k] = `Upload the ${DOCS[k].name}.`;
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
function pDetails() {
  const d = S.draft, E = k => errOf('details', k);
  const t = typeOf(d.type);
  return wizard('details', `
  ${card('Location', `<div class="grid-2">
    ${combo({ id: 'f-community', label: 'Community', req: true, bind: 'd.community', options: S.communities.filter(c => c.status === 'active').map(c => ({ value: c.id, label: c.name, meta: c.area })), searchPh: 'Search communities', err: E('community') })}
    ${F({ id: 'f-property', label: 'Building', req: true, bind: 'd.property', options: PROPERTIES, ph: 'Choose a building', err: E('property') })}
    ${combo({ id: 'f-units', label: 'Units', req: true, bind: 'd.units', options: UNITS.map(u => ({ value: u, label: u })), ph: 'Search and select units', searchPh: 'Search units', full: true, err: E('units'), hint: 'Add more than one unit only if the same work happens in each.' })}
  </div>`)}
  ${card('Permit type', `<div class="choice-grid" role="radiogroup" aria-label="Permit type">${PERMIT_TYPES.map(x => `<label class="choice"><input type="radio" name="ptype" value="${x.id}" data-bind="d.type" data-rerender ${d.type === x.id ? 'checked' : ''}><span class="radio"></span><span class="grow"><b>${x.name}</b><small>${x.desc}</small><small class="faint">${plural(x.docs.length, 'required document')}</small></span></label>`).join('')}</div>
    ${alertBox('info', `${t.name} needs: ${t.docs.map(k => DOCS[k].name).join(', ')}`, t.optional.length ? `May also be requested: ${t.optional.map(k => DOCS[k].name).join(', ')}.` : '', btn('Checklist & templates', { sm: true, act: 'checklist' }))}`)}
  ${card('About the work', `<div class="grid-2">
    ${F({ id: 'f-title', label: 'Work title', req: true, bind: 'd.title', ph: 'For example, Painting work', err: E('title') })}
    ${F({ id: 'f-contact', label: 'Site contact', req: true, bind: 'd.contact', ph: 'Name of the person on site', err: E('contact'), attrs: 'list="people-list"' })}
    ${F({ id: 'f-description', label: 'Description', opt: true, bind: 'd.description', type: 'textarea', full: true, ph: 'Main tasks, noisy work, drilling, areas affected', hint: 'Mention any noisy work, drilling or water/power shutdowns.' })}
    ${F({ id: 'f-phone', label: 'Contact phone', req: true, bind: 'd.phone', type: 'tel', ph: '+971 50 000 0000', err: E('phone') })}
    <div class="field"><span class="label">Annual maintenance contract?</span>${seg('amc', 'd.amc', [['no', 'No'], ['yes', 'Yes']])}<span class="hint">Choose Yes if this work is covered by an AMC.</span></div>
  </div><datalist id="people-list">${S.people.map(p => `<option value="${esc(p.name)}">`).join('')}</datalist>`)}
  ${card('Dates & hours', `<div class="grid-2">
    ${F({ id: 'f-from', label: 'Start date', req: true, bind: 'd.from', type: 'date', err: E('from'), attrs: `min="${addDays(TODAY, 2)}"`, hint: `Earliest start: ${fmt(addDays(TODAY, 2))}` })}
    ${F({ id: 'f-to', label: 'End date', req: true, bind: 'd.to', type: 'date', err: E('to'), attrs: `min="${d.from || addDays(TODAY, 2)}"` })}
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
    return S.vehicles.map(v => { const e = expiry(v.regExpiry); const blocked = e.tone === 'bad'; return `<label class="select-row ${blocked ? 'disabled' : ''}"><input type="checkbox" data-act-change="toggleSel" data-kind="vehicles" value="${v.id}" ${d.vehicles.includes(v.id) ? 'checked' : ''} ${blocked ? 'disabled' : ''}><span class="ic tone-neutral" style="width:34px;height:34px;border-radius:8px;display:grid;place-items:center">${ic('car')}</span><span class="grow"><b>${esc(v.plate)}</b><span>${esc(v.make)} · ${esc(v.type)} · ${esc(v.color)}</span></span>${badge(e.label, e.tone)}${blocked ? btn('Renew', { v: 'link', act: 'editVehicle', id: v.id, cls: 'small' }) : ''}</label>`; }).join('');
  }
  const q = (ui.search.workers || '').toLowerCase();
  return S.people.filter(p => !q || (p.name + p.role + p.idNo).toLowerCase().includes(q)).map(p => { const e = expiry(p.idExpiry); const blocked = e.tone === 'bad'; return `<label class="select-row ${blocked ? 'disabled' : ''}"><input type="checkbox" data-act-change="toggleSel" data-kind="workers" value="${p.id}" ${d.workers.includes(p.id) ? 'checked' : ''} ${blocked ? 'disabled' : ''}><span class="avatar">${initials(p.name)}</span><span class="grow"><b>${esc(p.name)}</b><span>${esc(p.role)} · ${esc(p.idType)} ${esc(p.idNo)}</span></span>${badge(e.label, e.tone)}${blocked ? btn('Update ID', { v: 'link', act: 'editPerson', id: p.id, cls: 'small' }) : ''}</label>`; }).join('') || emptyState('search', 'No one matches', 'Try another name.');
}
function pVehiclesStep() {
  const d = S.draft;
  return wizard('workvehicles', expiryAlert(expiryWarnings(d, 'vehicles')) + card('Vehicles for this work', `
    ${sw('f-vehicles', 'd.noVehicles', 'No vehicles needed', 'Turn on if workers arrive on foot or by public transport.')}
    ${d.noVehicles ? '' : `<div class="stack-sm">${selectRows('vehicles')}</div>
    <div class="row between"><div style="max-width:240px">${F({ id: 'f-trips', label: 'Expected trips', opt: true, bind: 'd.trips', type: 'number', attrs: 'min="1"' })}</div>${btn('Add a vehicle', { icon: 'plus', act: 'addVehicle' })}</div>`}
    ${errOf('workvehicles', 'vehicles') ? `<span class="err" id="f-vehicles-err">${ic('alert')}${errOf('workvehicles', 'vehicles')}</span>` : ''}`));
}
function pPersonnel() {
  const d = S.draft;
  return wizard('personnel', expiryAlert(expiryWarnings(d, 'workers')) + card('Workers on site', `
    <div class="row between"><div class="search grow" style="max-width:360px">${ic('search')}<input class="input" id="f-workers" data-search="workers" placeholder="Search employees" value="${esc(ui.search.workers || '')}" aria-label="Search employees"></div>${btn('Add employee', { icon: 'plus', act: 'addPerson' })}</div>
    <div class="stack-sm" id="workers-list">${selectRows('workers')}</div>
    <div class="row between"><span class="small muted"><b>${d.workers.length}</b> selected · Community limit 12 per pass</span>${d.workers.length ? btn('Clear selection', { v: 'ghost', sm: true, act: 'clearWorkers' }) : ''}</div>
    ${errOf('personnel', 'workers') ? `<span class="err">${ic('alert')}${esc(errOf('personnel', 'workers'))}</span>` : ''}`));
}
function uploader({ key, bind, label, accept = '.pdf,.jpg,.jpeg,.png', file }) {
  const id = 'up-' + key;
  return file && file.name
    ? `<div class="file-row"><span class="ic">${/\.(png|jpe?g)$/i.test(file.name) ? 'IMG' : 'PDF'}</span><span class="grow"><b>${esc(file.name)}</b><span>${sizeTxt(file.size) || 'Uploaded'} · Uploaded ${fmt(file.date || TODAY)}</span></span>${btn('', { v: 'ghost', sm: true, icon: 'eye', act: 'previewFile', id: file.name, title: 'Preview' })}<label class="btn btn-ghost btn-sm" for="${id}">Replace</label>${btn('', { v: 'danger-ghost', sm: true, icon: 'trash', act: 'removeFile', id: bind, title: 'Remove ' + file.name, attrs: `data-label="${esc(label)}"` })}<input class="file-input" type="file" id="${id}" accept="${accept}" data-file="${bind}"></div>`
    : `<label class="dropzone" for="${id}" data-drop="${bind}"><span class="ic">${ic('upload')}</span><b>Upload ${esc(label)}</b><span class="xs faint">Drag a file here or click to choose · PDF, JPG or PNG · Max 10 MB</span><input class="file-input" type="file" id="${id}" accept="${accept}" data-file="${bind}"></label>`;
}
function docCard(k, required) {
  const d = S.draft;
  d.docs[k] = d.docs[k] || { file: null, expiry: '', noExpiry: false };
  const doc = d.docs[k], meta = DOCS[k], err = errOf('documents', 'doc-' + k);
  return card(`${meta.name} ${required ? badge('Required', 'brand') : badge('Optional')}`, `
    <p class="small muted" style="margin-top:-4px">${meta.hint}</p>
    <div id="f-doc-${k}" tabindex="-1">${uploader({ key: k, bind: `d.docs.${k}.file`, label: meta.name, file: doc.file })}</div>
    <div class="grid-2" style="align-items:end">
      ${F({ id: `doc-${k}-exp`, label: 'Expiry date', bind: `d.docs.${k}.expiry`, type: 'date', disabled: doc.noExpiry, hint: doc.noExpiry ? 'Not needed. This document has no expiry date.' : 'Use the date printed on the document.' })}
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
function sigPreview(placement, signer, admin) {
  const A = SIG_AREA[placement], g = signer || {};
  const style = `left:${A.left}%;top:${A.top}%;width:${A.width}%;height:${A.height}%`;
  if (admin || !g.sig) return `<div class="pdf-sig" style="${style}"><span class="ph">${admin ? 'Signature block: company, name, position, date and signature are added here' : 'Your name, position and signature are added here when you sign'}</span></div>`;
  return `<div class="pdf-sig signed" style="${style}"><div class="lines">${[['Company', S.company.name], ['Name', g.name], ['Position', g.position], ['Date', fmt(TODAY)]].map(([k, v]) => `<span><i>${k}</i><b>${esc(v || '—')}</b></span>`).join('')}</div><img src="${g.sig.data}" alt="Signature"></div>`;
}
function boxHtml(f, o, n) {
  const style = `left:${f.x}%;top:${f.y}%;width:${f.size}%`;
  if (o.admin) return `<button type="button" class="pdf-box admin ${o.sel === f.id ? 'sel' : ''}" data-box="${f.id}" style="${style}" aria-label="Tick box ${n}: ${esc(f.label)}"><span class="pdf-box-n">${n}</span></button>`;
  const on = !!(o.ticks && o.ticks[f.id]);
  return `<button type="button" class="pdf-box ${on ? 'on' : ''} ${o.showErr && f.required && !on ? 'err' : ''}" role="checkbox" aria-checked="${on}" aria-label="${esc(f.label)}" title="${esc(f.label)}" data-act="tickBox" data-form="${o.formKey}" data-id="${f.id}" id="box-${o.formKey.replace(/\W/g, '')}-${f.id}" style="${style}">${ic('check')}</button>`;
}
function pdfDoc(pages, fields, o) {
  const n = pages.length + (o.placement === 'newpage' ? 1 : 0);
  const page = (pg, i) => `<div class="pdf-page" style="aspect-ratio:${pg.w}/${pg.h}" ${o.admin ? `data-admin-page="${i + 1}"` : ''}><img src="${pg.src}" alt="Page ${i + 1} of ${n}" draggable="false">${fields.filter(f => f.page === i + 1).map(f => boxHtml(f, o, fields.indexOf(f) + 1)).join('')}${o.placement === 'bottom' && i === pages.length - 1 ? sigPreview('bottom', o.signer, o.admin) : ''}<span class="pdf-pno">${i + 1} / ${n}</span></div>`;
  const extra = o.placement === 'newpage' ? `<div class="pdf-page blank" style="aspect-ratio:${pages[0].w}/${pages[0].h}"><div class="pdf-newpage-head"><b>Contractor declaration</b><span>Signed for and on behalf of the contractor. Completed electronically through the Buzzin contractor portal.</span></div>${sigPreview('newpage', o.signer, o.admin)}<span class="pdf-pno">${n} / ${n}</span></div>` : '';
  return `<div class="pdf-doc ${o.admin ? 'admin' : ''}">${pages.map(page).join('')}${extra}</div>`;
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
async function readPdf(file) {
  if (!file) return null;
  if (!/\.pdf$/i.test(file.name) && file.type !== 'application/pdf') throw new Error('Choose a PDF file.');
  if (file.size > 4 * 1048576) throw new Error('This PDF is larger than 4 MB. Choose a smaller file for this preview.');
  const u = new Uint8Array(await file.arrayBuffer());
  if (String.fromCharCode(u[0], u[1], u[2], u[3]) !== '%PDF') throw new Error('This file is not a valid PDF.');
  return { pdf: bytesToB64(u), fileName: file.name, size: file.size };
}

/* ================= Community admin (design preview) ================= */
const pubSubset = x => ({ name: x.name, pdf: x.pdf, fields: x.fields, appliesTo: [...x.appliesTo].sort(), placement: x.placement });
function formStatus(f) {
  if (!f.published) return ['Not published', 'neutral'];
  return JSON.stringify(pubSubset(f)) === JSON.stringify(pubSubset(f.published)) ? [`Published · v${f.published.version}`, 'ok'] : ['Unpublished changes', 'warn'];
}
const curAdminForm = () => S.forms.find(x => x.id === route().slice(11));
function adminSidebar() {
  return `<div class="logo"><span class="wm">buzz<span>in</span></span><small>Community admin</small></div>
  <nav class="side-nav" aria-label="Admin"><div class="side-label">${esc(community().name)}</div><button class="nav-item active" data-go="admin-forms" aria-current="page">${ic('file')}<span>Permit forms</span></button></nav>
  <div class="side-foot"><div class="side-help"><strong>Community admin view</strong><p>Design preview of the side community staff use. In the live product it has its own login.</p>${btn('Back to contractor portal', { go: 'home', sm: true, icon: 'arrowL' })}</div></div>`;
}
function pAdminForms() {
  const list = S.forms.filter(f => f.community === S.community);
  return `${pageHead('Permit forms', `Documents contractors read and sign before ${esc(community().name)} reviews a work permit.`, btn('Upload PDF form', { v: 'primary', icon: 'upload', act: 'adminNewForm' }))}
  ${alertBox('info', 'How it works', 'Upload your terms or guidelines as a PDF. Click next to each clause to place a tick box, choose which permit types need it, then publish. Contractors tick every box, enter their name and position, and draw or upload a signature. It is stamped with the date at the bottom of the document.')}
  ${list.length ? card('', `<div class="table-wrap"><table class="table responsive"><thead><tr><th>Form</th><th>Required for</th><th>Tick boxes</th><th>Status</th><th class="t-actions"><span class="sr">Actions</span></th></tr></thead><tbody>${list.map(f => { const [l, t] = formStatus(f); return `<tr class="clickable" data-go="admin-form-${f.id}"><td><div class="t-main"><b>${esc(f.name)}</b><span>${esc(f.fileName)} · Updated ${fmt(f.updated)}</span></div></td><td data-m="sub">${f.appliesTo.length === PERMIT_TYPES.length ? 'All work permits' : f.appliesTo.map(id => typeOf(id).name).join(', ') || 'None'}</td><td data-m="hide" class="num">${f.fields.length}</td><td data-m="side">${badge(l, t)}</td><td class="t-actions">${btn('Edit', { v: 'ghost', sm: true, go: 'admin-form-' + f.id })}${btn('', { v: 'ghost', sm: true, icon: 'trash', act: 'adminDeleteForm', id: f.id, title: 'Delete ' + f.name })}</td></tr>`; }).join('')}</tbody></table></div>`, { raw: true })
    : card('', emptyState('file', 'No forms yet', 'Upload your contractor terms as a PDF to get started.', btn('Upload PDF form', { v: 'primary', sm: true, icon: 'upload', act: 'adminNewForm' })))}`;
}
function pAdminForm(id) {
  const f = S.forms.find(x => x.id === id);
  if (!f) return pageHead('Form not found', 'It may have been deleted.', btn('Back to forms', { go: 'admin-forms' }));
  const [sl, st] = formStatus(f), sel = f.fields.find(x => x.id === ui.adminSel), key = `admin:${f.id}:${f.pdfRev || 0}`, r = pdfPages(key, f.pdf), mode = ui.adminMode || 'add';
  return `${pageHead(`${esc(f.name)} ${badge(sl, st)}`, `${esc(f.fileName)} · ${plural(f.fields.length, 'tick box', 'tick boxes')}`, btn('Replace PDF', { icon: 'refresh', act: 'adminReplace', id: f.id }) + `<input class="file-input" type="file" id="admin-replace" accept="application/pdf,.pdf" data-adminpdf="${f.id}">` + btn(f.published ? 'Publish changes' : 'Publish', { v: 'primary', icon: 'send', act: 'adminPublish', id: f.id }), [['Permit forms', 'admin-forms'], [f.name]])}
  <div class="layout-main admin-editor">
    <section class="card">
      <div class="toolbar"><div class="segmented" role="radiogroup" aria-label="Editing mode">${[['add', 'Add tick box'], ['move', 'Select & move']].map(([k, l]) => `<label><input type="radio" name="amode" value="${k}" data-change="adminMode" ${mode === k ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div><span class="small muted">${mode === 'add' ? 'Click next to a clause to place a tick box. Drag a box to move it.' : 'Drag a tick box to move it. Click one to edit it. Arrow keys nudge it.'}</span></div>
      ${r.pages ? pdfDoc(r.pages, f.fields, { admin: true, sel: ui.adminSel, placement: f.placement }) : `<div class="card-body">${docState(key, f.pdf)}</div>`}
    </section>
    <div class="stack admin-side">
      ${sel ? card(`Tick box ${f.fields.indexOf(sel) + 1}`, `${F({ id: 'af-label', label: 'What the contractor agrees to', value: sel.label, attrs: 'data-afield="label"', hint: 'Shown on hover, read by screen readers and listed in the review.' })}
        <label class="switch" for="af-req"><input type="checkbox" id="af-req" data-afield="required" ${sel.required ? 'checked' : ''}><span class="track"></span><span class="txt"><b>Required</b><small>Contractors cannot submit until it is ticked.</small></span></label>
        <div class="field"><span class="label">Size</span><div class="segmented" role="radiogroup">${[['2.2', 'Small'], ['2.8', 'Medium'], ['3.6', 'Large']].map(([v, l]) => `<label><input type="radio" name="af-size" value="${v}" data-afield="size" ${Math.abs(sel.size - Number(v)) < 0.3 ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div></div>`,
        { action: btn('Delete', { v: 'danger-ghost', sm: true, icon: 'trash', act: 'adminDeleteField', id: sel.id }) }) : ''}
      ${card('Form details', `${F({ id: 'af-name', label: 'Name contractors see', value: f.name, attrs: 'data-aform="name"' })}`)}
      ${card('Tick boxes', f.fields.length ? f.fields.map((x, i) => `<button class="list-row ${x.id === ui.adminSel ? 'sel' : ''}" style="width:100%;text-align:left" data-act="adminSelect" data-id="${x.id}"><span class="ic tone-${x.id === ui.adminSel ? 'info' : 'neutral'}" style="font-weight:700;font-size:12px">${i + 1}</span><span class="grow"><b class="small">${esc(x.label)}</b><span>Page ${x.page} · ${x.required ? 'Required' : 'Optional'}</span></span></button>`).join('') : '<p class="small muted" style="padding:12px">No tick boxes yet. Click on the document next to a clause to add one.</p>', { tight: true })}
      ${card('Signature', `<div class="stack-sm">${[['bottom', 'Bottom of the last page', 'Use when the PDF leaves space at the end, like the sample.'], ['newpage', 'Add a new last page', 'Use when the PDF has no free space.']].map(([v, l, h]) => `<label class="choice"><input type="radio" name="af-place" value="${v}" data-aform="placement" ${f.placement === v ? 'checked' : ''}><span class="radio"></span><span class="grow"><b>${l}</b><small>${h}</small></span></label>`).join('')}</div><p class="xs faint">Contractors type their name and position, then draw or upload a signature. Company name and date are added automatically.</p>`)}
      ${card('Required for', `<div class="stack-sm">${PERMIT_TYPES.map(t => `<label class="check"><input type="checkbox" data-aform="appliesTo" value="${t.id}" ${f.appliesTo.includes(t.id) ? 'checked' : ''}>${t.name}</label>`).join('')}</div>`)}
      ${card('', `<div class="row between"><span class="small muted">Stop asking contractors to sign this form.</span>${btn('Delete form', { v: 'danger-ghost', sm: true, icon: 'trash', act: 'adminDeleteForm', id: f.id })}</div>`)}
    </div>
  </div>`;
}
function pReview() {
  const d = S.draft, t = typeOf(d.type);
  const sec = (title, step, rows) => card(title, `<dl class="dl">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v || '<span class="faint">Not provided</span>'}</dd>`).join('')}</dl>`, { action: btn('Edit', { v: 'ghost', sm: true, icon: 'edit', act: 'gotoStep', id: step }) });
  const docs = t.docs.concat(t.optional).filter(k => d.docs[k] && d.docs[k].file).map(k => `${DOCS[k].name} <span class="faint">· ${d.docs[k].noExpiry ? 'No expiry' : 'Valid to ' + fmt(d.docs[k].expiry)}</span>`).join('<br>');
  return wizard('review', `${expiryAlert(expiryWarnings(d))}${alertBox('info', 'Submitting does not approve your request', `${esc(community().name)} reviews every request. Work can start only after approval.`)}
    ${sec('Work details', 'details', [['Community', esc(community().name)], ['Location', esc([d.property, d.units.join(', ')].filter(Boolean).join(' · '))], ['Permit type', esc(t.name)], ['Work', esc(d.title)], ['Description', esc(d.description)], ['Site contact', esc([d.contact, d.phone].filter(Boolean).join(' · '))], ['Dates', d.from ? range(d.from, d.to) + ` · ${d.start}–${d.end}` : ''], ['AMC', d.amc === 'yes' ? 'Yes' : 'No']])}
    ${sec('Materials', 'materials', [['Items', d.noMaterials ? 'None' : d.materials.map(m => `${esc(m.name)} × ${m.qty} ${esc(m.unit)}`).join('<br>')]])}
    ${sec('Vehicles', 'workvehicles', [['Vehicles', d.noVehicles ? 'None' : d.vehicles.map(vehicle).filter(Boolean).map(v => esc(v.plate + ' · ' + v.make)).join('<br>')], ['Expected trips', esc(d.trips)]])}
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
  const p = S.permits.find(x => x.id === id) || S.permits.find(x => x.status === 'approved' && x.kind === 'work');
  if (!p) return pageHead('No approved permit', '', btn('Back', { go: 'permits' }));
  if (!ui.inspect || ui.inspect.id !== p.id) ui.inspect = { id: p.id, date: addDays(TODAY, 3), time: '10:00', notes: 'Work completed and the area has been cleaned.', c0: true, c1: false, c2: false, photos: null };
  const I = ui.inspect;
  return `${pageHead('Request final inspection', `${esc(p.title)} · <span class="mono">${p.id}</span>`, '', [['Authorized passes', 'permits'], [p.id, 'permit-' + p.id], ['Final inspection']])}
  ${alertBox('info', 'Tell the community when the work is finished', 'The community will confirm a time with your site contact. Your permit closes after a successful inspection.')}
  ${card('Inspection details', `<div class="grid-2">
    ${F({ id: 'i-date', label: 'Preferred date', req: true, type: 'date', value: I.date, attrs: `data-ins="date" min="${TODAY}"` })}
    ${F({ id: 'i-time', label: 'Preferred time', type: 'time', value: I.time, attrs: 'data-ins="time"' })}
    ${F({ id: 'i-notes', label: 'Completion notes', type: 'textarea', value: I.notes, full: true, attrs: 'data-ins="notes"' })}
  </div>
  <div class="stack-sm"><span class="label">Before you request</span>${['All tools and materials removed', 'Common areas cleaned and debris removed', 'Snagging items fixed'].map((l, i) => `<label class="check"><input type="checkbox" data-ins="c${i}" ${I['c' + i] ? 'checked' : ''}>${l}</label>`).join('')}</div>
  <div class="stack-sm"><span class="label">Completion photos <span class="opt">(optional)</span></span>${I.photos ? `<div class="file-row"><span class="ic">IMG</span><span class="grow"><b>${esc(I.photos)}</b><span>Ready to send</span></span>${btn('', { v: 'danger-ghost', sm: true, icon: 'trash', act: 'removeInspectPhoto', title: 'Remove photo' })}</div>` : `<label class="dropzone" for="i-photos"><span class="ic">${ic('image')}</span><b>Add photos</b><span class="xs faint">JPG or PNG · Up to 5 photos</span><input class="file-input" type="file" id="i-photos" accept=".jpg,.jpeg,.png" data-ins-file></label>`}</div>`,
  { foot: btn('Cancel', { v: 'ghost', go: 'permit-' + p.id }) + btn('Send inspection request', { v: 'primary', icon: 'send', act: 'submitInspection', id: p.id }) })}`;
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
    ${list.length ? `<div class="table-wrap"><table class="table responsive"><thead><tr><th>Plate</th><th>Vehicle</th><th>Registration</th><th class="t-actions"><span class="sr">Actions</span></th></tr></thead><tbody>${list.map(v => { const e = expiry(v.regExpiry); return `<tr><td><div class="person"><span class="avatar navy" style="border-radius:8px">${ic('car')}</span><div class="t-main"><b>${esc(v.plate)}</b><span>${esc(v.type)}</span></div></div></td><td data-m="sub">${esc(v.make)} · ${esc(v.color)}</td><td data-m="side">${badge(e.label, e.tone)}</td><td class="t-actions">${btn('Edit', { v: 'ghost', sm: true, act: 'editVehicle', id: v.id })}${btn('', { v: 'ghost', sm: true, icon: 'trash', act: 'removeVehicle', id: v.id, title: 'Remove ' + v.plate })}</td></tr>`; }).join('')}</tbody></table></div>` : emptyState('car', 'No vehicles found', 'Try another search.')}
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
      ${F({ id: 'c-licexp', label: 'Trade licence expiry date', req: true, bind: 'f.company.licenceExpiry', type: 'date', err: fe('licenceExpiry'), hint: 'We remind you 30 days before it expires.' })}
    </div></div>
    <div class="form-sec"><div><h3>Logo</h3><p>Appears on your passes and permits. Square PNG or JPG, at least 200 × 200 px.</p></div>
      <div class="logo-up">${c.logo ? `<span class="logo-box">${initials(c.name)}</span>` : `<span class="logo-box" style="background:var(--surface-3);color:var(--text-3)">${ic('image')}</span>`}<div class="row"><label class="btn btn-secondary btn-sm" for="logo-up">${ic('upload')}${c.logo ? 'Replace logo' : 'Upload logo'}</label><input class="file-input" id="logo-up" type="file" accept=".png,.jpg,.jpeg" data-file="f.company.logo">${c.logo ? btn('Remove', { v: 'danger-ghost', sm: true, act: 'removeLogo' }) : ''}</div></div>
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
    { raw: true, sub: 'Shared with every community you work in. Keep insurance and licences current to avoid delays.', action: btn('Add document', { v: 'primary', sm: true, icon: 'plus', act: 'addCompanyDoc' }) });
}
function setCommunities() {
  return card('Communities', S.communities.map(c => `<div class="list-row"><span class="avatar" style="border-radius:8px">${initials(c.name)}</span><span class="grow"><b>${esc(c.name)} ${c.id === S.community ? badge('Current', 'brand') : ''}</b><span>${esc(c.area)} · ${c.status === 'active' ? 'Access since ' + fmt(c.since) : 'Request sent · Waiting for approval'}</span></span>${c.status === 'active' ? `${c.id !== S.community ? btn('Switch', { v: 'ghost', sm: true, act: 'switchCommunity', id: c.id }) : ''}${btn('Leave', { v: 'danger-ghost', sm: true, act: 'leaveCommunity', id: c.id })}` : `${badge('Pending', 'info')}${btn('Withdraw', { v: 'ghost', sm: true, act: 'withdrawAccess', id: c.id })}`}</div>`).join(''),
    { tight: true, sub: 'Communities where your company can request passes.', action: btn('Request access', { v: 'primary', sm: true, icon: 'plus', act: 'requestAccess' }) });
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
    ${F({ id: 'ps-idexp', label: 'ID expiry date', req: true, bind: 'm.idExpiry', type: 'date', err: E.idExpiry, hint: 'Must cover the work dates of every pass.' })}
    <div class="field full"><span class="label">ID copy<span class="req">*</span></span>${uploader({ key: 'pid', bind: 'm.fileObj', label: 'ID copy (front and back)', file: m.data.fileObj })}${E.file ? `<span class="err">${ic('alert')}${E.file}</span>` : ''}</div></div>`,
    foot: btn('Cancel', { act: 'closeModal' }) + btn(m.data.id ? 'Save changes' : 'Add employee', { v: 'primary', act: 'savePerson' }) }); }
  if (m.type === 'vehicle') { const E = m.errs || {}; return modalFrame({ title: m.data.id ? 'Edit vehicle' : 'Add vehicle', sub: 'Registration must be valid on the work dates.', size: 'lg', body: `<div class="grid-2">
    ${F({ id: 'vh-plate', label: 'Plate number', req: true, bind: 'm.plate', err: E.plate, ph: 'For example, Dubai N 12345' })}
    ${F({ id: 'vh-type', label: 'Vehicle type', req: true, bind: 'm.type', options: ['Car', 'Van', 'Pickup', 'Truck', 'Motorbike'] })}
    ${F({ id: 'vh-make', label: 'Make and model', opt: true, bind: 'm.make' })}
    ${F({ id: 'vh-color', label: 'Colour', opt: true, bind: 'm.color' })}
    ${F({ id: 'vh-exp', label: 'Registration expiry', req: true, bind: 'm.regExpiry', type: 'date', err: E.regExpiry })}
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
  if (m.type === 'adminForm') { const E = m.errs || {}; return modalFrame({ title: 'Upload a PDF form', sub: 'Contractors will read it, tick each box you place, and sign it.', body: `
    ${F({ id: 'af-new-name', label: 'Form name', req: true, bind: 'm.name', err: E.name, ph: 'For example, Contractor terms & community guidelines' })}
    <div class="field"><span class="label">PDF file<span class="req">*</span></span>${m.data.fileName ? `<div class="file-row"><span class="ic">PDF</span><span class="grow"><b>${esc(m.data.fileName)}</b><span>${sizeTxt(m.data.size)}</span></span><label class="btn btn-ghost btn-sm" for="af-file">Replace</label></div>` : `<label class="dropzone" for="af-file"><span class="ic">${ic('upload')}</span><b>Upload PDF</b><span class="xs faint">PDF only · Max 4 MB in this preview</span></label>`}<input class="file-input" type="file" id="af-file" accept="application/pdf,.pdf" data-adminpdf="new">${E.file ? `<span class="err">${ic('alert')}${E.file}</span>` : `<span class="hint">No PDF to hand? ${btn('Use the sample terms PDF', { v: 'link', act: 'adminUseSample', cls: 'xs' })}</span>`}</div>
    <div class="field"><span class="label">Required for</span>${PERMIT_TYPES.map(t => `<label class="check"><input type="checkbox" data-mapplies value="${t.id}" ${m.data.appliesTo.includes(t.id) ? 'checked' : ''}>${t.name}</label>`).join('')}</div>`,
    foot: btn('Cancel', { act: 'closeModal' }) + btn('Continue to place tick boxes', { v: 'primary', act: 'adminCreate', iconR: 'arrowR' }) }); }
  if (m.type === 'companyDoc') { const E = m.errs || {}; return modalFrame({ title: m.data.id ? 'Replace document' : 'Add company document', body: `
    ${F({ id: 'cd-name', label: 'Document', req: true, bind: 'm.name', options: ['Public liability insurance', "Workmen's compensation insurance", 'Contractor all-risk insurance', 'VAT registration certificate', 'Company profile', 'Chamber of commerce certificate', 'Other'], disabled: !!m.data.id })}
    <div class="field"><span class="label">File<span class="req">*</span></span>${uploader({ key: 'cdoc', bind: 'm.fileObj', label: 'document', file: m.data.fileObj })}${E.file ? `<span class="err">${ic('alert')}${E.file}</span>` : ''}</div>
    ${F({ id: 'cd-exp', label: 'Expiry date', bind: 'm.expiry', type: 'date', disabled: m.data.noExpiry, err: E.expiry })}
    ${sw('cd-noexp', 'm.noExpiry', 'No expiry date', 'Only for documents that never expire.')}`,
    foot: btn('Cancel', { act: 'closeModal' }) + btn('Save document', { v: 'primary', act: 'saveCompanyDoc' }) }); }
  if (m.type === 'access') { const E = m.errs || {}; return modalFrame({ title: 'Request access to a community', sub: 'The community reviews your company documents before giving access.', body: `
    ${combo({ id: 'ac-comm', label: 'Community', req: true, bind: 'm.community', options: S.directory.map(n => ({ value: n, label: n })), ph: 'Search communities', searchPh: 'Type a community name', err: E.community })}
    ${F({ id: 'ac-msg', label: 'Message', opt: true, bind: 'm.message', type: 'textarea', rows: 3, ph: 'For example, We maintain HVAC systems for several owners in your community.' })}
    ${alertBox('info', 'Shared with the community', 'Company name, trade licence, TRN and your insurance documents.')}`,
    foot: btn('Cancel', { act: 'closeModal' }) + btn('Send request', { v: 'primary', icon: 'send', act: 'sendAccess' }) }); }
  if (m.type === 'drawer') return `<div class="overlay drawer-overlay" data-overlay style="place-items:stretch start"><div class="drawer left sidebar" role="dialog" aria-modal="true" aria-label="Menu" style="position:static;height:100%"><div class="side-inner">${route().startsWith('admin') ? adminSidebar() : sidebar(route())}</div></div></div>`;
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
  const after = { community: () => { ui.pop = 'community'; }, filters: () => { ui.modal = { type: 'filters', data: clone(ui.filters) }; }, addMaterial: () => ACT.addMaterial(), sign: () => ACT.openSign(), validation: () => { ui.errs.details = true; }, menu: () => { ui.modal = { type: 'drawer', data: {} }; }, permitChecklist: () => { ui.modal = { type: 'checklist', data: { type: S.draft ? S.draft.type : 'general' } }; }, addPerson: () => ACT.addPerson(), addVehicle: () => ACT.addVehicle(), unit: () => { ui.pop = 'combo:f-units'; } }[r];
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
  if (r === 'admin-forms') return pAdminForms();
  if (r.startsWith('admin-form-')) return pAdminForm(r.slice(11));
  return ({ home: pHome, permits: pPermits, type: pType, visitor: pVisitor, help: pHelp, people: pPeople, vehicles: pVehicles }[r] || pHome)();
}
const TITLES = { home: 'Overview', permits: 'Authorized passes', type: 'Request pass', visitor: 'Visitor pass', help: 'Help & contact', people: 'Employees', vehicles: 'Vehicles' };
function render() {
  const r = route();
  const a = document.activeElement;
  const focusId = a && a.id && a !== document.body ? a.id : null;
  const sel = focusId && a.selectionStart != null ? [a.selectionStart, a.selectionEnd] : null;
  const inWizard = STEPS.some(s => s[0] === r) && S.draft;
  document.getElementById('app').innerHTML = `<div class="app ${inWizard ? 'has-actionbar' : ''}">
    <aside class="sidebar"><div class="side-inner">${r.startsWith('admin') ? adminSidebar() : sidebar(r)}</div></aside>
    <div class="main">${topbar()}<main class="content" id="main">${page(r)}</main>${bottomNav(r)}</div>
  </div>${rowMenuLayer()}${renderModal()}`;
  document.title = (TITLES[r] || (r.startsWith('admin') ? 'Permit forms' : '') || (r.startsWith('settings') ? 'Settings' : r.startsWith('permit-') ? r.slice(7) : STEPS.find(s => s[0] === r)?.[1]) || 'Buzzin') + ' · Buzzin contractor portal';
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
function guardCommunity(fn) {
  if (STEPS.some(s => s[0] === route())) openConfirm({ title: 'Leave this request?', message: 'Your draft is saved. You can continue it from the Overview after switching back to this community.', confirmText: 'Switch community', tone: 'warn', onConfirm: fn });
  else fn();
}
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
  signOut() { openConfirm({ title: 'Sign out?', message: 'Any draft is saved. You will need your email and password to sign in again.', confirmText: 'Sign out', icon: 'logout', tone: 'warn', onConfirm: () => toast('Signed out. This preview keeps you on the page.') }); },
  switchCommunity(t) { const c = S.communities.find(x => x.id === t.dataset.id); if (!c || c.id === S.community) { ui.pop = null; render(); return; } ui.pop = null; guardCommunity(() => { S.community = c.id; ui.tab = 'all'; persist(); toast(`Switched to ${c.name}`); go('home'); }); },
  requestAccess() { ui.pop = null; ui.modal = { type: 'access', data: { community: '', message: '' } }; render(); },
  sendAccess() { const m = ui.modal; if (!m.data.community) { m.errs = { community: 'Choose a community.' }; render(); return; } openConfirm({ title: 'Send access request?', message: `${m.data.community} will see your company details and documents.`, confirmText: 'Send request', icon: 'send', onConfirm: () => { S.communities.push({ id: uid('c'), name: m.data.community, area: 'Dubai', status: 'pending', since: null, email: '' }); S.directory = S.directory.filter(x => x !== m.data.community); persist(); toast(`Access requested from ${m.data.community}`); } }); },
  withdrawAccess(t) { const c = S.communities.find(x => x.id === t.dataset.id); openConfirm({ title: `Withdraw request to ${c.name}?`, message: 'You can request access again later.', confirmText: 'Withdraw', tone: 'danger', icon: 'x', onConfirm: () => { S.communities = S.communities.filter(x => x !== c); S.directory.push(c.name); persist(); toast('Request withdrawn'); } }); },
  leaveCommunity(t) { const c = S.communities.find(x => x.id === t.dataset.id); const open = S.permits.filter(p => p.community === c.id && ['review', 'changes', 'approved'].includes(p.status)).length; openConfirm({ title: `Leave ${c.name}?`, message: `Your company will lose access. ${open ? `${plural(open, 'open pass')} will be cancelled.` : 'You have no open passes there.'} You will need to request access again to return.`, confirmText: 'Leave community', tone: 'danger', icon: 'logout', requireText: 'LEAVE', onConfirm: () => { S.communities = S.communities.filter(x => x !== c); if (S.community === c.id) S.community = S.communities.find(x => x.status === 'active').id; persist(); toast(`You left ${c.name}`); } }); },
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
    const doIt = () => { S.draft = blankDraft({ community: p.community, property: p.property, units: [...p.units], type: p.type, title: p.title, workers: [...(p.workers || [])].filter(id => expiry(person(id)?.idExpiry).tone !== 'bad'), vehicles: [...(p.vehicles || [])], contact: S.profile.name, phone: S.profile.phone }); persist(); toast(`New draft created from ${p.id}. Choose new dates.`); wzGo('details'); };
    if (S.draft) openConfirm({ title: 'Replace your current draft?', message: `Duplicating ${p.id} replaces your draft “${S.draft.title || 'Untitled request'}”.`, confirmText: 'Replace draft', tone: 'warn', onConfirm: doIt }); else doIt();
  },
  updatePermit(t) { const p = S.permits.find(x => x.id === t.dataset.id); ui.pop = null; openConfirm({ title: 'Update and resubmit?', message: `We'll open ${p.id} as a draft so you can fix what the community asked for, then submit it again.`, confirmText: 'Open for editing', icon: 'edit', onConfirm: () => { S.draft = blankDraft({ id: p.id, resubmit: p.id, community: p.community, property: p.property, units: [...p.units], type: p.type, title: p.title, from: p.from, to: p.to, contact: S.profile.name, phone: S.profile.phone, workers: [...p.workers], vehicles: [...p.vehicles], noMaterials: true, reached: 4 }); persist(); wzGo('documents'); } }); },
  cancelPermit(t) {
    const p = S.permits.find(x => x.id === t.dataset.id); ui.pop = null;
    const was = p.status;
    openConfirm({ title: p.status === 'approved' ? `Cancel pass ${p.id}?` : `Withdraw request ${p.id}?`, message: p.status === 'approved' ? 'QR codes stop working immediately and workers will not be let in. This cannot be undone.' : 'The community will stop reviewing it. You can duplicate it later to submit again.', confirmText: p.status === 'approved' ? 'Cancel pass' : 'Withdraw request', tone: 'danger', icon: 'x',
      extra: () => F({ id: 'cx-reason', label: 'Reason', bind: 'm.reason', options: ['Work no longer needed', 'Dates changed', 'Submitted by mistake', 'Other'], ph: 'Choose a reason' }),
      onConfirm: () => { p.status = 'cancelled'; p.updated = TODAY; persist(); toast(`${p.id} cancelled`, { undo: () => { p.status = was; persist(); render(); } }); } });
  },
  download(t) { toast(`${t.dataset.id} downloaded (preview)`); ui.pop = null; render(); },
  shareCodes(t) { openConfirm({ title: 'Send QR codes to workers?', message: `Each worker on ${t.dataset.id} gets their personal entry code by SMS.`, confirmText: 'Send codes', icon: 'send', onConfirm: () => toast('QR codes sent by SMS') }); },
  copy(t) { const v = t.dataset.id; const done = () => toast(`Copied ${v}`); try { navigator.clipboard.writeText(v).then(done, () => toast('Copy not available here. Select the text instead.', { err: true })); } catch (e) { toast('Copy not available here. Select the text instead.', { err: true }); } },
  demo(t) { toast(`${t.dataset.id} (preview)`); },
  focus(t) { const el = document.getElementById(t.dataset.id) || document.getElementById(t.dataset.id + '-add'); if (el) { el.scrollIntoView({ block: 'center' }); el.focus({ preventScroll: true }); } },
  gotoStep(t) { wzGo(t.dataset.id); },
  wzBack() { const i = stepIndex(route()); if (i <= 0) go('type'); else wzGo(STEPS[i - 1][0]); },
  wzNext() { const r = route(), i = stepIndex(r); if (Object.keys(validate(r)).length) { ui.errs[r] = true; render(); const s = document.getElementById('err-summary'); if (s) { s.scrollIntoView({ block: 'center' }); s.focus({ preventScroll: true }); } return; } S.draft.reached = Math.max(S.draft.reached, i + 1); persistDraft(); wzGo(STEPS[i + 1][0]); },
  saveExit() { persist(); toast('Draft saved. Continue it any time from the Overview.'); go('home'); },
  submitRequest() {
    const bad = STEPS.map(s => s[0]).find(s => Object.keys(validate(s)).length);
    if (bad) { ui.errs[bad] = true; if (bad === 'review') { render(); return; } toast(`Finish “${STEPS.find(s => s[0] === bad)[1]}” before submitting`, { err: true }); wzGo(bad); ui.errs[bad] = true; render(); return; }
    const d = S.draft;
    openConfirm({ title: d.resubmit ? `Resubmit ${d.resubmit}?` : 'Submit this request?', message: `${d.title} will be sent to ${community().name} for review. You can't edit it while it's under review.`, confirmText: d.resubmit ? 'Resubmit request' : 'Submit request', icon: 'send', onConfirm: () => {
      let id;
      const rec = { community: d.community, kind: 'work', title: d.title, type: d.type, property: d.property, units: d.units, from: d.from, to: d.to, hours: `${d.start}–${d.end}`, status: 'review', updated: TODAY, workers: d.workers, vehicles: d.noVehicles ? [] : d.vehicles, materials: d.noMaterials ? 0 : d.materials.length, docs: Object.keys(d.docs).filter(k => d.docs[k].file).map(k => DOCS[k].name).concat(formsFor(d).map(f => f.published.name + ' (signed)')) };
      if (d.resubmit) { id = d.resubmit; Object.assign(S.permits.find(p => p.id === id), rec, { message: '' }); } else { id = 'BZ-' + S.nextRef++; S.permits.unshift(Object.assign({ id }, rec)); }
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
  submitInspection(t) { const p = S.permits.find(x => x.id === t.dataset.id), I = ui.inspect; if (!I.date) { toast('Choose a preferred date', { err: true }); return; } if (!(I.c0 && I.c1 && I.c2)) { openConfirm({ title: 'Some checks are not ticked', message: 'The inspection may fail if tools, debris or snagging items remain. Send anyway?', confirmText: 'Send anyway', tone: 'warn', onConfirm: () => ACT.doInspect(p) }); return; } openConfirm({ title: 'Send inspection request?', message: `${community().name} will contact your site contact to confirm ${fmt(I.date)} at ${I.time}.`, confirmText: 'Send request', icon: 'send', onConfirm: () => ACT.doInspect(p) }); },
  doInspect(p) { p.status = 'inspection'; p.updated = TODAY; ui.inspect = null; persist(); toast(`Inspection requested for ${p.id}`); go('permit-' + p.id); },
  removeInspectPhoto() { openConfirm({ title: 'Remove this photo?', message: ui.inspect.photos, confirmText: 'Remove', tone: 'danger', onConfirm: () => { ui.inspect.photos = null; } }); },
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
  adminNewForm() { ui.modal = { type: 'adminForm', data: { name: '', fileName: '', size: 0, pdf: null, appliesTo: [...ALL_TYPES] } }; render(); },
  adminUseSample() { Object.assign(ui.modal.data, { fileName: 'buzzin-contractor-terms-sample.pdf', size: 61496, pdf: 'sample' }); if (!ui.modal.data.name) ui.modal.data.name = 'Contractor terms & community guidelines'; if (ui.modal.errs) delete ui.modal.errs.file; render(); },
  adminCreate() {
    const m = ui.modal, d = m.data, errs = {};
    if (!d.name.trim()) errs.name = 'Enter a name contractors will recognise.';
    if (!d.pdf) errs.file = 'Upload the PDF.';
    if (!d.appliesTo.length) errs.name = errs.name || 'Choose at least one permit type.';
    if (Object.keys(errs).length) { m.errs = errs; render(); return; }
    const f = { id: uid('frm'), community: S.community, name: d.name.trim(), fileName: d.fileName, pdf: d.pdf, pdfRev: 0, fields: [], appliesTo: d.appliesTo, placement: 'bottom', updated: TODAY, published: null };
    S.forms.push(f);
    if (!persist()) { S.forms.pop(); return; }
    ui.modal = null; ui.adminSel = null; ui.adminMode = 'add'; go('admin-form-' + f.id);
  },
  adminSelect(t) { ui.adminSel = t.dataset.id; render(); },
  adminDeleteField(t) {
    const f = curAdminForm(), i = f.fields.findIndex(x => x.id === t.dataset.id), fd = f.fields[i];
    openConfirm({ title: 'Delete this tick box?', message: `“${fd.label}” on page ${fd.page} will be removed.`, confirmText: 'Delete tick box', tone: 'danger', onConfirm: () => { f.fields.splice(i, 1); ui.adminSel = null; f.updated = TODAY; persist(); toast('Tick box deleted', { undo: () => { f.fields.splice(i, 0, fd); persist(); render(); } }); } });
  },
  adminReplace() { openConfirm({ title: 'Replace the PDF?', message: 'Tick boxes stay in the same place on each page. Check their positions after uploading.', confirmText: 'Choose new PDF', icon: 'refresh', onConfirm: () => document.getElementById('admin-replace').click() }); },
  adminPublish(t) {
    const f = S.forms.find(x => x.id === t.dataset.id);
    if (!f.fields.length) { toast('Add at least one tick box before publishing.', { err: true }); return; }
    if (!f.appliesTo.length) { toast('Choose at least one permit type under “Required for”.', { err: true }); return; }
    if (f.published && formStatus(f)[1] === 'ok') { toast('No changes to publish.'); return; }
    const v = f.published ? f.published.version + 1 : 1;
    openConfirm({ title: `Publish version ${v}?`, message: `Contractors who haven’t submitted yet will be asked to tick and sign version ${v}. Requests already submitted keep the version they signed.`, confirmText: `Publish version ${v}`, icon: 'send', onConfirm: () => { f.published = Object.assign(clone(pubSubset(f)), { version: v, fileName: f.fileName, at: TODAY }); f.updated = TODAY; persist(); toast(`Version ${v} published`); } });
  },
  adminDeleteForm(t) {
    const i = S.forms.findIndex(x => x.id === t.dataset.id), f = S.forms[i];
    openConfirm({ title: `Delete “${f.name}”?`, message: 'Contractors will no longer be asked to sign it. Copies already signed on submitted requests are kept.', confirmText: 'Delete form', tone: 'danger', onConfirm: () => { S.forms.splice(i, 1); persist(); toast('Form deleted'); go('admin-forms'); } });
  },
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
    if (!d.fileObj) errs.file = 'Upload a copy of the ID.';
    if (Object.keys(errs).length) { m.errs = errs; render(); return; }
    const rec = { name: d.name, role: d.role || 'Worker', phone: d.phone, email: d.email, idType: d.idType, idNo: d.idNo, idExpiry: d.idExpiry, file: d.fileObj.name };
    if (d.id) Object.assign(person(d.id), rec); else { const id = uid('p'); S.people.push(Object.assign({ id }, rec)); if (m.fromWizard) S.draft.workers.push(id); }
    ui.modal = null; persist(); toast(d.id ? `${d.name} updated` : `${d.name} added`); render();
  },
  removePerson(t) { const p = person(t.dataset.id), i = S.people.indexOf(p); const used = S.permits.filter(x => ['review', 'approved', 'changes'].includes(x.status) && (x.workers || []).includes(p.id)); openConfirm({ title: `Remove ${p.name}?`, message: used.length ? `${p.name} is on ${plural(used.length, 'open pass', 'open passes')} (${used.map(x => x.id).join(', ')}). They stay on those passes but can't be added to new ones.` : 'They will be removed from your saved employees.', confirmText: 'Remove employee', tone: 'danger', onConfirm: () => { S.people.splice(i, 1); if (S.draft) S.draft.workers = S.draft.workers.filter(x => x !== p.id); persist(); toast(`${p.name} removed`, { undo: () => { S.people.splice(i, 0, p); persist(); render(); } }); } }); },
  peopleFilter(t) { ui.peopleFilter = t.dataset.id; render(); },
  addVehicle() { ui.modal = { type: 'vehicle', data: { plate: '', type: 'Van', make: '', color: '', regExpiry: '', fileObj: null }, fromWizard: route() === 'workvehicles' }; render(); },
  editVehicle(t) { const v = clone(vehicle(t.dataset.id)); v.fileObj = v.file ? { name: v.file } : null; ui.modal = { type: 'vehicle', data: v }; render(); },
  saveVehicle() {
    const m = ui.modal, d = m.data, errs = {};
    if (!d.plate.trim()) errs.plate = 'Enter the plate number.';
    if (!d.regExpiry) errs.regExpiry = 'Enter the registration expiry date.'; else if (d.regExpiry < TODAY) errs.regExpiry = 'This registration has expired.';
    if (!d.fileObj) errs.file = 'Upload the registration card.';
    if (Object.keys(errs).length) { m.errs = errs; render(); return; }
    const rec = { plate: d.plate, type: d.type, make: d.make || d.type, color: d.color || '—', regExpiry: d.regExpiry, file: d.fileObj.name };
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
  removeLogo() { openConfirm({ title: 'Remove your logo?', message: 'Passes will show your company initials instead. Save changes to apply.', confirmText: 'Remove logo', tone: 'danger', onConfirm: () => { ui.form.company.logo = false; ui.dirty = true; } }); },
  discardForm() { openConfirm({ title: 'Discard unsaved changes?', message: 'Your edits on this page will be lost.', confirmText: 'Discard changes', tone: 'danger', onConfirm: () => { ui.form = initForm(ui.formTab); ui.dirty = false; ui.formErr = {}; } }); },
  saveForm() {
    const tab = ui.formTab, f = ui.form, e = {};
    if (tab === 'general') {
      if (!f.company.name.trim()) e.name = 'Enter the company name.';
      if (f.company.trn && !/^\d{8,15}$/.test(f.company.trn.replace(/\s/g, ''))) e.trn = 'TRN must be 8–15 digits.';
      if (!f.company.licence) e.licence = 'Upload your trade licence.';
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
  addCompanyDoc() { ui.modal = { type: 'companyDoc', data: { name: 'Contractor all-risk insurance', fileObj: null, expiry: '', noExpiry: false } }; render(); },
  editCompanyDoc(t) { const d = S.companyDocs.find(x => x.id === t.dataset.id); ui.modal = { type: 'companyDoc', data: { id: d.id, name: d.name, fileObj: d.file ? { name: d.file } : null, expiry: d.expiry || '', noExpiry: !!d.noExpiry } }; render(); },
  saveCompanyDoc() {
    const m = ui.modal, d = m.data, errs = {};
    if (!d.fileObj) errs.file = 'Upload the file.';
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
  adminMode(el) { ui.adminMode = el.value; render(); },
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
  if (el.dataset.actChange === 'toggleSel') { const k = el.dataset.kind, arr = S.draft[k]; S.draft[k] = el.checked ? [...new Set([...arr, el.value])] : arr.filter(x => x !== el.value); persistDraft(); if (ui.errs.personnel || ui.errs.workvehicles) render(); return; }
  if (el.dataset.ins !== undefined && el.type === 'checkbox') { ui.inspect[el.dataset.ins] = el.checked; return; }
  if (el.dataset.insFile !== undefined && el.files[0]) { ui.inspect.photos = el.files.length > 1 ? `${el.files.length} photos` : el.files[0].name; render(); return; }
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
/* ================= Signature upload & admin form editor events ================= */
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
  if (el.dataset.adminpdf) {
    const file = el.files[0], target = el.dataset.adminpdf; el.value = '';
    readPdf(file).then(r => {
      if (!r) return;
      if (target === 'new') { Object.assign(ui.modal.data, r); if (!ui.modal.data.name) ui.modal.data.name = r.fileName.replace(/\.pdf$/i, '').replace(/[-_]+/g, ' '); if (ui.modal.errs) delete ui.modal.errs.file; }
      else { const f = S.forms.find(x => x.id === target), old = { pdf: f.pdf, fileName: f.fileName }; Object.assign(f, { pdf: r.pdf, fileName: r.fileName, pdfRev: (f.pdfRev || 0) + 1, updated: TODAY }); if (!persist()) Object.assign(f, old); else toast(`${r.fileName} uploaded. Check the tick box positions.`); }
      render();
    }).catch(err => toast(err.message, { err: true }));
    return;
  }
  if (el.dataset.mapplies !== undefined) { const a = ui.modal.data.appliesTo; ui.modal.data.appliesTo = el.checked ? [...new Set([...a, el.value])] : a.filter(x => x !== el.value); return; }
  const f = route().startsWith('admin-form-') ? curAdminForm() : null;
  if (!f) return;
  if (el.dataset.afield) {
    const fd = f.fields.find(x => x.id === ui.adminSel); if (!fd) return;
    const k = el.dataset.afield;
    fd[k] = k === 'required' ? el.checked : k === 'size' ? Number(el.value) : el.value;
    f.updated = TODAY; persist(); render(); return;
  }
  if (el.dataset.aform) {
    const k = el.dataset.aform;
    if (k === 'appliesTo') f.appliesTo = el.checked ? [...new Set([...f.appliesTo, el.value])] : f.appliesTo.filter(x => x !== el.value);
    else f[k] = el.value;
    f.updated = TODAY; persist(); render();
  }
}, true);
document.addEventListener('input', e => {
  const el = e.target, f = route().startsWith('admin-form-') ? curAdminForm() : null;
  if (!f) return;
  if (el.dataset.afield === 'label') { const fd = f.fields.find(x => x.id === ui.adminSel); if (fd) { fd.label = el.value; persist(); } }
  if (el.dataset.aform === 'name') { f.name = el.value; persist(); }
});
document.addEventListener('pointerdown', e => {
  const pageEl = e.target.closest('[data-admin-page]');
  if (!pageEl || e.button !== 0) return;
  const f = curAdminForm(); if (!f) return;
  const rect = pageEl.getBoundingClientRect(), page = Number(pageEl.dataset.adminPage);
  const pct = ev => [Math.min(98, Math.max(2, (ev.clientX - rect.left) / rect.width * 100)), Math.min(98, Math.max(2, (ev.clientY - rect.top) / rect.height * 100))];
  const boxEl = e.target.closest('[data-box]');
  if (boxEl) {
    e.preventDefault();
    const fd = f.fields.find(x => x.id === boxEl.dataset.box), sx = e.clientX, sy = e.clientY;
    let moved = false;
    const move = ev => { if (!moved && Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) < 4) return; moved = true; const [x, y] = pct(ev); boxEl.style.left = x + '%'; boxEl.style.top = y + '%'; fd.x = +x.toFixed(2); fd.y = +y.toFixed(2); };
    const up = () => { removeEventListener('pointermove', move); removeEventListener('pointerup', up); ui.adminSel = fd.id; if (moved) { f.fields.sort((a, b) => a.page - b.page || a.y - b.y); f.updated = TODAY; persist(); } render(); };
    addEventListener('pointermove', move); addEventListener('pointerup', up);
    return;
  }
  if ((ui.adminMode || 'add') !== 'add' || e.target.tagName !== 'IMG') { if (ui.adminSel) { ui.adminSel = null; render(); } return; }
  const [x, y] = pct(e);
  const fd = { id: uid('b'), page, x: +x.toFixed(2), y: +y.toFixed(2), size: 2.8, label: `I agree to clause ${f.fields.length + 1}`, required: true };
  f.fields.push(fd); f.fields.sort((a, b) => a.page - b.page || a.y - b.y);
  ui.adminSel = fd.id; f.updated = TODAY; persist(); render();
  setTimeout(() => { const l = document.getElementById('af-label'); if (l) { l.focus({ preventScroll: true }); l.select(); } }, 0);
});
document.addEventListener('keydown', e => {
  if (!route().startsWith('admin-form-') || !ui.adminSel || ui.modal || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
  const f = curAdminForm(), fd = f && f.fields.find(x => x.id === ui.adminSel); if (!fd) return;
  const step = e.shiftKey ? 1 : 0.2, d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
  if (d) { e.preventDefault(); fd.x = +(fd.x + d[0]).toFixed(2); fd.y = +(fd.y + d[1]).toFixed(2); f.updated = TODAY; persist(); render(); }
  if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); ACT.adminDeleteField({ dataset: { id: fd.id } }); }
});
document.addEventListener('drop', e => { const z = e.target.closest('[data-sigdrop]'); if (z) { e.preventDefault(); takeSigFile(e.dataTransfer.files[0]); } });
document.addEventListener('dragover', e => { if (e.target.closest('[data-sigdrop]')) e.preventDefault(); });
function handleFile(bind, file) {
  if (!file) return;
  if (file.size > 10 * 1048576) { toast(`${file.name} is larger than 10 MB. Choose a smaller file.`, { err: true }); return; }
  if (bind === 'f.company.logo') { if (!/^image\//.test(file.type)) { toast('Choose a PNG or JPG image.', { err: true }); return; } ui.form.company.logo = true; ui.dirty = true; render(); toast('Logo ready. Save changes to apply.'); return; }
  if (!/\.(pdf|jpe?g|png)$/i.test(file.name)) { toast('Use a PDF, JPG or PNG file.', { err: true }); return; }
  setB(bind, { name: file.name, size: file.size, date: TODAY });
  if (bind.startsWith('d.')) persistDraft(); else if (bind.startsWith('f.')) ui.dirty = true;
  if (ui.modal && ui.modal.errs) delete ui.modal.errs.file;
  render();
  toast(`${file.name} uploaded`);
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
if (!handleLegacy(route())) render();
})();
