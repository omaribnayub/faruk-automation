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
- Edit website sections with add/edit/delete controls
- Manage projects, services, packages, and section text
- View lead inbox from the contact form
- See dashboard cards and section activity chart

## 7) Firebase setup (recommended)

Create a `.env` file in project root:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Without Firebase variables, the app automatically falls back to browser local storage.

Core CMS files:
- `src/content/defaultContent.js` - default content schema
- `src/content/cmsStorage.js` - local fallback save/load/reset logic
- `src/content/cmsService.js` - cloud/local data service
- `src/lib/firebase.js` - Firebase bootstrap
- `src/AdminPage.jsx` - dashboard + CRUD admin UI
