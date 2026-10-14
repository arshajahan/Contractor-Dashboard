/* Community Admin only: contractors, maintenance contracts, team & roles, properties. */
const stBadge = { active: ['Active', 'ok'], pending: ['Waiting for approval', 'warn'], invited: ['Invited', 'info'], suspended: ['Suspended', 'bad'] };
const cBadge = c => badge(...(stBadge[c.status] || [c.status, 'neutral']));
const INVITE_LINK = 'https://app.buzzin.example/join/buzzin-community';
/* Companies that already have a Buzzin account (demo). Inviting one of these gives access straight away. */
const KNOWN_ACCOUNTS = { 'info@acmefacilities.example': 'Acme Facilities', 'hello@skylinelifts.example': 'Skyline Lifts', 'sam@brightpaint.example': 'Bright Paint & Co.' };
const canInvite = () => isAdmin() || can('invite');

/* ---------- Contractors ---------- */
function pContractors() {
  if (!isAdmin()) return null;
  const all = S.contractors, n = k => all.filter(c => c.status === k).length;
  const tabs = [['active', 'Active', n('active')], ['pending', 'Waiting for approval', n('pending')], ['invited', 'Invited', n('invited')], ['suspended', 'Suspended', n('suspended')], ['all', 'All', all.length]], tab = curTab('contr', 'active'), q = (ui.search.contr || '').toLowerCase();
  const list = all.filter(c => tab === 'all' || c.status === tab).filter(c => !q || (c.name + c.contact + c.email).toLowerCase().includes(q));
  return `${pageHead('Contractors', 'Companies that can request work in this community.', btn('Invite a contractor', { v: 'primary', icon: 'mail', act: 'invite' }))}
  ${n('pending') ? alertBox('info', `${plural(n('pending'), 'company is', 'companies are')} waiting for approval`, 'They signed up with your link. They can’t request work until you accept them.') : ''}
  <section class="card">${tabsBar('contr', tabs, tab)}<div class="filters-row"><div class="search">${ic('search')}<input class="input" data-search="contr" placeholder="Search by company, contact or email" value="${esc(ui.search.contr || '')}" aria-label="Search contractors"></div></div>
  ${list.length ? `<div class="table-wrap"><table class="table responsive"><thead><tr><th>Company</th><th>Contact</th><th>Trade licence</th><th>Documents</th><th>Status</th><th class="t-actions"><span class="sr">Actions</span></th></tr></thead><tbody>${list.map(c => { const l = c.licence.expiry ? expiry(c.licence.expiry) : null; return `<tr class="clickable" data-go="contractor-${c.id}"><td><div class="row" style="flex-wrap:nowrap;gap:10px"><span class="avatar">${initials(c.name)}</span><div class="t-title"><b>${esc(c.name)}</b><span>${c.status === 'invited' ? 'Invited ' + fmtDT(c.invitedOn) : plural(S.people.filter(p => p.company === c.id).length, 'worker') + ' on file'}</span></div></div></td><td data-m="sub">${esc(c.contact)}<div class="mini">${esc(c.email)}</div></td><td data-m="hide">${l ? badge(l.label, l.tone) : '<span class="faint">Not provided</span>'}</td><td data-m="hide">${c.documents.length ? plural(c.documents.length, 'document') : '<span class="faint">None</span>'}</td><td data-m="side">${cBadge(c)}</td><td class="t-actions">${c.status === 'pending' ? btn('Review', { sm: true, v: 'primary', go: 'contractor-' + c.id }) : btn('View', { sm: true, v: 'ghost', go: 'contractor-' + c.id })}</td></tr>`; }).join('')}</tbody></table></div>` : emptyState('briefcase', 'No companies here', q ? 'No companies match your search.' : 'Nothing in this list.')}</section>`;
}
function pContractor(id) {
  const c = byId(S.contractors, id); if (!c || !isAdmin()) return null;
  const reqs = S.requests.filter(r => r.contractor === c.id), l = c.licence.expiry ? expiry(c.licence.expiry) : null, ppl = S.people.filter(p => p.company === c.id);
  const actions = { pending: btn('Decline', { v: 'danger', act: 'declineContractor', id: c.id }) + btn('Accept company', { v: 'primary', act: 'acceptContractor', id: c.id }), invited: btn('Cancel invitation', { v: 'danger', act: 'cancelInvite', id: c.id }) + btn('Send again', { act: 'resendInvite', id: c.id }), suspended: btn('Reinstate', { v: 'primary', act: 'reinstate', id: c.id }), active: btn('Suspend', { v: 'danger', icon: 'ban', act: 'suspend', id: c.id }) }[c.status];
  const hist = c.history.slice().reverse();
  const icon = a => /Suspended/.test(a) ? ['bad', 'ban'] : /Reinstated|approved|Accepted|granted/i.test(a) ? ['ok', 'check'] : /Invited|Asked/.test(a) ? ['info', 'mail'] : ['neutral', 'clock'];
  return `${pageHead(`${esc(c.name)} ${cBadge(c)}`, `${esc(c.contact)} · ${esc(c.email)}`, actions, [['Contractors', 'contractors'], [c.name]])}
  ${c.status === 'suspended' ? alertBox('bad', 'Suspended', `${esc(c.suspended.reason)} <span class="faint">· since ${fmt(c.suspended.on)}</span>`) : ''}
  ${c.status === 'invited' ? alertBox('info', 'Waiting for them to sign up', `An invitation went to ${esc(c.email)} on ${fmtDT(c.invitedOn)}. They get access as soon as they accept.`) : ''}
  <div class="kpis">${kpi({ label: 'Requests', value: reqs.length, icon: 'inbox', tone: 'info' })}${kpi({ label: 'Active passes', value: S.passes.filter(p => p.holder === c.id && passState(p) === 'active').length, icon: 'ticket', tone: 'ok', go: 'passes' })}${kpi({ label: 'Workers on file', value: ppl.length, icon: 'users', tone: 'neutral' })}${kpi({ label: 'Customer since', value: c.since ? fmtS(c.since) : '–', icon: 'calendar', tone: 'neutral', sub: c.since ? c.since.slice(0, 4) : 'Not yet accepted' })}</div>
  <div class="grid-main"><div class="stack-lg">
  ${card('Company details', `<dl class="kv-list"><dt>Phone</dt><dd>${esc(c.phone || '—')}</dd><dt>Tax registration</dt><dd>${esc(c.trn || '—')}</dd><dt>Trade licence</dt><dd>${c.licence.no ? esc(c.licence.no) + ' ' + (l ? badge(l.label, l.tone) : '') : '<span class="faint">Not provided yet</span>'}</dd></dl>`)}
  ${card('Documents', c.documents.length ? c.documents.map(d => { const e = d.expiry ? expiry(d.expiry) : { tone: 'neutral', label: 'No expiry' }; return `<div class="list-row"><span class="ic tone-bad" style="font-size:10px;font-weight:800">PDF</span><span class="grow"><b>${esc(d.name)}</b><span>${esc(d.file)}</span></span>${badge(e.label, e.tone)}</div>`; }).join('') : '<p class="muted small" style="padding:12px;margin:0">No documents shared yet.</p>', { tight: true })}
  ${card('Requests', reqs.length ? reqTable(reqs.sort((a, b) => b.submitted.localeCompare(a.submitted)).slice(0, 6)) : emptyState('inbox', 'No requests yet', 'This company hasn’t asked for work.'), { raw: true })}</div>
  <div class="stack-lg">${card('Activity', `<div class="timeline">${hist.map((h, i) => { const [tone, ic2] = icon(h.action); return `<div class="tl ${i === 0 ? 'now' : 'done'}"><span class="dot">${i === 0 ? '' : ic(ic2)}</span><div class="grow"><b>${esc(h.action)}</b><span>${esc(h.actor)} · ${fmtDT(h.ts)}</span>${h.note ? `<p class="small" style="margin:6px 0 0;color:var(--text-2)">${esc(h.note)}</p>` : ''}</div></div>`; }).join('')}</div>`, { sub: 'Access requests, invitations, suspensions and reinstatements.' })}
  ${card('Workers', ppl.length ? ppl.map(p => { const e = expiry(p.idExpiry); return `<div class="person-row"><span class="avatar">${initials(p.name)}</span><div class="meta"><b>${esc(p.name)}</b><span>${esc(p.role)}</span></div>${badge(e.label, e.tone)}</div>`; }).join('') : '<p class="muted small" style="padding:12px;margin:0">No workers on file.</p>', { tight: true })}</div></div>`;
}
registerRoute('contractors', pContractors); registerPrefix('contractor-', pContractor);
const addHist = (c, action, note) => { c.history.push({ ts: nowISO(), actor: me().name, action, note: note || '' }); };
MODALS.invite = m => { const d = m.data;
  return modalFrame({ title: 'Invite a contractor', sub: 'Send an invitation by email, or share your link.', size: '', body: `<div class="stack-lg">
  <div class="stack">${F({ id: 'iv-e', label: 'Contractor’s email', bind: 'm.email', type: 'email', req: true, err: d.err, ph: 'name@company.com', hint: 'If they already have a Buzzin account they get access straight away. Otherwise they get an email to sign up. Try info@acmefacilities.example.' })}</div>
  <div class="divider"></div>
  <div class="stack-sm"><b class="small">Or share your invitation link</b><div class="row" style="flex-wrap:nowrap"><code class="small" style="overflow-wrap:anywhere;flex:1">${INVITE_LINK}</code>${btn('Copy link', { sm: true, icon: 'copy', act: 'copy', id: INVITE_LINK })}</div><span class="xs faint">Companies that register with this link wait for your approval in Contractors.</span></div></div>`, foot: btn('Close', { act: 'closeModal' }) + btn('Send invitation', { v: 'primary', icon: 'send', act: 'inviteOk' }) }); };
