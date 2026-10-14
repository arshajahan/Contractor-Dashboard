// Captures the community dashboards (Admin, Approver, Events) as Figma-ready scene trees.
// Usage: npm i playwright && node community/figma/tools/capture.js            (all three)
//        node community/figma/tools/capture.js admin                         (one workspace)
// Add or change screens in the STATES lists below. Output: community/figma/buzzin-<workspace>-scenes.json
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const FILES = { admin: 'buzzin-admin.html', approver: 'buzzin-approver.html', reviewer: 'buzzin-reviewer.html', events: 'buzzin-events.html' };
const TITLES = { admin: 'Community Admin', approver: 'Approver', reviewer: 'Reviewer', events: 'Events' };
const W = { d: [1440, 900], m: [390, 844] };

const click = s => async pg => { await pg.click(s); await pg.waitForTimeout(150); };
const seq = (...fs) => async pg => { for (const f of fs) await f(pg); };
const go = h => async pg => { await pg.evaluate(h => { location.hash = h; }, h); await pg.waitForTimeout(250); };
const tab = (id, k) => async pg => { await pg.evaluate(([i, t]) => { ui.tab[i] = t; render(); }, [id, k]); await pg.waitForTimeout(150); };
const checks = async pg => { for (const k of ['documents', 'people', 'company']) await pg.check('#chk-' + k); await pg.waitForTimeout(150); };
const fillBlank = (sel, v) => async pg => { await pg.fill(sel, v); await pg.waitForTimeout(100); };
const menu = n => async pg => { await pg.locator('[data-act="rowMenu"]').nth(n).click(); await pg.waitForTimeout(150); };

