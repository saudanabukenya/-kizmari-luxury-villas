# Kizmari Luxury Villas

Public website: https://kizmariluxuryvillas.com/

Hosted on GitHub Pages from the main branch and repository root.

## Add a full-length video

1. Add a new object to `videos.json`: the 11-character YouTube `id`, exact publication `date` (YYYY-MM-DD), episode `label`, `title`, and a short `description`.
2. Run `python3 update-socials.py` from this folder.
3. Review `socials.html`, then commit `videos.json` and `socials.html` together and push to main.

The generator puts the newest video first. It renders normal HTML, so the videos and descriptions appear without client-side JavaScript. Each player uses the privacy-enhanced YouTube embed, inline playback, a strict-origin referrer policy, fullscreen support, and a direct YouTube link as a fallback. Only published full-length videos belong in this collection. Do not add Shorts or unpublished episodes.

Social links are at the top of Socials. Update them in `update-socials.py` and regenerate when a profile URL changes. Shared navigation links Socials from every page.

## Christmas digital book page

`christmas-book.html` is the dedicated Kizmari Afro-Bohemian book sales page. Its presentation and interaction files are `christmas-book.css` and `christmas-book.js`. Preview images in `book-assets/` are selected pages from the approved 63-page edition. The paid PDF itself is delivered only through Selar and must not be added to the public repository.

All purchase buttons link to https://selar.com/9ux3vr1331?currency=USD. The agreed USD price is 14. Update the visible prices and Book offer metadata together if it changes. No physical book is included. The presentation mockups do not represent a shipped product.

The page supports reduced motion, keyboard chapter navigation, native FAQ controls, and an enlarged preview dialog. There is no analytics or visitor data collection added by this page.

Brand correction: the book page uses the approved gold palm-tree Kizmari wordmark with white Afro Bohemian and Art & Interiors lettering, from the 20 November approved reference. The original artwork is preserved. Sales copy focuses on the design collection and the digital PDF format.
