/* Work permits: the review screen (shared by Admin, Approver and Reviewer). */
const reqIdx = r => S.requests.indexOf(r);
const checkDefs = [['documents', 'Documents checked', 'Files open, match the permit type and are in date'], ['people', 'Workers and ID copies checked', 'Names match their ID and IDs are valid for the work dates'], ['company', 'Contractor details checked', 'Trade licence is valid and the company is active']];
const allChecked = r => checkDefs.every(([k]) => r.checks[k]);
const flagsOf = r => requestFlags(r);
const wfIsLast = r => r.stage >= workflowOf(r).length - 1;

function wfStepper(r) {
  const wf = workflowOf(r), done = r.status === 'review' || ['rejected', 'changes', 'cancelled'].includes(r.status) ? r.stage : wf.length;
  if (!wf.length) return '<p class="muted small">This permit type has no approval steps.</p>';
  return `<div class="wf" role="list" aria-label="Approval steps">${wf.map((s, i) => {
    const st = i < done ? 'done' : (i === done && r.status === 'review') ? 'now' : '';
    return `${i ? '<span class="wf-line"></span>' : ''}<span class="wf-step ${st}" role="listitem"><span class="n">${st === 'done' ? ic('check') : i + 1}</span>${esc(stageName(s))}</span>`;
  }).join('')}</div>`;
}

/* One row per approval step (who, when, comment), then the other events: changes, payment, pass, closure. */
function approvalTimeline(r) {
  const wf = workflowOf(r), rows = [], used = new Set();
  const done = r.status === 'review' ? r.stage : ['changes', 'rejected', 'cancelled'].includes(r.status) ? r.stage : wf.length;
  wf.forEach((s, i) => {
    const name = stageName(s), h = r.history.find(x => x.action === 'Approved ' + name || (i === wf.length - 1 && /Final approval/.test(x.action)));
    if (h) used.add(h);
    const now = i === r.stage && r.status === 'review';
    rows.push({ state: h ? 'done' : now ? 'now' : '', title: `${name}`, who: h ? h.actor : '', ts: h ? h.ts : '', note: h ? h.note : '', badge: h ? (h.forced ? badge('Force approved', 'warn') : badge('Approved', 'ok')) : now ? badge('Waiting', 'info') : badge('Not reached', 'neutral'), forced: h && h.forced });
  });
  const others = r.history.filter(h => !used.has(h) && h.action !== 'Request submitted' && !/^Approved /.test(h.action)).map(h => ({ state: /Rejected/.test(h.action) ? 'bad' : /changes/i.test(h.action) ? 'warn' : 'done', title: h.action, who: h.actor, ts: h.ts, note: h.note }));
  const sub = r.history.find(h => h.action === 'Request submitted');
  const all = [...(sub ? [{ state: 'done', title: 'Request submitted', who: contractor(r.contractor).name, ts: sub.ts, note: '' }] : []), ...rows, ...others].sort((a, b) => (a.ts && b.ts) ? a.ts.localeCompare(b.ts) : 0);
  // keep the approval steps in order even if timestamps tie
  return `<div class="timeline">${all.map(x => `<div class="tl ${x.state === 'bad' ? '' : x.state}"><span class="dot">${x.state === 'done' ? ic('check') : x.state === 'bad' ? ic('x') : x.state === 'warn' ? ic('edit') : ''}</span><div class="grow"><div class="row between"><b>${esc(x.title)}</b>${x.badge || ''}</div><span>${x.who ? esc(x.who) + (x.ts ? ' · ' + fmtDT(x.ts) : '') : (x.state === 'now' ? 'With this step now' : 'Not reached yet')}</span>${x.note ? `<p class="small" style="margin:6px 0 0;color:var(--text-2)">${esc(x.note)}</p>` : ''}</div></div>`).join('')}</div>`;
}

function reviewFacts(r) {
  const c = contractor(r.contractor), p = prop(r.property);
  const n = Math.round((D(r.to || r.from) - D(r.from)) / 864e5) + 1;
  return `<div class="facts">
    <div class="fact"><small>Contractor</small><b>${esc(c.name)}</b><span>${esc(r.contact)} · ${esc(r.phone)}</span></div>
    <div class="fact"><small>Location</small><b>${esc(r.unit)}</b><span>${esc(p.name)}</span></div>
    <div class="fact"><small>Work dates</small><b>${range(r.from, r.to)}</b><span>${plural(n, 'day')}</span></div>
    <div class="fact"><small>Hours</small><b>${esc(r.hours)}</b><span>${esc(ptype(r.type).name)}</span></div>
    <div class="fact"><small>Workers</small><b>${r.people.length}</b><span>${plural(r.vehicles.length, 'vehicle')}</span></div></div>`;
}

