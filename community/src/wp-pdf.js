/* PDF downloads (pass details with approvals, invoices). Uses pdf-lib, no network. */
const pdfClean = s => String(s ?? '').replace(/[–—]/g, '-').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/·/g, '|').replace(/[^\x20-\x7E]/g, '');
class PdfWriter {
  constructor(doc, font, bold) { this.doc = doc; this.font = font; this.bold = bold; this.W = 595; this.H = 842; this.m = 48; this.newPage(); }
  newPage() { this.page = this.doc.addPage([this.W, this.H]); this.y = this.H - this.m; }
  need(h) { if (this.y - h < this.m + 20) this.newPage(); }
  text(str, o = {}) {
    const size = o.size || 10, f = o.bold ? this.bold : this.font, maxW = o.maxW || (this.W - this.m * 2), x0 = o.x == null ? this.m : o.x, col = o.color || PDFLib.rgb(0.08, 0.13, 0.2);
    const words = pdfClean(str).split(/\s+/), lines = []; let cur = '';
    words.forEach(w => { const t = cur ? cur + ' ' + w : w; if (f.widthOfTextAtSize(t, size) > maxW && cur) { lines.push(cur); cur = w; } else cur = t; });
    if (cur) lines.push(cur);
    lines.forEach(l => { this.need(size + 4); this.page.drawText(l, { x: x0, y: this.y - size, size, font: f, color: col }); this.y -= size * 1.35; });
    return lines.length;
  }
  gap(n = 8) { this.y -= n; }
  rule(col) { this.need(6); this.page.drawLine({ start: { x: this.m, y: this.y }, end: { x: this.W - this.m, y: this.y }, thickness: 0.8, color: col || PDFLib.rgb(0.8, 0.84, 0.88) }); this.y -= 8; }
  h(str) { this.gap(8); this.text(str, { size: 12, bold: true }); this.rule(); }
  kv(rows) { rows.forEach(([k, v]) => { this.need(14); const y0 = this.y; this.page.drawText(pdfClean(k), { x: this.m, y: y0 - 10, size: 9.5, font: this.font, color: PDFLib.rgb(0.43, 0.48, 0.55) }); const n = this.text(v, { x: this.m + 130, maxW: this.W - this.m * 2 - 130, size: 10, bold: true }); }); }
  table(head, rows, widths) {
    const total = this.W - this.m * 2, xs = []; let x = this.m; widths.forEach(w => { xs.push(x); x += w * total; });
    this.need(20); this.page.drawRectangle({ x: this.m, y: this.y - 16, width: total, height: 18, color: PDFLib.rgb(0.93, 0.95, 0.97) });
    head.forEach((h, i) => this.page.drawText(pdfClean(h), { x: xs[i] + 4, y: this.y - 11, size: 8.5, font: this.bold, color: PDFLib.rgb(0.31, 0.36, 0.45) })); this.y -= 20;
    rows.forEach(r => {
      const lines = r.map((c, i) => this.wrap(c, widths[i] * total - 8, 9)); const n = Math.max(...lines.map(l => l.length)); this.need(n * 12 + 6);
      lines.forEach((ls, i) => ls.forEach((l, j) => this.page.drawText(l, { x: xs[i] + 4, y: this.y - 9 - j * 12, size: 9, font: i === 0 ? this.bold : this.font, color: PDFLib.rgb(0.08, 0.13, 0.2) })));
      this.y -= n * 12 + 4; this.page.drawLine({ start: { x: this.m, y: this.y + 1 }, end: { x: this.W - this.m, y: this.y + 1 }, thickness: 0.4, color: PDFLib.rgb(0.88, 0.9, 0.93) });
    });
  }
  wrap(str, maxW, size) { const words = pdfClean(str).split(/\s+/).filter(Boolean), lines = []; let cur = ''; words.forEach(w => { const t = cur ? cur + ' ' + w : w; if (this.font.widthOfTextAtSize(t, size) > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }); if (cur) lines.push(cur); return lines.length ? lines : ['-']; }
  qr(seed, x, y, size) {
    const svg = qrSvg(seed), re = /<rect x="(\d+)" y="(\d+)" width="(\d+)" height="(\d+)" fill="(#[0-9a-fA-F]+)"/g; let m; const k = size / 21;
    this.page.drawRectangle({ x, y, width: size, height: size, color: PDFLib.rgb(1, 1, 1), borderColor: PDFLib.rgb(0.8, 0.84, 0.88), borderWidth: 0.8 });
    while ((m = re.exec(svg))) { const dark = m[5].toLowerCase() !== '#fff' && m[5].toLowerCase() !== '#ffffff'; this.page.drawRectangle({ x: x + (+m[1]) * k, y: y + size - (+m[2] + +m[4]) * k, width: +m[3] * k, height: +m[4] * k, color: dark ? PDFLib.rgb(0.08, 0.13, 0.2) : PDFLib.rgb(1, 1, 1) }); }
  }
}
async function newPdf() { const doc = await PDFLib.PDFDocument.create(), font = await doc.embedFont(PDFLib.StandardFonts.Helvetica), bold = await doc.embedFont(PDFLib.StandardFonts.HelveticaBold); return new PdfWriter(doc, font, bold); }
function approvalRows(r) {
  const wf = workflowOf(r), out = [];
  wf.forEach((s, i) => { const name = stageName(s), h = r.history.find(x => x.action === 'Approved ' + name || (i === wf.length - 1 && /Final approval/.test(x.action))); out.push([name, h ? h.actor + (h.forced ? ' (force approved)' : '') : 'Not recorded', h ? fmtDT(h.ts) : '-', h ? (h.note || '-') : '-']); });
  r.history.filter(h => /Requested changes|Rejected|Payment received|Worker revoked|Marked as completed/.test(h.action)).forEach(h => out.push([h.action, h.actor, fmtDT(h.ts), h.note || '-']));
  return out;
}
function requestSections(w, r) {
  const c = contractor(r.contractor), t = ptype(r.type);
  w.h('Request'); w.kv([['Request', `${r.id}  |  ${t.name}`], ['Work', r.title], ['Contractor', c.name], ['Site contact', `${r.contact}, ${r.phone}`], ['Location', `${r.unit}, ${prop(r.property).name}`], ['Work dates', `${range(r.from, r.to)}, ${r.hours}`], ['Submitted', fmtDT(r.submitted)]]);
  if (r.description) { w.gap(4); w.text(r.description, { size: 9.5 }); }
  if (r.amc) { w.gap(4); w.text(`Maintenance contract (AMC): ${r.amc.freq}, ${plural(r.amc.required, 'visit')} each period.`, { size: 9.5, bold: true }); }
  w.h('Approvals'); w.table(['Department and level', 'Approved by', 'Date and time', 'Comment'], approvalRows(r), [0.24, 0.22, 0.2, 0.34]);
  w.h(`Documents attached (${r.docs.length})`); if (r.docs.length) w.table(['Document', 'File', 'Valid until'], r.docs.map(d => [d.label, d.file, d.noExpiry ? 'No expiry' : fmt(d.expiry)]), [0.38, 0.38, 0.24]); else w.text('None.', { size: 9.5 });
  w.h(`Workers (${r.people.length + (r.extraPeople || []).length})`);
  w.table(['Name', 'Role', 'ID', 'ID valid until'], [...r.people.map(person).map(x => [x.name, x.role, `${x.idType} ${x.idNo}`, fmt(x.idExpiry)]), ...(r.extraPeople || []).map(x => { const q = person(x.pid); return [q.name + ' (added later)', q.role, `${q.idType} ${q.idNo}`, x.revoked ? 'REVOKED' : fmt(q.idExpiry)]; })], [0.26, 0.22, 0.34, 0.18]);
  w.h('Company'); w.kv([['Company', c.name], ['Contact', `${c.contact}, ${c.email}`], ['Phone', c.phone || '-'], ['Tax registration', c.trn || '-'], ['Trade licence', `${c.licence.no || '-'}${c.licence.expiry ? ', valid to ' + fmt(c.licence.expiry) : ''}`]]);
  w.h(`Vehicles (${r.vehicles.length})`); if (r.vehicles.length) w.table(['Plate', 'Type', 'Make', 'Weight', 'Trips'], r.vehicles.map(v => [v.plate, v.type, v.make || '-', v.tons ? v.tons + ' t' : '-', String(v.trips || 1)]), [0.26, 0.16, 0.24, 0.17, 0.17]); else w.text('None.', { size: 9.5 });
  w.h(`Materials (${r.materials.length})`); if (r.materials.length) w.table(['Item', 'Quantity'], r.materials.map(m => [m.name, `${m.qty} ${m.unit}`]), [0.7, 0.3]); else w.text('None.', { size: 9.5 });
  if (r.terms) { w.h('Signed terms'); w.kv([['Document', `${r.terms.name}, version ${r.terms.version}`], ['Signed by', `${r.terms.signedBy}, ${r.terms.position}`], ['Signed', fmtDT(r.terms.signedAt)], ['Confirmations', `${r.terms.ticked} of ${r.terms.of} ticked`]]); }
  const pay = payOf(r); if (pay) { w.h('Payment'); w.kv([['Invoice', pay.id], ['Amount', money(pay.amount)], ['Paid by', `${payLabel(pay.method)}, ${fmtDT(pay.ts)}`]]); }
  const fi = S.inspections.find(x => x.requestId === r.id);
  if (fi) { w.h('Final inspection'); w.kv([['Status', insBadge(fi)[0]], ['Marked completed', fmtDT(fi.requested)]]); fi.rounds.forEach(x => w.text(`${DEC[x.decision][0]} | ${x.by} | ${fmtDT(x.ts)}: ${x.comment}${x.files.length ? ' (Attached: ' + x.files.join(', ') + ')' : ''}`, { size: 9 })); if (fi.remark) { w.gap(4); w.text(`Closing remark: ${fi.remark}`, { size: 9.5, bold: true }); } }
  w.h('History'); w.table(['When', 'By', 'What'], r.history.map(h => [fmtDT(h.ts), h.actor, h.action + (h.note ? ': ' + h.note : '')]), [0.2, 0.22, 0.58]);
}
async function buildPassPdf(p) {
  const w = await newPdf(), r = p.requestId && byId(S.requests, p.requestId);
  w.text(S.community.name, { size: 18, bold: true }); w.text(`${S.community.area}  |  Work permit pass`, { size: 10, color: PDFLib.rgb(0.43, 0.48, 0.55) });
  w.qr(p.id, w.W - w.m - 92, w.H - w.m - 92, 92); w.gap(6);
  w.text(p.title, { size: 15, bold: true, maxW: 380 }); w.text(`${p.id}  |  ${PASS[passState(p)][0]}`, { size: 11 });
  w.y = Math.min(w.y, w.H - w.m - 104); w.gap(10);
  w.h('Pass details');
  w.kv([['Holder', holderName(p)], ['Permit type', r ? ptype(r.type).name : (p.kind === 'visitor' ? 'Visitor pass' : 'Manual pass')], ['Location', `${p.unit}, ${prop(p.property).name}`], ['Valid', range(p.from, p.to)], ['Work hours', r ? r.hours : '-'], ['Issued', `${fmtDT(p.issued)} by ${p.issuedBy}`], ...(p.completed ? [['Completed', `${fmtDT(p.completed.on)} by ${p.completed.by}`]] : [])]);
  if (r) requestSections(w, r);
  else { w.h(`People allowed in (${passPeople(p).length})`); passPeople(p).forEach(x => w.text(`${x.name}  -  ${x.sub}`, { size: 9.5 })); if (p.vehicles && p.vehicles.length) { w.h('Vehicles'); p.vehicles.forEach(v => w.text(`${v.plate}  -  ${v.type}`, { size: 9.5 })); } w.h('Approval'); w.text(`Issued directly by ${p.issuedBy} on ${fmtDT(p.issued)}. There was no request to approve.`, { size: 9.5 }); }
  w.gap(14); w.text(`Generated ${fmt(TODAY)}. This is a design preview with sample data.`, { size: 8, color: PDFLib.rgb(0.5, 0.55, 0.6) });
  return w.doc.save();
}
async function buildReportPdf(i) {
  const w = await newPdf(), r = byId(S.requests, i.requestId), pass = r.passId && byId(S.passes, r.passId);
  w.text(S.community.name, { size: 18, bold: true }); w.text(`${S.community.area}  |  Work closure report`, { size: 10, color: PDFLib.rgb(0.43, 0.48, 0.55) }); w.gap(8);
  w.text(r.title, { size: 15, bold: true }); w.text(`${i.id}  |  ${i.outcome === 'Completed' ? 'Closed: completed' : 'Closed: incomplete'}`, { size: 11, bold: true, color: i.outcome === 'Completed' ? PDFLib.rgb(0.07, 0.46, 0.3) : PDFLib.rgb(0.58, 0.34, 0) });
  w.h('Closing'); w.kv([['Outcome', i.outcome === 'Completed' ? 'Work completed' : 'Closed as incomplete'], ['Closed', `${fmtDT(i.closedOn)} by ${i.closedBy}`], ['Closing remark', i.remark], ['Pass', pass ? pass.id : '-']]);
  w.h('Contractor completion notes'); w.text(i.notes, { size: 9.5 });
  w.h('Inspection'); i.rounds.forEach(x => { w.text(`${DEC[x.decision][0]}  |  ${x.by}  |  ${fmtDT(x.ts)}`, { size: 9.5, bold: true }); w.text(x.comment, { size: 9.5 }); if (x.files.length) w.text(`Attached: ${x.files.join(', ')}`, { size: 9, color: PDFLib.rgb(0.43, 0.48, 0.55) }); w.gap(4); });
  requestSections(w, r);
  w.gap(14); w.text(`Generated ${fmt(TODAY)}. This is a design preview with sample data.`, { size: 8, color: PDFLib.rgb(0.5, 0.55, 0.6) });
  return w.doc.save();
}
async function buildInvoicePdf(pay) {
  const w = await newPdf(), r = byId(S.requests, pay.requestId), c = contractor(r.contractor);
  w.text(S.community.name, { size: 18, bold: true }); w.text(`${S.community.area}  |  TRN ${S.settings.trn}`, { size: 10, color: PDFLib.rgb(0.43, 0.48, 0.55) }); w.gap(10);
  w.text(`Invoice ${pay.id}`, { size: 15, bold: true }); w.text('PAID', { size: 11, bold: true, color: PDFLib.rgb(0.07, 0.46, 0.3) });
  w.h('Details'); w.kv([['Date', fmtDT(pay.ts)], ['Bill to', c.name], ['Tax registration', c.trn || '-'], ['Permit', `${r.id}  |  ${ptype(r.type).name}`], ['Paid by', `${payLabel(pay.method)}, received by ${pay.by}`]]);
  w.h('Items'); w.table(['Description', 'Amount'], pay.lines.map(l => [l[0], money(l[1])]), [0.75, 0.25]); w.gap(8);
  w.text(`Total paid: ${money(pay.amount)}`, { size: 13, bold: true }); w.gap(16);
  w.text(`Generated ${fmt(TODAY)}. This is a design preview with sample data.`, { size: 8, color: PDFLib.rgb(0.5, 0.55, 0.6) });
  return w.doc.save();
}
Object.assign(ACT, {
  passPdf(t) { const p = byId(S.passes, t.dataset.id); buildPassPdf(p).then(b => { saveBytes(b, `${p.id}-permit.pdf`); toast(`${p.id} PDF ready.`); }).catch(e => toast('Could not make the PDF: ' + e.message, { err: true })); },
  reportPdf(t) { const i = byId(S.inspections, t.dataset.id); buildReportPdf(i).then(b => { saveBytes(b, `${i.id}-closure-report.pdf`); toast(`${i.id} report ready.`); }).catch(e => toast('Could not make the PDF: ' + e.message, { err: true })); },
  invoicePdf(t) { const pay = byId(S.payments, t.dataset.id); buildInvoicePdf(pay).then(b => { saveBytes(b, `${pay.id}.pdf`); toast(`${pay.id} PDF ready.`); }).catch(e => toast('Could not make the PDF: ' + e.message, { err: true })); },
});
