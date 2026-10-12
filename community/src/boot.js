/* App shell, routing and shared interactions (all three files). */

/* ================= Shell ================= */
const ROWMENU = {};   // type -> (id) => [{icon,label,act,id,go,danger,sep}]
function sidebarHtml(r) {
  const items = WS.nav.map(g => {
    const rows = g.items.filter(i => !i.show || i.show()).map(i => {
      const on = i.match ? i.match.test(r) : r === i.go;
      const n = i.badge ? i.badge() : 0;
      return `<button class="nav-item ${on ? 'active' : ''}" data-go="${i.go}" ${on ? 'aria-current="page"' : ''}>${ic(i.icon)}<span>${i.label}</span>${n ? `<span class="count">${n}</span>` : ''}</button>`;
    }).join('');
    return rows ? `${g.group ? `<div class="side-label">${g.group}</div>` : ''}${rows}` : '';
  }).join('');
  const c = S.community || {};
  return `<div class="side-head">${logoTile(c.logo, c.name, 'brand')}<div class="ws-label">${WS.title}<span class="role-pill">${WS.roleLabel}</span></div></div>
    ${WS.scopeCard ? WS.scopeCard() : ''}
    <nav class="side-nav" aria-label="Main">${items}</nav>
    <div class="side-foot">${WS.sideExtra ? WS.sideExtra() : ''}<div class="side-user"><span class="avatar">${initials(WS.userName())}</span><div><b>${esc(WS.userName())}</b>${esc(WS.userSub())}</div></div></div>`;
}
function topbar() {
  const nots = (S.notifications || []).filter(n => !WS.notifFilter || WS.notifFilter(n));
  const unread = nots.filter(n => n.unread).length;
  const themeIcon = (ui.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark' ? 'sun' : 'moon';
  const q = ui.search.global || '';
  const results = ui.pop === 'search' ? WS.search(q) : [];
  return `<header class="topbar">
    ${btn('', { icon: 'menu', v: 'ghost', act: 'openDrawer', title: 'Open menu', cls: 'menu-toggle' })}
    <div class="top-search pop-anchor">${ic('search')}<input class="input" id="global-search" data-gsearch placeholder="${esc(WS.searchPh)}" value="${esc(q)}" autocomplete="off" aria-label="Search">${q ? '' : '<span class="kbd">/</span>'}
      ${ui.pop === 'search' ? `<div class="popover" role="listbox">${results.length ? `<div class="pop-list">${results.map(x => `<button class="pop-item" data-go="${x.go}">${ic(x.icon)}<span class="grow">${esc(x.title)}<small>${esc(x.sub)}</small></span></button>`).join('')}</div>` : `<div class="pop-empty">${q ? `Nothing found for “${esc(q)}”` : 'Type to search'}</div>`}</div>` : ''}</div>
    <span class="spacer"></span>
    <span class="role-chip hide-sm">${WS.roleLabel}</span>
    ${btn('', { icon: themeIcon, v: 'ghost', act: 'toggleTheme', title: 'Switch light or dark theme', cls: 'hide-sm' })}
    <div class="pop-anchor">
      <button class="btn btn-ghost btn-icon bell" data-pop="notif" aria-label="Notifications${unread ? `, ${unread} unread` : ''}">${ic('bell')}${unread ? '<span class="dot"></span>' : ''}</button>
      ${ui.pop === 'notif' ? `<div class="popover right wide"><div class="pop-head"><h3>Notifications</h3>${unread ? btn('Mark all as read', { v: 'link', act: 'readAll', cls: 'xs' }) : ''}</div><div class="pop-list">${nots.length ? nots.map(n => `<button class="notif ${n.unread ? 'unread' : ''}" data-act="openNotif" data-id="${n.id}"><span class="u"></span><span class="stack-sm" style="gap:2px"><b class="small">${esc(n.title)}</b><p class="muted">${esc(n.body)}</p><span class="xs faint">${esc(n.when)}</span></span></button>`).join('') : '<div class="pop-empty">You’re all caught up</div>'}</div></div>` : ''}
    </div>
    <div class="pop-anchor">
      <button class="btn btn-ghost" style="padding:0 6px;gap:8px" data-pop="user" aria-label="Account menu"><span class="avatar">${initials(WS.userName())}</span><span class="hide-sm small" style="font-weight:600">${esc(WS.userName())}</span>${ic('down', 'hide-sm')}</button>
      ${ui.pop === 'user' ? `<div class="popover right" style="min-width:250px"><div class="pop-head" style="display:grid;gap:0"><b>${esc(WS.userName())}</b><span class="xs faint">${esc(WS.userSub())}</span></div><div class="pop-sep"></div>
        ${WS.accountItems ? WS.accountItems() : ''}
        <button class="pop-item" data-act="toggleTheme">${ic(themeIcon)}<span class="grow">Switch theme</span></button>
        <div class="pop-sep"></div><button class="pop-item danger" data-act="signOut">${ic('logout')}<span class="grow">Sign out</span></button></div>` : ''}
    </div>
  </header>`;
}
function bottomNav(r) {
  return `<nav class="bottom-nav" aria-label="Main" style="grid-template-columns:repeat(${WS.bottom.length + 1},1fr)">${WS.bottom.map(([k, l, i, match]) => { const on = (match || new RegExp('^' + k + '$')).test(r); return `<button class="${on ? 'active' : ''}" data-go="${k}">${ic(i)}${l}</button>`; }).join('')}<button data-act="openDrawer">${ic('menu')}More</button></nav>`;
}
function previewPill() {
  const links = (window.BUZZIN_LINKS || []).map(l => l.id === WS.id ? `<b>${l.label}</b>` : `<a href="${l.href}">${l.label}</a>`).join(' · ');
  return links ? `<div class="preview-pill" role="note">Design preview · ${links}</div>` : '';
}

/* ================= Render ================= */
function notFoundPage(r) {
  return `<div style="max-width:560px;margin:48px auto 0;width:100%">${card('', `<div class="stack" style="justify-items:center;text-align:center"><span class="success-ic" style="background:var(--surface-3);color:var(--text-3)">${ic('lock')}</span><h1>This page isn’t available for your role</h1><p class="muted">${WS.noAccessText || 'Your role does not include this page.'}</p></div>`, { foot: btn('Back to ' + WS.homeLabel, { v: 'primary', go: WS.home, icon: 'arrowL' }) })}</div>`;
}
function render() {
  const r = route();
  const a = document.activeElement;
  const focusId = a && a.id && a !== document.body ? a.id : null;
  const sel = focusId && a.selectionStart != null ? [a.selectionStart, a.selectionEnd] : null;
  const scrollEl = document.getElementById('main');
  ui.hasDecision = false;
  let body;
  try { body = pageFor(r); } catch (e) { console.error(e); body = alertBox('bad', 'This page could not be shown', esc(e.message)); }
  if (body == null) body = notFoundPage(r);
  document.getElementById('app').innerHTML = `<div class="app ${WS.theme} ${ui.hasDecision ? 'has-decision' : ''}">
    <aside class="sidebar"><div class="side-inner">${sidebarHtml(r)}</div></aside>
    <div class="main">${topbar()}<main class="content ${WS.wide ? 'wide' : ''}" id="main" tabindex="-1">${body}</main>${bottomNav(r)}</div>
  </div>${rowMenuLayer()}${renderModal()}${previewPill()}`;
  document.title = (WS.titleFor ? WS.titleFor(r) : '') + (WS.titleFor ? ' · ' : '') + WS.docTitle;
  if (focusId) {
    const el = document.getElementById(focusId);
    if (el) { el.focus({ preventScroll: true }); if (sel && el.setSelectionRange) try { el.setSelectionRange(sel[0], sel[1]); } catch (e) { /* date inputs */ } }
  }
  if (ui.pop && ui.pop.startsWith('combo:')) { const q = document.getElementById(ui.pop.slice(6) + '-q'); if (q && !focusId) q.focus(); }
  if (ui.modal && !document.querySelector('.overlay').contains(document.activeElement)) { const f = document.querySelector('.overlay .modal-body textarea, .overlay .modal-body input:not([disabled]), .overlay .modal-body select, .overlay button'); if (f) f.focus({ preventScroll: true }); }
  if (WS.afterRender) WS.afterRender(r);
}
function rowMenuLayer() {
  if (!ui.pop || !ui.pop.startsWith('row:') || !ui.popRect) return '';
  const [, type, ...idp] = ui.pop.split(':'), id = idp.join(':');
  const items = ROWMENU[type] ? ROWMENU[type](id) : [];
  if (!items.length) return '';
  const r = ui.popRect, below = r.bottom + 40 + items.length * 38 < innerHeight;
  return `<div class="pop-anchor" style="position:fixed;z-index:70;${below ? `top:${r.bottom + 4}px` : `bottom:${innerHeight - r.top + 4}px`};right:${Math.max(8, innerWidth - r.right)}px"><div class="popover right" style="position:static;min-width:220px" role="menu">${items.map(i => i.sep ? '<div class="pop-sep"></div>' : `<button class="pop-item ${i.danger ? 'danger' : ''}" ${i.go ? `data-go="${i.go}"` : `data-act="${i.act}" data-id="${esc(i.id)}"`}>${ic(i.icon)}<span class="grow">${i.label}</span></button>`).join('')}</div></div>`;
}
const rowBtn = (type, id, title) => btn('', { v: 'ghost', sm: true, icon: 'more', act: 'rowMenu', id: `${type}:${id}`, title: title || 'Actions' });

/* ================= Shared actions ================= */
Object.assign(ACT, {
  closeModal() { ui.modal = null; render(); },
  openDrawer() { ui.pop = null; ui.modal = { type: 'drawer', data: {} }; render(); },
  toggleTheme() { const now = ui.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); ui.theme = now === 'dark' ? 'light' : 'dark'; try { localStorage.setItem('buzzin-theme', ui.theme); } catch (e) { /* ignore */ } applyTheme(); ui.pop = null; render(); },
  confirmOk() { const m = ui.modal; ui.modal = null; m.onConfirm(m.data); render(); },
  confirmAlt() { const m = ui.modal; ui.modal = null; m.alt.fn(); render(); },
  readAll() { (S.notifications || []).forEach(n => { n.unread = false; }); persist(); render(); },
  openNotif(t) { const n = S.notifications.find(x => x.id === t.dataset.id); n.unread = false; persist(); ui.pop = null; go(n.go); },
  signOut() { openConfirm({ title: 'Sign out?', message: 'You will need your email and password to sign in again.', confirmText: 'Sign out', icon: 'logout', tone: 'warn', onConfirm: () => toast('Signed out. This preview keeps you on the page.') }); },
  tab(t) { const [g, k] = t.dataset.id.split(':'); ui.tab[g] = k; render(); },
  how(t) { const h = HOW[t.dataset.id]; ui.modal = { type: 'how', data: h || { title: 'About this chart', text: '' } }; render(); },
  rowMenu(t, e) { e.stopPropagation(); const k = 'row:' + t.dataset.id; if (ui.pop === k) ui.pop = null; else { ui.pop = k; ui.popRect = t.getBoundingClientRect(); } render(); },
  focus(t) { const el = document.getElementById(t.dataset.id); if (el) { el.scrollIntoView({ block: 'center' }); el.focus({ preventScroll: true }); } },
  copy(t) { const v = t.dataset.id; const ok = () => toast(`Copied ${v}`); try { navigator.clipboard.writeText(v).then(ok, () => toast('Copy not available here. Select the text instead.', { err: true })); } catch (e) { toast('Copy not available here. Select the text instead.', { err: true }); } },
  demo(t) { toast(`${t.dataset.id} (preview)`); },
});
Object.assign(CHANGE, {
  chartView(el) { ui.chartView[el.dataset.id] = el.value; render(); },
});
MODALS.drawer = () => `<div class="overlay drawer-overlay" data-overlay style="place-items:stretch start"><div class="drawer left sidebar ${WS.theme}" role="dialog" aria-modal="true" aria-label="Menu" style="position:static;height:100%"><div class="side-inner">${sidebarHtml(route())}</div></div></div>`;