function paymentCard(r) {
  const t = ptype(r.type), f = feeFor(r), pay = payOf(r);
  if (!f.total && !pay) return '';
  const body = pay
    ? `<div class="row between"><div><b style="font-size:20px">${money(pay.amount)}</b><div class="muted small">Paid by ${payLabel(pay.method)} · ${fmtDT(pay.ts)}</div></div>${badge('Paid', 'ok')}</div><div class="row">${btn('View invoice', { sm: true, icon: 'receipt', act: 'invoiceOpen', id: pay.id })}${btn('Download PDF', { sm: true, icon: 'download', act: 'invoicePdf', id: pay.id })}</div>`
    : `<div class="row between"><div><b style="font-size:20px">${money(f.total)}</b><div class="muted small">${r.status === 'payment' ? 'Payment pending. The contractor can pay online, or you can record cash or card.' : 'Due after the last approval.'}</div></div>${badge(r.status === 'payment' ? 'Payment pending' : 'Not due yet', r.status === 'payment' ? 'warn' : 'neutral')}</div>${f.lines.map(l => `<div class="row between small"><span class="muted">${esc(l[0])}</span><span class="num">${money(l[1])}</span></div>`).join('')}${r.status === 'payment' && isAdmin() ? `<div class="row">${btn('Record payment', { v: 'primary', sm: true, icon: 'check', act: 'payOpen', id: r.id })}</div>` : ''}`;
  return card('Fee', `<div class="stack-sm">${body}</div>`, { sub: t.name });
}

function tabOverview(r, inPass) {
  const insp = S.inspections.find(i => i.requestId === r.id), pass = r.passId && byId(S.passes, r.passId);
  return `<div class="stack-lg">
    ${card('Approval timeline', approvalTimeline(r), { sub: 'Who approved each step, when, and what they said.' })}
    ${paymentCard(r)}
    ${card('Work description', `<p style="margin:0">${esc(r.description || 'No description given.')}</p>${r.amc ? `<div class="message" style="margin-top:12px"><b class="small">Maintenance contract (AMC)</b><span class="small">${r.amc.freq} · ${plural(r.amc.required, 'visit')} each period. When approved it appears under Maintenance contracts and Passes.</span></div>` : ''}`)}
    ${pass && !inPass ? card('Pass', `<div class="row between"><span><b>${pass.id}</b> ${passBadge(pass)}</span>${btn('Open pass', { sm: true, go: 'pass-' + pass.id })}</div>`) : ''}
    ${insp ? card('Final inspection', `<div class="row between"><span><b>${insp.id}</b> · ${badge(...insBadge(insp))}</span>${btn('Open inspection', { sm: true, go: 'inspection-' + insp.id })}</div>`) : ''}
  </div>`;
}

function tabDocuments(r) {
  const sel = Math.min(ui.sel['doc-' + r.id] || 0, Math.max(0, r.docs.length - 1)), d = r.docs[sel];
  if (!r.docs.length) return card('', emptyState('file', 'No documents attached', 'The contractor did not attach any documents.'));
  const req = ptype(r.type).docs.filter(x => x.required && x.label && !r.docs.some(y => y.label === x.label));
  return card('', `<div class="stack">${req.length ? alertBox('warn', 'A required document is missing', esc(req.map(x => x.label).join(', ')) + ' was not attached.') : ''}
  <div class="docs-layout"><div class="doc-list" role="list">${r.docs.map((x, i) => { const e = expiry(x.expiry, x.noExpiry); return `<button class="doc-item ${i === sel ? 'active' : ''}" data-act="pickDoc" data-id="${r.id}:${i}"><b>${esc(x.label)}</b><span class="mini">${esc(x.file)}</span><span class="row">${badge(e.label, e.tone)}</span></button>`; }).join('')}</div>
  <div class="doc-view"><div class="row between"><b>${esc(d.file)}</b><span class="row">${btn('Download', { sm: true, icon: 'download', act: 'demo', id: 'Download ' + d.file })}</span></div>
  <div class="sheet"><div class="stamp">${ic('file')} SAMPLE PREVIEW</div><h3>${esc(d.label)}</h3><div class="rule"></div>
  <dl class="kv"><dt>Contractor</dt><dd>${esc(contractor(r.contractor).name)}</dd><dt>Location</dt><dd>${esc(r.unit)}, ${esc(prop(r.property).name)}</dd><dt>Work dates</dt><dd>${range(r.from, r.to)}</dd><dt>Valid until</dt><dd>${d.noExpiry ? 'Does not expire' : fmt(d.expiry)}</dd></dl>
  <p>The uploaded file would appear here as a PDF or image. This preview shows sample content only.</p></div></div></div></div>`);
}

