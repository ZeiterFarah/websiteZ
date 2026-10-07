# zeiterfarah.com

Personal site: plain HTML, CSS and a little vanilla JS. No framework and no build step. The repo root is the deployable site.

This repo is public. Never commit a home address, phone number, the original resume file, keys or private notes.

## Preview locally

From the repo root:

```
python -m http.server 8000
```

Open <http://localhost:8000>. (Use `python3` on macOS or Linux.)

## Layout

| Path | What it is |
| --- | --- |
| `index.html`, `gallery.html`, `about.html`, `background.html`, `contact.html` | Top-level pages |
| `projects/` | Project overview (`index.html`) and one page per project |
| `css/styles.css` | All styling. Colors, fonts and spacing are CSS variables at the top of the file |
| `js/main.js` | Nav toggle, gallery lightbox and email assembly only |
| `assets/img/` | Images. `placeholder.svg` stands in until real photos are added |
| `assets/favicon/` | Favicon |
| `CNAME`, `.nojekyll` | GitHub Pages custom domain and "serve as-is" marker |

All paths are relative, so the site works from any folder or host. Pages inside `projects/` use `../` to reach shared files.

## Editing content

- Search for `TODO:` to find every placeholder. Replace the text, and swap `assets/img/placeholder.svg` for a real image.
- Images: use WebP or JPEG, keep them to a sensible width (about 1600px at most), keep `width` and `height` attributes, and write meaningful `alt` text. Do not use photos showing children's faces or names.
- The header and footer are duplicated on every page with identical markup, so a find-and-replace updates them all. The nav link for the current page carries `aria-current="page"`.
- **Colors, fonts, spacing:** edit the variables in `:root` at the top of `css/styles.css`. Dark mode variants are in the `prefers-color-scheme` block right below.
- **Tagline:** three options are in the plan; Option 1 is live. The alternatives are in a comment in `index.html`.
- **Email:** the address is assembled in `js/main.js`. In the HTML it appears only as readable fallback text (`zeiter [dot] farah [at] gmail [dot] com`) inside an element with `data-email`. Do not paste a plain `mailto:` link into the HTML.
- **Evolve Additive Solutions:** the whole block is `<section id="evolve">` in `background.html`. Delete that element to remove it.
- **Patents:** a simple `<ol class="patents">` in `background.html`. Each `<li>` has empty `data-number` and `data-url` attributes for adding numbers or links later.

### Add a project

1. Copy any file in `projects/` (for example `tumbler.html`) to a new name such as `projects/my-project.html`.
2. Edit the title, description, text and images in the new file.
3. Copy one `<li class="card">` block in `projects/index.html` (and in `index.html` if it should be featured), then point it at the new page.
4. Add the new URL to `sitemap.xml`.

### Add photos and stories (originals workflow)

1. Put full-size photos and a `story.md` (copy `originals/story-template.md`) in the matching topic folder under `originals/`. That folder is gitignored and never published.
2. Make web copies with location data stripped: `python tools/process_images.py originals/<topic> assets/img/projects/<topic>` (needs `pip install pillow`; convert HEIC phone photos to JPEG first).
3. Wire the new files into the page with real `alt` text and the printed width/height, then review and commit.

### Add gallery photos

In `gallery.html`, each photo is one `<li><button type="button" data-lightbox><img ...></button></li>`. Copy one, change `src` and `alt`. For a larger version in the lightbox, add `data-full="assets/img/gallery/big.jpg"` to the `<button>`.

## Deploy: GitHub Pages with the domain staying at GoDaddy (Path B)

The domain stays registered at GoDaddy. Only the DNS records for the site change. Checked against GitHub's custom domain docs on 2026-10-06; re-check the IP addresses and menu names when you do it.

1. **Turn on Pages.** Repo **Settings > Pages**, deploy from the `main` branch, `/ (root)` folder.
2. **Test on the free address** (`https://zeiterfarah.github.io/websiteZ/`). Check every page, link and image before touching DNS. This works because all paths are relative.
3. **Back up** the old site's photos from GoDaddy, and **screenshot your current GoDaddy DNS records** so you can restore them.
4. **Edit only these records** in GoDaddy DNS. Leave all `MX`, `TXT` and other records alone (email, verification).
   - Replace the two existing `A` records for `@` with GitHub's four: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   - Change the `www` `CNAME` to point to `zeiterfarah.github.io`.
5. In **Settings > Pages**, enter the custom domain `zeiterfarah.com` and save. Wait for the DNS check to pass, then tick **Enforce HTTPS** (can take up to 24 hours to become available).
6. Confirm both `https://zeiterfarah.com` and `https://www.zeiterfarah.com` load the new site over HTTPS.

GitHub recommends verifying the custom domain in your account settings before adding it, to avoid domain takeover. Do not use wildcard DNS records.

**Rollback:** put the original two `A` records and the `www` `CNAME` back. Keep the Website Builder subscription until the new site has run for a few days.

**Keeping the repo yours:** turn on two-factor authentication, add no collaborators unless you mean to, protect `main` (branch protection or rulesets), and turn off Issues if you don't want public discussion. If you ever delete the repo, remove the DNS records pointing at GitHub first.

## Fallback: Path A (GoDaddy Web Hosting, cPanel)

If you would rather stay entirely on GoDaddy, buy a GoDaddy Web Hosting (cPanel) plan and upload the site files into `public_html/` through File Manager or FTP. The same files work unchanged. Do not upload `README.md`, `CNAME`, `.nojekyll`, `CLAUDE.md`, `tools/`, `originals/`, `.git*` or `TODO.md`.
