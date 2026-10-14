/* Work permits: passes, calendar, final inspections, access logs and profile (shared). */
const holderName = p => p.holder ? contractor(p.holder).name : (p.walkIn || 'Walk-in guest');
const passPeople = p => [...(p.people || []).map(person).map(x => ({ name: x.name, sub: `${x.role} · ${x.idType} ${x.idNo}` })), ...(p.guests || []).map(g => ({ name: g.name, sub: `Guest · ${g.idType} ${g.idNo}` }))];
const passVisible = p => isAdmin() || (me().properties || []).includes(p.property);

/* ---------- Passes ---------- */
function pPasses() {
  const list0 = S.passes.filter(passVisible), st = p => passState(p);
  const T = [['active', 'Active'], ['upcoming', 'Upcoming'], ['expired', 'Expired'], ['revoked', 'Revoked'], ['suspended', 'Suspended'], ['completed', 'Completed']];
  const tabs = [...T.map(([k, l]) => [k, l, list0.filter(p => st(p) === k).length]), ['all', 'All', list0.length]];
  const tab = curTab('passes', 'active'), q = (ui.search.passes || '').toLowerCase();
  const list = list0.filter(p => tab === 'all' || st(p) === tab).filter(p => !q || [p.id, p.title, holderName(p), p.unit].join(' ').toLowerCase().includes(q)).sort((a, b) => b.issued.localeCompare(a.issued));
  return `${pageHead('Passes', `Every approved pass. Open one to see its approvals, documents, people and more.${S.settings.finalInspection ? ' Finished work is marked as completed inside the pass.' : ''}`, can('issue') ? btn('Issue a pass', { v: 'primary', icon: 'plus', go: 'issue-pass' }) : '')}
  ${!isAdmin() && !canComplete() ? alertBox('info', 'View only', 'Your account can see passes but not change them.') : ''}
  <section class="card">${tabsBar('passes', tabs, tab)}<div class="filters-row"><div class="search">${ic('search')}<input class="input" data-search="passes" placeholder="Search by pass, holder or unit" value="${esc(ui.search.passes || '')}" aria-label="Search passes"></div></div>
  ${list.length ? `<div class="table-wrap"><table class="table responsive"><thead><tr><th>Pass</th><th>Holder</th><th>Location</th><th>Valid</th><th>Status</th><th class="t-actions"><span class="sr">Actions</span></th></tr></thead><tbody>${list.map(p => `<tr class="clickable" data-go="pass-${p.id}"><td><div class="t-title"><b>${esc(p.title)}</b><span><span class="id">${p.id}</span> · ${p.amc ? 'Maintenance contract' : p.kind === 'work' ? 'Work pass' : p.kind === 'visitor' ? 'Visitor pass' : 'Manual pass'}</span></div></td><td data-m="sub">${esc(holderName(p))}</td><td data-m="hide">${esc(p.unit)}<div class="mini">${esc(prop(p.property).name)}</div></td><td data-m="hide" class="num">${range(p.from, p.to)}</td><td data-m="side">${passBadge(p)}</td><td class="t-actions">${btn('View', { sm: true, v: 'ghost', go: 'pass-' + p.id })}</td></tr>`).join('')}</tbody></table></div>` : emptyState('ticket', 'No passes here', q ? 'No passes match your search.' : 'Passes appear here once requests are approved.')}
  <div class="pager"><span>Showing ${list.length} pass${list.length === 1 ? '' : 'es'}</span></div></section>`;
}
function passIssueTimeline(p) {
  return `<div class="timeline"><div class="tl done"><span class="dot">${ic('check')}</span><div class="grow"><b>Issued by ${esc(p.issuedBy)}</b><span>${fmtDT(p.issued)}</span><p class="small" style="margin:6px 0 0;color:var(--text-2)">Issued directly by the community. There was no request to approve.</p></div></div></div>`;
}
function pPass(id) {
  const p = byId(S.passes, id); if (!p || !passVisible(p)) return null;
  const ppl = passPeople(p), s = passState(p), r = p.requestId && byId(S.requests, p.requestId), pay = r && payOf(r);
  const extras = r ? (r.extraPeople || []) : [], fi = r && S.inspections.find(x => x.requestId === r.id);
  const tabs = r ? [['pass', 'Pass'], ['overview', 'Details & approvals'], ['documents', 'Documents', r.docs.length], ['people', 'People', r.people.length + extras.length], ['company', 'Company'], ['site', 'Vehicles & materials'], ['terms', 'Signed terms'], ['history', 'History', r.history.length]] : [['pass', 'Pass'], ['overview', 'Approval']];
  const tab = curTab('ps-' + id, 'pass');
  const actions = (canMarkDone(p) ? btn('Mark as completed', { icon: 'check', act: 'markDone', id: p.id }) : '') + (isAdmin() && ['active', 'upcoming'].includes(s) ? btn('Revoke pass', { v: 'danger', icon: 'ban', act: 'revokePass', id: p.id }) : '') + btn('Download PDF', { icon: 'download', act: 'passPdf', id: p.id });
  const main = `<div class="grid-main"><div class="stack-lg">
    ${card('Pass details', `<div class="pass-hero"><div class="qr-card ${s === 'active' || s === 'upcoming' ? '' : 'dim'}">${qrSvg(p.id)}</div><dl class="kv-list"><dt>Holder</dt><dd>${esc(holderName(p))}</dd><dt>Location</dt><dd>${esc(p.unit)}, ${esc(prop(p.property).name)}</dd><dt>Valid</dt><dd>${range(p.from, p.to)}</dd><dt>Status</dt><dd>${passBadge(p)}${s === 'upcoming' ? ' <span class="muted small">Starts ' + fmtDay(p.from) + '. Work has not started yet.</span>' : ''}</dd><dt>Type</dt><dd>${p.amc ? 'Maintenance contract' : p.kind === 'work' ? 'Work pass' : p.kind === 'visitor' ? 'Visitor pass' : 'Manual pass'}</dd>${r ? `<dt>Request</dt><dd><button class="btn-link" data-go="review-${r.id}">${r.id} · ${esc(r.title)}</button></dd>` : ''}</dl></div>`)}
    ${card(`People allowed in (${ppl.length + extras.length})`, ppl.map(x => `<div class="person-row"><span class="avatar">${initials(x.name)}</span><div class="meta"><b>${esc(x.name)}</b><span>${esc(x.sub)}</span></div></div>`).join('') + extras.map(x => { const w = person(x.pid); return `<div class="person-row"><span class="avatar">${initials(w.name)}</span><div class="meta"><b>${esc(w.name)}</b><span>${esc(w.role)} · added after approval</span></div>${x.revoked ? badge('Revoked', 'bad') : badge('Added later', 'info')}</div>`; }).join('') || '<p class="muted small" style="margin:0">No named people.</p>', { tight: true })}
  </div><div class="stack-lg">
    ${pay ? card('Payment', `<div class="stack-sm"><div class="row between"><b style="font-size:18px">${money(pay.amount)}</b>${badge('Paid', 'ok')}</div><span class="muted small">${payLabel(pay.method)} · ${fmtDT(pay.ts)}</span><div class="row">${btn('View invoice', { sm: true, icon: 'receipt', act: 'invoiceOpen', id: pay.id })}</div></div>`) : ''}
    ${fi ? card('Final inspection', `<div class="stack-sm"><div class="row between"><b>${fi.id}</b>${badge(...insBadge(fi))}</div>${btn('Open inspection', { sm: true, go: 'inspection-' + fi.id })}${fi.status === 'closed' ? btn('Closure report', { sm: true, icon: 'file', act: 'reportOpen', id: fi.id }) : ''}</div>`) : ''}
    ${card('Vehicles', (p.vehicles || []).length ? p.vehicles.map(v => `<div class="list-row"><span class="ic tone-neutral">${ic('car')}</span><span class="grow"><b>${esc(v.plate)}</b><span>${esc(v.type)}</span></span></div>`).join('') : '<p class="muted small" style="margin:0">No vehicles.</p>', { tight: true })}
    ${card('Recent gate activity', (() => { const l = S.logs.filter(x => x.pass === p.id).slice(0, 4); return l.length ? l.map(x => `<div class="list-row"><span class="ic tone-${x.dir === 'in' ? 'ok' : 'neutral'}">${ic(x.dir === 'in' ? 'logIn' : 'logout')}</span><span class="grow"><b>${esc(person(x.pid).name)} ${x.dir === 'in' ? 'entered' : 'left'}</b><span>${fmtDT(x.ts)} · ${esc(x.gate)}${x.manual ? ' · checked out by hand' : ''}</span></span></div>`).join('') : '<p class="muted small" style="margin:0">No scans yet.</p>'; })(), { tight: true })}</div></div>`;
  const body = tab === 'pass' ? main : !r ? card('Approval', passIssueTimeline(p)) : { overview: tabOverview, documents: tabDocuments, people: tabPeople, company: tabCompany, site: tabSite, terms: tabTerms, history: tabHistory }[tab](r, true);
  return `${pageHead(`${esc(p.title)} ${passBadge(p)}${p.amc ? ' ' + badge('Maintenance contract', 'info') : ''}`, `<span class="id">${p.id}</span> · issued ${fmtDT(p.issued)} by ${esc(p.issuedBy)}`, actions, [['Passes', 'passes'], [p.id]])}
  ${p.revoked ? alertBox('bad', 'This pass was revoked', `${esc(p.revoked.reason)} <span class="faint">· ${esc(p.revoked.by)}, ${fmtDT(p.revoked.on)}</span>`) : ''}
  ${s === 'suspended' ? alertBox('bad', 'This company is suspended', 'The pass does not work at the gate while the company is suspended.', isAdmin() ? btn('Open contractor', { sm: true, go: 'contractor-' + p.holder }) : '') : ''}
  ${p.completed ? alertBox('ok', 'Marked as completed', `${esc(p.completed.by)} · ${fmtDT(p.completed.on)}.${fi ? ' It is in Final inspections.' : ''}`) : ''}
  <div class="stack">${tabsBar('ps-' + id, tabs, tab)}${body}</div>`;
}
registerRoute('passes', pPasses); registerPrefix('pass-', pPass);
ACT.revokePass = t => { const p = byId(S.passes, t.dataset.id); openConfirm({ title: `Revoke ${p.id}?`, message: 'The pass stops working at the gate straight away. The contractor is told why.', confirmText: 'Revoke pass', tone: 'danger', reason: { label: 'Reason for revoking', min: 10, ph: 'For example: unsafe practice reported by security.' }, onConfirm: d => { p.revoked = { on: nowISO(), by: me().name, reason: d.reason.trim() }; persist(); toast(`${p.id} revoked.`); } }); };

