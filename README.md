# Souhardya Karmakar — Portfolio

A responsive, game-inspired portfolio for web development work, skills, education, and interactive website concepts. The site is built as a static project and can be hosted directly with GitHub Pages.

## What’s here

- **Portfolio home** — profile, skills, education, project and certificate navigation, a live local clock, and an interactive section menu.
- **Project archive** — selected concepts with local preview artwork and links to the working demos.
- **Certificate archive** — ready for certificates that are approved for public sharing; no placeholder or unverified achievements are shown.
- **French Cat concept** — a separate visual concept page. It is not a live security product or service.
- **12 demo websites** — self-contained interface concepts in `demo_websites/`, including search, editorial, storefront, productivity, learning, and security-themed demos.
- **Accessible motion and layout** — responsive layouts, keyboard navigation, focus styles, and reduced-motion support.

## Tech stack

- HTML5
- CSS3 (responsive layouts, animation, and visual effects)
- Vanilla JavaScript
- SVG, PNG, JPG, and MP4 assets
- No framework, package manager, build step, backend, or external database

## Run locally

Use a local web server so relative assets and browser storage behave as they do on a hosted site.

1. Open this folder in VS Code.
2. Start the project root with the **Live Server** extension, or run:

   ```sh
   python -m http.server 8000
   ```

3. Visit `http://localhost:8000`.

The site does not require `npm install` or a build command.

## Publish with GitHub Pages

1. Push the project files to the repository’s default branch.
2. In **Settings → Pages**, choose **Deploy from a branch**, select the default branch and the repository root (`/`), then save.
3. Wait for the Pages deployment to finish and open the URL GitHub provides.
4. Test the home, project archive, certificate archive, French Cat concept, and several demo pages on the deployed URL.

Internal site links and asset references use relative paths, so the portfolio also works when hosted from a GitHub project subpath. Google Fonts load from Google. `404.html` is the custom not-found page; `video-preview.html` is the short intro linked from the home page.

## Updating the portfolio

- **Profile and skills:** edit `PROFILE_CONFIG` near the top of `script.js`. Keep personal details limited to information you want public.
- **Projects:** edit `projectEntries` in `collections.js`. Use paths relative to the project root; local assets must stay within the site. Project links may be local paths or HTTPS URLs.
- **Project images:** use the provided SVG artwork in `demo_websites/shared/art/`, or add approved images under `assets/projects/`. The project cards generate descriptive alternative text from each title.
- **Certificates:** add only certificates you have permission to publish. Put PDFs in `assets/certificates/` and add a complete entry to `certificateEntries` in `collections.js`; verification links must use HTTPS.
- **Terms:** replace `Terms&Conditions.pdf` only with the final document you intend to publish.
- **Demo websites:** each demo has its own `index.html`; shared motion and demo-profile behavior live in `demo_websites/shared/`.

## Privacy and security

- This is a public static site: anything committed to the repository, including media and PDFs, can be downloaded by visitors. Do not commit credentials, private documents, or files you do not want public.
- `.gitignore` excludes environment files, dependencies, and common build output. Never put secrets in frontend JavaScript or HTML.
- Demo profiles use only an optional display name held in memory for the current page. No demo asks visitors for a password, email, or payment details, and profile information is not persisted or sent.
- Demo commerce, finance, mail, and security interfaces are fictional concepts. They do not process payments, send messages, provide financial advice, or scan devices.
- Browser-based consent is a site interaction, not legal advice or a substitute for a privacy policy. Review the terms and data practices before publishing.
- GitHub Pages serves static files and does not configure every security response header. Review the hosting configuration before connecting a custom domain or adding data collection.

## File map

| Path | Purpose |
| --- | --- |
| `index.html`, `style.css`, `script.js` | Main portfolio |
| `projects.html`, `certificates.html`, `collections.js` | Project and certificate archives |
| `consent*.js`, `consent.css` | Session consent interface |
| `assets/` | Portfolio artwork and video |
| `frenchcat/` | French Cat concept page and assets |
| `demo_websites/` | Demo hub, 12 concepts, shared code, and SVG artwork |
| `404.html` | GitHub Pages not-found page |
| `video-preview.html` | Full-screen portfolio introduction |