/* ================= Events ================= */
const tipEl = () => document.getElementById('tip');
document.addEventListener('mouseover', e => { const t = e.target.closest('[data-tip]'); const tp = tipEl(); if (!tp) return; if (!t) { tp.classList.remove('on'); return; } tp.textContent = t.dataset.tip; tp.classList.add('on'); posTip(e.clientX, e.clientY); });
document.addEventListener('mousemove', e => { const tp = tipEl(); if (tp && tp.classList.contains('on')) posTip(e.clientX, e.clientY); });
document.addEventListener('focusin', e => { const t = e.target.closest && e.target.closest('[data-tip]'); const tp = tipEl(); if (!tp || !t) return; tp.textContent = t.dataset.tip; tp.classList.add('on'); const r = t.getBoundingClientRect(); posTip(r.left + r.width / 2, r.top); });
document.addEventListener('focusout', () => { const tp = tipEl(); if (tp) tp.classList.remove('on'); });
function posTip(x, y) { const tp = tipEl(); const w = tp.offsetWidth, h = tp.offsetHeight; tp.style.left = Math.min(innerWidth - w - 8, Math.max(8, x + 14)) + 'px'; tp.style.top = Math.min(innerHeight - h - 8, Math.max(8, y - h - 10 < 8 ? y + 16 : y - h - 10)) + 'px'; }

