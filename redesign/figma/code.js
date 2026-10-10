// Buzzin redesign importer: builds editable Figma frames, text and vector icons
// from buzzin-redesign-scenes.json (captured from redesign/index.html).
figma.showUI(__html__, { width: 360, height: 400 });

const STYLE_BY_WEIGHT = { 100: 'Thin', 200: 'ExtraLight', 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black' };
const fonts = new Map();
const fontKey = n => `${n.font}|${n.weight}|${n.italic ? 1 : 0}`;

async function loadFont(n) {
  const key = fontKey(n);
  if (fonts.has(key)) return;
  const base = STYLE_BY_WEIGHT[Math.min(900, Math.max(100, Math.round(n.weight / 100) * 100))] || 'Regular';
  const style = n.italic ? (base === 'Regular' ? 'Italic' : base + ' Italic') : base;
  const spaced = style.replace('SemiBold', 'Semi Bold').replace('ExtraBold', 'Extra Bold').replace('ExtraLight', 'Extra Light');
  const tries = [{ family: n.font, style }, { family: n.font, style: spaced }, { family: 'Inter', style: spaced }, { family: 'Inter', style: 'Regular' }];
  for (const f of tries) {
    try { await figma.loadFontAsync(f); fonts.set(key, f); return; } catch (e) { /* try next */ }
  }
}
function collectText(n, out) {
  if (n.t === 'text') out.push(n);
  (n.children || []).forEach(c => collectText(c, out));
  return out;
}
const solid = c => ({ type: 'SOLID', color: { r: c.r, g: c.g, b: c.b }, opacity: c.a == null ? 1 : c.a });
const clamp = v => Math.max(0.01, v || 0);

function build(n, parent) {
  let node;
  if (n.t === 'text') {
    node = figma.createText();
    node.fontName = fonts.get(fontKey(n));
    node.characters = n.text;
    node.fontSize = n.size;
    node.lineHeight = { unit: 'PIXELS', value: n.lh };
    if (n.ls) node.letterSpacing = { unit: 'PIXELS', value: n.ls };
    node.fills = [solid(n.color)];
    if (n.case === 'UPPER') node.textCase = 'UPPER';
    if (n.underline) node.textDecoration = 'UNDERLINE';
    if (n.align === 'center') node.textAlignHorizontal = 'CENTER';
    else if (n.align === 'right' || n.align === 'end') node.textAlignHorizontal = 'RIGHT';
    if (n.multi) { node.resize(clamp(n.w), clamp(n.h)); node.textAutoResize = 'HEIGHT'; }
    else node.textAutoResize = 'WIDTH_AND_HEIGHT';
  } else if (n.t === 'svg') {
    try { node = figma.createNodeFromSvg(n.svg); node.name = n.name || 'Icon'; node.fills = []; }
    catch (e) { node = figma.createRectangle(); node.resize(clamp(n.w), clamp(n.h)); node.name = 'Icon'; }
  } else {
    node = figma.createFrame();
    node.name = n.name || 'Frame';
    node.resize(clamp(n.w), clamp(n.h));
    node.fills = n.fill ? [solid(n.fill)] : [];
    node.clipsContent = !!n.clip;
    if (n.stroke) {
      node.strokes = [solid(n.stroke)];
      node.strokeAlign = 'INSIDE';
      const [t, r, b, l] = n.sw;
      if (t === r && r === b && b === l) node.strokeWeight = t;
      else { node.strokeTopWeight = t; node.strokeRightWeight = r; node.strokeBottomWeight = b; node.strokeLeftWeight = l; }
      if (n.dash) node.dashPattern = [5, 4];
    }
    if (n.radius) {
      const [tl, tr, br, bl] = n.radius;
      if (tl === tr && tr === br && br === bl) node.cornerRadius = tl;
      else { node.topLeftRadius = tl; node.topRightRadius = tr; node.bottomRightRadius = br; node.bottomLeftRadius = bl; }
    }
    if (n.shadows) {
      node.effects = n.shadows.map(s => ({ type: s.inset ? 'INNER_SHADOW' : 'DROP_SHADOW', color: { r: s.color.r, g: s.color.g, b: s.color.b, a: s.color.a }, offset: { x: s.x, y: s.y }, radius: s.blur, spread: s.spread, visible: true, blendMode: 'NORMAL' }));
    }
    if (n.opacity != null) node.opacity = n.opacity;
    (n.children || []).forEach(c => build(c, node));
  }
  parent.appendChild(node);
  node.x = n.x || 0;
  node.y = n.y || 0;
  return node;
}

function parseColor(v) {
  v = (v || '').trim();
  let m = v.match(/^#([0-9a-f]{6})$/i);
  if (m) { const x = parseInt(m[1], 16); return { r: (x >> 16 & 255) / 255, g: (x >> 8 & 255) / 255, b: (x & 255) / 255, a: 1 }; }
  m = v.match(/^rgba?\(([^)]+)\)/);
  if (m) { const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number); return { r: p[0] / 255, g: p[1] / 255, b: p[2] / 255, a: p.length > 3 ? p[3] : 1 }; }
  return null;
}

