# Photography Portfolio - Sanity CMS Studio

This is the Sanity Studio for managing the Photography Portfolio website content.

## Setup

### 1. Create a Sanity Project

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Create a new project or use an existing one
3. Note your **Project ID** and **Dataset** name (usually "production")

### 2. Configure Environment Variables

Create a `.env` file in the studio folder:

```bash
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
```

Also update the frontend `.env` file in the root folder:

```bash
VITE_SANITY_PROJECT_ID=your-project-id
VITE_SANITY_DATASET=production
```

### 3. Install Dependencies

```bash
cd studio
npm install
```

### 4. Run the Studio

```bash
npm run dev
```

The studio will be available at `http://localhost:3333`

## Content Types

### Gallery Images
- Upload and manage portfolio images
- Set categories (Landscape, Wedding, Portrait, Nature, Commercial, Events)
- Mark images as featured for homepage display
- Control display order

### Homepage
- Hero background image
- Hero text (tagline, title, subtitle)
- Button text customization
- Gallery section text

### About
- Profile image
- Biography text (multiple paragraphs)
- Statistics (years experience, projects, awards)

### Contact
- Email, phone, location
- Social media links

### Services
- Service title and description
- Icon selection
- Display order

### Site Settings
- Site name and logo
- SEO metadata
- Footer text

## Deployment

### Deploy Studio to Sanity

```bash
npm run deploy
```

This will deploy your studio to `https://your-project.sanity.studio`

### CORS Settings

Make sure to add your frontend domain to the CORS origins in your Sanity project settings:
1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. Go to API → CORS origins
4. Add your frontend URLs (localhost for development, production domain for live site)

## Security Notes

- The frontend only has read access (no write token)
- All content editing must be done through the Sanity Studio
- Never commit `.env` files with real credentials