document.addEventListener('click', e => {
  const overlay = e.target.closest('[data-overlay]');
  if (overlay && e.target === overlay) { ui.modal = null; render(); return; }
  const t = e.target.closest('[data-act],[data-go],[data-pop]');
  if (ui.pop && !e.target.closest('.pop-anchor') && !(t && t.dataset.act === 'rowMenu')) { ui.pop = null; if (!t) { render(); return; } }
  if (!t) return;
  if (t.tagName === 'LABEL' || (t.closest('label') && !t.dataset.act)) return;
  if (t.dataset.go) { e.preventDefault(); ui.pop = null; ui.modal = null; go(t.dataset.go); return; }
  if (t.dataset.pop) { e.preventDefault(); const k = t.dataset.pop; ui.pop = ui.pop === k ? null : k; ui.q = {}; render(); return; }
  if (t.dataset.act === 'comboPick') {
    e.preventDefault();
    const o = COMBOS[t.dataset.id], v = t.dataset.v, cur = getB(o.bind);
    if (Array.isArray(cur)) setB(o.bind, cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v]);
    else { setB(o.bind, v); ui.pop = null; }
    afterBind(o.bind); render(); return;
  }
  if (t.dataset.act === 'comboRemove') { e.preventDefault(); const o = COMBOS[t.dataset.id]; setB(o.bind, getB(o.bind).filter(x => x !== t.dataset.v)); afterBind(o.bind); render(); return; }
  if (t.dataset.act && ACT[t.dataset.act]) { e.preventDefault(); ACT[t.dataset.act](t, e); }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (ui.modal) { ui.modal = null; render(); } else if (ui.pop) { ui.pop = null; render(); } }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="combobox"]')) { e.preventDefault(); e.target.click(); }
  if (e.key === 'Enter' && e.target.matches('.col, .hb.link, .kpi')) e.target.click();
  if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) && !e.target.isContentEditable) { e.preventDefault(); ui.pop = 'search'; render(); const s = document.getElementById('global-search'); if (s) s.focus(); }
});
document.addEventListener('focusin', e => { if (e.target.id === 'global-search' && ui.pop !== 'search') { ui.pop = 'search'; render(); } });
function afterBind(b) { if (b.startsWith('s.')) persist(); else if (b.startsWith('f.')) { ui.dirty = true; const sb = document.getElementById('savebar'); if (sb) sb.hidden = false; } }
document.addEventListener('input', e => {
  const el = e.target;
  if (el.dataset.q) { ui.q[el.dataset.q] = el.value; const o = COMBOS[el.dataset.q]; const list = document.getElementById(el.dataset.q + '-list'); if (o && list) list.innerHTML = comboList(o); return; }
  if (el.dataset.gsearch !== undefined) { ui.search.global = el.value; ui.pop = 'search'; render(); return; }
  if (el.dataset.search) { ui.search[el.dataset.search] = el.value; render(); return; }
  if (el.dataset.reasonreq !== undefined) { ui.modal.data.reason = el.value; const ok = document.getElementById('m-ok'); if (ok) ok.disabled = confirmBlocked(ui.modal); return; }
  if (el.dataset.bind && !['checkbox', 'radio', 'file'].includes(el.type) && el.tagName !== 'SELECT') {
    setB(el.dataset.bind, el.value); afterBind(el.dataset.bind);
    if (el.dataset.require !== undefined) { const ok = document.getElementById('m-ok'); if (ok) ok.disabled = confirmBlocked(ui.modal); }
    if (el.dataset.live && ACT[el.dataset.live]) ACT[el.dataset.live](el);
  }
});
document.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset.change && CHANGE[el.dataset.change]) { CHANGE[el.dataset.change](el); return; }
  if (el.dataset.filter) { ui.filters[el.dataset.filter] = el.value; render(); return; }
  if (el.dataset.file && typeof handleFile === 'function') { handleFile(el.dataset.file, el.files[0]); el.value = ''; return; }
  if (el.dataset.bind) {
    if (el.type === 'checkbox') setB(el.dataset.bind, el.checked);
    else if (el.type === 'radio') { if (el.checked) setB(el.dataset.bind, el.value); }
    else setB(el.dataset.bind, el.value);
    if (el.dataset.reset) { const base = el.dataset.bind.split('.').slice(0, -1).join('.'); el.dataset.reset.split(',').forEach(k => setB(base + '.' + k, '')); }
    afterBind(el.dataset.bind);
    if (el.hasAttribute('data-rerender')) render();
  }
});

