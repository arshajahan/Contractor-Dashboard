/* Work permits (shared by Admin and Approver): dashboards, pending approval and the review screen. */
const nowISO = () => { const d = new Date(NOW.getTime() + Math.max(0, Date.now() - (window.__loadedAt || Date.now()))); return iso(d) + 'T' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
const H = (ts, actor, action, note) => ({ ts, actor, action, note: note || '' });
const firstName = n => String(n).split(' ')[0];

/* ---------- chart data ---------- */
function ageBuckets(list) { const b = [0, 0, 0]; list.forEach(r => { const h = age(r); b[h < 24 ? 0 : h < 48 ? 1 : 2]++; }); return b; }
function backlogByStage(list) { const m = {}; list.forEach(r => { const st = curStage(r); if (st) m[stageName(st)] = (m[stageName(st)] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1]); }
function workDays(n, list) {
  return Array.from({ length: n }, (_, i) => {
    const d = addDays(TODAY, i), wk = D(d).toLocaleDateString('en-GB', { weekday: 'short' });
    const ap = list.filter(r => ['approved', 'inspection'].includes(r.status) && r.from <= d && r.to >= d).length, pe = list.filter(r => r.status === 'review' && r.from <= d && r.to >= d).length;
    return { date: d, label: wk.slice(0, 3), sub: String(D(d).getDate()), values: [ap, pe], flag: isRestricted(d), go: 'calendar' };
  });
}
function movementDays(n = 7) {
  return Array.from({ length: n }, (_, i) => {
    const d = addDays(TODAY, i - (n - 1)), day = S.logs.filter(l => l.ts.startsWith(d));
    return { label: D(d).toLocaleDateString('en-GB', { weekday: 'short' }), date: d, in: day.filter(l => l.dir === 'in').length, out: day.filter(l => l.dir === 'out').length };
  });
}
HOW.age = { title: 'How long requests have waited', text: 'Counts distinct pending requests by time since submission: under 24 hours, 24–48 hours and over 48 hours. These groups help you spot older requests. They are not promised service deadlines.' };
HOW.backlog = { title: 'Waiting by approval step', text: 'Counts pending requests at their current approval step. A request is not counted in later steps until it reaches them.' };
HOW.work = { title: 'Scheduled work', text: 'Approved work and pending work are plotted separately across each request’s inclusive start and end dates. Hatched days are days when work is not allowed. This shows planned activity, not a forecast.' };
HOW.moves = { title: 'People entering and leaving', text: 'Separate counts of gate entries and exits per day, in the community timezone. Their sum is activity, not the number of people on site.' };
HOW.outcomes = { title: 'Request outcomes', text: 'Distinct requests by their current status in the selected period. This is a snapshot of where requests ended up, not an approval rate.' };
HOW.contractors = { title: 'Contractor activity', text: 'Distinct requests per company in the selected period, split by status. A request is counted once even if it has many workers or documents.' };
HOW.amc = { title: 'Maintenance contract visits', text: 'Compares the visits a contract requires in the current period with distinct completed visits. Repeated gate scans on the same day count as one visit.' };
HOW.decide = { title: 'Time to decision', text: 'The median time between a request being submitted and its final approval, rejection or change request, for requests decided in the selected period.' };

/* ---------- small building blocks ---------- */
const reqTitleCell = r => `<div class="t-title"><b>${esc(r.title)}</b><span><span class="id">${r.id}</span> · ${esc(ptype(r.type).name)}</span></div>`;
function reqTable(list, o = {}) {
  if (!list.length) return emptyState('inbox', o.emptyTitle || 'Nothing here', o.emptyText || 'No requests match.');
  return `<div class="table-wrap"><table class="table responsive"><thead><tr><th>Request</th><th>Contractor</th><th>Location</th><th>Work dates</th><th>Waiting</th><th>Approval step</th><th class="t-actions"><span class="sr">Actions</span></th></tr></thead><tbody>
  ${list.map(r => { const st = curStage(r), mine = canActOn(r); return `<tr class="clickable" data-go="review-${r.id}">
    <td>${reqTitleCell(r)}</td><td data-m="sub">${esc(contractor(r.contractor).name)}</td>
    <td data-m="hide">${esc(r.unit)}<div class="mini">${esc(prop(r.property).name)}</div></td>
    <td data-m="hide" class="num">${range(r.from, r.to)}<div class="mini">${plural(r.people.length, 'worker')}</div></td>
    <td data-m="side">${r.status === 'review' ? ageChip(age(r)) : reqBadge(r)}</td>
    <td data-m="hide">${r.status === 'review' ? `<div class="stack-sm" style="gap:5px">${stageTrack(r)}<span class="mini">${stageName(st)}</span></div>` : '<span class="faint">—</span>'}</td>
    <td class="t-actions">${r.status === 'review' ? btn(mine ? 'Review' : 'View', { v: mine ? 'primary' : 'secondary', sm: true, go: 'review-' + r.id }) : btn('View', { sm: true, v: 'ghost', go: 'review-' + r.id })}</td></tr>`; }).join('')}</tbody></table></div>`;
}
const queueIds = () => (myQueue().length || !isAdmin() ? myQueue() : pending()).slice().sort((a, b) => age(b) - age(a)).map(r => r.id);


/* ---------- People who stayed past their permitted hours ---------- */
function overstayAlert(list) {
  if (!list.length) return '';
  return alertBox('bad', `${plural(list.length, 'person is', 'people are')} past their time limit`, `${esc(list.slice(0, 2).map(o => person(o.pid).name).join(' and '))}${list.length > 2 ? ' and more' : ''} should have left. Check with the gate and check them out if needed.`, canViewLogs() ? btn('Open access logs', { sm: true, go: 'logs' }) : '', 'clock');
}
function overstayCard(list) {
  if (!list.length) return '';
  return card('Past their time limit', list.map(o => { const p = person(o.pid), pass = byId(S.passes, o.l.pass);
    return `<div class="list-row"><span class="ic tone-bad">${ic('clock')}</span><span class="grow"><b>${esc(p.name)}</b><span>${esc(contractor(p.company).name)} · ${esc(pass ? pass.title : 'Pass')} · in since ${fmtDT(o.l.ts)} · should have left at ${o.end}</span></span>${badge(`${o.hours} h over`, 'bad')}${canCheckout() ? btn('Check out', { sm: true, act: 'checkout', id: o.pid }) : ''}</div>`; }).join(''), { tight: true, sub: 'Still inside after their permitted hours. These need a review.' });
}
ACT.checkout = t => {
  const p = person(t.dataset.id);
  openConfirm({ title: `Check out ${p.name}?`, message: 'Records them as having left now. Use this when they have gone but the gate did not scan them out.', confirmText: 'Check out', icon: 'logout', tone: 'warn', reason: { label: 'Note', required: false, ph: 'Optional. For example: left through the service gate.' }, onConfirm: d => { doCheckout(p.id, (d.reason || '').trim()); persist(); toast(`${p.name} checked out.`); } });
};

/* ---------- Admin dashboard ---------- */
function pDashboardAdmin() {
  const pend = pending(), over48 = pend.filter(r => age(r) >= 48), over24 = pend.filter(r => age(r) >= 24);
  const soon = visibleRequests().filter(r => ['review', 'approved'].includes(r.status) && r.from <= addDays(TODAY, 2) && r.to >= TODAY);
  const soonP = soon.filter(r => r.status === 'review').length, soonA = soon.length - soonP;
  const onSite = onSiteNow(), mv = movementDays(7), today = mv[mv.length - 1];
  const closing = S.inspections.filter(i => ['pending', 'waiting'].includes(i.status));
  const a = ageBuckets(pend), back = backlogByStage(pend), days14 = workDays(14, visibleRequests());
  const decide = pend.slice().sort((x, y) => age(y) - age(x)).slice(0, 5);
  const exp = expiringContractors();
  const feed = S.requests.flatMap(r => r.history.filter(h => /Approved|Rejected|Requested changes|Work closed|Final/.test(h.action)).map(h => ({ ...h, r }))).sort((x, y) => y.ts.localeCompare(x.ts)).slice(0, 6);
  const amcRows = S.amc.map(x => { const done = x.visits.length; return { x, done, ok: done >= x.required }; });
  return `${pageHead(`Good morning, ${esc(firstName(me().name))}`, `Monday 12 October · ${esc(S.community.name)} · Dubai time`, btn('Invite a contractor', { icon: 'mail', act: 'invite' }) + btn('Issue a pass', { icon: 'plus', go: 'issue-pass' }) + btn('Pending approval', { v: 'primary', go: 'queue', iconR: 'arrowR' }))}
  ${overstayAlert(overstayers())}
  ${over48.length ? alertBox('warn', `${plural(over48.length, 'request has', 'requests have')} waited over 48 hours`, `${esc(over48.map(r => r.title).slice(0, 2).join(' and '))}${over48.length > 2 ? ' and more' : ''} should be looked at first.`, btn('Open oldest', { sm: true, go: 'review-' + over48.sort((x, y) => age(y) - age(x))[0].id })) : ''}
  <div class="kpis">
    ${kpi({ label: 'Awaiting approval', value: pend.length, icon: 'inbox', tone: 'warn', go: 'queue', sub: over24.length ? `${over24.length} waiting over 24 h` : 'None waiting over 24 h', subTone: over24.length ? 'warn' : '' })}
    ${kpi({ label: 'Payment pending', value: payPending().length, icon: 'receipt', tone: 'warn', go: 'queue', act: 'payTab', sub: payPending().length ? `${money(sum(payPending().map(r => feeFor(r).total)))} to collect` : 'Nothing to collect' })}
    ${kpi({ label: 'People on site now', value: onSite.length, icon: 'users', tone: 'ok', go: 'logs', sub: `${overstayers().length ? overstayers().length + ' past time limit · ' : ''}${today.in} in · ${today.out} out today`, spark: mv.map(m => m.in) })}
    ${kpi({ label: 'Waiting for closure', value: closing.length, icon: 'clipboard', tone: 'neutral', go: S.settings.finalInspection ? 'inspections' : null, sub: `${closing.filter(i => i.status === 'pending').length} to review · ${closing.filter(i => i.status === 'waiting').length} waiting for contractor` })}
  </div>
  <div class="grid-main">
    ${card('Needs a decision', reqTable(decide, { emptyTitle: 'You’re all caught up', emptyText: 'No requests are waiting.' }), { raw: true, sub: 'Oldest first. Open a request to check it and decide.', action: btn('View all', { v: 'ghost', sm: true, go: 'queue', iconR: 'arrowR' }) })}
    <div class="stack-lg">
      ${card('Starting soon', soon.length ? soon.sort((x, y) => x.from.localeCompare(y.from)).slice(0, 5).map(r => `<button class="link-row" data-go="review-${r.id}"><span class="ic tone-${r.status === 'review' ? 'warn' : 'ok'}">${ic(r.status === 'review' ? 'clock' : 'check')}</span><span class="grow"><b>${esc(r.title)}</b><span>${esc(contractor(r.contractor).name)} · ${r.from === TODAY ? 'Today' : fmtDay(r.from)}</span></span>${badge(r.status === 'review' ? 'Pending' : 'Approved', r.status === 'review' ? 'warn' : 'ok')}</button>`).join('') : '<p class="muted small" style="padding:12px">Nothing starts in the next 48 hours.</p>', { tight: true, sub: 'Pending and approved work. Decide pending requests before they start.' })}
      ${card('Expiring contractor documents', exp.length ? exp.slice(0, 4).map(x => `<button class="link-row" data-go="contractor-${x.c.id}"><span class="ic tone-${x.e.tone}">${ic('file')}</span><span class="grow"><b>${esc(x.c.name)}</b><span>${esc(x.what)} · ${x.e.label}</span></span>${ic('right', 'faint')}</button>`).join('') : '<p class="muted small" style="padding:12px">All contractor documents are in date.</p>', { tight: true })}
    </div>
  </div>
  ${overstayCard(overstayers())}
  <div class="dash-grid">
    ${chartCard({ id: 'age', title: 'How long requests have waited', sub: `${pend.length} pending requests`, how: true, go: 'queue', goLabel: 'Open queue', chart: hbars([{ label: 'Under 24 hours', value: a[0], color: 'var(--seq-250)', go: 'queue' }, { label: '24–48 hours', value: a[1], color: 'var(--seq-350)', go: 'queue' }, { label: 'Over 48 hours', value: a[2], color: 'var(--seq-550)', go: 'queue' }]), table: dataTable(['Waiting time', 'Requests'], [['Under 24 hours', a[0]], ['24–48 hours', a[1]], ['Over 48 hours', a[2]]]) })}
    ${chartCard({ id: 'backlog', title: 'Waiting by approval step', sub: 'Where pending requests are right now', how: true, go: 'queue', goLabel: 'Open queue', chart: hbars(back.map(([k, v]) => ({ label: k, value: v, go: 'queue' }))), table: dataTable(['Approval step', 'Requests'], back) })}
    ${chartCard({ id: 'work', title: 'Scheduled work · next 14 days', sub: 'Approved and pending requests by day', how: true, go: 'calendar', goLabel: 'Open calendar', chart: columns(days14, [{ label: 'Approved', color: 'var(--series-1)' }, { label: 'Pending', color: 'var(--series-2)' }]), legendHtml: legend([{ label: 'Approved', color: 'var(--series-1)' }, { label: 'Pending', color: 'var(--series-2)' }, { label: 'Work not allowed', color: 'var(--chart-axis)' }]), table: dataTable(['Day', 'Approved', 'Pending', 'Note'], days14.map(d => [fmtDay(d.date), d.values[0], d.values[1], d.flag ? 'Work not allowed' : ''])) })}
    ${chartCard({ id: 'moves', title: 'People entering and leaving · last 7 days', sub: 'Gate entries and exits per day', how: true, go: 'logs', goLabel: 'Open access logs', chart: lineChart(mv.map(m => m.label), [{ label: 'Entries', color: 'var(--series-1)', values: mv.map(m => m.in) }, { label: 'Exits', color: 'var(--series-2)', values: mv.map(m => m.out) }]), legendHtml: legend([{ label: 'Entries', color: 'var(--series-1)' }, { label: 'Exits', color: 'var(--series-2)' }]), table: dataTable(['Day', 'Entries', 'Exits'], mv.map(m => [fmtDay(m.date), m.in, m.out])) })}
  </div>
  <div class="dash-grid">
    ${card('Maintenance contracts · this month', `<div class="stack">${amcRows.map(({ x, done }) => `<div class="stack-sm" style="gap:6px"><div class="row between"><span><b>${esc(contractor(x.contractor).name)}</b> <span class="muted small">· ${esc(x.title)}</span></span><span class="small num">${done} of ${x.required} visits</span></div>${meter(done, x.required, { tone: done >= x.required ? 'ok' : '', tip: `${done} of ${x.required} visits completed in ${x.period}` })}</div>`).join('')}</div>`, { sub: 'Required visits against completed visits this period.', action: btn('View contracts', { v: 'ghost', sm: true, go: 'amc', iconR: 'arrowR' }) })}
    ${card('Recent decisions', feed.map(f => `<button class="link-row" data-go="review-${f.r.id}"><span class="ic tone-${/Rejected/.test(f.action) ? 'bad' : /changes/.test(f.action) ? 'warn' : 'ok'}">${ic(/Rejected/.test(f.action) ? 'x' : /changes/.test(f.action) ? 'edit' : 'check')}</span><span class="grow"><b>${esc(f.action)} · ${esc(f.r.title)}</b><span>${esc(f.actor)} · ${fmtDT(f.ts)}</span></span></button>`).join(''), { tight: true })}
  </div>`;
}

/* ---------- Approver dashboard ---------- */
function pDashboardApprover() {
  const u = me(), mine = myQueue().sort((a, b) => age(b) - age(a)), others = pending().filter(r => !canDecide(r)), oldest = mine[0];
  const soonMine = mine.filter(r => r.from <= addDays(TODAY, 2)), decided = S.requests.filter(r => r.history.some(h => h.actor === u.name && /Approved|Rejected|Requested changes/.test(h.action))).sort((a, b) => b.history.at(-1).ts.localeCompare(a.history.at(-1).ts));
  const week = S.requests.flatMap(r => r.history).filter(h => h.actor === u.name && /Approved|Rejected|Requested changes/.test(h.action) && h.ts >= addDays(TODAY, -7)).length;
  return `${pageHead(`Good morning, ${esc(firstName(u.name))}`, `You review <b>${esc(u.dept)} · Level ${u.level}</b> for ${esc(u.properties.map(p => prop(p).name).join(' and '))}.`, btn(mine.length ? 'Start reviewing' : 'Open queue', { v: 'primary', go: mine.length ? 'review-' + mine[0].id : 'queue', iconR: 'arrowR' }))}
  ${mine.some(r => age(r) >= 48) ? alertBox('warn', `${plural(mine.filter(r => age(r) >= 48).length, 'request has', 'requests have')} waited over 48 hours`, 'These are first in your queue.') : ''}
  <div class="kpis">
    ${kpi({ label: 'Waiting for you', value: mine.length, icon: 'inbox', tone: 'warn', go: 'queue', sub: mine.length ? 'Oldest first in your queue' : 'You’re all caught up' })}
    ${kpi({ label: 'Longest wait', value: oldest ? ageText(age(oldest)) : '–', icon: 'clock', tone: oldest && age(oldest) >= 48 ? 'bad' : 'neutral', go: oldest ? 'review-' + oldest.id : null, sub: oldest ? esc(oldest.title) : 'Nothing waiting' })}
    ${kpi({ label: 'Starting within 48 hours', value: soonMine.length, icon: 'calendar', tone: 'info', go: 'queue', sub: 'Of the requests waiting for you' })}
    ${kpi({ label: 'Decided this week', value: week, icon: 'check', tone: 'ok', go: 'queue', sub: 'Approved, rejected or sent back' })}
  </div>
  <div class="grid-main">
    ${card('Your queue', reqTable(mine.slice(0, 6), { emptyTitle: 'You’re all caught up', emptyText: 'Nothing is waiting for your decision right now.' }), { raw: true, sub: 'Oldest first.', action: btn('View all', { v: 'ghost', sm: true, go: 'queue', iconR: 'arrowR' }) })}
    <div class="stack-lg">
      ${card('Waiting on other steps', others.length ? others.slice(0, 4).map(r => `<button class="link-row" data-go="review-${r.id}"><span class="ic tone-neutral">${ic('clock')}</span><span class="grow"><b>${esc(r.title)}</b><span>${stageName(curStage(r))} · ${esc(prop(r.property).name)}</span></span>${stageTrack(r)}</button>`).join('') : '<p class="muted small" style="padding:12px">Nothing else is pending in your properties.</p>', { tight: true, sub: 'For information. Someone else decides these.' })}
      ${card('Recently decided by you', decided.length ? decided.slice(0, 4).map(r => { const h = r.history.filter(x => x.actor === u.name).at(-1); return `<button class="link-row" data-go="review-${r.id}"><span class="ic tone-${/Rejected/.test(h.action) ? 'bad' : /changes/.test(h.action) ? 'warn' : 'ok'}">${ic(/Rejected/.test(h.action) ? 'x' : /changes/.test(h.action) ? 'edit' : 'check')}</span><span class="grow"><b>${esc(r.title)}</b><span>${esc(h.action)} · ${fmtDT(h.ts)}</span></span></button>`; }).join('') : '<p class="muted small" style="padding:12px">No decisions yet.</p>', { tight: true })}
    </div>
  </div>`;
}

/* ---------- Pending approval ---------- */
function pQueue() {
  const admin = isAdmin(), vis = visibleRequests();
  const tabs = admin
    ? [['all', 'All pending', vis.filter(r => r.status === 'review').length], ['mine', 'Needs my decision', myQueue().length], ['pay', 'Payment pending', payPending().length], ['late', 'Over 48 hours', vis.filter(r => r.status === 'review' && age(r) >= 48).length], ['soon', 'Starting soon', vis.filter(r => r.status === 'review' && r.from <= addDays(TODAY, 2)).length], ['changes', 'Waiting for contractor', vis.filter(r => r.status === 'changes').length], ['done', 'Recently decided', null]]
    : [['mine', 'Needs my decision', myQueue().length], ['others', 'Waiting on others', pending().filter(r => !canDecide(r)).length], ['changes', 'Waiting for contractor', vis.filter(r => r.status === 'changes').length], ['done', 'Decided', null]];
  const tab = curTab('queue', tabs[0][0]);
  let list = vis.filter(r => ({ all: r.status === 'review', late: r.status === 'review' && age(r) >= 48, soon: r.status === 'review' && r.from <= addDays(TODAY, 2), mine: r.status === 'review' && canDecide(r), others: r.status === 'review' && !canDecide(r), changes: r.status === 'changes', pay: r.status === 'payment', done: ['approved', 'rejected', 'inspection', 'completed'].includes(r.status) }[tab]));
  const q = (ui.search.queue || '').toLowerCase(), f = ui.filters;
  list = list.filter(r => !q || [r.title, r.id, contractor(r.contractor).name, r.unit].join(' ').toLowerCase().includes(q)).filter(r => !f.qprop || r.property === f.qprop).filter(r => !f.qtype || r.type === f.qtype);
  const sort = f.qsort || 'oldest';
  list.sort((a, b) => sort === 'start' ? a.from.localeCompare(b.from) : sort === 'company' ? contractor(a.contractor).name.localeCompare(contractor(b.contractor).name) : (tab === 'done' ? b.history.at(-1).ts.localeCompare(a.history.at(-1).ts) : age(b) - age(a)));
  const doneRows = `<div class="table-wrap"><table class="table responsive"><thead><tr><th>Request</th><th>Contractor</th><th>Outcome</th><th>Decided</th><th class="t-actions"><span class="sr">Actions</span></th></tr></thead><tbody>${list.map(r => { const h = r.history.at(-1); return `<tr class="clickable" data-go="review-${r.id}"><td>${reqTitleCell(r)}</td><td data-m="sub">${esc(contractor(r.contractor).name)}</td><td data-m="side">${reqBadge(r)}</td><td data-m="hide"><div>${esc(h.actor)}</div><div class="mini">${fmtDT(h.ts)}</div></td><td class="t-actions">${btn('View', { v: 'ghost', sm: true, go: 'review-' + r.id })}</td></tr>`; }).join('')}</tbody></table></div>`;
  const payRows = `<div class="table-wrap"><table class="table responsive"><thead><tr><th>Request</th><th>Contractor</th><th>Amount</th><th>Fee</th><th class="t-actions"><span class="sr">Actions</span></th></tr></thead><tbody>${list.map(r => { const f = feeFor(r); return `<tr class="clickable" data-go="review-${r.id}"><td>${reqTitleCell(r)}</td><td data-m="sub">${esc(contractor(r.contractor).name)}</td><td data-m="side" class="num"><b>${money(f.total)}</b></td><td data-m="hide">${esc(f.lines.map(l => l[0]).join('; '))}</td><td class="t-actions">${isAdmin() ? btn('Record payment', { sm: true, v: 'primary', act: 'payOpen', id: r.id }) : btn('View', { sm: true, v: 'ghost', go: 'review-' + r.id })}</td></tr>`; }).join('')}</tbody></table></div>`;
  const chRows = `<div class="table-wrap"><table class="table responsive"><thead><tr><th>Request</th><th>Contractor</th><th>Asked for</th><th class="t-actions"><span class="sr">Actions</span></th></tr></thead><tbody>${list.map(r => { const h = r.history.filter(x => /changes/.test(x.action)).at(-1) || r.history.at(-1); return `<tr class="clickable" data-go="review-${r.id}"><td>${reqTitleCell(r)}</td><td data-m="sub">${esc(contractor(r.contractor).name)}</td><td data-m="hide"><div class="clamp-2">${esc(h.note)}</div><div class="mini">${fmtDT(h.ts)} · ${esc(h.actor)}</div></td><td class="t-actions">${btn('View', { v: 'ghost', sm: true, go: 'review-' + r.id })}</td></tr>`; }).join('')}</tbody></table></div>`;
  return `${pageHead('Pending approval', admin ? 'Pending work permit requests across every property.' : `Requests at ${esc(me().dept)} · Level ${me().level} for your properties.`, admin ? btn('Issue a pass', { icon: 'plus', go: 'issue-pass' }) : '')}
  <section class="card">${tabsBar('queue', tabs, tab)}
    <div class="filters-row"><div class="search">${ic('search')}<input class="input" data-search="queue" placeholder="Search by request, contractor or unit" value="${esc(ui.search.queue || '')}" aria-label="Search requests"></div>
      <label class="sr" for="qprop">Property</label><select class="select" id="qprop" data-filter="qprop"><option value="">All properties</option>${S.properties.filter(p => inScope(me(), { property: p.id })).map(p => `<option value="${p.id}" ${f.qprop === p.id ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</select>
      <label class="sr" for="qtype">Permit type</label><select class="select" id="qtype" data-filter="qtype"><option value="">All permit types</option>${S.permitTypes.map(t => `<option value="${t.id}" ${f.qtype === t.id ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}</select>
      <span class="grow"></span><label class="sr" for="qsort">Sort</label><select class="select" id="qsort" data-filter="qsort"><option value="oldest" ${sort === 'oldest' ? 'selected' : ''}>${tab === 'done' ? 'Most recent' : 'Oldest first'}</option><option value="start" ${sort === 'start' ? 'selected' : ''}>Work start date</option><option value="company" ${sort === 'company' ? 'selected' : ''}>Contractor</option></select></div>
    ${!list.length ? emptyState('inbox', tab === 'mine' ? 'You’re all caught up' : 'Nothing here', tab === 'mine' ? 'Nothing is waiting for your decision.' : (q || f.qprop || f.qtype ? 'No requests match your search or filters.' : 'No requests in this list.')) : tab === 'done' ? doneRows : tab === 'changes' ? chRows : tab === 'pay' ? payRows : reqTable(list)}
    <div class="pager"><span>Showing ${list.length} request${list.length === 1 ? '' : 's'}</span></div></section>`;
}

/* ---------- Reviewer dashboard (view-only account with switched-on extras) ---------- */
function pDashboardReviewer() {
  const u = me(), onSite = onSiteNow().filter(pid => { const l = lastLog(pid); return canSeeLog(l); }), over = overstayers(), mv = movementDays(7), today = mv[mv.length - 1];
  const live = S.passes.filter(passVisible).filter(p => passState(p) === 'active');
  const acts = [can('issue') ? btn('Issue a pass', { icon: 'plus', go: 'issue-pass' }) : '', can('invite') ? btn('Invite a contractor', { icon: 'mail', act: 'invite' }) : '', canViewLogs() ? btn('Access logs', { go: 'logs' }) : ''].join('');
  const perms = [['logs', 'See access logs'], ['issue', 'Issue passes'], ['invite', 'Invite contractors'], ['checkout', 'Check people out'], ['complete', 'Mark work as completed']];
  return `${pageHead(`Good morning, ${esc(firstName(u.name))}`, `${esc(u.title)} · ${esc(u.properties.map(p => prop(p).name).join(' and '))}`, acts)}
  ${overstayAlert(over)}
  <div class="kpis">
    ${kpi({ label: 'On site now', value: onSite.length, icon: 'users', tone: 'ok', go: canViewLogs() ? 'logs' : 'passes', sub: `${today.in} in · ${today.out} out today`, spark: mv.map(m => m.in) })}
    ${kpi({ label: 'Past time limit', value: over.length, icon: 'clock', tone: over.length ? 'bad' : 'neutral', go: canViewLogs() ? 'logs' : null, sub: over.length ? 'Need a review' : 'Everyone is within their hours' })}
    ${kpi({ label: 'Active passes', value: live.length, icon: 'ticket', tone: 'info', go: 'passes', sub: 'Valid today' })}
    ${kpi({ label: 'Work today', value: visibleRequests().filter(r => r.status === 'approved' && r.from <= TODAY && r.to >= TODAY).length, icon: 'calendar', tone: 'neutral', go: 'calendar', sub: 'Approved requests' })}
  </div>
  ${overstayCard(over)}
  <div class="grid-main">
    ${card('Passes valid today', live.length ? live.slice(0, 6).map(p => `<button class="link-row" data-go="pass-${p.id}"><span class="ic tone-ok">${ic('ticket')}</span><span class="grow"><b>${esc(p.title)}</b><span>${esc(holderName(p))} · ${esc(p.unit)} · ${range(p.from, p.to)}</span></span>${passBadge(p)}</button>`).join('') : '<p class="muted small" style="padding:12px;margin:0">No passes are valid today.</p>', { tight: true, action: btn('All passes', { v: 'ghost', sm: true, go: 'passes', iconR: 'arrowR' }) })}
    ${card('What your account can do', `<ul class="can-list"><li class="yes">${ic('check')}<span>View passes, the calendar and final inspections</span></li>${perms.map(([k, l]) => `<li class="${can(k) ? 'yes' : 'no'}">${ic(can(k) ? 'check' : 'x')}<span>${l}${can(k) ? '' : ' (off)'}</span></li>`).join('')}</ul><p class="xs faint" style="margin:10px 0 0">An administrator can change these in Team & roles.</p>`)}
  </div>`;
}
ACT.payTab = () => { ui.tab.queue = 'pay'; go('queue'); };
