import Layout from '@/components/layout/Layout';
import Hero from '@/components/sections/Hero';
import Gallery from '@/components/sections/Gallery';
import Services from '@/components/sections/Services';
import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';

export default function HomePage() {
  return (
    <Layout>
      <Hero />
      <Gallery />
      <Services />
      <About />
      <Contact />
    </Layout>
  );
}
