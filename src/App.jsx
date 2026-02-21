import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue, useVelocity, useTransform, useAnimationFrame } from "framer-motion";
import {
  FaPhp,
  FaReact,
  FaNodeJs
} from "react-icons/fa";

import {
  SiTypescript,
  SiTailwindcss,
  SiNextdotjs,
  SiVite
} from "react-icons/si";
const COLORS = {
  cream: "#faf8f3",
  dark: "#1a1a2e",
  coral: "#e27d60",
  teal: "#85cdca",
  muted: "#3d405b",
};

const projects = [
  {
    id: "drive",
    name: "Drive Accessible",
    tag: "Freelance · Live",
    year: "2025–Now",
    short: "Full-scale fleet & car rental management system — from bookings to invoices.",
    urls: ["driveaccessible.com", "fleet.driveaccessible.com"],
    liveUrl: "https://driveaccessible.com",
    fleetUrl: "https://fleet.driveaccessible.com",
    tech: ["Php", "javascript", "MySQL"],
    color: "#e27d60",
    bg: "#fdf0ec",
    featured: true,
    bullets: [
      "Designed centralized dashboard managing vehicles, clients, drivers, payments & invoices",
      "Built automated renewals with double-booking prevention and renewal history",
      "Developed financial engine: daily-rate pricing, partial payments, security deposits",
      "Created pending payment dashboards + professional production-ready invoices",
      "Handled 60+ production tasks — feature enhancements, urgent fixes, stakeholder collab",
      "Deployed official company website with animations, testimonials, SEO pages",
    ],
  },
  {
    id: "techiesaie",
    name: "Techiesaie",
    tag: "Studio · Live",
    year: "2026",
    short: "My digital studio — crafting custom software for local businesses.",
    urls: ["techiesaie.com"],
    liveUrl: "https://techiesaie.com",
    tech: ["Design", "React", "Branding"],
    color: "#85cdca",
    bg: "#edf7f6",
    featured: true,
    bullets: [
      "Platform for helping local businesses go digital with custom software",
      "Focus on speed, ease of use, and business-aligned design",
    ],
  },
  {
    id: "foodexpress",
    name: "FoodExpress",
    tag: "Full Stack",
    year: "2024",
    short: "Full-stack food ordering platform — restaurant browsing, cart, and checkout.",
    tech: ["React", "TypeScript", "Node.js", "MongoDB"],
    color: "#f4a261",
    bg: "#fef4ec",
    bullets: [
      "Restaurant browsing, cart, and checkout flows end-to-end",
      "RESTful APIs for users, orders, and cart with clean data separation",
    ],
  },
  {
    id: "freaky",
    name: "FreakyBall",
    tag: "Sports · API",
    year: "2024",
    short: "Live football scores & statistics platform inspired by modern sports apps.",
    tech: ["React", "JavaScript", "Football-Data.org API"],
    color: "#2d6a4f",
    bg: "#edf7f1",
    bullets: [
      "Match timelines, team stat comparisons, optimized API usage",
      "Inspired by modern sports applications like FotMob",
    ],
  },
  {
    id: "wiki",
    name: "Wikireels",
    tag: "Fun · Scroll",
    year: "2024",
    short: "TikTok-style vertical scrolling interface for Wikipedia discovery.",
    tech: ["React", "Framer Motion", "Wikipedia API"],
    color: "#9b5de5",
    bg: "#f3eeff",
    bullets: [
      "Infinite scroll with snap-based navigation for Wikipedia articles",
      "Smooth motion animations for a native-app feel",
    ],
  },
  {
    id: "career",
    name: "Career Garden",
    tag: "Productivity",
    year: "2024",
    short: "Job application tracker with stage management and persistence.",
    tech: ["React", "Local Storage"],
    color: "#e63946",
    bg: "#fdeced",
    bullets: [
      "Multi-stage tracking: Applied, Interview, Offer, Rejected",
      "Filtering and persistence logic across sessions",
    ],
  },
  {
    id: "manucrafts",
    name: "Manucrafts",
    tag: "E-Commerce",
    year: "2024",
    short: "Boutique e-commerce with storefront + admin dashboard.",
    tech: ["React", "Tailwind CSS", "Vite"],
    color: "#c77dff",
    bg: "#f7eeff",
    bullets: [
      "Customer storefront and admin dashboard in one app",
      "Real-time stock handling, image uploads, checkout logic",
    ],
  },
];

