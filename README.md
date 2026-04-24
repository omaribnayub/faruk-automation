# Faruk Automation React Website

Production-ready React + Vite website for Faruk Automation & Control Systems.

## 1) Install prerequisites

- Install Node.js 20 LTS (or newer): https://nodejs.org/
- Verify:
  - `node -v`
  - `npm -v`

## 2) Install dependencies

```bash
npm install
```

## 3) Run locally

```bash
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## 4) Build for production

```bash
npm run build
```

Build output will be generated in `dist/`.

## 5) Deploy options

### Vercel

1. Push this folder to GitHub.
2. Import repository in Vercel.
3. Build command: `npm run build`
4. Output directory: `dist`

### Netlify

1. Push this folder to GitHub.
2. Import repository in Netlify.
3. Build command: `npm run build`
4. Publish directory: `dist`

### Any static host

Upload the contents of `dist/` after running `npm run build`.

## 6) Content management (admin mode)

- Public site: `/`
- Admin panel: `/admin`

In admin mode you can:
- Edit all website text as JSON
- Save content to browser localStorage
- Reset to default content
- Export content as `website-content.json`

Core CMS files:
- `src/content/defaultContent.js` - default content schema
- `src/content/cmsStorage.js` - save/load/reset logic
- `src/AdminPage.jsx` - admin editor UI
