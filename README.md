# ashikur.safeshare.co

Ashik's personal website, built with Astro. Pieces for the Notebook and books for the Shelf are edited in a simple editor (Keystatic) at **ashikur.safeshare.co/keystatic**, with no code needed.

## Where things live

| What | Where |
| --- | --- |
| Notebook pieces | `src/content/notebook/` (one file per piece) |
| The shelf and "Reading now" | `src/content/shelf.json` |
| Photos | `public/img/` |
| Pages | `src/pages/` |
| All the styling | `src/styles/site.css` |
| Music and animations | `src/scripts/` |

## Editing on your own computer (optional)

1. Install Node.js 22 from nodejs.org.
2. Open a terminal in this folder and run `npm install`, then `npm run dev`.
3. Visit http://localhost:4321 for the site and http://localhost:4321/keystatic for the editor. Changes save straight into the files.

## Notes for later
- The big Bangla words (আশিক on the home page, কিশোর আলো and বিজ্ঞানচিন্তা on the Shelf page) use a trimmed copy of Anek Bangla that only contains those letters, so the page stays fast. If you change those words, ask for the font file to be regenerated.
- The star chart and the travel map live in `public/svg/` and load just before you scroll to them.