Object.assign(ACT, {
  invite() { if (!canInvite()) return; ui.pop = null; ui.modal = { type: 'invite', data: { email: '' } }; render(); },
  inviteOk() {
    const d = ui.modal.data, em = (d.email || '').trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(em)) { d.err = 'Enter a valid email address.'; render(); return; }
    const ex = S.contractors.find(c => c.email.toLowerCase() === em);
    if (ex) { d.err = { active: `${ex.name} already has access.`, suspended: `${ex.name} is suspended. Reinstate them in Contractors.`, pending: `${ex.name} already asked for access. Approve them in Contractors.`, invited: 'This email is already invited.' }[ex.status]; render(); return; }
    const known = KNOWN_ACCOUNTS[em];
    openConfirm({ title: `Invite ${em}?`, message: known ? `${known} already has a Buzzin account, so they get access to your community straight away.` : 'They get an email with a link to create their account. They get access once they sign up.', confirmText: 'Send invitation', tone: 'ok', icon: 'send', onConfirm: () => {
      const c = { id: uid('c'), name: known || em.split('@')[0], contact: '', email: em, phone: '', status: known ? 'active' : 'invited', since: known ? TODAY : null, invitedOn: nowISO(), licence: {}, trn: '', documents: [], history: [] };
      addHist(c, 'Invited by email', em); if (known) { addHist(c, 'Access granted', 'They already had a Buzzin account.'); }
      S.contractors.unshift(c); persist(); toast(known ? `${known} now has access.` : `Invitation sent to ${em}.`); go('contractor-' + c.id);
    } });
  },
  cancelInvite(t) { const c = byId(S.contractors, t.dataset.id); openConfirm({ title: 'Cancel this invitation?', message: `The link sent to ${c.email} stops working.`, confirmText: 'Cancel invitation', cancelText: 'Keep', tone: 'danger', onConfirm: () => { S.contractors = S.contractors.filter(x => x !== c); persist(); toast('Invitation cancelled.'); go('contractors'); } }); },
  resendInvite(t) { const c = byId(S.contractors, t.dataset.id); c.invitedOn = nowISO(); addHist(c, 'Invitation sent again', c.email); persist(); toast('Invitation sent again.'); render(); },
  acceptContractor(t) { const c = byId(S.contractors, t.dataset.id); openConfirm({ title: `Accept ${c.name}?`, message: 'They can request work in this community straight away. They’re told by email.', confirmText: 'Accept company', tone: 'ok', onConfirm: () => { c.status = 'active'; c.since = TODAY; addHist(c, 'Access approved'); persist(); toast(`${c.name} accepted.`); } }); },
  declineContractor(t) { const c = byId(S.contractors, t.dataset.id); openConfirm({ title: `Decline ${c.name}?`, message: 'They’re told their request was declined and can ask again later.', confirmText: 'Decline', tone: 'danger', reason: { label: 'Reason', min: 10, ph: 'Explain why access can’t be given.' }, onConfirm: () => { S.contractors = S.contractors.filter(x => x !== c); persist(); toast(`${c.name} declined.`); go('contractors'); } }); },
  suspend(t) { const c = byId(S.contractors, t.dataset.id); openConfirm({ title: `Suspend ${c.name}?`, message: 'They can’t send new requests and their passes stop working at the gate until you reinstate them.', confirmText: 'Suspend company', tone: 'danger', reason: { label: 'Reason for suspending', min: 10, ph: 'For example: repeated entries outside approved hours.' }, onConfirm: d => { c.status = 'suspended'; c.suspended = { on: TODAY, reason: d.reason.trim() }; addHist(c, 'Suspended', d.reason.trim()); persist(); toast(`${c.name} suspended.`); } }); },
  reinstate(t) { const c = byId(S.contractors, t.dataset.id); openConfirm({ title: `Reinstate ${c.name}?`, message: 'They can send requests again and their passes work again.', confirmText: 'Reinstate', tone: 'ok', reason: { label: 'Note', required: false, ph: 'Optional. For example: briefing completed.' }, onConfirm: d => { c.status = 'active'; delete c.suspended; addHist(c, 'Reinstated', (d.reason || '').trim()); persist(); toast(`${c.name} reinstated.`); } }); },
});

