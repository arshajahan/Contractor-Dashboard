/* PDF viewer for community terms: renders pages with pdf.js and overlays tick boxes and the signature block.
   Used by the reviewer (read-only signed copy) and by the Terms editor in Settings (Admin only). */
const SIG_AREA = { bottom: { left: 9, top: 86, width: 82, height: 9 }, newpage: { left: 9, top: 13, width: 82, height: 12 } };
const b64ToBytes = b64 => { const s = atob(b64); const u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; };
const bytesToB64 = u => { let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s); };
const formPdf = pdf => b64ToBytes(pdf === 'sample' ? window.BUZZIN_SAMPLE_TERMS : pdf);
const PDF_CACHE = {};
function pdfPages(key, pdf) {
  if (PDF_CACHE[key]) return PDF_CACHE[key];
  PDF_CACHE[key] = { loading: true };
  (async () => {
    try {
      if (!window.pdfjsLib) throw new Error('The PDF viewer did not load.');
      const doc = await window.pdfjsLib.getDocument({ data: formPdf(pdf) }).promise;
      const out = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const vp = page.getViewport({ scale: 1.5 });
        const c = document.createElement('canvas'); c.width = vp.width; c.height = vp.height;
        await page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
        const blob = await new Promise(r => c.toBlob(r, 'image/png'));
        out.push({ src: URL.createObjectURL(blob), w: vp.width, h: vp.height });
      }
      PDF_CACHE[key] = { pages: out };
    } catch (e) { PDF_CACHE[key] = { error: (e && e.message) || String(e) }; }
    render();
  })();
  return PDF_CACHE[key];
}
function docState(key, pdf) {
  const r = pdfPages(key, pdf);
  if (r.error) return alertBox('bad', 'This document could not be shown', esc(r.error) + ' Download the original instead.');
  return `<div class="pdf-loading">${ic('file')}<span>Loading document…</span></div>`;
}
function sigPreview(placement, signer, admin) {
  const A = SIG_AREA[placement], g = signer || {};
  const style = `left:${A.left}%;top:${A.top}%;width:${A.width}%;height:${A.height}%`;
  if (admin || !g.sig) return `<div class="pdf-sig" style="${style}"><span class="ph">${admin ? 'Signature block: company, name, position, date and signature are added here' : 'Not signed'}</span></div>`;
  return `<div class="pdf-sig signed" style="${style}"><div class="lines">${[['Company', g.company], ['Name', g.name], ['Position', g.position], ['Date', fmt(g.date || TODAY)]].map(([k, v]) => `<span><i>${k}</i><b>${esc(v || '—')}</b></span>`).join('')}</div><img src="${g.sig.data}" alt="Signature"></div>`;
}
function boxHtml(f, o, n) {
  const style = `left:${f.x}%;top:${f.y}%;width:${f.size}%`;
  if (o.admin) return `<button type="button" class="pdf-box admin ${o.sel === f.id ? 'sel' : ''}" data-box="${f.id}" style="${style}" aria-label="Tick box ${n}: ${esc(f.label)}"><span class="pdf-box-n">${n}</span></button>`;
  const on = !!(o.ticks && o.ticks[f.id]);
  return `<span class="pdf-box ${on ? 'on' : ''}" role="img" aria-label="${esc(f.label)}: ${on ? 'ticked' : 'not ticked'}" title="${esc(f.label)}" style="${style}">${ic('check')}</span>`;
}
function pdfDoc(pages, fields, o) {
  const n = pages.length + (o.placement === 'newpage' ? 1 : 0);
  const page = (pg, i) => `<div class="pdf-page" style="aspect-ratio:${pg.w}/${pg.h}" ${o.admin ? `data-admin-page="${i + 1}"` : ''}><img src="${pg.src}" alt="Page ${i + 1} of ${n}" draggable="false">${fields.filter(f => f.page === i + 1).map(f => boxHtml(f, o, fields.indexOf(f) + 1)).join('')}${o.placement === 'bottom' && i === pages.length - 1 ? sigPreview('bottom', o.signer, o.admin) : ''}<span class="pdf-pno">${i + 1} / ${n}</span></div>`;
  const extra = o.placement === 'newpage' ? `<div class="pdf-page blank" style="aspect-ratio:${pages[0].w}/${pages[0].h}"><div class="pdf-newpage-head"><b>Contractor declaration</b><span>Signed for and on behalf of the contractor. Completed electronically through the Buzzin contractor portal.</span></div>${sigPreview('newpage', o.signer, o.admin)}<span class="pdf-pno">${n} / ${n}</span></div>` : '';
  return `<div class="pdf-doc ${o.admin ? 'admin' : ''}">${pages.map(page).join('')}${extra}</div>`;
}
// A made-up handwritten signature for the sample signed copies.
const SAMPLE_SIG = { data: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="260" height="90" viewBox="0 0 260 90"><path d="M10 62c14-34 22-48 30-46s-6 40-2 42 18-30 30-30-4 24 6 24 14-16 26-18 8 12 20 8 22-22 30-20 0 20 12 18 24-8 30-14" fill="none" stroke="#102A5C" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 76c60-8 130-10 220-2" fill="none" stroke="#102A5C" stroke-width="2" stroke-linecap="round" opacity=".7"/></svg>') };
function saveBytes(bytes, name) {
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
  const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
/* Signed copy of the community's PDF for a request: ticks in every box, plus the signature block at the bottom. */
async function signedCopyPdf(form, r) {
  if (!window.PDFLib) throw new Error('The PDF tools did not load.');
  const { PDFDocument, StandardFonts, rgb } = window.PDFLib, P = form.published || form;
  const doc = await PDFDocument.load(formPdf(P.pdf));
  const font = await doc.embedFont(StandardFonts.Helvetica), bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const pages = doc.getPages(), ink = rgb(0.06, 0.2, 0.45), grey = rgb(0.4, 0.45, 0.52);
  P.fields.forEach(fd => { const pg = pages[fd.page - 1]; if (!pg) return; const { width, height } = pg.getSize(), s = fd.size / 100 * width; pg.drawSvgPath(`M ${-s * 0.32} 0 L ${-s * 0.08} ${s * 0.24} L ${s * 0.34} ${-s * 0.3}`, { x: fd.x / 100 * width, y: height - fd.y / 100 * height, borderColor: ink, borderWidth: Math.max(1.5, s * 0.14) }); });
  let page = pages[pages.length - 1]; const { width, height } = page.getSize();
  if (P.placement === 'newpage') { page = doc.addPage([width, height]); page.drawText('Contractor declaration', { x: width * 0.09, y: height * 0.92, size: 14, font: bold, color: rgb(0.1, 0.13, 0.2) }); }
  const A = SIG_AREA[P.placement], bx = A.left / 100 * width, bw = A.width / 100 * width, top = height - A.top / 100 * height, bh = A.height / 100 * height;
  const t = r.terms, c = contractor(r.contractor);
  [['Company', c.name], ['Name', t.signedBy], ['Position', t.position], ['Date', fmt(t.signedAt.slice(0, 10))]].forEach(([k, v], i) => { const y = top - 12 - i * 15; page.drawText(k, { x: bx, y, size: 9, font, color: grey }); page.drawText(String(v || ''), { x: bx + 58, y, size: 10.5, font: bold, color: rgb(0.08, 0.12, 0.2) }); });
  const png = await doc.embedPng(b64ToBytes(await sigPng()));
  const maxW = bw * 0.36, maxH = bh - 20, sc = Math.min(maxW / png.width, maxH / png.height, 1), iw = png.width * sc, ih = png.height * sc, sx = bx + bw - maxW + (maxW - iw) / 2, sy = top - 4 - ih;
  page.drawImage(png, { x: sx, y: sy, width: iw, height: ih });
  page.drawLine({ start: { x: bx + bw - maxW, y: sy - 3 }, end: { x: bx + bw, y: sy - 3 }, thickness: 0.8, color: rgb(0.6, 0.64, 0.7) });
  page.drawText('Signature', { x: bx + bw - maxW, y: sy - 12, size: 8, font, color: grey });
  page.drawText(`Signed electronically on ${fmt(t.signedAt.slice(0, 10))} via the Buzzin contractor portal · ${t.ticked} of ${t.of} boxes ticked · Version ${t.version} · Ref ${r.id}`, { x: bx, y: top - bh - 6, size: 6.5, font, color: grey });
  return doc.save();
}
async function sigPng() {
  const img = await loadImg(SAMPLE_SIG.data), c = document.createElement('canvas'); c.width = 260; c.height = 90; c.getContext('2d').drawImage(img, 0, 0); return c.toDataURL('image/png').split(',')[1];
}
