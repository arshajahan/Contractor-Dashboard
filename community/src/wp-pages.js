/* Work permits: passes, calendar, final inspections, access logs and profile (shared). */
const holderName = p => p.holder ? contractor(p.holder).name : (p.walkIn || 'Walk-in guest');
const passPeople = p => [...(p.people || []).map(person).map(x => ({ name: x.name, sub: `${x.role} · ${x.idType} ${x.idNo}` })), ...(p.guests || []).map(g => ({ name: g.name, sub: `Guest · ${g.idType} ${g.idNo}` }))];
const passVisible = p => isAdmin() || (me().properties || []).includes(p.property);

/* ---------- Passes ---------- */
function pPasses() {
  const list0 = S.passes.filter(passVisible), st = p => passState(p);
  const tabs = [['active', 'Active', list0.filter(p => st(p) === 'active').length], ['upcoming', 'Upcoming', list0.filter(p => st(p) === 'upcoming').length], ['past', 'Past', list0.filter(p => st(p) === 'expired').length], ['revoked', 'Revoked', list0.filter(p => st(p) === 'revoked').length], ['all', 'All', list0.length]];
  const tab = curTab('passes', 'active'), q = (ui.search.passes || '').toLowerCase();
  const list = list0.filter(p => tab === 'all' || st(p) === (tab === 'past' ? 'expired' : tab)).filter(p => !q || [p.id, p.title, holderName(p), p.unit].join(' ').toLowerCase().includes(q)).sort((a, b) => b.issued.localeCompare(a.issued));
  return `${pageHead('Passes', 'Passes issued for approved work, visits and deliveries.', isAdmin() ? btn('Issue a pass', { v: 'primary', icon: 'plus', go: 'issue-pass' }) : '')}
  <section class="card">${tabsBar('passes', tabs, tab)}<div class="filters-row"><div class="search">${ic('search')}<input class="input" data-search="passes" placeholder="Search by pass, holder or unit" value="${esc(ui.search.passes || '')}" aria-label="Search passes"></div></div>
  ${list.length ? `<div class="table-wrap"><table class="table responsive"><thead><tr><th>Pass</th><th>Holder</th><th>Location</th><th>Valid</th><th>Status</th><th class="t-actions"><span class="sr">Actions</span></th></tr></thead><tbody>${list.map(p => `<tr class="clickable" data-go="pass-${p.id}"><td><div class="t-title"><b>${esc(p.title)}</b><span><span class="id">${p.id}</span> · ${p.kind === 'work' ? 'Work pass' : p.kind === 'visitor' ? 'Visitor pass' : 'Manual pass'}</span></div></td><td data-m="sub">${esc(holderName(p))}</td><td data-m="hide">${esc(p.unit)}<div class="mini">${esc(prop(p.property).name)}</div></td><td data-m="hide" class="num">${range(p.from, p.to)}</td><td data-m="side">${passBadge(p)}</td><td class="t-actions">${btn('View', { sm: true, v: 'ghost', go: 'pass-' + p.id })}</td></tr>`).join('')}</tbody></table></div>` : emptyState('ticket', 'No passes here', q ? 'No passes match your search.' : 'Passes appear here once requests are approved.')}
  <div class="pager"><span>Showing ${list.length} pass${list.length === 1 ? '' : 'es'}</span></div></section>`;
}
function pPass(id) {
  const p = byId(S.passes, id); if (!p || !passVisible(p)) return null;
  const ppl = passPeople(p), s = passState(p), r = p.requestId && byId(S.requests, p.requestId);
  return `${pageHead(`${esc(p.title)} ${passBadge(p)}`, `<span class="id">${p.id}</span> · issued ${fmtDT(p.issued)} by ${esc(p.issuedBy)}`, (isAdmin() && s !== 'revoked' && s !== 'expired' ? btn('Revoke pass', { v: 'danger', icon: 'ban', act: 'revokePass', id: p.id }) : '') + btn('Download PDF', { icon: 'download', act: 'demo', id: 'Download ' + p.id }), [['Passes', 'passes'], [p.id]])}
  ${p.revoked ? alertBox('bad', 'This pass was revoked', `${esc(p.revoked.reason)} <span class="faint">· ${esc(p.revoked.by)}, ${fmtDT(p.revoked.on)}</span>`) : ''}
  <div class="grid-main"><div class="stack-lg">
    ${card('Pass details', `<div class="pass-hero"><div class="qr-card ${s === 'active' || s === 'upcoming' ? '' : 'dim'}">${qrSvg(p.id)}</div><dl class="kv-list"><dt>Holder</dt><dd>${esc(holderName(p))}</dd><dt>Location</dt><dd>${esc(p.unit)}, ${esc(prop(p.property).name)}</dd><dt>Valid</dt><dd>${range(p.from, p.to)}</dd><dt>Type</dt><dd>${p.kind === 'work' ? 'Work pass' : p.kind === 'visitor' ? 'Visitor pass' : 'Manual pass'}</dd>${r ? `<dt>Request</dt><dd><button class="btn-link" data-go="review-${r.id}">${r.id} · ${esc(r.title)}</button></dd>` : ''}</dl></div>`)}
    ${card(`People allowed in (${ppl.length})`, ppl.length ? ppl.map(x => `<div class="person-row"><span class="avatar">${initials(x.name)}</span><div class="meta"><b>${esc(x.name)}</b><span>${esc(x.sub)}</span></div></div>`).join('') : '<p class="muted small" style="margin:0">No named people.</p>', { tight: true })}
  </div><div class="stack-lg">${card('Vehicles', (p.vehicles || []).length ? p.vehicles.map(v => `<div class="list-row"><span class="ic tone-neutral">${ic('car')}</span><span class="grow"><b>${esc(v.plate)}</b><span>${esc(v.type)}</span></span></div>`).join('') : '<p class="muted small" style="margin:0">No vehicles.</p>', { tight: true })}
  ${card('Recent gate activity', (() => { const l = S.logs.filter(x => x.pass === p.id).slice(0, 4); return l.length ? l.map(x => `<div class="list-row"><span class="ic tone-${x.dir === 'in' ? 'ok' : 'neutral'}">${ic(x.dir === 'in' ? 'logIn' : 'logout')}</span><span class="grow"><b>${esc(person(x.pid).name)} ${x.dir === 'in' ? 'entered' : 'left'}</b><span>${fmtDT(x.ts)} · ${esc(x.gate)}</span></span></div>`).join('') : '<p class="muted small" style="margin:0">No scans yet.</p>'; })(), { tight: true })}</div></div>`;
}
registerRoute('passes', pPasses); registerPrefix('pass-', pPass);
ACT.revokePass = t => { const p = byId(S.passes, t.dataset.id); openConfirm({ title: `Revoke ${p.id}?`, message: 'The pass stops working at the gate straight away. The contractor is told why.', confirmText: 'Revoke pass', tone: 'danger', reason: { label: 'Reason for revoking', min: 10, ph: 'For example: unsafe practice reported by security.' }, onConfirm: d => { p.revoked = { on: nowISO(), by: me().name, reason: d.reason.trim() }; persist(); toast(`${p.id} revoked.`); } }); };

