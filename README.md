# Printable AI 3D Model Generator - Website & Nodemailer Backend

Official web portal and support backend for **Printable AI 3D model Generator for Android** (`com.techtornix.printable`).

---

## 📁 Clean & Lightweight Architecture

All form submissions are dispatched directly to **`techtornix@gmail.com`** via **Nodemailer**, with an automated confirmation sent to the user. No database setup, maintenance, or external cluster required!

```text
PrintableWebsite/
├── vercel.json           # 1-Click Vercel Deployment Configuration
├── server.js             # Local & Render HTTP Server Entry Point
├── package.json          # Node dependencies (express, cors, dotenv, nodemailer)
├── .env                  # Environment Variables (EMAIL_USER, EMAIL_PASS)
├── .env.example          # Environment Template
│
├── api/
│   └── index.js          # Vercel Serverless Function entry point
│
├── server/               # Backend Architecture
│   ├── app.js            # Express application & clean routing
│   ├── controllers/
│   │   └── contactController.js # Contact form handler & input validation
│   ├── services/
│   │   └── emailService.js      # Nodemailer service (Admin + User Confirmation)
│   └── routes/
│       └── contactRoutes.js     # API Route definitions (/api/contact, /api/health)
│
└── printable/            # Client-Side Frontend
    ├── assets/           # Real app screenshots, logos, SVGs, and feature graphics
    ├── index.html        # App Landing Page (3D Character showcase, 360° inspector, bento grid)
    ├── about.html        # About Page (Uncut mobile showcases, technical specs sheet)
    ├── contact.html      # Support & Feedback Page (Nodemailer email dispatch)
    ├── privacy.html      # 2-Column Documentation Privacy Policy with sticky sidebar
    ├── terms.html        # 2-Column Documentation Terms & Conditions with sticky sidebar
    ├── thanks.html       # Submission Confirmation Page
    ├── site-config.js    # Client-side configuration (Play store URL, etc.)
    ├── site.css          # Master stylesheet (Responsive dark theme, uncropped frames)
    └── site.js           # AJAX form submissions & mobile navbar toggle
```

---

## 🌐 Navigation Bar (Navbar)

All pages feature a unified, responsive navigation bar with active indicators, uncropped layouts, and mobile drawer support:

| Order | Tab Name | URL | Description |
| :---: | :--- | :--- | :--- |
| 1 | **Home** | `/index.html` | Hero banner, real app 3D character showcase, GLB export info |
| 2 | **About** | `/about.html` | App background, uncropped phone mockups, technical architecture |
| 3 | **Privacy Policy** | `/privacy.html` | Comprehensive privacy documentation with sticky navigation sidebar |
| 4 | **Terms & Conditions** | `/terms.html` | Terms of service, intellectual property, 3D printing disclaimers |
| 5 | **Support** *(Last)* | `/contact.html` | Direct support form sending emails to `techtornix@gmail.com` |

---

## 📧 Nodemailer Email Delivery

Whenever a user submits the Support & Feedback form:
1. **Admin Notification:** Sent directly to `techtornix@gmail.com` containing the user's name, email, app name, and full feedback message. Replying to this email sends a direct response to the user.
2. **User Confirmation:** Automated confirmation email sent to the user thanking them for contacting support.

---

## 🚀 How to Deploy

### Option A: Vercel (Recommended & 100% Free)
1. Push code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Deploy Printable Website"
   ```
2. Go to [Vercel.com](https://vercel.com) and import your GitHub repository.
3. In **Environment Variables**, add:
   - `ADMIN_EMAIL` = `techtornix@gmail.com`
   - `EMAIL_USER` = `techtornix@gmail.com`
   - `EMAIL_PASS` = `mxsk xfmf qxdo sjyu`
4. Click **Deploy**! Site is live with custom domain support.

### Option B: Render.com (100% Free)
1. Go to [Render.com](https://render.com) and create a **New Web Service**.
2. Connect your GitHub repository.
3. Build command: `npm install`, Start command: `npm start`.
4. Add the same Environment Variables and click **Deploy**.
