import { NextResponse } from 'next/server';
import { sql, initializeDatabase } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

const INITIAL_CONTENT = [
  { section: 'hero', key: 'tagline', value: 'Professional Photography' },
  { section: 'hero', key: 'title', value: "Capturing Life's" },
  { section: 'hero', key: 'title_highlight', value: 'Beautiful Moments' },
  { section: 'hero', key: 'subtitle', value: 'Transforming fleeting moments into timeless memories through the art of photography' },
  { section: 'hero', key: 'primary_button', value: 'View Gallery' },
  { section: 'hero', key: 'secondary_button', value: 'Get in Touch' },
  { section: 'gallery', key: 'title', value: 'Selected Works' },
  { section: 'gallery', key: 'subtitle', value: 'A curated collection of my finest photographs, showcasing the beauty in every frame' },
  { section: 'about', key: 'section_title', value: 'The Story Behind the Lens' },
  { section: 'about', key: 'bio_1', value: "With over a decade of experience in photography, I've dedicated my life to capturing the extraordinary in the ordinary. My journey began with a simple film camera and has evolved into a passion for visual storytelling." },
  { section: 'about', key: 'bio_2', value: "I believe every photograph tells a story – a moment frozen in time, waiting to be remembered. Whether it's the tender glance between newlyweds or the majestic beauty of a mountain sunrise, I strive to capture the emotion and essence of every scene." },
  { section: 'about', key: 'bio_3', value: "My work has been featured in numerous publications and exhibitions worldwide. But my greatest reward is seeing the joy on my clients' faces when they relive their precious moments through my images." },
  { section: 'about', key: 'stat_1_number', value: '10+' },
  { section: 'about', key: 'stat_1_label', value: 'Years Experience' },
  { section: 'about', key: 'stat_2_number', value: '500+' },
  { section: 'about', key: 'stat_2_label', value: 'Projects Completed' },
  { section: 'about', key: 'stat_3_number', value: '50+' },
  { section: 'about', key: 'stat_3_label', value: 'Awards Won' },
  { section: 'contact', key: 'section_title', value: "Let's Connect" },
  { section: 'contact', key: 'section_subtitle', value: "Have a project in mind? I'd love to hear from you. Let's create something beautiful together." },
  { section: 'contact', key: 'email', value: 'hello@lenscraft.com' },
  { section: 'contact', key: 'phone', value: '+1 (555) 123-4567' },
  { section: 'contact', key: 'location', value: 'New York, NY' },
  { section: 'site', key: 'name', value: 'LensCraft' },
  { section: 'site', key: 'footer_text', value: 'LensCraft. All rights reserved.' },
];

const INITIAL_GALLERY = [
  { title: 'Mountain landscape at sunset', alt: 'Mountain landscape at sunset', category: 'Landscape', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', featured: true, display_order: 1 },
  { title: 'Wedding couple portrait', alt: 'Wedding couple portrait', category: 'Wedding', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80', featured: true, display_order: 2 },
  { title: 'Professional portrait', alt: 'Professional portrait', category: 'Portrait', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80', featured: false, display_order: 3 },
  { title: 'Forest nature scene', alt: 'Forest nature scene', category: 'Nature', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80', featured: false, display_order: 4 },
  { title: 'Wedding ceremony', alt: 'Wedding ceremony', category: 'Wedding', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', featured: false, display_order: 5 },
  { title: 'Portrait in natural light', alt: 'Portrait in natural light', category: 'Portrait', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', featured: false, display_order: 6 },
  { title: 'Foggy mountains', alt: 'Foggy mountains', category: 'Landscape', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80', featured: false, display_order: 7 },
  { title: 'Wildflowers in meadow', alt: 'Wildflowers in meadow', category: 'Nature', url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&q=80', featured: false, display_order: 8 },
  { title: 'Wedding details', alt: 'Wedding details', category: 'Wedding', url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80', featured: false, display_order: 9 },
  { title: 'Fashion portrait', alt: 'Fashion portrait', category: 'Portrait', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80', featured: false, display_order: 10 },
  { title: 'Lake reflection', alt: 'Lake reflection', category: 'Landscape', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80', featured: false, display_order: 11 },
  { title: 'Sunlit forest path', alt: 'Sunlit forest path', category: 'Nature', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', featured: false, display_order: 12 },
];

const INITIAL_SERVICES = [
  { title: 'Wedding Photography', description: 'Capturing your special day with timeless elegance and authentic emotion.', icon: 'Heart', display_order: 1 },
  { title: 'Portrait Sessions', description: 'Professional portraits that reveal your unique personality and style.', icon: 'User', display_order: 2 },
  { title: 'Landscape & Nature', description: 'Fine art prints showcasing the beauty of natural landscapes.', icon: 'Mountain', display_order: 3 },
  { title: 'Commercial Work', description: 'High-quality imagery for brands, products, and marketing campaigns.', icon: 'Camera', display_order: 4 },
];

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initializeDatabase();

    // Seed content
    for (const { section, key, value } of INITIAL_CONTENT) {
      await sql`
        INSERT INTO site_content (section, key, value)
        VALUES (${section}, ${key}, ${value})
        ON CONFLICT (section, key) DO NOTHING
      `;
    }

    // Seed gallery (only if empty)
    const galleryCount = await sql`SELECT COUNT(*) FROM gallery_images`;
    if (Number(galleryCount.rows[0].count) === 0) {
      for (const img of INITIAL_GALLERY) {
        await sql`
          INSERT INTO gallery_images (title, alt, category, url, featured, display_order)
          VALUES (${img.title}, ${img.alt}, ${img.category}, ${img.url}, ${img.featured}, ${img.display_order})
        `;
      }
    }

    // Seed services (only if empty)
    const servicesCount = await sql`SELECT COUNT(*) FROM services`;
    if (Number(servicesCount.rows[0].count) === 0) {
      for (const svc of INITIAL_SERVICES) {
        await sql`
          INSERT INTO services (title, description, icon, display_order)
          VALUES (${svc.title}, ${svc.description}, ${svc.icon}, ${svc.display_order})
        `;
      }
    }

    return NextResponse.json({ success: true, message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initializeDatabase();
    return NextResponse.json({ success: true, message: 'Database initialized' });
  } catch (error) {
    console.error('Init error:', error);
    return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 });
  }
}
