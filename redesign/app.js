/* Buzzin contractor portal — interactive redesign prototype.
   Plain JS, no build step. All data is sample data kept in this browser only. */
(() => {
'use strict';

/* ================= Utilities ================= */
const TODAY = '2026-10-09';
const KEY = 'buzzin-redesign-v2';
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
const STEPS = [['details', 'Work details'], ['materials', 'Materials'], ['workvehicles', 'Vehicles'], ['personnel', 'Workers'], ['documents', 'Documents'], ['pdf', 'Fill & sign'], ['review', 'Review & submit']];
const PDF_PAGES = ['Work declaration', 'Site safety checklist', 'Contractor declaration'];
const ROLES = { Owner: 'Full access, including billing and closing the account.', Admin: 'Manage passes, employees, vehicles, documents and team.', Requester: 'Create and submit passes. Cannot change company settings.', Viewer: 'View passes and download approved permits only.' };

function blankDraft(prefill) {
  return Object.assign({
    id: uid('DRAFT-'), community: S ? S.community : 'buzzin', property: '', units: [], type: 'general', title: '', description: '',
    contact: '', phone: '', from: '', to: '', start: '09:00', end: '17:00', amc: 'no',
    materials: [], noMaterials: false, vehicles: [], noVehicles: false, trips: '', workers: [],
    docs: {}, pdf: { p1: {}, p2: {}, p3: {} }, signature: null, consent: false, reached: 0, saved: TODAY,
  }, prefill || {});
}
function seed() {
  return {
    v: 2, community: 'buzzin', nextRef: 1049, nextVp: 2211,
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
    team: [
      { id: 't1', name: 'Alex Morgan', email: 'alex@samplecontracting.ae', role: 'Owner', status: 'active', last: 'Today, 08:42' },
      { id: 't2', name: 'Priya Nair', email: 'priya@samplecontracting.ae', role: 'Admin', status: 'active', last: 'Yesterday, 17:10' },
      { id: 't3', name: 'Sam Lee', email: 'sam@samplecontracting.ae', role: 'Requester', status: 'invited', last: 'Invite sent 7 Oct' },
    ],
    notifPrefs: {
      submitted: { email: true, sms: false, app: true }, changes: { email: true, sms: true, app: true }, approved: { email: true, sms: true, app: true },
      expiring: { email: true, sms: false, app: true }, inspection: { email: true, sms: false, app: true }, news: { email: false, sms: false, app: false },
    },
    twofa: false,
    sessions: [
      { id: 's1', device: 'Chrome on Windows', where: 'Dubai, UAE', when: 'Active now', current: true, icon: 'monitor' },
      { id: 's2', device: 'Buzzin app on iPhone', where: 'Dubai, UAE', when: '2 hours ago', icon: 'phone' },
      { id: 's3', device: 'Edge on Windows', where: 'Sharjah, UAE', when: '3 days ago', icon: 'monitor' },
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
    }),
    visitor: { name: '', company: 'Sample Contracting', phone: '', idType: 'Emirates ID', idNo: '', purpose: 'Site survey', unit: '', date: '', from: '10:00', to: '12:00', plate: '', notes: '' },
  };
}

/* ================= State ================= */
let S = null;
try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S = null; }
if (!S || S.v !== 2) S = seed();
const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* preview without storage */ } };
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
    ${btn('Request pass', { v: 'primary', sm: true, icon: 'plus', go: 'type', cls: 'hide-sm' })}
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
    const bad = d.workers.map(person).filter(p => p && d.to && p.idExpiry < d.to);
    if (bad.length) e.workers = `${bad.map(p => p.name).join(', ')}: ID expires before the work ends (${fmt(d.to)}). Update the ID or remove the worker.`;
  }
  if (step === 'documents') {
    typeOf(d.type).docs.forEach(k => {
      const doc = d.docs[k] || {};
      if (!doc.file) e['doc-' + k] = `Upload the ${DOCS[k].name}.`;
      else if (!doc.noExpiry && !doc.expiry) e['doc-' + k] = `Enter the expiry date for the ${DOCS[k].name}, or mark it as having no expiry.`;
      else if (!doc.noExpiry && d.to && doc.expiry < d.to) e['doc-' + k] = `The ${DOCS[k].name} expires before the work ends.`;
    });
  }
  if (step === 'pdf') {
    [1, 2, 3].forEach(i => { if (!d.pdf['p' + i].agree) e['pdf' + i] = `Tick the confirmation on page ${i}.`; });
    if (!d.pdf.p1.company) e.pdf1 = 'Enter the company name on page 1.';
    if (!d.signature) e.signature = 'Add your signature on page 3.';
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
  pdf: 'Complete each page of the community form, then sign.',
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
  return wizard('workvehicles', card('Vehicles for this work', `
    ${sw('f-vehicles', 'd.noVehicles', 'No vehicles needed', 'Turn on if workers arrive on foot or by public transport.')}
    ${d.noVehicles ? '' : `<div class="stack-sm">${selectRows('vehicles')}</div>
    <div class="row between"><div style="max-width:240px">${F({ id: 'f-trips', label: 'Expected trips', opt: true, bind: 'd.trips', type: 'number', attrs: 'min="1"' })}</div>${btn('Add a vehicle', { icon: 'plus', act: 'addVehicle' })}</div>`}
    ${errOf('workvehicles', 'vehicles') ? `<span class="err" id="f-vehicles-err">${ic('alert')}${errOf('workvehicles', 'vehicles')}</span>` : ''}`));
}
function pPersonnel() {
  const d = S.draft;
  return wizard('personnel', card('Workers on site', `
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
  return wizard('documents', `${alertBox(done === t.docs.length ? 'ok' : 'info', `${done} of ${t.docs.length} required documents uploaded`, `Documents for ${t.name} at ${esc(community().name)}. Only documents set up by the community are shown.`)}
    ${t.docs.map(k => docCard(k, true)).join('')}${t.optional.map(k => docCard(k, false)).join('')}`);
}
function pPdf() {
  const d = S.draft, pg = ui.page, P = d.pdf['p' + pg];
  const pageDone = i => !!d.pdf['p' + i].agree && (i !== 3 || !!d.signature) && (i !== 1 || !!d.pdf.p1.company);
  const pf = (k, label, type = 'text') => `<div class="pf"><label for="pdf-${pg}-${k}">${label}</label>${type === 'textarea' ? `<textarea id="pdf-${pg}-${k}" data-bind="d.pdf.p${pg}.${k}">${esc(P[k] || '')}</textarea>` : `<input id="pdf-${pg}-${k}" type="${type}" data-bind="d.pdf.p${pg}.${k}" value="${esc(P[k] || '')}">`}</div>`;
  let content = '';
  if (pg === 1) content = `${pf('company', 'Company name *')}${pf('responsible', 'Responsible person *')}${pf('area', 'Exact work area')}${pf('note', 'Notes for the community', 'textarea')}`;
  if (pg === 2) content = `<div class="clause">Confirm each safety measure that applies to this work.</div>${['PPE will be worn by all workers', 'Work area will be barricaded and signed', 'Fire extinguisher available on site', 'Power and water isolation agreed with facilities', 'Area cleaned and debris removed daily'].map((l, i) => `<label class="check"><input type="checkbox" data-bind="d.pdf.p2.c${i}" ${P['c' + i] ? 'checked' : ''}>${l}</label>`).join('')}${pf('note', 'Other safety notes', 'textarea')}`;
  if (pg === 3) content = `<div class="clause">I confirm the contractor will follow community rules, work only on the approved dates and hours, keep common areas clean, and accept responsibility for damage caused by our workers.</div>${pf('name', 'Full name')}${pf('position', 'Position')}<div class="pf"><label>Signature *</label><div class="sig-box" id="f-signature" tabindex="-1">${d.signature ? (d.signature.type === 'typed' ? `<span class="sig-typed">${esc(d.signature.text)}</span>` : `<img src="${d.signature.data}" alt="Your signature">`) : btn('Add signature', { v: 'secondary', icon: 'pen', act: 'openSign' })}</div><div class="sig-line"><span>${d.signature ? 'Signed by ' + esc(d.signature.name) : 'Not signed yet'}</span><span>${d.signature ? fmt(TODAY) : ''}</span></div></div>${d.signature ? `<div class="row">${btn('Change signature', { v: 'ghost', sm: true, act: 'openSign' })}${btn('Remove signature', { v: 'danger-ghost', sm: true, act: 'clearSign' })}</div>` : ''}`;
  return wizard('pdf', `<div class="row between"><span class="small muted">${[1, 2, 3].filter(pageDone).length} of 3 pages complete · Changes save automatically</span>${btn('Download preview', { v: 'ghost', sm: true, icon: 'download', act: 'download', id: 'Form preview' })}</div>
  <div class="doc-layout">
    <div class="page-rail" role="tablist" aria-label="Form pages">${[1, 2, 3].map(i => `<button class="page-thumb ${i === pg ? 'active' : ''}" role="tab" aria-selected="${i === pg}" data-act="pdfPage" data-id="${i}"><span class="sheet"><i></i><i></i><i></i><i></i><i></i><i></i></span><span class="row">Page ${i}${pageDone(i) ? `<span style="color:var(--ok)">${ic('check')}</span>` : '<span class="faint xs">To do</span>'}</span></button>`).join('')}</div>
    <section class="paper" aria-label="Page ${pg} of 3">
      <div class="doc-head"><span class="doc-logo">buzz<span>in</span></span><span class="doc-meta">${esc(community().name)}<br>${esc(typeOf(d.type).name)} · Page ${pg} of 3</span></div>
      <h2>${PDF_PAGES[pg - 1]}</h2>
      ${content}
      <label class="check" id="f-pdf${pg}"><input type="checkbox" data-bind="d.pdf.p${pg}.agree" data-rerender ${P.agree ? 'checked' : ''}>I have read this page and the details are correct.</label>
      <div class="row between">${pg > 1 ? btn('Previous page', { sm: true, icon: 'left', act: 'pdfPage', id: pg - 1 }) : '<span></span>'}${pg < 3 ? btn('Next page', { sm: true, iconR: 'right', act: 'pdfPage', id: pg + 1 }) : ''}</div>
    </section>
  </div>`);
}
function pReview() {
  const d = S.draft, t = typeOf(d.type);
  const sec = (title, step, rows) => card(title, `<dl class="dl">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v || '<span class="faint">Not provided</span>'}</dd>`).join('')}</dl>`, { action: btn('Edit', { v: 'ghost', sm: true, icon: 'edit', act: 'gotoStep', id: step }) });
  const docs = t.docs.concat(t.optional).filter(k => d.docs[k] && d.docs[k].file).map(k => `${DOCS[k].name} <span class="faint">· ${d.docs[k].noExpiry ? 'No expiry' : 'Valid to ' + fmt(d.docs[k].expiry)}</span>`).join('<br>');
  return wizard('review', `${alertBox('info', 'Submitting does not approve your request', `${esc(community().name)} reviews every request. Work can start only after approval.`)}
    ${sec('Work details', 'details', [['Community', esc(community().name)], ['Location', esc([d.property, d.units.join(', ')].filter(Boolean).join(' · '))], ['Permit type', esc(t.name)], ['Work', esc(d.title)], ['Description', esc(d.description)], ['Site contact', esc([d.contact, d.phone].filter(Boolean).join(' · '))], ['Dates', d.from ? range(d.from, d.to) + ` · ${d.start}–${d.end}` : ''], ['AMC', d.amc === 'yes' ? 'Yes' : 'No']])}
    ${sec('Materials', 'materials', [['Items', d.noMaterials ? 'None' : d.materials.map(m => `${esc(m.name)} × ${m.qty} ${esc(m.unit)}`).join('<br>')]])}
    ${sec('Vehicles', 'workvehicles', [['Vehicles', d.noVehicles ? 'None' : d.vehicles.map(vehicle).filter(Boolean).map(v => esc(v.plate + ' · ' + v.make)).join('<br>')], ['Expected trips', esc(d.trips)]])}
    ${sec('Workers', 'personnel', [['On site', d.workers.map(person).filter(Boolean).map(p => esc(`${p.name} · ${p.role}`)).join('<br>')]])}
    ${sec('Documents & signature', 'documents', [['Uploaded', docs], ['Forms', `${[1, 2, 3].filter(i => d.pdf['p' + i].agree).length} of 3 pages complete`], ['Signature', d.signature ? 'Signed by ' + esc(d.signature.name) : '']])}
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
  ['documents', 'Company documents', 'file', 'Company'], ['team', 'Team members', 'users', 'Company'], ['communities', 'Communities', 'layers', 'Company'],
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
  const nav = SET_TABS.map(([k, l, i, g]) => { const head = g !== group ? `<div class="side-label">${g}</div>` : ''; group = g; return head + `<button class="set-link ${tab === k ? 'active' : ''}" data-go="settings-${k}" ${tab === k ? 'aria-current="page"' : ''}>${ic(i)}${l}${k === 'documents' && expDocs ? badge(String(expDocs), 'warn') : ''}${k === 'team' ? `<span class="count" style="margin-left:auto">${S.team.length}</span>` : ''}</button>`; }).join('');
  const body = { general: setGeneral, profile: setProfile, security: setSecurity, documents: setDocuments, team: setTeam, communities: setCommunities, notifications: setNotifications }[tab]();
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
    <div class="form-sec"><div><h3>Photo</h3><p>Helps your team recognise you.</p></div><div class="logo-up"><span class="avatar lg">${initials(ui.form.name)}</span><div class="row">${btn('Upload photo', { sm: true, icon: 'upload', act: 'demo', id: 'Photo upload' })}${btn('Remove', { v: 'ghost', sm: true, act: 'demo', id: 'Photo removed' })}</div></div></div>
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
    { sub: 'You will stay signed in here. Other devices will be signed out.', foot: btn('Change password', { v: 'primary', act: 'changePassword' }) })}
  ${card('Two-step verification', `${sw('twofa', '', 'Require a code when signing in', S.twofa ? `On · Codes are sent by SMS to ${esc(S.profile.phone)}` : 'Off · Add a one-time SMS code to protect your account', false, 'twofa')}`.replace('type="checkbox" id="twofa"', `type="checkbox" id="twofa" ${S.twofa ? 'checked' : ''}`), { sub: 'Recommended for owners and admins.' })}
  ${card('Where you’re signed in', S.sessions.map(x => `<div class="list-row"><span class="ic tone-neutral">${ic(x.icon)}</span><span class="grow"><b>${esc(x.device)} ${x.current ? badge('This device', 'ok') : ''}</b><span>${esc(x.where)} · ${esc(x.when)}</span></span>${x.current ? '' : btn('Sign out', { v: 'ghost', sm: true, act: 'endSession', id: x.id })}</div>`).join(''), { tight: true, action: S.sessions.length > 1 ? btn('Sign out all other devices', { sm: true, act: 'endAllSessions' }) : '' })}
  ${card('Deactivate account', `<p class="small muted">Deactivating removes your access and your team's access to all communities. Approved passes are cancelled. Records are kept for 90 days as required by communities, then deleted.</p>`, { cls: 'danger-zone', foot: btn('Deactivate account', { v: 'danger', act: 'deactivate' }) })}`;
}
function setDocuments() {
  const rows = [{ id: 'licence', name: 'Trade licence', file: S.company.licence && S.company.licence.name, expiry: S.company.licenceExpiry, required: true, fixed: true }, ...S.companyDocs];
  return card('Company documents', `<div class="table-wrap"><table class="table responsive"><thead><tr><th>Document</th><th>File</th><th>Status</th><th class="t-actions"><span class="sr">Actions</span></th></tr></thead><tbody>${rows.map(d => { const e = d.file ? expiry(d.expiry, d.noExpiry) : { tone: 'bad', label: 'Missing' }; return `<tr><td><div class="t-main"><b>${esc(d.name)} ${d.required ? '<span class="xs faint">· Required</span>' : ''}</b><span>${d.noExpiry ? 'No expiry date' : d.expiry ? 'Expires ' + fmt(d.expiry) : ''}</span></div></td><td data-m="sub">${d.file ? `<span class="mono">${esc(d.file)}</span>` : '<span class="faint">Not uploaded</span>'}</td><td data-m="side">${badge(e.label, e.tone)}</td><td class="t-actions">${d.fixed ? btn('Edit', { v: 'ghost', sm: true, go: 'settings-general' }) : `${btn(d.file ? 'Replace' : 'Upload', { v: 'ghost', sm: true, act: 'editCompanyDoc', id: d.id })}${btn('', { v: 'ghost', sm: true, icon: 'trash', act: 'removeCompanyDoc', id: d.id, title: 'Remove ' + d.name })}`}</td></tr>`; }).join('')}</tbody></table></div>`,
    { raw: true, sub: 'Shared with every community you work in. Keep insurance and licences current to avoid delays.', action: btn('Add document', { v: 'primary', sm: true, icon: 'plus', act: 'addCompanyDoc' }) });
}
function setTeam() {
  return `${card('Team members', `<div class="table-wrap"><table class="table responsive"><thead><tr><th>Member</th><th>Role</th><th>Last active</th><th class="t-actions"><span class="sr">Actions</span></th></tr></thead><tbody>${S.team.map(t => `<tr><td><div class="person"><span class="avatar">${initials(t.name)}</span><div class="t-main"><b>${esc(t.name)} ${t.status === 'invited' ? badge('Invited', 'info') : ''}</b><span>${esc(t.email)}</span></div></div></td><td data-m="side">${t.role === 'Owner' ? '<b class="small">Owner</b>' : `<label class="sr" for="role-${t.id}">Role for ${esc(t.name)}</label><select class="select" style="height:30px;width:auto" id="role-${t.id}" data-change="changeRole" data-id="${t.id}">${Object.keys(ROLES).filter(r => r !== 'Owner').map(r => `<option ${t.role === r ? 'selected' : ''}>${r}</option>`).join('')}</select>`}</td><td data-m="sub">${esc(t.last)}</td><td class="t-actions">${t.status === 'invited' ? btn('Resend', { v: 'ghost', sm: true, act: 'resendInvite', id: t.id }) : ''}${t.role !== 'Owner' ? btn('', { v: 'ghost', sm: true, icon: 'trash', act: 'removeMember', id: t.id, title: 'Remove ' + t.name }) : ''}</td></tr>`).join('')}</tbody></table></div>`,
    { raw: true, sub: 'People in your company who can sign in to this portal.', action: btn('Invite member', { v: 'primary', sm: true, icon: 'plus', act: 'inviteMember' }) })}
  ${card('Roles', `<dl class="dl">${Object.entries(ROLES).map(([r, d]) => `<dt>${r}</dt><dd style="font-weight:400" class="muted">${d}</dd>`).join('')}</dl>`)}`;
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
  if (m.type === 'sign') return modalFrame({ title: 'Add your signature', sub: 'Your signature is added to page 3 of the community form.', size: 'lg', body: `
    <div class="segmented" role="tablist">${[['draw', 'Draw'], ['type', 'Type']].map(([k, l]) => `<label><input type="radio" name="sigmode" value="${k}" data-change="signMode" ${ui.signMode === k ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div>
    ${ui.signMode === 'draw' ? `<canvas class="sig" id="sig-canvas" aria-label="Draw your signature"></canvas><div class="row between"><span class="hint">Use your mouse, finger or stylus.</span>${btn('Clear', { v: 'ghost', sm: true, act: 'sigClear' })}</div>` : `<div class="sig-preview"><span class="sig-typed" id="sig-typed">${esc(m.data.name || ' ')}</span></div>`}
    ${F({ id: 'sg-name', label: 'Full name', req: true, bind: 'm.name', err: (m.errs || {}).name, attrs: 'data-signame' })}
    ${check('sg-ok', 'm.ok', 'I confirm this is my signature and I am authorised to sign for ' + esc(S.company.name) + '.')}${(m.errs || {}).ok ? `<span class="err">${ic('alert')}${m.errs.ok}</span>` : ''}${(m.errs || {}).draw ? `<span class="err">${ic('alert')}${m.errs.draw}</span>` : ''}`,
    foot: btn('Cancel', { act: 'closeModal' }) + btn('Apply signature', { v: 'primary', act: 'saveSign' }) });
  if (m.type === 'invite') { const E = m.errs || {}; return modalFrame({ title: 'Invite a team member', sub: 'They get an email with a link to set a password.', body: `
    ${F({ id: 'in-name', label: 'Name', req: true, bind: 'm.name', err: E.name })}
    ${F({ id: 'in-email', label: 'Work email', req: true, bind: 'm.email', type: 'email', err: E.email })}
    ${F({ id: 'in-role', label: 'Role', bind: 'm.role', options: Object.keys(ROLES).filter(r => r !== 'Owner'), rerender: true, hint: ROLES[m.data.role] })}`,
    foot: btn('Cancel', { act: 'closeModal' }) + btn('Send invite', { v: 'primary', icon: 'send', act: 'sendInvite' }) }); }
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
  if (m.type === 'drawer') return `<div class="overlay drawer-overlay" data-overlay style="place-items:stretch start"><div class="drawer left sidebar" role="dialog" aria-modal="true" aria-label="Menu" style="position:static;height:100%"><div class="side-inner">${sidebar(route())}</div></div></div>`;
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
    <aside class="sidebar"><div class="side-inner">${sidebar(r)}</div></aside>
    <div class="main">${topbar()}<main class="content" id="main">${page(r)}</main>${bottomNav(r)}</div>
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
  focus(t) { const pm = /^f-(?:pdf(\d)|signature)$/.exec(t.dataset.id); if (pm) { ui.page = Number(pm[1] || 3); render(); } const el = document.getElementById(t.dataset.id) || document.getElementById(t.dataset.id + '-add'); if (el) { el.scrollIntoView({ block: 'center' }); el.focus({ preventScroll: true }); } },
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
      const rec = { community: d.community, kind: 'work', title: d.title, type: d.type, property: d.property, units: d.units, from: d.from, to: d.to, hours: `${d.start}–${d.end}`, status: 'review', updated: TODAY, workers: d.workers, vehicles: d.noVehicles ? [] : d.vehicles, materials: d.noMaterials ? 0 : d.materials.length, docs: Object.keys(d.docs).filter(k => d.docs[k].file).map(k => DOCS[k].name) };
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
  pdfPage(t) { ui.page = Number(t.dataset.id); render(); },
  openSign() { ui.modal = { type: 'sign', data: { name: S.profile.name, ok: false } }; render(); },
  sigClear() { setupCanvas(); },
  saveSign() {
    const m = ui.modal, errs = {};
    if (!m.data.name.trim()) errs.name = 'Enter your full name.';
    if (!m.data.ok) errs.ok = 'Tick the box to confirm.';
    if (ui.signMode === 'draw' && !sigDirty) errs.draw = 'Draw your signature in the box, or switch to Type.';
    if (Object.keys(errs).length) { m.errs = errs; const c = document.getElementById('sig-canvas'); const img = c && sigDirty ? c.toDataURL() : null; render(); if (img) restoreCanvas(img); return; }
    S.draft.signature = ui.signMode === 'draw' ? { type: 'draw', data: document.getElementById('sig-canvas').toDataURL('image/png'), name: m.data.name } : { type: 'typed', text: m.data.name, name: m.data.name };
    ui.modal = null; persistDraft(); toast('Signature added to page 3'); render();
  },
  clearSign() { openConfirm({ title: 'Remove your signature?', message: 'You will need to sign again before submitting.', confirmText: 'Remove signature', tone: 'danger', onConfirm: () => { S.draft.signature = null; persist(); } }); },
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
    openConfirm({ title: 'Change your password?', message: 'You will be signed out on all other devices.', confirmText: 'Change password', icon: 'key', onConfirm: () => { ui.pw = { current: '', next: '', confirm: '', show: false }; S.sessions = S.sessions.filter(s => s.current); persist(); toast('Password changed. Other devices were signed out.'); } });
  },
  endSession(t) { const s = S.sessions.find(x => x.id === t.dataset.id); openConfirm({ title: `Sign out ${s.device}?`, message: `${s.where} · ${s.when}. Anyone using it will need to sign in again.`, confirmText: 'Sign out device', tone: 'warn', icon: 'logout', onConfirm: () => { S.sessions = S.sessions.filter(x => x !== s); persist(); toast('Device signed out'); } }); },
  endAllSessions() { openConfirm({ title: 'Sign out all other devices?', message: `${plural(S.sessions.length - 1, 'device')} will be signed out. You stay signed in here.`, confirmText: 'Sign out all', tone: 'warn', icon: 'logout', onConfirm: () => { S.sessions = S.sessions.filter(x => x.current); persist(); toast('All other devices signed out'); } }); },
  deactivate() { openConfirm({ title: 'Deactivate your account?', message: `${S.company.name} and ${plural(S.team.length, 'team member')} lose access to every community. Approved passes are cancelled.`, confirmText: 'Deactivate account', tone: 'danger', icon: 'alert', requireText: 'DEACTIVATE', onConfirm: () => toast('Account deactivation requested (preview)') }); },
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
  inviteMember() { ui.modal = { type: 'invite', data: { name: '', email: '', role: 'Requester' } }; render(); },
  sendInvite() { const m = ui.modal, d = m.data, errs = {}; if (!d.name.trim()) errs.name = 'Enter their name.'; if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) errs.email = 'Enter a valid email address.'; else if (S.team.some(t => t.email === d.email)) errs.email = 'This person is already on your team.'; if (Object.keys(errs).length) { m.errs = errs; render(); return; } S.team.push({ id: uid('t'), name: d.name, email: d.email, role: d.role, status: 'invited', last: 'Invite sent ' + fmtS(TODAY) }); ui.modal = null; persist(); toast(`Invite sent to ${d.email}`); render(); },
  resendInvite(t) { const m = S.team.find(x => x.id === t.dataset.id); m.last = 'Invite sent ' + fmtS(TODAY); persist(); toast(`Invite resent to ${m.email}`); render(); },
  removeMember(t) { const m = S.team.find(x => x.id === t.dataset.id); openConfirm({ title: `Remove ${m.name}?`, message: `${m.email} will lose access to the portal immediately. Passes they submitted stay active.`, confirmText: 'Remove member', tone: 'danger', onConfirm: () => { S.team = S.team.filter(x => x !== m); persist(); toast(`${m.name} removed`); } }); },
};
function restoreCanvas(src) { const c = document.getElementById('sig-canvas'); if (!c) return; const img = new Image(); img.onload = () => { const x = c.getContext('2d'); x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(img, 0, 0); x.restore(); sigDirty = true; }; img.src = src; }
const CHANGE = {
  sort(el) { ui.sort = el.value; render(); },
  peopleFilter(el) { ui.peopleFilter = el.value; render(); },
  helpRef(el) { ui.helpRef = el.value; },
  showPw(el) { ui.pw.show = el.checked; render(); },
  signMode(el) { ui.signMode = el.value; render(); },
  twofa(el) {
    el.checked = S.twofa;
    if (S.twofa) openConfirm({ title: 'Turn off two-step verification?', message: 'Your account will be protected by your password only.', confirmText: 'Turn off', tone: 'danger', icon: 'shield', onConfirm: () => { S.twofa = false; persist(); toast('Two-step verification turned off'); } });
    else openConfirm({ title: 'Turn on two-step verification?', message: `We'll text a 6-digit code to ${S.profile.phone} each time you sign in on a new device.`, confirmText: 'Turn on', icon: 'shield', onConfirm: () => { S.twofa = true; persist(); toast('Two-step verification is on'); } });
  },
  changeRole(el) {
    const m = S.team.find(x => x.id === el.dataset.id), to = el.value, from = m.role;
    el.value = from;
    openConfirm({ title: `Make ${m.name} ${/^[AEIOU]/.test(to) ? 'an' : 'a'} ${to}?`, message: ROLES[to], confirmText: 'Change role', icon: 'users', onConfirm: () => { m.role = to; persist(); toast(`${m.name} is now ${to}`); } });
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