function personRow(p, extra) {
  const e = expiry(p.idExpiry), tt = (extra.r.to || extra.r.from), short = p.idExpiry >= TODAY && p.idExpiry < tt;
  const rv = extra.revoked;
  return `<div class="person-row"><span class="avatar">${initials(p.name)}</span><div class="meta"><b>${esc(p.name)}</b><span>${esc(p.role)} · ${esc(p.idType)} ${esc(p.idNo)}${extra.added ? ` · added ${fmtDT(extra.added)}` : ''}</span>${rv ? `<span style="color:var(--bad)">Revoked by ${esc(rv.by)} · ${esc(rv.reason)}</span>` : ''}</div><span class="row">${extra.added ? badge('Added after approval', 'info') : ''}${rv ? badge('Revoked', 'bad') : badge(short ? 'Expires before work ends' : e.label, p.idExpiry < TODAY ? 'bad' : short ? 'warn' : e.tone)}${btn('View ID', { sm: true, v: 'ghost', act: 'viewId', id: p.id })}${extra.added && isAdmin() ? btn(rv ? 'Restore' : 'Revoke', { sm: true, v: rv ? 'secondary' : 'danger-ghost', act: 'workerRevoke', id: extra.r.id + ':' + p.id }) : ''}</span></div>`;
}
function tabPeople(r) {
  const extras = (r.extraPeople || []);
  return card('', (r.people.map(pid => personRow(person(pid), { r })).join('') || '<p class="muted">No workers listed.</p>') + (extras.length ? `<div class="divider"></div><p class="small muted" style="margin:6px 4px">Added by the contractor after approval${S.settings.workersAfterApproval ? '' : ' (this is now turned off in Settings)'}</p>${extras.map(x => personRow(person(x.pid), { r, added: x.at, revoked: x.revoked })).join('')}` : ''), { tight: true, sub: `${plural(r.people.length + extras.length, 'worker')}` });
}

function tabCompany(r) {
  const c = contractor(r.contractor), l = expiry(c.licence.expiry);
  return card('Company details', `<dl class="kv-list"><dt>Company</dt><dd>${esc(c.name)} ${cBadge ? cBadge(c) : ''}</dd>
  <dt>Contact</dt><dd>${esc(c.contact)} · ${esc(c.email)}</dd><dt>Phone</dt><dd>${esc(c.phone)}</dd><dt>Tax registration</dt><dd>${esc(c.trn)}</dd>
  <dt>Trade licence</dt><dd>${esc(c.licence.no)} ${badge(l.label, l.tone)}</dd><dt>Documents</dt><dd>${c.documents.length ? c.documents.map(d => esc(d.name)).join(', ') : 'None'}</dd></dl>`, { action: isAdmin() ? btn('Open contractor', { sm: true, go: 'contractor-' + c.id }) : '' });
}

