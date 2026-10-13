#!/usr/bin/env python3
"""Assembles the Buzzin Work Permit app into the Android assets folder (and web/dist for browser testing).
Sources: web/ (sign-in page, session, fonts), ../redesign (contractor portal), ../community/src (community workspace)."""
import os, re, shutil, json
R = os.path.dirname(os.path.abspath(__file__))
P = lambda *a: os.path.join(R, *a)
rd = lambda *a: open(P(*a), encoding='utf-8').read()
OUTS = [P('android', 'app', 'src', 'main', 'assets', 'www')]
FONT_LINK = '<link rel="stylesheet" href="../fonts/fonts.css">'

def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, 'w', encoding='utf-8').write(text)

def contractor(out):
    src = P('..', 'redesign'); dst = os.path.join(out, 'contractor')
    for d in ('vendor', 'samples'): shutil.copytree(os.path.join(src, d), os.path.join(dst, d), dirs_exist_ok=True)
    shutil.copy(os.path.join(src, 'styles.css'), dst)
    html = open(os.path.join(src, 'index.html'), encoding='utf-8').read()
    html = re.sub(r'<link rel="preconnect"[^>]*>\s*', '', html)
    html = re.sub(r'<link rel="stylesheet" href="https://fonts.googleapis[^>]*>', FONT_LINK, html)
    html = html.replace('<title>Buzzin Contractor Portal</title>', '<title>Buzzin Work Permit</title>')
    html = html.replace('<script src="vendor/pdf.min.js">', '<script src="../session.js"></script>\n<script>BuzzinSession.require("contractor")</script>\n<script src="vendor/pdf.min.js">', 1)
    app = open(os.path.join(src, 'app.js'), encoding='utf-8').read()
    old = "onConfirm: () => toast('Signed out. This preview keeps you on the page.')"
    assert old in app, 'contractor signOut hook not found'
    app = app.replace(old, "onConfirm: () => { BuzzinSession.clear(); location.href = '../index.html'; }")
    hook = "const closeAll = () => { ui.pop = null; ui.modal = null; };"
    assert hook in app, 'contractor closeAll hook not found'
    app = app.replace(hook, hook + "\nwindow.__androidBack = () => { if (ui.modal || ui.pop || ui.drawer) { ui.modal = null; ui.pop = null; ui.drawer = false; render(); return true; } return false; };")
    write(os.path.join(dst, 'index.html'), html); write(os.path.join(dst, 'app.js'), app)

def community(out):
    c = lambda *a: open(P('..', 'community', *a), encoding='utf-8').read()
    css = c('src', 'base.css') + '\n' + c('src', 'community.css')
    js_files = ['core.js', 'terms-data.js', 'pdf-view.js', 'terms-editor.js', 'wp-data.js', 'boot.js', 'wp-review.js', 'wp-review2.js', 'wp-pages.js', 'wp-admin1.js', 'wp-admin2.js', 'wp-ws.js']
    js = '\n'.join(c('src', f) for f in js_files)
    vendor = '\n'.join('<script>\n' + c(f) + '\n</script>' for f in ['vendor/pdf.min.js', 'vendor/pdf.worker.min.js', 'vendor/pdf-lib.min.js', 'samples/sample-terms.js'])
    start = """
ACT.signOut = () => openConfirm({ title: 'Sign out?', message: 'You will need your email and password to sign in again.', confirmText: 'Sign out', icon: 'logout', tone: 'warn', onConfirm: () => { BuzzinSession.clear(); location.href = '../index.html'; } });
window.__androidBack = () => { if (ui.modal || ui.pop) { ui.modal = null; ui.pop = null; render(); return true; } return false; };
const SES = BuzzinSession.require('community');
if (SES) { const cfg = SES.role === 'admin' ? CFG_ADMIN : CFG_APPROVER; cfg.userId = SES.userId; cfg.docTitle = 'Buzzin Work Permit'; startApp(cfg, seedWP, validWP, WP_KEY); }
"""
    html = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#13203A"><title>Buzzin Work Permit</title>
{FONT_LINK}
<style>{css}</style>
<style>.boot{{max-width:520px;margin:15vh auto;padding:24px;display:grid;gap:8px;font:15px/1.5 system-ui,sans-serif;color:#142033;background:#fff;border:1px solid #E1E6ED;border-radius:12px}}</style>
</head><body>
<div id="app"><div class="boot"><b>Loading Buzzin Work Permit…</b></div></div>
<div class="toasts" id="toasts" aria-live="polite"></div><div class="tip" id="tip" role="tooltip"></div>
<script src="../session.js"></script>
{vendor}
<script>window.BUZZIN_LINKS=[];window.__loadedAt=Date.now();</script>
<script>
{js.replace('</script', '<\\/script')}
{start}
</script></body></html>
"""
    write(os.path.join(out, 'community', 'index.html'), html)

for out in OUTS:
    if os.path.exists(out): shutil.rmtree(out)
    os.makedirs(out)
    shutil.copy(P('web', 'index.html'), out); shutil.copy(P('web', 'session.js'), out)
    shutil.copytree(P('web', 'fonts'), os.path.join(out, 'fonts'))
    contractor(out); community(out)
    print('built', out, sum(os.path.getsize(os.path.join(d, f)) for d, _, fs in os.walk(out) for f in fs) // 1024, 'KB')
