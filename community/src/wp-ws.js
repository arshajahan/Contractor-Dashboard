/* Workspace configs for the two Work permits files. */
ROUTES.dashboard = () => isAdmin() ? pDashboardAdmin() : pDashboardApprover();
registerRoute('queue', pQueue);
const wpSearch = q => {
  q = q.trim().toLowerCase(); if (!q) return [];
  const out = [];
  visibleRequests().forEach(r => { if ([r.id, r.title, contractor(r.contractor).name, r.unit].join(' ').toLowerCase().includes(q)) out.push({ go: 'review-' + r.id, icon: 'inbox', title: `${r.id} · ${r.title}`, sub: `${contractor(r.contractor).name} · ${REQ[r.status][0]}` }); });
  S.passes.filter(passVisible).forEach(p => { if ([p.id, p.title, holderName(p)].join(' ').toLowerCase().includes(q)) out.push({ go: 'pass-' + p.id, icon: 'ticket', title: `${p.id} · ${p.title}`, sub: holderName(p) }); });
  if (isAdmin()) S.contractors.forEach(c => { if ((c.name + c.contact).toLowerCase().includes(q)) out.push({ go: 'contractor-' + c.id, icon: 'briefcase', title: c.name, sub: 'Contractor · ' + c.contact }); });
  return out.slice(0, 8);
};
const wpNav = (extra) => [
  { group: '', items: [{ go: 'dashboard', icon: 'home', label: 'Dashboard' }] },
  { group: 'Work permits', items: [
    { go: 'queue', icon: 'inbox', label: isAdmin() ? 'Review queue' : 'My queue', badge: () => isAdmin() ? pending().length : myQueue().length },
    { go: 'calendar', icon: 'calendar', label: 'Calendar' },
    { go: 'passes', icon: 'ticket', label: 'Passes', match: /^passes|^pass-|^issue-pass/ },
    { go: 'inspections', icon: 'clipboard', label: 'Final inspections', match: /^inspection/, badge: () => S.inspections.filter(i => i.status === 'requested' && inScope(me(), byId(S.requests, i.requestId))).length },
    { go: 'logs', icon: 'list', label: 'Access logs', show: canViewLogs }] },
  ...(extra || [])];
const adminExtra = () => [
  { group: 'Manage', items: [
    { go: 'contractors', icon: 'briefcase', label: 'Contractors', match: /^contractor/, badge: () => S.contractors.filter(c => c.status === 'pending').length },
    { go: 'amc', icon: 'refresh', label: 'Maintenance contracts' },
    { go: 'properties', icon: 'building', label: 'Properties' },
    { go: 'reports', icon: 'chart', label: 'Reports & insights' }] },
  { group: 'Administration', items: [
    { go: 'team', icon: 'users', label: 'Team & roles' },
    { go: 'security', icon: 'gate', label: 'Gate security' },
    { go: 'settings', icon: 'gear', label: 'Settings', match: /^settings|^ptype-|^terms-/ }] }];
const titleMap = r => ({ dashboard: 'Dashboard', queue: 'Review queue', calendar: 'Calendar', passes: 'Passes', inspections: 'Final inspections', logs: 'Access logs', contractors: 'Contractors', amc: 'Maintenance contracts', properties: 'Properties', reports: 'Reports & insights', team: 'Team & roles', security: 'Gate security', settings: 'Settings', profile: 'My profile', 'issue-pass': 'Issue a pass' }[r] || (r.startsWith('review-') ? r.slice(7) : r.startsWith('settings') ? 'Settings' : r.startsWith('pass-') ? r.slice(5) : r.startsWith('contractor-') ? 'Contractor' : 'Buzzin'));
const wpBase = {
  theme: 'ws-permits', home: 'dashboard', searchPh: 'Search requests, passes or companies', wide: false, search: wpSearch, titleFor: titleMap,
  userName: () => me().name, userSub: () => me().title,
  accountItems: () => `<button class="pop-item" data-go="profile">${ic('user')}<span class="grow">My profile</span></button>`,
  noAccessText: 'Your role does not include this page. Ask a community administrator if you need access.',
};
const CFG_ADMIN = {
  ...wpBase,
  id: 'admin', title: 'Work permits', roleLabel: 'Admin', userId: 'u1', docTitle: 'Buzzin · Community Admin', homeLabel: 'Dashboard',
  get nav() { return wpNav(adminExtra()); },
  bottom: [['dashboard', 'Home', 'home'], ['queue', 'Queue', 'inbox'], ['passes', 'Passes', 'ticket', /^passes|^pass-/], ['contractors', 'Contractors', 'briefcase', /^contractor/]],
  scopeCard: () => `<div class="side-scope"><b>Full access</b><div class="row"><span class="tagline">${ic('shield')} Administrator</span></div><span>All properties and settings</span></div>`,
};
const CFG_APPROVER = {
  ...wpBase,
  id: 'approver', title: 'Work permits', roleLabel: 'Approver', userId: 'u2', docTitle: 'Buzzin · Approver', homeLabel: 'Dashboard',
  get nav() { return wpNav(); },
  bottom: [['dashboard', 'Home', 'home'], ['queue', 'My queue', 'inbox'], ['calendar', 'Calendar', 'calendar'], ['passes', 'Passes', 'ticket', /^passes|^pass-/]],
  scopeCard: () => { const u = me(); return `<div class="side-scope"><b>${esc(u.dept)} · Level ${u.level}</b><div class="row"><span class="tagline">${ic('userCheck')} Approver</span></div><span>${esc(u.properties.map(p => prop(p).name).join(', '))}</span></div>`; },
  notifFilter: n => /^(review|inspection)-/.test(n.go),
};
