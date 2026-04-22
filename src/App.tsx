import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Projects from "./components/Projects";
import About from "./components/About";
import Experience from "./components/Experience";
import Stack from "./components/Stack";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { useCursorGlow } from "./hooks/useCursorGlow";

export default function App() {
  useCursorGlow();
  return (
    <>
      <div id="top" aria-hidden="true" />
      <Navbar />
      <div className="shell">
        <Hero />
        <Marquee />
        <Projects />
        <About />
        <Experience />
        <Stack />
        <Education />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
