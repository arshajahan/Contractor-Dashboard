/* Workspace config for the Events file. */
const evSearch = q => {
  q = q.trim().toLowerCase(); if (!q) return [];
  const out = [];
  S.events.forEach(e => { if ((e.title + e.location).toLowerCase().includes(q)) out.push({ go: 'event-' + e.id, icon: 'calendar', title: e.title, sub: `${fmtDay(e.date)} · ${evProp(e)}` }); });
  S.events.forEach(e => e.regs.forEach(r => { if (out.length < 8 && (r.name + r.email).toLowerCase().includes(q)) out.push({ go: 'event-' + e.id, icon: 'user', title: r.name, sub: `Attendee · ${e.title}` }); }));
  return out.slice(0, 8);
};
const CFG_EVENTS = {
  id: 'events', title: 'Events', roleLabel: 'Events manager', theme: 'ws-events', home: 'dashboard', homeLabel: 'Overview', docTitle: 'Buzzin · Events', searchPh: 'Search events or attendees', search: evSearch,
  userName: () => S.user.name, userSub: () => S.user.title,
  titleFor: r => ({ dashboard: 'Overview', events: 'Events', attendees: 'Attendees', checkins: 'Check-in log', templates: 'Email templates', 'event-settings': 'Settings', 'event-new': 'New event', profile: 'My profile' }[r] || (r.startsWith('event-') || r.startsWith('edit-event-') ? ((evById(r.replace(/^(edit-)?event-/, '')) || {}).title || 'Event') : 'Events')),
  accountItems: () => `<button class="pop-item" data-go="profile">${ic('user')}<span class="grow">My profile</span></button>`,
  noAccessText: 'This page isn’t part of the Events workspace.',
  get nav() { return [
    { group: '', items: [{ go: 'dashboard', icon: 'home', label: 'Overview' }] },
    { group: 'Events', items: [
      { go: 'events', icon: 'calendar', label: 'All events', match: /^events$|^event-(?!settings)|^edit-event-/ },
      { go: 'attendees', icon: 'users', label: 'Attendees' },
      { go: 'checkins', icon: 'scan', label: 'Check-in log', badge: () => sum(S.events.filter(e => evState(e) === 'today').map(e => arrived(e).length)) }] },
    { group: 'Set up', items: [
      { go: 'templates', icon: 'mail', label: 'Email templates' },
      { go: 'event-settings', icon: 'gear', label: 'Settings' }] }]; },
  bottom: [['dashboard', 'Overview', 'home'], ['events', 'Events', 'calendar', /^events$|^event-(?!settings)|^edit-event-/], ['attendees', 'Attendees', 'users'], ['checkins', 'Check-in', 'scan']],
  scopeCard: () => `<div class="side-scope"><b>${esc(S.community.name)}</b><div class="row"><span class="tagline">${ic('calendar')} Events</span></div><span>Separate from work permits</span></div>`,
};
