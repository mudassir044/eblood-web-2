# Eblood Web (React + Tailwind CSS v4 + Framer Motion)

## Run it
1. Install Node.js 20 or newer from https://nodejs.org (click the LTS button, run the installer).
2. Open Terminal and go into this folder: `cd ~/Desktop/Eblood/eblood-web`
3. Install packages (one time only): `npm install`
4. Start the site: `npm run dev`, then open the http://localhost:5173 link it prints.
5. Build for hosting: `npm run build`. Upload the `dist` folder to your host (Vercel, Netlify, cPanel).
   The site has real page addresses like `/blog/who-can-donate-blood`. The included `vercel.json`, `public/_redirects` (Netlify) and `public/.htaccess` (cPanel) make those addresses work after a page refresh.

## Where things live
- `src/data/content.js`: all copy, stats, links, partners, stories. Edit text here.
- `src/innovations/`: Emergency Mode, Compatibility Constellation, Readiness Check, Ambient layer and Access Dock.
- `src/components/`: page sections, header, footer, carousel, shared UI pieces.
- `public/images/`: app screenshots and partner logos.
- `src/data/posts.js`: blog posts. To add a post, copy one block, change the `slug` (the web address), title, date and body. Newest post goes first.
- `src/pages/Blog.jsx`: the blog list page and the article page.

## Before launch
- Put the real Play Store URL in `LINKS.playStore` (`src/data/content.js`).
- Have a native speaker review the Urdu text in `src/innovations/EmergencyMode.jsx`.
- Have a medical advisor confirm the eligibility rules in `src/innovations/ReadinessCheck.jsx` and review the starter blog posts in `src/data/posts.js`.
