# Metals — Gold & Silver Rates

A small web app that shows live **global** (LBMA) and **Indian** (MCX) gold/silver rates in USD per kg, plus **USD → INR** conversion. Refresh button fetches the latest data from the [Metals.dev](https://metals.dev) API.

## Run locally

```bash
cd app
python3 -m http.server 8080
```

Open **http://localhost:8080** in your browser.

Or open `app/index.html` directly (some browsers may block the API request due to CORS).

## Deploy to GitHub Pages

### Option 1: Deploy from `docs` folder (recommended)

The repo already includes a `docs` folder with the app. To go live:

   ```bash
   git add docs/
   git commit -m "Add app for GitHub Pages"
   git push origin main
   ```

2. On GitHub: **Settings → Pages** → Source: **Deploy from a branch** → Branch: **main** → Folder: **/docs** → Save.

3. Your site will be at `https://<username>.github.io/Metals/` (replace `Metals` with your repo name if different).

### Option 2: Deploy from `gh-pages` branch

1. Create and push a branch that contains only the app files at the root:

   ```bash
   git checkout --orphan gh-pages
   git rm -rf .  # only if you want to clear existing files
   cp app/index.html app/styles.css app/app.js .
   git add index.html styles.css app.js
   git commit -m "GitHub Pages: metals rates app"
   git push -u origin gh-pages
   ```

2. On GitHub: **Settings → Pages** → Source: **Deploy from a branch** → Branch: **gh-pages** → Folder: **/ (root)** → Save.

## API key

The app uses the Metals.dev API key in `app/app.js`. For a public GitHub Pages site, the key will be visible in the client. To avoid exposing it:

- Use a **serverless proxy** (e.g. Vercel/Netlify function) that calls the API with the key and expose only the proxy URL to the app, or
- Restrict the key in the Metals.dev dashboard to specific domains (e.g. your GitHub Pages URL) if they support it.

## CORS

If you see a CORS error when opening the app from GitHub Pages or `file://`, the API may not allow browser requests from that origin. In that case, call the API from a small backend or serverless proxy and point the app at that proxy instead of `api.metals.dev`.