async function makeStyles(tokens, section) {
  const existing = new Map((await figma.getLocalPaintStylesAsync()).map(s => [s.name, s]));
  let col = 0;
  for (const scheme of ['light', 'dark']) {
    const board = figma.createFrame();
    board.name = `Colours / ${scheme === 'light' ? 'Light' : 'Dark'}`;
    board.resize(760, 40 + Math.ceil(tokens[scheme].length / 4) * 92);
    board.fills = [solid(scheme === 'light' ? { r: 1, g: 1, b: 1, a: 1 } : { r: .05, g: .08, b: .12, a: 1 })];
    board.cornerRadius = 12;
    section.appendChild(board);
    board.x = 40 + col * 820; board.y = 80;
    let i = 0;
    for (const [name, value] of tokens[scheme]) {
      const c = parseColor(value);
      if (!c) continue;
      const styleName = `Buzzin/${scheme === 'light' ? 'Light' : 'Dark'}/${name}`;
      const style = existing.get(styleName) || figma.createPaintStyle();
      style.name = styleName;
      style.paints = [solid(c)];
      const sw = figma.createRectangle();
      sw.resize(160, 48); sw.cornerRadius = 8;
      sw.strokes = [solid({ r: .5, g: .55, b: .62, a: .3 })];
      board.appendChild(sw);
      sw.x = 24 + (i % 4) * 180; sw.y = 24 + Math.floor(i / 4) * 92;
      await sw.setFillStyleIdAsync(style.id);
      const label = figma.createText();
      label.fontName = { family: 'Inter', style: 'Regular' };
      label.characters = `${name}  ${value}`;
      label.fontSize = 11;
      label.fills = [solid(scheme === 'light' ? { r: .3, g: .36, b: .45, a: 1 } : { r: .7, g: .75, b: .8, a: 1 })];
      board.appendChild(label);
      label.x = sw.x; label.y = sw.y + 54;
      i++;
    }
    col++;
  }
}

function makeSection(name, x, y) {
  let s;
  try { s = figma.createSection(); s.name = name; }
  catch (e) { s = figma.createFrame(); s.name = name; s.fills = []; }
  figma.currentPage.appendChild(s);
  s.x = x; s.y = y;
  return s;
}
function fitSection(s, w, h) {
  if (s.type === 'SECTION') s.resizeWithoutConstraints(w, h); else s.resize(w, h);
}
const tick = () => new Promise(r => setTimeout(r, 0));

figma.ui.onmessage = async msg => {
  if (msg.type !== 'import') return;
  try {
    const { scenes, opts } = msg;
    const screens = scenes.screens.filter(s => (s.platform === 'Desktop' && opts.desktop) || (s.platform === 'Mobile' && opts.mobile));
    const texts = [];
    screens.forEach(s => collectText(s.root, texts));
    const seen = new Set();
    for (const t of texts) { const k = fontKey(t); if (!seen.has(k)) { seen.add(k); await loadFont(t); } }
    await loadFont({ font: 'Inter', weight: 400 });

    const created = [];
    const start = figma.viewport.bounds;
    let originX = Math.round(start.x + start.width + 400), y = Math.round(start.y);
    const groups = [['Desktop', 4, 160], ['Mobile', 8, 120]];
    let done = 0;
    for (const [platform, perRow, gap] of groups) {
      const list = screens.filter(s => s.platform === platform);
      if (!list.length) continue;
      const section = makeSection(`Buzzin redesign – ${platform}`, originX, y);
      created.push(section);
      let x = 80, rowY = 120, rowH = 0, maxW = 0;
      for (let i = 0; i < list.length; i++) {
        const s = list[i];
        if (i && i % perRow === 0) { x = 80; rowY += rowH + gap; rowH = 0; }
        const root = Object.assign({}, s.root, { x: 0, y: 0, name: `${platform} / ${s.name}` });
        const frame = build(root, section);
        frame.x = x; frame.y = rowY;
        x += root.w + gap; rowH = Math.max(rowH, root.h); maxW = Math.max(maxW, x);
        done++;
        figma.ui.postMessage({ type: 'progress', text: `Building ${platform.toLowerCase()} · ${s.name}`, done, total: screens.length });
        await tick();
      }
      fitSection(section, maxW + 80 - gap, rowY + rowH + 120);
      y += rowY + rowH + 400;
    }
    if (opts.styles && scenes.tokens) {
      const section = makeSection('Buzzin redesign – Colour styles', originX, y);
      await makeStyles(scenes.tokens, section);
      fitSection(section, 1680, 120 + Math.ceil(scenes.tokens.light.length / 4) * 92 + 80);
      created.push(section);
    }
    figma.viewport.scrollAndZoomIntoView(created);
    const msgText = `Done. Imported ${screens.length} screens${opts.styles ? ' and colour styles' : ''}.`;
    figma.ui.postMessage({ type: 'done', text: msgText });
    figma.notify(msgText);
  } catch (e) {
    figma.ui.postMessage({ type: 'error', text: 'Import stopped: ' + (e && e.message ? e.message : e) });
  }
};