/* ---------- Issue a pass (admin) ---------- */
function pIssuePass() {
  if (!isAdmin()) return null;
  if (ui.formTab !== 'issue-pass' || !ui.form) { ui.form = { kind: 'manual', title: '', holder: '', property: S.properties[0].id, unit: '', from: TODAY, to: TODAY, guests: [{ name: '', idType: 'Emirates ID', idNo: '' }], plate: '' }; ui.formTab = 'issue-pass'; ui.dirty = false; ui.errs = {}; }
  const f = ui.form, e = ui.errs, p = prop(f.property);
  return `${pageHead('Issue a pass', 'Create a pass for a visitor, delivery or one-off job without a request.', '', [['Passes', 'passes'], ['Issue a pass']])}
  <div class="stack-lg" style="max-width:820px">
  ${card('Pass details', `<div class="grid-2">
    ${F({ id: 'ip-kind', label: 'Pass type', bind: 'f.kind', options: [['manual', 'Delivery or one-off'], ['visitor', 'Visitor']], req: true })}
    ${F({ id: 'ip-title', label: 'Purpose', bind: 'f.title', req: true, ph: 'For example: Delivery of ceiling tiles', err: e.title })}
    ${F({ id: 'ip-prop', label: 'Property', bind: 'f.property', options: S.properties.map(x => [x.id, x.name]), rerender: true, req: true })}
    ${F({ id: 'ip-unit', label: 'Unit or area', bind: 'f.unit', options: [...p.units, 'Loading bay'], ph: 'Choose', req: true, err: e.unit })}
    ${F({ id: 'ip-from', label: 'From', bind: 'f.from', type: 'date', req: true })}${F({ id: 'ip-to', label: 'To', bind: 'f.to', type: 'date', req: true, err: e.to })}
    ${F({ id: 'ip-plate', label: 'Vehicle plate', bind: 'f.plate', opt: true, ph: 'Dubai K 12345' })}</div>`)}
  ${card('Guests', `<div class="stack">${f.guests.map((g, i) => `<div class="grid-2">${F({ id: 'ip-gn' + i, label: i ? '' : 'Full name', bind: `f.guests.${i}.name`, req: true, ph: 'As on ID', err: e['g' + i] })}${F({ id: 'ip-gt' + i, label: i ? '' : 'ID type', bind: `f.guests.${i}.idType`, options: ['Emirates ID', 'Passport', 'Driving licence'] })}${F({ id: 'ip-gi' + i, label: i ? '' : 'ID number', bind: `f.guests.${i}.idNo`, req: true })}</div>`).join('')}${btn('Add another guest', { sm: true, icon: 'plus', act: 'ipAddGuest' })}</div>`, { sub: 'Everyone entering needs a name and ID number.' })}
  <div class="row" style="justify-content:flex-end">${btn('Cancel', { go: 'passes' })}${btn('Issue pass', { v: 'primary', act: 'ipSubmit' })}</div></div>`;
}
registerRoute('issue-pass', pIssuePass);
Object.assign(ACT, {
  ipAddGuest() { ui.form.guests.push({ name: '', idType: 'Emirates ID', idNo: '' }); render(); },
  ipSubmit() {
    const f = ui.form, e = {};
    if (!f.title.trim()) e.title = 'Say what this pass is for.'; if (!f.unit) e.unit = 'Choose where they are going.'; if (f.to < f.from) e.to = 'End date is before the start date.';
    f.guests.forEach((g, i) => { if (!g.name.trim() || !g.idNo.trim()) e['g' + i] = 'Name and ID number are required.'; });
    ui.errs = e; if (Object.keys(e).length) { toast('Fix the highlighted fields.', { err: true }); render(); return; }
    openConfirm({ title: 'Issue this pass?', message: `${f.guests.length} ${f.guests.length === 1 ? 'guest' : 'guests'} will be allowed in at ${prop(f.property).name}, ${range(f.from, f.to)}.`, confirmText: 'Issue pass', tone: 'ok', icon: 'ticket',
      onConfirm: () => { const n = nextPassNo(), p = { id: 'PS-' + n, requestId: null, kind: f.kind, holder: null, walkIn: f.title.trim(), title: f.title.trim(), property: f.property, unit: f.unit, from: f.from, to: f.to, people: [], guests: f.guests.map(g => ({ ...g })), vehicles: f.plate ? [{ plate: f.plate, type: 'Vehicle' }] : [], issued: nowISO(), issuedBy: me().name }; S.passes.unshift(p); persist(); ui.form = null; ui.formTab = null; ui.dirty = false; toast(`${p.id} issued.`); go('pass-' + p.id); } });
  },
});

