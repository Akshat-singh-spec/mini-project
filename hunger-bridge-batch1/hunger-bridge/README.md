# Hunger Bridge

A food donation and redistribution platform connecting **donors** (restaurants,
hotels, caterers, event organizers) with verified **NGOs**, built as a
B.Tech CSE third-year mini-project.

Stack: **React + Vite + Tailwind CSS** (frontend) · **Node.js + Express**
(backend) · **MySQL + Prisma** (database) · **JWT + bcrypt** (auth).

---

## 1. What's in this build

All 5 implementation batches are complete — this is the full MVP from the
original spec, fully runnable end-to-end.

**Foundation:**
- Complete Prisma schema for the whole app (users, profiles, donations,
  requests, notifications, status history)
- Working authentication: donor/NGO registration, login, JWT
  issuing/verification, password hashing, role-based route protection,
  session persistence across refreshes
- Public site: landing page (hero, about, how it works, benefits, food
  safety, footer), login page, registration page
- Seed script with demo Admin / Donor / Approved NGO / Pending NGO accounts

**Donation CRUD:**
- Donor: create, view ("My donations"), view full detail with status
  history, edit (while AVAILABLE), cancel (while AVAILABLE)
- NGO: browse AVAILABLE donations with search + city/category/type
  filters, view full detail including donor contact info
- All donation endpoints enforce ownership and status-based rules
  server-side, not just in the UI

**Requests workflow:**
- NGO: request a donation with an optional message, track "My requests",
  withdraw a still-pending request
- Donor: see every request on a donation, accept one (which atomically
  rejects every other pending request inside a single database
  transaction — the logic that stops two NGOs from both ending up with
  the same donation) or reject one individually
- A donation auto-reopens to AVAILABLE if every pending request on it is
  rejected or withdrawn
- Once accepted, the collecting NGO advances the donation through
  COLLECTED → DISTRIBUTED → COMPLETED

**Notifications:**
- A bell icon in the dashboard header with an unread-count badge
  (polls every 20 seconds)
- Dropdown list, newest first, unread ones highlighted; clicking one
  marks it read and deep-links to the related donation
- "Mark all read," all scoped so a user only ever touches their own
  notifications

**Admin:**
- Dashboard with platform-wide stats (user/donor/NGO counts, donation
  counts by status, total requests, completed donations)
- NGO verification queue — approve or reject (with an optional note),
  filterable by status; approving/rejecting fires a notification to that
  NGO and is what actually unlocks the request workflow for a pending
  account
- Full user listing, filterable by role
- Full donation listing across every donor, filterable by status

The whole donor → NGO → admin loop described in the original spec is
wired up: a donor lists food, an NGO requests it, the donor accepts, the
NGO collects/distributes/completes it, and an admin can see and moderate
all of it.

---

## 2. Prerequisites

- Node.js 18+ and npm
- A running MySQL server (local install, or MySQL via XAMPP/WAMP/Docker —
  any MySQL 8.x instance works)

---

## 3. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Open `.env` and set `DATABASE_URL` to your MySQL connection string, e.g.:

```
DATABASE_URL="mysql://root:yourpassword@localhost:3306/hunger_bridge"
```

Create the database, generate the Prisma client, and run migrations:

```bash
npm run prisma:migrate
npm run seed
npm run dev
```

`npm run prisma:migrate` will also create the database if it doesn't exist
yet, as long as the MySQL user in `DATABASE_URL` has permission to do so.
The API runs at `http://localhost:5000`.

### Demo accounts (created by the seed script)

All demo accounts use the password: **`Password123!`**

| Role         | Email                          | Notes                        |
|--------------|---------------------------------|-------------------------------|
| Admin        | admin@hungerbridge.com          | Full platform access          |
| Donor        | donor@hungerbridge.com          | Has 2 sample donations        |
| NGO (approved) | ngo.approved@hungerbridge.com | `verificationStatus: APPROVED`|
| NGO (pending)  | ngo.pending@hungerbridge.com  | `verificationStatus: PENDING` |

---

## 4. Frontend setup

In a second terminal:

```bash
cd client
npm install
npm run dev
```

The app runs at **http://localhost:5173**. The Vite dev server proxies any
request to `/api/*` through to the backend at `http://localhost:5000`, so
no CORS configuration is needed in development beyond what's already in
`server/src/app.js`.

---

## 5. Verifying it works

