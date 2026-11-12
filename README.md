# Kizmari Luxury Villas

Public website: https://kizmariluxuryvillas.com/

Hosted on GitHub Pages from the main branch and repository root.

## Add a full-length video

1. Add a new object to `videos.json`: the 11-character YouTube `id`, exact publication `date` (YYYY-MM-DD), episode `label`, `title`, and a short `description`.
2. Run `python3 update-socials.py` from this folder.
3. Review `socials.html`, then commit `videos.json` and `socials.html` together and push to main.

The generator puts the newest video first. It renders normal HTML, so the videos and descriptions appear without client-side JavaScript. Each player uses the privacy-enhanced YouTube embed, inline playback, a strict-origin referrer policy, fullscreen support, and a direct YouTube link as a fallback. Only published full-length videos belong in this collection. Do not add Shorts or unpublished episodes.

Social links are at the top of Socials. Update them in `update-socials.py` and regenerate when a profile URL changes. Shared navigation links Socials from every page.