/* ================= Start-up ================= */
let currentRoute = '';
let bypass = false;
window.addEventListener('hashchange', () => {
  if (bypass) return;
  const next = route();
  if (ui.dirty && next !== currentRoute) {
    bypass = true; history.replaceState(null, '', '#' + currentRoute); bypass = false;
    openConfirm({ title: 'Leave without saving?', message: 'You have unsaved changes on this page. They will be lost.', confirmText: 'Leave page', tone: 'danger', cancelText: 'Stay on page', onConfirm: () => { ui.dirty = false; ui.form = null; location.hash = next; } });
    return;
  }
  currentRoute = next; closeAll(); ui.form = ui.formTab === next ? ui.form : null; window.scrollTo(0, 0); render();
  const main = document.getElementById('main'); if (main && !next.startsWith('settings')) main.focus({ preventScroll: true });
});
window.addEventListener('beforeunload', e => { if (ui.dirty) { e.preventDefault(); e.returnValue = ''; } });
window.addEventListener('scroll', () => { if (ui.pop && ui.pop.startsWith('row:')) { ui.pop = null; render(); } }, { passive: true });
function startApp(config, seedFn, validFn, key) {
  WS = config; STORE_KEY = key;
  try { S = JSON.parse(localStorage.getItem(key)); } catch (e) { S = null; }
  if (!validFn(S)) { S = null; S = seedFn(); }
  try { if (!localStorage.getItem(key)) persist(); } catch (e) { /* storage blocked: preview still works */ }
  currentRoute = route();
  try { render(); }
  catch (err) {
    console.error('Preview start-up failed, resetting sample data', err);
    try { localStorage.removeItem(key); } catch (e) { /* storage blocked */ }
    S = null; S = seedFn(); ui.modal = null; ui.pop = null;
    try { render(); toast('Sample data was reset because the saved preview data could not be read.'); }
    catch (err2) { document.getElementById('app').innerHTML = `<div class="boot"><b>The preview could not start.</b><span>${esc(err2.message)}</span><span>Open this file in Chrome, Edge or Safari.</span></div>`; }
  }
}
