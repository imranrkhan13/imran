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
const SP = { type: "spring", stiffness: 380, damping: 28, mass: 0.7 };

// Tech → projects mapping for hover tooltips
const TECH_PROJECTS = {
  "React":       ["BillingOS","Kanban Pro","AI Check Data","Resume AI","DevLens","FoodExpress","Wikireels","Techiesaie"],
  "Node.js":     ["BillingOS","Kanban Pro","Vault","FoodExpress"],
  "PostgreSQL":  ["BillingOS","Payout Engine"],
  "PHP":         ["Drive Accessible"],
  "Django":      ["Payout Engine"],
  "WebRTC":      ["Vault"],
  "Redis":       ["BillingOS","Payout Engine"],
  "TypeScript":  ["FoodExpress"],
  "MySQL":       ["Drive Accessible"],
  "Supabase":    ["AI Check Data","Resume AI"],
  "WebSockets":  ["Kanban Pro","Vault"],
  "Stripe":      ["BillingOS"],
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
];

const SKILLS_DATA = {
  Frontend: { items: ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Framer Motion"], color: C.coral },
  Backend: { items: ["Node.js", "Django (Python)", "PHP", "Rust"], color: C.ink },
  Database: { items: ["PostgreSQL", "MySQL", "MongoDB", "Redis"], color: "#0ea5e9" },
  Tools: { items: ["Git", "GitHub", "Vercel", "WebRTC", "WebSockets"], color: "#10b981" },
};

const TECH_NODES = [
  { name: "React",      color: "#61dafb" },
  { name: "Node.js",    color: "#68a063" },
  { name: "PostgreSQL", color: "#336791" },
  { name: "PHP",        color: "#8892bf" },
  { name: "Django",     color: "#0c4b33" },
  { name: "WebRTC",     color: "#e27d60" },
  { name: "Redis",      color: "#d82c20" },
  { name: "TypeScript", color: "#3178c6" },
  { name: "MySQL",      color: "#00758f" },
  { name: "Supabase",   color: "#3ecf8e" },
  { name: "WebSockets", color: "#8b5cf6" },
  { name: "Stripe",     color: "#6772e5" },
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



// ── InfoCard ───────────────────────────────────────────────────
function InfoCard() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const upd = () => setTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }));
    upd(); const id = setInterval(upd, 1000); return () => clearInterval(id);
  }, []);
  return (
    <div style={{ padding: "22px", height: "100%", display: "flex", flexDirection: "column", gap: 15, background: C.card }}>
      <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
        <img src={niceFace} alt="" style={{ width: 46, height: 46, objectFit: "contain", background: "#fff", borderRadius: 13, border: `1px solid ${C.coralLight}`, boxShadow: "0 6px 18px rgba(35,38,66,0.08)", flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 15, fontWeight: 950, color: C.navy, margin: 0, letterSpacing: "-0.025em" }}>Imran Khan</p>
          <p style={{ fontSize: 10, color: C.coral, fontWeight: 850, margin: "2px 0 0" }}>Full-Stack Engineer</p>
        </div>
      </div>

      <div style={{ height: 1, background: C.line }} />

      <p style={{ fontSize: 12.2, color: C.ink, lineHeight: 1.62, margin: 0, fontWeight: 600 }}>
        Building <span style={{ color: C.coral, fontWeight: 900 }}>secure SaaS systems</span>, booking engines, billing flows, and realtime tools.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
        {[
          ["60+", "Fixes"],
          ["11", "Projects"],
        ].map(([n, l]) => (
          <div key={l} style={{ padding: "10px 11px", background: "#f7f4ef", border: `1px solid ${C.line}`, borderRadius: 10 }}>
            <p style={{ fontSize: 18, fontWeight: 950, color: n === "60+" ? C.coral : C.navy, margin: 0 }}>{n}</p>
            <p style={{ fontSize: 8.5, fontWeight: 850, textTransform: "uppercase", letterSpacing: "0.1em", color: C.muted, margin: "2px 0 0" }}>{l}</p>
          </div>
        ))}
      </div>

      <div>
        <p style={{ fontSize: 8.5, fontWeight: 850, textTransform: "uppercase", letterSpacing: "0.16em", color: C.muted, margin: "0 0 7px" }}>Primary stack</p>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {["PHP", "PostgreSQL", "Node.js", "React"].map(t => (
            <span key={t} style={{ fontSize: 10, fontWeight: 800, color: C.navy, background: C.soft, border: `1px solid ${C.line}`, padding: "3px 9px", borderRadius: 99 }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.line}`, paddingTop: 12 }}>
        <span style={{ fontSize: 9, color: C.muted }}>Mumbai · Open to work</span>
        <span style={{ fontSize: 9, color: C.muted, fontFamily: "monospace" }}>{time}</span>
      </div>
    </div>
  );
}

// ── ExperienceCard ─────────────────────────────────────────────
function ExperienceCard() {
  const expFacts = [
    ["Product", "Drive Accessible fleet rental SaaS"],
    ["Scope", "Bookings, billing, payments, renewals"],
    ["Impact", "60+ fixes, zero downtime"],
    ["Stack", "PHP, MySQL, JavaScript"],
  ];

  return (
    <div style={{ padding: "20px 22px", height: "100%", display: "flex", flexDirection: "column", gap: 12, background: C.card }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div>
          <p style={{ fontSize: 8.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.18em", color: C.coral, margin: "0 0 3px" }}>Experience</p>
          <h3 style={{ fontSize: 15, fontWeight: 950, color: C.navy, margin: 0, letterSpacing: "-0.025em" }}>Associate Software Engineer</h3>
          <p style={{ fontSize: 10.5, color: C.muted, margin: "3px 0 0", fontWeight: 750 }}>Swayambhu Tech · Mumbai</p>
        </div>
        <span style={{ fontSize: 9, color: C.coral, background: C.coralFaint, border: `1px solid ${C.coralLight}`, borderRadius: 999, padding: "4px 8px", fontWeight: 850, whiteSpace: "nowrap" }}>Oct 2025 - Mar 2026</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
        {expFacts.map(([label, value]) => (
          <div key={label} style={{ padding: "9px 10px", background: "#f7f4ef", border: `1px solid ${C.line}`, borderRadius: 9 }}>
            <p style={{ fontSize: 8.2, color: label === "Impact" ? C.coral : C.muted, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.09em", margin: "0 0 3px" }}>{label}</p>
            <p style={{ fontSize: 10.7, color: C.navy, fontWeight: 800, lineHeight: 1.32, margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "auto", padding: "11px 12px", background: C.coralFaint, borderRadius: 10, border: `1px solid ${C.coralLight}` }}>
        <p style={{ fontSize: 10.7, color: C.ink, margin: "0 0 6px", lineHeight: 1.45 }}>
          Built safer fleet operations by connecting booking checks, billing totals, payment tracking, and role-based admin workflows.
        </p>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {["booking safety", "billing", "dashboards"].map(t => (
            <span key={t} style={{ fontSize: 8.8, fontWeight: 850, color: C.coral, background: C.card, padding: "2px 7px", borderRadius: 999, border: `1px solid ${C.coralLight}` }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── ProjectsCycleCard ──────────────────────────────────────────
function ProjectsCycleCard({ onClick }) {
  const [idx, setIdx] = useState(0);
  const featured = PROJECTS.slice(0, 6);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % featured.length), 3200);
    return () => clearInterval(id);
  }, []);
  const cur = featured[idx];
  const projectBrief = [
    ["What", cur.short],
    ["How", cur.bullets[0]],
    ["Proof", cur.bullets[1] || cur.context || cur.tagline],
  ];
  return (
    <div onClick={onClick} style={{ padding: "0", height: "100%", display: "flex", flexDirection: "column", cursor: "pointer", background: `linear-gradient(135deg, ${C.card} 0%, ${C.card} 58%, ${cur.color}10 100%)` }}>
      <div style={{ height: 5, background: `linear-gradient(90deg, ${C.navy}, ${C.coral}, ${cur.color})` }} />
      <div style={{ padding: "22px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 8.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em", color: C.coral, margin: "0 0 1px" }}>Selected build</p>
          <p style={{ fontSize: 13, fontWeight: 900, color: C.navy, margin: 0, letterSpacing: "-0.02em" }}>{PROJECTS.length} shipped systems</p>
        </div>
        <div style={{ display: "flex", gap: 3 }}>
          {featured.map((_, i) => (
            <div key={i} onClick={e => { e.stopPropagation(); setIdx(i); }}
              style={{ width: i === idx ? 14 : 4, height: 4, borderRadius: 2, background: i === idx ? C.coral : C.line, transition: "all 0.3s ease", cursor: "pointer" }} />
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={cur.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: EASE }} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: cur.color, flexShrink: 0 }} />
            <span style={{ fontSize: 9.5, fontWeight: 700, color: C.muted }}>{cur.tag}</span>
            <span style={{ fontSize: 9, color: C.muted, fontFamily: "monospace" }}>· {cur.year}</span>
          </div>
          <div className="project-structure-grid" style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 16, alignItems: "start", flex: 1, marginBottom: 14 }}>
            <div>
              <h4 style={{ fontSize: 24, fontWeight: 950, color: C.navy, margin: "0 0 8px", letterSpacing: "-0.04em" }}>{cur.name}</h4>
              <p style={{ fontSize: 13.5, color: C.coral, fontWeight: 850, margin: "0 0 12px", lineHeight: 1.42 }}>{cur.tagline}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                {[
                  ["Year", cur.year],
                  ["Type", cur.tag],
                ].map(([label, value]) => (
                  <div key={label} style={{ padding: "9px 10px", background: "#f7f4ef", border: `1px solid ${C.line}`, borderRadius: 9 }}>
                    <p style={{ fontSize: 8, color: C.muted, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 3px" }}>{label}</p>
                    <p style={{ fontSize: 10.4, color: C.navy, fontWeight: 850, margin: 0, lineHeight: 1.3 }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {projectBrief.map(([label, text], i) => (
                <div key={label} style={{ display: "grid", gridTemplateColumns: "58px 1fr", gap: 10, padding: "9px 10px", background: i === 0 ? C.navy : "#f7f4ef", border: `1px solid ${i === 0 ? C.navy : C.line}`, borderRadius: 10 }}>
                  <p style={{ fontSize: 8.5, color: i === 0 ? C.coral : cur.color, fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.1em", margin: "2px 0 0" }}>{label}</p>
                  <p style={{
                    fontSize: 10.7,
                    color: i === 0 ? "#fff" : C.ink,
                    margin: 0,
                    lineHeight: 1.45,
                    display: "-webkit-box",
                    WebkitLineClamp: i === 0 ? 3 : 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {cur.tech.slice(0, 3).map(t => (
                <span key={t} style={{ fontSize: 9.5, fontWeight: 800, color: C.navy, background: C.coralFaint, padding: "3px 9px", borderRadius: 99, border: `1px solid ${C.coralLight}` }}>{t}</span>
              ))}
              {cur.tech.length > 3 && <span style={{ fontSize: 9.5, fontWeight: 700, color: C.muted, padding: "2px 6px" }}>+{cur.tech.length - 3}</span>}
            </div>
            <span style={{ fontSize: 10.5, color: C.coral, fontWeight: 900 }}>View all</span>
          </div>
        </motion.div>
      </AnimatePresence>
      </div>
    </div>
  );
}

// ── SkillsCard ─────────────────────────────────────────────────
function SkillsCard() {
  return (
    <div style={{ padding: "22px 24px", height: "100%" }}>
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 8.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em", color: C.muted, margin: "0 0 2px" }}>Skills</p>
        <h3 style={{ fontSize: 14, fontWeight: 900, color: C.ink, margin: 0, letterSpacing: "-0.02em" }}>What I work with</h3>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {Object.entries(SKILLS_DATA).map(([cat, { items, color }]) => (
          <div key={cat}>
            <p style={{ fontSize: 8.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color, marginBottom: 6 }}>{cat}</p>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {items.map(item => (
                <span key={item} style={{ fontSize: 10.5, fontWeight: 600, color: C.ink, background: C.soft, padding: "3px 9px", borderRadius: 6, border: `1px solid ${C.line}` }}>{item}</span>
              ))}
            </div>
          </div>
        ))}
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
  [0,1],[0,7],[0,8],[0,9],[1,2],[1,8],[2,3],[2,8],
  [3,4],[4,5],[4,9],[5,6],[5,9],[6,7],[6,11],[7,10],
  [8,9],[10,1],[11,6],[3,9],[2,4]
];

function TechNetworkCard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeNode = NODE_POSITIONS[activeIndex];
  const projects = activeNode
    ? (TECH_PROJECTS[activeNode.name] || [])
        .map(name => PROJECTS.find(p => p.name === name))
        .filter(Boolean)
    : [];
  const previewProjects = projects.slice(0, 4);

  return (
    <div style={{ padding: "18px", display: "flex", flexDirection: "column", height: "100%", minHeight: 330, boxSizing: "border-box" }}>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 14, flexShrink: 0 }}>
        <div>
          <p style={{ fontSize: 8.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em", color: C.muted, margin: "0 0 1px" }}>Tech Stack</p>
          <p style={{ fontSize: 15, fontWeight: 900, color: C.ink, margin: 0, letterSpacing: "-0.02em" }}>Tech-to-project map</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9, color: activeNode.color, fontWeight: 800, marginTop: 2, whiteSpace: "nowrap", background: activeNode.color + "12", border: `1px solid ${activeNode.color}30`, borderRadius: 99, padding: "4px 8px" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: activeNode.color }} />
          {activeNode.name}
        </div>
      </div>

      <div className="tech-card-grid" style={{ display: "grid", gridTemplateColumns: "minmax(235px, 1fr) 210px", gap: 12, flex: 1, height: 244, minHeight: 244 }}>
        {/* Network SVG — larger and always visible */}
        <div style={{ position: "relative", height: 244, minHeight: 244, borderRadius: 13, background: "#fbfaf7", border: `1px solid ${C.line}`, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 12, right: 12, top: 12, display: "flex", justifyContent: "space-between", pointerEvents: "none" }}>
            {["Frontend", "Backend", "Data"].map(label => (
              <span key={label} style={{ fontSize: 7.8, color: C.muted, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>{label}</span>
            ))}
          </div>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 260 166"
            style={{ display: "block", overflow: "visible", height: 222, minHeight: 222, padding: "12px 6px 0", boxSizing: "border-box" }}
          >
            {[42,84,126].map(y => (
              <line key={y} x1="12" y1={y} x2="248" y2={y} stroke="rgba(61,64,91,0.055)" strokeWidth="0.5" />
            ))}
            {[65,130,195].map(x => (
              <line key={x} x1={x} y1="12" x2={x} y2="154" stroke="rgba(61,64,91,0.055)" strokeWidth="0.5" />
            ))}

            {EDGES.map(([a, b], i) => {
              const na = NODE_POSITIONS[a], nb = NODE_POSITIONS[b];
              const isActive = activeIndex === a || activeIndex === b;
              return (
                <motion.line key={i}
                  x1={na.cx} y1={na.cy} x2={nb.cx} y2={nb.cy}
                  animate={{
                    stroke: isActive ? activeNode.color : "rgba(61,64,91,0.10)",
                    strokeWidth: isActive ? 1.35 : 0.65,
                    opacity: isActive ? 0.95 : 0.36,
                  }}
                  transition={{ duration: 0.18, ease: EASE }}
                  strokeDasharray={isActive ? "none" : "2 3"}
                />
              );
            })}

            {NODE_POSITIONS.map((nd, i) => {
              const isHov = activeIndex === i;
              const isConn = EDGES.some(([a,b]) => (a===activeIndex&&b===i)||(b===activeIndex&&a===i));
              const r = isHov ? 7 : isConn ? 5.4 : 4.25;
              const labelRight = nd.cx > 130;
              const lx = nd.cx + (labelRight ? r + 5 : -(r + 5));
              const anchor = labelRight ? "start" : "end";
              return (
                <g
                  key={nd.name}
                  onMouseEnter={() => setActiveIndex(i)}
                  style={{ cursor: "pointer", opacity: isHov || isConn ? 1 : 0.72, transition: "opacity 0.18s ease" }}
                >
                  {isHov && (
                    <>
                      <motion.circle cx={nd.cx} cy={nd.cy} r={r + 13} fill={nd.color + "10"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.16 }} />
                      <motion.circle cx={nd.cx} cy={nd.cy} r={r + 7} fill="none" stroke={nd.color + "55"} strokeWidth="0.9" initial={{ opacity: 0, r: r + 2 }} animate={{ opacity: 0.85, r: r + 8 }} transition={{ duration: 0.2, ease: EASE }} />
                    </>
                  )}
                  <motion.circle
                    cx={nd.cx}
                    cy={nd.cy}
                    initial={false}
                    animate={{ r }}
                    fill={isHov || isConn ? nd.color : nd.color + "cc"}
                    stroke={isHov ? C.card : "transparent"}
                    strokeWidth={isHov ? 2 : 0}
                    transition={{ duration: 0.16, ease: EASE }}
                  />
                  <text x={lx} y={nd.cy + 3.5}
                    textAnchor={anchor}
                    fontSize={isHov ? "7.8" : "6.6"}
                    fontWeight={isHov ? "850" : "650"}
                    fill={isHov ? nd.color : isConn ? C.ink : "rgba(61,64,91,0.54)"}
                    style={{ transition: "fill 0.15s, font-size 0.1s", fontFamily: "system-ui,sans-serif", pointerEvents: "none" }}
                  >
                    {nd.name}
                  </text>
                  <circle cx={nd.cx} cy={nd.cy} r="14" fill="transparent" />
                </g>
              );
            })}

            <circle cx="130" cy="83" r="3.8" fill={C.coral} opacity="0.65" />
            <circle cx="130" cy="83" r="8" fill="none" stroke={C.coral} strokeWidth="0.5" opacity="0.25" />
          </svg>
          <div style={{ position: "absolute", left: 12, right: 12, bottom: 10, display: "flex", gap: 5, flexWrap: "wrap" }}>
            {NODE_POSITIONS.slice(0, 6).map((nd, i) => (
              <button
                key={nd.name}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => setActiveIndex(i)}
                style={{
                  border: `1px solid ${activeIndex === i ? nd.color + "55" : C.line}`,
                  background: activeIndex === i ? nd.color + "12" : C.card,
                  color: activeIndex === i ? nd.color : C.muted,
                  borderRadius: 99,
                  padding: "3px 7px",
                  fontSize: 8.6,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {nd.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dedicated hover detail panel */}
        <div style={{ height: 244, minHeight: 244, borderRadius: 13, border: `1px solid ${activeNode.color}34`, background: activeNode.color + "0b", padding: "12px", overflow: "hidden", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode.name}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18, ease: EASE }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: activeNode.color, boxShadow: `0 0 0 5px ${activeNode.color}18` }} />
                <div>
                  <p style={{ fontSize: 12.5, fontWeight: 900, color: C.ink, margin: 0 }}>{activeNode.name}</p>
                  <p style={{ fontSize: 8.5, color: C.muted, fontWeight: 700, margin: "1px 0 0", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {projects.length} linked project{projects.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="custom-scrollbar" style={{ height: 183, overflowY: "auto", paddingRight: 2, display: "flex", flexDirection: "column", gap: 7 }}>
                {previewProjects.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 7 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, delay: i * 0.035, ease: EASE }}
                    style={{ padding: "9px 10px", borderRadius: 10, background: C.card, border: `1px solid ${C.line}`, boxShadow: "0 5px 14px rgba(61,64,91,0.045)" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                      <p style={{ fontSize: 10.6, color: C.ink, fontWeight: 850, margin: 0 }}>{p.name}</p>
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
                  </motion.div>
                ))}
                {projects.length > previewProjects.length && (
                  <p style={{ fontSize: 9.4, color: activeNode.color, fontWeight: 850, margin: "1px 0 0" }}>
                    +{projects.length - previewProjects.length} more project{projects.length - previewProjects.length > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function IntroLine({ onResume }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: EASE }}
      className="intro-line"
      style={{
        marginBottom: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <motion.img
          src={niceFace}
          alt=""
          animate={{ y: [0, -5, 0], rotate: [-2, 3, -2] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 32, height: 32, objectFit: "contain", flexShrink: 0 }}
        />
        <p style={{ fontSize: 20, lineHeight: 1.25, color: C.navy, margin: 0, fontWeight: 900, letterSpacing: "-0.035em" }}>
          Hi, I&apos;m <span style={{ color: C.coral }}>Imran</span>, a full-stack engineer building reliable SaaS, fintech, and realtime systems.
        </p>
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button onClick={onResume} style={{ border: "none", background: C.navy, color: "#fff", borderRadius: 999, padding: "9px 14px", fontSize: 10.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer", whiteSpace: "nowrap" }}>
          Resume
        </button>
        <a href="mailto:muhammadimrank034@gmail.com" style={{ textDecoration: "none", background: C.coral, color: "#fff", borderRadius: 999, padding: "9px 14px", fontSize: 10.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
          Contact
        </a>
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
        <div style={{ marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ fontSize: 11, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.2em", margin: 0 }}>Full-Stack Engineer · Mumbai</h1>
          <span style={{ fontSize: 10, color: C.muted, fontFamily: "monospace" }}>2026</span>
        </div>
        <IntroLine onResume={onResume} />

        {/* Row 1: identity, larger tech map, and experience cards */}
        <div className="home-grid-top" style={{ display: "grid", gridTemplateColumns: "230px minmax(500px, 1fr) 270px", gap: 10, marginBottom: 10, alignItems: "stretch" }}>
          <Card delay={0.02}><InfoCard /></Card>
          <Card delay={0.04} style={{ minHeight: 0 }}>
            <TechNetworkCard />
          </Card>
          <Card delay={0.06}><ExperienceCard /></Card>
        </div>

        {/* Row 2: larger project story with skills beside it */}
        <div className="home-grid-bottom" style={{ display: "grid", gridTemplateColumns: "1.35fr 0.9fr", gap: 10 }}>
          <Card delay={0.08} onClick={() => setPage("work")}><ProjectsCycleCard onClick={() => setPage("work")} /></Card>
          <Card delay={0.10}><SkillsCard /></Card>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// WORK PAGE
// ══════════════════════════════════════════════════════════════
function WorkPage() {
  const [activeId, setActiveId] = useState(PROJECTS[0].id);
  const cur = PROJECTS.find(p => p.id === activeId);
  const panelRef = useRef();

  const select = id => {
    setActiveId(id);
    setTimeout(() => panelRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 10);
  };

  return (
    <div className="page-shell" style={{ paddingTop: 80, paddingBottom: 60, maxWidth: 1060, margin: "0 auto", padding: "80px 20px 60px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderBottom: `1px solid ${C.line}`, paddingBottom: 14, marginBottom: 22 }}>
        <div>
          <span style={{ fontSize: 9, fontWeight: 800, color: C.coral, letterSpacing: "0.2em", textTransform: "uppercase" }}>Archive</span>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: C.ink, margin: "4px 0 0", letterSpacing: "-0.03em" }}>All Projects</h2>
        </div>
        <span style={{ fontSize: 10, color: C.muted, fontFamily: "monospace" }}>{PROJECTS.length} shipped</span>
      </div>

      <div className="work-mobile-list" style={{ display: "none", flexDirection: "column", gap: 12 }}>
        {PROJECTS.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: i * 0.025, ease: EASE }}
            style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden" }}
          >
            <div style={{ height: 3, background: p.color }} />
            <div style={{ padding: "16px 16px 15px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 9 }}>
                <div>
                  <p style={{ fontSize: 8.5, color: p.color, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 5px" }}>{p.tag}</p>
                  <h3 style={{ fontSize: 17, fontWeight: 950, color: C.navy, margin: 0, letterSpacing: "-0.025em" }}>{p.name}</h3>
                </div>
                <span style={{ fontSize: 9, color: C.muted, fontWeight: 800, fontFamily: "monospace", whiteSpace: "nowrap" }}>{p.year}</span>
              </div>

              <p style={{ fontSize: 12.2, color: p.color, fontWeight: 850, lineHeight: 1.4, margin: "0 0 8px" }}>{p.tagline}</p>
              <p style={{ fontSize: 11.6, color: C.ink, lineHeight: 1.55, margin: "0 0 11px" }}>{p.short}</p>

              <div style={{ padding: "10px 11px", background: "#f7f4ef", border: `1px solid ${C.line}`, borderRadius: 10, marginBottom: 11 }}>
                <p style={{ fontSize: 8.5, color: C.muted, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>Key proof</p>
                <p style={{ fontSize: 10.8, color: C.ink, lineHeight: 1.45, margin: 0 }}>{p.bullets[0]}</p>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {p.tech.slice(0, 3).map(t => (
                    <span key={t} style={{ fontSize: 9.5, fontWeight: 800, color: C.navy, background: C.soft, padding: "3px 8px", borderRadius: 999, border: `1px solid ${C.line}` }}>{t}</span>
                  ))}
                  {p.tech.length > 3 && <span style={{ fontSize: 9.5, color: C.muted, fontWeight: 800, padding: "3px 2px" }}>+{p.tech.length - 3}</span>}
                </div>
                {p.liveUrl && (
                  <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ fontSize: 10.2, color: p.color, fontWeight: 900, textDecoration: "none", whiteSpace: "nowrap" }}>Live</a>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="work-grid" style={{ display: "grid", gridTemplateColumns: "248px 1fr", gap: 14, alignItems: "start" }}>
        {/* Sidebar */}
        <div style={{ position: "sticky", top: 68, maxHeight: "calc(100vh - 90px)", overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
          {PROJECTS.map(p => {
            const sel = p.id === activeId;
            return (
              <motion.button key={p.id} onClick={() => select(p.id)} whileHover={{ x: 2 }} transition={SP}
                style={{ width: "100%", background: sel ? C.card : "transparent", border: sel ? `1px solid ${C.line}` : "1px solid transparent", padding: "10px 13px", borderRadius: 10, cursor: "pointer", textAlign: "left", position: "relative", transition: "background 0.15s" }}>
                {sel && <motion.div layoutId="sel-bar" style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: 3, background: cur.color, borderRadius: 2 }} />}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: sel ? 6 : 0, transition: "padding 0.15s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: 11.5, fontWeight: sel ? 800 : 600, color: C.ink, margin: 0 }}>{p.name}</p>
                      <p style={{ fontSize: 9, color: C.muted, margin: "1px 0 0", fontWeight: 600 }}>{p.tag}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: 9.5, color: C.muted, fontFamily: "monospace" }}>{p.year.slice(-4)}</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          <motion.div key={cur.id} ref={panelRef} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.22, ease: EASE }}
            style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.line}`, overflow: "hidden" }}>
            <div style={{ height: 3, background: cur.color }} />
            <div style={{ padding: "26px 28px" }}>
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: cur.color, background: cur.color + "18", padding: "3px 9px", borderRadius: 99 }}>{cur.tag}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: C.muted, fontFamily: "monospace" }}>{cur.year}</span>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 900, color: C.ink, margin: "0 0 6px", letterSpacing: "-0.03em" }}>{cur.name}</h3>
                <p style={{ fontSize: 13, color: cur.color, fontWeight: 700, margin: "0 0 10px", lineHeight: 1.4 }}>{cur.tagline}</p>
                <p style={{ fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.6 }}>{cur.short}</p>
              </div>

              {cur.context && (
                <div style={{ marginBottom: 22, padding: "14px 16px", background: cur.color + "0d", borderLeft: `3px solid ${cur.color}`, borderRadius: "0 10px 10px 0" }}>
                  <p style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: cur.color, margin: "0 0 5px" }}>Why it was built</p>
                  <p style={{ fontSize: 12, color: C.ink, margin: 0, lineHeight: 1.58 }}>{cur.context}</p>
                </div>
              )}

              {cur.liveUrl && (
                <div style={{ marginBottom: 22, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <a href={cur.liveUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                    style={{ fontSize: 11, fontWeight: 700, color: cur.color, background: cur.color + "12", padding: "6px 14px", borderRadius: 8, textDecoration: "none", border: `1px solid ${cur.color}28`, display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    {cur.urls?.[0] || "Live Site"}
                  </a>
                  {cur.urls?.[1] && (
                    <a href={cur.fleetUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                      style={{ fontSize: 11, fontWeight: 700, color: C.muted, background: C.soft, padding: "6px 14px", borderRadius: 8, textDecoration: "none", border: `1px solid ${C.line}`, display: "inline-flex", alignItems: "center", gap: 5 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      {cur.urls[1]}
                    </a>
                  )}
                </div>
              )}

              <div style={{ marginBottom: 22 }}>
                <p style={{ fontSize: 9.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: C.muted, marginBottom: 10 }}>What was built</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {cur.bullets.map((b, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", background: "#faf9f6", borderRadius: 10, border: `1px solid ${C.line}` }}>
                      <div style={{ width: 20, height: 20, borderRadius: 6, background: cur.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <p style={{ fontSize: 12, color: C.ink, margin: 0, lineHeight: 1.6 }}>{b}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ fontSize: 9.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: C.muted, marginBottom: 8 }}>Stack</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {cur.tech.map(t => (
                    <span key={t} style={{ fontSize: 11, background: C.soft, color: C.ink, padding: "5px 12px", borderRadius: 7, border: `1px solid ${C.line}`, fontWeight: 600 }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ABOUT PAGE
// ══════════════════════════════════════════════════════════════
function AboutPage() {
  const proof = [
    { k: "60+", v: "production issues resolved", c: C.coral },
    { k: "11", v: "projects shipped", c: C.navy },
    { k: "4", v: "domains: SaaS, fintech, realtime, AI", c: "#0ea5e9" },
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
    { year: "2026", event: "Building WebRTC infrastructure, AI tools, and the Techiesaie studio." },
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
Full-stack engineer with 1+ year of production experience shipping SaaS platforms, billing engines, and real-time systems. Resolved 60+ live bugs, designed financial and booking infrastructure from scratch, shipped 10+ projects across Node.js, React, PostgreSQL, Django, and WebRTC.

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

AI Check Data | React, Node.js, Supabase, Gemini/Groq/Mistral/Claude
• Multi-LLM validation platform routing requests in parallel with weighted consensus scoring.

Kanban Pro | React, Node.js, WebSockets
• Real-time collaborative Kanban: room-based WebSocket architecture, live presence, auto-reconnection.

TECHNICAL SKILLS
Frontend: React, TypeScript, JavaScript, Tailwind CSS, Next.js
Backend: Node.js, Python, Django, FastAPI, PHP
Database: PostgreSQL, MySQL, MongoDB, Redis, Supabase
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
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
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
              Full-stack engineer with 1+ year of production experience shipping SaaS platforms, billing engines, and real-time systems. Built and maintained software used by real customers — resolved 60+ live bugs, designed financial and booking infrastructure from scratch, and shipped 10+ projects across Node.js, React, PostgreSQL, Django, and WebRTC. Comfortable owning features end-to-end, from database schema to deployed UI.
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
                ].map((b,i) => <li key={i} style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{b}</li>)}
              </ul>
            </div>
          </Section>

          <Section title="Selected Projects" color="#8b5cf6">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { name: "BillingOS", tech: "Node.js, React, PostgreSQL, Redis, Stripe, PDFKit", color: "#0ea5e9",
                  bullets: ["Multi-tenant billing engine modelled on Stripe Billing: subscription lifecycle, proration invoices, PostgreSQL Row-Level Security.", "Exponential-backoff retry queues (1h→6h→24h→72h); idempotent Stripe webhook processing with unique stripe_event_id."] },
                { name: "Payout Engine", tech: "Django, PostgreSQL, Celery, Redis", color: "#10b981",
                  bullets: ["Integer paise storage (BigIntegerField) to eliminate float drift; SELECT FOR UPDATE inside transaction.atomic() prevents concurrent overdrafts.", "Idempotency keys with DB-level unique constraint; atomic failure-handling — marking failed and crediting refund in one transaction."] },
                { name: "Vault", tech: "Node.js, WebRTC, WebSockets", color: "#0ea5e9",
                  bullets: ["P2P file sharing with direct encrypted WebRTC data channels — no files ever touch the server. Token-based room codes, chunked transfer, progress tracking."] },
                { name: "AI Check Data", tech: "React, Node.js, Supabase, LLM APIs", color: "#6366f1",
                  bullets: ["Multi-LLM validation platform routing across four providers in parallel; weighted consensus scoring with automatic fallback on rate limits."] },
                { name: "Kanban Pro", tech: "React, Node.js, WebSockets", color: "#8b5cf6",
                  bullets: ["Real-time collaborative Kanban: room-based WebSocket architecture, live presence indicators, last-write-wins conflict resolution, auto-reconnection."] },
              ].map(p => (
                <div key={p.name} style={{ padding: "14px 16px", background: C.soft, borderRadius: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 7 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12.5, fontWeight: 800, color: C.ink }}>{p.name}</span>
                    <span style={{ fontSize: 9.5, color: C.muted, background: C.card, padding: "2px 8px", borderRadius: 5, border: `1px solid ${C.line}` }}>{p.tech}</span>
                  </div>
                  <ul style={{ margin: 0, padding: "0 0 0 15px", display: "flex", flexDirection: "column", gap: 3 }}>
                    {p.bullets.map((b,i) => <li key={i} style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.6 }}>{b}</li>)}
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
                { cat: "Database", items: "PostgreSQL, MySQL, MongoDB, Redis, Supabase" },
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 16 }}>
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
                <aside style={{ background: C.navy, color: "#fff", padding: "28px 24px", minHeight: 960, borderRight: `6px solid ${C.coral}` }}>
                  <img src={niceFace} alt="" style={{ width: 66, height: 66, objectFit: "contain", background: "#fff", borderRadius: 18, border: `2px solid ${C.coral}`, marginBottom: 22 }} />
                  <h2 style={{ fontSize: 27, lineHeight: 1.02, fontWeight: 950, margin: "0 0 6px", letterSpacing: "-0.04em" }}>Imran Khan</h2>
                  <p style={{ fontSize: 12, lineHeight: 1.5, color: "rgba(255,255,255,0.76)", margin: "0 0 22px" }}>Full-Stack Engineer · Mumbai, India</p>

                  {[
                    ["Email", "muhammadimrank034@gmail.com"],
                    ["Phone", "+91 7506190224"],
                    ["LinkedIn", "linkedin.com/in/imranrkhan13"],
                    ["GitHub", "github.com/imranrkhan13"],
                  ].map(([label, value]) => (
                    <div key={label} style={{ marginBottom: 13 }}>
                      <p style={{ fontSize: 8.5, color: C.coral, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 3px" }}>{label}</p>
                      <p style={{ fontSize: 10.8, color: "rgba(255,255,255,0.82)", lineHeight: 1.4, margin: 0, wordBreak: "break-word" }}>{value}</p>
                    </div>
                  ))}

                  <div style={{ height: 1, background: "rgba(255,255,255,0.14)", margin: "22px 0" }} />
                  <p style={{ fontSize: 9, color: C.coral, fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.16em", margin: "0 0 10px" }}>Core Stack</p>
                  {["React", "Node.js", "PHP", "Django", "PostgreSQL", "Redis", "WebRTC", "Supabase"].map(t => (
                    <span key={t} style={{ display: "inline-block", fontSize: 10.5, fontWeight: 800, color: "#fff", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 999, padding: "5px 8px", margin: "0 5px 6px 0" }}>{t}</span>
                  ))}
                  <div style={{ height: 1, background: "rgba(255,255,255,0.14)", margin: "22px 0" }} />
                  <p style={{ fontSize: 9, color: C.coral, fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.16em", margin: "0 0 10px" }}>Strengths</p>
                  {["Multi-tenant SaaS", "Billing workflows", "Financial correctness", "Realtime systems", "Production debugging"].map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.coral, flexShrink: 0 }} />
                      <span style={{ fontSize: 10.8, color: "rgba(255,255,255,0.84)", lineHeight: 1.35 }}>{item}</span>
                    </div>
                  ))}
                  <div style={{ height: 1, background: "rgba(255,255,255,0.14)", margin: "22px 0" }} />
                  <p style={{ fontSize: 9, color: C.coral, fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.16em", margin: "0 0 10px" }}>Education</p>
                  <p style={{ fontSize: 11.2, color: "#fff", fontWeight: 850, lineHeight: 1.35, margin: "0 0 4px" }}>BSc Information Technology</p>
                  <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.72)", lineHeight: 1.4, margin: 0 }}>MVM College, University of Mumbai · 2022-2025</p>
                </aside>

                <main style={{ padding: "30px 34px" }}>
                  <section style={{ marginBottom: 22, paddingBottom: 20, borderBottom: `1px solid ${C.line}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ width: 26, height: 2, background: C.coral }} />
                      <p style={{ fontSize: 9, color: C.coral, fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.18em", margin: 0 }}>Profile</p>
                    </div>
                    <p style={{ fontSize: 13.2, lineHeight: 1.72, color: C.ink, margin: 0 }}>
                      Full-stack engineer with production experience shipping SaaS platforms, billing engines, and realtime systems. I focus on backend reliability, database integrity, clean product workflows, and interfaces that make operational work easier.
                    </p>
                  </section>

                  <section style={{ marginBottom: 24, paddingBottom: 22, borderBottom: `1px solid ${C.line}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <span style={{ width: 26, height: 2, background: C.coral }} />
                      <p style={{ fontSize: 9, color: C.coral, fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.18em", margin: 0 }}>Impact Snapshot</p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                      {[
                        ["60+", "production issues resolved across live fleet workflows"],
                        ["11", "projects shipped across SaaS, fintech, AI, and realtime tooling"],
                        ["0", "downtime maintained while delivering production fixes"],
                      ].map(([n, text]) => (
                        <div key={text} style={{ background: "#f7f4ee", border: `1px solid ${C.line}`, borderTop: `3px solid ${n === "60+" ? C.coral : C.navy}`, borderRadius: 10, padding: "11px 12px" }}>
                          <p style={{ fontSize: 20, color: n === "60+" ? C.coral : C.navy, fontWeight: 950, margin: 0 }}>{n}</p>
                          <p style={{ fontSize: 9.8, color: C.ink, lineHeight: 1.35, margin: "3px 0 0" }}>{text}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section style={{ marginBottom: 24, paddingBottom: 22, borderBottom: `1px solid ${C.line}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <span style={{ width: 26, height: 2, background: C.coral }} />
                      <p style={{ fontSize: 9, color: C.coral, fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.18em", margin: 0 }}>Experience</p>
                    </div>
                    <div style={{ borderLeft: `3px solid ${C.coral}`, paddingLeft: 15, background: "#faf9f6", padding: "14px 16px", borderRadius: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                        <h3 style={{ fontSize: 15, color: C.navy, fontWeight: 950, margin: 0 }}>Associate Software Engineer</h3>
                        <span style={{ fontSize: 10, color: C.muted, fontWeight: 800, whiteSpace: "nowrap" }}>Oct 2025 - Mar 2026</span>
                      </div>
                      <p style={{ fontSize: 11.5, color: C.coral, fontWeight: 900, margin: "0 0 9px" }}>Swayambhu Tech · Mumbai</p>
                      <ul style={{ margin: 0, paddingLeft: 17, display: "flex", flexDirection: "column", gap: 6 }}>
                        {[
                          "Built and maintained Drive Accessible, a production fleet rental SaaS with live customers.",
                          "Delivered booking conflict prevention, billing workflows, payment tracking, renewals, and role-based dashboards.",
                          "Resolved 60+ production bugs and feature issues while keeping the live portal stable.",
                          "Shipped SEO-focused public pages with structured data and scroll-triggered UI polish.",
                          "Worked across PHP, MySQL, JavaScript, deployment fixes, customer-facing pages, and admin operations.",
                        ].map(item => <li key={item} style={{ fontSize: 12, lineHeight: 1.55, color: C.ink }}>{item}</li>)}
                      </ul>
                    </div>
                  </section>

                  <section style={{ marginBottom: 24, paddingBottom: 22, borderBottom: `1px solid ${C.line}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <span style={{ width: 26, height: 2, background: C.coral }} />
                      <p style={{ fontSize: 9, color: C.coral, fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.18em", margin: 0 }}>Selected Projects</p>
                    </div>
                    {PROJECTS.slice(0, 5).map((p, i) => (
                      <div key={p.id} style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 11, padding: "0 0 13px", marginBottom: 13, borderBottom: i < 4 ? `1px dashed ${C.line}` : "none" }}>
                        <span style={{ width: 22, height: 22, borderRadius: 7, background: i % 2 === 0 ? C.navy : C.coral, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 950 }}>{p.num}</span>
                        <div>
                          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, marginBottom: 3 }}>
                            <h3 style={{ fontSize: 13.5, color: C.navy, fontWeight: 950, margin: 0 }}>{p.name}</h3>
                            <span style={{ fontSize: 9.5, color: C.coral, fontWeight: 900, whiteSpace: "nowrap" }}>{p.year}</span>
                          </div>
                          <p style={{ fontSize: 11.4, color: C.ink, lineHeight: 1.52, margin: "0 0 5px" }}>{p.tagline}</p>
                          <p style={{ fontSize: 10.7, color: C.muted, lineHeight: 1.45, margin: "0 0 5px" }}>{p.bullets[0]}</p>
                          <p style={{ fontSize: 10.5, color: C.coral, fontWeight: 850, lineHeight: 1.45, margin: 0 }}>{p.tech.slice(0, 5).join(" · ")}</p>
                        </div>
                      </div>
                    ))}
                  </section>

                  <section>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <span style={{ width: 26, height: 2, background: C.coral }} />
                      <p style={{ fontSize: 9, color: C.coral, fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.18em", margin: 0 }}>Technical Range</p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {[
                        ["Frontend", "React, TypeScript, Framer Motion, responsive UI"],
                        ["Backend", "Node.js, Django, PHP, REST APIs, queues"],
                        ["Database", "PostgreSQL, MySQL, Redis, Supabase, RLS"],
                        ["Systems", "WebRTC, WebSockets, Stripe webhooks, idempotency"],
                      ].map(([label, text]) => (
                        <div key={label} style={{ background: C.coralFaint, border: `1px solid ${C.coralLight}`, borderRadius: 12, padding: "12px 13px" }}>
                          <p style={{ fontSize: 9.5, color: C.coral, fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 5px" }}>{label}</p>
                          <p style={{ fontSize: 11, color: C.ink, lineHeight: 1.42, margin: 0 }}>{text}</p>
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
  return (
    <header className="site-nav" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, minHeight: 52, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "0 24px", background: "rgba(250,249,246,0.92)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.line}` }}>
      <button onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 800, color: C.ink, background: "none", border: "none", cursor: "pointer", letterSpacing: "-0.01em" }}>
        <img src={niceFace} alt="" style={{ width: 29, height: 29, objectFit: "contain", borderRadius: 8, background: C.navy, border: `1px solid ${C.coralLight}` }} />
        Imran Khan
      </button>
      <nav className="site-nav-links" style={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
        {[["home","Home"],["work","Work"],["about","About"]].map(([id, label]) => (
          <button key={id} onClick={() => setPage(id)}
            style={{ padding: "5px 12px", borderRadius: 99, border: "none", cursor: "pointer", fontSize: 11, fontWeight: page === id ? 700 : 500, background: page === id ? C.soft : "transparent", color: page === id ? C.ink : C.muted, transition: "all 0.15s" }}>
            {label}
          </button>
        ))}
        <button onClick={onResume}
          style={{ padding: "5px 12px", borderRadius: 99, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 650, background: "transparent", color: C.muted, transition: "all 0.15s" }}>
          Resume
        </button>
        <a href="mailto:muhammadimrank034@gmail.com"
          style={{ marginLeft: 6, padding: "5px 14px", borderRadius: 99, border: "none", background: C.coral, color: "#fff", fontSize: 10, fontWeight: 800, cursor: "pointer", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Contact
        </a>
      </nav>
    </header>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [resumeOpen, setResumeOpen] = useState(false);
  return (
    <div style={{ background: C.bg, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: C.ink, minHeight: "100vh" }}>
      <Nav page={page} setPage={setPage} onResume={() => setResumeOpen(true)} />
      <AnimatePresence mode="wait">
        <motion.div key={page} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.24, ease: EASE }}>
          {page === "home"    && <HomePage setPage={setPage} onResume={() => setResumeOpen(true)} />}
          {page === "work"    && <WorkPage />}
          {page === "about"   && <AboutPage />}
        </motion.div>
      </AnimatePresence>
      <ResumeSheet open={resumeOpen} onClose={() => setResumeOpen(false)} />
      <footer style={{ borderTop: `1px solid ${C.line}`, padding: "16px 32px", display: "flex", justifyContent: "space-between", maxWidth: 1060, margin: "0 auto" }}>
        <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted }}>Imran Khan · 2026</span>
        <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted }}>Maintained by TechiesAIE</span>
      </footer>
    </div>
  );
}
