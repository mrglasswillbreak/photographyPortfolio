# LensCraft Photography Portfolio

A modern, elegant photography portfolio website built with React, TypeScript, and Tailwind CSS. Features luxurious animations, responsive design, and dark/light mode support.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)

## ✨ Features

- **Luxurious Animations** - Smooth fade in/out effects powered by Framer Motion
- **Responsive Design** - Fully mobile and desktop friendly
- **Dark/Light Mode** - System preference detection with manual toggle
- **Masonry Gallery** - Beautiful image grid with hover effects
- **Contact Form** - Form validation and submission feedback
- **Modern Stack** - React 18, TypeScript, Tailwind CSS v4, Vite

## 🖼️ Sections

- **Hero** - Full-screen intro with parallax background
- **Gallery** - Masonry grid with image hover effects
- **Services** - Animated service cards
- **About** - Photographer bio with statistics
- **Contact** - Contact form with info cards
- **Footer** - Social links and branding

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/mrglasswillbreak/photographyPortfolio.git

# Navigate to project
cd photographyPortfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Tailwind CSS v4 | Styling |
| Vite | Build Tool |
| Framer Motion | Animations |
| Lucide React | Icons |

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/       # Layout, Navbar
│   ├── sections/     # Hero, Gallery, Services, About, Contact, Footer
│   └── ui/           # ThemeToggle
├── context/          # ThemeContext
├── data/             # Gallery images, services data
├── utils/            # Animation variants
├── App.tsx           # Main app component
└── main.tsx          # Entry point
```

## 🎨 Customization

### Adding Images

Edit `src/data/index.ts` to add your own gallery images:

```typescript
export const galleryImages = [
  {
    id: 1,
    src: 'your-image-url.jpg',
    alt: 'Image description',
    category: 'Category',
  },
  // ...
];
```

### Changing Colors

Tailwind CSS classes are used throughout. Modify the neutral color palette or add custom colors in your CSS.

### Animation Timing

Adjust animation variants in `src/utils/animations.ts` for different easing and duration.

## 📄 License

MIT License - feel free to use for personal or commercial projects.

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
