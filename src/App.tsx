import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Hero from './components/sections/Hero';
import Gallery from './components/sections/Gallery';
import Services from './components/sections/Services';
import About from './components/sections/About';
import Contact from './components/sections/Contact';

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Hero />
        <Gallery />
        <Services />
        <About />
        <Contact />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
