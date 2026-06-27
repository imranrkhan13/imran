import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import niceFace from "./assets/nice.png";

// ── Original white/warm theme ──────────────────────────────────
const C = {
  bg: "#faf9f6",
  ink: "#3d405b",
  navy: "#232642",
  coral: "#e27d60",
  line: "rgba(61,64,91,0.08)",
  muted: "rgba(61,64,91,0.45)",
  soft: "rgba(61,64,91,0.10)",
  card: "#ffffff",
  coralFaint: "rgba(226,125,96,0.07)",
  coralLight: "rgba(226,125,96,0.18)",
};

const EASE = [0.25, 1, 0.5, 1];

// Tech → projects mapping for hover tooltips
const TECH_PROJECTS = {
  "React": ["BillingOS", "Kanban Pro", "AI Check Data", "Resume AI", "DevLens", "FoodExpress", "Wikireels", "Techiesaie", "AI Model Governance Platform", "AI Try-On", "MindFlow"],
  "Node.js": ["BillingOS", "Kanban Pro", "Vault", "FoodExpress"],
  "Python": ["MindFlow", "AI Try-On", "AI Model Governance Platform"],
  "FastAPI": ["MindFlow", "AI Try-On", "AI Model Governance Platform"],
  "PostgreSQL": ["BillingOS", "Payout Engine", "AI Model Governance Platform"],
  "PHP": ["Drive Accessible"],
  "Django": ["Payout Engine"],
  "WebRTC": ["Vault"],
  "Redis": ["BillingOS", "Payout Engine"],
  "TypeScript": ["FoodExpress"],
  "MySQL": ["Drive Accessible"],
  "Supabase": ["AI Check Data", "Resume AI"],
  "WebSockets": ["Kanban Pro", "Vault"],
  "Stripe": ["BillingOS"],
  "Docker": ["MindFlow", "AI Model Governance Platform"],
  "React Flow": ["MindFlow"],
  "NetworkX": ["MindFlow"],
  "LLMs": ["MindFlow", "AI Model Governance Platform"],
  "Hugging Face": ["MindFlow", "AI Try-On"],
  "Express": ["BillingOS", "Vault"],
  "REST APIs": ["BillingOS", "FoodExpress", "DevLens"],
  "MongoDB": ["FoodExpress"],
  "pgvector": ["AI Model Governance Platform"],
  "Next.js": [],
  "Tailwind CSS": [],
  "Framer Motion": ["Wikireels", "Techiesaie"],
  "JavaScript": ["Drive Accessible", "FoodExpress"],
};

const PROJECTS = [
  {
    id: "drive", num: "01", name: "Drive Accessible", tag: "SaaS · Production", year: "2025–Now", color: "#e27d60",
    tagline: "Full-scale fleet & car rental SaaS — live customers, live money.",
    short: "A production fleet and car rental SaaS centralising vehicle management, customer bookings, billing, payment tracking, and operational renewals into one cohesive system used daily by real operations teams.",
    context: "This is a real production system used daily by operations teams at a car rental business. Not a side project — live customers, live money, zero tolerance for downtime.",
    urls: ["driveaccessible.com", "fleet.driveaccessible.com"], liveUrl: "https://driveaccessible.com", fleetUrl: "https://fleet.driveaccessible.com",
    tech: ["PHP", "JavaScript", "MySQL"],
    bullets: [
      "Engineered a conflict-detection system that analyses existing booking windows in real time, eliminating double-bookings entirely across the vehicle fleet.",
      "Built a billing engine with daily rate pricing, configurable security deposits, partial payment recording, and live invoice totals — zero third-party payment libraries.",
      "Developed a payment tracking dashboard surfacing overdue amounts, upcoming renewals, and revenue trends.",
      "Resolved 60+ production issues ranging from critical edge-case bugs to full feature deliveries, maintaining zero downtime.",
      "Deployed a SEO-optimised public website with Intersection Observer animations and structured data markup.",
      "Architected multi-role access control so admins, agents, and drivers each see only relevant data.",
    ],
  },
  {
    id: "billingos", num: "02", name: "BillingOS", tag: "SaaS · Infrastructure", year: "2025", color: "#0ea5e9",
    tagline: "Production-grade multi-tenant billing engine modelled on Stripe Billing.",
    short: "A multi-tenant billing engine with subscription lifecycle management, proration on plan changes, exponential-backoff retries, PDF invoicing, idempotent Stripe webhooks, and PostgreSQL Row-Level Security.",
    context: "Built to understand how billing infrastructure like Stripe actually works under the hood. Every design decision mirrors what a real SaaS billing system needs at scale.",
    liveUrl: "", tech: ["Node.js", "React", "PostgreSQL", "Redis", "Stripe", "PDFKit"],
    bullets: [
      "Implemented Row-Level Security across every database table — PostgreSQL itself prevents cross-tenant data leakage.",
      "Built a subscription state machine: trial → active → past_due → cancelled, proration invoices auto-generated on any mid-cycle plan change.",
      "Designed exponential-backoff retry logic (1h → 6h → 24h → 72h) using Bull + Redis.",
      "Created idempotent Stripe webhook processing with unique stripe_event_id so duplicates are silently discarded.",
      "Per-tenant configurable rate limiting — Enterprise 500 req/min, Starter 100 — enforced in Express middleware.",
      "Generated PDF invoices on-demand with PDFKit, caching to disk and streaming from the /invoices/:id/pdf endpoint.",
    ],
  },
  {
    id: "payout", num: "03", name: "Payout Engine", tag: "Fintech · Backend", year: "2025", color: "#10b981",
    tagline: "Merchant payout engine — integer arithmetic, row-level locking, atomic recovery.",
    short: "A payout engine solving the hard problems: money as integer paise, SELECT FOR UPDATE locking, idempotency keys, atomic failure refunds, and a scheduler auto-recovering stuck payouts every 30s.",
    context: "Fintech systems using float arithmetic will eventually corrupt balances. Built to understand and solve every class of financial data integrity failure.",
    liveUrl: "https://payout-engine-ten.vercel.app/", tech: ["Django", "PostgreSQL", "Celery", "Redis", "React"],
    bullets: [
      "Stored all monetary values as integer paise (₹1 = 100 paise) — eliminating float arithmetic drift that corrupts balances at scale.",
      "Used SELECT FOR UPDATE inside transaction.atomic() to lock ledger rows, making concurrent overdrafts structurally impossible.",
      "Implemented idempotency keys with a DB-level unique constraint: duplicate requests return the cached response.",
      "Atomic failure handling: marking a payout failed and crediting the refund happen in a single transaction.",
      "Celery beat task runs every 30s, detects stuck payouts, retries up to 3 times or cancels+refunds atomically.",
      "Balance stored as a computed aggregate of immutable ledger entries — the audit trail is always the source of truth.",
    ],
  },
  {
    id: "kanban", num: "04", name: "Kanban Pro", tag: "Real-Time · Collaboration", year: "2025", color: "#8b5cf6",
    tagline: "Real-time collaborative Kanban — live presence, instant sync, no accounts.",
    short: "A real-time collaborative Kanban board where multiple users share a live workspace via 8-character invite codes, with WebSocket sync and automatic reconnection.",
    context: "Built to feel like Figma's live collaboration but for task management.",
    liveUrl: "", tech: ["React", "Node.js", "WebSockets"],
    bullets: [
      "Room-based WebSocket architecture — each board is an isolated namespace, join with an 8-character code.",
      "Real-time presence indicators showing who's on the board and which card they're editing.",
      "Rich card modals with priority levels, colour labels, due-date pickers, checklist items, and threaded comments.",
      "Last-write-wins conflict resolution with per-card sequence counter and timestamped activity feed.",
      "Graceful reconnection: detects disconnection, shows offline banner, auto-rejoins and replays missed state.",
    ],
  },
  {
    id: "vault", num: "05", name: "Vault", tag: "Real-Time · P2P", year: "2025", color: "#0ea5e9",
    tagline: "Peer-to-peer file sharing — encrypted WebRTC, zero server storage.",
    short: "P2P file sharing with direct encrypted WebRTC connections. No files ever touch the server — just signalling. Token-based links, chunked transfer.",
    context: "Most file sharing services store your files on someone else's servers. Vault doesn't.",
    liveUrl: "https://file-sharing-vu8t.onrender.com/", tech: ["Node.js", "WebRTC", "WebSockets"],
    bullets: [
      "WebRTC data channels for P2P transfer; WebSocket signalling handles SDP and ICE without storing file data.",
      "Chunked file transfer with progress tracker and reassembly, supporting large files.",
      "Token-based sharing: sender generates an opaque room code, anyone with it can receive.",
    ],
  },
  {
    id: "aicheckdata", num: "06", name: "AI Check Data", tag: "AI · SaaS", year: "2025", color: "#6366f1",
    tagline: "Multi-LLM validation — parallel consensus scoring across four providers.",
    short: "Routes each request through Gemini, Groq, Mistral, and OpenRouter in parallel, aggregating outputs into a consensus score with graceful fallback.",
    context: "Single-LLM validation is fragile — one model's blind spot becomes your product's bug.",
    liveUrl: "https://aicheckdata.netlify.app/", tech: ["React", "Supabase", "PostgreSQL", "LLM APIs"],
    bullets: [
      "Multi-LLM pipeline across four providers, normalising each response into a structured schema before weighted consensus scoring.",
      "Fallback system detects rate-limit errors and API failures, automatically rerouting without surfacing errors to users.",
      "Optimistic UI updates with session-based sync via Supabase Realtime.",
    ],
  },
  {
    id: "resumeai", num: "07", name: "Resume AI", tag: "AI · Product", year: "2025", color: "#7c3aed",
    tagline: "AI resume builder — JD-to-resume mapping with ATS optimisation.",
    short: "Takes a job description as input and generates a tailored, ATS-optimised resume by mapping the user's experience to the role's requirements.",
    context: "Most resume builders just format your existing text. This one reads the JD and rewrites your experience to match it.",
    liveUrl: "", tech: ["React", "Supabase", "LLM APIs"],
    bullets: [
      "Prompt pipeline extracts key requirements from a JD and maps them against stored experience.",
      "Multiple AI providers with structured output generation, enforcing a consistent JSON schema.",
      "Save, edit, and export backed by Supabase — multiple resume versions, downloadable PDF per role.",
    ],
  },
  {
    id: "devlens", num: "08", name: "DevLens", tag: "Developer Tool", year: "2025", color: "#f59e0b",
    tagline: "GitHub profile analyser with side-by-side contributor comparison.",
    short: "Renders a structured breakdown of any public GitHub profile — repo stats, language distribution, star counts. Compare two profiles side-by-side.",
    context: "Built for evaluating open-source contributors quickly.",
    liveUrl: "", tech: ["React", "JavaScript", "GitHub API"],
    bullets: [
      "GitHub REST API integration for profile data, repository lists, language stats, and contribution metadata.",
      "Side-by-side comparison mode normalising metrics onto the same scale.",
      "Information-dense UI surfacing top languages, most-starred repos, recent activity.",
    ],
  },
  {
    id: "techiesaie", num: "09", name: "Techiesaie", tag: "Studio · Live", year: "2026", color: "#85cdca",
    tagline: "Digital studio helping local businesses move operations online.",
    short: "A digital studio and personal brand helping local businesses get online — bespoke software, branding, and web presence.",
    context: "Built around one observation: local agencies take months, charge opaquely, and deliver mediocre work.",
    urls: ["techiesaie.com"], liveUrl: "https://techiesaie.com", tech: ["React", "Design", "Branding"],
    bullets: [
      "Studio brand positioned around fast delivery and simplicity.",
      "Public-facing site built as a live portfolio using scroll-triggered animations and cohesive visual identity.",
    ],
  },
  {
    id: "wikireels", num: "10", name: "Wikireels", tag: "UI · Experiment", year: "2024", color: "#9b5de5",
    tagline: "Wikipedia reimagined as a vertical reel — snap scroll, infinite articles.",
    short: "A vertical-scrolling Wikipedia explorer reimagined as a mobile-native reel format.",
    context: "An experiment in making information consumption feel less like reading a textbook.",
    liveUrl: "https://wikireels.techiesaie.com/", tech: ["React", "Framer Motion", "Wikipedia API"],
    bullets: [
      "Infinite scroll with CSS scroll-snap so each Wikipedia article occupies exactly one viewport.",
      "Framer Motion shared-layout animations giving the feel of a native mobile app.",
    ],
  },
  {
    id: "foodexpress", num: "11", name: "FoodExpress", tag: "Full Stack", year: "2024", color: "#f4a261",
    tagline: "Full-stack food ordering platform — cart, checkout, REST API, order history.",
    short: "Complete food ordering platform from menu browsing to checkout, backed by a REST API.",
    context: "A complete end-to-end build covering every layer: database, API, auth, and React frontend.",
    liveUrl: "https://foodexpress-0v7b.onrender.com/", tech: ["React", "TypeScript", "Node.js", "MongoDB"],
    bullets: [
      "REST endpoints for user auth, cart state, order placement, and order history.",
      "Full ordering flow in React + TypeScript: menu filtering, real-time cart updates, order confirmation.",
    ],
  },
  {
    id: "modelgov", num: "12", name: "AI Model Governance Platform", tag: "AI · Enterprise", year: "2026", color: "#14b8a6",
    tagline: "Bank-grade model risk governance — workflow state machine, RAG Q&A, full audit trail.",
    short: "An internal-tool-style platform for bank model risk governance: a model registry with an explicit workflow state machine enforcing role-based transition rules server-side, every action recorded in a full append-only audit trail.",
    context: "Modelled on how a real bank's model risk team would actually govern, review, and ask questions about ML models in production — not a toy CRUD app.",
    liveUrl: "", tech: ["FastAPI", "PostgreSQL", "pgvector", "React"],
    bullets: [
      "Built a model registry and explicit workflow state machine enforcing role-based transition rules server-side, with a full append-only audit trail.",
      "Designed a RAG pipeline — local sentence-transformer embeddings, pgvector similarity search, a 5-provider LLM fallback router — for grounded document Q&A.",
      "Every AI response is schema-validated with a confidence score and source citations, falling back to 'insufficient context' instead of guessing.",
    ],
  },
  {
    id: "tryon", num: "13", name: "AI Try-On", tag: "AI · Consumer", year: "2026", color: "#ec4899",
    tagline: "Free-tier virtual try-on — community AI models, automatic fallback, zero paid APIs.",
    short: "A free-tier AI virtual try-on backend that calls community-hosted Hugging Face models with automatic provider fallback and background job processing, so people can try it without needing a paid AI API key.",
    context: "Most virtual try-on demos die the moment a paid API quota runs out. This one is built entirely on free, community-hosted models with fallback baked in.",
    liveUrl: "", tech: ["React", "FastAPI", "Python", "Hugging Face"],
    bullets: [
      "Calls community-hosted Hugging Face models with automatic provider fallback and background job processing for try-on generation.",
      "Diagnosed and patched a schema-parsing bug in a third-party AI client library (gradio_client) affecting multiple library versions.",
    ],
  },
  {
    id: "mindflow", num: "14", name: "MindFlow", tag: "AI · Developer Tool", year: "2026", color: "#06b6d4",
    tagline: "Turns any README into an interactive, narrated learning experience.",
    short: "An AI-powered developer tool that transforms README and Markdown files into interactive project maps with beginner-friendly explanations, architecture walkthroughs, interview prep, and AI-generated learning videos.",
    context: "Understanding a new codebase usually means reading hundreds of lines of documentation and figuring the rest out manually. MindFlow turns that documentation into visual graphs, AI explanations, interview prep, and narrated videos instead.",
    liveUrl: "https://mindflow-eight-green.vercel.app", tech: ["React", "FastAPI", "Python", "React Flow", "NetworkX", "Hugging Face"],
    bullets: [
      "Built a Markdown parsing engine that converts README files into a structured knowledge graph with heading hierarchy, concept detection, and connected project sections.",
      "Designed an interactive React Flow visualization where developers can explore project architecture visually instead of reading long documentation.",
      "Implemented a multi-provider AI routing system with automatic fallback across Gemini, Groq, Mistral, Cohere, and OpenRouter for reliable AI explanations.",
      "Built an AI-powered video generation pipeline producing narrated explainer videos via LLM-generated scripts, Gemini Text-to-Speech, custom frame rendering, and FFmpeg encoding.",
      "Developed asynchronous background job processing with progress tracking so long-running AI video generation never blocks the UI.",
      "Deployed the frontend on Vercel and the AI backend on Hugging Face Spaces with Docker-based deployment and environment-based provider configuration.",
    ],
  },
];

