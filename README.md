# LensCraft Photography Portfolio

A modern, full-stack photography portfolio built with **Next.js**, **TypeScript**, and **Tailwind CSS**. Features a public-facing portfolio site with luxurious animations and a fully-featured admin CMS for managing gallery images, services, and all site content — backed by a PostgreSQL database, Vercel Blob storage, and JWT-secured authentication.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)

## 🖥️ Screenshots

### Portfolio Site

![Portfolio Site — Hero](public/screenshots/main-site-hero.png)

### Admin Dashboard

![Admin Dashboard](public/screenshots/admin-dashboard.png)

## ✨ Features

### Portfolio Site
- **Luxurious Animations** - Smooth entrance and transition effects powered by Framer Motion
- **Responsive Design** - Fully mobile and desktop friendly
- **Dark/Light Mode** - System preference detection with manual toggle
- **Dynamic Gallery** - Masonry grid populated from the database with category filtering and hover effects
- **Services Section** - Animated service cards managed via the admin CMS
- **Contact Form** - Email delivery via Resend with form validation and submission feedback
- **About Section** - Photographer bio with editable statistics

### Admin CMS (`/admin`)
- **JWT Authentication** - Secure login with httpOnly session cookies and middleware-enforced route protection
- **Gallery Manager** - Upload photos to Vercel Blob, edit alt text and category, mark images as featured, delete images; supports drag-and-drop uploads
- **Content Editor** - Edit all portfolio text (hero, gallery, about, contact, site settings) section by section without touching code
- **Services Manager** - Add, edit, reorder, and delete services shown on the portfolio
- **Overview Dashboard** - At-a-glance stats for gallery images, services, and content fields with quick-action links

## 🖼️ Sections

- **Hero** - Full-screen intro with editable tagline, title, and CTA buttons
- **Gallery** - Database-driven masonry grid with image hover effects
- **Services** - Animated service cards sourced from the database
- **About** - Photographer bio with editable statistics
- **Contact** - Contact form (powered by Resend) with info cards
- **Footer** - Social links and branding

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A [Neon](https://neon.tech) or Vercel Postgres database
- A [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) store (for image uploads)
- A [Resend](https://resend.com) API key (for the contact form)

### Installation

```bash
# Clone the repository
git clone https://github.com/mrglasswillbreak/photographyPortfolio.git

# Navigate to project
cd photographyPortfolio

# Install dependencies
npm install

# Copy the example env file and fill in your values
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env.local` and set the following:

| Variable | Description |
|----------|-------------|
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD` | Admin login password |
| `JWT_SECRET` | Secret used to sign session tokens (`openssl rand -base64 32`) |
| `DATABASE_URL` | Neon / Vercel Postgres connection string |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob read/write token |
| `RESEND_API_KEY` | Resend API key for contact form emails |
| `CONTACT_EMAIL` | Email address that receives contact form submissions |
| `FROM_EMAIL` | Sender address used in outgoing emails |

### Database Initialization

After deploying (or on first run), visit `/api/seed` once to create the database tables and seed initial data.

### Build for Production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 | Full-stack React framework (App Router) |
| React 19 | UI Framework |
| TypeScript | Type Safety |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animations |
| Lucide React | Icons |
| Neon / Vercel Postgres | Database |
| Vercel Blob | Image storage |
| Resend | Transactional email |
| jose | JWT session management |
| next-themes | Dark/light mode |

## 📁 Project Structure

```
app/
├── admin/
│   ├── login/          # Admin login page
│   └── dashboard/
│       ├── gallery/    # Gallery manager (upload, edit, delete images)
│       ├── content/    # Site content editor (all text fields)
│       └── services/   # Services manager
├── api/
│   ├── auth/           # Login & logout endpoints
│   ├── gallery/        # Gallery CRUD API
│   ├── services/       # Services CRUD API
│   ├── content/        # Content CRUD API
│   ├── upload/         # Vercel Blob upload endpoint
│   ├── contact/        # Contact form → Resend email
│   └── seed/           # One-time database seeding
├── globals.css
├── layout.tsx
└── page.tsx            # Main portfolio page
components/
├── layout/             # Layout, Navbar
├── sections/           # Hero, Gallery, Services, About, Contact, Footer
└── ui/                 # ThemeToggle
lib/
├── auth.ts             # JWT helpers & credential check
├── db.ts               # Database client & queries
└── types.ts            # Shared TypeScript types
middleware.ts           # Route protection for /admin/dashboard
```

## 🎨 Customization

### Managing Content

All portfolio text, gallery images, and services can be managed from the admin dashboard at `/admin`. No code changes needed.

### Changing Colors

Tailwind CSS classes are used throughout. Modify the neutral color palette or add custom colors in your CSS.

### Animation Timing

Adjust animation variants in `utils/` for different easing and duration.

## 📄 License

MIT License - feel free to use for personal or commercial projects.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