/* ---------- Maintenance contracts (made when an AMC permit is approved) ---------- */
function pAmc() {
  if (!isAdmin()) return null;
  return `${pageHead('Maintenance contracts', 'Created automatically when a contractor’s maintenance permit is approved as an AMC. They also appear under Passes.')}
  ${S.amc.length ? `<section class="card"><div class="table-wrap"><table class="table responsive"><thead><tr><th>Contract</th><th>Contractor</th><th>Visits needed</th><th>Done this period</th><th>Next visit</th><th class="t-actions"><span class="sr">Source</span></th></tr></thead><tbody>${S.amc.map(a => { const done = a.visits.length; return `<tr><td><div class="t-title"><b>${esc(a.title)}</b><span>${esc(prop(a.property).name)} · ${esc(a.period)}</span></div></td><td data-m="sub">${esc(contractor(a.contractor).name)}</td><td data-m="hide">${plural(a.required, 'visit')} · ${a.freq.toLowerCase()}</td><td data-m="hide" style="min-width:180px"><div class="stack-sm" style="gap:5px"><span class="small num">${done} of ${a.required}</span>${meter(done, a.required, { tone: done >= a.required ? 'ok' : '' })}</div></td><td data-m="side" class="num">${fmtDay(a.next)}</td><td class="t-actions">${a.requestId ? btn('Permit', { sm: true, v: 'ghost', go: 'review-' + a.requestId }) : ''}</td></tr>`; }).join('')}</tbody></table></div></section>` : card('', emptyState('refresh', 'No maintenance contracts yet', 'They appear here when a maintenance permit marked as AMC is approved.'))}`;
}
registerRoute('amc', pAmc);

