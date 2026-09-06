#!/usr/bin/env python3
"""
Sync Google Sheets content into static HTML files (work.html, art.html, rn.json)
so the site loads instantly with 0ms buffering and no client-side delay.

Usage:
    python3 scripts/sync_sheets.py
"""

import csv
import html
import json
import os
import re
import subprocess
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORK_HTML = os.path.join(BASE_DIR, 'work.html')
ART_HTML = os.path.join(BASE_DIR, 'art.html')
RN_JSON = os.path.join(BASE_DIR, 'rn.json')

GOOGLE_SHEET_ID = '1_cWMuByNoaVtMNV8bSlZ0D_cg0EerDHAvXv5Ly07U8A'
WORK_GID = '653353633'
ART_GID = '960020960'


def fetch_csv(gid):
    url = f'https://docs.google.com/spreadsheets/d/{GOOGLE_SHEET_ID}/export?format=csv&gid={gid}'
    try:
        res = subprocess.run(['curl', '-sL', url], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
        return res.stdout
    except Exception as e:
        print(f"Error fetching sheet gid={gid}: {e}")
        return ""


def slugify(text):
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')


def format_markdown(text):
    if not text:
        return ''
    h = html.escape(text)
    h = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', h)
    h = re.sub(r'\*(.*?)\*', r'<em>\1</em>', h)
    h = re.sub(r'\[([^\]]+)\]\((https?://[^\s\)]+)\)', r'<a href="\2" target="_blank" rel="noopener noreferrer">\1</a>', h)
    paragraphs = [p.strip() for p in re.split(r'\n\s*\n', h) if p.strip()]
    if len(paragraphs) > 1:
        return '\n'.join(f'                <p>{p.replace(chr(10), "<br />")}</p>' for p in paragraphs)
    return f'                <p>{h.replace(chr(10), "<br />")}</p>'


def parse_links(raw):
    if not raw:
        return []
    items = [s.strip() for s in re.split(r'[\n|]', raw) if s.strip()]
    links = []
    for item in items:
        multi_matches = list(re.finditer(r'([a-zA-Z0-9\s!]+):\s*(https?://[^\s]+)', item))
        if len(multi_matches) > 1:
            for m in multi_matches:
                links.append({'label': m.group(1).strip(), 'url': m.group(2).strip()})
            continue
        md_match = re.match(r'\[([^\]]+)\]\((https?://[^\s\)]+)\)', item)
        if md_match:
            links.append({'label': md_match.group(1), 'url': md_match.group(2)})
            continue
        colon_match = re.match(r'^([^:]+):\s*(https?://.+)$', item)
        if colon_match:
            links.append({'label': colon_match.group(1).strip(), 'url': colon_match.group(2).strip()})
            continue
        url_match = re.search(r'https?://[^\s]+', item)
        if url_match:
            links.append({'label': 'Open Link', 'url': url_match.group(0)})
    return links


def parse_images(raw):
    if not raw:
        return []
    return [s.strip() for s in re.split(r'[,\n]', raw) if s.strip()]


def sync_work():
    print("Fetching 'work' tab from Google Sheets...")
    csv_text = fetch_csv(WORK_GID)
    if not csv_text:
        print("Failed to fetch work CSV.")
        return

    reader = csv.reader(csv_text.splitlines())
    rows = list(reader)
    if not rows:
        print("Empty work CSV.")
        return

    projects = []
    for r in rows[1:]:
        if not any(r):
            continue
        title = r[0].strip() if len(r) > 0 else ''
        if not title:
            continue
        projects.append({
            'title': title,
            'category': r[1].strip() if len(r) > 1 else '',
            'year': r[2].strip() if len(r) > 2 else '',
            'description': r[3].strip() if len(r) > 3 else '',
            'images': parse_images(r[4].strip() if len(r) > 4 else ''),
            'links': parse_links(r[5].strip() if len(r) > 5 else ''),
            'mediaLayout': r[6].strip() if len(r) > 6 else ''
        })

    print(f"Parsed {len(projects)} work projects.")

    # Generate TOC HTML
    toc_lines = []
    for idx, p in enumerate(projects):
        num = idx + 1
        slug = slugify(p['title'])
        active = ' is-active' if idx == 0 else ''
        toc_lines.append(f'              <li><a href="#{slug}" class="toc-link{active}"><span class="toc-num">{num}.</span> <span class="toc-title">{html.escape(p["title"])}</span></a></li>')
    toc_html = '\n'.join(toc_lines)

    # Generate Project Cards Feed HTML
    cards_html = [
        '        <!-- Top Secret Work Disclaimer Banner with iMessage Invisible Ink Effect (Commented out) -->',
        '        <!--',
        '        <div class="work-disclaimer-banner" role="note" title="Hover or tap to reveal secret note">',
        '          <div class="invisible-ink-wrapper">',
        '            <p class="invisible-ink-text">',
        '              BTW a lot of my work at the <span class="rainbow-fancy"> Google Creative Lab </span> is SECRET. This is',
        '              just',
        '              the work that had the legs to go public. Enjoy! Email me if ur thinking of something specific.',
        '            </p>',
        '            <canvas class="invisible-ink-canvas"></canvas>',
        '          </div>',
        '        </div>',
        '        -->'
    ]

    for idx, p in enumerate(projects):
        num = idx + 1
        slug = slugify(p['title'])
        layout = (p['mediaLayout'] or '').lower().strip()
        if layout in ['stacked', 'stack', 'vertical']:
            grid_class = 'project-media-grid stacked'
        elif layout in ['grid', 'side by side', 'horizontal', 'grid-2']:
            grid_class = 'project-media-grid grid-2' if len(p['images']) == 2 else 'project-media-grid'
        elif len(p['images']) <= 1:
            grid_class = 'project-media-grid single-item'
        else:
            grid_class = 'project-media-grid grid-2' if len(p['images']) == 2 else 'project-media-grid'

        media_html = ''
        for img in p['images']:
            media_html += f'''                <div class="media-container">
                  <img class="project-img" src="{img}" alt="{html.escape(p['title'])}" />
                </div>\n'''
        media_html = media_html.rstrip()

        links_html = ''
        if p['links']:
            links_html = '              <div class="project-action-links">\n'
            for link in p['links']:
                links_html += f'''                <a href="{link['url']}" target="_blank" rel="noopener noreferrer" class="project-action-btn">
                  {html.escape(link['label'])} &rarr;
                </a>\n'''
            links_html += '              </div>'

        meta_pill = ''
        cat_span = f'<span class="project-category">{html.escape(p["category"])}</span>' if p['category'] else ''
        yr_span = f'<span class="project-year">{html.escape(p["year"])}</span>' if p['year'] else ''
        if cat_span or yr_span:
            meta_pill = f'''            <div class="project-meta-pill">
              {cat_span}
              {yr_span}
            </div>'''

        links_block = f'\n{links_html}' if links_html else ''

        card = f'''        <!-- {num}. {p['title']} -->
        <article class="project-card" id="{slug}">
          <div class="project-header-row">
            <h2 class="project-main-title">{html.escape(p['title'])}</h2>
{meta_pill}
          </div>
          <div class="project-body-row">
            <div class="project-info-col">
              <div class="project-description">
{format_markdown(p['description'])}
              </div>{links_block}
            </div>
            <div class="project-media-col">
              <div class="{grid_class}">
{media_html}
              </div>
            </div>
          </div>
        </article>'''
        cards_html.append(card)

    feed_html = '\n\n'.join(cards_html)

    with open(WORK_HTML, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace <ul class="toc-list">...</ul>
    content = re.sub(
        r'(<ul class="toc-list">)([\s\S]*?)(</ul>)',
        f'\\1\n{toc_html}\n            \\3',
        content
    )

    # Replace <main class="project-feed">...</main>
    content = re.sub(
        r'(<main class="project-feed">)([\s\S]*?)(</main>)',
        f'\\1\n\n{feed_html}\n\n      \\3',
        content
    )

    # Disable client-side dynamic overwrite on DOMContentLoaded
    content = re.sub(
        r'loadGoogleSheetProjects\(\);',
        '// loadGoogleSheetProjects(); // Content pre-rendered statically',
        content
    )

    with open(WORK_HTML, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Successfully updated {WORK_HTML} with {len(projects)} projects!")


if __name__ == '__main__':
    sync_work()
