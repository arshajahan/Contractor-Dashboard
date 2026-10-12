/* Work permits: the review screen (shared by Admin and Approver). */
const reqIdx = r => S.requests.indexOf(r);
const checkDefs = [['documents', 'Documents checked', 'Files open, match the permit type and are in date'], ['people', 'Workers and ID copies checked', 'Names match their ID and IDs are valid for the work dates'], ['company', 'Contractor details checked', 'Licence and insurance are valid and the company is active']];
const allChecked = r => checkDefs.every(([k]) => r.checks[k]);
const flagsOf = r => requestFlags(r);

function wfStepper(r) {
  const wf = workflowOf(r), done = r.status === 'review' ? r.stage : (['rejected', 'changes', 'cancelled'].includes(r.status) ? r.stage : wf.length);
  if (!wf.length) return '<p class="muted small">This permit type has no approval steps.</p>';
  return `<div class="wf" role="list" aria-label="Approval steps">${wf.map((s, i) => {
    const st = i < done ? 'done' : (i === done && r.status === 'review') ? 'now' : '';
    return `${i ? '<span class="wf-line"></span>' : ''}<span class="wf-step ${st}" role="listitem"><span class="n">${st === 'done' ? ic('check') : i + 1}</span>${esc(stageName(s))}</span>`;
  }).join('')}</div>`;
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

function tabOverview(r) {
  const insp = S.inspections.find(i => i.requestId === r.id);
  return `<div class="stack-lg">
    ${card('Work description', `<p style="margin:0">${esc(r.description || 'No description given.')}</p>`)}
    ${card('Approval steps', `${wfStepper(r)}<p class="progress-note" style="margin:10px 0 0">${r.status === 'review' ? `Now with ${esc(stageName(curStage(r)))}. Each step is approved by someone in that department and level.` : 'This request is no longer in review.'}</p>`, { sub: 'Based on the permit type and this property’s approval levels.' })}
    ${insp ? card('Final inspection', `<div class="row between"><span><b>${insp.id}</b> · ${badge(insp.status === 'closed' ? 'Closed · ' + insp.outcome : insp.status === 'scheduled' ? 'Scheduled' : 'Requested', insp.status === 'closed' ? 'ok' : 'info')}</span>${btn('Open inspection', { sm: true, go: 'inspection-' + insp.id })}</div>`) : ''}
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

function tabPeople(r) {
  const tt = r.to || r.from;
  return card('', r.people.map(pid => { const p = person(pid), e = expiry(p.idExpiry), short = p.idExpiry >= TODAY && p.idExpiry < tt;
    return `<div class="person-row"><span class="avatar">${initials(p.name)}</span><div class="meta"><b>${esc(p.name)}</b><span>${esc(p.role)} · ${esc(p.idType)} ${esc(p.idNo)}</span></div><span class="row">${badge(short ? 'Expires before work ends' : e.label, p.idExpiry < TODAY ? 'bad' : short ? 'warn' : e.tone)}${btn('View ID', { sm: true, v: 'ghost', act: 'viewId', id: pid })}</span></div>`; }).join('') || '<p class="muted">No workers listed.</p>', { tight: true, sub: `${plural(r.people.length, 'worker')} requested`, cls: '' });
}

function tabCompany(r) {
  const c = contractor(r.contractor), l = expiry(c.licence.expiry), i = expiry(c.insurance.expiry);
  return card('Company details', `<dl class="kv-list"><dt>Company</dt><dd>${esc(c.name)} ${c.status === 'active' ? badge('Active', 'ok') : badge(c.status === 'suspended' ? 'Suspended' : 'Pending', c.status === 'suspended' ? 'bad' : 'warn')}</dd>
  <dt>Contact</dt><dd>${esc(c.contact)} · ${esc(c.email)}</dd><dt>Phone</dt><dd>${esc(c.phone)}</dd><dt>Tax registration</dt><dd>${esc(c.trn)}</dd>
  <dt>Trade licence</dt><dd>${esc(c.licence.no)} ${badge(l.label, l.tone)}</dd><dt>${esc(c.insurance.name)}</dt><dd>${badge(i.label, i.tone)}</dd></dl>`, { action: isAdmin() ? btn('Open contractor', { sm: true, go: 'contractor-' + c.id }) : '' });
}

function tabSite(r) {
  const pr = prop(r.property).required;
  return `<div class="stack-lg">${card('Vehicles', r.vehicles.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Plate</th><th>Type</th><th>Make</th></tr></thead><tbody>${r.vehicles.map(v => `<tr><td><b>${esc(v.plate)}</b></td><td>${esc(v.type)}</td><td>${esc(v.make || '—')}</td></tr>`).join('')}</tbody></table></div>` : '<p class="muted small" style="margin:0">No vehicles will enter the site.</p>', { raw: false })}
  ${card('Materials', r.materials.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Item</th><th style="text-align:right">Quantity</th></tr></thead><tbody>${r.materials.map(m => `<tr><td>${esc(m.name)}</td><td class="num" style="text-align:right">${m.qty} ${esc(m.unit)}</td></tr>`).join('')}</tbody></table></div>` : `<p class="muted small" style="margin:0">${pr.materials ? 'This property needs materials listed, but none were added.' : 'No materials listed.'}</p>`)}</div>`;
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
  const i = reqIdx(r), st = curStage(r), mine = canDecide(r), ok = allChecked(r), bad = flagsOf(r).filter(f => f.tone === 'bad').length;
  if (r.status !== 'review') {
    const last = r.history.at(-1);
    return card('Decision', `<div class="stack">${reqBadge(r)}${last ? `<p class="small muted" style="margin:0">${esc(last.action)} by ${esc(last.actor)} · ${fmtDT(last.ts)}</p>${last.note ? `<p class="small" style="margin:0">${esc(last.note)}</p>` : ''}` : ''}${r.passId ? btn('View pass', { v: 'primary', go: 'pass-' + r.passId }) : ''}</div>`, { cls: 'decision' });
  }
  if (!mine) return card('Waiting for another step', `<div class="stack"><p class="muted small" style="margin:0">This request is with <b>${esc(stageName(st))}</b>. You can read everything, but only that step can decide.</p>${wfStepper(r)}</div>`, { cls: 'decision' });
  const q = queueIds(), pos = q.indexOf(r.id);
  return `<section class="card decision"><div class="card-head"><div><h2>Your decision</h2><p>${esc(stageName(st))}${pos >= 0 ? ` · ${pos + 1} of ${q.length} in your queue` : ''}</p></div></div><div class="card-body">
    <div class="checklist">${checkDefs.map(([k, l, sub]) => check('chk-' + k, `s.requests.${i}.checks.${k}`, l, sub, true)).join('')}</div>
    ${bad ? alertBox('warn', `${plural(bad, 'serious issue')} flagged`, 'You can still approve, but you will be asked to confirm.') : ''}
    <div class="field"><label class="label" for="rv-note">Internal note <span class="opt">(optional)</span></label><textarea class="textarea" rows="2" id="rv-note" data-bind="s.requests.${i}.notes" placeholder="Only your team sees this">${esc(r.notes)}</textarea></div>
    <div class="decision-actions">${btn(wfIsLast(r) ? 'Approve and issue pass' : 'Approve this step', { v: 'primary', act: 'approve', id: r.id, disabled: !ok, icon: 'check' })}${btn('Request changes', { act: 'changes', id: r.id, icon: 'edit' })}${btn('Reject', { v: 'danger', act: 'reject', id: r.id, icon: 'x' })}</div>
    ${ok ? '' : '<p class="progress-note" style="margin:0">Tick all three checks to approve.</p>'}</div></section>`;
}
const wfIsLast = r => r.stage >= workflowOf(r).length - 1;

function pReview(id) {
  const r = byId(S.requests, id);
  if (!r || !inScope(me(), r)) return null;
  ui.hasDecision = canDecide(r);
  const flags = flagsOf(r), tab = curTab('rv-' + id, 'overview');
  const tabs = [['overview', 'Overview'], ['documents', 'Documents', r.docs.length], ['people', 'People', r.people.length], ['company', 'Company'], ['site', 'Vehicles & materials'], ['terms', 'Signed terms'], ['history', 'History', r.history.length]];
  const body = { overview: tabOverview, documents: tabDocuments, people: tabPeople, company: tabCompany, site: tabSite, terms: tabTerms, history: tabHistory }[tab](r);
  const ch = r.status === 'changes' ? r.history.filter(h => /changes/i.test(h.action)).at(-1) : null;
  return `${pageHead(`${esc(r.title)} ${reqBadge(r)}`, `<span class="id">${r.id}</span> · ${esc(ptype(r.type).name)} · submitted ${fmtDT(r.submitted)}${r.status === 'review' ? ' · ' + ageChip(age(r), true) : ''}`, '', [['Review queue', 'queue'], [r.id]])}
  <div class="review"><div class="stack-lg">
    ${ch ? alertBox('warn', 'Waiting for the contractor', esc(ch.note || 'Changes were requested.')) : ''}
    ${flags.length ? card(`Things to look at (${flags.length})`, `<div class="stack-sm">${flags.map(f => `<div class="flag ${f.tone}">${ic('alert')}<span>${esc(f.text)}</span><button class="btn-link" data-act="tab" data-id="rv-${id}:${f.tab}">Show</button></div>`).join('')}</div>`, { sub: 'Warnings only. They do not stop you deciding.' }) : ''}
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
function issuePassFor(r) {
  const n = nextPassNo(), pass = { id: 'PS-' + n, requestId: r.id, kind: 'work', holder: r.contractor, title: r.title, property: r.property, unit: r.unit, from: r.from, to: r.to || r.from, people: [...r.people], vehicles: r.vehicles.map(v => ({ plate: v.plate, type: v.type })), issued: nowISO(), issuedBy: me().name };
  S.passes.unshift(pass); r.passId = pass.id; return pass;
}
Object.assign(ACT, {
  pickDoc(t) { const [rid, i] = t.dataset.id.split(':'); ui.sel['doc-' + rid] = +i; render(); },
  viewId(t) { ui.modal = { type: 'idcopy', data: { pid: t.dataset.id } }; render(); },
  approve(t) {
    const r = byId(S.requests, t.dataset.id), last = wfIsLast(r), bad = flagsOf(r).filter(f => f.tone === 'bad');
    openConfirm({ title: last ? 'Approve and issue the pass?' : `Approve ${stageName(curStage(r))}?`, message: last ? 'This is the final step. A pass with a QR code is created and the contractor is notified.' : `The request moves on to ${stageName(workflowOf(r)[r.stage + 1])}.`, confirmText: last ? 'Approve and issue pass' : 'Approve step', tone: 'ok', icon: 'check',
      extra: () => bad.length ? alertBox('warn', 'Serious issues are still flagged', esc(bad.map(b => b.text).join(' '))) + '<div style="height:10px"></div>' : '',
      alt: isAdmin() && !last ? { label: 'Approve all remaining steps', v: 'secondary', fn: () => { r.workflow = workflowOf(r); while (r.stage < r.workflow.length - 1) { r.history.push(H(nowISO(), me().name, 'Approved ' + stageName(curStage(r)))); r.stage++; } r.status = 'approved'; issuePassFor(r); r.history.push(H(nowISO(), me().name, 'Final approval · pass issued')); finish(r, `Approved. Pass ${r.passId} issued.`); } } : null,
      onConfirm: () => { r.workflow = workflowOf(r); const st = curStage(r); if (last) { r.status = 'approved'; issuePassFor(r); r.history.push(H(nowISO(), me().name, 'Final approval · pass issued')); } else { r.history.push(H(nowISO(), me().name, 'Approved ' + stageName(st))); r.stage++; r.checks = { documents: false, people: false, company: false }; } finish(r, last ? `Approved. Pass ${r.passId} issued.` : 'Step approved. The request moved on.'); } });
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
});
MODALS.idcopy = m => {
  const p = person(m.data.pid);
  return modalFrame({ title: `${esc(p.name)} · ${esc(p.idType)}`, sub: 'ID copy uploaded by the contractor', size: 'sm', body: `<div class="sheet"><div class="stamp">${ic('file')} SAMPLE PREVIEW</div><h3>${esc(p.idType)}</h3><div class="rule"></div><dl class="kv"><dt>Name</dt><dd>${esc(p.name)}</dd><dt>Number</dt><dd>${esc(p.idNo)}</dd><dt>Expires</dt><dd>${fmt(p.idExpiry)}</dd></dl></div>`, foot: btn('Close', { v: 'primary', act: 'closeModal' }) });
};