/* ---------- Calendar ---------- */
function pCalendar() {
  const off = ui.sel.calOff || 0, base = D(TODAY); base.setDate(1); base.setMonth(base.getMonth() + off);
  const y = base.getFullYear(), m = base.getMonth(), first = new Date(y, m, 1), startDow = (first.getDay() + 6) % 7, dim = new Date(y, m + 1, 0).getDate();
  const cells = []; for (let i = 0; i < 42; i++) { const d = new Date(y, m, 1 - startDow + i); cells.push(iso(d)); }
  const list = visibleRequests().filter(r => ['review', 'approved', 'inspection'].includes(r.status));
  const sel = ui.sel.calDay || TODAY, selList = list.filter(r => r.from <= sel && (r.to || r.from) >= sel);
  const label = base.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  return `${pageHead('Calendar', 'Approved and pending work by day. Hatched days are days when work is not allowed.')}
  <div class="cal-wrap"><section class="card"><div class="cal-head"><h2>${label}</h2><div class="row">${btn('Today', { sm: true, act: 'calToday' })}${btn('', { sm: true, icon: 'arrowL', act: 'calPrev', title: 'Previous month' })}${btn('', { sm: true, icon: 'arrowR', act: 'calNext', title: 'Next month' })}</div></div>
    <div class="cal-grid">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => `<div class="cal-dow">${d}</div>`).join('')}${cells.map(d => { const dl = list.filter(r => r.from <= d && (r.to || r.from) >= d), inM = D(d).getMonth() === m;
      return `<button class="cal-day ${inM ? '' : 'out'} ${isRestricted(d) ? 'restricted' : ''} ${d === TODAY ? 'today' : ''} ${d === sel ? 'sel' : ''}" data-act="calPick" data-id="${d}" ${tipAttr(isRestricted(d) ? 'Work is not allowed on this day' : `${dl.length} request${dl.length === 1 ? '' : 's'}`)}><span class="cal-num">${D(d).getDate()}</span>${dl.slice(0, 2).map(r => `<span class="cal-chip ${r.status === 'review' ? 'pending' : ''}">${esc(r.title)}</span>`).join('')}${dl.length > 2 ? `<span class="cal-more">+${dl.length - 2} more</span>` : ''}</button>`; }).join('')}</div></section>
  ${card(fmtDay(sel), selList.length ? selList.map(r => `<button class="link-row" data-go="review-${r.id}"><span class="ic tone-${r.status === 'review' ? 'warn' : 'ok'}">${ic(r.status === 'review' ? 'clock' : 'check')}</span><span class="grow"><b>${esc(r.title)}</b><span>${esc(contractor(r.contractor).name)} · ${esc(r.unit)} · ${esc(r.hours)}</span></span>${badge(r.status === 'review' ? 'Pending' : 'Approved', r.status === 'review' ? 'warn' : 'ok')}</button>`).join('') : `<p class="muted small" style="padding:12px;margin:0">${isRestricted(sel) ? 'Work is not allowed on this day.' : 'No work planned for this day.'}</p>`, { tight: true, sub: `${plural(selList.length, 'request')}` })}</div>`;
}
registerRoute('calendar', pCalendar);
Object.assign(ACT, { calPick(t) { ui.sel.calDay = t.dataset.id; render(); }, calPrev() { ui.sel.calOff = (ui.sel.calOff || 0) - 1; render(); }, calNext() { ui.sel.calOff = (ui.sel.calOff || 0) + 1; render(); }, calToday() { ui.sel.calOff = 0; ui.sel.calDay = TODAY; render(); } });