// [name, route, platforms ('d' desktop, 'm' mobile), action, overlay (popup: capture viewport only), colour scheme]
const STATES = {
  admin: [
    ['01 Dashboard', 'dashboard', 'dm'],
    ['01b Dashboard dark mode', 'dashboard', 'd', null, false, 'dark'],
    ['02 Review queue', 'queue', 'dm'],
    ['03 Review queue – waiting for contractor', 'queue', 'd', async pg => { await pg.evaluate(() => { ui.tab.queue = 'changes'; render(); }); }],
    ['04 Review – overview with warnings', 'review-BZ-1048', 'dm'],
    ['05 Review – documents', 'review-BZ-1052', 'dm', tab('rv-BZ-1052', 'documents')],
    ['06 Review – people', 'review-BZ-1048', 'd', tab('rv-BZ-1048', 'people')],
    ['07 Review – company', 'review-BZ-1048', 'd', tab('rv-BZ-1048', 'company')],
    ['08 Review – vehicles and materials', 'review-BZ-1052', 'd', tab('rv-BZ-1052', 'site')],
    ['09 Review – signed terms', 'review-BZ-1048', 'd', tab('rv-BZ-1048', 'terms')],
    ['10 Review – history', 'review-BZ-1042', 'd', tab('rv-BZ-1042', 'history')],
    ['11 Review – all checks ticked', 'review-BZ-1059', 'd', checks],
    ['12 Approve – confirm', 'review-BZ-1059', 'dm', seq(checks, click('[data-act="approve"]')), true],
    ['13 Request changes – reason', 'review-BZ-1059', 'dm', click('[data-act="changes"]'), true],
    ['14 Reject – reason', 'review-BZ-1059', 'dm', click('[data-act="reject"]'), true],
    ['15 Request already decided', 'review-BZ-1036', 'd'],
    ['16 Waiting for contractor', 'review-BZ-1042', 'd'],
    ['17 Calendar', 'calendar', 'dm'],
    ['18 Passes', 'passes', 'dm'],
    ['19 Pass detail', 'pass-PS-3001', 'dm'],
    ['20 Revoke pass – reason', 'pass-PS-3001', 'd', click('[data-act="revokePass"]'), true],
    ['21 Issue a pass', 'issue-pass', 'dm'],
    ['22 Final inspections', 'inspections', 'dm'],
    ['23 Inspection detail', 'inspection-FI-201', 'dm'],
    ['24 Schedule inspection', 'inspection-FI-201', 'd', click('[data-act="inspSchedule"]'), true],
    ['25 Access logs', 'logs', 'dm'],
    ['26 Contractors', 'contractors', 'dm'],
    ['27 Contractor waiting for approval', 'contractor-c5', 'dm'],
    ['28 Decline contractor – reason', 'contractor-c5', 'd', click('[data-act="declineContractor"]'), true],
    ['29 Contractor detail', 'contractor-c2', 'd'],
    ['30 Suspend contractor – reason', 'contractor-c2', 'd', click('[data-act="suspend"]'), true],
    ['31 Maintenance contracts', 'amc', 'dm'],
    ['33 Properties', 'properties', 'dm'],
    ['34 Edit approval levels', 'properties', 'd', click('[data-act="propEdit"] >> nth=0'), true],
    ['35 Reports and insights', 'reports', 'dm'],
    ['36 Team and roles', 'team', 'dm'],
    ['37 Add team member – approver', 'team', 'dm', click('[data-act="teamAdd"]'), true],
    ['38 Add team member – administrator', 'team', 'd', seq(click('[data-act="teamAdd"]'), async pg => { await pg.check('input[name="tm-r"][value="admin"]'); await pg.waitForTimeout(150); }), true],
    ['39 Team member menu', 'team', 'd', menu(1), true],
    ['42 Settings – community profile', 'settings-general', 'dm'],
    ['43 Settings – access and links', 'settings-access', 'd'],
    ['44 Settings – notifications', 'settings-notify', 'd'],
    ['45 Settings – work rules', 'settings-rules', 'dm'],
    ['46 Settings – departments', 'settings-departments', 'd'],
    ['47 Settings – restricted days', 'settings-restricted', 'd'],
    ['48 Settings – permit types', 'settings-types', 'dm'],
    ['49 Permit type editor', 'ptype-fitout', 'dm'],
    ['50 Settings – terms and guidelines', 'settings-terms', 'dm'],
    ['51 Terms editor – place tick boxes', 'terms-frm1', 'd', async pg => { await pg.waitForFunction(() => !document.querySelector('.pdf-loading'), null, { timeout: 20000 }); await pg.waitForTimeout(300); }],
    ['53 Settings – payments', 'settings-payments', 'd'],
    ['54 Settings – unsaved changes', 'settings-general', 'd', fillBlank('#g-n', 'Buzzin community 2')],
    ['55 Save settings – confirm', 'settings-general', 'd', seq(fillBlank('#g-n', 'Buzzin community 2'), click('[data-act="saveForm"]')), true],
    ['56 My profile', 'profile', 'd'],
    ['57 Notifications', 'dashboard', 'd', click('[data-pop="notif"]'), true],
    ['58 Search results', 'dashboard', 'd', async pg => { await pg.click('#global-search'); await pg.keyboard.type('hvac'); await pg.waitForTimeout(200); }, true],
    ['59 Dashboard – people past their time limit', 'dashboard', 'dm', null],
    ['60 Check out by hand – confirm', 'logs', 'd', click('[data-act="checkout"] >> nth=0'), true],
    ['61 Invite a contractor', 'contractors', 'dm', click('[data-act="invite"]'), true],
    ['62 Contractors – invited', 'contractors', 'd', async pg => { await pg.evaluate(() => { ui.tab.contr = 'invited'; render(); }); }],
    ['63 Contractor – activity timeline', 'contractor-c4', 'dm'],
    ['64 Review – approval timeline (approved)', 'review-BZ-1036', 'dm'],
    ['65 Review – payment pending', 'review-BZ-1062', 'dm'],
    ['66 Record payment', 'review-BZ-1062', 'd', click('[data-act="payQuick"][data-id$=":cash"]'), true],
    ['67 Force approve – reason', 'review-BZ-1052', 'dm', click('[data-act="force"]'), true],
    ['68 Review queue – payment pending', 'queue', 'd', async pg => { await pg.evaluate(() => { ui.tab.queue = 'pay'; render(); }); }],
    ['69 Payments', 'payments', 'dm'],
    ['70 Invoice', 'payments', 'd', click('tbody tr >> nth=0'), true],
    ['71 Passes – completed', 'passes', 'd', async pg => { await pg.evaluate(() => { ui.tab.passes = 'completed'; render(); }); }],
    ['72 Passes – suspended', 'passes', 'd', async pg => { await pg.evaluate(() => { ui.tab.passes = 'suspended'; render(); }); }],
    ['73 Passes – revoked', 'passes', 'd', async pg => { await pg.evaluate(() => { ui.tab.passes = 'revoked'; render(); }); }],
    ['74 Pass – with approvals and payment', 'pass-PS-3013', 'dm'],
    ['75 Mark as completed – confirm', 'pass-PS-3001', 'd', click('[data-act="markDone"]'), true],
    ['76 Permit type – paid per trip', 'ptype-delivery', 'dm'],
    ['77 Permit type – final inspection and closure departments', 'ptype-fitout', 'd', async pg => { await pg.evaluate(() => window.scrollTo(0, 99999)); }],
    ['78 Add team member – reviewer', 'team', 'dm', seq(click('[data-act="teamAdd"]'), async pg => { await pg.check('input[name="tm-r"][value="reviewer"]'); await pg.waitForTimeout(150); }), true],
    ['79 Maintenance contracts (from approved permits)', 'amc', 'dm'],
  ],
  approver: [
    ['01 Dashboard', 'dashboard', 'dm'],
    ['01b Dashboard dark mode', 'dashboard', 'd', null, false, 'dark'],
    ['02 My queue', 'queue', 'dm'],
    ['03 Queue – waiting on others', 'queue', 'd', async pg => { await pg.evaluate(() => { ui.tab.queue = 'others'; render(); }); }],
    ['04 Queue – decided', 'queue', 'd', async pg => { await pg.evaluate(() => { ui.tab.queue = 'done'; render(); }); }],
    ['05 Review – your decision', 'review-BZ-1048', 'dm'],
    ['06 Review – documents', 'review-BZ-1048', 'd', tab('rv-BZ-1048', 'documents')],
    ['07 Review – people', 'review-BZ-1048', 'd', tab('rv-BZ-1048', 'people')],
    ['08 Review – all checks ticked', 'review-BZ-1048', 'dm', checks],
    ['09 Approve step – confirm', 'review-BZ-1048', 'dm', seq(checks, click('[data-act="approve"]')), true],
    ['10 Request changes – reason', 'review-BZ-1048', 'dm', click('[data-act="changes"]'), true],
    ['11 Reject – reason', 'review-BZ-1048', 'dm', click('[data-act="reject"]'), true],
    ['12 Review – with another step (read only)', 'review-BZ-1052', 'dm'],
    ['13 Calendar', 'calendar', 'dm'],
    ['14 Passes', 'passes', 'dm'],
    ['15 Pass detail', 'pass-PS-3001', 'd'],
    ['16 Final inspections (view only)', 'inspections', 'dm'],
    ['17 Page not available for approvers', 'settings', 'dm'],
    ['18 My profile', 'profile', 'd'],
    ['19 Notifications', 'dashboard', 'd', click('[data-pop="notif"]'), true],
    ['20 Account menu', 'dashboard', 'd', click('[data-pop="user"]'), true],
    ['21 Approve step – optional comment', 'review-BZ-1048', 'd', seq(checks, click('[data-act="approve"]')), true],
  ],
  reviewer: [
    ['01 Dashboard', 'dashboard', 'dm'],
    ['01b Dashboard dark mode', 'dashboard', 'd', null, false, 'dark'],
    ['02 Passes (view only)', 'passes', 'dm'],
    ['03 Pass detail', 'pass-PS-3001', 'dm'],
    ['04 Access logs – check out by hand', 'logs', 'dm'],
    ['05 Check out – confirm', 'logs', 'd', click('[data-act="checkout"] >> nth=0'), true],
    ['06 Calendar', 'calendar', 'dm'],
    ['07 Final inspections (view only)', 'inspections', 'd'],
    ['08 Request (view only)', 'review-BZ-1048', 'dm'],
    ['09 Issue a pass', 'issue-pass', 'dm'],
    ['10 Page not available for reviewers', 'settings', 'dm'],
    ['11 My profile', 'profile', 'd'],
  ],
  events: [
    ['01 Overview', 'dashboard', 'dm'],
    ['01b Overview dark mode', 'dashboard', 'd', null, false, 'dark'],
    ['02 Events – upcoming', 'events', 'dm'],
    ['03 Events – finished', 'events', 'd', async pg => { await pg.evaluate(() => { ui.tab.events = 'past'; render(); }); }],
    ['04 Events – drafts', 'events', 'd', async pg => { await pg.evaluate(() => { ui.tab.events = 'draft'; render(); }); }],
    ['05 Events – archived', 'events', 'd', async pg => { await pg.evaluate(() => { ui.tab.events = 'archived'; render(); }); }],
    ['06 Event – overview', 'event-e1', 'dm'],
    ['07 Event – on now', 'event-e2', 'dm'],
    ['08 Event – draft', 'event-e6', 'd'],
    ['09 Event – attendees', 'event-e1', 'dm', tab('evt-e1', 'attendees')],
    ['10 Attendee menu', 'event-e1', 'd', seq(tab('evt-e1', 'attendees'), menu(0)), true],
    ['11 Add attendee', 'event-e1', 'd', seq(tab('evt-e1', 'attendees'), click('[data-act="attAdd"]')), true],
    ['12 Event – invitations', 'event-e1', 'dm', tab('evt-e1', 'invitations')],
    ['13 Invite someone', 'event-e1', 'd', seq(tab('evt-e1', 'invitations'), click('[data-act="invAdd"]')), true],
    ['14 Import guest list', 'event-e1', 'd', seq(tab('evt-e1', 'invitations'), click('[data-act="invImport"]'), click('[data-act="csvSample"]')), true],
    ['15 Send reminders – confirm', 'event-e1', 'd', seq(tab('evt-e1', 'invitations'), click('[data-act="invRemind"]')), true],
    ['16 Event – registration form', 'event-e1', 'dm', tab('evt-e1', 'form')],
    ['17 Event – check-in (live)', 'event-e2', 'dm', tab('evt-e2', 'checkins')],
    ['18 Event – check-in (upcoming)', 'event-e1', 'd', tab('evt-e1', 'checkins')],
    ['19 Event – finished attendance', 'event-e5', 'd'],
    ['20 Archive event – confirm', 'event-e5', 'd', async pg => { await pg.evaluate(() => ACT.evArchive({ dataset: { id: 'e5' } })); await pg.waitForTimeout(150); }, true],
    ['21 Publish draft – confirm', 'event-e6', 'd', click('[data-act="evPublish"] >> nth=0'), true],
    ['22 New event', 'event-new', 'dm'],
    ['23 New event – validation errors', 'event-new', 'd', click('[data-act="evSave"][data-id="publish"]')],
    ['24 Edit event', 'edit-event-e1', 'd'],
    ['25 Attendees – all events', 'attendees', 'dm'],
    ['26 Check-in log – all events', 'checkins', 'dm'],
    ['27 Email templates – registration', 'templates', 'dm'],
    ['28 Email templates – QR code', 'templates', 'd', tab('tpl', 'qr')],
    ['29 Email templates – reminder', 'templates', 'd', tab('tpl', 'reminder')],
    ['30 Settings', 'event-settings', 'dm'],
    ['31 My profile', 'profile', 'd'],
    ['32 Notifications', 'dashboard', 'd', click('[data-pop="notif"]'), true],
  ],
};

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
      try {
        const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(r.width)); c.height = Math.max(1, Math.round(r.height));
        // Respect object-fit: contain (logos) so images are not stretched.
        let dx = 0, dy = 0, dw = c.width, dh = c.height;
        if (cs.objectFit === 'contain' && el.naturalWidth && el.naturalHeight) { const k = Math.min(c.width / el.naturalWidth, c.height / el.naturalHeight); dw = el.naturalWidth * k; dh = el.naturalHeight * k; dx = (c.width - dw) / 2; dy = (c.height - dh) / 2; }
        c.getContext('2d').drawImage(el, dx, dy, dw, dh);
        data = el.closest('.pdf-page') ? c.toDataURL('image/jpeg', 0.85) : c.toDataURL('image/png');
      } catch (e) { /* cross-origin */ }
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
  const which = process.argv[2] && FILES[process.argv[2]] ? [process.argv[2]] : Object.keys(FILES);
  const b = await chromium.launch();
  for (const ws of which) {
    const URL = 'file://' + path.resolve(__dirname, '../../dist/' + FILES[ws]);
    const OUT = path.resolve(__dirname, `../buzzin-${ws}-scenes.json`);
    const scenes = { version: 1, workspace: TITLES[ws], generated: new Date().toISOString().slice(0, 10), tokens: {}, screens: [] };
    const fail = [];
    for (const scheme of ['light', 'dark']) {
      const ctx = await b.newContext({ colorScheme: scheme, viewport: { width: 1440, height: 900 } });
      const pg = await ctx.newPage();
      await pg.goto(URL + '#dashboard'); await pg.waitForTimeout(300);
      scenes.tokens[scheme] = await pg.evaluate(tokens);
      await ctx.close();
    }
    for (const [name, route, plats, act, overlay, scheme] of STATES[ws]) {
      for (const p of plats) {
        const [w, h] = W[p];
        const ctx = await b.newContext({ colorScheme: scheme || 'light', viewport: { width: w, height: h }, deviceScaleFactor: 1 });
        const pg = await ctx.newPage();
        pg.on('pageerror', e => fail.push(`${name} ${p}: ${e.message}`));
        try {
          await pg.goto(URL + '#dashboard'); await pg.evaluate(() => { localStorage.clear(); });
          await pg.goto(URL + '?fresh=' + Date.now() + '#' + route); await pg.waitForTimeout(500);
          await pg.evaluate(() => document.fonts.ready);
          await pg.addStyleTag({ content: '.preview-pill{display:none!important}' });
          if (!overlay) { const full = await pg.evaluate(() => document.documentElement.scrollHeight); await pg.setViewportSize({ width: w, height: Math.max(h, full) }); await pg.waitForTimeout(150); }
          if (act) await act(pg);
          await pg.waitForTimeout(250);
          const root = await pg.evaluate(extractor, !!overlay);
          root.name = `${p === 'd' ? 'Desktop' : 'Mobile'} / ${name}`;
          scenes.screens.push({ platform: p === 'd' ? 'Desktop' : 'Mobile', name, root });
          if (process.argv[3]) await pg.screenshot({ path: `${process.argv[3]}/${ws}-${p}-${name.replace(/[^\w]+/g, '_')}.png` });
        } catch (e) { fail.push(`${name} ${p}: ${e.message.split('\n')[0]}`); }
        await ctx.close();
      }
    }
    fs.writeFileSync(OUT, JSON.stringify(scenes));
    console.log(ws, 'screens', scenes.screens.length, 'bytes', fs.statSync(OUT).size);
    console.log(fail.join('\n') || 'no failures');
  }
  await b.close();
})();