const SKILLS_DATA = {
  Frontend: { items: ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Framer Motion"], color: C.coral },
  Backend: { items: ["Node.js", "Django (Python)", "PHP", "Rust"], color: C.ink },
  Database: { items: ["PostgreSQL", "MySQL", "MongoDB", "Redis"], color: "#0ea5e9" },
  Tools: { items: ["Git", "GitHub", "Vercel", "WebRTC", "WebSockets"], color: "#10b981" },
};

const TECH_NODES = [
  { name: "React", color: "#61dafb" },
  { name: "Node.js", color: "#68a063" },
  { name: "PostgreSQL", color: "#336791" },
  { name: "PHP", color: "#8892bf" },
  { name: "Django", color: "#0c4b33" },
  { name: "WebRTC", color: "#e27d60" },
  { name: "Redis", color: "#d82c20" },
  { name: "TypeScript", color: "#3178c6" },
  { name: "MySQL", color: "#00758f" },
  { name: "Supabase", color: "#3ecf8e" },
  { name: "WebSockets", color: "#8b5cf6" },
  { name: "Stripe", color: "#6772e5" },
];

// ── Card wrapper ───────────────────────────────────────────────
function Card({ children, style = {}, delay = 0, onClick }) {
  const ref = useRef();
  const inView = useInView(ref, { once: true, margin: "-8px" });
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.44, delay, ease: EASE }}
      whileHover={onClick ? { y: -4 } : { y: -1 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        background: C.card, borderRadius: 16,
        border: `1px solid ${hov && onClick ? C.coral + "55" : C.line}`,
        overflow: "hidden", position: "relative",
        cursor: onClick ? "pointer" : "default",
        transition: "border-color 0.2s ease", ...style,
      }}
    >
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: hov ? 1 : 0 }}
        transition={{ duration: 0.28, ease: EASE }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: C.coral, transformOrigin: "left", zIndex: 10, pointerEvents: "none" }}
      />
      {children}
    </motion.div>
  );
}