/* ---------- Final inspections ---------- */
const INSP = { requested: ['To schedule', 'warn'], scheduled: ['Scheduled', 'info'], closed: ['Closed', 'ok'] };
function pInspections() {
  const all = S.inspections.filter(i => { const r = byId(S.requests, i.requestId); return r && inScope(me(), r); });
  const tabs = [['open', 'Open', all.filter(i => i.status !== 'closed').length], ['closed', 'Closed', all.filter(i => i.status === 'closed').length]], tab = curTab('insp', 'open');
  const list = all.filter(i => (tab === 'open') === (i.status !== 'closed'));
  return `${pageHead('Final inspections', 'After work finishes, the contractor asks for an inspection before the request is closed.')}
  ${!closureOK() ? alertBox('info', 'View only', 'Your department does not close work. You can see inspections but not schedule or close them.') : ''}
  <section class="card">${tabsBar('insp', tabs, tab)}${list.length ? `<div class="table-wrap"><table class="table responsive"><thead><tr><th>Request</th><th>Contractor</th><th>Preferred</th><th>Status</th><th class="t-actions"><span class="sr">Actions</span></th></tr></thead><tbody>${list.map(i => { const r = byId(S.requests, i.requestId); return `<tr class="clickable" data-go="inspection-${i.id}"><td>${reqTitleCell(r)}</td><td data-m="sub">${esc(contractor(r.contractor).name)}</td><td data-m="hide" class="num">${i.scheduledFor ? fmtDT(i.scheduledFor) : fmtS(i.preferred) + ' · ' + i.time}</td><td data-m="side">${badge(...(i.status === 'closed' ? [i.outcome || 'Closed', 'ok'] : INSP[i.status]))}</td><td class="t-actions">${btn('Open', { sm: true, v: 'ghost', go: 'inspection-' + i.id })}</td></tr>`; }).join('')}</tbody></table></div>` : emptyState('clipboard', 'Nothing here', 'No inspections in this list.')}</section>`;
}
function pInspection(id) {
  const i = byId(S.inspections, id), r = i && byId(S.requests, i.requestId); if (!r || !inScope(me(), r)) return null;
  return `${pageHead(`${esc(r.title)} ${badge(...(i.status === 'closed' ? [i.outcome, 'ok'] : INSP[i.status]))}`, `<span class="id">${i.id}</span> · ${esc(contractor(r.contractor).name)} · ${esc(r.unit)}`, closureOK() && i.status === 'requested' ? btn('Schedule inspection', { v: 'primary', icon: 'calendar', act: 'inspSchedule', id: i.id }) : closureOK() && i.status === 'scheduled' ? btn('Close work', { v: 'primary', icon: 'check', act: 'inspClose', id: i.id }) : '', [['Final inspections', 'inspections'], [i.id]])}
  <div class="grid-main">${card('Contractor’s message', `<div class="stack"><p style="margin:0">${esc(i.notes)}</p><div class="row small muted"><span>${ic('image')} ${plural(i.photos, 'photo')} attached</span><span>Preferred ${fmtDay(i.preferred)}, ${i.time}</span></div></div>`)}
  ${card('Progress', `<div class="timeline">${[['Requested', fmtDT(i.requested), true], ['Scheduled', i.scheduledFor ? `${fmtDT(i.scheduledFor)} · ${esc(i.scheduledBy || '')}` : 'Not yet', !!i.scheduledFor], ['Closed', i.closedOn ? `${fmtDT(i.closedOn)} · ${esc(i.closedBy)} · ${esc(i.outcome)}` : 'Not yet', i.status === 'closed']].map(([a, b, d], k) => `<div class="tl ${d ? 'done' : ''}"><span class="dot">${d ? ic('check') : ''}</span><div class="grow"><b>${a}</b><span>${b}</span></div></div>`).join('')}</div>`)}</div>
  <div style="margin-top:16px">${btn('Open request', { go: 'review-' + r.id })}</div>`;
}
registerRoute('inspections', pInspections); registerPrefix('inspection-', pInspection);
MODALS.inspSchedule = m => modalFrame({ title: 'Schedule inspection', sub: 'The contractor is told the date and time.', size: 'sm', body: `<div class="grid-2">${F({ id: 'is-d', label: 'Date', type: 'date', bind: 'm.date', req: true })}${F({ id: 'is-t', label: 'Time', type: 'time', bind: 'm.time', req: true })}</div>`, foot: btn('Cancel', { act: 'closeModal' }) + btn('Schedule', { v: 'primary', act: 'inspScheduleOk' }) });
MODALS.inspClose = m => modalFrame({ title: 'Close this work', sub: 'Closing completes the request. This cannot be undone.', size: 'sm', body: `${F({ id: 'ic-o', label: 'Outcome', bind: 'm.outcome', options: ['Passed', 'Passed with remarks', 'Failed'], req: true, rerender: true })}${F({ id: 'ic-n', label: 'Notes', bind: 'm.note', type: 'textarea', rows: 3, opt: true })}`, foot: btn('Cancel', { act: 'closeModal' }) + btn('Close work', { v: 'primary', act: 'inspCloseOk' }) });
Object.assign(ACT, {
  inspSchedule(t) { const i = byId(S.inspections, t.dataset.id); ui.modal = { type: 'inspSchedule', data: { id: i.id, date: i.preferred, time: i.time } }; render(); },
  inspScheduleOk() { const d = ui.modal.data, i = byId(S.inspections, d.id), r = byId(S.requests, i.requestId); if (!d.date || !d.time) { toast('Choose a date and time.', { err: true }); return; } i.status = 'scheduled'; i.scheduledFor = d.date + 'T' + d.time; i.scheduledBy = me().name; r.history.push(H(nowISO(), me().name, 'Inspection scheduled for ' + fmtS(d.date))); ui.modal = null; persist(); toast('Inspection scheduled.'); render(); },
  inspClose(t) { ui.modal = { type: 'inspClose', data: { id: t.dataset.id, outcome: 'Passed', note: '' } }; render(); },
  inspCloseOk() {
    const d = ui.modal.data, i = byId(S.inspections, d.id), r = byId(S.requests, i.requestId);
    openConfirm({ title: 'Close this work?', message: `${r.title} is marked ${d.outcome.toLowerCase()} and the request is completed.`, confirmText: 'Close work', tone: 'warn', onConfirm: () => { i.status = 'closed'; i.outcome = d.outcome; i.closedOn = nowISO(); i.closedBy = me().name; i.report = true; r.status = 'completed'; r.history.push(H(nowISO(), me().name, 'Work closed', `${d.outcome}.${d.note ? ' ' + d.note : ''}`)); persist(); toast('Work closed.'); } });
  },
});

