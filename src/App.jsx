import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";

import { navItems } from "./data";
import Navbar from "./components/Navbar";
import HeroSection from "./components/Herosection";
import Marquee from "./components/Marquee";
import WorkSection from "./components/WorkSection";
import TimelineSection from "./components/TimelineSection";
import SkillsSection from "./components/SkillsSection";
import ContactSection from "./components/ContactSection";

export default function App() {
  const [activeSection, setActiveSection] = useState("about");
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    navItems.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-[#faf8f3] text-[#1a1a2e] min-h-screen font-sans selection:bg-[#e27d60] selection:text-white">

      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-[#e27d60] z-[999] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <Navbar activeSection={activeSection} />
      <HeroSection />
      <Marquee />
      <WorkSection />
      <TimelineSection />
      <SkillsSection />
      <ContactSection />
    </div>
  );
}