/* ---------- Team & roles ---------- */
const PERM_DEFS = [['logs', 'See access logs', 'Gate scans and who is on site.'], ['issue', 'Issue passes', 'Create passes for visitors and deliveries.'], ['invite', 'Invite contractors', 'Send email invitations to contractors.'], ['checkout', 'Check people out by hand', 'When the gate did not scan them out.'], ['complete', 'Mark work as completed', 'Sends finished work on to final inspection.']];
const ROLE_CAN = {
  admin: [[1, 'Everything an approver can do, at their own step'], [1, 'Force approve, if you switch it on for them'], [1, 'Contractors, payments and maintenance contracts'], [1, 'Reports, access logs and settings'], [1, 'Invite and manage the team']],
  approver: [[1, 'Decide requests at their department and level'], [1, 'See only their assigned properties'], [1, 'View and complete passes and final inspections'], [0, 'Access logs, unless you allow them'], [0, 'Settings, contractors, payments or team']],
  reviewer: [[1, 'View passes, the calendar and final inspections'], [1, 'Only the properties you give them'], [1, 'Extras you switch on: access logs, issue passes, invite contractors, check people out, mark work completed'], [0, 'Decide requests'], [0, 'Settings, payments or team']],
};
const roleName = r => ({ admin: 'Administrator', approver: 'Approver', reviewer: 'Reviewer' }[r]);
function pTeam() {
  if (!isAdmin()) return null;
  const q = (ui.search.team || '').toLowerCase(), list = S.team.filter(u => !q || (u.name + u.email + u.title).toLowerCase().includes(q));
  const cards = [['admin', 'Administrator', 'Full access to everything', 'shield', 'info'], ['approver', 'Approver', 'Limited to the approvals they own', 'userCheck', 'warn'], ['reviewer', 'Reviewer', 'View-only, plus the extras you choose', 'eye', 'neutral']];
  return `${pageHead('Team & roles', 'Who can use this workspace and what they can do.', btn('Add team member', { v: 'primary', icon: 'plus', act: 'teamAdd' }))}
  <div class="role-grid" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">${cards.map(([k, n, s, i, tone]) => `<div class="role-card"><header><span class="ic tone-${tone}">${ic(i)}</span><div><b>${n}</b><div class="muted small">${s}</div></div><span class="grow"></span>${badge(plural(S.team.filter(u => u.role === k).length, 'person', 'people'), 'neutral')}</header><ul class="can-list">${ROLE_CAN[k].map(([y, t]) => `<li class="${y ? 'yes' : 'no'}">${ic(y ? 'check' : 'x')}<span>${t}</span></li>`).join('')}</ul></div>`).join('')}</div>
  <section class="card"><div class="filters-row"><div class="search">${ic('search')}<input class="input" data-search="team" placeholder="Search by name, email or designation" value="${esc(ui.search.team || '')}" aria-label="Search team"></div></div>
  <div class="table-wrap"><table class="table responsive"><thead><tr><th>Person</th><th>Role</th><th>Approval step or access</th><th>Properties</th><th>Status</th><th class="t-actions"><span class="sr">Actions</span></th></tr></thead><tbody>${list.map(u => `<tr><td><div class="row" style="flex-wrap:nowrap;gap:10px"><span class="avatar">${initials(u.name)}</span><div class="t-title"><b>${esc(u.name)}</b><span>${esc(u.title)} · ${esc(u.email)}</span></div></div></td><td data-m="sub">${badge(roleName(u.role), u.role === 'admin' ? 'info' : u.role === 'approver' ? 'warn' : 'neutral')}</td><td data-m="hide">${u.role === 'reviewer' ? (PERM_DEFS.filter(([k]) => (u.perms || {})[k]).map(([, l]) => `<span class="chip">${esc(l)}</span>`).join(' ') || '<span class="faint">View only</span>') : u.dept ? `${esc(u.dept)} · Level ${u.level}${u.role === 'approver' && u.logs ? '<div class="mini">Can view access logs</div>' : ''}${u.role === 'admin' ? `<div class="mini">${u.forceApprove ? 'Can force approve' : 'Cannot force approve'}</div>` : ''}` : '<span class="faint">Does not approve steps</span>'}</td><td data-m="hide">${u.role === 'admin' ? '<span class="faint">All properties</span>' : esc(u.properties.map(p => prop(p).name).join(', '))}</td><td data-m="side">${badge(u.status === 'active' ? 'Active' : u.status === 'invited' ? 'Invited' : 'Deactivated', u.status === 'active' ? 'ok' : u.status === 'invited' ? 'warn' : 'neutral')}<div class="mini">${esc(u.last)}</div></td><td class="t-actions">${rowBtn('team', u.id)}</td></tr>`).join('')}</tbody></table></div></section>`;
}
registerRoute('team', pTeam);
ROWMENU.team = id => { const u = byId(S.team, id); return [{ icon: 'edit', label: 'Edit', act: 'teamEdit', id }, u.status === 'invited' ? { icon: 'send', label: 'Resend invite', act: 'teamResend', id } : { icon: 'key', label: 'Send password reset', act: 'teamReset', id }, { sep: true }, u.status === 'deactivated' ? { icon: 'userCheck', label: 'Reactivate', act: 'teamToggle', id } : { icon: 'userX', label: 'Deactivate', act: 'teamToggle', id, danger: true }]; };
MODALS.team = m => { const d = m.data, e = d.errs || {}, role = d.role;
  const stepFields = (opt) => `${F({ id: 'tm-d', label: opt ? 'Also approves as (department)' : 'Department', bind: 'm.dept', options: opt ? [['', 'None. Does not approve steps.'], ...S.departments.map(x => [x, x])] : S.departments, req: !opt })}${d.dept || !opt ? F({ id: 'tm-l', label: 'Approval level', bind: 'm.level', options: [[1, 'Level 1'], [2, 'Level 2'], [3, 'Level 3']], hint: 'A request reaches Level 2 only after Level 1 approves.' }) : ''}`;
  const propPick = combo({ id: 'tm-p', label: 'Properties they can access', bind: 'm.properties', options: S.properties.map(p => ({ value: p.id, label: p.name })), ph: 'Choose properties', req: true, err: e.properties });
  const body = role === 'approver' ? `<div class="scope-box"><b>What this approver can do</b>${stepFields(false)}${propPick}${sw('tm-lg', 'm.logs', 'Can view access logs', 'Gate scans for their properties.', false)}${sw('tm-nt', 'm.notify', 'Email when a request reaches them', '', false)}</div>`
    : role === 'reviewer' ? `<div class="scope-box"><b>What this reviewer can do</b><p class="muted small" style="margin:0">Reviewers can always view passes. Switch on at least one extra.</p>${propPick}${PERM_DEFS.map(([k, l, s]) => sw('tm-pm-' + k, `m.perms.${k}`, l, s, false)).join('')}${e.perms ? `<span class="err">${ic('alert')}${e.perms}</span>` : ''}</div>`
    : `<div class="scope-box"><b>Administrator settings</b><p class="muted small" style="margin:0">Administrators see everything. Like any approver, they decide only at their own step unless force approve is on.</p>${stepFields(true)}${sw('tm-fa', 'm.forceApprove', 'Can force approve', 'Skip the remaining approval steps in one go. Always written to the history with a reason.', false)}</div>`;
  return modalFrame({ title: d.id ? 'Edit team member' : 'Add team member', sub: d.id ? '' : 'They get an email invite to set a password.', drawer: true, body: `<div class="stack">
  ${F({ id: 'tm-n', label: 'Full name', bind: 'm.name', req: true, err: e.name })}${F({ id: 'tm-e', label: 'Email', bind: 'm.email', type: 'email', req: true, err: e.email, disabled: !!d.id })}${F({ id: 'tm-t', label: 'Designation', bind: 'm.title', req: true, err: e.title, ph: 'For example: Gate officer' })}
  <div class="field"><span class="label">Role</span>${seg('tm-r', 'm.role', [['admin', 'Administrator'], ['approver', 'Approver'], ['reviewer', 'Reviewer']], true)}</div>${body}</div>`, foot: btn('Cancel', { act: 'closeModal' }) + btn(d.id ? 'Save' : 'Send invite', { v: 'primary', act: 'teamOk' }) });
};
const blankTeam = () => ({ role: 'approver', name: '', email: '', title: '', dept: S.departments[0], level: 1, properties: [], logs: false, notify: true, perms: { logs: true, issue: false, invite: false, checkout: false, complete: false }, forceApprove: false });
Object.assign(ACT, {
  teamAdd() { ui.modal = { type: 'team', data: blankTeam() }; render(); },
  teamEdit(t) { ui.pop = null; ui.modal = { type: 'team', data: Object.assign(blankTeam(), clone(byId(S.team, t.dataset.id)), { dept: byId(S.team, t.dataset.id).dept || (byId(S.team, t.dataset.id).role === 'admin' ? '' : S.departments[0]) }) }; render(); },
  teamOk() {
    const d = ui.modal.data, e = {};
    if (!d.name.trim()) e.name = 'Enter a name.'; if (!d.title.trim()) e.title = 'Enter a designation.';
    if (!/^\S+@\S+\.\S+$/.test(d.email || '')) e.email = 'Enter a valid email.'; else if (!d.id && S.team.some(u => u.email === d.email)) e.email = 'This email already has an account.';
    if (d.role !== 'admin' && !(d.properties || []).length) e.properties = 'Choose at least one property.';
    if (d.role === 'reviewer' && !Object.values(d.perms || {}).some(Boolean)) e.perms = 'Switch on at least one thing this reviewer can do.';
    d.errs = e; if (Object.keys(e).length) { render(); return; }
    const adminLeft = S.team.filter(u => u.role === 'admin' && u.status === 'active' && u.id !== d.id).length;
    if (d.id && byId(S.team, d.id).role === 'admin' && d.role !== 'admin' && !adminLeft) { d.errs = { name: 'There must be at least one active administrator.' }; render(); return; }
    const out = { ...d, level: +d.level || 1 }; delete out.errs;
    if (out.role === 'admin') { delete out.properties; delete out.logs; delete out.notify; delete out.perms; if (!out.dept) { delete out.dept; delete out.level; } }
    else if (out.role === 'approver') { delete out.perms; delete out.forceApprove; }
    else { delete out.dept; delete out.level; delete out.logs; delete out.notify; delete out.forceApprove; }
    const was = d.id ? byId(S.team, d.id) : null; if (was) { ['dept', 'level', 'properties', 'perms', 'forceApprove', 'logs', 'notify'].forEach(k => delete was[k]); }
    if (was) Object.assign(was, out); else S.team.push({ ...out, id: uid('u'), status: 'invited', last: 'Invite sent today' });
    ui.modal = null; persist(); toast(d.id ? 'Changes saved.' : `Invite sent to ${d.email}.`); render();
  },
  teamResend(t) { ui.pop = null; toast('Invite sent again.'); render(); },
  teamReset(t) { const u = byId(S.team, t.dataset.id); ui.pop = null; openConfirm({ title: 'Send a password reset?', message: `${u.name} gets an email with a link to choose a new password.`, confirmText: 'Send reset email', onConfirm: () => toast('Reset email sent.') }); },
  teamToggle(t) { const u = byId(S.team, t.dataset.id), off = u.status !== 'deactivated'; ui.pop = null;
    if (off && u.role === 'admin' && S.team.filter(x => x.role === 'admin' && x.status === 'active').length <= 1) { toast('There must be at least one active administrator.', { err: true }); return; }
    openConfirm({ title: off ? `Deactivate ${u.name}?` : `Reactivate ${u.name}?`, message: off ? 'They can no longer sign in. Their past decisions stay in each request’s history.' : 'They can sign in again with their existing role.', confirmText: off ? 'Deactivate' : 'Reactivate', tone: off ? 'danger' : 'ok', onConfirm: () => { u.status = off ? 'deactivated' : 'active'; persist(); toast(off ? 'Deactivated.' : 'Reactivated.'); } }); },
});