1. Start MySQL, then the backend (`npm run dev` in `server/`), then the
   frontend (`npm run dev` in `client/`).
2. Visit `http://localhost:5173` — you should see the landing page.
3. Click **Get started**, register as a donor or NGO, and you'll land on
   your role's dashboard.
4. As a donor: click **List a donation**, fill out the form, submit — it
   appears on your dashboard and you can open it, edit it, or cancel it.
5. As an NGO: click **Browse donations**, search/filter, open a listing to
   see its full detail and donor contact info.
6. Log in as the **approved** NGO demo account (`ngo.approved@hungerbridge.com`),
   open one of the seeded donations, and submit a request with a message.
7. Log back in as the **donor** (`donor@hungerbridge.com`) — the bell icon
   in the header shows an unread badge. Open the dropdown, click the "New
   request" notification, and you'll land on the donation with the
   incoming request — **Accept** it.
8. Log back in as the NGO — the bell shows a new "Request accepted"
   notification, and the request now shows **ACCEPTED** with a **Mark
   collected** button on the donation detail page. Click through
   collected → distributed → completed to walk the full lifecycle.
9. Try requesting a donation while logged in as the **pending** NGO demo
   account (`ngo.pending@hungerbridge.com`) — it's blocked until an admin
   approves the account.
10. Log in as the **admin** (`admin@hungerbridge.com`), open **NGO
    verification**, and approve the pending NGO. Log back in as that NGO
    — it can now submit requests, and it got a notification confirming
    the approval.
11. From the admin dashboard, check **All donations** and **Users** to
    see the platform-wide listings.
12. Refresh the page at any point — you should stay logged in (session
    persistence via the stored JWT).
13. Try visiting `/admin/dashboard` while logged in as a donor — you'll be
    redirected to your own dashboard instead (role-based access control).

---

## 6. Project structure

```
hunger-bridge/
├── client/                  React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── components/      Reusable UI (Button, Input, Navbar, DonationForm, NotificationBell, ...)
│   │   ├── context/         AuthContext (session state, login/register/logout)
│   │   ├── layouts/         PublicLayout, DashboardLayout
│   │   ├── pages/           public/ auth/ donor/ ngo/ admin/ (AdminDashboard, AdminNgos, AdminUsers, AdminDonations)
│   │   ├── services/        api.js, authService.js, donationService.js, requestService.js, notificationService.js, adminService.js
│   │   └── utils/           roleRouting.js, donationOptions.js, dateFormat.js
│   └── ...
├── server/                  Express + Prisma backend
│   ├── prisma/
│   │   ├── schema.prisma    Full data model for the whole app
│   │   └── seed.js          Demo accounts + sample donations
│   └── src/
│       ├── config/          Prisma client singleton
│       ├── controllers/     authController.js, donationController.js, requestController.js, notificationController.js, adminController.js
│       ├── middleware/      auth.js (JWT + RBAC), errorHandler.js
│       ├── routes/          authRoutes.js, donationRoutes.js, requestRoutes.js, notificationRoutes.js, adminRoutes.js
│       ├── utils/           jwt.js, sanitizeUser.js
│       ├── validators/      authValidators.js, donationValidators.js, requestValidators.js
│       ├── app.js
│       └── server.js
└── README.md
```

---

## 7. Deliberately out of scope for this MVP

Per the original project brief, these were intentionally left out to keep
the mini-project focused — all are reasonable "future work" talking
points for a viva/demo:

- Email/SMS notifications (in-app notifications only)
- Image upload (donations take an optional external image URL, not a
  file upload)
- Payment gateways, maps/geolocation, Docker, microservices, Redis,
  WebSockets — explicitly excluded by the original brief
- Pagination on list endpoints (fine at demo data volumes; would matter
  at real scale)
- Automated tests (not requested in scope, but `server/` is structured
  so controllers are easy to unit-test against a seeded test database)

---

## 8. Troubleshooting

- **`Can't reach database server`** — confirm MySQL is running and
  `DATABASE_URL` in `server/.env` is correct.
- **`Unknown database 'hunger_bridge'`** — Prisma migrate creates it
  automatically only if the MySQL user has `CREATE DATABASE` privileges;
  otherwise create the empty database manually first.
- **CORS errors in the browser console** — make sure `CLIENT_ORIGIN` in
  `server/.env` matches the URL the frontend is actually running on.
- **401 errors right after login** — check that `JWT_SECRET` is set in
  `server/.env`; the server won't sign tokens without it.