function tabSite(r) {
  const t = ptype(r.type), trip = (t.payment || {}).model === 'trip';
  return `<div class="stack-lg">${card('Vehicles', r.vehicles.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Plate</th><th>Type</th>${trip ? '<th style="text-align:right">Weight</th><th style="text-align:right">Trips</th>' : '<th>Make</th>'}</tr></thead><tbody>${r.vehicles.map(v => `<tr><td><b>${esc(v.plate)}</b></td><td>${esc(v.type)}</td>${trip ? `<td class="num" style="text-align:right">${v.tons || '—'} t</td><td class="num" style="text-align:right">${v.trips || 1}</td>` : `<td>${esc(v.make || '—')}</td>`}</tr>`).join('')}</tbody></table></div>` : '<p class="muted small" style="margin:0">No vehicles will enter the site.</p>')}
  ${card('Materials', r.materials.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Item</th><th style="text-align:right">Quantity</th></tr></thead><tbody>${r.materials.map(m => `<tr><td>${esc(m.name)}</td><td class="num" style="text-align:right">${m.qty} ${esc(m.unit)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="muted small" style="margin:0">No materials listed.</p>')}</div>`;
}

function tabTerms(r) {
  const t = r.terms;
  if (!t) return card('', emptyState('file', 'No signed terms', 'The contractor has not signed the terms for this request.'));
  return card(esc(t.name), `<div class="stack"><div class="row" style="gap:16px;align-items:center"><img src="${SAMPLE_SIG.data}" alt="Signature of ${esc(t.signedBy)}" style="height:56px;background:#fff;border-radius:8px;padding:6px 10px;border:1px solid var(--border)"><div><b>${esc(t.signedBy)}</b><div class="muted small">${esc(t.position)} · signed ${fmtDT(t.signedAt)}</div></div></div>
  ${alertBox('ok', `All ${t.of} confirmations ticked`, `Version ${t.version} of the terms and community guidelines.`)}</div>`, { action: btn('Download signed PDF', { sm: true, icon: 'download', act: 'demo', id: 'Download signed terms' }) });
}

function tabHistory(r) {
  return card('', `<div class="timeline">${r.history.slice().reverse().map((h, i) => `<div class="tl ${i === 0 ? 'now' : 'done'}"><span class="dot">${i === 0 ? '' : ic('check')}</span><div class="grow"><b>${esc(h.action)}</b><span>${esc(h.actor)} · ${fmtDT(h.ts)}</span>${h.note ? `<p class="small" style="margin:6px 0 0">${esc(h.note)}</p>` : ''}</div></div>`).join('')}</div>`);
}

function decisionPanel(r) {
  const i = reqIdx(r), st = curStage(r), ok = allChecked(r), bad = flagsOf(r).filter(f => f.tone === 'bad').length, pass = r.passId && byId(S.passes, r.passId);
  if (r.status === 'payment') {
    const f = feeFor(r);
    return card('Payment pending', `<div class="stack"><p class="muted small" style="margin:0">Every approval is done. The QR codes are issued as soon as ${money(f.total)} is paid.</p><b style="font-size:22px">${money(f.total)}</b>${isAdmin() ? `<div class="decision-actions">${btn('Record cash payment', { v: 'primary', act: 'payQuick', id: r.id + ':cash', icon: 'receipt' })}${btn('Record card payment', { act: 'payQuick', id: r.id + ':card', icon: 'receipt' })}</div><span class="xs faint">The contractor can also pay online from their app.</span>` : '<span class="xs faint">An administrator records cash or card payments. The contractor can also pay online.</span>'}</div>`, { cls: 'decision' });
  }
  if (r.status !== 'review') {
    const last = r.history.at(-1);
    return card('Decision', `<div class="stack">${reqBadge(r)}${last ? `<p class="small muted" style="margin:0">${esc(last.action)} · ${esc(last.actor)} · ${fmtDT(last.ts)}</p>${last.note ? `<p class="small" style="margin:0">${esc(last.note)}</p>` : ''}` : ''}${pass ? `<div class="decision-actions">${btn('View pass', { v: 'primary', go: 'pass-' + pass.id })}${canMarkDone(pass) ? btn('Mark as completed', { icon: 'check', act: 'markDone', id: pass.id }) : ''}</div>` : ''}</div>`, { cls: 'decision' });
  }
  const mine = canDecide(r), force = canForce(r);
  if (!mine && !force) return card('Waiting for another step', `<div class="stack"><p class="muted small" style="margin:0">This request is with <b>${esc(stageName(st))}</b>. ${isReviewer() ? 'Your account can view it but not decide.' : 'You can read everything, but only that step can decide.'}</p>${wfStepper(r)}</div>`, { cls: 'decision' });
  const q = queueIds(), pos = q.indexOf(r.id);
  const forceBtn = force ? `<div class="divider"></div><p class="xs faint" style="margin:0">${mine ? 'As an administrator you can also skip the remaining steps.' : `This request is with ${esc(stageName(st))}. You are allowed to force approve.`} It is written to the history.</p>${btn('Force approve', { v: 'secondary', icon: 'zap', act: 'force', id: r.id })}` : '';
  if (!mine) return card('Not at your step', `<div class="stack"><p class="muted small" style="margin:0">Waiting for <b>${esc(stageName(st))}</b>.</p>${wfStepper(r)}${forceBtn}<div class="field"><label class="label" for="rv-note">Internal note <span class="opt">(optional)</span></label><textarea class="textarea" rows="2" id="rv-note" data-bind="s.requests.${i}.notes" placeholder="Only your team sees this">${esc(r.notes)}</textarea></div></div>`, { cls: 'decision' });
  return `<section class="card decision"><div class="card-head"><div><h2>Your decision</h2><p>${esc(stageName(st))}${pos >= 0 ? ` · ${pos + 1} of ${q.length} in your queue` : ''}</p></div></div><div class="card-body">
    <div class="checklist">${checkDefs.map(([k, l, sub]) => check('chk-' + k, `s.requests.${i}.checks.${k}`, l, sub, true)).join('')}</div>
    ${bad ? alertBox('warn', `${plural(bad, 'serious issue')} flagged`, 'You can still approve, but you will be asked to confirm.') : ''}
    <div class="field"><label class="label" for="rv-note">Internal note <span class="opt">(optional)</span></label><textarea class="textarea" rows="2" id="rv-note" data-bind="s.requests.${i}.notes" placeholder="Only your team sees this">${esc(r.notes)}</textarea></div>
    <div class="decision-actions">${btn(wfIsLast(r) ? (feeFor(r).total ? 'Approve and request payment' : 'Approve and issue pass') : 'Approve this step', { v: 'primary', act: 'approve', id: r.id, disabled: !ok, icon: 'check' })}${btn('Request changes', { act: 'changes', id: r.id, icon: 'edit' })}${btn('Reject', { v: 'danger', act: 'reject', id: r.id, icon: 'x' })}</div>
    ${ok ? '' : '<p class="progress-note" style="margin:0">Tick all three checks to approve.</p>'}${forceBtn}</div></section>`;
}

function pReview(id) {
  const r = byId(S.requests, id);
  if (!r || !inScope(me(), r)) return null;
  ui.hasDecision = canDecide(r);
  const flags = flagsOf(r), tab = curTab('rv-' + id, 'overview');
  const tabs = [['overview', 'Overview'], ['documents', 'Documents', r.docs.length], ['people', 'People', r.people.length + (r.extraPeople || []).length], ['company', 'Company'], ['site', 'Vehicles & materials'], ['terms', 'Signed terms'], ['history', 'History', r.history.length]];
  const body = { overview: tabOverview, documents: tabDocuments, people: tabPeople, company: tabCompany, site: tabSite, terms: tabTerms, history: tabHistory }[tab](r);
  const ch = r.status === 'changes' ? r.history.filter(h => /changes/i.test(h.action)).at(-1) : null;
  return `${pageHead(`${esc(r.title)} ${reqBadge(r)}`, `<span class="id">${r.id}</span> · ${esc(ptype(r.type).name)} · submitted ${fmtDT(r.submitted)}${r.status === 'review' ? ' · ' + ageChip(age(r), true) : ''}`, '', [[isReviewer() ? 'Passes' : 'Pending approval', isReviewer() ? 'passes' : 'queue'], [r.id]])}
  <div class="review"><div class="stack-lg">
    ${ch ? alertBox('warn', 'Waiting for the contractor', esc(ch.note || 'Changes were requested.')) : ''}
    ${r.status === 'payment' ? alertBox('warn', 'Waiting for payment', `All approvals are done. ${money(feeFor(r).total)} is due before the pass and QR codes are issued.`) : ''}
    ${flags.length && ['review', 'changes'].includes(r.status) ? card(`Things to look at (${flags.length})`, `<div class="stack-sm">${flags.map(f => `<div class="flag ${f.tone}">${ic('alert')}<span>${esc(f.text)}</span><button class="btn-link" data-act="tab" data-id="rv-${id}:${f.tab}">Show</button></div>`).join('')}</div>`, { sub: 'Warnings only. They do not stop you deciding.' }) : ''}
    <section class="card">${reviewFacts(r)}</section>
    <div class="stack">${tabsBar('rv-' + id, tabs, tab)}${body}</div>
  </div><aside>${decisionPanel(r)}</aside></div>
  ${canDecide(r) ? `<div class="mobile-decision">${btn('Request changes', { act: 'changes', id: r.id })}${btn('Approve', { v: 'primary', act: 'approve', id: r.id, disabled: !allChecked(r) })}</div>` : ''}`;
}
registerPrefix('review-', id => pReview(id));

/* ---------- decisions ---------- */
function nextAfter(r) { const q = queueIds().filter(x => x !== r.id); return q[0] ? 'review-' + q[0] : 'queue'; }
function finish(r, msg) { persist(); toast(msg); go(nextAfter(r)); }
const nextPassNo = () => Math.max(3011, ...S.passes.map(p => +String(p.id).replace(/\D/g, '') || 0)) + 1;
const nextInvNo = () => 'INV-2026-' + String(Math.max(412, ...S.payments.map(p => +p.id.slice(-4) || 0)) + 1).padStart(4, '0');
const AMC_PERIOD = { Daily: 'Today', Weekly: 'This week', Monthly: 'Oct 2026', Annual: '2026' };
function issuePassFor(r) {
  const pass = { id: 'PS-' + nextPassNo(), requestId: r.id, kind: 'work', holder: r.contractor, title: r.title, property: r.property, unit: r.unit, from: r.from, to: r.to || r.from, people: [...r.people], vehicles: r.vehicles.map(v => ({ plate: v.plate, type: v.type })), issued: nowISO(), issuedBy: me().name };
  if (r.amc) { pass.amc = true; S.amc.unshift({ id: uid('a'), requestId: r.id, contractor: r.contractor, title: r.title, property: r.property, freq: r.amc.freq, required: r.amc.required, period: AMC_PERIOD[r.amc.freq] || '', next: r.from, visits: [] }); }
  S.passes.unshift(pass); r.passId = pass.id; return pass;
}
/* After the last approval: ask for payment on paid permits, otherwise issue the pass. */
function afterFinalApproval(r) {
  const f = feeFor(r);
  if (f.total > 0) { r.status = 'payment'; r.history.push(H(nowISO(), 'System', 'Payment requested', `${money(f.total)}. The pass is issued once it is paid.`)); return `Approved. Waiting for ${money(f.total)} payment.`; }
  r.status = 'approved'; const p = issuePassFor(r); r.history.push(H(nowISO(), 'System', 'Pass issued', p.id)); return `Approved. Pass ${p.id} issued.`;
}
function recordPayment(r, method, note) {
  const f = feeFor(r), pay = { id: nextInvNo(), requestId: r.id, amount: f.total, method, ts: nowISO(), by: me().name, lines: f.lines };
  S.payments.unshift(pay); r.status = 'approved';
  r.history.push(H(nowISO(), me().name, 'Payment received', `${payLabel(method)} · ${pay.id}${note ? '. ' + note : ''}`));
  const p = issuePassFor(r); r.history.push(H(nowISO(), 'System', 'Pass issued', p.id));
  return { pay, pass: p };
}
Object.assign(ACT, {
  pickDoc(t) { const [rid, i] = t.dataset.id.split(':'); ui.sel['doc-' + rid] = +i; render(); },
  viewId(t) { ui.modal = { type: 'idcopy', data: { pid: t.dataset.id } }; render(); },
  approve(t) {
    const r = byId(S.requests, t.dataset.id), last = wfIsLast(r), bad = flagsOf(r).filter(f => f.tone === 'bad'), fee = feeFor(r).total;
    openConfirm({ title: last ? (fee ? 'Approve and request payment?' : 'Approve and issue the pass?') : `Approve ${stageName(curStage(r))}?`, message: last ? (fee ? `This is the final step. The contractor is asked to pay ${money(fee)}. The pass and QR codes are issued after payment.` : 'This is the final step. A pass with a QR code is created and the contractor is notified.') : `The request moves on to ${stageName(workflowOf(r)[r.stage + 1])}.`, confirmText: last ? (fee ? 'Approve' : 'Approve and issue pass') : 'Approve step', tone: 'ok', icon: 'check',
      reason: { label: 'Comment', required: false, ph: 'Optional. The contractor can see this.' },
      extra: () => bad.length ? alertBox('warn', 'Serious issues are still flagged', esc(bad.map(b => b.text).join(' '))) + '<div style="height:10px"></div>' : '',
      onConfirm: d => { r.workflow = workflowOf(r); const st = curStage(r); r.history.push(H(nowISO(), me().name, 'Approved ' + stageName(st), (d.reason || '').trim())); let msg = 'Step approved. The request moved on.'; if (last) msg = afterFinalApproval(r); else { r.stage++; r.checks = { documents: false, people: false, company: false }; } finish(r, msg); } });
  },
  force(t) {
    const r = byId(S.requests, t.dataset.id), wf = workflowOf(r), left = wf.slice(r.stage);
    openConfirm({ title: 'Force approve this request?', message: `This skips the checks and approves ${left.map(stageName).join(', then ')} now. It is recorded in the history with your name and reason.`, confirmText: 'Force approve', tone: 'danger', icon: 'zap', reason: { label: 'Reason', min: 10, ph: 'Why are you skipping the normal approval steps?', hint: 'At least 10 characters. Shown in the history.' },
      onConfirm: d => { r.workflow = wf; left.forEach(st => { r.history.push({ ...H(nowISO(), me().name, 'Approved ' + stageName(st), 'Force approved by ' + me().name + '. ' + d.reason.trim()), forced: true }); }); r.stage = wf.length - 1; const msg = afterFinalApproval(r); finish(r, msg); } });
  },
  changes(t) {
    const r = byId(S.requests, t.dataset.id);
    openConfirm({ title: 'Ask the contractor for changes?', message: 'The request goes back to the contractor. When they resubmit it comes back to you.', confirmText: 'Send request', icon: 'edit', tone: 'warn', reason: { label: 'What should they change?', min: 10, ph: 'For example: upload a Scope of Work Form that shows the exact work area.' },
      onConfirm: d => { r.status = 'changes'; r.history.push(H(nowISO(), me().name, 'Requested changes', d.reason.trim())); finish(r, 'Sent back to the contractor.'); } });
  },
  reject(t) {
    const r = byId(S.requests, t.dataset.id);
    openConfirm({ title: 'Reject this request?', message: 'The contractor is told it was rejected and sees your reason. They will need to submit a new request.', confirmText: 'Reject request', tone: 'danger', reason: { label: 'Reason for rejecting', min: 10, ph: 'Explain why this cannot go ahead.' },
      onConfirm: d => { r.status = 'rejected'; r.history.push(H(nowISO(), me().name, 'Rejected', d.reason.trim())); finish(r, 'Request rejected.'); } });
  },
  workerRevoke(t) {
    const [rid, pid] = t.dataset.id.split(':'), r = byId(S.requests, rid), x = r.extraPeople.find(e => e.pid === pid), p = person(pid);
    if (x.revoked) { openConfirm({ title: `Restore ${p.name}?`, message: 'They can enter again with this pass.', confirmText: 'Restore', tone: 'ok', onConfirm: () => { x.revoked = null; r.history.push(H(nowISO(), me().name, 'Worker restored', p.name)); persist(); toast(`${p.name} restored.`); } }); return; }
    openConfirm({ title: `Revoke ${p.name}?`, message: 'They can no longer enter with this pass. The contractor sees them as revoked.', confirmText: 'Revoke worker', tone: 'danger', reason: { label: 'Reason', min: 10, ph: 'Why is this worker not allowed?' }, onConfirm: d => { x.revoked = { on: nowISO(), by: me().name, reason: d.reason.trim() }; r.history.push(H(nowISO(), me().name, 'Worker revoked', `${p.name}. ${d.reason.trim()}`)); persist(); toast(`${p.name} revoked.`); } });
  },
  /* payments */
  payOpen(t) { const r = byId(S.requests, t.dataset.id); ui.modal = { type: 'pay', data: { id: r.id, method: 'cash', note: '' } }; render(); },
  payQuick(t) { const [id, m] = t.dataset.id.split(':'); ui.modal = { type: 'pay', data: { id, method: m, note: '' } }; render(); },
  payOk() {
    const d = ui.modal.data, r = byId(S.requests, d.id), f = feeFor(r);
    openConfirm({ title: `Record ${money(f.total)} as paid by ${payLabel(d.method).toLowerCase()}?`, message: 'You confirm you have received the money. The invoice is created and the pass with its QR codes is issued to the contractor.', confirmText: 'Record payment', tone: 'ok', icon: 'receipt', onConfirm: () => { const x = recordPayment(r, d.method, d.note.trim()); persist(); toast(`Payment recorded. ${x.pass.id} issued.`); } });
  },
  invoiceOpen(t) { ui.modal = { type: 'invoice', data: { id: t.dataset.id } }; render(); },
  /* completion */
  markDone(t) {
    const p = byId(S.passes, t.dataset.id); if (!canMarkDone(p)) return;
    const r = p.requestId && byId(S.requests, p.requestId), insp = r && closureOf(r);
    openConfirm({ title: `Mark ${p.id} as completed?`, message: insp ? 'The work is finished. It goes to Final inspections, where the closing department checks it and closes it.' : 'The work is finished and the request is closed. This pass stops working.', confirmText: 'Mark as completed', tone: 'ok', icon: 'check',
      onConfirm: () => { p.completed = { on: nowISO(), by: me().name }; if (r) { if (insp) { r.status = 'inspection'; S.inspections.unshift({ id: 'FI-' + (200 + S.inspections.length + 1), requestId: r.id, status: 'pending', requested: nowISO(), notes: `Marked as completed by ${me().name}.`, photos: 0, rounds: [] }); r.history.push(H(nowISO(), me().name, 'Marked as completed', 'Sent to final inspection.')); } else { r.status = 'completed'; r.history.push(H(nowISO(), me().name, 'Marked as completed')); } } persist(); toast(insp ? 'Marked as completed. It is now in Final inspections.' : 'Marked as completed.'); } });
  },
});

MODALS.idcopy = m => {
  const p = person(m.data.pid);
  return modalFrame({ title: `${esc(p.name)} · ${esc(p.idType)}`, sub: 'ID copy uploaded by the contractor', size: 'sm', body: `<div class="sheet"><div class="stamp">${ic('file')} SAMPLE PREVIEW</div><h3>${esc(p.idType)}</h3><div class="rule"></div><dl class="kv"><dt>Name</dt><dd>${esc(p.name)}</dd><dt>Number</dt><dd>${esc(p.idNo)}</dd><dt>Expires</dt><dd>${fmt(p.idExpiry)}</dd></dl></div>`, foot: btn('Close', { v: 'primary', act: 'closeModal' }) });
};
MODALS.pay = m => { const d = m.data, r = byId(S.requests, d.id), f = feeFor(r);
  return modalFrame({ title: 'Record a payment', sub: `${esc(r.title)} · ${esc(contractor(r.contractor).name)}`, size: 'sm', body: `<div class="stack"><div class="row between"><span class="muted">Amount due</span><b style="font-size:22px">${money(f.total)}</b></div>${f.lines.map(l => `<div class="row between small"><span class="muted">${esc(l[0])}</span><span class="num">${money(l[1])}</span></div>`).join('')}<div class="field"><span class="label">Received as</span>${seg('pay-m', 'm.method', [['cash', 'Cash'], ['card', 'Card']], true)}</div>${F({ id: 'pay-n', label: 'Receipt reference', bind: 'm.note', opt: true, ph: 'Optional. For example: card slip number' })}</div>`, foot: btn('Cancel', { act: 'closeModal' }) + btn('Record payment', { v: 'primary', act: 'payOk' }) }); };
MODALS.invoice = m => {
  const pay = byId(S.payments, m.data.id), r = byId(S.requests, pay.requestId), c = contractor(r.contractor);
  return modalFrame({ title: `Invoice ${pay.id}`, sub: `${esc(r.title)} · ${r.id}`, size: 'md', body: `<div class="sheet"><div class="stamp">${ic('check')} PAID</div><h3>${esc(S.community.name)}</h3><p>${esc(S.community.area)} · TRN ${esc(S.settings.trn)}</p><div class="rule"></div>
    <dl class="kv"><dt>Invoice</dt><dd>${pay.id}</dd><dt>Date</dt><dd>${fmtDT(pay.ts)}</dd><dt>Bill to</dt><dd>${esc(c.name)}<br><span style="font-weight:400">TRN ${esc(c.trn)}</span></dd><dt>Permit</dt><dd>${r.id} · ${esc(ptype(r.type).name)}</dd><dt>Paid by</dt><dd>${payLabel(pay.method)} · received by ${esc(pay.by)}</dd></dl>
    <div class="rule" style="height:1px"></div>${pay.lines.map(l => `<div class="row between"><span>${esc(l[0])}</span><b class="num">${money(l[1])}</b></div>`).join('')}<div class="rule" style="height:1px"></div><div class="row between"><b>Total paid</b><b class="num" style="font-size:18px">${money(pay.amount)}</b></div></div>`, foot: btn('Close', { act: 'closeModal' }) + btn('Download PDF', { v: 'primary', icon: 'download', act: 'invoicePdf', id: pay.id }) });
};