/* ---------- Properties: buildings and units come from the property system; only approval levels are set here ---------- */
function pProperties() {
  if (!isAdmin()) return null;
  return `${pageHead('Properties', 'Buildings and units come from your property system. Here you choose how many approval levels each department needs.')}
  <div class="type-grid">${S.properties.map(p => `<div class="type-card"><div class="row between"><div><b style="font-size:16px">${esc(p.name)}</b><div class="muted small">${esc(p.address)}</div></div></div>
  <dl>${S.departments.map(d => `<dt>${esc(d)}</dt><dd>${p.levels[d] ? plural(p.levels[d], 'level') : 'Not involved'}</dd>`).join('')}</dl>${btn('Edit approval levels', { sm: true, act: 'propEdit', id: p.id, icon: 'edit' })}</div>`).join('')}</div>`;
}
registerRoute('properties', pProperties);
MODALS.prop = m => { const d = m.data; return modalFrame({ title: d.name, sub: 'Approval levels', drawer: true, body: `<div class="stack-lg"><p class="muted small" style="margin:0">How many people in each department must approve, one after another. Zero means that department isn’t involved at this property. The name, address and units come from your property system.</p>${S.departments.map(dep => `<div class="level-row"><b class="grow">${esc(dep)}</b><div class="stepper"><button type="button" data-act="lvl" data-id="${esc(dep)}:-1" ${(d.levels[dep] || 0) <= 0 ? 'disabled' : ''} aria-label="Fewer levels">${ic('left')}</button><b>${d.levels[dep] || 0}</b><button type="button" data-act="lvl" data-id="${esc(dep)}:1" ${(d.levels[dep] || 0) >= 3 ? 'disabled' : ''} aria-label="More levels">${ic('right')}</button></div></div>`).join('')}</div>`, foot: btn('Cancel', { act: 'closeModal' }) + btn('Save levels', { v: 'primary', act: 'propOk' }) }); };
Object.assign(ACT, {
  propEdit(t) { ui.pop = null; ui.modal = { type: 'prop', data: clone(byId(S.properties, t.dataset.id)) }; render(); },
  lvl(t) { const [dep, n] = t.dataset.id.split(':'), d = ui.modal.data; d.levels[dep] = Math.max(0, Math.min(3, (d.levels[dep] || 0) + +n)); render(); },
  propOk() { const d = ui.modal.data, cur = byId(S.properties, d.id); openConfirm({ title: 'Save approval levels?', message: 'New requests use these levels. Requests already waiting keep the steps they started with.', confirmText: 'Save levels', tone: 'ok', onConfirm: () => { S.requests.filter(r => r.status === 'review' && r.property === d.id && !r.workflow).forEach(r => { r.workflow = compileWorkflow(r.type, r.property); }); cur.levels = d.levels; ui.modal = null; persist(); toast('Approval levels saved.'); } }); },
});