/* ---------- Access logs ---------- */
function pLogs() {
  if (!canViewLogs()) return null;
  const f = ui.filters, q = (ui.search.logs || '').toLowerCase(), props = isAdmin() ? null : me().properties;
  let list = S.logs.filter(l => !f.lgate || l.gate === f.lgate).filter(l => !f.ldir || l.dir === f.ldir).filter(l => !f.lday || l.ts.startsWith(f.lday)).filter(l => !q || (person(l.pid).name + ' ' + l.pass).toLowerCase().includes(q));
  const on = onSiteNow(), gates = uniq(S.logs.map(l => l.gate));
  return `${pageHead('Access logs', 'Every scan at a gate, newest first.', btn('Export CSV', { icon: 'download', act: 'demo', id: 'Export logs' }))}
  <div class="kpis">${kpi({ label: 'On site now', value: on.length, icon: 'users', tone: 'ok', sub: 'Last scan was an entry' })}${kpi({ label: 'Entries today', value: S.logs.filter(l => l.ts.startsWith(TODAY) && l.dir === 'in').length, icon: 'logIn', tone: 'info' })}${kpi({ label: 'Exits today', value: S.logs.filter(l => l.ts.startsWith(TODAY) && l.dir === 'out').length, icon: 'logout', tone: 'neutral' })}</div>
  <section class="card"><div class="filters-row"><div class="search">${ic('search')}<input class="input" data-search="logs" placeholder="Search by name or pass" value="${esc(ui.search.logs || '')}" aria-label="Search logs"></div>
    <select class="select" data-filter="lgate" aria-label="Gate"><option value="">All gates</option>${gates.map(g => `<option ${f.lgate === g ? 'selected' : ''}>${esc(g)}</option>`).join('')}</select>
    <select class="select" data-filter="ldir" aria-label="Direction"><option value="">Entries and exits</option><option value="in" ${f.ldir === 'in' ? 'selected' : ''}>Entries</option><option value="out" ${f.ldir === 'out' ? 'selected' : ''}>Exits</option></select>
    <input class="input" type="date" data-filter="lday" value="${esc(f.lday || '')}" aria-label="Date" style="width:auto"></div>
  ${list.length ? `<div class="table-wrap"><table class="table responsive"><thead><tr><th>Person</th><th>Direction</th><th>When</th><th>Gate</th><th>Pass</th></tr></thead><tbody>${list.slice(0, 40).map(l => { const p = person(l.pid); return `<tr><td><div class="t-title"><b>${esc(p.name)}</b><span>${esc(contractor(p.company).name)}</span></div></td><td data-m="side">${badge(l.dir === 'in' ? 'Entered' : 'Left', l.dir === 'in' ? 'ok' : 'neutral')}</td><td data-m="hide" class="num">${fmtDT(l.ts)}</td><td data-m="hide">${esc(l.gate)}<div class="mini">${esc(l.by)}</div></td><td data-m="sub"><button class="btn-link" data-go="pass-${l.pass}">${l.pass}</button></td></tr>`; }).join('')}</tbody></table></div>` : emptyState('list', 'No scans match', 'Try a different gate, date or search.')}
  <div class="pager"><span>Showing ${Math.min(40, list.length)} of ${list.length}</span></div></section>`;
}
registerRoute('logs', pLogs);

