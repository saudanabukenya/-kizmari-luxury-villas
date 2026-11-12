#!/usr/bin/env python3
"""Render the Socials page from videos.json using the current site header/footer."""
from datetime import date
from html import escape
from pathlib import Path
import json
import re

root = Path(__file__).resolve().parent
home = (root / 'index.html').read_text()
videos = json.loads((root / 'videos.json').read_text())
videos.sort(key=lambda item: item['date'], reverse=True)
assert len({item['id'] for item in videos}) == len(videos), 'Duplicate video ID'
for item in videos:
    assert re.fullmatch(r'[A-Za-z0-9_-]{11}', item['id']), 'Invalid YouTube ID'
    date.fromisoformat(item['date'])

icons = {
    'YouTube': '<rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor"/><path d="m10 9 6 3-6 3Z" fill="var(--paper)"/>',
    'Instagram': '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="17.4" cy="6.7" r="1" fill="currentColor"/>',
    'TikTok': '<path fill="currentColor" d="M16 2h-4v13a3 3 0 1 1-3-3V8a7 7 0 1 0 7 7V8a9 9 0 0 0 6 2V6a6 6 0 0 1-6-4Z"/>',
    'X / Twitter': '<path d="M4 3h4.5L20 21h-4.5L4 3Z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="m20 3-7 8M4 21l7-8" fill="none" stroke="currentColor" stroke-width="1.7"/>',
    'Facebook': '<path fill="currentColor" d="M14 22v-9h3l.5-4H14V7c0-1.2.4-2 2-2h2V1.5c-.4-.1-1.7-.2-3-.2-3 0-5 1.8-5 5.2V9H7v4h3v9Z"/>',
}
socials = [
    ('YouTube', 'https://www.youtube.com/@KizmariLuxuryVillas'),
    ('Instagram', 'https://www.instagram.com/kizmariluxuryvillas/'),
    ('TikTok', 'https://www.tiktok.com/@kizmariluxuryvillas'),
    ('X / Twitter', 'https://x.com/KizmariLuxury'),
    ('Facebook', 'https://www.facebook.com/profile.php?id=61577867423547'),
]
links = ''.join(
    f'<a class="{"youtube-link" if label == "YouTube" else "platform-link"}" href="{escape(url, quote=True)}" target="_blank" rel="noopener noreferrer" aria-label="Kizmari Luxury Villas on {escape(label)}"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{icons[label]}</svg><span>{label}</span></a>'
    for label, url in socials
)
entries = []
for item in videos:
    vid = item['id']
    published = date.fromisoformat(item['date'])
    date_text = f'{published.day} {published:%B %Y}'
    entries.append(f'''<article class="video-entry" id="video-{vid}" aria-labelledby="title-{vid}">
      <div class="video-player"><iframe width="1280" height="720" src="https://www.youtube-nocookie.com/embed/{vid}?rel=0&amp;playsinline=1" title="{escape(item['title'], quote=True)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>
      <div class="video-copy"><p class="eyebrow">{escape(item['label'])}</p><time datetime="{item['date']}">Published {date_text}</time><h3 id="title-{vid}">{escape(item['title'])}</h3><p>{escape(item['description'])}</p><a class="text-link" href="https://www.youtube.com/watch?v={vid}" target="_blank" rel="noopener noreferrer" aria-label="Watch {escape(item['title'], quote=True)} on YouTube">Watch on YouTube</a></div>
    </article>''')

content = f'''<main class="page-main" id="main">
  <section class="socials-intro wrap" aria-labelledby="socials-title">
    <p class="eyebrow">Kizmari · The story as it unfolds</p>
    <div class="socials-heading"><h1 id="socials-title">Follow along.<br>Feel part of <em>Kizmari.</em></h1><p>From a family dream to the details that make it ours. Watch our full episodes here, and find the everyday moments on our socials.</p></div>
    <nav class="socials-platforms" aria-label="Follow Kizmari on social media">{links}</nav>
  </section>
  <section class="episodes wrap" aria-labelledby="episodes-title">
    <div class="episodes-heading"><h2 id="episodes-title">The Kizmari films</h2><p>Full episodes · Latest first</p></div>
    {''.join(entries)}
    <aside class="arts-note" aria-labelledby="arts-title"><div><h2 id="arts-title">The art behind the spaces.</h2><p>Discover our paintings, handmade pots, and the creative side of the family on Kizmari Arts.</p></div><a class="text-link" href="https://www.youtube.com/@KizmariArts" target="_blank" rel="noopener noreferrer">Explore Kizmari Arts</a></aside>
  </section>
</main>'''

page = re.sub(r'<main\b.*?</main>', lambda _: content, home, count=1, flags=re.S)
page = page.replace('Luxury That Feels Like Home | Kizmari Luxury Villas', 'Socials &amp; Films | Kizmari Luxury Villas')
description = 'Watch full Kizmari Luxury Villas episodes, explore our family journey in Uganda, and follow us on YouTube, Instagram, TikTok, X, and Facebook.'
page = re.sub(r'(<meta (?:name="description"|property="og:description") content=")[^"]*', lambda m: m[1] + description, page)
page = page.replace('href="https://kizmariluxuryvillas.com/"', 'href="https://kizmariluxuryvillas.com/socials.html"', 1)
page = page.replace('<meta property="og:url" content="https://kizmariluxuryvillas.com/">', '<meta property="og:url" content="https://kizmariluxuryvillas.com/socials.html">')
page = page.replace('<link rel="preload" href="kizmari-villa.webp" as="image" fetchpriority="high">', '')
page = page.replace('href="index.html" aria-current="page"', 'href="index.html"')
page = page.replace('href="socials.html">Socials</a>', 'href="socials.html" aria-current="page">Socials</a>', 1)
(root / 'socials.html').write_text(page)
print(f'Rendered socials.html with {len(videos)} full-length videos.')
