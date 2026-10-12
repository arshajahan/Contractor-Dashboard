/* Work permits dataset (shared by the Community Admin and Approver files). All names and figures are fictional. */
const WP_KEY = 'buzzin-wp-v1';
const BUZZIN_LOGO = { data: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="72" viewBox="0 0 240 72"><circle cx="36" cy="36" r="26" fill="#0E7C66"/><path d="M23 42 36 22l13 20z" fill="#fff"/><rect x="30" y="38" width="12" height="10" fill="#fff"/><text x="74" y="34" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="24" fill="#0B3B32">Buzzin</text><text x="75" y="55" font-family="Arial,Helvetica,sans-serif" font-size="13" letter-spacing="3" fill="#0E7C66">COMMUNITY</text></svg>'), tone: 'dark', bg: 'auto' };
const ALL_TYPE_IDS = ['general', 'fitout', 'maintenance', 'hot'];
const DOC_LABELS = { scope: 'Scope of Work Form', risk: 'Risk assessment', drawings: 'Approved layout drawings', car: 'Contractor all-risk insurance', hotwork: 'Hot work method statement', amc: 'Annual maintenance contract' };

function seedWP() {
  const P = (id, name, role, idType, idNo, idExpiry, company) => ({ id, name, role, idType, idNo, idExpiry, company, phone: '+971 50 ' + String(100000 + id.slice(1) * 7919).slice(0, 3) + ' ' + String(1000 + id.slice(1) * 37).slice(0, 4) });
  const people = [
    P('w1', 'Alex Morgan', 'HVAC technician', 'Emirates ID', '784-1990-1234567-1', '2027-03-31', 'c1'), P('w2', 'Priya Nair', 'Site supervisor', 'Emirates ID', '784-1988-7654321-2', '2027-08-14', 'c1'),
    P('w3', 'Omar Haddad', 'Electrician', 'Emirates ID', '784-1993-1122334-5', '2026-10-24', 'c1'), P('w4', 'Daniel Reyes', 'Helper', 'Passport', 'P1234567', '2027-04-02', 'c1'),
    P('w5', 'Karim Aziz', 'Site supervisor', 'Emirates ID', '784-1985-4455667-1', '2027-05-12', 'c2'), P('w6', 'Leila Farouk', 'Joiner', 'Emirates ID', '784-1991-2233445-6', '2027-02-09', 'c2'),
    P('w7', 'Joao Silva', 'Carpenter', 'Emirates ID', '784-1989-9988776-4', '2027-06-30', 'c2'), P('w8', 'Tariq Mansoor', 'Painter', 'Emirates ID', '784-1994-1212121-3', '2027-09-18', 'c2'),
    P('w9', 'Sunil Perera', 'Helper', 'Passport', 'N8821934', '2028-01-20', 'c2'), P('w10', 'Mei Chen', 'Glazier', 'Emirates ID', '784-1992-5566778-2', '2027-03-03', 'c2'),
    P('w11', 'Ravi Patel', 'Glazier', 'Emirates ID', '784-1990-3344556-7', '2027-07-21', 'c2'), P('w12', 'Hassan Ali', 'Fitter', 'Emirates ID', '784-1995-9988775-3', '2026-10-26', 'c2'),
    P('w13', 'Nadia Kamel', 'Helper', 'Emirates ID', '784-1996-1357913-5', '2027-01-15', 'c2'), P('w14', 'Elena Petrova', 'Electrician', 'Emirates ID', '784-1987-2468024-6', '2027-10-05', 'c3'),
    P('w15', 'Marcus Webb', 'Electrician', 'Passport', 'K5529187', '2027-12-01', 'c3'), P('w16', 'Sofia Rossi', 'Painter', 'Emirates ID', '784-1993-8642086-2', '2027-04-27', 'c3'),
    P('w17', 'Yusuf Demir', 'Helper', 'Emirates ID', '784-1997-1928374-8', '2026-11-14', 'c3'), P('w18', 'Viktor Novak', 'Welder', 'Emirates ID', '784-1986-7531975-3', '2027-02-26', 'c4'),
    P('w19', 'Ahmed Zaki', 'Welder', 'Emirates ID', '784-1991-3692581-4', '2027-08-09', 'c4'), P('w20', 'Luis Ortega', 'Fitter', 'Passport', 'X7712093', '2027-05-30', 'c4'), P('w21', 'Bilal Khan', 'Fire watch', 'Emirates ID', '784-1994-1593578-9', '2027-09-02', 'c4'),
  ];
  const pt = [
    { id: 'general', name: 'General work permit', desc: 'Repairs, installations and general contractor work.', properties: ['offices', 'residences', 'retail'], maxEmployees: 10, maxDays: 30, timeIn: '08:00', timeOut: '18:00', price: 0, workflow: ['Security'],
      docs: [{ slot: 'Document 1', label: 'Scope of Work Form', required: true, noExpiry: true, template: 'scope-of-work.pdf' }, { slot: 'Document 2', label: 'Risk assessment', required: false, noExpiry: true, template: 'risk-assessment.pdf' }, { slot: 'Document 3', label: '', required: false, noExpiry: true, template: '' }] },
    { id: 'fitout', name: 'Minor fit-out work', desc: 'Partitions, flooring, ceilings and joinery.', properties: ['offices', 'residences'], maxEmployees: 8, maxDays: 60, timeIn: '08:00', timeOut: '18:00', price: 150, workflow: ['Security', 'Operations'],
      docs: [{ slot: 'Document 1', label: 'Scope of Work Form', required: true, noExpiry: true, template: 'scope-of-work.pdf' }, { slot: 'Document 2', label: 'Approved layout drawings', required: true, noExpiry: true, template: '' }, { slot: 'Document 3', label: 'Contractor all-risk insurance', required: true, noExpiry: false, template: '' }] },
    { id: 'maintenance', name: 'Maintenance work', desc: 'Planned or reactive maintenance, including AMC visits.', properties: ['offices', 'residences', 'retail'], maxEmployees: 6, maxDays: 14, timeIn: '08:00', timeOut: '18:00', price: 0, workflow: ['Security'],
      docs: [{ slot: 'Document 1', label: 'Scope of Work Form', required: true, noExpiry: true, template: 'scope-of-work.pdf' }, { slot: 'Document 2', label: 'Risk assessment', required: false, noExpiry: true, template: 'risk-assessment.pdf' }, { slot: 'Document 3', label: 'Annual maintenance contract', required: false, noExpiry: false, template: '' }] },
    { id: 'hot', name: 'Hot work', desc: 'Welding, cutting, grinding or any open flame.', properties: ['offices'], maxEmployees: 4, maxDays: 5, timeIn: '09:00', timeOut: '16:00', price: 250, workflow: ['Security', 'Operations'],
      docs: [{ slot: 'Document 1', label: 'Scope of Work Form', required: true, noExpiry: true, template: 'scope-of-work.pdf' }, { slot: 'Document 2', label: 'Risk assessment', required: true, noExpiry: true, template: 'risk-assessment.pdf' }, { slot: 'Document 3', label: 'Hot work method statement', required: true, noExpiry: true, template: 'hot-work-method.pdf' }] },
  ];
  const properties = [
    { id: 'offices', name: 'Buzzin offices', address: 'Technohub 1, Dubai Silicon Oasis', units: ['Unit 101', 'Unit 102', 'Unit 123', 'Unit 204', 'Unit 220', 'Unit 410', 'Unit 512', 'Unit 909', 'Lobby', 'Roof'], levels: { Security: 2, Operations: 1 }, required: { unit: true, siteContact: true, materials: false, vehicleDocs: true, workerIdCopy: true } },
    { id: 'residences', name: 'Buzzin residences', address: 'Residence Row, Dubai Silicon Oasis', units: ['Unit 204', 'Unit 220', 'Unit 305', 'Unit 410'], levels: { Security: 1, Operations: 1 }, required: { unit: true, siteContact: true, materials: true, vehicleDocs: true, workerIdCopy: true } },
    { id: 'retail', name: 'Buzzin retail plaza', address: 'Plaza Level, Dubai Silicon Oasis', units: ['Retail R-01', 'Retail R-02', 'Retail R-03', 'Retail R-04'], levels: { Security: 1, Operations: 0 }, required: { unit: true, siteContact: false, materials: false, vehicleDocs: false, workerIdCopy: true } },
  ];
  const contractors = [
    { id: 'c1', name: 'Sample Contracting', contact: 'Alex Morgan', email: 'alex@samplecontracting.example', phone: '+971 50 000 0000', status: 'active', since: '2025-02-11', licence: { no: 'DED-482913', expiry: '2027-03-14' }, insurance: { name: 'Public liability insurance', expiry: '2026-10-28' }, trn: '100000678922' },
    { id: 'c2', name: 'Northside Services', contact: 'Karim Aziz', email: 'ops@northside.example', phone: '+971 55 210 4410', status: 'active', since: '2025-06-03', licence: { no: 'DED-310442', expiry: '2026-10-25' }, insurance: { name: 'Public liability insurance', expiry: '2027-01-31' }, trn: '100000554031' },
    { id: 'c3', name: 'Bright Works LLC', contact: 'Elena Petrova', email: 'office@brightworks.example', phone: '+971 52 880 1932', status: 'active', since: '2025-09-18', licence: { no: 'DED-559120', expiry: '2027-08-02' }, insurance: { name: 'Public liability insurance', expiry: '2027-04-10' }, trn: '100000771245' },
    { id: 'c4', name: 'Apex Metalworks', contact: 'Viktor Novak', email: 'viktor@apexmetal.example', phone: '+971 56 400 7781', status: 'active', since: '2026-02-24', licence: { no: 'DED-702315', expiry: '2026-09-30' }, insurance: { name: 'Public liability insurance', expiry: '2027-02-01' }, trn: '100000902117' },
    { id: 'c5', name: 'Harbour Interiors', contact: 'Rania Saleh', email: 'rania@harbourinteriors.example', phone: '+971 54 330 9012', status: 'pending', since: null, requested: '2026-10-10T16:05', licence: { no: 'DED-811204', expiry: '2027-05-19' }, insurance: { name: 'Public liability insurance', expiry: '2027-03-05' }, trn: '100000336690' },
    { id: 'c6', name: 'Coastal Cleaning Co.', contact: 'Ben Alvarez', email: 'ben@coastalclean.example', phone: '+971 50 771 4420', status: 'suspended', since: '2025-04-15', suspended: { on: '2026-09-22', reason: 'Repeated entries outside approved hours.' }, licence: { no: 'DED-224019', expiry: '2027-01-12' }, insurance: { name: 'Public liability insurance', expiry: '2026-12-15' }, trn: '100000118843' },
  ];
  const team = [
    { id: 'u1', name: 'Maya Khan', email: 'maya.khan@buzzin-community.example', phone: '+971 50 111 2020', title: 'Community manager', role: 'admin', status: 'active', last: 'Today, 08:41' },
    { id: 'u2', name: 'Omar Siddiqui', email: 'omar.siddiqui@buzzin-community.example', phone: '+971 50 111 2121', title: 'Security supervisor', role: 'approver', dept: 'Security', level: 1, properties: ['offices'], logs: false, notify: true, status: 'active', last: 'Today, 09:12' },
    { id: 'u3', name: 'Daniel Okoro', email: 'daniel.okoro@buzzin-community.example', phone: '+971 50 111 2222', title: 'Head of security', role: 'approver', dept: 'Security', level: 2, properties: ['offices', 'residences'], logs: true, notify: true, status: 'active', last: 'Yesterday, 17:30' },
    { id: 'u4', name: 'Priya Rao', email: 'priya.rao@buzzin-community.example', phone: '+971 50 111 2323', title: 'Operations lead', role: 'approver', dept: 'Operations', level: 1, properties: ['offices', 'residences'], logs: false, notify: true, status: 'active', last: 'Today, 07:55' },
    { id: 'u5', name: 'Sara Lindqvist', email: 'sara.lindqvist@buzzin-community.example', phone: '+971 50 111 2424', title: 'Security officer', role: 'approver', dept: 'Security', level: 1, properties: ['residences', 'retail'], logs: false, notify: true, status: 'invited', last: 'Invite sent 9 Oct' },
    { id: 'u6', name: 'Hamza Idris', email: 'hamza.idris@buzzin-community.example', phone: '+971 50 111 2525', title: 'Facilities director', role: 'admin', status: 'active', last: '9 Oct, 16:02' },
  ];
  const security = [
    { id: 'g1', name: 'Rashid Ali', phone: '+971 50 900 1001', username: 'rashid.ali', properties: ['offices'], gate: 'Gate A (main)', status: 'active', last: 'Today, 06:02' },
    { id: 'g2', name: 'Ben Torres', phone: '+971 50 900 1002', username: 'ben.torres', properties: ['offices', 'residences'], gate: 'Gate B (service)', status: 'active', last: 'Today, 07:48' },
    { id: 'g3', name: 'Noor Hassan', phone: '+971 50 900 1003', username: 'noor.hassan', properties: ['retail'], gate: 'Plaza gate', status: 'active', last: 'Yesterday, 22:05' },
    { id: 'g4', name: 'Imran Qureshi', phone: '+971 50 900 1004', username: 'imran.q', properties: ['offices'], gate: 'Gate A (main)', status: 'disabled', last: '28 Sep' },
  ];
  const H = (ts, actor, action, note) => ({ ts, actor, action, note: note || '' });
  const sub = (ts) => H(ts, 'Contractor', 'Request submitted');
  const sampleTerms = (by, pos, at) => ({ name: 'Contractor terms & community guidelines', version: 3, signedBy: by, position: pos, signedAt: at, ticked: 8, of: 8 });
  const mk = o => Object.assign({ stage: 0, status: 'review', checks: { documents: false, people: false, company: false }, notes: '', vehicles: [], materials: [], people: [], docs: [], history: [], flagsAck: false }, o);
  const D1 = (label, file, expiry, noExpiry) => ({ label, file, expiry: expiry || '', noExpiry: !!noExpiry });
  const requests = [
    mk({ id: 'BZ-1048', title: 'HVAC maintenance', type: 'maintenance', contractor: 'c1', property: 'offices', unit: 'Unit 101', from: '2026-10-14', to: '2026-10-17', hours: '09:00–17:00', submitted: '2026-10-10T02:30', people: ['w1', 'w3', 'w4'], vehicles: [{ plate: 'Dubai N 12345', type: 'Van', make: 'Toyota Hiace' }], materials: [{ name: 'Refrigerant R410A', qty: 2, unit: 'cylinders' }, { name: 'Filter set', qty: 6, unit: 'pcs' }], docs: [D1('Scope of Work Form', 'scope-of-work-hvac.pdf', '', true), D1('Risk assessment', 'risk-assessment-hvac.pdf', '', true)], description: 'Quarterly service of the air-conditioning system serving the open-plan office. Includes filter replacement and a refrigerant pressure check.', contact: 'Priya Nair', phone: '+971 50 000 0002', terms: sampleTerms('Alex Morgan', 'Operations manager', '2026-10-10T02:28'), history: [sub('2026-10-10T02:30')] }),
    mk({ id: 'BZ-1052', title: 'Office fit-out', type: 'fitout', contractor: 'c2', property: 'offices', unit: 'Unit 909', from: '2026-10-14', to: '2026-10-28', hours: '08:00–18:00', submitted: '2026-10-10T08:40', stage: 1, people: ['w5', 'w6', 'w7', 'w8', 'w9'], vehicles: [{ plate: 'Sharjah 3 45821', type: 'Pickup', make: 'Nissan Navara' }], materials: [{ name: 'Gypsum board', qty: 120, unit: 'sheets' }, { name: 'Aluminium studs', qty: 300, unit: 'pcs' }, { name: 'Emulsion paint', qty: 24, unit: 'buckets' }], docs: [D1('Scope of Work Form', 'scope-fitout-909.pdf', '', true), D1('Approved layout drawings', 'layout-909-rev3.pdf', '', true), D1('Contractor all-risk insurance', 'car-northside-2026.pdf', '2027-01-31')], description: 'Partition walls, ceiling and flooring for a new open office layout. Noisy work (drilling) between 09:00 and 13:00 only.', contact: 'Karim Aziz', phone: '+971 55 210 4410', terms: sampleTerms('Karim Aziz', 'Site supervisor', '2026-10-10T08:35'), checks: { documents: true, people: true, company: false }, history: [sub('2026-10-10T08:40'), H('2026-10-11T10:12', 'Omar Siddiqui', 'Approved Security · Level 1', 'IDs and layout drawings checked.')] }),
    mk({ id: 'BZ-1053', title: 'Electrical inspection', type: 'general', contractor: 'c3', property: 'offices', unit: 'Unit 123', from: '2026-10-14', to: '2026-10-15', hours: '09:00–17:00', submitted: '2026-10-11T04:20', people: ['w14', 'w15'], docs: [D1('Scope of Work Form', 'scope-inspection-123.pdf', '', true), D1('Risk assessment', 'risk-electrical.pdf', '', true)], description: 'Annual inspection of the distribution board and emergency lighting.', contact: 'Elena Petrova', phone: '+971 52 880 1932', terms: sampleTerms('Elena Petrova', 'Director', '2026-10-11T04:15'), history: [sub('2026-10-11T04:20')] }),
    mk({ id: 'BZ-1054', title: 'Fire alarm service', type: 'maintenance', contractor: 'c1', property: 'offices', unit: 'Unit 101', from: '2026-10-15', to: '2026-10-16', hours: '10:00–16:00', submitted: '2026-10-11T08:10', people: ['w1', 'w2'], vehicles: [{ plate: 'Dubai N 12345', type: 'Van', make: 'Toyota Hiace' }], docs: [D1('Scope of Work Form', 'scope-fire-alarm.pdf', '', true)], description: 'Six-monthly functional test of the fire alarm panel and detectors. The system will be offline for short periods.', contact: 'Priya Nair', phone: '+971 50 000 0002', terms: sampleTerms('Alex Morgan', 'Operations manager', '2026-10-11T08:05'), history: [sub('2026-10-11T08:10')] }),
    mk({ id: 'BZ-1055', title: 'Interior partitioning', type: 'fitout', contractor: 'c2', property: 'residences', unit: 'Unit 220', from: '2026-10-19', to: '2026-10-30', hours: '09:00–17:00', submitted: '2026-10-11T15:30', people: ['w5', 'w6', 'w7', 'w9', 'w13', 'w8', 'w11'], docs: [D1('Scope of Work Form', 'scope-220.pdf', '', true), D1('Approved layout drawings', 'layout-220.pdf', '', true), D1('Contractor all-risk insurance', 'car-northside-2026.pdf', '2027-01-31')], materials: [{ name: 'Gypsum board', qty: 40, unit: 'sheets' }], description: 'Two new partitions to create a study room.', contact: 'Karim Aziz', phone: '+971 55 210 4410', terms: sampleTerms('Karim Aziz', 'Site supervisor', '2026-10-11T15:25'), history: [sub('2026-10-11T15:30')] }),
    mk({ id: 'BZ-1056', title: 'Painting works', type: 'general', contractor: 'c3', property: 'offices', unit: 'Unit 123', from: '2026-10-16', to: '2026-10-20', hours: '08:00–17:00', submitted: '2026-10-11T20:25', people: ['w16', 'w17', 'w14'], docs: [D1('Scope of Work Form', 'scope-painting-123.pdf', '', true)], materials: [{ name: 'Emulsion paint', qty: 12, unit: 'buckets' }, { name: 'Step ladder', qty: 2, unit: 'pcs' }], description: 'Repaint reception and meeting rooms.', contact: 'Sofia Rossi', phone: '+971 52 880 1932', terms: sampleTerms('Elena Petrova', 'Director', '2026-10-11T20:20'), history: [sub('2026-10-11T20:25')] }),
    mk({ id: 'BZ-1057', title: 'Lift inspection', type: 'maintenance', contractor: 'c1', property: 'offices', unit: 'Lobby', from: '2026-10-13', to: '2026-10-13', hours: '10:00–14:00', submitted: '2026-10-12T02:15', people: ['w1', 'w3'], docs: [D1('Scope of Work Form', 'scope-lift.pdf', '', true)], description: 'Annual lift safety inspection. Lifts 1 and 2 will be out of service for about an hour each.', contact: 'Priya Nair', phone: '+971 50 000 0002', terms: sampleTerms('Alex Morgan', 'Operations manager', '2026-10-12T02:10'), history: [sub('2026-10-12T02:15')] }),
    mk({ id: 'BZ-1058', title: 'General maintenance', type: 'general', contractor: 'c3', property: 'retail', unit: 'Retail R-03', from: '2026-10-20', to: '2026-10-21', hours: '08:00–12:00', submitted: '2026-10-12T06:30', people: ['w15'], docs: [D1('Scope of Work Form', 'scope-r03.pdf', '', true)], description: 'Replace a damaged ceiling panel and repair a door closer.', contact: 'Marcus Webb', phone: '+971 52 880 1932', terms: sampleTerms('Elena Petrova', 'Director', '2026-10-12T06:25'), history: [sub('2026-10-12T06:30')] }),
    mk({ id: 'BZ-1059', title: 'Balcony rail welding', type: 'hot', contractor: 'c4', property: 'offices', unit: 'Unit 512', from: '2026-10-14', to: '2026-10-15', hours: '09:00–16:00', submitted: '2026-10-10T19:20', stage: 2, people: ['w18', 'w19', 'w21'], vehicles: [{ plate: 'Ajman B 7710', type: 'Truck', make: 'Isuzu NPR' }], docs: [D1('Scope of Work Form', 'scope-welding-512.pdf', '', true), D1('Risk assessment', 'risk-hot-work.pdf', '', true), D1('Hot work method statement', 'method-statement-hot.pdf', '', true)], materials: [{ name: 'Welding set', qty: 1, unit: 'pcs' }, { name: 'Fire blanket', qty: 4, unit: 'pcs' }, { name: 'Extinguisher (CO2)', qty: 2, unit: 'pcs' }], description: 'Repair two balcony handrails. A fire watch will stay for 30 minutes after work stops.', contact: 'Viktor Novak', phone: '+971 56 400 7781', terms: sampleTerms('Viktor Novak', 'Owner', '2026-10-10T19:15'), checks: { documents: true, people: true, company: true }, history: [sub('2026-10-10T19:20'), H('2026-10-11T08:02', 'Omar Siddiqui', 'Approved Security · Level 1'), H('2026-10-11T13:40', 'Daniel Okoro', 'Approved Security · Level 2', 'Fire watch plan confirmed.')] }),
    mk({ id: 'BZ-1060', title: 'Glass partition installation', type: 'fitout', contractor: 'c2', property: 'offices', unit: 'Unit 410', from: '2026-10-22', to: '2026-10-28', hours: '08:00–19:00', submitted: '2026-10-11T12:30', people: ['w5', 'w6', 'w7', 'w9', 'w10', 'w11', 'w12', 'w13', 'w8'], docs: [D1('Scope of Work Form', 'scope-glass-410.pdf', '', true), D1('Approved layout drawings', 'layout-410.pdf', '', true), D1('Contractor all-risk insurance', 'car-northside-expiring.pdf', '2026-10-20')], materials: [{ name: 'Tempered glass panels', qty: 18, unit: 'pcs' }, { name: 'Glazing frames', qty: 18, unit: 'pcs' }], vehicles: [{ plate: 'Sharjah 3 45821', type: 'Pickup', make: 'Nissan Navara' }], description: 'Install glass partitions in the meeting suite. Delivery by crane lift on 22 October.', contact: 'Karim Aziz', phone: '+971 55 210 4410', terms: sampleTerms('Karim Aziz', 'Site supervisor', '2026-10-11T12:25'), history: [sub('2026-10-11T12:30')] }),
    // Waiting for the contractor
    mk({ id: 'BZ-1042', title: 'Office fit-out', type: 'fitout', contractor: 'c1', property: 'offices', unit: 'Unit 909', from: '2026-10-14', to: '2026-10-28', hours: '08:00–18:00', submitted: '2026-10-08T10:00', status: 'changes', people: ['w2', 'w4'], docs: [D1('Scope of Work Form', 'scope-fitout-909-v1.pdf', '', true), D1('Approved layout drawings', 'layout-909.pdf', '', true), D1('Contractor all-risk insurance', 'car-2026.pdf', '2027-02-15')], description: 'Fit-out of the executive suite.', contact: 'Priya Nair', phone: '+971 50 000 0002', terms: sampleTerms('Alex Morgan', 'Operations manager', '2026-10-08T09:55'), history: [sub('2026-10-08T10:00'), H('2026-10-09T14:20', 'Omar Siddiqui', 'Requested changes', 'Please upload a revised Scope of Work Form that shows the exact work area. List any drilling or noisy work and the times it will happen.')] }),
    // Approved (active or upcoming)
    mk({ id: 'BZ-1036', title: 'Electrical inspection', type: 'general', contractor: 'c1', property: 'offices', unit: 'Unit 123', from: '2026-10-09', to: '2026-10-13', hours: '09:00–17:00', submitted: '2026-10-05T09:00', status: 'approved', stage: 1, people: ['w3'], docs: [D1('Scope of Work Form', 'scope-electrical.pdf', '', true)], description: 'Inspection of the sub-distribution board.', contact: 'Omar Haddad', phone: '+971 50 000 0003', terms: sampleTerms('Alex Morgan', 'Operations manager', '2026-10-05T08:55'), checks: { documents: true, people: true, company: true }, history: [sub('2026-10-05T09:00'), H('2026-10-06T09:30', 'Omar Siddiqui', 'Approved Security · Level 1'), H('2026-10-06T10:05', 'Daniel Okoro', 'Final approval · pass issued')], passId: 'PS-3001' }),
    mk({ id: 'BZ-1038', title: 'Roof waterproofing', type: 'general', contractor: 'c2', property: 'offices', unit: 'Roof', from: '2026-10-11', to: '2026-10-14', hours: '08:00–16:00', submitted: '2026-10-07T11:00', status: 'approved', stage: 1, people: ['w6', 'w7', 'w9'], docs: [D1('Scope of Work Form', 'scope-roof.pdf', '', true)], description: 'Waterproof membrane repair.', contact: 'Karim Aziz', phone: '+971 55 210 4410', terms: sampleTerms('Karim Aziz', 'Site supervisor', '2026-10-07T10:55'), checks: { documents: true, people: true, company: true }, history: [sub('2026-10-07T11:00'), H('2026-10-08T09:00', 'Omar Siddiqui', 'Final approval · pass issued')], passId: 'PS-3002' }),
    mk({ id: 'BZ-1040', title: 'Carpet replacement', type: 'general', contractor: 'c3', property: 'residences', unit: 'Unit 305', from: '2026-10-13', to: '2026-10-20', hours: '09:00–17:00', submitted: '2026-10-08T13:00', status: 'approved', stage: 1, people: ['w16', 'w17'], docs: [D1('Scope of Work Form', 'scope-carpet.pdf', '', true)], description: 'Replace living room carpet.', contact: 'Sofia Rossi', phone: '+971 52 880 1932', terms: sampleTerms('Elena Petrova', 'Director', '2026-10-08T12:55'), checks: { documents: true, people: true, company: true }, history: [sub('2026-10-08T13:00'), H('2026-10-09T10:00', 'Sara Lindqvist', 'Final approval · pass issued')], passId: 'PS-3003' }),
    mk({ id: 'BZ-1041', title: 'Fire door installation', type: 'general', contractor: 'c4', property: 'offices', unit: 'Unit 204', from: '2026-10-15', to: '2026-10-16', hours: '09:00–17:00', submitted: '2026-10-08T15:00', status: 'approved', stage: 1, people: ['w18', 'w20'], docs: [D1('Scope of Work Form', 'scope-fire-door.pdf', '', true)], description: 'Install two fire-rated doors.', contact: 'Viktor Novak', phone: '+971 56 400 7781', terms: sampleTerms('Viktor Novak', 'Owner', '2026-10-08T14:55'), checks: { documents: true, people: true, company: true }, history: [sub('2026-10-08T15:00'), H('2026-10-09T11:00', 'Omar Siddiqui', 'Final approval · pass issued')], passId: 'PS-3004' }),
    // Closure / completed
    mk({ id: 'BZ-1033', title: 'Carpet replacement', type: 'general', contractor: 'c3', property: 'offices', unit: 'Unit 102', from: '2026-10-06', to: '2026-10-09', hours: '09:00–17:00', submitted: '2026-10-01T09:00', status: 'inspection', stage: 1, people: ['w16', 'w17'], docs: [D1('Scope of Work Form', 'scope-carpet-102.pdf', '', true)], description: 'Carpet tiles in Unit 102.', contact: 'Sofia Rossi', phone: '+971 52 880 1932', terms: sampleTerms('Elena Petrova', 'Director', '2026-10-01T08:55'), checks: { documents: true, people: true, company: true }, history: [sub('2026-10-01T09:00'), H('2026-10-02T09:00', 'Omar Siddiqui', 'Final approval · pass issued'), H('2026-10-11T14:20', 'Contractor', 'Final inspection requested')], passId: 'PS-3010' }),
    mk({ id: 'BZ-1029', title: 'Plumbing repair', type: 'maintenance', contractor: 'c1', property: 'residences', unit: 'Unit 204', from: '2026-09-21', to: '2026-09-23', hours: '09:00–15:00', submitted: '2026-09-17T10:00', status: 'completed', stage: 1, people: ['w1'], docs: [D1('Scope of Work Form', 'scope-plumbing.pdf', '', true)], description: 'Replace a leaking valve.', contact: 'Alex Morgan', phone: '+971 50 000 0000', terms: sampleTerms('Alex Morgan', 'Operations manager', '2026-09-17T09:55'), checks: { documents: true, people: true, company: true }, history: [sub('2026-09-17T10:00'), H('2026-09-18T10:00', 'Sara Lindqvist', 'Final approval · pass issued'), H('2026-09-24T11:30', 'Priya Rao', 'Work closed', 'Inspection passed.')], passId: 'PS-3006' }),
    mk({ id: 'BZ-1030', title: 'Ceiling repair', type: 'general', contractor: 'c3', property: 'offices', unit: 'Unit 204', from: '2026-09-28', to: '2026-09-30', hours: '09:00–17:00', submitted: '2026-09-24T09:00', status: 'inspection', stage: 1, people: ['w16'], docs: [D1('Scope of Work Form', 'scope-ceiling.pdf', '', true)], description: 'Repair of water-damaged ceiling tiles.', contact: 'Sofia Rossi', phone: '+971 52 880 1932', terms: sampleTerms('Elena Petrova', 'Director', '2026-09-24T08:55'), checks: { documents: true, people: true, company: true }, history: [sub('2026-09-24T09:00'), H('2026-09-25T09:00', 'Omar Siddiqui', 'Final approval · pass issued'), H('2026-10-01T10:00', 'Contractor', 'Final inspection requested'), H('2026-10-02T09:00', 'Priya Rao', 'Inspection scheduled for 13 Oct')], passId: 'PS-3011' }),
    mk({ id: 'BZ-1017', title: 'Glass partition installation', type: 'fitout', contractor: 'c2', property: 'offices', unit: 'Unit 410', from: '2026-08-10', to: '2026-08-20', hours: '08:00–18:00', submitted: '2026-08-04T09:00', status: 'completed', stage: 2, people: ['w10', 'w11'], docs: [D1('Scope of Work Form', 'scope-glass-v1.pdf', '', true)], description: 'First phase of glass partitions.', contact: 'Karim Aziz', phone: '+971 55 210 4410', terms: sampleTerms('Karim Aziz', 'Site supervisor', '2026-08-04T08:55'), checks: { documents: true, people: true, company: true }, history: [sub('2026-08-04T09:00'), H('2026-08-21T09:00', 'Priya Rao', 'Work closed', 'Inspection passed.')], passId: 'PS-3007' }),
    mk({ id: 'BZ-1034', title: 'Crane lift', type: 'hot', contractor: 'c4', property: 'offices', unit: 'Roof', from: '2026-10-08', to: '2026-10-09', hours: '09:00–16:00', submitted: '2026-10-03T09:00', status: 'approved', stage: 2, people: ['w18', 'w19'], docs: [D1('Scope of Work Form', 'scope-crane.pdf', '', true)], description: 'Lift HVAC unit to roof.', contact: 'Viktor Novak', phone: '+971 56 400 7781', terms: sampleTerms('Viktor Novak', 'Owner', '2026-10-03T08:55'), checks: { documents: true, people: true, company: true }, history: [sub('2026-10-03T09:00'), H('2026-10-04T09:00', 'Priya Rao', 'Final approval · pass issued')], passId: 'PS-3009' }),
    mk({ id: 'BZ-1025', title: 'Kitchen exhaust cleaning', type: 'maintenance', contractor: 'c6', property: 'retail', unit: 'Retail R-02', from: '2026-09-18', to: '2026-09-18', hours: '22:00–02:00', submitted: '2026-09-15T09:00', status: 'rejected', people: ['w1'], docs: [D1('Scope of Work Form', 'scope-exhaust.pdf', '', true)], description: 'Night-time cleaning of kitchen exhaust.', contact: 'Ben Alvarez', phone: '+971 50 771 4420', terms: sampleTerms('Ben Alvarez', 'Owner', '2026-09-15T08:55'), history: [sub('2026-09-15T09:00'), H('2026-09-16T09:00', 'Omar Siddiqui', 'Rejected', 'Work hours are outside the allowed window for retail units.')] }),
  ];
  const passes = [
    { id: 'PS-3001', requestId: 'BZ-1036', kind: 'work', holder: 'c1', title: 'Electrical inspection', property: 'offices', unit: 'Unit 123', from: '2026-10-09', to: '2026-10-13', people: ['w3'], vehicles: [], issued: '2026-10-06T10:05', issuedBy: 'Daniel Okoro' },
    { id: 'PS-3002', requestId: 'BZ-1038', kind: 'work', holder: 'c2', title: 'Roof waterproofing', property: 'offices', unit: 'Roof', from: '2026-10-11', to: '2026-10-14', people: ['w6', 'w7', 'w9'], vehicles: [], issued: '2026-10-08T09:00', issuedBy: 'Omar Siddiqui' },
    { id: 'PS-3003', requestId: 'BZ-1040', kind: 'work', holder: 'c3', title: 'Carpet replacement', property: 'residences', unit: 'Unit 305', from: '2026-10-13', to: '2026-10-20', people: ['w16', 'w17'], vehicles: [], issued: '2026-10-09T10:00', issuedBy: 'Sara Lindqvist' },
    { id: 'PS-3004', requestId: 'BZ-1041', kind: 'work', holder: 'c4', title: 'Fire door installation', property: 'offices', unit: 'Unit 204', from: '2026-10-15', to: '2026-10-16', people: ['w18', 'w20'], vehicles: [], issued: '2026-10-09T11:00', issuedBy: 'Omar Siddiqui' },
    { id: 'PS-3005', requestId: null, kind: 'visitor', holder: 'c1', title: 'Site survey visit', property: 'residences', unit: 'Unit 305', from: '2026-10-15', to: '2026-10-15', people: ['w2'], vehicles: [], issued: '2026-10-09T09:20', issuedBy: 'Sara Lindqvist' },
    { id: 'PS-3006', requestId: 'BZ-1029', kind: 'work', holder: 'c1', title: 'Plumbing repair', property: 'residences', unit: 'Unit 204', from: '2026-09-21', to: '2026-09-23', people: ['w1'], vehicles: [], issued: '2026-09-18T10:00', issuedBy: 'Sara Lindqvist' },
    { id: 'PS-3007', requestId: 'BZ-1017', kind: 'work', holder: 'c2', title: 'Glass partition installation', property: 'offices', unit: 'Unit 410', from: '2026-08-10', to: '2026-08-20', people: ['w10', 'w11'], vehicles: [], issued: '2026-08-05T09:00', issuedBy: 'Omar Siddiqui' },
    { id: 'PS-3008', requestId: null, kind: 'manual', holder: null, walkIn: 'Delivery: ceiling tiles', title: 'Delivery: ceiling tiles', property: 'offices', unit: 'Loading bay', from: '2026-10-12', to: '2026-10-12', people: [], guests: [{ name: 'Faisal Rahman', idType: 'Emirates ID', idNo: '784-1992-4455661-2' }], vehicles: [{ plate: 'Dubai K 55871', type: 'Truck' }], issued: '2026-10-12T07:40', issuedBy: 'Maya Khan' },
    { id: 'PS-3009', requestId: 'BZ-1034', kind: 'work', holder: 'c4', title: 'Crane lift', property: 'offices', unit: 'Roof', from: '2026-10-08', to: '2026-10-09', people: ['w18', 'w19'], vehicles: [], issued: '2026-10-04T09:00', issuedBy: 'Priya Rao', revoked: { on: '2026-10-08T15:10', by: 'Maya Khan', reason: 'Unsafe lifting practice reported by security.' } },
    { id: 'PS-3010', requestId: 'BZ-1033', kind: 'work', holder: 'c3', title: 'Carpet replacement', property: 'offices', unit: 'Unit 102', from: '2026-10-06', to: '2026-10-09', people: ['w16', 'w17'], vehicles: [], issued: '2026-10-02T09:00', issuedBy: 'Omar Siddiqui' },
    { id: 'PS-3011', requestId: 'BZ-1030', kind: 'work', holder: 'c3', title: 'Ceiling repair', property: 'offices', unit: 'Unit 204', from: '2026-09-28', to: '2026-09-30', people: ['w16'], vehicles: [], issued: '2026-09-25T09:00', issuedBy: 'Omar Siddiqui' },
  ];
  const inspections = [
    { id: 'FI-201', requestId: 'BZ-1033', status: 'requested', requested: '2026-10-11T14:20', preferred: '2026-10-14', time: '10:00', notes: 'Work completed and the area has been cleaned. Carpet offcuts removed.', photos: 3 },
    { id: 'FI-198', requestId: 'BZ-1030', status: 'scheduled', requested: '2026-10-01T10:00', preferred: '2026-10-13', time: '11:00', notes: 'Ceiling tiles replaced and painted.', photos: 2, scheduledFor: '2026-10-13T11:00', scheduledBy: 'Priya Rao' },
    { id: 'FI-190', requestId: 'BZ-1029', status: 'closed', requested: '2026-09-23T16:00', preferred: '2026-09-24', time: '10:00', notes: 'Valve replaced and tested.', photos: 1, closedOn: '2026-09-24T11:30', closedBy: 'Priya Rao', outcome: 'Passed', report: true },
    { id: 'FI-171', requestId: 'BZ-1017', status: 'closed', requested: '2026-08-20T17:00', preferred: '2026-08-21', time: '09:00', notes: 'All glass panels installed. Debris removed.', photos: 4, closedOn: '2026-08-21T09:40', closedBy: 'Priya Rao', outcome: 'Passed', report: true },
  ];
  const amc = [
    { id: 'a1', contractor: 'c1', title: 'HVAC servicing', property: 'offices', freq: 'Monthly', required: 2, period: 'Oct 2026', next: '2026-10-20', visits: [{ date: '2026-10-05', by: 'Alex Morgan', pass: 'AMC-2026-10-05' }] },
    { id: 'a2', contractor: 'c3', title: 'Lift maintenance', property: 'offices', freq: 'Monthly', required: 1, period: 'Oct 2026', next: '2026-10-21', visits: [] },
    { id: 'a3', contractor: 'c2', title: 'Fire systems testing', property: 'residences', freq: 'Quarterly', required: 1, period: 'Q4 2026', next: '2026-12-02', visits: [{ date: '2026-10-02', by: 'Karim Aziz', pass: 'AMC-2026-10-02' }] },
    { id: 'a4', contractor: 'c4', title: 'Generator servicing', property: 'offices', freq: 'Monthly', required: 1, period: 'Oct 2026', next: '2026-10-26', visits: [{ date: '2026-10-08', by: 'Viktor Novak', pass: 'AMC-2026-10-08' }] },
  ];
  // Gate movements: today's are written by hand so exactly four people are still on site.
  const L = (ts, pid, dir, gate, by, passId) => ({ id: uid('L'), ts, pid, dir, gate, by, pass: passId });
  const logs = [
    L('2026-10-12T06:55', 'w6', 'in', 'Gate B (service)', 'Ben Torres', 'PS-3002'), L('2026-10-12T06:57', 'w7', 'in', 'Gate B (service)', 'Ben Torres', 'PS-3002'), L('2026-10-12T07:02', 'w9', 'in', 'Gate B (service)', 'Ben Torres', 'PS-3002'),
    L('2026-10-12T07:20', 'w3', 'in', 'Gate A (main)', 'Rashid Ali', 'PS-3001'), L('2026-10-12T07:45', 'w16', 'in', 'Gate A (main)', 'Rashid Ali', 'PS-3010'), L('2026-10-12T08:40', 'w16', 'out', 'Gate A (main)', 'Rashid Ali', 'PS-3010'),
    L('2026-10-12T08:10', 'w17', 'in', 'Gate A (main)', 'Rashid Ali', 'PS-3010'), L('2026-10-12T08:55', 'w17', 'out', 'Gate A (main)', 'Rashid Ali', 'PS-3010'),
  ];
  const wk = [[-6, 11, 11], [-5, 12, 12], [-4, 15, 15], [-3, 14, 14], [-2, 9, 9], [-1, 3, 3]];
  const names = people.filter(p => ['c1', 'c2', 'c3', 'c4'].includes(p.company)).map(p => p.id);
  wk.forEach(([off, n]) => { const day = addDays(TODAY, off); for (let i = 0; i < n; i++) { const pid = names[(i * 3 + Math.abs(off)) % names.length], h = 6 + (i % 4); logs.push(L(`${day}T0${h}:${String(10 + i * 3).slice(-2).padStart(2, '0')}`, pid, 'in', i % 3 ? 'Gate A (main)' : 'Gate B (service)', i % 3 ? 'Rashid Ali' : 'Ben Torres', 'PS-3010')); logs.push(L(`${day}T${15 + (i % 3)}:${String(5 + i * 4).slice(-2).padStart(2, '0')}`, pid, 'out', i % 3 ? 'Gate A (main)' : 'Gate B (service)', i % 3 ? 'Rashid Ali' : 'Ben Torres', 'PS-3010')); } });
  logs.sort((a, b) => b.ts.localeCompare(a.ts));
  const notifications = [
    { id: 'n1', title: 'BZ-1048 has waited over 48 hours', body: 'HVAC maintenance · Sample Contracting', when: '1 h ago', go: 'review-BZ-1048', unread: true },
    { id: 'n2', title: 'Apex Metalworks: trade licence expired', body: 'Expired 30 Sep 2026. New requests will be flagged.', when: 'Yesterday', go: 'contractor-c4', unread: true },
    { id: 'n3', title: 'Harbour Interiors asked for access', body: 'Waiting for approval since 10 Oct.', when: '2 days ago', go: 'contractors', unread: false },
    { id: 'n4', title: 'Final inspection requested: BZ-1033', body: 'Bright Works LLC · Unit 102', when: '2 days ago', go: 'inspection-FI-201', unread: false },
  ];
  return {
    v: 1, community: { id: 'buzzin', name: 'Buzzin community', area: 'Dubai Silicon Oasis', email: 'permits@buzzin-community.example', logo: BUZZIN_LOGO },
    departments: ['Security', 'Operations'],
    settings: { timezone: 'Asia/Dubai', trn: '100000000001', phone: '+971 4 000 0000', fax: '', supportEmail: 'permits@buzzin-community.example', tolerance: 30, grace: true, graceMinutes: 15, oneTimeApproval: true, requireClosure: true, closureDepartments: ['Operations'], allowNewWorkers: true, approveNewContractors: true, hidePresetUnits: false, hideAdditionalUnits: false,
      gateLinkPrivate: true, contractorLinkPrivate: true, linkReuse: 'reusable', currency: 'AED', oneTimeFee: false, oneTimePrice: 0, restricted: { weekly: ['Friday'], dates: ['2026-10-25', '2026-11-02'] }, workHours: { from: '08:00', to: '18:00' },
      attachments: { onApprove: ['Scope of Work Form'], onReject: [] }, provider: 'Not connected in this preview' },
    permitTypes: pt, properties, contractors, people, team, security, requests, passes, inspections, amc, logs, notifications,
    forms: [{ id: 'frm1', name: 'Contractor terms & community guidelines', fileName: 'buzzin-contractor-terms-v3.pdf', pdf: 'sample', pdfRev: 0, fields: clone(SAMPLE_FIELDS), appliesTo: [...ALL_TYPE_IDS], placement: 'bottom', updated: '2026-09-01',
      published: { version: 3, name: 'Contractor terms & community guidelines', fileName: 'buzzin-contractor-terms-v3.pdf', pdf: 'sample', fields: clone(SAMPLE_FIELDS), appliesTo: [...ALL_TYPE_IDS], placement: 'bottom', at: '2026-09-01' } }],
    prefs: { adminNotify: { newRequest: true, expiring: true, closure: true, accessRequest: true }, tab: {} },
  };
}
function validWP(x) {
  return !!(x && x.v === 1 && ['permitTypes', 'properties', 'contractors', 'people', 'team', 'security', 'requests', 'passes', 'inspections', 'amc', 'logs', 'forms', 'notifications', 'departments'].every(k => Array.isArray(x[k])) && x.community && x.settings && x.settings.restricted && x.prefs);
}

/* ================= Selectors & rules ================= */
const byId = (list, id) => list.find(x => x.id === id);
const prop = id => byId(S.properties, id) || { id, name: id, units: [], levels: {}, required: {} };
const contractor = id => byId(S.contractors, id) || { id, name: 'Unknown company', status: 'active', licence: {}, insurance: {} };
const person = id => byId(S.people, id) || { id, name: 'Unknown', role: '', idType: '', idNo: '', idExpiry: '' };
const ptype = id => byId(S.permitTypes, id) || { id, name: id, docs: [], workflow: [] };
const stageName = st => st ? `${st.dept} · Level ${st.level}` : 'Complete';
function compileWorkflow(typeId, propId) {
  const t = ptype(typeId), p = prop(propId), out = [];
  (t.workflow || []).forEach(d => { for (let l = 1; l <= (p.levels[d] || 0); l++) out.push({ dept: d, level: l }); });
  return out;
}
const workflowOf = r => (r.workflow && r.workflow.length) ? r.workflow : compileWorkflow(r.type, r.property);
const curStage = r => r.status === 'review' ? workflowOf(r)[r.stage] : null;
const REQ = { review: ['Under review', 'info'], changes: ['Changes requested', 'warn'], approved: ['Approved', 'ok'], rejected: ['Rejected', 'bad'], cancelled: ['Cancelled', 'neutral'], inspection: ['Inspection requested', 'info'], completed: ['Completed', 'neutral'] };
const reqBadge = r => badge(...(REQ[r.status] || [r.status, 'neutral']));
function passState(p) {
  if (p.revoked) return 'revoked';
  if (p.to < TODAY) return 'expired';
  if (p.from > TODAY) return 'upcoming';
  return 'active';
}
const PASS = { active: ['Active', 'ok'], upcoming: ['Upcoming', 'info'], expired: ['Expired', 'neutral'], revoked: ['Revoked', 'bad'] };
const passBadge = p => badge(...PASS[passState(p)]);
function ageTone(h) { return h >= 48 ? 'bad' : h >= 24 ? 'warn' : 'neutral'; }
function ageChip(h, long) {
  const tone = ageTone(h);
  return `<span class="age age-${tone}" ${tipAttr(`Waiting ${h} hours. Older requests are highlighted to help you prioritise. This is not a deadline.`)}>${tone === 'bad' ? ic('alert') : '<i></i>'}${ageText(h)}${long ? ' waiting' : ''}</span>`;
}
function stageTrack(r) {
  const wf = workflowOf(r), done = r.status === 'review' ? r.stage : wf.length;
  return `<span class="stages" ${tipAttr(wf.map((s, i) => `${i < done ? '✓' : i === done && r.status === 'review' ? '●' : '○'} ${stageName(s)}`).join('\n'))}>${wf.map((s, i) => `<i class="${i < done ? 'done' : i === done && r.status === 'review' ? 'now' : ''}"></i>`).join('')}</span>`;
}
/* Who am I? The Admin file signs in as the first admin, the Approver file as an approver. */
const me = () => byId(S.team, WS && WS.userId) || S.team[0];
const isAdmin = () => me().role === 'admin';
const inScope = (u, r) => u.role === 'admin' || (u.properties || []).includes(r.property);
function canDecide(r, u = me()) {
  if (r.status !== 'review') return false;
  if (u.role === 'admin') return true;
  const st = curStage(r);
  return !!st && st.dept === u.dept && st.level === u.level && inScope(u, r);
}
const canViewLogs = () => isAdmin() || !!me().logs;
const closureOK = () => isAdmin() || S.settings.closureDepartments.includes(me().dept);
const visibleRequests = () => S.requests.filter(r => inScope(me(), r));
const pending = () => visibleRequests().filter(r => r.status === 'review');
const myQueue = () => pending().filter(r => canDecide(r));
const age = r => hoursAgo(r.submitted);

/* Issues the reviewer should know about (warnings, not blockers). */
function requestFlags(r) {
  const out = [], t = ptype(r.type), tt = r.to || r.from, ppl = r.people.map(person), c = contractor(r.contractor);
  ppl.forEach(p => { const e = expiry(p.idExpiry); if (p.idExpiry < TODAY) out.push({ tone: 'bad', tab: 'people', text: `${p.name}: ${p.idType} has expired (${fmt(p.idExpiry)}).` }); else if (p.idExpiry < tt) out.push({ tone: 'warn', tab: 'people', text: `${p.name}: ${p.idType} expires ${fmt(p.idExpiry)}, before the work ends on ${fmt(tt)}.` }); else if (e.tone === 'warn') out.push({ tone: 'warn', tab: 'people', text: `${p.name}: ${p.idType} ${e.label.toLowerCase()}.` }); });
  r.docs.forEach(d => { if (!d.noExpiry && d.expiry) { if (d.expiry < r.from) out.push({ tone: 'bad', tab: 'documents', text: `${d.label} expired ${fmt(d.expiry)}, before the work starts.` }); else if (d.expiry < tt) out.push({ tone: 'warn', tab: 'documents', text: `${d.label} expires ${fmt(d.expiry)}, before the work ends on ${fmt(tt)}.` }); } });
  if (c.licence.expiry && c.licence.expiry < TODAY) out.push({ tone: 'bad', tab: 'company', text: `${c.name}: trade licence expired ${fmt(c.licence.expiry)}.` }); else if (c.licence.expiry && c.licence.expiry < tt) out.push({ tone: 'warn', tab: 'company', text: `${c.name}: trade licence expires ${fmt(c.licence.expiry)}, before the work ends.` });
  if (c.insurance.expiry && c.insurance.expiry < tt) out.push({ tone: 'warn', tab: 'company', text: `${c.name}: ${c.insurance.name.toLowerCase()} expires ${fmt(c.insurance.expiry)}, before the work ends.` });
  if (t.maxEmployees && r.people.length > t.maxEmployees) out.push({ tone: 'warn', tab: 'people', text: `${plural(r.people.length, 'worker')} requested. ${t.name} allows up to ${t.maxEmployees}.` });
  const nDays = Math.round((D(tt) - D(r.from)) / 864e5) + 1;
  if (t.maxDays && nDays > t.maxDays) out.push({ tone: 'warn', tab: 'overview', text: `${plural(nDays, 'day')} requested. ${t.name} allows up to ${t.maxDays}.` });
  const blocked = []; for (let d = r.from; d <= tt; d = addDays(d, 1)) if (isRestricted(d)) blocked.push(d);
  if (blocked.length) out.push({ tone: 'warn', tab: 'overview', text: `Work dates include ${blocked.map(fmtS).join(', ')}, when work is not allowed.` });
  const [hf, ht] = (r.hours || '').split('–'); if (t.timeIn && hf && (hf < t.timeIn || ht > t.timeOut)) out.push({ tone: 'warn', tab: 'overview', text: `Work hours ${r.hours} are outside ${t.name} hours (${t.timeIn}–${t.timeOut}).` });
  return out;
}
function isRestricted(d) { const w = D(d).toLocaleDateString('en-US', { weekday: 'long' }); return S.settings.restricted.weekly.includes(w) || S.settings.restricted.dates.includes(d); }
const isOnSite = pid => { const l = S.logs.find(x => x.pid === pid); return !!l && l.dir === 'in'; };
const onSiteNow = () => uniq(S.logs.map(l => l.pid)).filter(isOnSite);
function expiringContractors() {
  const out = [];
  S.contractors.filter(c => c.status !== 'suspended').forEach(c => {
    const l = expiry(c.licence.expiry), i = expiry(c.insurance.expiry);
    if (l.tone === 'bad' || l.tone === 'warn') out.push({ c, what: 'Trade licence', e: l, date: c.licence.expiry });
    if (i.tone === 'bad' || i.tone === 'warn') out.push({ c, what: c.insurance.name, e: i, date: c.insurance.expiry });
  });
  return out.sort((a, b) => a.date.localeCompare(b.date));
}
