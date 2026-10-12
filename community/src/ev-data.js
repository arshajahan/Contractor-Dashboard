/* Events dataset (separate from Work permits). All names are fictional. */
const EV_KEY = 'buzzin-ev-v1';
const EV_LOGO = { data: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="72" viewBox="0 0 240 72"><circle cx="36" cy="36" r="26" fill="#0E7C66"/><path d="M23 42 36 22l13 20z" fill="#fff"/><rect x="30" y="38" width="12" height="10" fill="#fff"/><text x="74" y="34" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="24" fill="#0B3B32">Buzzin</text><text x="75" y="55" font-family="Arial,Helvetica,sans-serif" font-size="13" letter-spacing="3" fill="#0E7C66">COMMUNITY</text></svg>'), tone: 'dark', bg: 'auto' };
const nowISO = () => { const d = new Date(NOW.getTime() + Math.max(0, Date.now() - (window.__loadedAt || Date.now()))); return iso(d) + 'T' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
const FIELD_DEFS = [['name', 'Full name', 'always'], ['email', 'Email', 'always'], ['phone', 'Phone number'], ['company', 'Company or unit'], ['idNumber', 'ID number'], ['vehicle', 'Vehicle plate'], ['guests', 'Number of guests']];
const GATES = ['Main entrance', 'Hall door', 'Side gate'];

function seedEV() {
  const F1 = ['Aisha', 'Omar', 'Lina', 'Yusuf', 'Maria', 'Chen', 'Noor', 'Daniel', 'Sara', 'Ravi', 'Elena', 'Hassan', 'Mei', 'Karim', 'Sofia', 'Tariq', 'Priya', 'Marcus', 'Layla', 'Viktor', 'Nadia', 'Joao', 'Amira', 'Ben', 'Fatima', 'Leo', 'Zara', 'Imran', 'Julia', 'Samir'];
  const L1 = ['Khan', 'Haddad', 'Silva', 'Nair', 'Petrova', 'Webb', 'Rossi', 'Demir', 'Novak', 'Patel', 'Ali', 'Perera', 'Chen', 'Farouk', 'Mansoor', 'Reyes', 'Torres', 'Idris', 'Okoro', 'Lindqvist'];
  const CO = ['Unit 204', 'Unit 305', 'Villa 12', 'Villa 7', 'Unit 410', 'Retail R-02', 'Sample Contracting', 'Northside Services', 'Bright Works LLC', 'Unit 118', 'Villa 3', 'Unit 220'];
  let n = 0;
  const mkPeople = (count, evDate, o) => Array.from({ length: count }, (_, i) => {
    n++; const f = F1[(n * 7) % F1.length], l = L1[(n * 11) % L1.length], reg = addDays(evDate, -(3 + (n % 12))) + 'T' + String(8 + (n % 10)).padStart(2, '0') + ':' + String((n * 13) % 60).padStart(2, '0');
    const st = o.status(i, count);
    const r = { id: 'r' + n, name: `${f} ${l}`, email: `${f}.${l}${n}@mail.example`.toLowerCase(), phone: '+971 50 ' + String(200 + (n * 37) % 700) + ' ' + String(1000 + (n * 91) % 9000), company: CO[(n * 5) % CO.length], regAt: reg, source: n % 3 ? 'invite' : 'link', status: st, guests: n % 5 === 0 ? 2 : 0 };
    if (st === 'checked-in') { r.checkin = { ts: evDate + 'T' + String(o.hour + (i % 3 === 0 ? 0 : 0)).padStart(2, '0') + ':' + String(Math.min(59, 2 + (i * 3) % 55)).padStart(2, '0'), gate: GATES[i % 3], by: i % 4 ? 'QR scan' : 'Manual' }; }
    return r;
  });
  const inv = (count, evDate, reg) => Array.from({ length: count }, (_, i) => { n++; const f = F1[(n * 3) % F1.length], l = L1[(n * 5) % L1.length]; return { id: 'i' + n, name: `${f} ${l}`, email: `${f}.${l}${n}@mail.example`.toLowerCase(), company: CO[(n * 3) % CO.length], status: i < reg ? 'registered' : 'invited', sentAt: addDays(evDate, -10) + 'T09:00' }; });
  const FIELDS = (o) => Object.assign({ name: 'required', email: 'required', phone: 'optional', company: 'optional', idNumber: 'hidden', vehicle: 'hidden', guests: 'hidden' }, o);
  const events = [
    { id: 'e1', title: 'Residents’ safety briefing', property: 'residences', location: 'Community hall, ground floor', date: '2026-10-14', start: '18:00', end: '19:30', tolerance: 30, organizer: 'Lena Fischer', organizerEmail: 'events@buzzin-community.example', privacy: 'private', limit: 120, status: 'published', desc: 'Fire safety, evacuation routes and a short question session with the Civil Defence team. Light refreshments are served.', acceptance: { required: true, text: 'I agree to follow the venue rules and safety instructions given on the evening.' }, fields: FIELDS({ phone: 'required', guests: 'optional' }), custom: [{ id: 'cf1', label: 'Do you need step-free access?', required: false }], accent: '#6B4EE6',
      regs: mkPeople(74, '2026-10-14', { status: (i) => i === 5 ? 'cancelled' : 'registered', hour: 18 }), invites: inv(96, '2026-10-14', 62) },
    { id: 'e2', title: 'Contractor induction day', property: 'offices', location: 'Training room, Technohub 1', date: '2026-10-12', start: '09:00', end: '11:00', tolerance: 20, organizer: 'Lena Fischer', organizerEmail: 'events@buzzin-community.example', privacy: 'private', limit: 40, status: 'published', desc: 'Site rules, gate procedures and how to use work permits. Required for all new contractor staff.', acceptance: { required: true, text: 'I have read the contractor rules and agree to follow them on site.' }, fields: FIELDS({ company: 'required', idNumber: 'required', vehicle: 'optional' }), custom: [], accent: '#0E7C66',
      regs: mkPeople(31, '2026-10-12', { status: (i) => i < 18 ? 'checked-in' : 'registered', hour: 8 }), invites: inv(38, '2026-10-12', 31) },
    { id: 'e3', title: 'Diwali community evening', property: 'retail', location: 'Plaza courtyard', date: '2026-10-24', start: '17:00', end: '21:00', tolerance: 60, organizer: 'Lena Fischer', organizerEmail: 'events@buzzin-community.example', privacy: 'public', limit: 300, status: 'published', desc: 'Lights, food stalls and live music for the whole community. Open to residents and their guests.', acceptance: { required: false, text: '' }, fields: FIELDS({ guests: 'required' }), custom: [{ id: 'cf2', label: 'Any dietary requirements?', required: false }], accent: '#E8A33A',
      regs: mkPeople(58, '2026-10-24', { status: () => 'registered', hour: 17 }), invites: [] },
    { id: 'e4', title: 'Fire drill: Buzzin offices', property: 'offices', location: 'All floors', date: '2026-10-19', start: '11:00', end: '11:45', tolerance: 0, organizer: 'Omar Siddiqui', organizerEmail: 'security@buzzin-community.example', privacy: 'private', limit: 0, status: 'published', desc: 'Annual evacuation drill. Floor wardens register their team in advance.', acceptance: { required: false, text: '' }, fields: FIELDS({ company: 'required' }), custom: [], accent: '#D14B3D',
      regs: mkPeople(22, '2026-10-19', { status: () => 'registered', hour: 11 }), invites: inv(30, '2026-10-19', 22) },
    { id: 'e5', title: 'Summer pool party', property: 'residences', location: 'Pool deck', date: '2026-09-20', start: '16:00', end: '20:00', tolerance: 30, organizer: 'Lena Fischer', organizerEmail: 'events@buzzin-community.example', privacy: 'public', limit: 250, status: 'published', desc: 'Music, games and a barbecue by the pool.', acceptance: { required: true, text: 'I accept the pool safety rules.' }, fields: FIELDS({ guests: 'optional' }), custom: [], accent: '#2A8FD6',
      regs: mkPeople(120, '2026-09-20', { status: (i) => i % 6 === 5 ? 'no-show' : 'checked-in', hour: 16 }), invites: [] },
    { id: 'e6', title: 'Winter market', property: 'retail', location: 'Plaza courtyard', date: '2026-12-05', start: '14:00', end: '20:00', tolerance: 30, organizer: 'Lena Fischer', organizerEmail: 'events@buzzin-community.example', privacy: 'public', limit: 400, status: 'draft', desc: '', acceptance: { required: false, text: '' }, fields: FIELDS({}), custom: [], accent: '#6B4EE6', regs: [], invites: [] },
    { id: 'e7', title: 'Iftar gathering', property: 'residences', location: 'Community hall', date: '2026-03-12', start: '18:15', end: '21:00', tolerance: 30, organizer: 'Lena Fischer', organizerEmail: 'events@buzzin-community.example', privacy: 'private', limit: 150, status: 'archived', desc: 'Shared iftar for residents.', acceptance: { required: false, text: '' }, fields: FIELDS({}), custom: [], accent: '#0E7C66', regs: mkPeople(40, '2026-03-12', { status: (i) => i % 8 === 7 ? 'no-show' : 'checked-in', hour: 18 }), invites: [] },
  ];
  events.forEach(e => { if (e.fields.guests === 'hidden') e.regs.forEach(r => { r.guests = 0; }); });
  const tpl = (subject, top, bottom, accent) => ({ subject, accent, banner: null, top, bottom });
  return { v: 1, community: { id: 'buzzin', name: 'Buzzin community', area: 'Dubai Silicon Oasis', email: 'events@buzzin-community.example', logo: EV_LOGO }, user: { id: 'u9', name: 'Lena Fischer', title: 'Events manager', email: 'lena.fischer@buzzin-community.example', phone: '+971 50 111 3030' },
    events, notifications: [{ id: 'n1', title: 'Contractor induction day starts at 09:00', body: '31 registered, 18 checked in', when: 'Now', go: 'event-e2', unread: true }, { id: 'n2', title: 'Residents’ safety briefing is 62% full', body: '74 of 120 places taken', when: 'Yesterday', go: 'event-e1', unread: true }, { id: 'n3', title: 'Winter market is still a draft', body: 'Publish it to open registration', when: '2 days ago', go: 'event-e6', unread: false }],
    templates: { registration: tpl('You’re registered for {event}', '<p>Hi {name},</p><p>Thanks for registering. We look forward to seeing you.</p>', '<p>Need to change your plans? Reply to this email.</p>', '#6B4EE6'), qr: tpl('Your entry QR code for {event}', '<p>Hi {name},</p><p>Show this QR code at the entrance. Screenshots work too.</p>', '<p>Each code works once per person.</p>', '#6B4EE6'), reminder: tpl('Reminder: {event} is tomorrow', '<p>Hi {name},</p><p>Just a reminder that {event} is coming up.</p>', '<p>Can’t make it? Let us know so we can free your place.</p>', '#6B4EE6') },
    settings: { tolerance: 30, organizer: 'Lena Fischer', organizerEmail: 'events@buzzin-community.example', accent: '#6B4EE6', notifyLimit: true, notifyDigest: true, defaultPrivacy: 'private' },
    sent: [{ id: 's1', ts: '2026-10-11T10:00', kind: 'Reminder', event: 'e1', count: 41 }, { id: 's2', ts: '2026-10-10T15:20', kind: 'Invitation', event: 'e4', count: 30 }] };
}
function validEV(x) { return !!(x && x.v === 1 && Array.isArray(x.events) && x.events.every(e => Array.isArray(e.regs) && Array.isArray(e.invites) && e.fields) && x.templates && x.settings && x.user); }

/* ---------- selectors ---------- */
const evById = id => S.events.find(e => e.id === id);
const me = () => S.user;
const evState = e => e.status === 'archived' ? 'archived' : e.status === 'draft' ? 'draft' : e.date < TODAY ? 'past' : e.date === TODAY ? 'today' : 'upcoming';
const EVB = { upcoming: ['Upcoming', 'info'], today: ['Today', 'ok'], past: ['Finished', 'neutral'], draft: ['Draft', 'warn'], archived: ['Archived', 'neutral'] };
const evBadge = e => badge(...EVB[evState(e)]);
const activeRegs = e => e.regs.filter(r => r.status !== 'cancelled');
const arrived = e => e.regs.filter(r => r.status === 'checked-in');
const headcount = r => 1 + (r.guests || 0);
const evPeople = e => sum(activeRegs(e).map(headcount));
const evProp = e => { const p = { offices: 'Buzzin offices', residences: 'Buzzin residences', retail: 'Buzzin retail plaza' }; return p[e.property] || e.property; };
const PROPS = [['offices', 'Buzzin offices'], ['residences', 'Buzzin residences'], ['retail', 'Buzzin retail plaza']];
const dateBlock = d => `<span class="date-block"><small>${D(d).toLocaleDateString('en-GB', { month: 'short' })}</small><b>${D(d).getDate()}</b></span>`;
const timeRange = e => `${e.start}–${e.end}`;
const fillPct = e => e.limit ? Math.round(activeRegs(e).length / e.limit * 100) : null;
const regLink = e => `https://events.buzzin.example/${S.community.id}/${e.id}`;
const REG_BADGE = { registered: ['Registered', 'info'], 'checked-in': ['Checked in', 'ok'], cancelled: ['Cancelled', 'neutral'], 'no-show': ['No-show', 'warn'] };