const skills = {
  Frontend: {
    items: ["HTML", "CSS", "JavaScript", "React", "TypeScript"],
    color: "#e27d60",
  },
  Backend: {
    items: ["Python (Django)", "PHP", "Rust", "Node.js"],
    color: "#85cdca",
  },
  Database: {
    items: ["MySQL", "MongoDB"],
    color: "#3d405b",
  },
  Tools: {
    items: ["Git", "GitHub", "Vercel"],
    color: "#1a1a2e",
  },
};
function Counter({ to, suffix = "" }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSeen(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!seen) return;
    let cur = 0;
    const t = setInterval(() => {
      cur += to / 40;
      if (cur >= to) { setN(to); clearInterval(t); } else setN(Math.floor(cur));
    }, 28);
    return () => clearInterval(t);
  }, [seen, to]);
  return <span ref={ref}>{n}{suffix}</span>;
}
const timeline = [
  { title: "Techiesaie Studio", sub: "Founded digital studio for local businesses", date: "2026" },
  { title: "Drive Accessible", sub: "Freelance Full-Stack · Production fleet system", date: "2025 – Now" },
  { title: "Multiple Projects", sub: "5 full-stack projects shipped", date: "2025" },
  { title: "B.Sc. IT", sub: "MVM College, Mumbai University", date: "2022 – 2025" },
];
// ── Timeline Item ─────────────────────────────────────────────────────────────
function TimelineItem({ title, sub, date, index, isLast }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <motion.div animate={{ scale: hov ? 1.4 : 1, background: hov ? "#e27d60" : "rgba(226,125,96,0.28)" }}
          style={{ width: 12, height: 12, borderRadius: "50%", flexShrink: 0, marginTop: 5 }} />
        {!isLast && <div style={{ width: 1, flex: 1, background: "rgba(61,64,91,0.1)", marginTop: 6 }} />}
      </div>
      <div style={{ paddingBottom: 26 }}>
        <div style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.14em", color: "#e27d60", marginBottom: 3 }}>{date}</div>
        <h4 style={{ fontSize: 17, fontWeight: 900, letterSpacing: "-0.02em", color: "#1a1a2e", margin: "0 0 3px" }}>{title}</h4>
        <p style={{ fontSize: 12, opacity: 0.46, fontWeight: 500, margin: 0 }}>{sub}</p>
      </div>
    </motion.div>
  );
}
const skillLevels = { "HTML": 95, "CSS": 92, "JavaScript": 90, "React": 88, "TypeScript": 78, "Python (Django)": 72, "PHP": 68, "Rust": 55, "Node.js": 85, "MySQL": 82, "MongoDB": 78, "Git": 90, "GitHub": 88, "Vercel": 80 };