/* ---------- My profile ---------- */
function pProfile() {
  const u = me();
  if (ui.formTab !== 'profile' || !ui.form) { ui.form = { name: u.name, phone: u.phone, title: u.title, notify: u.notify !== false }; ui.formTab = 'profile'; ui.dirty = false; }
  return `${pageHead('My profile', 'Your details and how you’re notified.')}
  <div class="stack-lg" style="max-width:720px">${card('Your details', `<div class="grid-2">${F({ id: 'pf-n', label: 'Full name', bind: 'f.name', req: true })}${F({ id: 'pf-e', label: 'Email', value: u.email, disabled: true, hint: 'Your sign-in email can’t be changed here.' })}${F({ id: 'pf-p', label: 'Phone', bind: 'f.phone' })}${F({ id: 'pf-t', label: 'Job title', bind: 'f.title' })}</div>
    <div class="row" style="margin-top:12px">${badge(isAdmin() ? 'Administrator' : `Approver · ${u.dept} Level ${u.level}`, 'info')}${!isAdmin() ? badge('Properties: ' + u.properties.map(x => prop(x).name).join(', '), 'neutral') : ''}</div>`)}
  ${card('Notifications', sw('pf-nt', 'f.notify', 'Email me when a request needs my decision', 'Sent when a request reaches your approval step.', false), { })}
  ${card('Password', `<div class="row between"><p class="muted small" style="margin:0">Change the password you use to sign in.</p>${btn('Change password', { act: 'changePwd' })}</div>`)}</div>
  <div class="savebar" id="savebar" ${ui.dirty ? '' : 'hidden'}>${ic('info')}<span class="small">You have unsaved changes</span>${btn('Discard', { v: 'ghost', sm: true, act: 'profDiscard' })}${btn('Save changes', { v: 'primary', sm: true, act: 'profSave' })}</div>`;
}
registerRoute('profile', pProfile);
MODALS.pwd = m => modalFrame({ title: 'Change password', size: 'sm', body: `<div class="stack">${F({ id: 'pw-c', label: 'Current password', type: 'password', bind: 'm.cur', req: true })}${F({ id: 'pw-n', label: 'New password', type: 'password', bind: 'm.nw', req: true, hint: 'At least 8 characters.', err: m.data.err })}</div>`, foot: btn('Cancel', { act: 'closeModal' }) + btn('Change password', { v: 'primary', act: 'pwdOk' }) });
Object.assign(ACT, {
  changePwd() { ui.modal = { type: 'pwd', data: {} }; render(); },
  pwdOk() { const d = ui.modal.data; if (!d.cur) { d.err = 'Enter your current password.'; render(); return; } if ((d.nw || '').length < 8) { d.err = 'Use at least 8 characters.'; render(); return; } ui.modal = null; toast('Password changed.'); render(); },
  profDiscard() { openConfirm({ title: 'Discard unsaved changes?', message: 'Your edits will be lost.', confirmText: 'Discard', tone: 'danger', onConfirm: () => { ui.form = null; ui.dirty = false; } }); },
  profSave() { const f = ui.form; if (!f.name.trim()) { toast('Enter your name.', { err: true }); return; } Object.assign(me(), { name: f.name.trim(), phone: f.phone, title: f.title, notify: f.notify }); persist(); ui.dirty = false; ui.form = null; toast('Profile saved.'); render(); },
});
