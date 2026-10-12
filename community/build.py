#!/usr/bin/env python3
"""Packs the source files into standalone single-file HTML previews (works offline, double-click to open)."""
import os, sys
R = os.path.dirname(os.path.abspath(__file__))
rd = lambda *p: open(os.path.join(R, *p), encoding='utf-8').read()
LINKS = [('admin', 'Community Admin', 'buzzin-admin.html'), ('approver', 'Approver', 'buzzin-approver.html'), ('events', 'Events', 'buzzin-events.html')]
PDF = ['vendor/pdf.min.js', 'vendor/pdf.worker.min.js', 'vendor/pdf-lib.min.js', 'samples/sample-terms.js']
BUILDS = {
  'admin': dict(title='Buzzin · Community Admin', file='buzzin-admin.html', css=['base.css', 'community.css'], pdf=True,
    js=['core.js', 'terms-data.js', 'pdf-view.js', 'terms-editor.js', 'wp-data.js', 'boot.js', 'wp-review.js', 'wp-review2.js', 'wp-pages.js', 'wp-admin1.js', 'wp-admin2.js', 'wp-ws.js'],
    start="startApp(CFG_ADMIN, seedWP, validWP, WP_KEY);"),
  'approver': dict(title='Buzzin · Approver', file='buzzin-approver.html', css=['base.css', 'community.css'], pdf=False,
    js=['core.js', 'terms-data.js', 'wp-data.js', 'boot.js', 'wp-review.js', 'wp-review2.js', 'wp-pages.js', 'wp-ws.js'],
    start="startApp(CFG_APPROVER, seedWP, validWP, WP_KEY);"),
  'events': dict(title='Buzzin · Events', file='buzzin-events.html', css=['base.css', 'community.css'], pdf=False,
    js=['core.js', 'ev-data.js', 'boot.js', 'ev-pages.js', 'ev-ws.js'],
    start="startApp(CFG_EVENTS, seedEV, validEV, EV_KEY);"),
}
SKEL = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap">
<style>{css}</style>
<style>.boot{{max-width:520px;margin:15vh auto;padding:24px;display:grid;gap:8px;font:15px/1.5 system-ui,sans-serif;color:#142033;background:#fff;border:1px solid #E1E6ED;border-radius:12px}}</style>
</head>
<body>
<div id="app"><div class="boot"><b>Loading {title}…</b><span>If this message stays, open this file in Chrome, Edge or Safari. Some file previews block the scripts this design needs.</span></div></div>
<noscript><div class="boot"><b>JavaScript is turned off.</b><span>Open this file in Chrome, Edge or Safari with JavaScript on.</span></div></noscript>
<div class="toasts" id="toasts" aria-live="polite"></div>
<div class="tip" id="tip" role="tooltip"></div>
{vendor}
<script>window.BUZZIN_LINKS={links};window.__loadedAt=Date.now();</script>
<script>
{js}
{start}
</script>
</body>
</html>
"""
import json
def build(key):
    b = BUILDS[key]
    if key == 'events' and not os.path.exists(os.path.join(R, 'src', 'ev-pages.js')): return False
    css = '\n'.join(rd('src', f) for f in b['css'])
    vendor = '\n'.join('<script>\n' + rd(f) + '\n</script>' for f in PDF) if b['pdf'] else '<script>window.BUZZIN_SAMPLE_TERMS="";</script>'
    if not b['pdf']: vendor += '\n<script>' + rd('samples/sample-terms.js') + '</script>'
    js = '\n'.join(rd('src', f) for f in b['js'])
    html = SKEL.format(title=b['title'], css=css, vendor=vendor, js=js.replace('</script', '<\\/script'), start=b['start'], links=json.dumps([dict(id=i, label=l, href=h) for i, l, h in LINKS]))
    os.makedirs(os.path.join(R, 'dist'), exist_ok=True)
    open(os.path.join(R, 'dist', b['file']), 'w', encoding='utf-8').write(html)
    print('built', b['file'], round(len(html) / 1024), 'KB')
    return True
for k in (sys.argv[1:] or BUILDS): build(k)