function SkillPill({ skill, delay, color }) {
  const [hov, setHov] = useState(false);
  const level = skillLevels[skill] || 75;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.75 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
      transition={{ delay, type: "spring", stiffness: 280 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position: "relative", overflow: "hidden"}} data-hover>
      <motion.div animate={{ scale: hov ? 1.03 : 1 }}
        style={{ padding: "9px 12px", background: "white", borderRadius: 10, border: "1px solid rgba(61,64,91,0.07)", position: "relative" }}>
        <AnimatePresence>
          {hov && <motion.div initial={{ width: 0 }} animate={{ width: `${level}%` }} exit={{ width: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: "absolute", inset: 0, background: color, opacity: 0.14, borderRadius: 10 }} />}
        </AnimatePresence>
        <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>{skill}</span>
          <AnimatePresence>
            {hov && <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
              style={{ fontSize: 9, fontWeight: 900, color }}>{level}%</motion.span>}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Marquee({ items }) {
  return (
    <div className="overflow-hidden whitespace-nowrap py-4 border-y border-[#3d405b]/10">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="inline-flex gap-16"
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-xs font-black uppercase tracking-[0.4em] opacity-30 inline-flex items-center gap-6">
            {item} <span className="text-[#e27d60]">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function ProjectCard({ p, index, onClick }) {
  const [hovered, setHovered] = useState(false);
  const isFeatured = p.featured;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(p)}
      className="cursor-pointer"
    >
      <motion.div
        animate={{ y: hovered ? -8 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`relative rounded-3xl overflow-hidden border border-[#3d405b]/8 shadow-sm ${isFeatured ? "p-8 md:p-12" : "p-6 md:p-8"}`}
        style={{ background: p.bg }}
      >
        {/* Animated gradient blob */}
        <motion.div
          animate={{ scale: hovered ? 1.4 : 1, opacity: hovered ? 0.15 : 0.07 }}
          transition={{ duration: 0.6 }}
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl"
          style={{ background: p.color }}
        />

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-[0.35em] opacity-40">{p.tag}</span>
              <h3 className={`font-black tracking-tight leading-none ${isFeatured ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"}`} style={{ color: COLORS.dark }}>
                {p.name}
              </h3>
            </div>
            <div className="flex items-center gap-3 sm:flex-col sm:items-end shrink-0">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-30 whitespace-nowrap">
                {p.year}
              </span>

              {p.featured && (
                <span
                  className="px-3 py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white whitespace-nowrap"
                  style={{ background: p.color }}
                >
                  Live ↗
                </span>
              )}
            </div>
          </div>

          <p className={`font-medium opacity-60 leading-relaxed mb-6 ${isFeatured ? "text-lg" : "text-base"}`}>
            {p.short}
          </p>

          {isFeatured && (
            <div className="space-y-2 mb-8">
              {p.bullets.slice(0, 3).map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: p.color }} />
                  <p className="text-sm opacity-55 leading-snug">{b}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {p.tech.map((t) => (
              <span key={t} className="px-3 py-1.5 bg-white/70 rounded-lg text-[10px] font-black uppercase tracking-widest border border-[#3d405b]/8">
                {t}
              </span>
            ))}
          </div>

          <motion.div
            animate={{ gap: hovered ? "12px" : "8px" }}
            className="flex items-center"
            style={{ display: "flex" }}
          >
            <span className="text-[11px] font-black uppercase tracking-[0.3em]" style={{ color: p.color }}>
              View Details
            </span>
            <motion.span animate={{ x: hovered ? 4 : 0 }} style={{ color: p.color }}>→</motion.span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Modal({ project, onClose }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xl" />
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-[2.5rem] shadow-2xl"
        style={{ background: project.bg }}
      >
        {/* Top gradient bar */}
        <div className="h-1 w-full" style={{ background: project.color }} />

        <div className="p-8 md:p-12 overflow-y-auto max-h-[85vh]">
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-1">{project.tag} · {project.year}</span>
              <h2 className="text-4xl font-black tracking-tight" style={{ color: COLORS.dark }}>{project.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 bg-white/80 rounded-2xl flex items-center justify-center text-xl font-bold hover:bg-white transition-colors shadow-sm"
            >
              ×
            </button>
          </div>

          <p className="text-lg font-medium opacity-70 leading-relaxed mb-8 border-l-4 pl-6" style={{ borderColor: project.color }}>
            {project.short}
          </p>

          <div className="space-y-3 mb-8">
            {project.bullets.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-4 p-4 bg-white/50 rounded-2xl"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: project.color + "20" }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: project.color }} />
                </div>
                <p className="text-sm font-medium opacity-75 leading-relaxed">{b}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {project.tech.map((t) => (
              <span key={t} className="px-4 py-2 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-[#3d405b]/10 shadow-sm">
                {t}
              </span>
            ))}
          </div>

          {project.liveUrl && (
            <div className="flex gap-3 flex-wrap">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-black hover:opacity-90 transition-opacity shadow-lg"
                style={{ background: project.color }}
              >
                Visit {project.urls?.[0]} ↗
              </a>
              {project.fleetUrl && (
                <a
                  href={project.fleetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-black border-2 hover:bg-white transition-colors"
                  style={{ borderColor: project.color, color: project.color }}
                >
                  fleet.driveaccessible.com ↗
                </a>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
export default function Portfolio() {
  const [activeProject, setActiveProject] = useState(null);
  const [activeSection, setActiveSection] = useState("about");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: 0,
      }
    );

    navItems.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const [isOpen, setIsOpen] = useState(false);
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  const navItems = ["about", "work","timeline","skills", "contact"];

  const SocialLinks = () => {
    const socials = [
      {
        name: "Twitter",
        handle: "@imran_k_12",
        href: "https://x.com/imran_k_12",
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        ),
      },
      {
        name: "LinkedIn",
        handle: "imranrkhan13",
        href: "https://linkedin.com/in/imranrkhan13",
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        ),
      },
      {
        name: "GitHub",
        handle: "imranrkhan13",
        href: "https://github.com/imranrkhan13",
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        ),
      },
      {
        name: "Instagram",
        handle: "imran.k_12",
        href: "https://instagram.com/imran.k_12",
        icon: (
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2h-8.5zm0 2h8.5C18.284 4 20 5.716 20 7.75v8.5c0 2.034-1.716 3.75-3.75 3.75h-8.5C5.716 20 4 18.284 4 16.25v-8.5C4 5.716 5.716 4 7.75 4zm8.75 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
          </svg>
        ),
      },
    ];

    return (
      <div className="flex gap-6">
        {socials.map((social) => (
          <TooltipIcon key={social.name} social={social} />
        ))}
      </div>
    );
  };
  const TooltipIcon = ({ social }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div className="relative flex flex-col items-center">
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute -top-10 px-3 py-1 bg-[#3d405b] text-white text-[10px] font-bold rounded-lg whitespace-nowrap shadow-xl"
            >
              {social.handle}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.a
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.9 }}
          className="text-[#3d405b]/40 hover:text-[#e27d60] transition-colors duration-300"
        >
          {social.icon}
        </motion.a>
      </div>
    );
  };


  return (
    <div className="bg-[#faf8f3] text-[#1a1a2e] min-h-screen font-sans selection:bg-[#e27d60] selection:text-white">

      {/* Fixed Nav */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: "spring", damping: 30 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center bg-white/80 backdrop-blur-xl px-2 py-2 md:px-3 md:py-3 rounded-full shadow-xl border border-[#3d405b]/8 w-[90%] max-w-fit"
      >
        {/* Logo */}
        <div className="w-8 h-8 rounded-full bg-[#e27d60] flex items-center justify-center shrink-0">
          <span className="text-white text-[10px] font-black">IK</span>
        </div>

        {/* Desktop Items */}
        <div className="hidden md:flex items-center gap-1 ml-2">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all
                  ${activeSection === item
                  ? "bg-[#e27d60] text-white"
                  : "text-[#3d405b] hover:bg-[#e27d60]/10"
                }`}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <a
          href="mailto:muhammadimrank034@gmail.com"
          className="hidden md:block ml-2 px-5 py-2 rounded-full bg-[#1a1a2e] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#e27d60] transition-colors"
        >
          Hire Me
        </a>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden ml-auto p-2 text-[#3d405b]"
        >
          <div className="flex flex-col gap-1 w-5">
            <span className={`h-0.5 w-full bg-current transition-all ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`h-0.5 w-full bg-current transition-all ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-full bg-current transition-all ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </div>
        </button>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-[#1a1a2e]/60 backdrop-blur-2xl z-[98] md:hidden"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -40, rotateX: -15 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -40, rotateX: 15 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        style={{ perspective: "1000px" }}
        className="fixed top-24 left-1/2 -translate-x-1/2 w-[94%] z-[99] bg-white/95 backdrop-blur-3xl rounded-[40px] p-3 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border border-white md:hidden overflow-hidden"
      >
        {/* 1. LARGE WATERMARK BACKGROUND (Fills the void) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span className="text-[25vw] font-black text-[#1a1a2e]/[0.03] leading-none">
                NAV
            </span>
        </div>

        {/* 2. GRID TEXTURE (Adds digital "grit") */}
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#3d405b 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
        />

        <div className="flex flex-col gap-1.5 relative z-10">
          {navItems.map((item, i) => (
            <motion.a
              key={item}
              href={`#${item}`}
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ delay: i * 0.08, type: "spring", bounce: 0.4 }}
              whileTap={{ scale: 0.97 }}
              className={`group relative px-6 py-5 rounded-[24px] text-[13px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-between
                ${activeSection === item ? "text-white" : "text-[#3d405b]"}
              `}
            >
              {activeSection === item && (
                <motion.div
                  layoutId="activeBg"
                  className="absolute inset-0 bg-[#e27d60] z-[-1] shadow-[0_8px_20px_-6px_rgba(226,125,96,0.5)]"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                  style={{ borderRadius: "24px" }}
                />
              )}

              <span className="flex items-center gap-3">
                <span className={`w-1.5 h-1.5 rounded-full bg-[#e27d60] transition-all duration-500 ${activeSection === item ? "scale-150 opacity-100" : "scale-0 opacity-0"}`} />
                {item}
              </span>
              
              <motion.span 
                animate={activeSection === item ? { rotate: 90, scale: 1.2 } : { rotate: 0, scale: 1 }}
                className="text-[14px] opacity-40 font-light"
              >
                {activeSection === item ? "✦" : "→"}
              </motion.span>
            </motion.a>
          ))}

          {/* Hire Me Section */}
          <motion.a
            href="mailto:muhammadimrank034@gmail.com"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: navItems.length * 0.1 }}
            className="mt-3 relative group overflow-hidden px-6 py-7 rounded-[30px] bg-[#1a1a2e] text-white flex items-center justify-center gap-4 shadow-xl"
          >
            <motion.div 
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
            />
            <span className="text-[12px] font-black uppercase tracking-[0.4em] relative z-10">Let's Talk</span>
            <div className="w-2.5 h-2.5 bg-[#e27d60] rounded-full relative z-10 shadow-[0_0_10px_#e27d60]" />
          </motion.a>

          {/* 3. STATUS FOOTER (Grounds the menu) */}
          <div className="mt-4 px-6 py-4 flex items-center justify-between border-t border-[#3d405b]/5">
             <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase text-[#3d405b]/30 tracking-widest">Location</span>
                <span className="text-[10px] font-bold text-[#3d405b]/60 uppercase">Mumbai, India</span>
             </div>
             <div className="flex gap-4">
                {/* Social Icons Placeholder */}
                <span className="text-[10px] font-black text-[#e27d60]/50 hover:text-[#e27d60] transition-colors cursor-pointer">LI</span>
                <span className="text-[10px] font-black text-[#e27d60]/50 hover:text-[#e27d60] transition-colors cursor-pointer">GH</span>
             </div>
          </div>
        </div>
      </motion.div>
    </>
  )}
      </AnimatePresence>

      {/* HERO */}
      <section id="about" className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden px-6 py-20">
        {/* Background Polish (Keeping your signature look) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.1] blur-[100px]"
            style={{ background: "#e27d60" }}
          />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: "linear-gradient(#3d405b 1px, transparent 1px), linear-gradient(90deg, #3d405b 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          {/* Identity Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 mb-4"
              >
                <span className="w-8 h-[1px] bg-[#e27d60]" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#e27d60]">Architect & Engineer</span>
              </motion.div>
              <h1 className="text-[clamp(45px,8vw,90px)] font-black tracking-tighter leading-[0.9] text-[#3d405b]">
                Imran <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e27d60] to-[#e27d60]/70">Khan.</span>
              </h1>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              // Changed: bg-white, added warmer border, added a colored 'glow' shadow
              className="bg-white border border-[#e27d60]/20 p-5 rounded-2xl shadow-[0_8px_30px_-6px_rgba(226,125,96,0.15)] max-w-xs relative"
            >
              {/* New: "Live" pulsing indicator icon at top right */}
              <div className="absolute top-4 right-4 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e27d60] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#e27d60]"></span>
              </div>

              <p className="text-xs font-bold text-[#e27d60] uppercase tracking-widest mb-3 flex items-center gap-2">
                Current Role
              </p>
              <p className="text-sm font-semibold text-[#3d405b] leading-relaxed">
                Contributing to accessible mobility solutions at
                <span className="text-[#e27d60] font-black"> DriveAccessible</span>.
              </p>
            </motion.div>
          </div>

          {/* The "Identity Hub" Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">

            {/* Card 1: Experience/Status */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-2 bg-[#3d405b] text-white p-8 rounded-[2rem] flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="relative z-10 max-w-4xl">
                <h2 className="text-1.5xl font-black mb-2 sm:text-[36px] leading-[1.4] tracking-tight text-white">
                  I build products people actually enjoy using.
                </h2>

                <p className="text-white/70 text-[15px] sm:text-[18px] leading-[2] sm:leading-[2.8] font-medium">
                  I design and develop fast, scalable web applications using{" "}

                  {[
                    { name: "PHP", icon: <FaPhp />, color: "bg-indigo-500/10 border-indigo-500/30 text-white" },
                    { name: "TypeScript", icon: <SiTypescript />, color: "bg-blue-600/10 border-blue-500/30 text-blue-300" },
                    { name: "React", icon: <FaReact />, color: "bg-cyan-500/10 border-cyan-400/30 text-cyan-300" },
                    { name: "Next.js", icon: <SiNextdotjs />, color: "bg-white/10 border-white/20 text-white" },
                    { name: "Node.js", icon: <FaNodeJs />, color: "bg-green-500/10 border-green-400/30 text-green-300" },
                    { name: "Tailwind CSS", icon: <SiTailwindcss />, color: "bg-teal-500/10 border-teal-400/30 text-teal-300" },
                  ].map((tech, i, arr) => (
                    <span key={i} className="inline-block whitespace-nowrap">
                      <span
                        className={`
                          inline-flex items-center gap-2 
                          px-2.5 py-1 mx-0.5
                          rounded-md border 
                          text-[11px] sm:text-[13px] font-bold
                          transition-all hover:scale-105
                          ${tech.color}
                        `}
                      >
                        <span className="text-[14px]">{tech.icon}</span>
                        {tech.name}
                      </span>

                      {/* Keeping grammar attached to the badge so they don't separate on wrap */}
                      <span className="mr-1.5 text-white/40">
                        {i < arr.length - 2 ? "," : i === arr.length - 2 ? " and" : ""}
                      </span>
                    </span>
                  ))}
                  {" "}keeping things clean and easy to use. I build products that simply work.
                </p>
              </div>
              <div className="mt-8 flex gap-6 relative z-10">
                <div>
                  <p className="text-2xl font-black text-[#85cdca]">15+</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-50">Projects Shipped</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#e27d60]">4+</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-50">Years Coding</p>
                </div>
              </div>
              {/* Visual element for the card */}
              <div className="absolute right-[-10%] bottom-[-10%] text-[150px] font-black opacity-[0.03] select-none group-hover:opacity-[0.05] transition-opacity">
                CODE
              </div>
            </motion.div>

            {/* Card 2: Brand/Blog (Techiesaie) */}
            <motion.a
              href="https://techiesaie.com/blog"
              target="_blank"
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              // Enhanced: White base with a teal-tinted glow and a stronger border on hover
              className="relative group bg-white border border-[#85cdca]/30 p-8 rounded-[2rem] flex flex-col justify-between shadow-[0_10px_40px_-15px_rgba(133,205,202,0.2)] hover:shadow-[0_20px_60px_-10px_rgba(133,205,202,0.3)] hover:border-[#85cdca] transition-all duration-300 overflow-hidden"
              >
              {/* Decorative teal orb in the background */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#85cdca]/10 rounded-full blur-3xl group-hover:bg-[#85cdca]/20 transition-colors" />

              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-[#85cdca] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-[0_8px_20px_-4px_rgba(133,205,202,0.5)] transform group-hover:rotate-6 transition-transform">
                    T
                  </div>
                  {/* "New" or "Live" Badge */}
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-[#85cdca]/10 text-[#5da9a6] px-2 py-1 rounded-md">
                    Featured
                  </span>
                </div>

                <h3 className="text-2xl font-black text-[#3d405b] mb-1">Techiesaie</h3>
                <p className="text-[10px] font-bold text-[#85cdca] uppercase tracking-[0.3em] mb-4">
                  Personal Brand
                </p>
                <p className="text-sm font-medium text-[#3d405b]/70 leading-relaxed">
                  Sharing deep dives into React, performance, and the future of web dev.
                </p>
              </div>

              <div className="flex items-center gap-2 mt-8">
                <span className="text-xs font-black text-[#3d405b] uppercase tracking-wider">
                  Read Blogs
                </span>
                {/* Animated Arrow */}
                <motion.svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-none stroke-[#85cdca] stroke-[3]"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              </div>
            </motion.a>

            {/* Card 3: Social/Connect Bar */}
            <div className="md:col-span-3 flex flex-wrap items-center justify-between bg-white border border-[#3d405b]/5 p-6 rounded-[2rem] shadow-sm">
              <SocialLinks />

              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#3d405b]/40">
                  Scroll to view work
                </span>
                <div className="w-12 h-[1px] bg-[#3d405b]/10" />
              </div>
            </div>
            </div>
          </div>
      </section>

      {/* Marquee */}
      <Marquee items={["React", "Node.js", "TypeScript", "MySQL", "MongoDB", "Full-Stack", "Freelance", "Mumbai", "2025", "Available for Work"]} />

      {/* WORK SECTION */}
      <section id="work" className="max-w-7xl mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-20"
          >
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e27d60] block mb-4">✦ Selected Work</span>
            <h2 className="text-6xl md:text-8xl font-black tracking-tight leading-none">Projects<span className="text-[#e27d60]">.</span></h2>
          </div>
          <p className="hidden md:block text-sm opacity-40 font-medium max-w-xs text-right leading-relaxed">
            7 projects. From freelance fleet systems to fun Wikipedia readers.
          </p>
        </motion.div>

          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-1 w-8 bg-blue-600 rounded-full" />
              <h2 className="text-2xl font-bold tracking-tight">Featured Works</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {featured.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  // First project takes 7 columns, second takes 5 for asymmetrical interest
                  className={`${i === 0 ? 'md:col-span-7' : 'md:col-span-5'} group`}
                >
                  <ProjectCard
                    p={p}
                    isFeatured
                    onClick={() => setActiveProject(p)}
                  />
                </motion.div>
              ))}
            </div>
          </section>

          {/* Other Projects - Clean Grid Section */}
          <section>
            <h3 className="text-lg font-medium text-slate-500 mb-6">More Explorations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.1 + (i * 0.05) }}
                  viewport={{ once: true }}
                >
                  <ProjectCard p={p} onClick={() => setActiveProject(p)} />
                </motion.div>
              ))}
            </div>
            
          </section>  
      </section>

      <section id ="timeline"style={{ padding: "0 clamp(24px,5vw,64px) clamp(60px,8vw,80px)" }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 40 }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.5em",
              color: "#e27d60",
              display: "block",
              marginBottom: 10,
            }}
          >
            ✦ Background
          </span>

          <h2
            style={{
              fontSize: "clamp(40px,7vw,88px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              margin: "0 0 14px",
            }}
          >
            Journey<span style={{ color: "#e27d60" }}>.</span>
          </h2>

          <p
            style={{
              fontSize: 13,
              opacity: 0.6,
              fontWeight: 500,
            }}
          >
            My academic foundation and professional experience so far.
          </p>
        </motion.div>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,400px),1fr))", gap: 24 }}>
          <motion.div initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ position: "relative", background: "#1a1a2e", color: "white", borderRadius: 40, padding: "clamp(32px,5vw,52px)", overflow: "hidden" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              style={{ position: "absolute", top: -60, right: -60, width: 260, height: 260, borderRadius: "50%", opacity: 0.1, border: "1px solid rgba(226,125,96,0.4)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: -60, right: -60, width: 260, height: 260, borderRadius: "50%", opacity: 0.08, background: "radial-gradient(circle, #e27d60, transparent)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <span style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.5em", color: "#85cdca", display: "block", marginBottom: 16 }}>✦ Education</span>
              <h3 style={{ fontSize: "clamp(36px,5vw,50px)", fontWeight: 900, letterSpacing: "-0.03em", margin: "0 0 10px" }}>B.Sc. IT</h3>
              <p style={{ fontSize: 16, fontWeight: 500, opacity: 0.55, marginBottom: 4 }}>MVM College of Arts, Science & Commerce</p>
              <p style={{ fontSize: 12, opacity: 0.35, fontWeight: 500 }}>Mumbai University · 2022 – 2025</p>
              <div style={{ marginTop: 28, display: "flex", gap: 24, alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: "#e27d60" }}><Counter to={25} /></div>
                  <div style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "0.14em", opacity: 0.35, fontWeight: 900, marginTop: 3 }}>Class of</div>
                </div>
                <div style={{ width: 1, height: 50, background: "rgba(255,255,255,0.08)" }} />
                <div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: "#85cdca" }}><Counter to={3} /></div>
                  <div style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "0.14em", opacity: 0.35, fontWeight: 900, marginTop: 3 }}>Years</div>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ paddingTop: 8 }}>
            <span style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.5em", color: "#e27d60", display: "block", marginBottom: 26 }}>✦ Journey</span>
            {timeline.map((item, i) => <TimelineItem key={i} {...item} index={i} isLast={i === timeline.length - 1} />)}
          </motion.div>
        </div>
      </section>
      {/* SKILLS */}
      <section id="skills" style={{ padding: "clamp(40px,6vw,60px) clamp(24px,5vw,64px) clamp(60px,8vw,96px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 40 }}>
            <span style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.5em", color: "#e27d60", display: "block", marginBottom: 10 }}>✦ Toolkit</span>
            <h2 style={{ fontSize: "clamp(40px,7vw,88px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, margin: "0 0 10px" }}>Skills<span style={{ color: "#e27d60" }}>.</span></h2>
            <p style={{ fontSize: 12, opacity: 0.36, fontWeight: 500 }}>Hover any skill to reveal proficiency</p>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
            {Object.entries(skills).map(([cat, { items, color }], ci) => (
              <motion.div key={cat} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: ci * 0.1 }}
                style={{ background: "white", borderRadius: 24, padding: 22, border: "1px solid rgba(61,64,91,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                  <span style={{ fontSize: 8, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.4em", color }}>{cat}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {items.map((skill, si) => <SkillPill key={skill} skill={skill} delay={ci * 0.1 + si * 0.06} color={color} />)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="px-6 py-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-[#e27d60] rounded-[3rem] p-12 md:p-24 text-white overflow-hidden text-center"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
                className="absolute w-32 h-32 rounded-full border border-white/10"
                style={{
                  left: `${10 + i * 15}%`,
                  top: `${20 + (i % 2) * 40}%`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-60 block mb-6">✦ Get in Touch</span>
            <h2 className="text-5xl md:text-8xl font-black tracking-tight leading-none mb-8">
              Let's Build<br />Together.
            </h2>
            <p className="text-xl opacity-70 font-medium mb-12 max-w-lg mx-auto">
              Have a project in mind? I'm always open to discussing new opportunities and ideas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full px-4">
              {/* Email Button */}
              <a
                href="mailto:muhammadimrank034@gmail.com"
                className="
                    w-full sm:w-auto 
                    px-6 sm:px-10 py-5 
                    bg-white text-[#e27d60] 
                    rounded-full text-[12px] sm:text-sm font-black 
                    hover:scale-105 active:scale-95 
                    transition-all shadow-xl 
                    text-center truncate
                  "
              >
                muhammadimrank034@gmail.com ↗
              </a>

              {/* LinkedIn Button */}
              <a
                href="https://linkedin.com/in/imranrkhan13"
                target="_blank"
                rel="noreferrer"
                className="
                    w-full sm:w-auto 
                    px-6 sm:px-10 py-5 
                    bg-white/10 backdrop-blur-md text-white 
                    border border-white/20 
                    rounded-full text-[12px] sm:text-sm font-black 
                    hover:bg-white/20 active:scale-95 
                    transition-all text-center
                  "
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="text-center py-12 px-6">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20">
          Made with care by Imran Khan · Mumbai · 2026
        </p>
      </footer>

      {/* Modal */}
      <AnimatePresence>
        {activeProject && (
          <Modal project={activeProject} onClose={() => setActiveProject(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}