/* ---------- Issue a pass (admin) ---------- */
function pIssuePass() {
  if (!can('issue')) return null;
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
const insBadge = i => i.status === 'closed' ? [i.outcome === 'Completed' ? 'Closed · completed' : 'Closed · incomplete', i.outcome === 'Completed' ? 'ok' : 'warn'] : i.status === 'waiting' ? ['Waiting for contractor', 'warn'] : ['Needs review', 'info'];
const DEC = { not_ready: ['Not complete yet', 'warn'], complete: ['Completed', 'ok'], incomplete: ['Closed as incomplete', 'bad'], resubmitted: ['Contractor finished again', 'info'] };
function pInspections() {
  if (!S.settings.finalInspection) return null;
  const all = S.inspections.filter(i => { const r = byId(S.requests, i.requestId); return r && inScope(me(), r); });
  const tabs = [['pending', 'Needs review', all.filter(i => i.status === 'pending').length], ['waiting', 'Waiting for contractor', all.filter(i => i.status === 'waiting').length], ['closed', 'Closed', all.filter(i => i.status === 'closed').length]], tab = curTab('insp', 'pending');
  const list = all.filter(i => i.status === tab);
  return `${pageHead('Final inspections', 'Work marked as completed comes here. The closing department checks it, adds feedback and closes it.')}
  ${!isAdmin() && !S.permitTypes.some(t => t.closure && t.closureDepartments.includes(me().dept)) ? alertBox('info', 'View only', 'Your department does not close work. You can read inspections but not close them.') : ''}
  <section class="card">${tabsBar('insp', tabs, tab)}${list.length ? `<div class="table-wrap"><table class="table responsive"><thead><tr><th>Request</th><th>Contractor</th><th>Marked completed</th><th>Status</th><th class="t-actions"><span class="sr">Actions</span></th></tr></thead><tbody>${list.map(i => { const r = byId(S.requests, i.requestId); return `<tr class="clickable" data-go="inspection-${i.id}"><td>${reqTitleCell(r)}</td><td data-m="sub">${esc(contractor(r.contractor).name)}</td><td data-m="hide" class="num">${fmtDT(i.requested)}</td><td data-m="side">${badge(...insBadge(i))}</td><td class="t-actions">${btn(i.status === 'pending' && closureOK(r) ? 'Review' : 'View', { sm: true, v: i.status === 'pending' && closureOK(r) ? 'primary' : 'ghost', go: 'inspection-' + i.id })}</td></tr>`; }).join('')}</tbody></table></div>` : emptyState('clipboard', 'Nothing here', tab === 'pending' ? 'No finished work is waiting for review.' : 'No inspections in this list.')}</section>`;
}
function pInspection(id) {
  const i = byId(S.inspections, id), r = i && byId(S.requests, i.requestId); if (!r || !inScope(me(), r)) return null;
  const can = closureOK(r), pass = r.passId && byId(S.passes, r.passId);
  const steps = [{ title: 'Marked as completed', who: contractor(r.contractor).name, ts: i.requested, note: i.notes, files: [], tone: 'done' }, ...i.rounds.map(x => ({ title: DEC[x.decision][0], who: x.by, ts: x.ts, note: x.comment, files: x.files, tone: x.decision === 'complete' ? 'done' : x.decision === 'incomplete' ? 'bad' : x.decision === 'not_ready' ? 'warn' : 'done' }))];
  const actions = (i.status === 'pending' && can ? btn('Review and close', { v: 'primary', icon: 'check', act: 'inspReview', id: i.id }) : '') + (i.status === 'waiting' && can ? btn('Demo: contractor finished again', { v: 'ghost', act: 'inspResubmit', id: i.id }) : '') + (i.status === 'closed' ? btn('Closure report', { v: 'primary', icon: 'file', act: 'reportOpen', id: i.id }) + btn('Download PDF', { icon: 'download', act: 'reportPdf', id: i.id }) : '');
  return `${pageHead(`${esc(r.title)} ${badge(...insBadge(i))}`, `<span class="id">${i.id}</span> · ${esc(contractor(r.contractor).name)} · ${esc(r.unit)}`, actions, [['Final inspections', 'inspections'], [i.id]])}
  ${i.status === 'waiting' ? alertBox('warn', 'Waiting for the contractor', 'They were told what is still missing. When they finish and mark it completed again, it comes back to Needs review.') : ''}
  ${i.status === 'pending' && !can ? alertBox('info', 'View only', 'Only the closing departments and administrators can close this work.') : ''}
  <div class="grid-main"><div class="stack-lg">
  ${card('Inspection history', `<div class="timeline">${steps.map((x, k) => `<div class="tl ${x.tone === 'bad' ? '' : x.tone === 'warn' ? '' : 'done'} ${k === steps.length - 1 && i.status !== 'closed' ? 'now' : ''}"><span class="dot">${x.tone === 'bad' ? ic('x') : x.tone === 'warn' ? ic('alert') : ic('check')}</span><div class="grow"><b>${esc(x.title)}</b><span>${esc(x.who)} · ${fmtDT(x.ts)}</span>${x.note ? `<p class="small" style="margin:6px 0 0;color:var(--text-2)">${esc(x.note)}</p>` : ''}${(x.files || []).length ? `<div class="chips-row" style="margin-top:6px">${x.files.map(f => `<span class="chip">${ic('file')} ${esc(f)}</span>`).join('')}</div>` : ''}</div></div>`).join('')}</div>`)}
  ${i.status === 'closed' ? card('Closing remark', `<div class="stack-sm"><div class="row">${badge(...insBadge(i))}<span class="muted small">${esc(i.closedBy)} · ${fmtDT(i.closedOn)}</span></div><p style="margin:0">${esc(i.remark)}</p></div>`) : ''}</div>
  <div class="stack-lg">${card('Work details', `<dl class="kv-list" style="grid-template-columns:110px 1fr"><dt>Request</dt><dd><button class="btn-link" data-go="review-${r.id}">${r.id}</button></dd><dt>Type</dt><dd>${esc(ptype(r.type).name)}</dd><dt>Location</dt><dd>${esc(r.unit)}, ${esc(prop(r.property).name)}</dd><dt>Dates</dt><dd>${range(r.from, r.to)}</dd>${pass ? `<dt>Pass</dt><dd><button class="btn-link" data-go="pass-${pass.id}">${pass.id}</button></dd>` : ''}<dt>Closed by</dt><dd>${esc(ptype(r.type).closureDepartments.join(', ') || 'Administrators')}</dd></dl>`)}</div></div>`;
}
registerRoute('inspections', pInspections); registerPrefix('inspection-', pInspection);
MODALS.inspReview = m => { const d = m.data, e = d.errs || {};
  return modalFrame({ title: 'Review and close', sub: 'Add your feedback. Attach photos or documents if needed.', size: '', body: `<div class="stack-lg">
  <div class="field"><span class="label">Decision</span><div class="stack-sm">${[['complete', 'Work is complete', 'Close it. A closure report is created.'], ['not_ready', 'Not complete yet', 'Keep it open. The contractor is told what to fix and marks it completed again.'], ['incomplete', 'Close as incomplete', 'Close it for good although the work is not finished.']].map(([v, l, s]) => `<label class="check"><input type="radio" name="ins-d" value="${v}" data-bind="m.decision" data-rerender ${d.decision === v ? 'checked' : ''}><span>${l}<small>${s}</small></span></label>`).join('')}</div></div>
  ${F({ id: 'ins-c', label: d.decision === 'complete' ? 'Closing remark' : 'Feedback for the contractor', bind: 'm.comment', type: 'textarea', rows: 3, req: true, err: e.comment, ph: d.decision === 'not_ready' ? 'What is still missing?' : 'Write a short remark.' })}
  <div class="field"><span class="label">Photos or documents <span class="opt">(optional)</span></span><label class="dropzone" for="ins-file"><span class="ic">${ic('upload')}</span><b>Add photos or documents</b><span class="xs faint">Images or PDF</span></label><input class="file-input" type="file" id="ins-file" multiple accept="image/*,application/pdf" data-insfile>${d.files.length ? `<div class="chips-row" style="margin-top:6px">${d.files.map((f, k) => `<span class="chip">${esc(f)}<button type="button" data-act="insFileRemove" data-id="${k}" aria-label="Remove ${esc(f)}">${ic('x')}</button></span>`).join('')}</div>` : ''}</div></div>`, foot: btn('Cancel', { act: 'closeModal' }) + btn(d.decision === 'complete' ? 'Close as complete' : d.decision === 'not_ready' ? 'Send back to contractor' : 'Close as incomplete', { v: d.decision === 'incomplete' ? 'danger' : 'primary', act: 'inspDecide' }) }); };
document.addEventListener('change', e => { const el = e.target; if (el.dataset && el.dataset.insfile !== undefined && ui.modal && ui.modal.type === 'inspReview') { [...el.files].forEach(f => ui.modal.data.files.push(f.name)); el.value = ''; render(); } });
MODALS.report = m => { const i = byId(S.inspections, m.data.id), r = byId(S.requests, i.requestId), c = contractor(r.contractor), pass = r.passId && byId(S.passes, r.passId);
  return modalFrame({ title: `Closure report ${i.id}`, sub: `${esc(r.title)} · ${r.id}`, size: 'lg', body: `<div class="sheet"><div class="stamp">${ic('check')} ${esc(i.outcome === 'Completed' ? 'CLOSED · COMPLETED' : 'CLOSED · INCOMPLETE')}</div><h3>${esc(S.community.name)}</h3><p>Work closure report</p><div class="rule"></div>
    <dl class="kv"><dt>Permit</dt><dd>${r.id} · ${esc(ptype(r.type).name)}</dd><dt>Work</dt><dd>${esc(r.title)}</dd><dt>Contractor</dt><dd>${esc(c.name)}</dd><dt>Location</dt><dd>${esc(r.unit)}, ${esc(prop(r.property).name)}</dd><dt>Dates</dt><dd>${range(r.from, r.to)} · ${esc(r.hours)}</dd><dt>Workers</dt><dd>${r.people.map(person).map(x => esc(x.name)).join(', ')}</dd>${pass ? `<dt>Pass</dt><dd>${pass.id}</dd>` : ''}<dt>Marked completed</dt><dd>${fmtDT(i.requested)}</dd><dt>Closed</dt><dd>${fmtDT(i.closedOn)} by ${esc(i.closedBy)}</dd><dt>Outcome</dt><dd>${esc(i.outcome === 'Completed' ? 'Completed' : 'Closed as incomplete')}</dd></dl>
    <div class="rule" style="height:1px"></div><b>Contractor’s completion notes</b><p>${esc(i.notes)}</p><b>Inspection</b>${i.rounds.map(x => `<p><b>${esc(DEC[x.decision][0])}</b> · ${esc(x.by)} · ${fmtDT(x.ts)}<br>${esc(x.comment)}${x.files.length ? `<br><span style="color:#5E6A7C">Attached: ${x.files.map(esc).join(', ')}</span>` : ''}</p>`).join('')}<div class="rule" style="height:1px"></div><b>Closing remark</b><p>${esc(i.remark)}</p></div>`, foot: btn('Close', { act: 'closeModal' }) + btn('Download PDF', { v: 'primary', icon: 'download', act: 'reportPdf', id: i.id }) }); };
Object.assign(ACT, {
  inspReview(t) { ui.modal = { type: 'inspReview', data: { id: t.dataset.id, decision: 'complete', comment: '', files: [] } }; render(); },
  insFileRemove(t) { ui.modal.data.files.splice(+t.dataset.id, 1); render(); },
  inspDecide() {
    const d = ui.modal.data, i = byId(S.inspections, d.id), r = byId(S.requests, i.requestId);
    if (d.comment.trim().length < 5) { d.errs = { comment: 'Write at least a short remark.' }; render(); return; }
    const lab = { complete: ['Close this work as complete?', 'The request is completed and a closure report is created.', 'Close as complete', 'ok'], not_ready: ['Send it back to the contractor?', 'It stays here as waiting. The contractor sees your feedback and marks it completed again when ready.', 'Send back', 'warn'], incomplete: ['Close as incomplete?', 'The work is closed for good although it is not finished. This is written in the closure report.', 'Close as incomplete', 'danger'] }[d.decision];
    openConfirm({ title: lab[0], message: lab[1], confirmText: lab[2], tone: lab[3], onConfirm: () => {
      i.rounds.push({ ts: nowISO(), by: me().name, decision: d.decision, comment: d.comment.trim(), files: [...d.files] });
      if (d.decision === 'not_ready') { i.status = 'waiting'; r.history.push(H(nowISO(), me().name, 'Final inspection: not complete yet', d.comment.trim())); }
      else { i.status = 'closed'; i.outcome = d.decision === 'complete' ? 'Completed' : 'Incomplete'; i.remark = d.comment.trim(); i.closedOn = nowISO(); i.closedBy = me().name; r.status = 'completed'; r.history.push(H(nowISO(), me().name, d.decision === 'complete' ? 'Work closed' : 'Closed as incomplete', d.comment.trim())); }
      persist(); toast(d.decision === 'not_ready' ? 'Sent back to the contractor.' : 'Work closed. The closure report is ready.');
    } });
  },
  inspResubmit(t) { const i = byId(S.inspections, t.dataset.id), r = byId(S.requests, i.requestId); i.rounds.push({ ts: nowISO(), by: contractor(r.contractor).name + ' (contractor)', decision: 'resubmitted', comment: 'The required work is finished.', files: [] }); i.status = 'pending'; r.history.push(H(nowISO(), contractor(r.contractor).name, 'Marked as completed again')); persist(); toast('Back in Needs review.'); render(); },
  reportOpen(t) { ui.modal = { type: 'report', data: { id: t.dataset.id } }; render(); },
});
/* ---------- Access logs ---------- */
function pLogs() {
  if (!canViewLogs()) return null;
  const f = ui.filters, q = (ui.search.logs || '').toLowerCase();
  let list = S.logs.filter(canSeeLog).filter(l => !f.lgate || l.gate === f.lgate).filter(l => !f.ldir || l.dir === f.ldir).filter(l => !f.lday || l.ts.startsWith(f.lday)).filter(l => !q || (person(l.pid).name + ' ' + l.pass).toLowerCase().includes(q));
  const on = onSiteNow().filter(pid => canSeeLog(lastLog(pid))), over = overstayers(), gates = uniq(S.logs.map(l => l.gate));
  const onRows = on.map(pid => { const l = lastLog(pid), p = person(pid), o = over.find(x => x.pid === pid); return `<div class="list-row"><span class="avatar">${initials(p.name)}</span><span class="grow"><b>${esc(p.name)}</b><span>${esc(contractor(p.company).name)} · in since ${fmtDT(l.ts)} · ${esc(l.gate)} · until ${permitEnd(l)}</span></span>${o ? badge(`${o.hours} h over time limit`, 'bad') : badge('Within hours', 'ok')}${canCheckout() ? btn('Check out', { sm: true, v: o ? 'primary' : 'secondary', act: 'checkout', id: pid }) : ''}</div>`; }).join('');
  return `${pageHead('Access logs', 'Every scan at a gate, newest first.', btn('Export CSV', { icon: 'download', act: 'demo', id: 'Export logs' }))}
  ${overstayAlert(over)}
  <div class="kpis">${kpi({ label: 'On site now', value: on.length, icon: 'users', tone: 'ok', sub: 'Last scan was an entry' })}${kpi({ label: 'Past time limit', value: over.length, icon: 'clock', tone: over.length ? 'bad' : 'neutral', sub: over.length ? 'Need a review' : 'None' })}${kpi({ label: 'Entries today', value: S.logs.filter(l => l.ts.startsWith(TODAY) && l.dir === 'in' && canSeeLog(l)).length, icon: 'logIn', tone: 'info' })}${kpi({ label: 'Exits today', value: S.logs.filter(l => l.ts.startsWith(TODAY) && l.dir === 'out' && canSeeLog(l)).length, icon: 'logout', tone: 'neutral' })}</div>
  ${card('Inside now', onRows || '<p class="muted small" style="padding:12px;margin:0">Nobody is on site.</p>', { tight: true, sub: canCheckout() ? 'Check out someone by hand if the gate did not scan them out.' : 'You can see who is inside but not check people out.' })}
  <section class="card" style="margin-top:16px"><div class="filters-row"><div class="search">${ic('search')}<input class="input" data-search="logs" placeholder="Search by name or pass" value="${esc(ui.search.logs || '')}" aria-label="Search logs"></div>
    <select class="select" data-filter="lgate" aria-label="Gate"><option value="">All gates</option>${gates.map(g => `<option ${f.lgate === g ? 'selected' : ''}>${esc(g)}</option>`).join('')}</select>
    <select class="select" data-filter="ldir" aria-label="Direction"><option value="">Entries and exits</option><option value="in" ${f.ldir === 'in' ? 'selected' : ''}>Entries</option><option value="out" ${f.ldir === 'out' ? 'selected' : ''}>Exits</option></select>
    <input class="input" type="date" data-filter="lday" value="${esc(f.lday || '')}" aria-label="Date" style="width:auto"></div>
  ${list.length ? `<div class="table-wrap"><table class="table responsive"><thead><tr><th>Person</th><th>Direction</th><th>When</th><th>Gate</th><th>Pass</th></tr></thead><tbody>${list.slice(0, 40).map(l => { const p = person(l.pid); return `<tr><td><div class="t-title"><b>${esc(p.name)}</b><span>${esc(contractor(p.company).name)}</span></div></td><td data-m="side">${badge(l.dir === 'in' ? 'Entered' : 'Left', l.dir === 'in' ? 'ok' : 'neutral')}${l.manual ? '<div class="mini">By hand</div>' : ''}</td><td data-m="hide" class="num">${fmtDT(l.ts)}</td><td data-m="hide">${esc(l.gate)}<div class="mini">${esc(l.by)}</div></td><td data-m="sub"><button class="btn-link" data-go="pass-${l.pass}">${l.pass}</button></td></tr>`; }).join('')}</tbody></table></div>` : emptyState('list', 'No scans match', 'Try a different gate, date or search.')}
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
