CODEX — منصة تعليم البرمجة واستضافة البوتات
Next.js 14 + PostgreSQL + a separate Docker-based hosting worker.
ما الذي يعمل / What works
Auth (register / login / logout, bcrypt, httpOnly JWT cookie), bans, owner role
Learning: lessons by language & level, copyable code, in-browser playground (HTML/CSS/JS), quizzes, progress tracking
Free projects library: filters, details, ZIP download (uploaded by owner) or external link, GitHub link, save projects
Bot hosting (Node.js / Python): ZIP upload, GitHub import, start/stop/restart, status, console, file manager, resource usage, encrypted secret variables, plans
Owner dashboard /admin: users (ban, role, plan, expiry), projects (+ZIP), lessons, plans, servers, stats
Search, user account page (avatar, progress, saved, servers, activity), Arabic/English, dark/light
Run locally
cp .env.example .env            # edit all secrets
docker run -d --name pg -e POSTGRES_USER=codex -e POSTGRES_PASSWORD=codex -e POSTGRES_DB=codex -p 5432:5432 postgres:16
npm install
npm run db:init && npm run db:seed   # tables + starter lessons
npm run dev                          # http://localhost:3000
Register with the email in OWNER_EMAIL → that account is the owner (see "Admin" in the navbar).
Hosting worker (required for real bot hosting)
Needs a Linux server with Docker and git installed.
cd worker && cp .env.example .env && npm install
export $(grep -v '^#' .env | xargs) && node index.js      # or use pm2 / systemd
Set WORKER_URL and WORKER_SECRET in the web app .env (same secret). Each project runs in its own container: memory/CPU/PID limits from the plan, all capabilities dropped, no-new-privileges, non-root user, only its own folder mounted. User code never runs on the web server.
Production advice: run the worker on a separate VPS from the website, firewall its port to the web server only, and put disk quotas on the worker data volume (disk size is not enforced by the code).
Deploy (VPS, everything)
cp .env.example .env && nano .env     # set DB_PASSWORD, JWT_SECRET, ENCRYPTION_KEY, OWNER_EMAIL, WORKER_*
docker compose up -d --build           # web on :3000 + PostgreSQL
docker compose exec web npm run db:seed
Put Nginx/Caddy with HTTPS in front of port 3000. Uploaded project ZIPs are stored in the webdata volume, so the web app needs a server with disk (not Vercel/GitHub Pages).
Structure
app/ pages + API routes · components/ UI · lib/ db/auth/crypto/worker client · db/ schema + seed · worker/ Docker hosting service
Not included yet
Email verification / password reset, login rate-limiting (put Cloudflare or Nginx limits in front), payments, Discord bot (removed on request).
Repo layout (5 files)
This repository holds the project packed in 5 files: README.md, unpack.js, bundle-web.json, bundle-core.json, bundle-worker.json.
Run node unpack.js to rebuild the real project in ./codex, then follow the steps above from inside that folder.
