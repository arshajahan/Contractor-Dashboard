/* Terms & guidelines (PDF) editor. Admin only: not included in the Approver file. */
const pubSubset = x => ({ name: x.name, pdf: x.pdf, fields: x.fields, appliesTo: [...x.appliesTo].sort(), placement: x.placement });
const formKey = f => `${f.id}@${f.published ? f.published.version : 0}`;
function formStatus(f) {
  if (!f.published) return ['Not published', 'neutral'];
  return JSON.stringify(pubSubset(f)) === JSON.stringify(pubSubset(f.published)) ? [`Published · v${f.published.version}`, 'ok'] : ['Unpublished changes', 'warn'];
}
const curForm = () => S.forms.find(x => x.id === route().slice(6));
async function readPdf(file) {
  if (!file) return null;
  if (!/\.pdf$/i.test(file.name) && file.type !== 'application/pdf') throw new Error('Choose a PDF file.');
  if (file.size > 4 * 1048576) throw new Error('This PDF is larger than 4 MB. Choose a smaller file for this preview.');
  const u = new Uint8Array(await file.arrayBuffer());
  if (String.fromCharCode(u[0], u[1], u[2], u[3]) !== '%PDF') throw new Error('This file is not a valid PDF.');
  return { pdf: bytesToB64(u), fileName: file.name, size: file.size };
}
function setTerms() {
  const list = S.forms;
  return `${alertBox('info', 'How it works', 'Upload your terms or guidelines as a PDF and click next to each clause to place a tick box. Choose which permit types need it, then publish. Contractors tick every box, enter their name and position, and draw or upload a signature. It is stamped with the date at the bottom of the document, and you see the signed copy when you review a request.')}
  ${list.length ? card('Terms & guidelines', `<div class="table-wrap"><table class="table responsive"><thead><tr><th>Document</th><th>Required for</th><th>Tick boxes</th><th>Status</th><th class="t-actions"><span class="sr">Actions</span></th></tr></thead><tbody>${list.map(f => { const [l, t] = formStatus(f); return `<tr class="clickable" data-go="terms-${f.id}"><td><div class="t-title"><b>${esc(f.name)}</b><span>${esc(f.fileName)} · Updated ${fmt(f.updated)}</span></div></td><td data-m="sub">${f.appliesTo.length === S.permitTypes.length ? 'All work permits' : f.appliesTo.map(id => ptype(id).name).join(', ') || 'None'}</td><td data-m="hide" class="num">${f.fields.length}</td><td data-m="side">${badge(l, t)}</td><td class="t-actions">${btn('Edit', { v: 'ghost', sm: true, go: 'terms-' + f.id })}${btn('', { v: 'ghost', sm: true, icon: 'trash', act: 'termsDelete', id: f.id, title: 'Delete ' + f.name })}</td></tr>`; }).join('')}</tbody></table></div>`, { raw: true, sub: 'Shown to contractors before they submit a work permit.', action: btn('Upload PDF', { v: 'primary', sm: true, icon: 'upload', act: 'termsNew' }) })
    : card('Terms & guidelines', emptyState('file', 'No documents yet', 'Upload your contractor terms as a PDF to get started.', btn('Upload PDF', { v: 'primary', sm: true, icon: 'upload', act: 'termsNew' })))}`;
}
function pTermsEditor(id) {
  const f = S.forms.find(x => x.id === id);
  if (!f) return pageHead('Document not found', 'It may have been deleted.', btn('Back to settings', { go: 'settings-terms' }));
  const [sl, st] = formStatus(f), sel = f.fields.find(x => x.id === ui.adminSel), key = `terms:${f.id}:${f.pdfRev || 0}`, r = pdfPages(key, f.pdf), mode = ui.adminMode || 'add';
  return `${pageHead(`${esc(f.name)} ${badge(sl, st)}`, `${esc(f.fileName)} · ${plural(f.fields.length, 'tick box', 'tick boxes')}`, btn('Replace PDF', { icon: 'refresh', act: 'termsReplace', id: f.id }) + `<input class="file-input" type="file" id="terms-replace" accept="application/pdf,.pdf" data-adminpdf="${f.id}">` + btn(f.published ? 'Publish changes' : 'Publish', { v: 'primary', icon: 'send', act: 'termsPublish', id: f.id }), [['Settings', 'settings-general'], ['Terms & guidelines', 'settings-terms'], [f.name]])}
  <div class="grid-main admin-editor" style="grid-template-columns:minmax(0,1fr) 320px">
    <section class="card">
      <div class="toolbar"><div class="segmented" role="radiogroup" aria-label="Editing mode">${[['add', 'Add tick box'], ['move', 'Select & move']].map(([k, l]) => `<label><input type="radio" name="amode" value="${k}" data-change="adminMode" ${mode === k ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div><span class="small muted">${mode === 'add' ? 'Click next to a clause to place a tick box. Drag a box to move it.' : 'Drag a tick box to move it. Click one to edit it. Arrow keys nudge it.'}</span></div>
      ${r.pages ? pdfDoc(r.pages, f.fields, { admin: true, sel: ui.adminSel, placement: f.placement }) : `<div class="card-body">${docState(key, f.pdf)}</div>`}
    </section>
    <div class="stack admin-side">
      ${sel ? card(`Tick box ${f.fields.indexOf(sel) + 1}`, `${F({ id: 'af-label', label: 'What the contractor agrees to', value: sel.label, attrs: 'data-afield="label"', hint: 'Shown on hover, read by screen readers and listed in the review.' })}
        <label class="switch" for="af-req"><input type="checkbox" id="af-req" data-afield="required" ${sel.required ? 'checked' : ''}><span class="track"></span><span class="txt"><b>Required</b><small>Contractors cannot submit until it is ticked.</small></span></label>
        <div class="field"><span class="label">Size</span><div class="segmented" role="radiogroup">${[['2.2', 'Small'], ['2.8', 'Medium'], ['3.6', 'Large']].map(([v, l]) => `<label><input type="radio" name="af-size" value="${v}" data-afield="size" ${Math.abs(sel.size - Number(v)) < 0.3 ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div></div>`, { action: btn('Delete', { v: 'danger-ghost', sm: true, icon: 'trash', act: 'termsDeleteField', id: sel.id }) }) : ''}
      ${card('Document name', F({ id: 'af-name', label: 'Name contractors see', value: f.name, attrs: 'data-aform="name"' }))}
      ${card('Tick boxes', f.fields.length ? f.fields.map((x, i) => `<button class="list-row ${x.id === ui.adminSel ? 'sel' : ''}" style="width:100%;text-align:left" data-act="termsSelect" data-id="${x.id}"><span class="ic tone-${x.id === ui.adminSel ? 'info' : 'neutral'}" style="font-weight:700;font-size:12px">${i + 1}</span><span class="grow"><b class="small">${esc(x.label)}</b><span>Page ${x.page} · ${x.required ? 'Required' : 'Optional'}</span></span></button>`).join('') : '<p class="small muted" style="padding:12px">No tick boxes yet. Click on the document next to a clause to add one.</p>', { tight: true })}
      ${card('Signature', `<div class="stack-sm">${[['bottom', 'Bottom of the last page', 'Use when the PDF leaves space at the end.'], ['newpage', 'Add a new last page', 'Use when the PDF has no free space.']].map(([v, l, h]) => `<label class="choice"><input type="radio" name="af-place" value="${v}" data-aform="placement" ${f.placement === v ? 'checked' : ''}><span class="radio"></span><span class="grow"><b>${l}</b><small>${h}</small></span></label>`).join('')}</div><p class="xs faint">Contractors enter their name and position, then draw or upload a signature. Company name and date are added automatically.</p>`)}
      ${card('Required for', `<div class="stack-sm">${S.permitTypes.map(t => `<label class="check"><input type="checkbox" data-aform="appliesTo" value="${t.id}" ${f.appliesTo.includes(t.id) ? 'checked' : ''}>${t.name}</label>`).join('')}</div>`)}
    </div>
  </div>`;
}
MODALS.termsForm = m => { const E = m.errs || {}; return modalFrame({ title: 'Upload a PDF', sub: 'Contractors will read it, tick each box you place, and sign it.', body: `
  ${F({ id: 'tf-name', label: 'Document name', req: true, bind: 'm.name', err: E.name, ph: 'For example, Contractor terms & community guidelines' })}
  <div class="field"><span class="label">PDF file<span class="req">*</span></span>${m.data.fileName ? `<div class="file-row"><span class="ic">PDF</span><span class="grow"><b>${esc(m.data.fileName)}</b><span>${sizeTxt(m.data.size)}</span></span><label class="btn btn-ghost btn-sm" for="tf-file">Replace</label></div>` : `<label class="dropzone" for="tf-file"><span class="ic">${ic('upload')}</span><b>Upload PDF</b><span class="xs faint">PDF only · Max 4 MB in this preview</span></label>`}<input class="file-input" type="file" id="tf-file" accept="application/pdf,.pdf" data-adminpdf="new">${E.file ? `<span class="err">${ic('alert')}${E.file}</span>` : `<span class="hint">No PDF to hand? ${btn('Use the sample terms PDF', { v: 'link', act: 'termsSample', cls: 'xs' })}</span>`}</div>
  <div class="field"><span class="label">Required for</span>${S.permitTypes.map(t => `<label class="check"><input type="checkbox" data-mapplies value="${t.id}" ${m.data.appliesTo.includes(t.id) ? 'checked' : ''}>${t.name}</label>`).join('')}</div>`,
  foot: btn('Cancel', { act: 'closeModal' }) + btn('Continue to place tick boxes', { v: 'primary', act: 'termsCreate', iconR: 'arrowR' }) }); };
Object.assign(ACT, {
  termsNew() { ui.modal = { type: 'termsForm', data: { name: '', fileName: '', size: 0, pdf: null, appliesTo: S.permitTypes.map(t => t.id) } }; render(); },
  termsSample() { Object.assign(ui.modal.data, { fileName: 'buzzin-contractor-terms-sample.pdf', size: 61496, pdf: 'sample' }); if (!ui.modal.data.name) ui.modal.data.name = 'Contractor terms & community guidelines'; if (ui.modal.errs) delete ui.modal.errs.file; render(); },
  termsCreate() {
    const m = ui.modal, d = m.data, errs = {};
    if (!d.name.trim()) errs.name = 'Enter a name contractors will recognise.';
    if (!d.pdf) errs.file = 'Upload the PDF.';
    if (!d.appliesTo.length) errs.name = errs.name || 'Choose at least one permit type.';
    if (Object.keys(errs).length) { m.errs = errs; render(); return; }
    const f = { id: uid('frm'), name: d.name.trim(), fileName: d.fileName, pdf: d.pdf, pdfRev: 0, fields: [], appliesTo: d.appliesTo, placement: 'bottom', updated: TODAY, published: null };
    S.forms.push(f);
    if (!persist()) { S.forms.pop(); return; }
    ui.modal = null; ui.adminSel = null; ui.adminMode = 'add'; go('terms-' + f.id);
  },
  termsSelect(t) { ui.adminSel = t.dataset.id; render(); },
  termsDeleteField(t) {
    const f = curForm(), i = f.fields.findIndex(x => x.id === t.dataset.id), fd = f.fields[i];
    openConfirm({ title: 'Delete this tick box?', message: `“${fd.label}” on page ${fd.page} will be removed.`, confirmText: 'Delete tick box', tone: 'danger', onConfirm: () => { f.fields.splice(i, 1); ui.adminSel = null; f.updated = TODAY; persist(); toast('Tick box deleted', { undo: () => { f.fields.splice(i, 0, fd); persist(); render(); } }); } });
  },
  termsReplace() { openConfirm({ title: 'Replace the PDF?', message: 'Tick boxes stay in the same place on each page. Check their positions after uploading.', confirmText: 'Choose new PDF', icon: 'refresh', onConfirm: () => document.getElementById('terms-replace').click() }); },
  termsPublish(t) {
    const f = S.forms.find(x => x.id === t.dataset.id);
    if (!f.fields.length) { toast('Add at least one tick box before publishing.', { err: true }); return; }
    if (!f.appliesTo.length) { toast('Choose at least one permit type under “Required for”.', { err: true }); return; }
    if (f.published && formStatus(f)[1] === 'ok') { toast('No changes to publish.'); return; }
    const v = f.published ? f.published.version + 1 : 1;
    openConfirm({ title: `Publish version ${v}?`, message: `Contractors who haven’t submitted yet will be asked to tick and sign version ${v}. Requests already submitted keep the version they signed.`, confirmText: `Publish version ${v}`, icon: 'send', onConfirm: () => { f.published = Object.assign(clone(pubSubset(f)), { version: v, fileName: f.fileName, at: TODAY }); f.updated = TODAY; persist(); toast(`Version ${v} published`); } });
  },
  termsDelete(t) {
    const i = S.forms.findIndex(x => x.id === t.dataset.id), f = S.forms[i];
    openConfirm({ title: `Delete “${f.name}”?`, message: 'Contractors will no longer be asked to sign it. Copies already signed on submitted requests are kept.', confirmText: 'Delete document', tone: 'danger', onConfirm: () => { S.forms.splice(i, 1); persist(); toast('Document deleted'); go('settings-terms'); } });
  },
});
CHANGE.adminMode = el => { ui.adminMode = el.value; render(); };
registerPrefix('terms-', id => pTermsEditor(id));
document.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset.adminpdf) {
    const file = el.files[0], target = el.dataset.adminpdf; el.value = '';
    readPdf(file).then(r => {
      if (!r) return;
      if (target === 'new') { Object.assign(ui.modal.data, r); if (!ui.modal.data.name) ui.modal.data.name = r.fileName.replace(/\.pdf$/i, '').replace(/[-_]+/g, ' '); if (ui.modal.errs) delete ui.modal.errs.file; }
      else { const f = S.forms.find(x => x.id === target), old = { pdf: f.pdf, fileName: f.fileName }; Object.assign(f, { pdf: r.pdf, fileName: r.fileName, pdfRev: (f.pdfRev || 0) + 1, updated: TODAY }); if (!persist()) Object.assign(f, old); else toast(`${r.fileName} uploaded. Check the tick box positions.`); }
      render();
    }).catch(err => toast(err.message, { err: true }));
    return;
  }
  if (el.dataset.mapplies !== undefined) { const a = ui.modal.data.appliesTo; ui.modal.data.appliesTo = el.checked ? [...new Set([...a, el.value])] : a.filter(x => x !== el.value); return; }
  const f = route().startsWith('terms-') ? curForm() : null;
  if (!f) return;
  if (el.dataset.afield) { const fd = f.fields.find(x => x.id === ui.adminSel); if (!fd) return; const k = el.dataset.afield; fd[k] = k === 'required' ? el.checked : k === 'size' ? Number(el.value) : el.value; f.updated = TODAY; persist(); render(); return; }
  if (el.dataset.aform) { const k = el.dataset.aform; if (k === 'appliesTo') f.appliesTo = el.checked ? [...new Set([...f.appliesTo, el.value])] : f.appliesTo.filter(x => x !== el.value); else f[k] = el.value; f.updated = TODAY; persist(); render(); }
}, true);
document.addEventListener('input', e => {
  const el = e.target, f = route().startsWith('terms-') ? curForm() : null;
  if (!f) return;
  if (el.dataset.afield === 'label') { const fd = f.fields.find(x => x.id === ui.adminSel); if (fd) { fd.label = el.value; persist(); } }
  if (el.dataset.aform === 'name') { f.name = el.value; persist(); }
});
document.addEventListener('pointerdown', e => {
  const pageEl = e.target.closest('[data-admin-page]');
  if (!pageEl || e.button !== 0) return;
  const f = curForm(); if (!f) return;
  const rect = pageEl.getBoundingClientRect(), page = Number(pageEl.dataset.adminPage);
  const pct = ev => [Math.min(98, Math.max(2, (ev.clientX - rect.left) / rect.width * 100)), Math.min(98, Math.max(2, (ev.clientY - rect.top) / rect.height * 100))];
  const boxEl = e.target.closest('[data-box]');
  if (boxEl) {
    e.preventDefault();
    const fd = f.fields.find(x => x.id === boxEl.dataset.box), sx = e.clientX, sy = e.clientY; let moved = false;
    const move = ev => { if (!moved && Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) < 4) return; moved = true; const [x, y] = pct(ev); boxEl.style.left = x + '%'; boxEl.style.top = y + '%'; fd.x = +x.toFixed(2); fd.y = +y.toFixed(2); };
    const up = () => { removeEventListener('pointermove', move); removeEventListener('pointerup', up); ui.adminSel = fd.id; if (moved) { f.fields.sort((a, b) => a.page - b.page || a.y - b.y); f.updated = TODAY; persist(); } render(); };
    addEventListener('pointermove', move); addEventListener('pointerup', up);
    return;
  }
  if ((ui.adminMode || 'add') !== 'add' || e.target.tagName !== 'IMG') { if (ui.adminSel) { ui.adminSel = null; render(); } return; }
  const [x, y] = pct(e);
  const fd = { id: uid('b'), page, x: +x.toFixed(2), y: +y.toFixed(2), size: 2.8, label: `I agree to clause ${f.fields.length + 1}`, required: true };
  f.fields.push(fd); f.fields.sort((a, b) => a.page - b.page || a.y - b.y);
  ui.adminSel = fd.id; f.updated = TODAY; persist(); render();
  setTimeout(() => { const l = document.getElementById('af-label'); if (l) { l.focus({ preventScroll: true }); l.select(); } }, 0);
});
document.addEventListener('keydown', e => {
  if (!route().startsWith('terms-') || !ui.adminSel || ui.modal || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
  const f = curForm(), fd = f && f.fields.find(x => x.id === ui.adminSel); if (!fd) return;
  const step = e.shiftKey ? 1 : 0.2, d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
  if (d) { e.preventDefault(); fd.x = +(fd.x + d[0]).toFixed(2); fd.y = +(fd.y + d[1]).toFixed(2); f.updated = TODAY; persist(); render(); }
  if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); ACT.termsDeleteField({ dataset: { id: fd.id } }); }
});
