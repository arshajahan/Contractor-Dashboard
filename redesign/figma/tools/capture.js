// Captures every redesign screen as a Figma-ready scene tree (frames, text, SVG icons).
// Usage: npm i playwright && node redesign/figma/tools/capture.js
// Add or change screens in the STATES list below.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const URL = 'file://' + path.resolve(__dirname, '../../index.html');
const OUT = process.argv[2] || path.resolve(__dirname, '../buzzin-redesign-scenes.json');
const W = { d: [1440, 900], m: [390, 844] };

const click = s => async pg => { await pg.click(s); await pg.waitForTimeout(150); };
const seq = (...fs) => async pg => { for (const f of fs) await f(pg); };
const waitPdf = async pg => { await pg.waitForFunction(() => !document.querySelector('.pdf-loading'), null, { timeout: 20000 }); await pg.waitForTimeout(200); };
const drawSig = async pg => {
  await pg.click('[data-act="openSign"][data-mode="draw"]'); await pg.waitForTimeout(150);
  const c = await pg.locator('#sig-canvas').boundingBox();
  await pg.mouse.move(c.x + 60, c.y + 120); await pg.mouse.down();
  for (let i = 0; i <= 40; i++) await pg.mouse.move(c.x + 60 + i * 11, c.y + 95 + Math.sin(i / 3.2) * 38 - i * 0.6);
  await pg.mouse.up(); await pg.click('[data-act="saveSign"]'); await pg.waitForTimeout(150);
};
const completeDraft = async pg => {
  await pg.evaluate(() => { location.hash = 'documents'; }); await pg.waitForTimeout(250);
  await pg.setInputFiles('#up-scope', { name: 'scope-of-work-painting.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(184000) });
  await pg.click('label[for="doc-scope-noexp"]'); await pg.waitForTimeout(100);
  await pg.evaluate(() => { location.hash = 'pdf'; }); await waitPdf(pg);
  const n = await pg.locator('.pdf-box').count();
  for (let i = 0; i < n; i++) await pg.locator('.pdf-box').nth(i).click();
  await drawSig(pg);
  await pg.click('label[for="f-sg-auth"]'); await pg.waitForTimeout(100);
  await pg.evaluate(() => { location.hash = 'review'; }); await pg.waitForTimeout(250);
};
const STATES = [
  ['01 Overview', 'home', 'dm'],
  ['02 Authorized passes', 'permits', 'dm'],
  ['03 Passes – row actions menu', 'permits', 'd', click('[data-act="rowMenu"] >> nth=1'), true],
  ['04 Passes – filters', 'permits', 'dm', click('[data-act="openFilters"]'), true],
  ['05 Pass – changes requested', 'permit-BZ-1042', 'dm'],
  ['06 Pass – approved with QR', 'permit-BZ-1036', 'dm'],
  ['07 Pass – under review', 'permit-BZ-1048', 'd'],
  ['08 Withdraw request – confirm', 'permit-BZ-1048', 'dm', seq(click('[data-act="rowMenu"]'), click('[data-act="cancelPermit"]')), true],
  ['09 Request pass', 'type', 'dm'],
  ['10 Before you start – checklist', 'type', 'dm', click('[data-act="checklist"]'), true],
  ['11 Draft exists – confirm', 'type', 'd', click('[data-act="startPermit"]'), true],
  ['12 Step 1 Work details', 'details', 'dm'],
  ['13 Step 1 Validation errors', 'details', 'dm', async pg => { await pg.evaluate(() => { const d = JSON.parse(localStorage.getItem('buzzin-redesign-v2')); }); await pg.fill('#f-title', ''); await pg.fill('#f-phone', '05'); await pg.click('[data-act="wzNext"]'); await pg.waitForTimeout(150); }],
  ['14 Community dropdown', 'details', 'dm', click('.switcher'), true],
  ['15 Units multi-select', 'details', 'd', click('#f-units'), true],
  ['16 Step 2 Materials', 'materials', 'dm'],
  ['17 Add item', 'materials', 'dm', click('[data-act="addMaterial"]'), true],
  ['18 Remove item – confirm', 'materials', 'dm', click('[data-act="removeMaterial"] >> nth=0'), true],
  ['19 Step 3 Vehicles', 'workvehicles', 'dm'],
  ['19b Vehicles – expiry popup', 'workvehicles', 'dm', seq(async pg => { await pg.check('input[value="v2"]'); await pg.waitForTimeout(100); }, click('[data-act="wzNext"]')), true],
  ['20 Step 4 Workers', 'personnel', 'dm'],
  ['20b Workers – expiry warning', 'personnel', 'dm', async pg => { await pg.check('input[value="p3"]'); await pg.evaluate(() => { location.hash = 'documents'; }); await pg.waitForTimeout(150); await pg.evaluate(() => { location.hash = 'personnel'; }); await pg.waitForTimeout(250); }],
  ['21 Step 5 Documents', 'documents', 'dm'],
  ['21b Choose from company documents', 'documents', 'dm', click('[data-act="pickCompanyDoc"] >> nth=0'), true],
  ['22 Step 6 Sign terms', 'pdf', 'dm', waitPdf],
  ['22b Sign terms – boxes missing', 'pdf', 'd', seq(waitPdf, click('[data-act="wzNext"]'))],
  ['23 Signature – draw', 'pdf', 'dm', seq(waitPdf, click('[data-act="openSign"][data-mode="draw"]')), true],
  ['23a Signature – upload', 'pdf', 'dm', seq(waitPdf, click('[data-act="openSign"][data-mode="upload"]')), true],
  ['23b Step 6 Signed', 'pdf', 'dm', seq(completeDraft, async pg => { await pg.evaluate(() => { location.hash = 'pdf'; }); await waitPdf(pg); })],
  ['24 Step 7 Review', 'review', 'dm', completeDraft],
  ['25 Submit – confirm', 'review', 'dm', seq(completeDraft, async pg => { await pg.check('#f-consent'); }, click('[data-act="submitRequest"]')), true],
  ['26 Request submitted', 'submitted-BZ-1048', 'dm'],
  ['27 Discard draft – confirm', 'details', 'd', click('.steps [data-act="discardDraft"]'), true],
  ['28 Visitor pass', 'visitor', 'dm'],
  ['29 Final inspection', 'completion-BZ-1036', 'dm'],
  ['30 Help & contact', 'help', 'dm'],
  ['31 Employees', 'people', 'dm'],
  ['32 Add employee', 'people', 'dm', click('.page-head [data-act="addPerson"]'), true],
  ['33 Remove employee – confirm', 'people', 'd', click('[data-act="removePerson"] >> nth=0'), true],
  ['34 Vehicles', 'vehicles', 'dm'],
  ['35 Add vehicle', 'vehicles', 'd', click('.page-head [data-act="addVehicle"]'), true],
  ['36 Settings – Company & billing', 'settings', 'dm'],
  ['37 Settings – unsaved changes', 'settings', 'd', async pg => { await pg.fill('#c-name', 'Sample Contracting LLC'); await pg.waitForTimeout(100); }],
  ['38 Settings – save confirm', 'settings', 'd', seq(async pg => { await pg.fill('#c-name', 'Sample Contracting LLC'); }, click('[data-act="saveForm"]')), true],
  ['39 Settings – remove licence confirm', 'settings', 'd', click('[data-act="removeFile"]'), true],
  ['40 Settings – My profile', 'settings-profile', 'dm'],
  ['41 Settings – Password & security', 'settings-security', 'dm'],
  ['42 Change password – confirm', 'settings-security', 'd', seq(async pg => { await pg.fill('#pw-current', 'OldPass#1'); await pg.fill('#pw-next', 'NewPass#2026'); await pg.fill('#pw-confirm', 'NewPass#2026'); }, click('[data-act="changePassword"]')), true],
  ['43 Deactivate – confirm', 'settings-security', 'd', click('.card-foot [data-act="deactivate"]'), true],
  ['44 Settings – Company documents', 'settings-documents', 'dm'],
  ['47 Settings – Communities', 'settings-communities', 'dm'],
  ['48 Leave community – confirm', 'settings-communities', 'd', click('[data-act="leaveCommunity"] >> nth=1'), true],
  ['49 Settings – Notifications', 'settings-notifications', 'dm'],
  ['50 Notifications panel', 'home', 'd', click('[data-pop="notif"]'), true],
  ['51 Account menu', 'home', 'd', click('[data-pop="user"]'), true],
  ['52 Sign out – confirm', 'home', 'd', seq(click('[data-pop="user"]'), click('[data-act="signOut"]')), true],
  ['53 Mobile menu', 'home', 'm', click('[data-act="openDrawer"]'), true],
  ['54 Overview – dark mode', 'home', 'd', null, false, 'dark'],
  ['55 Admin – Permit forms', 'admin-forms', 'dm'],
  ['59 Admin – Community profile', 'admin-profile', 'd'],
  ['60 Marina Gate – white logo on dark', 'home', 'd', async pg => { await pg.click('.switcher'); await pg.click('[data-act="switchCommunity"][data-id="marina"]'); await pg.waitForTimeout(300); }],
  ['56 Admin – Upload PDF form', 'admin-forms', 'd', seq(click('.page-head [data-act="adminNewForm"]'), click('[data-act="adminUseSample"]')), true],
  ['57 Admin – Place tick boxes', 'admin-form-frm1', 'd', seq(waitPdf, click('[data-act="adminSelect"] >> nth=1'))],
  ['58 Admin – Publish confirm', 'admin-form-frm1', 'd', seq(waitPdf, async pg => { await pg.click('[data-act="adminSelect"] >> nth=0'); await pg.fill('#af-label', 'I agree to the working hours'); await pg.press('#af-label', 'Tab'); await pg.waitForTimeout(100); }, click('.page-head [data-act="adminPublish"]')), true],
];

function extractor(overlay) {
  const raised = [];
  const SKIP = new Set(['SCRIPT', 'STYLE', 'LINK', 'META', 'HEAD', 'TITLE', 'DATALIST', 'OPTION', 'TEMPLATE']);
  const px = v => parseFloat(v) || 0;
  function color(c) {
    if (!c || c === 'transparent') return null;
    let m = c.match(/^rgba?\(([^)]+)\)/);
    if (m) { const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number); const a = p.length > 3 ? p[3] : 1; return a === 0 ? null : { r: p[0] / 255, g: p[1] / 255, b: p[2] / 255, a }; }
    m = c.match(/^color\(srgb ([^)]+)\)/);
    if (m) { const [rgb, al] = m[1].split('/'); const p = rgb.trim().split(/\s+/).map(Number); const a = al ? Number(al) : 1; return a === 0 ? null : { r: p[0], g: p[1], b: p[2], a }; }
    return null;
  }
  const hex = c => c ? '#' + [c.r, c.g, c.b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('') : null;
  function shadows(s) {
    if (!s || s === 'none') return [];
    return s.split(/,(?![^(]*\))/).map(x => {
      const col = color((x.match(/rgba?\([^)]+\)|color\([^)]+\)/) || [''])[0]);
      const nums = x.replace(/rgba?\([^)]+\)|color\([^)]+\)/, '').trim().split(/\s+/).filter(v => /px$/.test(v)).map(px);
      if (!col) return null;
      return { inset: /inset/.test(x), x: nums[0] || 0, y: nums[1] || 0, blur: nums[2] || 0, spread: nums[3] || 0, color: col };
    }).filter(Boolean);
  }
  function textStyle(cs) {
    const fs = px(cs.fontSize);
    return { font: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(), weight: Number(cs.fontWeight) || 400, size: fs, lh: cs.lineHeight === 'normal' ? Math.round(fs * 1.25) : px(cs.lineHeight), ls: cs.letterSpacing === 'normal' ? 0 : px(cs.letterSpacing), color: color(cs.color) || { r: 0, g: 0, b: 0, a: 1 }, align: cs.textAlign, case: cs.textTransform === 'uppercase' ? 'UPPER' : 'ORIGINAL', underline: /underline/.test(cs.textDecorationLine), italic: cs.fontStyle === 'italic' };
  }
  function nameOf(el) {
    const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).filter(c => !/^(i|grow|row|stack|stack-sm)$/.test(c)) : [];
    if (cls.includes('btn')) { const v = (cls.find(c => /^btn-(primary|secondary|ghost|danger|danger-ghost|link)$/.test(c)) || 'btn').replace('btn-', ''); const lab = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30); return `Button/${v}${lab ? ' – ' + lab : ''}`; }
    const role = { card: 'Card', badge: 'Badge', 'nav-item': 'Nav item', kpi: 'Stat', modal: 'Modal', popover: 'Dropdown', alert: 'Alert', field: 'Field', input: 'Input', select: 'Select', textarea: 'Textarea', 'combo-btn': 'Select (searchable)', topbar: 'Top bar', sidebar: 'Sidebar', actionbar: 'Action bar', 'bottom-nav': 'Bottom nav', switcher: 'Community dropdown', 'select-row': 'Selectable row', chip: 'Chip', 'file-row': 'File', dropzone: 'Upload', step: 'Step', tab: 'Tab', avatar: 'Avatar', 'card-head': 'Card header', 'card-body': 'Card body', 'card-foot': 'Card footer', 'modal-foot': 'Modal footer', overlay: 'Overlay', savebar: 'Unsaved changes bar', segmented: 'Segmented control', switch: 'Toggle', paper: 'Form page' };
    for (const c of cls) if (role[c]) return role[c];
    return cls[0] || el.tagName.toLowerCase();
  }
  function svgOf(el, cs) {
    const c = el.cloneNode(true);
    const r = el.getBoundingClientRect();
    c.setAttribute('width', r.width); c.setAttribute('height', r.height);
    c.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const col = hex(color(cs.color)) || '#000000';
    return c.outerHTML.replace(/currentColor/g, col);
  }
  function frameProps(cs) {
    const f = {};
    const bg = color(cs.backgroundColor); if (bg) f.fill = bg;
    const sides = ['Top', 'Right', 'Bottom', 'Left'].map(s => ({ w: cs[`border${s}Style`] === 'none' ? 0 : px(cs[`border${s}Width`]), c: color(cs[`border${s}Color`]) }));
    const sc = sides.find(s => s.w && s.c);
    if (sc) { f.stroke = sc.c; f.sw = sides.map(s => (s.w && s.c ? s.w : 0)); if (cs.borderTopStyle === 'dashed' || cs.borderLeftStyle === 'dashed') f.dash = true; }
    const rad = ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'].map(k => px(cs[`border${k}Radius`]));
    if (rad.some(Boolean)) f.radius = rad;
    const sh = shadows(cs.boxShadow); if (sh.length) f.shadows = sh;
    if (cs.backgroundImage && /radial-gradient/.test(cs.backgroundImage)) f.dot = true;
    return f;
  }
  function pseudo(el, which, ox, oy, out) {
    const ps = getComputedStyle(el, which);
    if (!ps || ps.content === 'none' || ps.content === 'normal' || ps.display === 'none' || ps.position !== 'absolute') return;
    const bg = color(ps.backgroundColor); if (!bg) return;
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    let tx = 0; const m = ps.transform.match(/matrix\(([^)]+)\)/); if (m) tx = Number(m[1].split(',')[4]);
    const x = r.left + px(cs.borderLeftWidth) + px(ps.left) + tx - ox, y = r.top + px(cs.borderTopWidth) + px(ps.top) - oy;
    out.push(Object.assign({ t: 'frame', name: which.replace('::', ''), x, y, w: px(ps.width), h: px(ps.height), children: [] }, frameProps(ps)));
  }
  function control(el, cs, r, ox, oy, out) {
    const tag = el.tagName, type = (el.type || '').toLowerCase();
    if (type === 'checkbox' || type === 'radio') {
      const on = el.checked, accent = color(cs.accentColor) || { r: .07, g: .13, b: .23, a: 1 };
      const box = { t: 'frame', name: type === 'radio' ? 'Radio' : 'Checkbox', x: r.left - ox, y: r.top - oy, w: r.width, h: r.height, radius: Array(4).fill(type === 'radio' ? r.width / 2 : 3), fill: on ? accent : { r: 1, g: 1, b: 1, a: 1 }, stroke: on ? accent : { r: .55, g: .59, b: .65, a: 1 }, sw: [1.5, 1.5, 1.5, 1.5], children: [] };
      if (on && type === 'checkbox') box.children.push({ t: 'svg', x: 2, y: 2, w: r.width - 4, h: r.height - 4, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${r.width - 4}" height="${r.height - 4}" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>` });
      if (on && type === 'radio') box.children.push({ t: 'frame', name: 'dot', x: r.width / 2 - 3, y: r.height / 2 - 3, w: 6, h: 6, radius: [3, 3, 3, 3], fill: { r: 1, g: 1, b: 1, a: 1 }, children: [] });
      out.push(box); return;
    }
    const f = Object.assign({ t: 'frame', name: nameOf(el), x: r.left - ox, y: r.top - oy, w: r.width, h: r.height, clip: true, children: [] }, frameProps(cs));
    if (cs.opacity < 1) f.opacity = Number(cs.opacity);
    out.push(f);
    let txt = '', ph = false;
    if (tag === 'SELECT') txt = el.selectedOptions[0] ? el.selectedOptions[0].text : '';
    else if (type === 'date' && el.value) { const [y, mo, d] = el.value.split('-'); txt = `${d}/${mo}/${y}`; }
    else if (type === 'password' && el.value) txt = '•'.repeat(el.value.length);
    else txt = el.value;
    if (!txt) { txt = el.placeholder || (type === 'date' ? 'dd/mm/yyyy' : ''); ph = true; }
    const st = textStyle(cs);
    if (ph) st.color = color(getComputedStyle(el, '::placeholder').color) || { r: .5, g: .54, b: .6, a: 1 };
    const pl = px(cs.paddingLeft), pt = px(cs.paddingTop);
    if (txt) {
      const multi = tag === 'TEXTAREA';
      const lh = st.lh;
      f.children.push(Object.assign({ t: 'text', text: txt, x: pl, y: multi ? pt : Math.max(0, (r.height - lh) / 2), w: r.width - pl - px(cs.paddingRight), h: multi ? r.height - pt * 2 : lh, multi }, st));
    }
    const icon = tag === 'SELECT' ? '<path d="m6 9 6 6 6-6"/>' : type === 'date' ? '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>' : type === 'time' ? '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>' : '';
    if (icon) f.children.push({ t: 'svg', x: r.width - 28, y: (r.height - 16) / 2, w: 16, h: 16, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7E899A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icon}</svg>` });
  }
  function textNode(node, ox, oy, out) {
    const raw = node.nodeValue;
    if (!raw.trim()) return;
    const s = raw.search(/\S/), e = raw.length - raw.slice().split('').reverse().join('').search(/\S/);
    const range = document.createRange(); range.setStart(node, s); range.setEnd(node, e);
    const rects = [...range.getClientRects()].filter(r => r.width > 0);
    if (!rects.length) return;
    const b = range.getBoundingClientRect();
    const cs = getComputedStyle(node.parentElement);
    const st = textStyle(cs);
    const lines = new Set(rects.map(r => Math.round(r.top))).size;
    const parentR = node.parentElement.getBoundingClientRect();
    // multi-line text keeps its wrapping width (parent content width)
    const w = b.width + (lines > 1 ? 2 : 0);
    const x = b.left;
    out.push(Object.assign({ t: 'text', text: raw.slice(s, e).replace(/\s+/g, ' '), x: x - ox, y: b.top - oy, w, h: b.height, multi: lines > 1 }, st));
  }
  function walk(el, ox, oy, out, depth, inRaised) {
    if (SKIP.has(el.tagName)) return;
    const cs = getComputedStyle(el);
    const z = parseInt(cs.zIndex, 10);
    if (!inRaised && depth > 0 && cs.position !== 'static' && z > 0) { raised.push({ el, z, order: raised.length }); return; }
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return;
    const r = el.getBoundingClientRect();
    if (el instanceof SVGSVGElement) { if (r.width && r.height) out.push({ t: 'svg', name: 'Icon', x: r.left - ox, y: r.top - oy, w: r.width, h: r.height, svg: svgOf(el, cs) }); return; }
    if (el.tagName === 'CANVAS') { out.push({ t: 'frame', name: 'Signature pad', x: r.left - ox, y: r.top - oy, w: r.width, h: r.height, fill: { r: 1, g: 1, b: 1, a: 1 }, stroke: { r: .78, g: .82, b: .86, a: 1 }, sw: [1, 1, 1, 1], radius: [8, 8, 8, 8], children: [] }); return; }
    if (el.tagName === 'IMG') {
      let data = null;
      try { const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(r.width)); c.height = Math.max(1, Math.round(r.height)); c.getContext('2d').drawImage(el, 0, 0, c.width, c.height); data = /^data:image\/png/.test(el.src) ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.85); } catch (e) { /* cross-origin */ }
      out.push(data ? { t: 'image', name: el.alt || 'Image', x: r.left - ox, y: r.top - oy, w: r.width, h: r.height, data } : { t: 'frame', name: 'Image', x: r.left - ox, y: r.top - oy, w: r.width, h: r.height, fill: { r: .93, g: .94, b: .96, a: 1 }, children: [] });
      return;
    }
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) { if (el.type === 'file' || el.type === 'hidden') return; if (r.width < 4) return; control(el, cs, r, ox, oy, out); return; }
    const fp = frameProps(cs);
    const clip = cs.overflowX !== 'visible' || cs.overflowY !== 'visible';
    const op = Number(cs.opacity);
    const significant = el.matches('.card,.btn,.badge,.pdf-page,.pdf-box,.pdf-sig,.modal,.popover,.field,.kpi,.nav-item,.topbar,.sidebar,.actionbar,.bottom-nav,.select-row,.choice,.list-row,.alert,.tab,.step,.chip,.file-row,.dropzone,.page-head,.card-head,.card-body,.card-foot,.toolbar,tr,.savebar,.switch,.segmented,.combo-btn,.pop-item,.paper,.form-sec,.set-link,.timeline,.tl');
    const emit = Object.keys(fp).length || clip || op < 1 || significant || depth === 0;
    let target = out, nx = ox, ny = oy;
    if (emit && r.width > 0 && r.height > 0) {
      const f = Object.assign({ t: 'frame', name: nameOf(el), x: r.left - ox, y: r.top - oy, w: r.width, h: r.height, children: [] }, fp);
      if (clip) f.clip = true;
      if (op < 1) f.opacity = op;
      out.push(f); target = f.children; nx = r.left; ny = r.top;
    }
    pseudo(el, '::before', nx, ny, target);
    for (const ch of el.childNodes) {
      if (ch.nodeType === 3) textNode(ch, nx, ny, target);
      else if (ch.nodeType === 1) walk(ch, nx, ny, target, depth + 1, inRaised);
    }
    pseudo(el, '::after', nx, ny, target);
  }
  window.scrollTo(0, 0);
  document.getElementById('toasts').innerHTML = '';
  const out = [];
  const bodyBg = color(getComputedStyle(document.body).backgroundColor);
  walk(document.body, 0, 0, out, 0, false);
  const root = out[0];
  // Floating layers (top bar, dropdowns, popups, fixed bars) go on top, in stacking order.
  raised.sort((a, b) => a.z - b.z || a.order - b.order).forEach(r => walk(r.el, 0, 0, root.children, 1, true));
  root.fill = bodyBg; root.w = innerWidth; root.h = overlay ? innerHeight : Math.max(innerHeight, document.documentElement.scrollHeight);
  root.clip = true;
  return root;
}
function tokens() {
  const cs = getComputedStyle(document.documentElement);
  const names = ['bg', 'surface', 'surface-2', 'surface-3', 'border', 'border-strong', 'text', 'text-2', 'text-3', 'brand', 'brand-hover', 'brand-ink', 'brand-soft', 'side', 'side-2', 'side-text', 'link', 'focus', 'ok', 'ok-soft', 'warn', 'warn-soft', 'bad', 'bad-soft', 'info', 'info-soft', 'neutral', 'neutral-soft'];
  return names.map(n => [n, cs.getPropertyValue('--' + n).trim()]);
}

(async () => {
  const b = await chromium.launch();
  const scenes = { version: 1, generated: new Date().toISOString().slice(0, 10), tokens: {}, screens: [] };
  const fail = [];
  for (const scheme of ['light', 'dark']) {
    const ctx = await b.newContext({ colorScheme: scheme, viewport: { width: 1440, height: 900 } });
    const pg = await ctx.newPage();
    await pg.goto(URL + '#home'); await pg.waitForTimeout(300);
    scenes.tokens[scheme] = await pg.evaluate(tokens);
    await ctx.close();
  }
  for (const [name, route, plats, act, overlay, scheme] of STATES) {
    for (const p of plats) {
      const [w, h] = W[p];
      const ctx = await b.newContext({ colorScheme: scheme || 'light', viewport: { width: w, height: h }, deviceScaleFactor: 1 });
      const pg = await ctx.newPage();
      pg.on('pageerror', e => fail.push(`${name} ${p}: ${e.message}`));
      try {
        await pg.goto(URL + '#home'); await pg.evaluate(() => { localStorage.clear(); });
        await pg.goto(URL + '?fresh=' + Date.now() + '#' + route); await pg.waitForTimeout(500);
        await pg.evaluate(() => document.fonts.ready);
        if (!overlay) { const full = await pg.evaluate(() => document.documentElement.scrollHeight); await pg.setViewportSize({ width: w, height: Math.max(h, full) }); await pg.waitForTimeout(150); }
        if (act) await act(pg);
        await pg.waitForTimeout(250);
        const root = await pg.evaluate(extractor, !!overlay);
        root.name = `${p === 'd' ? 'Desktop' : 'Mobile'} / ${name}`;
        scenes.screens.push({ platform: p === 'd' ? 'Desktop' : 'Mobile', name, root });
        if (process.argv[3]) await pg.screenshot({ path: `${process.argv[3]}/${p}-${name.replace(/[^\w]+/g, '_')}.png` });
      } catch (e) { fail.push(`${name} ${p}: ${e.message.split('\n')[0]}`); }
      await ctx.close();
    }
  }
  fs.writeFileSync(OUT, JSON.stringify(scenes));
  const count = n => 1 + (n.children || []).reduce((a, c) => a + count(c), 0);
  console.log('screens', scenes.screens.length, 'nodes', scenes.screens.reduce((a, s) => a + count(s.root), 0), 'bytes', fs.statSync(OUT).size);
  console.log(fail.join('\n') || 'no failures');
  await b.close();
})();