function ProfileStrip() {
  const [time, setTime] = useState("");
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    const upd = () => setTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }));
    upd(); const id = setInterval(upd, 1000); return () => clearInterval(id);
  }, []);
  const bullets = [
    "Sole developer of DriveAccessible — a full fleet rental SaaS (Core PHP, JS) now used by 5+ companies within 4 months of launch.",
    "Shipped 150+ production features end-to-end: backend APIs, admin tools, reporting systems, and customer-facing UI.",
    "Built conflict-detection to prevent double-bookings, a billing engine with daily-rate pricing, deposits, partial payments, and PDF invoices.",
    "Owned the entire stack in a live environment: frontend, backend, DB optimisation, deployment debugging, and operational tooling.",
  ];

  return (
    <div className="profile-strip" style={{ padding: "28px 30px", display: "grid", gridTemplateColumns: "270px 1fr", gap: 32 }}>
      {/* Left: identity */}
      <div className="profile-strip-left" style={{ display: "flex", flexDirection: "column", gap: 16, borderRight: `1px solid ${C.line}`, paddingRight: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img src={niceFace} alt="" style={{ width: 50, height: 50, objectFit: "contain", background: "#fff", borderRadius: 14, border: `1.5px solid ${C.coralLight}`, boxShadow: "0 6px 20px rgba(35,38,66,0.10)", display: "block" }} />
            <span style={{ position: "absolute", bottom: -2, right: -2, width: 12, height: 12, borderRadius: "50%", background: "#22c55e", border: "2px solid #fff", display: "block" }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 16, fontWeight: 950, color: C.navy, margin: 0, letterSpacing: "-0.03em" }}>Imran Khan</p>
            <p style={{ fontSize: 10.5, color: C.coral, fontWeight: 850, margin: "2px 0 0", letterSpacing: "0.01em" }}>Full-Stack Engineer</p>
          </div>
        </div>

        <p style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.65, margin: 0, fontWeight: 550 }}>
          Building <span style={{ color: C.coral, fontWeight: 850 }}>secure SaaS systems</span>, booking engines, billing flows, and realtime tools.
        </p>

        <div style={{ display: "flex", gap: 20 }}>
          <div>
            <p style={{ fontSize: 21, fontWeight: 950, color: C.coral, margin: 0, letterSpacing: "-0.03em" }}>60+</p>
            <p style={{ fontSize: 8.5, fontWeight: 850, textTransform: "uppercase", letterSpacing: "0.1em", color: C.muted, margin: "2px 0 0" }}>Fixes</p>
          </div>
          <div>
            <p style={{ fontSize: 21, fontWeight: 950, color: C.navy, margin: 0, letterSpacing: "-0.03em" }}>{PROJECTS.length}</p>
            <p style={{ fontSize: 8.5, fontWeight: 850, textTransform: "uppercase", letterSpacing: "0.1em", color: C.muted, margin: "2px 0 0" }}>Projects</p>
          </div>
        </div>

        <p style={{ fontSize: 11, color: C.ink, margin: "auto 0 0", fontWeight: 600 }}>
          <span style={{ color: C.muted, fontWeight: 700, textTransform: "uppercase", fontSize: 8.5, letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>Primary stack</span>
          PHP · PostgreSQL · Node.js · React
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.line}`, paddingTop: 12 }}>
          <span style={{ fontSize: 9, color: C.muted, fontWeight: 600 }}>Mumbai · Open to work</span>
          <span style={{ fontSize: 9, color: C.muted, fontFamily: "monospace" }}>{time}</span>
        </div>
      </div>

      {/* Right: experience */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <p style={{ fontSize: 8.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.18em", color: C.coral, margin: "0 0 4px" }}>Experience</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <h3 style={{ fontSize: 16, fontWeight: 950, color: C.navy, margin: 0, letterSpacing: "-0.02em" }}>Associate Software Engineer</h3>
            <p style={{ fontSize: 11, color: C.muted, margin: 0, fontWeight: 700 }}>SvayambhuTech · Mumbai</p>
            <span style={{ fontSize: 9, color: C.coral, background: C.coralFaint, borderRadius: 999, padding: "2px 8px", fontWeight: 850, whiteSpace: "nowrap" }}>Oct 2025 – Present</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 22 }}>
          {[["150+", "features shipped"], ["5+", "companies using it"], ["4 mo", "to production"]].map(([n, l]) => (
            <div key={l}>
              <p style={{ fontSize: 17, fontWeight: 950, color: C.coral, margin: 0, letterSpacing: "-0.03em" }}>{n}</p>
              <p style={{ fontSize: 8, color: C.muted, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", margin: "2px 0 0" }}>{l}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {(expanded ? bullets : bullets.slice(0, 2)).map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: i === 0 ? C.coral : C.soft, border: i !== 0 ? `1px solid ${C.line}` : "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke={i === 0 ? "#fff" : C.muted} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <p style={{ fontSize: 11.5, color: C.ink, margin: 0, lineHeight: 1.55 }}>{b}</p>
            </div>
          ))}
          <button onClick={() => setExpanded(e => !e)} style={{ alignSelf: "flex-start", fontSize: 9.5, color: C.coral, fontWeight: 800, background: "none", border: "none", padding: 0, cursor: "pointer", marginTop: 2 }}>
            {expanded ? "Show less ↑" : `+${bullets.length - 2} more ↓`}
          </button>
        </div>

        <p style={{ fontSize: 10.5, color: C.muted, margin: "auto 0 0", fontWeight: 600, borderTop: `1px solid ${C.line}`, paddingTop: 10 }}>PHP · MySQL · JavaScript · Core PHP</p>
      </div>
    </div>
  );
}

// ── ProjectsCycleCard ──────────────────────────────────────────
function ProjectsCycleCard({ onClick }) {
  const [idx, setIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [hoveredDot, setHoveredDot] = useState(null);
  const featured = PROJECTS.slice(0, 6);

  useEffect(() => {
    if (hovered) return;
    const id = setInterval(() => setIdx(i => (i + 1) % featured.length), 3200);
    return () => clearInterval(id);
  }, [hovered]);

  const cur = featured[idx];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{ padding: 0, height: "100%", display: "flex", flexDirection: "column", cursor: "pointer", background: C.card, border: `1.5px solid ${hovered ? cur.color + "44" : C.line}`, borderRadius: "inherit", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s", boxShadow: hovered ? `0 8px 32px ${cur.color}22` : "none" }}>
      {/* Top bar */}
      <div style={{ height: 5, background: `linear-gradient(90deg, ${C.navy} 0%, ${cur.color} 100%)`, transition: "background 0.3s" }} />

      <div style={{ padding: "20px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 8, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", color: C.coral, margin: "0 0 2px" }}>
              {hovered ? "Hover to browse" : "Auto-cycling"}
            </p>
            <p style={{ fontSize: 13, fontWeight: 900, color: C.navy, margin: 0, letterSpacing: "-0.02em" }}>{PROJECTS.length} shipped projects</p>
          </div>
          {/* Dot nav */}
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {featured.map((p, i) => (
              <button key={i}
                onClick={e => { e.stopPropagation(); setIdx(i); }}
                onMouseEnter={() => setHoveredDot(i)}
                onMouseLeave={() => setHoveredDot(null)}
                style={{ width: i === idx ? 20 : hoveredDot === i ? 10 : 6, height: 6, borderRadius: 3, background: i === idx ? cur.color : hoveredDot === i ? C.muted : C.line, border: "none", cursor: "pointer", padding: 0, transition: "all 0.25s ease", position: "relative" }}
              />
            ))}
          </div>
        </div>

        {/* Animated project card */}
        <AnimatePresence mode="wait">
          <motion.div key={cur.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28, ease: EASE }} style={{ flex: 1, display: "flex", flexDirection: "column" }}>

            {/* Tag + year row */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: cur.color, display: "inline-block", boxShadow: hovered ? `0 0 0 4px ${cur.color}22` : "none", transition: "box-shadow 0.2s" }} />
              <span style={{ fontSize: 9, fontWeight: 800, color: cur.color, background: cur.color + "14", padding: "2px 8px", borderRadius: 99, letterSpacing: "0.06em", textTransform: "uppercase" }}>{cur.tag}</span>
              <span style={{ fontSize: 9, color: C.muted, fontFamily: "monospace" }}>{cur.year}</span>
              {cur.liveUrl && <span style={{ fontSize: 9, color: "#22c55e", fontWeight: 900, background: "#dcfce7", padding: "2px 7px", borderRadius: 99, marginLeft: "auto" }}>● Live</span>}
            </div>

            {/* Title + tagline */}
            <h4 style={{ fontSize: 22, fontWeight: 950, color: C.navy, margin: "0 0 6px", letterSpacing: "-0.04em" }}>{cur.name}</h4>
            <p style={{ fontSize: 12.5, color: cur.color, fontWeight: 850, margin: "0 0 12px", lineHeight: 1.4 }}>{cur.tagline}</p>

            {/* What it does — flowing text, no nested boxes */}
            <p style={{ fontSize: 12, color: C.ink, lineHeight: 1.62, margin: "0 0 10px", flex: 1 }}>{cur.short}</p>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 16 }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: cur.color, marginTop: 7, flexShrink: 0 }} />
              <p style={{ fontSize: 11.5, color: C.muted, margin: 0, lineHeight: 1.55 }}>{cur.bullets[0]}</p>
            </div>

            {/* Footer: tech + link */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, borderTop: `1px solid ${C.line}`, paddingTop: 14 }}>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {cur.tech.slice(0, 3).map(t => (
                  <span key={t} style={{ fontSize: 9.5, fontWeight: 700, color: C.navy, background: C.coralFaint, padding: "3px 8px", borderRadius: 99, border: `1px solid ${C.coralLight}` }}>{t}</span>
                ))}
                {cur.tech.length > 3 && <span style={{ fontSize: 9.5, color: C.muted, fontWeight: 700 }}>+{cur.tech.length - 3}</span>}
              </div>
              <span style={{ fontSize: 10, color: cur.color, fontWeight: 900, opacity: hovered ? 1 : 0.5, transition: "opacity 0.2s", whiteSpace: "nowrap" }}>See all {PROJECTS.length} →</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── SkillsCard ─────────────────────────────────────────────────
const SKILLS_EXPANDED = {
  Frontend: { color: C.coral, items: ["React", "TypeScript", "JavaScript", "Framer Motion", "Next.js", "Tailwind CSS"] },
  Backend: { color: C.ink, items: ["Node.js", "FastAPI", "Python", "Django", "PHP", "Express", "REST APIs"] },
  Database: { color: "#0ea5e9", items: ["PostgreSQL", "Redis", "MySQL", "MongoDB", "Supabase", "pgvector"] },
  AI: { color: "#8b5cf6", items: ["LLMs", "Hugging Face", "React Flow", "NetworkX", "WebSockets", "WebRTC", "Docker"] },
};

function SkillsCard({ goToProject }) {
  const [hovered, setHovered] = useState(null); // { name, color }
  const hoveredProjects = hovered
    ? (TECH_PROJECTS[hovered.name] || []).map(name => PROJECTS.find(p => p.name === name)).filter(Boolean)
    : [];

  return (
    <div style={{ padding: "20px 22px", height: "100%", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
      <div style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 8.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.18em", color: C.muted, margin: "0 0 2px" }}>Tech Stack</p>
        <h3 style={{ fontSize: 13.5, fontWeight: 950, color: C.navy, margin: 0, letterSpacing: "-0.02em" }}>
          {hovered ? (
            <span style={{ color: hovered.color }}>
              {hovered.name}
              <span style={{ color: C.muted, fontWeight: 500, fontSize: 11 }}> — {hoveredProjects.length > 0 ? `used in ${hoveredProjects.length} project${hoveredProjects.length > 1 ? "s" : ""}` : "in toolkit"}</span>
            </span>
          ) : "Hover a skill →"}
        </h3>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 11 }}>
        {Object.entries(SKILLS_EXPANDED).map(([cat, { color, items }]) => (
          <div key={cat}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
              <span style={{ width: 14, height: 2.5, background: color, borderRadius: 99, display: "inline-block" }} />
              <p style={{ fontSize: 8, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color, margin: 0 }}>{cat}</p>
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {items.map(name => {
                const isHov = hovered?.name === name;
                return (
                  <span
                    key={name}
                    onMouseEnter={() => setHovered({ name, color })}
                    style={{
                      fontSize: 10, fontWeight: isHov ? 800 : 600,
                      color: isHov ? "#fff" : C.ink,
                      background: isHov ? color : C.soft,
                      padding: "3px 9px", borderRadius: 6,
                      border: `1px solid ${isHov ? color : C.line}`,
                      cursor: "default", transition: "all 0.14s ease",
                      boxShadow: isHov ? `0 2px 8px ${color}44` : "none",
                    }}
                  >
                    {name}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Linked projects — stays showing the last-hovered skill, click to open */}
      <div style={{ marginTop: 12, minHeight: 50, padding: "10px 12px", borderRadius: 10, background: hoveredProjects.length > 0 ? "#f0f9ff" : "#f7f4ef", border: `1px solid ${hovered ? hovered.color + "30" : C.line}`, transition: "all 0.18s" }}>
        {hovered ? (
          hoveredProjects.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {hoveredProjects.map(p => (
                <button
                  key={p.id}
                  onClick={() => goToProject?.(p)}
                  style={{ fontSize: 9.5, fontWeight: 800, color: p.color, background: p.color + "12", border: `1px solid ${p.color}30`, padding: "3px 9px", borderRadius: 99, cursor: "pointer", fontFamily: "inherit" }}
                >
                  {p.num} {p.name}
                </button>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 10, color: C.muted, margin: 0 }}>In toolkit — not yet featured in a public project.</p>
          )
        ) : (
          <p style={{ fontSize: 10, color: C.muted, margin: 0 }}>Hover any skill above to see which projects use it.</p>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TECH NETWORK CARD — interactive map with dedicated hover panel
// ══════════════════════════════════════════════════════════════

// Nodes placed in a compact 260×166 coordinate space
const NODE_POSITIONS = [
  { name: "React", color: "#61dafb", cx: 132, cy: 30 },
  { name: "Node.js", color: "#68a063", cx: 202, cy: 42 },
  { name: "PostgreSQL", color: "#336791", cx: 224, cy: 98 },
  { name: "PHP", color: "#8892bf", cx: 188, cy: 140 },
  { name: "Django", color: "#44b78b", cx: 126, cy: 148 },
  { name: "WebRTC", color: "#e27d60", cx: 72, cy: 126 },
  { name: "Redis", color: "#d82c20", cx: 42, cy: 78 },
  { name: "TypeScript", color: "#3178c6", cx: 74, cy: 36 },
  { name: "MySQL", color: "#00758f", cx: 168, cy: 86 },
  { name: "Supabase", color: "#3ecf8e", cx: 112, cy: 94 },
  { name: "WebSockets", color: "#8b5cf6", cx: 226, cy: 22 },
  { name: "Stripe", color: "#6772e5", cx: 54, cy: 116 },
];

const EDGES = [
  [0, 1], [0, 7], [0, 8], [0, 9], [1, 2], [1, 8], [2, 3], [2, 8],
  [3, 4], [4, 5], [4, 9], [5, 6], [5, 9], [6, 7], [6, 11], [7, 10],
  [8, 9], [10, 1], [11, 6], [3, 9], [2, 4]
];

function TechNetworkCard({ goToProject }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const activeNode = hoveredIndex !== null ? NODE_POSITIONS[hoveredIndex] : null;
  const projects = activeNode
    ? (TECH_PROJECTS[activeNode.name] || [])
      .map(name => PROJECTS.find(p => p.name === name))
      .filter(Boolean)
    : [];
  const previewProjects = projects.slice(0, 4);

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", height: "100%", minHeight: 340, boxSizing: "border-box" }}>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 16, flexShrink: 0 }}>
        <div>
          <p style={{ fontSize: 8.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em", color: C.muted, margin: "0 0 1px" }}>Tech Stack</p>
          <p style={{ fontSize: 16, fontWeight: 900, color: C.ink, margin: 0, letterSpacing: "-0.02em" }}>Hover a node to see what it built</p>
        </div>
        {activeNode ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9.5, color: activeNode.color, fontWeight: 800, marginTop: 2, whiteSpace: "nowrap", background: activeNode.color + "12", borderRadius: 99, padding: "5px 10px" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: activeNode.color }} />
            {activeNode.name}
          </div>
        ) : (
          <span style={{ fontSize: 9.5, color: C.muted, fontWeight: 700, marginTop: 2, whiteSpace: "nowrap" }}>hover any node ✨</span>
        )}
      </div>

      <div className="tech-card-grid" style={{ display: "grid", gridTemplateColumns: "minmax(235px, 1fr) 220px", gap: 14, flex: 1, height: 260, minHeight: 260 }}>
        {/* Network SVG */}
        <div style={{ position: "relative", height: 260, minHeight: 260, borderRadius: 14, background: "#fbfaf7", border: `1px solid ${C.line}`, overflow: "hidden" }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 260 166"
            style={{ display: "block", overflow: "visible", height: 232, minHeight: 232, padding: "14px 8px 0", boxSizing: "border-box" }}
          >
            {EDGES.map(([a, b], i) => {
              const na = NODE_POSITIONS[a], nb = NODE_POSITIONS[b];
              const isActive = hoveredIndex === a || hoveredIndex === b;
              return (
                <line key={i}
                  x1={na.cx} y1={na.cy} x2={nb.cx} y2={nb.cy}
                  stroke={isActive ? activeNode.color : "rgba(61,64,91,0.14)"}
                  strokeWidth={isActive ? 1.4 : 0.7}
                  opacity={isActive ? 0.95 : 0.55}
                  style={{ transition: "stroke 0.15s, stroke-width 0.15s, opacity 0.15s" }}
                />
              );
            })}

            {NODE_POSITIONS.map((nd, i) => {
              const isHov = hoveredIndex === i;
              const isConn = hoveredIndex !== null && EDGES.some(([a, b]) => (a === hoveredIndex && b === i) || (b === hoveredIndex && a === i));
              const r = isHov ? 7.5 : isConn ? 5.6 : 4.6;
              const labelRight = nd.cx > 130;
              const lx = nd.cx + (labelRight ? r + 6 : -(r + 6));
              const anchor = labelRight ? "start" : "end";
              return (
                <motion.g
                  key={nd.name}
                  onMouseEnter={() => setHoveredIndex(i)}
                  animate={{ opacity: hoveredIndex === null || isHov || isConn ? 1 : 0.4 }}
                  transition={{ duration: 0.15 }}
                  style={{ cursor: "pointer" }}
                >
                  {isHov && <circle cx={nd.cx} cy={nd.cy} r={r + 8} fill={nd.color + "1c"} />}
                  <circle
                    cx={nd.cx}
                    cy={nd.cy}
                    r={r}
                    fill={nd.color}
                    stroke={isHov ? "#fff" : "transparent"}
                    strokeWidth={isHov ? 2 : 0}
                    style={{ transition: "r 0.15s" }}
                  />
                  <text x={lx} y={nd.cy + 3.5}
                    textAnchor={anchor}
                    fontSize={isHov ? "8.2" : "7"}
                    fontWeight={isHov ? "850" : "650"}
                    fill={isHov ? C.navy : isConn ? C.ink : "rgba(61,64,91,0.6)"}
                    style={{ transition: "fill 0.15s", fontFamily: "system-ui,sans-serif", pointerEvents: "none" }}
                  >
                    {nd.name}
                  </text>
                  <circle cx={nd.cx} cy={nd.cy} r="15" fill="transparent" />
                </motion.g>
              );
            })}
          </svg>
        </div>

        {/* Dedicated hover detail panel */}
        <div style={{ height: 260, minHeight: 260, borderRadius: 14, border: `1px solid ${activeNode ? activeNode.color + "34" : C.line}`, background: activeNode ? activeNode.color + "0b" : C.soft, padding: "14px", overflow: "hidden", display: "flex", flexDirection: "column", boxSizing: "border-box", transition: "background 0.18s, border-color 0.18s" }}>
          {activeNode ? (
            <div key={activeNode.name}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: activeNode.color, boxShadow: `0 0 0 5px ${activeNode.color}18` }} />
                <div>
                  <p style={{ fontSize: 12.5, fontWeight: 900, color: C.ink, margin: 0 }}>{activeNode.name}</p>
                  <p style={{ fontSize: 8.5, color: C.muted, fontWeight: 700, margin: "1px 0 0", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {projects.length} linked project{projects.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="custom-scrollbar" style={{ height: 195, overflowY: "auto", paddingRight: 2, display: "flex", flexDirection: "column", gap: 7 }}>
                {previewProjects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => goToProject?.(p)}
                    style={{ padding: "9px 10px", borderRadius: 10, background: C.card, border: `1px solid ${C.line}`, boxShadow: "0 5px 14px rgba(61,64,91,0.045)", textAlign: "left", cursor: "pointer", width: "100%", display: "block" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                      <p style={{ fontSize: 10.6, color: C.ink, fontWeight: 850, margin: 0 }}>{p.name}</p>
                      <span style={{ marginLeft: "auto", fontSize: 9, color: p.color, fontWeight: 800 }}>View →</span>
                    </div>
                    <p style={{
                      fontSize: 9.2,
                      color: C.muted,
                      margin: 0,
                      lineHeight: 1.35,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>{p.short}</p>
                  </button>
                ))}
                {projects.length > previewProjects.length && (
                  <p style={{ fontSize: 9.4, color: activeNode.color, fontWeight: 850, margin: "1px 0 0" }}>
                    +{projects.length - previewProjects.length} more project{projects.length - previewProjects.length > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 7, padding: "0 12px" }}>
              <span style={{ fontSize: 22 }}>🔗</span>
              <p style={{ fontSize: 11, color: C.muted, margin: 0, lineHeight: 1.5, fontWeight: 600 }}>Hover any node on the map to see which projects use it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function IntroLine({ onResume }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: EASE }}
      style={{ marginBottom: 20 }}
    >
      {/* Status pill */}
      <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 800, color: C.coral, background: C.coralFaint, border: `1px solid ${C.coralLight}`, borderRadius: 999, padding: "4px 11px", letterSpacing: "0.04em" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.coral, display: "inline-block", boxShadow: `0 0 0 3px ${C.coralLight}` }} />
          Open to work · Mumbai
        </span>
      </div>

      {/* Main headline */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
        <div style={{ minWidth: 0 }}>
          <h1 className="intro-headline" style={{ fontSize: 34, lineHeight: 1.15, color: C.navy, margin: "0 0 10px", fontWeight: 950, letterSpacing: "-0.045em", maxWidth: 680 }}>
            Hi, I&apos;m{" "}
            <span style={{ color: C.coral }}>Imran</span>
            {" "}— full-stack engineer building reliable{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              SaaS, fintech &amp; realtime
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
                style={{ position: "absolute", left: 0, right: 0, bottom: -1, height: 2.5, background: C.coral, transformOrigin: "left", display: "block" }}
              />
            </span>{" "}
            systems.
          </h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.65, maxWidth: 560, fontWeight: 500 }}>
            I ship production software: booking engines, billing pipelines, WebRTC collaboration, and AI-assisted tools. Based in Mumbai, open to remote and relocation roles.
          </p>
        </div>

        <div className="intro-buttons" style={{ display: "flex", gap: 8, flexShrink: 0, alignSelf: "flex-end" }}>
          <button onClick={onResume} style={{ border: `1.5px solid ${C.navy}`, background: "transparent", color: C.navy, borderRadius: 999, padding: "9px 18px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer", whiteSpace: "nowrap" }}>
            Resume
          </button>
          <a href="mailto:muhammadimrank034@gmail.com" style={{ textDecoration: "none", background: C.coral, color: "#fff", borderRadius: 999, padding: "9px 18px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
            Contact
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════
// HOME PAGE
// ══════════════════════════════════════════════════════════════
function HomePage({ setPage, onResume }) {
  return (
    <div className="page-shell" style={{ paddingTop: 78, paddingBottom: 48 }}>
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 20px" }}>
        <IntroLine onResume={onResume} />

        {/* Row 1: identity + experience, one clean strip */}
        <div style={{ marginBottom: 10 }}>
          <Card delay={0.02}><ProfileStrip /></Card>
        </div>

        {/* Row 2: tech-to-project map gets room to breathe */}
        <div style={{ marginBottom: 10 }}>
          <Card delay={0.05}><TechNetworkCard /></Card>
        </div>

        {/* Row 3: larger project story with skills beside it */}
        <div className="home-grid-bottom" style={{ display: "grid", gridTemplateColumns: "1.35fr 0.9fr", gap: 10, marginBottom: 10 }}>
          <Card delay={0.08} onClick={() => setPage("work")}><ProjectsCycleCard onClick={() => setPage("work")} /></Card>
          <Card delay={0.10}><SkillsCard /></Card>
        </div>

        {/* Row 4: Featured Work grid — real projects, visible without clicking anywhere */}
        <FeaturedWorkSection setPage={setPage} />
      </div>
    </div>
  );
}

// ── FeaturedWorkSection ────────────────────────────────────────
function FeaturedWorkSection({ setPage }) {
  const featured = PROJECTS.slice(0, 6);
  return (
    <div style={{ marginTop: 4 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div>
          <p style={{ fontSize: 8.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.18em", color: C.coral, margin: "0 0 3px" }}>Featured Work</p>
          <h2 style={{ fontSize: 19, fontWeight: 950, color: C.navy, margin: 0, letterSpacing: "-0.03em" }}>What I've actually shipped</h2>
        </div>
        <button onClick={() => setPage("work")} style={{ fontSize: 10.5, fontWeight: 800, color: C.coral, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: "4px 0" }}>
          View all {PROJECTS.length} projects
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </button>
      </div>

      <div className="featured-work-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {featured.map((p, i) => (
          <FeaturedProjectCard key={p.id} p={p} delay={0.06 + i * 0.03} onClick={() => setPage("work")} />
        ))}
      </div>
    </div>
  );
}

function FeaturedProjectCard({ p, delay, onClick }) {
  const ref = useRef();
  const inView = useInView(ref, { once: true, margin: "-8px" });
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay, ease: EASE }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{ background: C.card, border: `1.5px solid ${hov ? p.color + "55" : C.line}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "border-color 0.18s, box-shadow 0.18s, transform 0.18s", boxShadow: hov ? `0 10px 28px ${p.color}22` : "none", transform: hov ? "translateY(-2px)" : "none" }}
    >
      <div style={{ height: 4, background: p.color }} />
      <div style={{ padding: "15px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 8.5, fontWeight: 700, color: C.muted, fontFamily: "monospace" }}>{p.num}</span>
            <span style={{ fontSize: 8, fontWeight: 900, color: p.color, background: p.color + "14", padding: "2px 7px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.08em" }}>{p.tag}</span>
          </div>
          {p.liveUrl ? (
            <span style={{ fontSize: 8.5, color: "#22c55e", fontWeight: 900, display: "flex", alignItems: "center", gap: 3 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />Live
            </span>
          ) : (
            <span style={{ fontSize: 8.5, color: C.muted, fontWeight: 700 }}>{p.year}</span>
          )}
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 950, color: C.navy, margin: "0 0 5px", letterSpacing: "-0.025em" }}>{p.name}</h3>
        <p style={{ fontSize: 11, color: p.color, fontWeight: 750, margin: "0 0 8px", lineHeight: 1.4, minHeight: 30 }}>{p.tagline}</p>

        <p style={{ fontSize: 10.8, color: C.ink, margin: "0 0 12px", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.bullets[0]}</p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6, borderTop: `1px solid ${C.line}`, paddingTop: 11 }}>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {p.tech.slice(0, 3).map(t => (
              <span key={t} style={{ fontSize: 9, fontWeight: 700, color: C.navy, background: C.soft, padding: "2px 7px", borderRadius: 99, border: `1px solid ${C.line}` }}>{t}</span>
            ))}
          </div>
          <span style={{ fontSize: 9.5, color: p.color, fontWeight: 900, opacity: hov ? 1 : 0.45, transition: "opacity 0.18s", whiteSpace: "nowrap" }}>Details →</span>
        </div>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════
// WORK PAGE
// ══════════════════════════════════════════════════════════════
function WorkPage() {
  const [activeProject, setActiveProject] = useState(null);

  return (
    <div className="page-shell" style={{ paddingTop: 80, paddingBottom: 60, maxWidth: 1060, margin: "0 auto", padding: "80px 20px 60px" }}>
      <div style={{ borderBottom: `1px solid ${C.line}`, paddingBottom: 18, marginBottom: 24, display: "flex", justifyContent: "space-between", gap: 18, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div>
          <span style={{ fontSize: 9, fontWeight: 900, color: C.coral, letterSpacing: "0.2em", textTransform: "uppercase" }}>Archive</span>
          <h2 style={{ fontSize: 26, fontWeight: 950, color: C.navy, margin: "5px 0 0", letterSpacing: "-0.04em" }}>All Projects</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 22, fontWeight: 950, color: C.coral, margin: 0, letterSpacing: "-0.04em" }}>{PROJECTS.length}</p>
              <p style={{ fontSize: 8.5, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", margin: "1px 0 0" }}>shipped</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 22, fontWeight: 950, color: C.navy, margin: 0, letterSpacing: "-0.04em" }}>{PROJECTS.filter(p => p.liveUrl).length}</p>
              <p style={{ fontSize: 8.5, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", margin: "1px 0 0" }}>live now</p>
            </div>
          </div>
        </div>
      </div>

      <p style={{ fontSize: 11, color: C.muted, fontWeight: 600, margin: "0 0 14px" }}>Tap any project for the full build breakdown.</p>

      <div className="featured-work-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {PROJECTS.map((p, i) => (
          <FeaturedProjectCard key={p.id} p={p} delay={Math.min(i * 0.02, 0.3)} onClick={() => setActiveProject(p)} />
        ))}
      </div>

      <ProjectDetailSheet project={activeProject} onClose={() => setActiveProject(null)} />
    </div>
  );
}

// ── ProjectDetailSheet ──────────────────────────────────────────
function ProjectDetailSheet({ project, onClose }) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(35,38,66,0.38)", backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            onClick={e => e.stopPropagation()}
            style={{ width: "100%", maxWidth: 760, maxHeight: "92vh", overflowY: "auto", background: C.bg, borderRadius: "22px 22px 0 0", border: `1px solid ${C.line}`, boxShadow: "0 -24px 80px rgba(35,38,66,0.28)" }}
          >
            <div style={{ position: "sticky", top: 0, zIndex: 2, background: C.bg, paddingTop: 14, paddingBottom: 2 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                <div style={{ width: 48, height: 4, borderRadius: 999, background: "rgba(35,38,66,0.18)" }} />
              </div>
              <div style={{ height: 4, background: `linear-gradient(90deg, ${project.color}, ${project.color}66)` }} />
            </div>

            <div className="work-detail-padding" style={{ padding: "26px 30px 36px" }}>
              <div style={{ marginBottom: 22 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: project.color, background: project.color + "16", padding: "4px 10px", borderRadius: 99, border: `1px solid ${project.color}28` }}>{project.tag}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: C.muted, fontFamily: "monospace" }}>{project.year}</span>
                  </div>
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                      style={{ fontSize: 10.5, fontWeight: 800, color: project.color, background: project.color + "10", padding: "6px 14px", borderRadius: 9, textDecoration: "none", border: `1px solid ${project.color}28`, display: "inline-flex", alignItems: "center", gap: 5 }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                      {project.urls?.[0] || "Live Site"}
                    </a>
                  )}
                </div>
                <h3 style={{ fontSize: 26, fontWeight: 950, color: C.navy, margin: "0 0 8px", letterSpacing: "-0.04em" }}>{project.name}</h3>
                <p style={{ fontSize: 14, color: project.color, fontWeight: 750, margin: "0 0 12px", lineHeight: 1.4 }}>{project.tagline}</p>
                <p style={{ fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.65 }}>{project.short}</p>
              </div>

              {project.context && (
                <div style={{ marginBottom: 22, padding: "14px 16px", background: project.color + "0d", borderLeft: `3px solid ${project.color}`, borderRadius: "0 10px 10px 0" }}>
                  <p style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: project.color, margin: "0 0 5px" }}>Why it was built</p>
                  <p style={{ fontSize: 12, color: C.ink, margin: 0, lineHeight: 1.58 }}>{project.context}</p>
                </div>
              )}

              {project.urls?.[1] && (
                <div style={{ marginBottom: 18 }}>
                  <a href={project.fleetUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                    style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, background: C.soft, padding: "6px 14px", borderRadius: 8, textDecoration: "none", border: `1px solid ${C.line}`, display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    {project.urls[1]}
                  </a>
                </div>
              )}

              <div style={{ marginBottom: 22 }}>
                <p style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.14em", color: C.muted, marginBottom: 12 }}>What was built</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {project.bullets.map((b, i) => (
                    <div key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                      <span style={{ width: i === 0 ? 5 : 4, height: i === 0 ? 5 : 4, borderRadius: "50%", background: i === 0 ? project.color : C.muted, marginTop: 7, flexShrink: 0 }} />
                      <p style={{ fontSize: 12.5, color: i === 0 ? C.navy : C.ink, margin: 0, lineHeight: 1.62, fontWeight: i === 0 ? 650 : 450 }}>{b}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: "16px 18px", background: C.navy, borderRadius: 12 }}>
                <p style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>Stack</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {project.tech.map(t => (
                    <span key={t} style={{ fontSize: 11, background: "rgba(255,255,255,0.1)", color: "#fff", padding: "5px 12px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.12)", fontWeight: 650 }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ══════════════════════════════════════════════════════════════
// ABOUT PAGE
// ══════════════════════════════════════════════════════════════
function AboutPage() {
  const proof = [
    { k: "60+", v: "production issues resolved", c: C.coral },
    { k: String(PROJECTS.length), v: "projects shipped", c: C.navy },
    { k: "5", v: "domains: SaaS, fintech, realtime, AI", c: "#0ea5e9" },
  ];

  const operatingPoints = [
    "I like systems that make invalid states hard to create: database constraints, idempotency keys, row-level permissions, and clear state transitions.",
    "I care about boring operational details because that is where real software breaks: invoices, renewals, partial payments, retries, stuck jobs, and edge-case booking windows.",
    "I build from both ends: the backend has to be reliable, and the UI has to make the workflow obvious enough for non-technical teams to use every day.",
  ];

  const principles = [
    { n: "01", title: "Data cannot bleed", body: "Tenant isolation belongs as close to the database as possible. RLS, scoped queries, and role checks should work together." },
    { n: "02", title: "Money is integers", body: "Financial systems should avoid floating point drift. Amounts, refunds, retries, and invoices need predictable arithmetic." },
    { n: "03", title: "Failures must recover", body: "Retries, stuck states, duplicate requests, and partial failures need explicit handling instead of hopeful happy paths." },
    { n: "04", title: "UI is operations", body: "Dashboards should surface overdue work, upcoming renewals, and risky states before humans have to hunt for them." },
  ];

  const timelineItems = [
    { year: "2021", event: "Wrote first PHP script. Immediately broke the database." },
    { year: "2022", event: "Started BSc IT at Mumbai University. Built first REST API." },
    { year: "2023", event: "Shipped first multi-tenant SaaS. Learned about data isolation the hard way." },
    { year: "2024", event: "Deep-dived into fintech — payout engines, ledgers, atomic transactions, float drift." },
    { year: "2025", event: "Joined Swayambhutech as Associate SWE. Resolved 60+ production issues on Drive Accessible." },
    { year: "2026", event: "Building model governance, AI try-on tooling, and the Techiesaie studio." },
  ];

  return (
    <div className="page-shell" style={{ paddingTop: 80, paddingBottom: 60, maxWidth: 1060, margin: "0 auto", padding: "80px 20px 60px" }}>
      <div style={{ borderBottom: `1px solid ${C.line}`, paddingBottom: 18, marginBottom: 22, display: "flex", justifyContent: "space-between", gap: 18, alignItems: "flex-end" }}>
        <div>
          <span style={{ fontSize: 9, fontWeight: 900, color: C.coral, letterSpacing: "0.2em", textTransform: "uppercase" }}>About</span>
          <h2 style={{ fontSize: 30, fontWeight: 950, color: C.navy, margin: "5px 0 0", letterSpacing: "-0.05em" }}>I build practical systems for messy real-world workflows.</h2>
        </div>
        <img src={niceFace} alt="" style={{ width: 52, height: 52, objectFit: "contain", flexShrink: 0 }} />
      </div>

      <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 310px", gap: 18 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card style={{ overflow: "hidden" }} delay={0.04}>
            <div style={{ height: 5, background: `linear-gradient(90deg, ${C.navy}, ${C.coral})` }} />
            <div style={{ padding: "26px 28px" }}>
              <p style={{ fontSize: 15, color: C.ink, lineHeight: 1.75, margin: "0 0 16px", fontWeight: 550 }}>
                I'm a full-stack engineer based in Mumbai building software for teams that need reliability more than decoration: fleet operations, billing, payments, role-based dashboards, realtime collaboration, and AI-assisted tools.
              </p>
              <p style={{ fontSize: 14, color: C.ink, lineHeight: 1.72, margin: "0 0 18px" }}>
                The work I enjoy most sits where product and backend meet. I like taking an operational problem, modelling the states carefully, and shipping an interface that makes the next action clear.
              </p>
              <div className="about-proof-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 9 }}>
                {proof.map(item => (
                  <div key={item.v} style={{ padding: "13px 14px", borderRadius: 12, background: item.c === C.navy ? C.navy : item.c + "12", border: `1px solid ${item.c}28` }}>
                    <p style={{ fontSize: 22, fontWeight: 950, color: item.c === C.navy ? "#fff" : item.c, margin: 0 }}>{item.k}</p>
                    <p style={{ fontSize: 9.5, lineHeight: 1.35, color: item.c === C.navy ? "rgba(255,255,255,0.72)" : C.ink, margin: "4px 0 0", fontWeight: 750, textTransform: "uppercase", letterSpacing: "0.07em" }}>{item.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card style={{ padding: "24px 28px" }} delay={0.06}>
            <p style={{ fontSize: 9.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: C.coral, margin: "0 0 14px" }}>How I work</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {operatingPoints.map((point, i) => (
                <div key={point} style={{ display: "grid", gridTemplateColumns: "30px 1fr", gap: 12, alignItems: "start", padding: "12px 0", borderBottom: i < operatingPoints.length - 1 ? `1px solid ${C.line}` : "none" }}>
                  <span style={{ width: 30, height: 30, borderRadius: 10, background: i === 0 ? C.coral : C.navy, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 950 }}>{String(i + 1).padStart(2, "0")}</span>
                  <p style={{ fontSize: 12.6, color: C.ink, lineHeight: 1.6, margin: 0 }}>{point}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ padding: "24px 28px" }} delay={0.08}>
            <p style={{ fontSize: 9.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: C.muted, margin: "0 0 14px" }}>Engineering principles</p>
            <div className="about-proof-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {principles.map(p => (
                <div key={p.n} style={{ padding: "16px 18px", background: "#f7f4ef", border: `1px solid ${C.line}`, borderRadius: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 9, fontWeight: 900, color: C.coral, fontFamily: "monospace" }}>{p.n}</span>
                    <span style={{ fontSize: 12.2, fontWeight: 900, color: C.navy }}>{p.title}</span>
                  </div>
                  <p style={{ fontSize: 11.2, color: C.ink, margin: 0, lineHeight: 1.55 }}>{p.body}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ padding: "24px 28px" }} delay={0.12}>
            <p style={{ fontSize: 9.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: C.muted, margin: "0 0 14px" }}>Full skill set</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {Object.entries(SKILLS_DATA).map(([cat, { items, color }]) => (
                <div key={cat}>
                  <p style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color, marginBottom: 6 }}>{cat}</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {items.map(item => (
                      <span key={item} style={{ fontSize: 11, fontWeight: 600, color: C.ink, background: C.card, padding: "4px 10px", borderRadius: 6, border: `1px solid ${C.line}` }}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Card style={{ padding: "20px 22px" }} delay={0.06}>
            <p style={{ fontSize: 9.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: C.coral, margin: "0 0 13px" }}>Right now</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Location", value: "Mumbai, India" },
                { label: "Role", value: "Associate SWE · Swayambhu Tech" },
                { label: "Study", value: "BSc IT · Class of 2025" },
                { label: "Focus", value: "Fleet SaaS + Fintech systems" },
                { label: "Available", value: "Contract & Full-time roles" },
              ].map(r => (
                <div key={r.label} style={{ padding: "10px 12px", background: "#f7f4ef", border: `1px solid ${C.line}`, borderRadius: 9 }}>
                  <p style={{ fontSize: 8.5, color: C.muted, margin: "0 0 2px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{r.label}</p>
                  <p style={{ fontSize: 12, color: C.navy, margin: 0, fontWeight: 800 }}>{r.value}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ padding: "20px 22px" }} delay={0.10}>
            <p style={{ fontSize: 9.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: C.muted, margin: "0 0 13px" }}>Timeline</p>
            <div style={{ position: "relative", paddingLeft: 20 }}>
              <div style={{ position: "absolute", left: 6, top: 6, bottom: 6, width: 1, background: C.line }} />
              {timelineItems.map((t, i) => (
                <div key={t.year} style={{ position: "relative", marginBottom: i < timelineItems.length - 1 ? 14 : 0 }}>
                  <div style={{ position: "absolute", left: -17, top: 5, width: 7, height: 7, borderRadius: "50%", background: i === timelineItems.length - 1 ? C.coral : C.soft, border: `1.5px solid ${i === timelineItems.length - 1 ? C.coral : C.muted + "30"}` }} />
                  <p style={{ fontSize: 9, fontWeight: 800, color: i === timelineItems.length - 1 ? C.coral : C.muted, margin: "0 0 2px", fontFamily: "monospace" }}>{t.year}</p>
                  <p style={{ fontSize: 11, color: C.ink, margin: 0, lineHeight: 1.45 }}>{t.event}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ padding: "20px 22px", background: C.navy, border: `1px solid ${C.navy}` }} delay={0.14}>
            <p style={{ fontSize: 9.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: C.coral, margin: "0 0 9px" }}>Get in touch</p>
            <p style={{ fontSize: 12.5, color: "#fff", fontWeight: 800, margin: "0 0 4px", wordBreak: "break-word" }}>muhammadimrank034@gmail.com</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.68)", margin: "0 0 12px", lineHeight: 1.5 }}>Available for backend-heavy product work, SaaS builds, and production fixes.</p>
            <div style={{ display: "flex", gap: 7 }}>
              <a href="https://linkedin.com/in/imranrkhan13" target="_blank" rel="noreferrer"
                style={{ fontSize: 10, fontWeight: 800, color: "#fff", background: "rgba(255,255,255,0.08)", padding: "5px 12px", borderRadius: 7, textDecoration: "none", border: "1px solid rgba(255,255,255,0.14)" }}>LinkedIn</a>
              <a href="https://github.com/imranrkhan13" target="_blank" rel="noreferrer"
                style={{ fontSize: 10, fontWeight: 800, color: C.navy, background: C.coral, padding: "5px 12px", borderRadius: 7, textDecoration: "none", border: `1px solid ${C.coral}` }}>GitHub</a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// RESUME PAGE
// ══════════════════════════════════════════════════════════════
function Section({ title, color, children }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${C.line}` }}>
        <div style={{ width: 3, height: 16, background: color || C.coral, borderRadius: 2 }} />
        <h3 style={{ fontSize: 11, fontWeight: 900, color: C.ink, margin: 0, textTransform: "uppercase", letterSpacing: "0.12em" }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ResumePage() {
  const handleDownload = () => {
    const txt = `IMRAN KHAN
Mumbai, India | +91 7506190224 | muhammadimrank034@gmail.com
linkedin.com/in/imranrkhan13 | github.com/imranrkhan13 | imran-silk.vercel.app

SUMMARY
Full-stack engineer with 1+ year of production experience shipping SaaS platforms, billing engines, and real-time systems. Resolved 60+ live bugs, designed financial and booking infrastructure from scratch, shipped 13 projects across Node.js, React, PostgreSQL, Django, FastAPI, and WebRTC.

EXPERIENCE
Swayambhu Tech | Associate Software Engineer | Oct 2025 – Mar 2026 | Mumbai
• Led end-to-end delivery of DriveAccessible — fleet rental SaaS with paying customers.
• Built conflict-detection logic using transactional locking to eliminate double-bookings.
• Engineered billing: daily-rate pricing, deposits, partial payments, PDF invoice generation.
• Developed role-based admin dashboard for overdue payments, renewals, and revenue trends.
• Resolved 60+ production issues on live systems under deadline pressure.
• Shipped SEO-optimised public website with Intersection Observer animations.

PROJECTS
BillingOS | Node.js, React, PostgreSQL, Redis, Stripe, PDFKit
• Multi-tenant billing engine modelled on Stripe with subscription lifecycle and PostgreSQL Row-Level Security.
• Exponential-backoff retry queues (1h→6h→24h→72h) via Bull+Redis; idempotent Stripe webhook processing.

Payout Engine | Django, PostgreSQL, Celery, Redis
• Integer paise storage (BigIntegerField) to eliminate float drift; SELECT FOR UPDATE prevents concurrent overdrafts.
• Idempotency keys with DB-level unique constraint; atomic failure-handling in single transactions.

Vault | Node.js, WebRTC, WebSockets
• P2P file sharing with encrypted WebRTC data channels — no files touch the server.

AI Model Governance Platform | FastAPI, PostgreSQL, pgvector, React
• Model registry and workflow state machine with role-based transitions and a full append-only audit trail.
• RAG pipeline with pgvector similarity search and a 5-provider LLM fallback router for grounded document Q&A.

AI Try-On | React, FastAPI, Python, Hugging Face
• Free-tier virtual try-on backend on community-hosted Hugging Face models with automatic provider fallback.

Kanban Pro | React, Node.js, WebSockets
• Real-time collaborative Kanban: room-based WebSocket architecture, live presence, auto-reconnection.

TECHNICAL SKILLS
Frontend: React, TypeScript, JavaScript, Tailwind CSS, Next.js
Backend: Node.js, Python, Django, FastAPI, PHP
Database: PostgreSQL, MySQL, MongoDB, Redis, Supabase, pgvector
Tools/Infra: Git, Docker, Celery, WebSockets, WebRTC, GitHub Actions

EDUCATION
Bachelor of Science — Information Technology | 2022–2025
MVM College, University of Mumbai | Mumbai, India`;
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "Imran_Khan_Resume.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ paddingTop: 80, paddingBottom: 60, maxWidth: 1060, margin: "0 auto", padding: "80px 20px 60px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderBottom: `1px solid ${C.line}`, paddingBottom: 14, marginBottom: 28 }}>
        <div>
          <span style={{ fontSize: 9, fontWeight: 800, color: C.coral, letterSpacing: "0.2em", textTransform: "uppercase" }}>CV</span>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: C.ink, margin: "4px 0 0", letterSpacing: "-0.03em" }}>Resume</h2>
        </div>
        <motion.button whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }} onClick={handleDownload}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: C.coral, color: "#fff", border: "none", borderRadius: 10, fontSize: 11, fontWeight: 800, cursor: "pointer", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          Download .txt
        </motion.button>
      </div>

      <Card>
        {/* Resume header */}
        <div style={{ padding: "32px 36px 24px", borderBottom: `1px solid ${C.line}`, background: C.bg }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: C.ink, margin: "0 0 5px", letterSpacing: "-0.04em" }}>Imran Khan</h1>
              <p style={{ fontSize: 13, color: C.coral, fontWeight: 700, margin: "0 0 12px" }}>Full-Stack Engineer · Mumbai, India</p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                {["+91 7506190224", "muhammadimrank034@gmail.com"].map(c => (
                  <span key={c} style={{ fontSize: 11, color: C.muted }}>{c}</span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
                {[
                  { label: "linkedin.com/in/imranrkhan13", url: "https://linkedin.com/in/imranrkhan13" },
                  { label: "github.com/imranrkhan13", url: "https://github.com/imranrkhan13" },
                  { label: "imran-silk.vercel.app", url: "https://imran-silk.vercel.app" },
                ].map(l => (
                  <a key={l.url} href={l.url} target="_blank" rel="noreferrer"
                    style={{ fontSize: 10.5, color: C.coral, textDecoration: "none", fontWeight: 600 }}>{l.label}</a>
                ))}
              </div>
            </div>
            <div style={{ width: 50, height: 50, borderRadius: 13, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#fff" }}>IK</div>
          </div>
        </div>

        <div style={{ padding: "28px 36px", display: "flex", flexDirection: "column", gap: 26 }}>
          <Section title="Summary">
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: 0 }}>
              Full-stack engineer with 1+ year of production experience shipping SaaS platforms, billing engines, and real-time systems. Built and maintained software used by real customers — resolved 60+ live bugs, designed financial and booking infrastructure from scratch, and shipped 13 projects across Node.js, React, PostgreSQL, Django, FastAPI, and WebRTC. Comfortable owning features end-to-end, from database schema to deployed UI.
            </p>
          </Section>

          <Section title="Experience" color="#0ea5e9">
            <div style={{ padding: "18px 20px", background: C.soft, borderRadius: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 800, color: C.ink, margin: 0 }}>Associate Software Engineer</h4>
                  <p style={{ fontSize: 11.5, color: C.coral, margin: "3px 0 0", fontWeight: 700 }}>Swayambhu Tech · Mumbai, India</p>
                </div>
                <span style={{ fontSize: 9.5, color: C.muted, fontFamily: "monospace", background: C.card, padding: "3px 9px", borderRadius: 5, whiteSpace: "nowrap" }}>Oct 2025 – Mar 2026</span>
              </div>
              <ul style={{ margin: 0, padding: "0 0 0 16px", display: "flex", flexDirection: "column", gap: 5 }}>
                {["Led end-to-end delivery of DriveAccessible, a fleet rental SaaS managing vehicles, drivers, bookings, invoices, and renewals — used in production with paying customers.",
                  "Built conflict-detection logic using transactional locking to eliminate double-bookings across concurrent reservation windows.",
                  "Engineered billing workflows: dynamic daily-rate pricing, deposits, partial payments, and PDF invoice generation — without third-party payment libraries.",
                  "Developed role-based admin dashboard surfacing overdue payments, upcoming renewals, and revenue trends.",
                  "Resolved 60+ production issues on live systems, including critical edge-case bugs under deadline pressure.",
                  "Shipped SEO-optimised public website with Intersection Observer animations and structured-data markup."
                ].map((b, i) => <li key={i} style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{b}</li>)}
              </ul>
            </div>
          </Section>

          <Section title="Selected Projects" color="#8b5cf6">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                {
                  name: "BillingOS", tech: "Node.js, React, PostgreSQL, Redis, Stripe, PDFKit", color: "#0ea5e9",
                  bullets: ["Multi-tenant billing engine modelled on Stripe Billing: subscription lifecycle, proration invoices, PostgreSQL Row-Level Security.", "Exponential-backoff retry queues (1h→6h→24h→72h) via Bull+Redis; idempotent Stripe webhook processing with unique stripe_event_id."]
                },
                {
                  name: "Payout Engine", tech: "Django, PostgreSQL, Celery, Redis", color: "#10b981",
                  bullets: ["Integer paise storage (BigIntegerField) to eliminate float drift; SELECT FOR UPDATE inside transaction.atomic() prevents concurrent overdrafts.", "Idempotency keys with DB-level unique constraint; atomic failure-handling — marking failed and crediting refund in one transaction."]
                },
                {
                  name: "AI Model Governance Platform", tech: "FastAPI, PostgreSQL, pgvector, React", color: "#14b8a6",
                  bullets: ["Model registry with an explicit workflow state machine enforcing role-based transition rules server-side, full append-only audit trail.", "RAG pipeline — local embeddings, pgvector similarity search, 5-provider LLM fallback — every answer schema-validated with confidence score and citations."]
                },
                {
                  name: "AI Try-On", tech: "React, FastAPI, Python, Hugging Face", color: "#ec4899",
                  bullets: ["Free-tier virtual try-on backend calling community-hosted Hugging Face models with automatic provider fallback and background job processing."]
                },
                {
                  name: "Vault", tech: "Node.js, WebRTC, WebSockets", color: "#0ea5e9",
                  bullets: ["P2P file sharing with direct encrypted WebRTC data channels — no files ever touch the server. Token-based room codes, chunked transfer, progress tracking."]
                },
                {
                  name: "Kanban Pro", tech: "React, Node.js, WebSockets", color: "#8b5cf6",
                  bullets: ["Real-time collaborative Kanban: room-based WebSocket architecture, live presence indicators, last-write-wins conflict resolution, auto-reconnection."]
                },
              ].map(p => (
                <div key={p.name} style={{ padding: "14px 16px", background: C.soft, borderRadius: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 7 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12.5, fontWeight: 800, color: C.ink }}>{p.name}</span>
                    <span style={{ fontSize: 9.5, color: C.muted, background: C.card, padding: "2px 8px", borderRadius: 5, border: `1px solid ${C.line}` }}>{p.tech}</span>
                  </div>
                  <ul style={{ margin: 0, padding: "0 0 0 15px", display: "flex", flexDirection: "column", gap: 3 }}>
                    {p.bullets.map((b, i) => <li key={i} style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.6 }}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Technical Skills" color="#10b981">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { cat: "Frontend", items: "React, TypeScript, JavaScript, Tailwind CSS, Next.js" },
                { cat: "Backend", items: "Node.js, Python, Django, FastAPI, PHP" },
                { cat: "Database", items: "PostgreSQL, MySQL, MongoDB, Redis, Supabase, pgvector" },
                { cat: "Tools & Infra", items: "Git, Docker, Celery, WebSockets, WebRTC, GitHub Actions" },
              ].map(s => (
                <div key={s.cat} style={{ padding: "11px 13px", background: C.soft, borderRadius: 9 }}>
                  <p style={{ fontSize: 8.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color: C.coral, margin: "0 0 4px" }}>{s.cat}</p>
                  <p style={{ fontSize: 11.5, color: C.ink, margin: 0, lineHeight: 1.5 }}>{s.items}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Education" color="#f59e0b">
            <div style={{ padding: "14px 16px", background: C.soft, borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 800, color: C.ink, margin: 0 }}>Bachelor of Science — Information Technology</h4>
                <p style={{ fontSize: 11.5, color: C.muted, margin: "3px 0 0" }}>MVM College, University of Mumbai</p>
              </div>
              <span style={{ fontSize: 9.5, color: C.muted, fontFamily: "monospace", background: C.card, padding: "3px 9px", borderRadius: 5, border: `1px solid ${C.line}`, whiteSpace: "nowrap" }}>2022–2025</span>
            </div>
          </Section>
        </div>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// CONTACT PAGE
// ══════════════════════════════════════════════════════════════
function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    const subject = encodeURIComponent(`Contact from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.open(`mailto:muhammadimrank034@gmail.com?subject=${subject}&body=${body}`);
    setSent(true); setTimeout(() => setSent(false), 4000);
  };
  const inputStyle = { width: "100%", background: C.bg, border: `1px solid ${C.line}`, borderRadius: 10, padding: "11px 14px", fontSize: 13, color: C.ink, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };

  return (
    <div style={{ paddingTop: 80, paddingBottom: 60, maxWidth: 800, margin: "0 auto", padding: "80px 20px 60px" }}>
      <div style={{ borderBottom: `1px solid ${C.line}`, paddingBottom: 14, marginBottom: 30 }}>
        <span style={{ fontSize: 9, fontWeight: 800, color: C.coral, letterSpacing: "0.2em", textTransform: "uppercase" }}>Contact</span>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: C.ink, margin: "4px 0 0", letterSpacing: "-0.03em" }}>Let's talk</h2>
      </div>

      <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 16 }}>
        <Card style={{ padding: "28px 30px" }}>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: "0 0 22px" }}>
            Open to backend engineering contracts, infrastructure work, and full-time roles in fintech or real-time systems.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div>
              <label style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color: C.muted, display: "block", marginBottom: 6 }}>Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" style={inputStyle}
                onFocus={e => e.target.style.borderColor = C.coral} onBlur={e => e.target.style.borderColor = C.line} />
            </div>
            <div>
              <label style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color: C.muted, display: "block", marginBottom: 6 }}>Email</label>
              <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" type="email" style={inputStyle}
                onFocus={e => e.target.style.borderColor = C.coral} onBlur={e => e.target.style.borderColor = C.line} />
            </div>
            <div>
              <label style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color: C.muted, display: "block", marginBottom: 6 }}>Message</label>
              <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell me about the role or project..." rows={5}
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={e => e.target.style.borderColor = C.coral} onBlur={e => e.target.style.borderColor = C.line} />
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSubmit}
              style={{ padding: "12px 0", background: sent ? "#10b981" : C.coral, color: "#fff", border: "none", borderRadius: 10, fontSize: 11, fontWeight: 800, cursor: "pointer", letterSpacing: "0.04em", textTransform: "uppercase", transition: "background 0.3s" }}>
              {sent ? "✓ Opening Email Client..." : "Send Message →"}
            </motion.button>
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { icon: "✉️", label: "Email", value: "muhammadimrank034@gmail.com", href: "mailto:muhammadimrank034@gmail.com" },
            { icon: "📱", label: "Phone", value: "+91 7506190224", href: "tel:+917506190224" },
            { icon: "💼", label: "LinkedIn", value: "imranrkhan13", href: "https://linkedin.com/in/imranrkhan13" },
            { icon: "🐙", label: "GitHub", value: "imranrkhan13", href: "https://github.com/imranrkhan13" },
            { icon: "🌐", label: "Portfolio", value: "imran-silk.vercel.app", href: "https://imran-silk.vercel.app" },
            { icon: "🏢", label: "Studio", value: "techiesaie.com", href: "https://techiesaie.com" },
          ].map(c => (
            <Card key={c.label} style={{ padding: "12px 14px" }}>
              <a href={c.href} target="_blank" rel="noreferrer" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>{c.icon}</span>
                <div>
                  <p style={{ fontSize: 8, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: C.muted, margin: "0 0 1px" }}>{c.label}</p>
                  <p style={{ fontSize: 10.5, color: C.ink, margin: 0, fontWeight: 600 }}>{c.value}</p>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 10, color: C.coral }}>↗</span>
              </a>
            </Card>
          ))}
          <Card style={{ padding: "13px 15px", background: C.coralFaint, border: `1px solid ${C.coralLight}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80" }} />
              <p style={{ fontSize: 8.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: C.coral, margin: 0 }}>Available now</p>
            </div>
            <p style={{ fontSize: 10.5, color: C.muted, margin: 0, lineHeight: 1.5 }}>Open to contract and full-time roles in fintech and real-time systems.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ResumeSheet({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(35,38,66,0.38)", backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "20px" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "105%" }}
            animate={{ y: 0 }}
            exit={{ y: "105%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="resume-sheet"
            onClick={e => e.stopPropagation()}
            style={{ width: "min(920px, 100%)", maxHeight: "90vh", overflowY: "auto", background: "#ece8df", borderRadius: "24px 24px 0 0", border: `1px solid ${C.line}`, boxShadow: "0 -24px 80px rgba(35,38,66,0.28)", padding: "18px 18px 0" }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <div style={{ width: 54, height: 4, borderRadius: 999, background: "rgba(35,38,66,0.22)" }} />
            </div>
            <button onClick={onClose} style={{ position: "sticky", top: 0, marginLeft: "auto", display: "block", zIndex: 2, border: `1px solid ${C.line}`, background: C.card, color: C.navy, borderRadius: 999, width: 34, height: 34, fontSize: 18, cursor: "pointer" }}>×</button>

            <div className="resume-paper" style={{ background: C.card, maxWidth: 820, margin: "-22px auto 0", minHeight: 980, boxShadow: "0 18px 60px rgba(35,38,66,0.16), 0 0 0 8px rgba(255,255,255,0.45)", border: `1.5px solid ${C.navy}` }}>
              <div style={{ height: 10, background: `linear-gradient(90deg, ${C.navy} 0 70%, ${C.coral} 70% 100%)` }} />
              <div className="resume-paper-body" style={{ display: "grid", gridTemplateColumns: "235px 1fr" }}>
                {/* Sidebar */}
                <aside style={{ background: C.navy, color: "#fff", padding: "28px 24px", minHeight: 960, borderRight: `6px solid ${C.coral}` }}>
                  <img src={niceFace} alt="" style={{ width: 66, height: 66, objectFit: "contain", background: "#fff", borderRadius: 18, border: `2px solid ${C.coral}`, marginBottom: 22 }} />
                  <h2 style={{ fontSize: 27, lineHeight: 1.02, fontWeight: 950, margin: "0 0 6px", letterSpacing: "-0.04em" }}>Imran Khan</h2>
                  <p style={{ fontSize: 12, lineHeight: 1.5, color: "rgba(255,255,255,0.76)", margin: "0 0 22px" }}>Full-Stack Engineer · Mumbai, India</p>

                  {[
                    ["Email", "muhammadimrank034@gmail.com"],
                    ["Phone", "+91 7506190224"],
                    ["LinkedIn", "linkedin.com/in/imranrkhan13"],
                    ["GitHub", "github.com/imranrkhan13"],
                    ["Portfolio", "imran-silk.vercel.app"],
                  ].map(([label, value]) => (
                    <div key={label} style={{ marginBottom: 11 }}>
                      <p style={{ fontSize: 8.5, color: C.coral, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 2px" }}>{label}</p>
                      <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.82)", lineHeight: 1.4, margin: 0, wordBreak: "break-word" }}>{value}</p>
                    </div>
                  ))}

                  <div style={{ height: 1, background: "rgba(255,255,255,0.14)", margin: "18px 0" }} />
                  <p style={{ fontSize: 9, color: C.coral, fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.16em", margin: "0 0 10px" }}>Languages</p>
                  {[["Python", "FastAPI, Django"], ["JavaScript", "React, Node, Express"], ["PHP", "Core PHP, Laravel"], ["TypeScript", "React, Node"], ["SQL", "PostgreSQL, MySQL"]].map(([lang, note]) => (
                    <div key={lang} style={{ marginBottom: 8 }}>
                      <p style={{ fontSize: 10.8, fontWeight: 900, color: "#fff", margin: "0 0 1px" }}>{lang}</p>
                      <p style={{ fontSize: 9.5, color: "rgba(255,255,255,0.55)", margin: 0 }}>{note}</p>
                    </div>
                  ))}

                  <div style={{ height: 1, background: "rgba(255,255,255,0.14)", margin: "18px 0" }} />
                  <p style={{ fontSize: 9, color: C.coral, fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.16em", margin: "0 0 10px" }}>Infrastructure</p>
                  {["Docker", "GitHub Actions", "CI/CD", "Linux", "Vercel", "Redis", "Celery"].map(t => (
                    <span key={t} style={{ display: "inline-block", fontSize: 10, fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, padding: "3px 7px", margin: "0 4px 5px 0" }}>{t}</span>
                  ))}

                  <div style={{ height: 1, background: "rgba(255,255,255,0.14)", margin: "18px 0" }} />
                  <p style={{ fontSize: 9, color: C.coral, fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.16em", margin: "0 0 10px" }}>Education</p>
                  <p style={{ fontSize: 11.5, color: "#fff", fontWeight: 900, lineHeight: 1.35, margin: "0 0 3px" }}>BSc Information Technology</p>
                  <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.72)", lineHeight: 1.4, margin: "0 0 2px" }}>University of Mumbai</p>
                  <p style={{ fontSize: 10, color: C.coral, fontWeight: 800, margin: 0 }}>2022 – 2025</p>
                </aside>

                {/* Main content */}
                <main style={{ padding: "28px 30px" }}>
                  {/* Summary */}
                  <section style={{ marginBottom: 20, paddingBottom: 18, borderBottom: `1px solid ${C.line}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ width: 26, height: 2, background: C.coral }} />
                      <p style={{ fontSize: 9, color: C.coral, fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.18em", margin: 0 }}>Summary</p>
                    </div>
                    <p style={{ fontSize: 12.5, lineHeight: 1.72, color: C.ink, margin: 0 }}>
                      Full-stack engineer with hands-on experience building AI-powered tools, realtime systems, and production-grade web platforms. <strong>Shipped 150+ features</strong> in a live product now used by <strong>5+ companies</strong>. Sole developer of DriveAccessible — a fleet rental SaaS adopted by businesses within 4 months of launch. Proficient in React, FastAPI, PostgreSQL, Redis, WebSockets, and OpenAI/Gemini APIs.
                    </p>
                  </section>

                  {/* Impact stats */}
                  <section style={{ marginBottom: 20, paddingBottom: 18, borderBottom: `1px solid ${C.line}` }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 7 }}>
                      {[["150+", "production features shipped"], ["5+", "companies using DriveAccessible"], [String(PROJECTS.length), "portfolio projects"]].map(([n, text]) => (
                        <div key={text} style={{ background: "#f7f4ee", border: `1px solid ${C.line}`, borderTop: `3px solid ${n === "150+" ? C.coral : C.navy}`, borderRadius: 10, padding: "10px 11px" }}>
                          <p style={{ fontSize: 20, color: n === "150+" ? C.coral : C.navy, fontWeight: 950, margin: 0 }}>{n}</p>
                          <p style={{ fontSize: 9.5, color: C.ink, lineHeight: 1.35, margin: "3px 0 0" }}>{text}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Experience */}
                  <section style={{ marginBottom: 20, paddingBottom: 18, borderBottom: `1px solid ${C.line}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <span style={{ width: 26, height: 2, background: C.coral }} />
                      <p style={{ fontSize: 9, color: C.coral, fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.18em", margin: 0 }}>Experience</p>
                    </div>
                    <div style={{ borderLeft: `3px solid ${C.coral}`, paddingLeft: 14, background: "#faf9f6", padding: "14px 16px", borderRadius: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 5, flexWrap: "wrap" }}>
                        <h3 style={{ fontSize: 14.5, color: C.navy, fontWeight: 950, margin: 0 }}>Associate Software Engineer</h3>
                        <span style={{ fontSize: 9.5, color: C.muted, fontWeight: 800, whiteSpace: "nowrap", fontFamily: "monospace" }}>Oct 2025 – Present</span>
                      </div>
                      <p style={{ fontSize: 11.5, color: C.coral, fontWeight: 900, margin: "0 0 10px" }}>SvayambhuTech · Mumbai, India</p>
                      <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 5 }}>
                        {[
                          "Sole developer of DriveAccessible — a full fleet rental and operations SaaS (Core PHP, JavaScript) handling bookings, invoices, dashboards, and realtime business workflows, adopted by 5+ companies within 4 months of launch.",
                          "Shipped 150+ production features end-to-end: backend APIs, reporting systems, admin tools, workflow automations, and customer-facing UI improvements.",
                          "Worked directly with business stakeholders to surface operational pain points, rapidly prototype solutions, and cut manual work for daily rental operations.",
                          "Owned the full stack in a live production environment: frontend, backend, database optimisation, deployment debugging, and operational tooling.",
                        ].map(item => <li key={item.slice(0, 20)} style={{ fontSize: 11.5, lineHeight: 1.58, color: C.ink, marginBottom: 2 }}>{item}</li>)}
                      </ul>
                    </div>
                  </section>

                  {/* Projects */}
                  <section style={{ marginBottom: 20, paddingBottom: 18, borderBottom: `1px solid ${C.line}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <span style={{ width: 26, height: 2, background: C.coral }} />
                      <p style={{ fontSize: 9, color: C.coral, fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.18em", margin: 0 }}>Selected Projects</p>
                    </div>
                    {[
                      { name: "AI Model Governance Platform", tech: "FastAPI · PostgreSQL · pgvector · React", bullets: ["Model registry with an explicit workflow state machine enforcing role-based transition rules server-side, full append-only audit trail.", "RAG pipeline — local embeddings, pgvector similarity search, 5-provider LLM fallback router — every answer schema-validated with a confidence score and citations."] },
                      { name: "AI Try-On", tech: "React · FastAPI · Python · Hugging Face", bullets: ["Free-tier virtual try-on backend calling community-hosted Hugging Face models with automatic provider fallback and background job processing.", "Diagnosed and patched a schema-parsing bug in a third-party AI client library (gradio_client) affecting multiple versions."] },
                      { name: "BillingOS", tech: "Node.js · PostgreSQL · Redis · Stripe", bullets: ["Multi-tenant SaaS billing engine with subscription lifecycle, proration, exponential-backoff retries, idempotent Stripe webhooks, and PostgreSQL Row-Level Security."] },
                      { name: "Payout Engine", tech: "Django · PostgreSQL · Celery · Redis", bullets: ["Integer paise storage, SELECT FOR UPDATE locking, idempotency keys, atomic failure-handling, and auto-recovery scheduler."] },
                      { name: "Kanban Pro", tech: "React · TypeScript · WebSockets", bullets: ["Real-time collaborative Kanban with live presence, drag-and-drop sync, conflict resolution for concurrent updates, and auto-reconnect recovery."] },
                    ].map((p, i) => (
                      <div key={p.name} style={{ marginBottom: 11, paddingBottom: 11, borderBottom: i < 4 ? `1px dashed ${C.line}` : "none" }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                          <h3 style={{ fontSize: 12.5, color: C.navy, fontWeight: 950, margin: 0 }}>{p.name}</h3>
                          <span style={{ fontSize: 9.5, color: C.coral, fontWeight: 800 }}>{p.tech}</span>
                        </div>
                        <ul style={{ margin: 0, paddingLeft: 14 }}>
                          {p.bullets.map(b => <li key={b.slice(0, 20)} style={{ fontSize: 10.8, color: C.ink, lineHeight: 1.52, marginBottom: 2 }}>{b}</li>)}
                        </ul>
                      </div>
                    ))}
                  </section>

                  {/* Technical Skills */}
                  <section>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <span style={{ width: 26, height: 2, background: C.coral }} />
                      <p style={{ fontSize: 9, color: C.coral, fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.18em", margin: 0 }}>Technical Skills</p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                      {[
                        ["Frontend", "React, Next.js, TypeScript, JavaScript, Tailwind CSS, Vite, Framer Motion"],
                        ["Backend", "FastAPI, Node.js, Express, Django, PHP, Laravel, REST APIs"],
                        ["Databases", "PostgreSQL, Redis, MySQL, MongoDB, Supabase, pgvector"],
                        ["Realtime & AI", "WebSockets, WebRTC, RAG Pipelines, Hugging Face, OpenAI/Gemini APIs"],
                        ["Infrastructure", "Docker, Linux, GitHub Actions, CI/CD, Celery"],
                        ["Languages", "Python, JavaScript, TypeScript, PHP, SQL"],
                      ].map(([label, text]) => (
                        <div key={label} style={{ background: C.coralFaint, border: `1px solid ${C.coralLight}`, borderRadius: 9, padding: "10px 12px" }}>
                          <p style={{ fontSize: 8.5, color: C.coral, fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>{label}</p>
                          <p style={{ fontSize: 10.5, color: C.ink, lineHeight: 1.42, margin: 0 }}>{text}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </main>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Nav ────────────────────────────────────────────────────────
function Nav({ page, setPage, onResume }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navItems = [["home", "Home"], ["work", "Work"], ["about", "About"], ["resume", "Resume"]];

  return (
    <>
      <header className="site-nav" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, minHeight: 52, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "0 20px", background: "rgba(250,249,246,0.94)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.line}` }}>
        <button onClick={() => { setPage("home"); close(); }} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 800, color: C.ink, background: "none", border: "none", cursor: "pointer", letterSpacing: "-0.01em" }}>
          <img src={niceFace} alt="" style={{ width: 29, height: 29, objectFit: "contain", borderRadius: 8, background: C.navy, border: `1px solid ${C.coralLight}` }} />
          Imran Khan
        </button>
        {/* Desktop nav */}
        <nav className="site-nav-links" style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {[["home", "Home"], ["work", "Work"], ["about", "About"]].map(([id, label]) => (
            <button key={id} onClick={() => setPage(id)}
              style={{ padding: "5px 12px", borderRadius: 99, border: "none", cursor: "pointer", fontSize: 11, fontWeight: page === id ? 700 : 500, background: page === id ? C.soft : "transparent", color: page === id ? C.ink : C.muted, transition: "all 0.15s" }}>
              {label}
            </button>
          ))}
          <button onClick={onResume} style={{ padding: "5px 12px", borderRadius: 99, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 650, background: "transparent", color: C.muted, transition: "all 0.15s" }}>Resume</button>
          <a href="mailto:muhammadimrank034@gmail.com" style={{ marginLeft: 6, padding: "5px 14px", borderRadius: 99, border: "none", background: C.coral, color: "#fff", fontSize: 10, fontWeight: 800, textDecoration: "none", letterSpacing: "0.04em", textTransform: "uppercase" }}>Contact</a>
        </nav>
        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(true)}
          className="hidden max-[600px]:flex absolute right-5 top-1/2 -translate-y-1/2 flex-col gap-1"
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-6 h-0.5 rounded bg-[#232642]"
            />
          ))}
        </button>
      </header>

      {/* Mobile full-screen takeover menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
            style={{ position: "fixed", inset: 0, zIndex: 300, background: C.navy, display: "flex", flexDirection: "column" }}
          >
            {/* Top row: brand + close */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", minHeight: 56, flexShrink: 0 }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 13, letterSpacing: "-0.01em" }}>Imran Khan</span>
              <button onClick={close} aria-label="Close menu" style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                ✕
              </button>
            </div>

            {/* Big numbered nav */}
            <nav style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 26px", gap: 2 }}>
              {navItems.map(([id, label], i) => {
                const isActive = id !== "resume" && page === id;
                return (
                  <motion.button
                    key={id}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.32, ease: EASE }}
                    onClick={() => { id === "resume" ? onResume() : setPage(id); close(); }}
                    style={{ display: "flex", alignItems: "baseline", gap: 14, background: "none", border: "none", padding: "13px 0", cursor: "pointer", textAlign: "left", width: "100%" }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 700, color: isActive ? C.coral : "rgba(255,255,255,0.32)", fontFamily: "monospace", flexShrink: 0 }}>0{i + 1}</span>
                    <span style={{ fontSize: 38, fontWeight: 850, color: isActive ? "#fff" : "rgba(255,255,255,0.55)", letterSpacing: "-0.03em" }}>{label}</span>
                  </motion.button>
                );
              })}
            </nav>

            {/* Footer: casual sign-off + contact */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.3, ease: EASE }}
              style={{ padding: "0 26px 36px", display: "flex", flexDirection: "column", gap: 14, flexShrink: 0 }}
            >
              <a href="mailto:muhammadimrank034@gmail.com" onClick={close}
                style={{ background: C.coral, color: "#fff", textAlign: "center", padding: "15px 0", borderRadius: 999, fontWeight: 800, fontSize: 13.5, textDecoration: "none", letterSpacing: "0.01em" }}>
                Say hi →
              </a>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 11, textAlign: "center", margin: 0, fontWeight: 500 }}>
                Mumbai · usually online, mostly caffeinated
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [resumeOpen, setResumeOpen] = useState(false);
  return (
    <div style={{ background: C.bg, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: C.ink, minHeight: "100vh" }}>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;}
        body{margin:0;overflow-x:hidden;}

        @keyframes fadeInPanel{from{opacity:0;transform:translateX(8px);}to{opacity:1;transform:translateX(0);}}

        /* ── Scrollbar ── */
        .custom-scrollbar::-webkit-scrollbar{width:4px;}
        .custom-scrollbar::-webkit-scrollbar-track{background:transparent;}
        .custom-scrollbar::-webkit-scrollbar-thumb{background:rgba(61,64,91,0.18);border-radius:99px;}

        /* ── Desktop: home rows ── */
        .profile-strip{display:grid;grid-template-columns:270px 1fr;gap:32px;}
        .home-grid-bottom{display:grid;grid-template-columns:1.35fr 0.9fr;gap:10px;}
        .featured-work-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}

        /* ── Desktop: work page ── */
        .work-detail-padding{padding:28px 30px;}

        /* ── Desktop: about / contact page ── */
        .about-grid{display:grid;grid-template-columns:1fr 310px;gap:18px;}
        .contact-grid{display:grid;grid-template-columns:1fr 240px;gap:16px;}

        /* ── Desktop: resume paper ── */
        .resume-paper-body{display:grid;grid-template-columns:235px 1fr;}

        /* ── Nav ── */
        .mobile-menu-btn{
          display:none!important;
          position:absolute;
          top:24px;
          right:24px;
          z-index:1000;
        }
        .site-nav-links{display:flex;}
        .mobile-menu-btn{display:none!important;}

        /* ── Tablet (≤ 860px) ── */
        @media(max-width:860px){
          .profile-strip{grid-template-columns:1fr!important;gap:20px!important;}
          .profile-strip-left{border-right:none!important;border-bottom:1px solid rgba(61,64,91,0.08);padding-right:0!important;padding-bottom:20px!important;}
          .home-grid-bottom{grid-template-columns:1fr!important;}
          .featured-work-grid{grid-template-columns:1fr 1fr!important;}
          .about-grid{grid-template-columns:1fr!important;}
          .contact-grid{grid-template-columns:1fr!important;}
          .resume-paper-body{grid-template-columns:1fr!important;}
          .resume-paper-body aside{min-height:unset!important;border-right:none!important;border-bottom:6px solid #e27d60;}
        }

        /* ── Mobile (≤ 600px) ── */
        @media(max-width:600px){
          .tech-card-grid{grid-template-columns:1fr!important;height:auto!important;}
          .tech-card-grid > div:first-child{height:200px!important;min-height:200px!important;}
          .home-grid-bottom{grid-template-columns:1fr!important;}
          .featured-work-grid{grid-template-columns:1fr!important;}
          .site-nav-links{display:none!important;}
          .mobile-menu-btn{display:flex!important;}
          .page-shell{padding-top:64px!important;}
          .intro-headline{font-size:26px!important;letter-spacing:-0.035em!important;}
          .intro-buttons{flex-direction:column;width:100%;}
          .intro-buttons a,.intro-buttons button{width:100%;text-align:center;}
          .about-proof-grid{grid-template-columns:1fr!important;}
          .profile-strip{padding:20px!important;}
          .work-detail-padding{padding:20px 18px!important;}
        }

        /* ── Very small (≤ 400px) ── */
        @media(max-width:400px){
          .intro-headline{font-size:22px!important;}
        }
      `}</style>
      <Nav page={page} setPage={setPage} onResume={() => setResumeOpen(true)} />
      <AnimatePresence mode="wait">
        <motion.div key={page} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.24, ease: EASE }}>
          {page === "home" && <HomePage setPage={setPage} onResume={() => setResumeOpen(true)} />}
          {page === "work" && <WorkPage />}
          {page === "about" && <AboutPage />}
        </motion.div>
      </AnimatePresence>
      <ResumeSheet open={resumeOpen} onClose={() => setResumeOpen(false)} />
      <footer style={{ borderTop: `1px solid ${C.line}`, padding: "16px 20px", display: "flex", justifyContent: "space-between", maxWidth: 1060, margin: "0 auto", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted }}>Imran Khan · 2026</span>
        <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted }}>Maintained by TechiesAIE</span>
      </footer>
    </div>
  );
}