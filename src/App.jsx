import { useState, useRef, useEffect } from "react";
// `motion.*` is referenced through JSX member expressions; the local ESLint setup does not detect those usages.
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence, MotionConfig, useInView, useReducedMotion, animate } from "framer-motion";
import {
  ArrowUpRight, Boxes, BriefcaseBusiness, Braces, Building2, Code2,
  Database, Download, ExternalLink, FileText, FolderKanban, Github,
  Globe2, GraduationCap, House, Linkedin, Mail, Phone, Rocket, Send,
  ShieldCheck, Sparkles, Trophy, UserRound,
} from "lucide-react";
import {
  SiDjango, SiMysql, SiNodedotjs, SiPhp, SiPostgresql, SiReact,
  SiRedis, SiSocketdotio, SiStripe, SiSupabase, SiTypescript, SiWebrtc,
} from "react-icons/si";
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

const MEDCONNECT_SUMMARY = "Contributing backend engineering to MedConnect across article publishing, job discovery and applications, resume workflows, feeds, and media delivery.";

const MEDCONNECT_BULLETS = [
  "Built and refined article APIs for slug-based detail, owner draft access, published-status filtering, and complete create responses.",
  "Improved job discovery and applications with fresher flags, multi-city/state data, applied-job search, recommendations, recent applications, closed/draft visibility rules, and limit/offset pagination.",
  "Strengthened profile and resume workflows with deletion and status checks, readable filenames, file compression and URLs, and profile-strength integration.",
  "Improved feed and media responses with per-user reactions, user slugs, reusable hospital-logo URL handling, normalized media paths, and serializer-backed application responses.",
];

const HACKATHON_PROJECTS = [
  {
    id: "ship-or-donate", num: "H1", name: "Ship or Donate", tag: "Spark · Monad Hackathon", year: "2026", color: "#8b5cf6",
    tagline: "Onchain commitment escrow for shipping deadlines.",
    short: "Ship or Donate is a hackathon build: an onchain commitment escrow on Monad testnet. A builder stakes test MON, submits proof, and gets a refund after verifier approval or sends the stake to an open-source recipient.",
    context: "Hackathon build. A verified flow completed staking, proof submission, verifier approval, and refund on Monad testnet.",
    liveUrl: "https://ship-or-donate.vercel.app/", tech: ["Solidity", "Next.js", "wagmi", "viem"],
    bullets: ["Built an onchain escrow that locks test MON against a builder-defined shipping deadline.", "Completed a verified flow covering staking, proof submission, verifier approval, and refund.", "Implemented the verifier-reviewed proof flow before a refund is released."],
  },
  {
    id: "dealmemory", num: "H2", name: "DealMemory / Activation Memory", tag: "Supermemory × Dodo", year: "2026", color: "#0ea5e9",
    tagline: "Remembers where a trial user got stuck, so onboarding can continue.",
    short: "DealMemory is a hackathon project for an activation-intelligence SDK that remembers a SaaS trial user's goal, progress, and blocker across sessions. It gives product teams enough context to resume onboarding at the next useful step instead of starting over.",
    context: "Hackathon project using Supermemory Local. It explores how to carry activation context across sessions without presenting the build as production-ready.",
    liveUrl: "https://dealmemory.vercel.app/", tech: ["TypeScript", "Next.js", "Prisma", "Supermemory Local"],
    bullets: ["Tracked explicit activation events, user goals, and blockers across trial sessions.", "Helped resume onboarding at the next useful step instead of restarting from scratch.", "Built for the Supermemory × Dodo Hackathon; not presented as production-ready."],
  },
  {
    id: "vendor-risk-agent", num: "H3", name: "Vendor Risk Assessment Agent", tag: "RAISE Summit · Vultr", year: "2026", color: "#14b8a6",
    tagline: "A source-grounded vendor-risk review prototype built under time pressure.",
    short: "Vendor Risk Assessment Agent is a hackathon prototype that ingests SOC 2 reports, extracts relevant evidence through a multi-step workflow, and turns it into deterministic vendor-risk scoring. The result is a review that can be inspected rather than treated as a black box.",
    context: "RAISE Summit / Vultr hackathon prototype built in under 24 hours, prioritising traceable assessment logic over an opaque score.",
    tech: ["Python", "FastAPI", "Next.js"],
    bullets: ["Built the prototype in under 24 hours.", "Ingests SOC 2 reports and runs a multi-step review workflow.", "Pairs agentic extraction with deterministic scoring for a more explainable assessment."],
  },
  {
    id: "voxstep", num: "H4", name: "Voxstep", tag: "Voice AI Challenge", year: "2026", color: "#f59e0b",
    tagline: "Pronunciation scoring with deterministic phoneme alignment.",
    short: "Voxstep is a pronunciation-scoring application that combines Gradium, Groq Whisper, Deepgram, and OpenAI fallback transcription with deterministic phoneme alignment, word-error rate, transcription confidence, and word-level feedback.",
    context: "The app is designed to keep assessment feedback dependable when a primary transcription provider is unavailable.",
    liveUrl: "https://voxstep.vercel.app/", tech: ["Next.js", "TypeScript", "STT APIs"],
    bullets: ["Built a transcription fallback chain across Gradium, Groq Whisper, Deepgram, and OpenAI.", "Implemented deterministic phoneme alignment, word-error rate, transcription confidence, and word-level feedback.", "Built for the Voice AI Assessment Challenge."],
  },
  {
    id: "truthlens", num: "H5", name: "TruthLens AI", tag: "VideoDB Hackathon", year: "2026", color: "#ec4899",
    tagline: "Hackathon video forensics through six agents sharing one evidence layer.",
    short: "TruthLens AI is a hackathon build where six specialist agents share one evidence layer. It combines face detection, audio analysis, and frame-continuity checks so an investigator can examine several signals together rather than rely on one verdict.",
    context: "Hackathon build. The reported 99.8% confidence is attributed to the prototype's output and is not presented as a validated real-world accuracy metric.",
    tech: ["Python", "FastAPI", "Next.js", "VideoDB"],
    bullets: ["Implemented six forensic agents backed by one shared evidence layer.", "Included the prototype's reported 99.8% confidence output without treating it as a validated accuracy metric.", "Added face detection, audio checks, and pixel-level frame-continuity analysis."],
  },
];

const NAV_ITEMS = [
  ["home", "Home", House],
  ["work", "Work", FolderKanban],
  ["about", "About", UserRound],
  ["resume", "Resume", FileText],
];

function CountUp({ value, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12px" });
  const reduceMotion = useReducedMotion();
  const text = String(value);
  const target = Number(text.match(/\d+/)?.[0] || 0);
  const suffix = text.replace(String(target), "");
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduceMotion) return undefined;
    const controls = animate(0, target, {
      duration: 0.85,
      ease: EASE,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, target]);

  return <span ref={ref} style={{ fontVariantNumeric: "tabular-nums", ...style }}>{reduceMotion ? target : display}{suffix}</span>;
}

function ProjectIcon({ project, size = 13 }) {
  const source = `${project.tag} ${project.tech.join(" ")}`.toLowerCase();
  const Icon = source.includes("hackathon") || source.includes("challenge") || source.includes("spark")
    ? Rocket
    : source.includes("fintech") || source.includes("database") || source.includes("postgres")
      ? Database
      : source.includes("security") || source.includes("governance") || source.includes("forensic")
        ? ShieldCheck
        : source.includes("developer") || source.includes("tool") || source.includes("sdk")
          ? Code2
          : Boxes;
  return <Icon size={size} strokeWidth={2.15} aria-hidden="true" />;
}

function TechTag({ name, dark = false }) {
  const key = name.toLowerCase();
  const Icon = key.includes("postgres") || key.includes("mysql") || key.includes("redis") || key.includes("mongo") || key.includes("prisma")
    ? Database
    : key.includes("python") || key.includes("typescript") || key.includes("javascript") || key.includes("solidity")
      ? Braces
      : key.includes("react") || key.includes("next") || key.includes("docker")
        ? Boxes
        : Code2;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 750, color: dark ? "#fff" : C.navy, background: dark ? "rgba(255,255,255,0.1)" : C.soft, padding: "3px 8px", borderRadius: 99, border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : C.line}` }}>
      <Icon size={11} strokeWidth={2.2} aria-hidden="true" />
      {name}
    </span>
  );
}

// Tech → projects mapping for hover tooltips
const TECH_PROJECTS = {
  "React": ["BillingOS", "Kanban Pro", "AI Check Data", "TalkingResume / ResumeIQ", "DevLens", "FoodExpress", "Wikireels", "Techiesaie", "AI Model Governance Platform", "AI Try-On", "MindFlow", "Office Operations Hub", "Interfaze Verify", "TalkToYourDB"],
  "Node.js": ["BillingOS", "Kanban Pro", "Vault", "FoodExpress", "AgentLens"],
  "Python": ["MindFlow", "AI Try-On", "AI Model Governance Platform", "AgentLens", "Vendor Risk Assessment Agent"],
  "FastAPI": ["MindFlow", "AI Try-On", "AI Model Governance Platform", "AgentLens", "Vendor Risk Assessment Agent"],
  "PostgreSQL": ["BillingOS", "Payout Engine", "AI Model Governance Platform", "AgentLens", "Office Operations Hub", "ProofFlow", "Ops Decision System"],
  "PHP": ["DriveAccessible"],
  "Django": ["Payout Engine"],
  "WebRTC": ["Vault"],
  "Redis": ["BillingOS", "Payout Engine"],
  "TypeScript": ["FoodExpress", "AgentLens", "ProofFlow", "TalkToYourDB"],
  "MySQL": ["DriveAccessible"],
  "Supabase": ["AI Check Data"],
  "WebSockets": ["Kanban Pro", "Vault"],
  "Stripe": ["BillingOS"],
  "Docker": ["MindFlow", "AI Model Governance Platform", "AgentLens"],
  "React Flow": ["MindFlow"],
  "NetworkX": ["MindFlow"],
  "LLMs": ["MindFlow", "AI Model Governance Platform"],
  "Hugging Face": ["MindFlow", "AI Try-On"],
  "Express": ["BillingOS", "Vault"],
  "REST APIs": ["BillingOS", "FoodExpress", "DevLens"],
  "MongoDB": ["FoodExpress"],
  "pgvector": ["AI Model Governance Platform"],
  "Next.js": ["Ship or Donate", "DealMemory / Activation Memory", "Voxstep", "Vendor Risk Assessment Agent", "TruthLens AI"],
  "Tailwind CSS": [],
  "Framer Motion": ["Wikireels", "Techiesaie"],
  "JavaScript": ["DriveAccessible", "FoodExpress"],
  "Django REST Framework": ["Payout Engine", "MedConnect"],
  "Laravel": ["DriveAccessible"],
  "Vue.js": [],
};

const PROJECTS = [
  {
    id: "drive", num: "01", name: "DriveAccessible", tag: "SaaS · Production", year: "October 2025 – March 2026", color: "#e27d60",
    tagline: "Fleet-management and rental SaaS for daily operations.",
    short: "DriveAccessible is a production fleet-management and car-rental operations SaaS covering vehicle inventory, booking availability, billing, payment tracking, renewals, and operational workflows. It was adopted by 5+ companies within four months of launch.",
    context: "Associate Software Engineer work at SvayambhuTech from October 2025 to March 2026. The project covered live operational workflows without presenting unverified customer or payment claims.",
    urls: ["driveaccessible.com", "fleet.driveaccessible.com"], liveUrl: "https://driveaccessible.com", fleetUrl: "https://fleet.driveaccessible.com",
    tech: ["PHP", "JavaScript", "MySQL"],
    bullets: [
      "Built conflict detection to prevent double-bookings, with booking-window checks across vehicle availability.",
      "Built daily-rate pricing, deposits, partial payments, PDF invoices, overdue-payment dashboards, and renewal workflows.",
      "Owned full-stack delivery across APIs, databases, integrations, deployment debugging, and operational tooling.",
      "Resolved 60+ production issues across edge-case bugs, workflow fixes, and feature deliveries.",
      "Built role-based access and a public SEO site for the rental workflow.",
    ],
  },
  {
    id: "billingos", num: "02", name: "BillingOS", tag: "SaaS · Infrastructure", year: "2025", color: "#0ea5e9",
    tagline: "Production-grade multi-tenant billing engine modelled on Stripe Billing.",
    short: "BillingOS is a multi-tenant billing engine that models the subscription lifecycle from trial to cancellation, calculates proration when plans change, and creates invoices and retry workflows. It treats webhooks and customer data as infrastructure concerns, using idempotency and PostgreSQL row-level security to keep the system safe as it grows.",
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
    short: "Payout Engine models money movement as immutable ledger operations, storing amounts as integer paise and locking rows during concurrent balance updates. It handles duplicate requests, failed transfers, and stuck jobs explicitly so a payout cannot silently create an inconsistent balance.",
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
    short: "Kanban Pro is a real-time collaborative workspace where teams join a shared board with an invite code and see changes immediately through WebSocket sync. It includes presence, card-level activity, and reconnection handling so a dropped connection does not turn into lost work.",
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
    short: "Vault is a peer-to-peer file-sharing tool that transfers files directly between browsers through encrypted WebRTC data channels. The server only coordinates the initial connection; token-based rooms and chunked transfer keep the sharing flow simple without storing the file centrally.",
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
    short: "AI Check Data sends a validation request through several LLM providers in parallel, normalises their responses, and turns the results into a consensus score. Provider failures and rate limits are handled through fallback logic so a single model outage does not stop the validation workflow.",
    context: "Single-LLM validation is fragile — one model's blind spot becomes your product's bug.",
    liveUrl: "https://aicheckdata.netlify.app/", tech: ["React", "Supabase", "PostgreSQL", "LLM APIs"],
    bullets: [
      "Multi-LLM pipeline across four providers, normalising each response into a structured schema before weighted consensus scoring.",
      "Fallback system detects rate-limit errors and API failures, automatically rerouting without surfacing errors to users.",
      "Optimistic UI updates with session-based sync via Supabase Realtime.",
    ],
  },
  {
    id: "talkingresume", num: "07", name: "TalkingResume / ResumeIQ", tag: "AI · Recruiting", year: "2026", color: "#7c3aed",
    tagline: "Candidate answers grounded in the work behind the resume.",
    short: "TalkingResume / ResumeIQ is an evidence-led technical hiring workspace. Recruiters investigate resumes, GitHub repositories, commits, projects, and source files, with answers grounded in exact evidence and citations rather than keyword matching.",
    context: "TalkingResume / ResumeIQ connects a candidate's stated experience to source evidence from their real work. The company-specific work-simulation direction is planned, not a shipped feature.",
    urls: ["talkingresume.netlify.app"], liveUrl: "https://talkingresume.netlify.app/", tech: ["React", "Vite", "Firebase Firestore", "GitHub API"],
    bullets: [
      "Lets recruiters ask an evidence-backed question across a candidate pool, citing exact files, commits, and work-history context rather than guessing from keywords.",
      "Connects candidate resumes with GitHub repository evidence so claims can be reviewed against what was actually built.",
      "Planned, not shipped: company-specific work simulations whose results are checked against clear acceptance criteria.",
    ],
  },
  {
    id: "agentlens", num: "15", name: "AgentLens", tag: "AI · Reliability", year: "2026", color: "#0f9f8f",
    tagline: "Provider routing that fails over before the user feels it.",
    short: "AgentLens is an AI reliability runtime for applications using multiple model providers. It routes requests across 8 providers using health-aware scoring, circuit breakers, retries, telemetry, rate limiting, and explainable failover decisions. Local validation includes 139+ automated tests and a 263 requests-per-second load test with zero failures.",
    context: "AgentLens makes provider reliability an explicit application concern. The load-test result is local validation, not a claim of external production usage.",
    urls: ["agentlens-web.vercel.app"], liveUrl: "https://agentlens-web.vercel.app/", tech: ["Python", "TypeScript", "FastAPI", "PostgreSQL", "Docker"],
    bullets: [
      "Routes requests across 8 providers with health-aware scoring, circuit breakers, and explainable failover decisions.",
      "Includes Python and TypeScript SDKs, Postgres-backed controls, HMAC API-key storage, rate limiting, and telemetry.",
      "Validated with 139+ automated tests and a local load test of 263 requests per second with zero failures; external production usage is not claimed.",
    ],
  },
  {
    id: "office-operations-hub", num: "16", name: "Office Operations Hub", tag: "Ops · Current Build", year: "2026", color: "#e27d60",
    tagline: "Schema-led workflows for the work behind a company.",
    short: "Office Operations Hub is a schema-led company operations workspace covering employee, finance, procurement, IT, legal, travel, workplace, and feedback workflows. Guided requests prepare records, documents, approval packets, tasks, PDFs, and audit history while sensitive decisions remain with permitted human approvers.",
    context: "Current build. Role-aware access, document versioning, source-grounded PDF review, accountable task ownership, due dates, comments, and request timelines are part of the workflow. Not every external integration is presented as production-ready.",
    tech: ["React", "TypeScript", "PostgreSQL", "Workflow APIs"],
    bullets: [
      "Designed guided request flows that turn structured inputs into records, documents, approval packets, tasks, PDFs, and audit history.",
      "Included role-aware access, document versions, source-grounded PDF review, ownership, due dates, comments, and request timelines.",
      "Kept sensitive decisions with permitted human approvers and labelled current implementation boundaries instead of claiming complete integrations.",
    ],
  },
  {
    id: "interfaze-verify", num: "17", name: "Interfaze Verify", tag: "Extraction · Verification", year: "2026", color: "#0ea5e9",
    tagline: "Structured extraction review with evidence you can inspect.",
    short: "Interfaze Verify is a full-stack review workspace around a documented extraction API. Users define schemas, submit document images or URLs, inspect confidence-coded bounding boxes and field-to-region links, normalise values, validate declaratively, and export JSON with review history.",
    context: "Demo documents and responses use synthetic fixtures. The live provider adapter remains unverified without real credentials; this is not presented as a production deployment.",
    tech: ["React", "Vite", "TypeScript", "SQLite", "Extraction API"],
    bullets: [
      "Implemented user-defined schemas, document image or URL submission, confidence-coded bounding boxes, field-to-region links, and normalisation.",
      "Added declarative validation, provider and fixture adapters, audit events, JSON export, SQLite persistence, and review history.",
      "Forty-nine automated tests passed, and server and web production builds passed; the live provider path remains unverified.",
    ],
  },
  {
    id: "proofflow", num: "18", name: "ProofFlow", tag: "Workflow · Prototype", year: "2026", color: "#10b981",
    tagline: "A review workflow prototype with migrations and rollback coverage.",
    short: "ProofFlow is a PostgreSQL-backed workflow prototype with a dedicated Drizzle adapter, additive migrations, authenticated review persistence, and an end-to-end path from provider or fixture evidence through reviewer decisions to PDF output.",
    context: "Prototype boundaries are explicit: historical legacy-data import, live Interfaze OCR/transcription, uploaded-file classification, and conflict-resolution controls remain incomplete.",
    tech: ["TypeScript", "PostgreSQL", "Drizzle", "React"],
    bullets: [
      "Added migration and seed idempotency tests, authenticated review persistence, and rollback coverage.",
      "Covered provider-to-fixture-to-reviewer-to-PDF integration and an authenticated Northstar review journey.",
      "Kept legacy import, live OCR/transcription, uploaded-file classification, and conflict resolution labelled incomplete.",
    ],
  },
  {
    id: "ops-decision-system", num: "19", name: "Fynd-inspired Retail Operations Copilot / Ops Decision System", tag: "AI · Synthetic Evaluation", year: "2026", color: "#f59e0b",
    tagline: "Source-linked retail operations decisions with review-only action plans.",
    short: "This Fynd-inspired commerce operations prototype links orders, inventory, deliveries, returns, incidents, alerts, payments, and campaign risk. It provides source-linked answers and confidence while keeping action plans review-only.",
    context: "Synthetic evaluation only: the fixed synthetic suite passed 20/20 checks. The hiring-grade PostgreSQL-backed authenticated workflow version is still being developed.",
    tech: ["React", "PostgreSQL", "AI Workflows", "Synthetic Data"],
    bullets: [
      "Connected operational entities so questions can trace back to orders, inventory, delivery, returns, incidents, alerts, payments, and campaign risk.",
      "Returned source-linked answers with confidence and kept proposed actions review-only.",
      "Passed 20/20 checks in the fixed synthetic evaluation suite; this is not a production reliability claim.",
    ],
  },
  {
    id: "talktoyourdb", num: "20", name: "TalkToYourDB", tag: "AI · Safety Demo", year: "2026", color: "#6366f1",
    tagline: "Schema-aware database questions with safety checks before execution.",
    short: "TalkToYourDB is a schema-aware database question-answering demo with seven pre-execution safety checks. It blocks unsafe queries, repairs broken queries automatically, and executes only read-only operations; a connection flow for users' own databases is planned.",
    context: "Demo with a planned connection flow. The safety layer is the shipped focus; it does not claim a completed user-database integration.",
    tech: ["React", "TypeScript", "SQL", "LLM APIs"],
    bullets: [
      "Added schema-aware question answering with seven checks before a query can execute.",
      "Blocked unsafe queries, repaired broken queries automatically, and kept execution read-only.",
      "Planned: a connection flow for users' own databases.",
    ],
  },
  {
    id: "devlens", num: "08", name: "DevLens", tag: "Developer Tool", year: "2025", color: "#f59e0b",
    tagline: "GitHub profile analyser with side-by-side contributor comparison.",
    short: "DevLens turns a public GitHub profile into a structured developer snapshot: repositories, language distribution, star counts, and recent activity. It also compares two profiles side by side so a reviewer can examine contribution signals on the same scale.",
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
    short: "Techiesaie is a digital studio for local businesses that need a clearer online presence and more useful internal tooling. The work combines bespoke websites, product design, and operational software so a business is not forced into a generic template or fragmented workflow.",
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
    short: "Wikireels experiments with a mobile-native way to explore Wikipedia: each article becomes a focused, full-screen reel that can be read one idea at a time. It uses vertical flow and continuous discovery to make a large knowledge base feel less like a static document.",
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
    short: "FoodExpress is a full-stack ordering platform that covers the complete customer flow: menu browsing, cart updates, checkout, and order history. A REST API carries the same order data from the React interface through to the backend rather than treating the front end as a standalone demo.",
    context: "A complete end-to-end build covering every layer: database, API, auth, and React frontend.",
    liveUrl: "https://foodexpress-0v7b.onrender.com/", tech: ["React", "TypeScript", "Node.js", "MongoDB"],
    bullets: [
      "REST endpoints for user auth, cart state, order placement, and order history.",
      "Full ordering flow in React + TypeScript: menu filtering, real-time cart updates, order confirmation.",
    ],
  },
  {
    id: "modelgov", num: "12", name: "AI Model Governance Platform", tag: "AI · Enterprise", year: "2026", color: "#14b8a6",
    tagline: "High-trust model review with explicit workflow and audit trail.",
    short: "AI Model Governance Platform is an internal review workspace for teams managing high-trust AI models. It combines a model registry, server-enforced review states, role-based access, document-grounded questions, and an append-only audit trail so a decision can be traced from source evidence to sign-off.",
    context: "Designed as a high-trust review workspace rather than a toy CRUD app, with explicit ownership, evidence, workflow state, and sign-off history.",
    liveUrl: "", tech: ["FastAPI", "PostgreSQL", "pgvector", "React"],
    bullets: [
      "Built a model registry and explicit workflow state machine enforcing role-based transition rules server-side, with a full append-only audit trail.",
      "Designed a RAG pipeline — local sentence-transformer embeddings, pgvector similarity search, a 5-provider LLM fallback router — for grounded document Q&A.",
      "Every AI response is schema-validated with a confidence score and source citations, falling back to 'insufficient context' instead of guessing.",
    ],
  },
  {
    id: "tryon", num: "13", name: "AI Try-On", tag: "AI · Consumer", year: "2026", color: "#ec4899",
    tagline: "Virtual try-on workflow prototype with provider fallback.",
    short: "AI Try-On is a virtual try-on prototype using community-hosted Hugging Face models, automatic provider fallback, and background jobs. It keeps a slower generation task from freezing the product experience and includes a fix for a schema-parsing issue in a third-party client library.",
    context: "Prototype / demo. The implementation explores model fallback and background processing; it is not presented as a production try-on service.",
    liveUrl: "", tech: ["React", "FastAPI", "Python", "Hugging Face"],
    bullets: [
      "Calls community-hosted Hugging Face models with automatic provider fallback and background job processing for try-on generation.",
      "Diagnosed and patched a schema-parsing bug in a third-party AI client library affecting multiple library versions.",
    ],
  },
  {
    id: "mindflow", num: "14", name: "MindFlow", tag: "AI · Developer Tool", year: "2026", color: "#06b6d4",
    tagline: "Turns any README into an interactive, narrated learning experience.",
    short: "MindFlow turns a repository's README and Markdown into an explorable learning layer: architecture maps, dependency relationships, beginner-friendly explanations, interview prompts, and generated walkthroughs. It gives a developer a faster way to form a mental model of an unfamiliar codebase before changing it.",
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

const FEATURED_PROJECT_IDS = ["drive", "agentlens", "talkingresume", "office-operations-hub", "interfaze-verify", "billingos", "payout", "modelgov"];
const FEATURED_PROJECTS = FEATURED_PROJECT_IDS
  .map(id => PROJECTS.find(project => project.id === id))
  .filter(Boolean);

const SKILLS_DATA = {
  Frontend: { items: ["JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Tailwind CSS", "Vite"], color: C.coral },
  Backend: { items: ["Python", "FastAPI", "Django REST Framework", "Node.js", "Express", "PHP", "Laravel"], color: C.ink },
  Data: { items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "pgvector"], color: "#0ea5e9" },
  Infrastructure: { items: ["Docker", "Linux", "GitHub Actions", "CI/CD", "NGINX", "Azure", "GCP"], color: "#10b981" },
  AI: { items: ["OpenAI", "Anthropic", "Gemini", "RAG", "Semantic search", "Vector search", "Agentic workflows", "Speech-to-text", "Text-to-speech"], color: "#8b5cf6" },
};

const TECH_NODES = [
  { name: "React", color: "#61dafb", Icon: SiReact },
  { name: "Node.js", color: "#68a063", Icon: SiNodedotjs },
  { name: "PostgreSQL", color: "#336791", Icon: SiPostgresql },
  { name: "PHP", color: "#8892bf", Icon: SiPhp },
  { name: "Django", color: "#0c4b33", Icon: SiDjango },
  { name: "WebRTC", color: "#e27d60", Icon: SiWebrtc },
  { name: "Redis", color: "#d82c20", Icon: SiRedis },
  { name: "TypeScript", color: "#3178c6", Icon: SiTypescript },
  { name: "MySQL", color: "#00758f", Icon: SiMysql },
  { name: "Supabase", color: "#3ecf8e", Icon: SiSupabase },
  { name: "WebSockets", color: "#8b5cf6", Icon: SiSocketdotio },
  { name: "Stripe", color: "#6772e5", Icon: SiStripe },
];

// ── Card wrapper ───────────────────────────────────────────────
function Card({ children, style = {}, delay = 0, onClick }) {
  const ref = useRef();
  const inView = useInView(ref, { once: true, margin: "-8px" });
  const [hov, setHov] = useState(false);
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.44, delay: reduceMotion ? 0 : delay, ease: EASE }}
      whileHover={reduceMotion ? {} : onClick ? { y: -4 } : { y: -1 }}
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
        initial={reduceMotion ? false : { scaleX: 0 }} animate={reduceMotion ? {} : { scaleX: hov ? 1 : 0 }}
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
  return (
    <div className="profile-strip profile-strip-main" style={{ padding: "28px 30px", display: "grid", gridTemplateColumns: "270px 1fr", gap: 32 }}>
      {/* Left: identity */}
      <div className="profile-strip-left" style={{ display: "flex", flexDirection: "column", gap: 16, borderRight: `1px solid ${C.line}`, paddingRight: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img className="profile-avatar" src={niceFace} alt="" style={{ width: 50, height: 50, objectFit: "contain", background: "#fff", borderRadius: 14, border: `1.5px solid ${C.coralLight}`, boxShadow: "0 6px 20px rgba(35,38,66,0.10)", display: "block" }} />
            <span style={{ position: "absolute", bottom: -2, right: -2, width: 12, height: 12, borderRadius: "50%", background: "#22c55e", border: "2px solid #fff", display: "block" }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 className="profile-name" style={{ fontSize: 18, fontWeight: 950, color: C.navy, margin: 0, letterSpacing: "-0.03em" }}>Imran Khan</h1>
            <p className="profile-role" style={{ fontSize: 12, color: C.coral, fontWeight: 850, margin: "2px 0 0", letterSpacing: "0.01em" }}>Full-Stack Engineer · AI Backend</p>
          </div>
        </div>

        <p className="profile-positioning" style={{ fontSize: 14, color: C.ink, lineHeight: 1.65, margin: 0, fontWeight: 550 }}>
          Building <span style={{ color: C.coral, fontWeight: 850 }}>secure SaaS products</span>, booking apps, billing tools, and realtime features.
        </p>

        <div className="profile-proof" style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 21, fontWeight: 950, color: C.coral, margin: 0, letterSpacing: "-0.03em" }}><CountUp value="150+" /></p>
            <p style={{ fontSize: 8.5, fontWeight: 850, textTransform: "uppercase", letterSpacing: "0.1em", color: C.muted, margin: "2px 0 0" }}>Features</p>
          </div>
          <div>
            <p style={{ fontSize: 21, fontWeight: 950, color: C.navy, margin: 0, letterSpacing: "-0.03em" }}><CountUp value={PROJECTS.length} /></p>
            <p style={{ fontSize: 8.5, fontWeight: 850, textTransform: "uppercase", letterSpacing: "0.1em", color: C.muted, margin: "2px 0 0" }}>Projects</p>
          </div>
          <div>
            <p style={{ fontSize: 21, fontWeight: 950, color: "#8b5cf6", margin: 0, letterSpacing: "-0.03em" }}><CountUp value={HACKATHON_PROJECTS.length} /></p>
            <p style={{ fontSize: 8.5, fontWeight: 850, textTransform: "uppercase", letterSpacing: "0.1em", color: C.muted, margin: "2px 0 0" }}>Hackathons</p>
          </div>
        </div>

        <p style={{ fontSize: 12.5, color: C.ink, margin: "auto 0 0", fontWeight: 650 }}>
          <span style={{ color: C.muted, fontWeight: 700, textTransform: "uppercase", fontSize: 8.5, letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>Primary stack</span>
          PHP · PostgreSQL · Node.js · React
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.line}`, paddingTop: 12 }}>
          <span style={{ fontSize: 9, color: C.muted, fontWeight: 600 }}>Mumbai · Open to work</span>
          <span style={{ fontSize: 9, color: C.muted, fontFamily: "monospace" }}>{time}</span>
        </div>
      </div>

      {/* Right: current and recent experience */}
      <div className="profile-strip-right" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <p style={{ fontSize: 8.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.18em", color: C.coral, margin: "0 0 4px" }}>Experience</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <h2 className="experience-title" style={{ fontSize: 20, fontWeight: 950, color: C.navy, margin: 0, letterSpacing: "-0.03em" }}>AI Backend Developer</h2>
            <p style={{ fontSize: 12.5, color: C.muted, margin: 0, fontWeight: 700 }}>Boston Institute of Analytics India · Mumbai</p>
            <span style={{ fontSize: 9, color: C.coral, background: C.coralFaint, borderRadius: 999, padding: "2px 8px", fontWeight: 850, whiteSpace: "nowrap" }}>Current</span>
          </div>
          <p className="experience-summary" style={{ fontSize: 13.5, color: C.ink, margin: "9px 0 0", lineHeight: 1.6 }}>{MEDCONNECT_SUMMARY}</p>
        </div>

        <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
          {[["150+", "features shipped"], ["5+", "companies"], ["60+", "production issues"]].map(([n, l]) => (
            <div key={l}>
              <p style={{ fontSize: 17, fontWeight: 950, color: C.coral, margin: 0, letterSpacing: "-0.03em" }}><CountUp value={n} /></p>
              <p style={{ fontSize: 8, color: C.muted, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", margin: "2px 0 0" }}>{l}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {(expanded ? MEDCONNECT_BULLETS : MEDCONNECT_BULLETS.slice(0, 2)).map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: i === 0 ? C.coral : C.soft, border: i !== 0 ? `1px solid ${C.line}` : "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke={i === 0 ? "#fff" : C.muted} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <p className="experience-bullet" style={{ fontSize: 13, color: C.ink, margin: 0, lineHeight: 1.58 }}>{b}</p>
            </div>
          ))}
          <button onClick={() => setExpanded(e => !e)} style={{ alignSelf: "flex-start", fontSize: 9.5, color: C.coral, fontWeight: 800, background: "none", border: "none", padding: 0, cursor: "pointer", marginTop: 2 }}>
            {expanded ? "Show less ↑" : `+${MEDCONNECT_BULLETS.length - 2} more ↓`}
          </button>
        </div>

        <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 10 }}>
          <p style={{ fontSize: 12, color: C.muted, margin: "0 0 4px", fontWeight: 750 }}>Previously · Associate Software Engineer · SvayambhuTech · Mumbai</p>
          <p style={{ fontSize: 12, color: C.muted, margin: 0, fontWeight: 600 }}>Oct 2025 – Mar 2026 · DriveAccessible fleet and rental operations SaaS</p>
        </div>

      </div>
    </div>
  );
}

// ── ProjectsCycleCard ──────────────────────────────────────────
function ProjectsCycleCard({ onOpenProject }) {
  const [idx, setIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [hoveredDot, setHoveredDot] = useState(null);
  const featured = FEATURED_PROJECTS;

  useEffect(() => {
    if (hovered) return;
    const id = setInterval(() => setIdx(i => (i + 1) % featured.length), 3200);
    return () => clearInterval(id);
  }, [hovered, featured.length]);

  const cur = featured[idx];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpenProject?.(cur)}
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
            <p style={{ fontSize: 16, fontWeight: 900, color: C.navy, margin: 0, letterSpacing: "-0.02em" }}>{PROJECTS.length} portfolio projects</p>
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
              <span style={{ color: cur.color, display: "inline-flex" }}><ProjectIcon project={cur} size={14} /></span>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: cur.color, display: "inline-block", boxShadow: hovered ? `0 0 0 4px ${cur.color}22` : "none", transition: "box-shadow 0.2s" }} />
              <span style={{ fontSize: 9, fontWeight: 800, color: cur.color, background: cur.color + "14", padding: "2px 8px", borderRadius: 99, letterSpacing: "0.06em", textTransform: "uppercase" }}>{cur.tag}</span>
              <span style={{ fontSize: 9, color: C.muted, fontFamily: "monospace" }}>{cur.year}</span>
              {cur.liveUrl && <span style={{ fontSize: 9, color: "#22c55e", fontWeight: 900, background: "#dcfce7", padding: "2px 7px", borderRadius: 99, marginLeft: "auto" }}>● Live</span>}
            </div>

            {/* Title + tagline */}
            <h4 style={{ fontSize: 29, fontWeight: 950, color: C.navy, margin: "0 0 7px", letterSpacing: "-0.045em" }}>{cur.name}</h4>
            <p style={{ fontSize: 15, color: cur.color, fontWeight: 850, margin: "0 0 12px", lineHeight: 1.4 }}>{cur.tagline}</p>

            {/* What it does — flowing text, no nested boxes */}
            <p style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.65, margin: "0 0 12px", flex: 1 }}>{cur.short}</p>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 16 }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: cur.color, marginTop: 7, flexShrink: 0 }} />
              <p style={{ fontSize: 12.5, color: C.muted, margin: 0, lineHeight: 1.58 }}>{cur.bullets[0]}</p>
            </div>

            {/* Footer: tech + link */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, borderTop: `1px solid ${C.line}`, paddingTop: 14 }}>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {cur.tech.slice(0, 3).map(t => <TechTag key={t} name={t} />)}
                {cur.tech.length > 3 && <span style={{ fontSize: 9.5, color: C.muted, fontWeight: 700 }}>+{cur.tech.length - 3}</span>}
              </div>
              <span style={{ fontSize: 11.5, color: cur.color, fontWeight: 900, opacity: hovered ? 1 : 0.6, transition: "opacity 0.2s", whiteSpace: "nowrap" }}>See all {PROJECTS.length} →</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── SkillsCard ─────────────────────────────────────────────────
const SKILLS_EXPANDED = {
  Frontend: { color: C.coral, items: ["React", "Next.js", "Vue.js", "TypeScript", "JavaScript", "Tailwind CSS", "Vite"] },
  Backend: { color: C.ink, items: ["Python", "FastAPI", "Django REST Framework", "Node.js", "Express", "PHP", "Laravel"] },
  Database: { color: "#0ea5e9", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "pgvector"] },
  AI: { color: "#8b5cf6", items: ["OpenAI", "Anthropic", "Gemini", "RAG", "Semantic search", "Vector search", "Agentic workflows", "STT / TTS"] },
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
        <h3 style={{ fontSize: 18, fontWeight: 950, color: C.navy, margin: 0, letterSpacing: "-0.03em" }}>
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
                      fontSize: 11.5, fontWeight: isHov ? 850 : 650,
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
          <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Hover or tap any skill above to see which projects use it.</p>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TECH NETWORK — interactive nodes reveal the shipped work behind each skill
// ══════════════════════════════════════════════════════════════

const NODE_POSITIONS = [
  { name: "WebSockets", x: 84, y: 12 },
  { name: "React", x: 50, y: 14 },
  { name: "TypeScript", x: 24, y: 18 },
  { name: "Node.js", x: 72, y: 31 },
  { name: "Redis", x: 12, y: 45 },
  { name: "Supabase", x: 36, y: 44 },
  { name: "MySQL", x: 58, y: 49 },
  { name: "PostgreSQL", x: 86, y: 53 },
  { name: "Stripe", x: 14, y: 79 },
  { name: "WebRTC", x: 35, y: 76 },
  { name: "Django", x: 59, y: 82 },
  { name: "PHP", x: 83, y: 78 },
].map(node => {
  const technology = TECH_NODES.find(skill => skill.name === node.name);
  return { ...node, color: technology?.color || C.coral, Icon: technology?.Icon || Code2 };
});

const NODE_EDGES = [
  ["React", "TypeScript"], ["React", "Node.js"], ["React", "Supabase"], ["React", "MySQL"],
  ["TypeScript", "Redis"], ["TypeScript", "WebSockets"], ["Node.js", "WebSockets"],
  ["Node.js", "PostgreSQL"], ["Node.js", "MySQL"], ["Redis", "Stripe"],
  ["Redis", "WebRTC"], ["Supabase", "WebRTC"], ["Supabase", "Django"],
  ["MySQL", "PostgreSQL"], ["MySQL", "Django"], ["PostgreSQL", "PHP"],
  ["Django", "PHP"], ["WebRTC", "Stripe"],
];

function TechNetworkCard({ goToProject }) {
  const [activeSkillName, setActiveSkillName] = useState("React");
  const activeSkill = NODE_POSITIONS.find(skill => skill.name === activeSkillName) || NODE_POSITIONS[0];
  const ActiveSkillLogo = activeSkill.Icon;
  const projects = (TECH_PROJECTS[activeSkill.name] || [])
    .map(name => PROJECTS.find(project => project.name === name))
    .filter(Boolean);

  return (
    <section className="tech-network" style={{ "--active-node-color": activeSkill.color }} aria-labelledby="tech-network-title">
      <div className="tech-network-header">
        <div>
          <p><Sparkles size={14} aria-hidden="true" />Project toolkit</p>
          <h2 id="tech-network-title">Pick a tool. See the projects.</h2>
        </div>
        <span>Hover · focus · tap</span>
      </div>

      <div className="tech-card-grid">
        <div className="tech-map" aria-label="Connected technology nodes">
          <svg className="tech-map-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {NODE_EDGES.map(([from, to]) => {
              const start = NODE_POSITIONS.find(node => node.name === from);
              const end = NODE_POSITIONS.find(node => node.name === to);
              const isActive = from === activeSkill.name || to === activeSkill.name;
              return (
                <line
                  key={`${from}-${to}`}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  className={isActive ? "is-active" : ""}
                />
              );
            })}
          </svg>

          {NODE_POSITIONS.map(node => {
            const TechLogo = node.Icon;
            const isActive = node.name === activeSkill.name;
            const isConnected = NODE_EDGES.some(([from, to]) => (
              (from === activeSkill.name && to === node.name) ||
              (to === activeSkill.name && from === node.name)
            ));
            const projectCount = (TECH_PROJECTS[node.name] || []).length;
            return (
              <button
                key={node.name}
                type="button"
                className={`tech-node-button${isActive ? " is-active" : ""}${isConnected ? " is-connected" : ""}${!isActive && !isConnected ? " is-muted" : ""}`}
                aria-pressed={isActive}
                aria-label={`${node.name}, used in ${projectCount} project${projectCount !== 1 ? "s" : ""}`}
                onMouseEnter={() => setActiveSkillName(node.name)}
                onFocus={() => setActiveSkillName(node.name)}
                onClick={() => setActiveSkillName(node.name)}
                style={{ left: `${node.x}%`, top: `${node.y}%`, "--node-color": node.color }}
              >
                <span className="tech-node-core" aria-hidden="true">
                  <span className="tech-node-mark"><TechLogo /></span>
                  <small>{projectCount}</small>
                </span>
                <span className="tech-node-name">{node.name}</span>
              </button>
            );
          })}
        </div>

        <aside className="tech-detail-panel" aria-live="polite">
          <div className="tech-detail-heading">
            <span className="tech-detail-icon" aria-hidden="true"><ActiveSkillLogo /></span>
            <div>
              <p>Selected skill</p>
              <h3>{activeSkill.name}</h3>
            </div>
            <strong>{projects.length} project{projects.length !== 1 ? "s" : ""}</strong>
          </div>

          <p className="tech-detail-copy">Projects where I used this tool.</p>

          <div className="tech-project-list custom-scrollbar">
            {projects.length > 0 ? projects.slice(0, 4).map(project => (
              <button key={project.id} type="button" onClick={() => goToProject?.(project)}>
                <span className="tech-project-icon" style={{ color: project.color, background: project.color + "18" }}><ProjectIcon project={project} size={17} /></span>
                <span className="tech-project-copy">
                  <strong>{project.name}</strong>
                  <small>{project.tagline}</small>
                </span>
                <ArrowUpRight size={16} strokeWidth={2.3} aria-hidden="true" />
              </button>
            )) : (
              <div className="tech-project-empty">Part of my toolkit; a public case study is not published yet.</div>
            )}
          </div>
          {projects.length > 4 && <p className="tech-more-count">+{projects.length - 4} more projects</p>}
        </aside>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// HOME PAGE
// ══════════════════════════════════════════════════════════════
function HomePage({ setPage }) {
  const [activeProject, setActiveProject] = useState(null);
  return (
    <div className="page-shell" style={{ paddingTop: 78, paddingBottom: 48 }}>
      <div className="home-container" style={{ maxWidth: 1320, margin: "0 auto", padding: "0 20px" }}>
        <section className="experience-hero" aria-label="Introduction and current experience">
          <Card delay={0.02} style={{ width: "100%" }}>
            <ProfileStrip />
          </Card>
        </section>

        {/* The interactive node map stays close to the compact opening panel. */}
        <div style={{ margin: "0 0 24px" }}>
          <Card delay={0.05}><TechNetworkCard goToProject={setActiveProject} /></Card>
        </div>

        <FeaturedWorkSection setPage={setPage} onOpenProject={setActiveProject} />

        {/* Full archive and hackathon builds */}
        <HackathonsSection onOpenProject={setActiveProject} />
      </div>
      <ProjectDetailSheet project={activeProject} onClose={() => setActiveProject(null)} />
    </div>
  );
}

// ── FeaturedWorkSection ────────────────────────────────────────
function FeaturedWorkSection({ setPage, onOpenProject }) {
  const featured = FEATURED_PROJECTS;
  return (
    <div style={{ marginTop: 4 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.18em", color: C.coral, margin: "0 0 4px", display: "flex", alignItems: "center", gap: 6 }}><BriefcaseBusiness size={14} aria-hidden="true" />Featured Work</p>
          <h2 style={{ fontSize: 28, fontWeight: 950, color: C.navy, margin: 0, letterSpacing: "-0.04em" }}>Selected projects and products</h2>
        </div>
        <button onClick={() => setPage("work")} style={{ fontSize: 12.5, fontWeight: 850, color: C.coral, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, padding: "8px 0" }}>
          View all {PROJECTS.length} projects
          <ArrowUpRight size={15} strokeWidth={2.4} aria-hidden="true" />
        </button>
      </div>

      <div className="featured-work-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
        {featured.map((p, i) => (
          <FeaturedProjectCard key={p.id} p={p} delay={0.06 + i * 0.03} onClick={() => onOpenProject(p)} />
        ))}
      </div>
    </div>
  );
}

function HackathonsSection({ onOpenProject }) {
  return (
    <section style={{ marginTop: 34 }} aria-labelledby="hackathons-title">
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.18em", color: C.coral, margin: "0 0 4px", display: "flex", alignItems: "center", gap: 6 }}><Trophy size={14} aria-hidden="true" />Hackathons</p>
          <h2 id="hackathons-title" style={{ fontSize: 26, fontWeight: 950, color: C.navy, margin: 0, letterSpacing: "-0.04em" }}>Hackathon builds, made under pressure</h2>
        </div>
        <span style={{ fontSize: 10, fontWeight: 800, color: C.muted, display: "inline-flex", alignItems: "center", gap: 5 }}><Rocket size={13} aria-hidden="true" />{HACKATHON_PROJECTS.length} hackathon builds</span>
      </div>
      <div className="featured-work-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
        {HACKATHON_PROJECTS.map((p, i) => (
          <FeaturedProjectCard key={p.id} p={p} delay={0.05 + i * 0.035} onClick={() => onOpenProject(p)} />
        ))}
      </div>
    </section>
  );
}

function FeaturedProjectCard({ p, delay, onClick }) {
  const ref = useRef();
  const inView = useInView(ref, { once: true, margin: "-8px" });
  const [hov, setHov] = useState(false);
  const reduceMotion = useReducedMotion();
  return (
    <motion.article
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: reduceMotion ? 0 : delay, ease: EASE }}
      whileHover={reduceMotion ? {} : { y: -2 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`Open ${p.name} project description`}
      className="case-card"
      style={{ "--project-color": p.color, borderColor: hov ? p.color + "70" : undefined }}
    >
      <div className="case-card-accent" />
      <div className="case-card-topline">
        <span className="case-card-number">{p.num}</span>
        <span className="case-card-category" style={{ color: p.color }}>{p.tag}</span>
        <span className={p.liveUrl ? "case-card-state is-live" : "case-card-state"}>
          {p.liveUrl ? "Live" : p.year}
        </span>
      </div>

      <div className="case-card-heading">
        <span className="case-card-icon" style={{ color: p.color, background: p.color + "12", borderColor: p.color + "32" }}>
          <ProjectIcon project={p} size={18} />
        </span>
        <div>
          <h3>{p.name}</h3>
          <p style={{ color: p.color }}>{p.tagline}</p>
        </div>
      </div>

      <p className="case-card-description">{p.short}</p>

      <div className="case-card-result">
        <span className="case-card-result-label">Key result</span>
        <p>{p.bullets[0]}</p>
      </div>

      <div className="case-card-footer">
        <div className="case-card-stack" aria-label="Primary technologies">
          {p.tech.slice(0, 3).map(t => <span key={t}>{t}</span>)}
        </div>
        <span className="case-card-link" style={{ color: p.color }}>Read <ArrowUpRight size={14} strokeWidth={2.4} aria-hidden="true" /></span>
      </div>
    </motion.article>
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
          <span style={{ fontSize: 9, fontWeight: 900, color: C.coral, letterSpacing: "0.2em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 5 }}><FolderKanban size={13} aria-hidden="true" />Archive</span>
          <h2 style={{ fontSize: 26, fontWeight: 950, color: C.navy, margin: "5px 0 0", letterSpacing: "-0.04em" }}>All Projects</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 22, fontWeight: 950, color: C.coral, margin: 0, letterSpacing: "-0.04em" }}><CountUp value={PROJECTS.length} /></p>
              <p style={{ fontSize: 8.5, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", margin: "1px 0 0" }}>projects</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 22, fontWeight: 950, color: C.navy, margin: 0, letterSpacing: "-0.04em" }}><CountUp value={PROJECTS.filter(p => p.liveUrl).length} /></p>
              <p style={{ fontSize: 8.5, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", margin: "1px 0 0" }}>live now</p>
            </div>
          </div>
        </div>
      </div>

      <p className="work-intro-copy" style={{ fontSize: 14, color: C.muted, fontWeight: 600, margin: "0 0 18px" }}>Open any project for the full build breakdown.</p>

      <div className="featured-work-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
        {PROJECTS.map((p, i) => (
          <FeaturedProjectCard key={p.id} p={p} delay={Math.min(i * 0.02, 0.3)} onClick={() => setActiveProject(p)} />
        ))}
      </div>

      <section style={{ marginTop: 34 }} aria-labelledby="archive-hackathons-title">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 8.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.18em", color: C.coral, margin: "0 0 3px", display: "flex", alignItems: "center", gap: 5 }}><Trophy size={12} aria-hidden="true" />Hackathon archive</p>
            <h3 id="archive-hackathons-title" style={{ fontSize: 19, fontWeight: 950, color: C.navy, margin: 0, letterSpacing: "-0.03em" }}>Builds made under pressure</h3>
          </div>
          <span style={{ fontSize: 10, fontWeight: 800, color: C.muted }}>{HACKATHON_PROJECTS.length} builds</span>
        </div>
        <div className="featured-work-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
          {HACKATHON_PROJECTS.map((p, i) => (
            <FeaturedProjectCard key={p.id} p={p} delay={Math.min(i * 0.02, 0.3)} onClick={() => setActiveProject(p)} />
          ))}
        </div>
      </section>

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
            animate={{ opacity: 1, y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            onClick={e => e.stopPropagation()}
            style={{ width: "100%", maxWidth: 760, maxHeight: "92vh", overflowY: "auto", background: C.bg, borderRadius: "22px 22px 0 0", border: `1px solid ${C.line}`, boxShadow: "0 -24px 80px rgba(35,38,66,0.28)" }}
          >
            <div style={{ position: "sticky", top: 0, zIndex: 2, background: C.bg, paddingTop: 14, paddingBottom: 2 }}>
              <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 10, minHeight: 32 }}>
                <div style={{ width: 48, height: 4, borderRadius: 999, background: "rgba(35,38,66,0.18)" }} />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={`Close ${project.name} project details`}
                  style={{ position: "absolute", right: 16, top: 0, width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.line}`, background: C.card, color: C.navy, fontSize: 17, fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                >
                  ×
                </button>
              </div>
              <div style={{ height: 4, background: `linear-gradient(90deg, ${project.color}, ${project.color}66)` }} />
            </div>

            <div className="work-detail-padding" style={{ padding: "26px 30px 36px" }}>
              <div style={{ marginBottom: 22 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: project.color, display: "inline-flex" }}><ProjectIcon project={project} size={15} /></span>
                    <span style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: project.color, background: project.color + "16", padding: "4px 10px", borderRadius: 99, border: `1px solid ${project.color}28` }}>{project.tag}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, fontFamily: "monospace" }}>{project.year}</span>
                  </div>
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                      style={{ fontSize: 10.5, fontWeight: 800, color: project.color, background: project.color + "10", padding: "6px 14px", borderRadius: 9, textDecoration: "none", border: `1px solid ${project.color}28`, display: "inline-flex", alignItems: "center", gap: 5 }}>
                      <ExternalLink size={12} strokeWidth={2.4} aria-hidden="true" />
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
                  <p style={{ fontSize: 10, fontWeight: 850, textTransform: "uppercase", letterSpacing: "0.1em", color: project.color, margin: "0 0 5px" }}>Why it was built</p>
                  <p style={{ fontSize: 13, color: C.ink, margin: 0, lineHeight: 1.62 }}>{project.context}</p>
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
                <p style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.14em", color: C.muted, marginBottom: 12 }}>What was built</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {project.bullets.map((b, i) => (
                    <div key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                      <span style={{ width: i === 0 ? 5 : 4, height: i === 0 ? 5 : 4, borderRadius: "50%", background: i === 0 ? project.color : C.muted, marginTop: 7, flexShrink: 0 }} />
                      <p style={{ fontSize: 13.5, color: i === 0 ? C.navy : C.ink, margin: 0, lineHeight: 1.62, fontWeight: i === 0 ? 650 : 450 }}>{b}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: "16px 18px", background: C.navy, borderRadius: 12 }}>
                <p style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>Stack</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {project.tech.map(t => <TechTag key={t} name={t} dark />)}
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
    { k: "150+", v: "features shipped", c: C.coral },
    { k: String(PROJECTS.length), v: "portfolio projects", c: C.navy },
    { k: String(HACKATHON_PROJECTS.length), v: "hackathon builds", c: "#0ea5e9" },
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
    { year: "2021", event: "Wrote first PHP script. Immediately broke the database.", Icon: Code2 },
    { year: "2022", event: "Started BSc IT at Mumbai University. Built first REST API.", Icon: GraduationCap },
    { year: "2023", event: "Shipped first multi-tenant SaaS. Learned about data isolation the hard way.", Icon: Building2 },
    { year: "2024", event: "Deep-dived into fintech — payout engines, ledgers, atomic transactions, float drift.", Icon: Database },
    { year: "2025", event: "Joined SvayambhuTech as Associate Software Engineer. Resolved 60+ production issues on DriveAccessible.", Icon: BriefcaseBusiness },
    { year: "2026", event: "AI Backend Developer at Boston Institute of Analytics India, building MedConnect APIs for articles, jobs, applications, resumes, feeds, and media workflows.", Icon: Rocket },
  ];

  return (
    <div className="page-shell" style={{ paddingTop: 80, paddingBottom: 60, maxWidth: 1060, margin: "0 auto", padding: "80px 20px 60px" }}>
      <div style={{ borderBottom: `1px solid ${C.line}`, paddingBottom: 18, marginBottom: 22, display: "flex", justifyContent: "space-between", gap: 18, alignItems: "flex-end" }}>
        <div>
          <span style={{ fontSize: 9, fontWeight: 900, color: C.coral, letterSpacing: "0.2em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 5 }}><UserRound size={13} aria-hidden="true" />About</span>
          <h2 style={{ fontSize: 30, fontWeight: 950, color: C.navy, margin: "5px 0 0", letterSpacing: "-0.05em" }}>I build useful products for real-world work.</h2>
        </div>
        <img src={niceFace} alt="" style={{ width: 52, height: 52, objectFit: "contain", flexShrink: 0 }} />
      </div>

      <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 310px", gap: 18 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card style={{ overflow: "hidden" }} delay={0.04}>
            <div style={{ height: 5, background: `linear-gradient(90deg, ${C.navy}, ${C.coral})` }} />
            <div style={{ padding: "26px 28px" }}>
              <p style={{ fontSize: 15, color: C.ink, lineHeight: 1.75, margin: "0 0 16px", fontWeight: 550 }}>
                I&apos;m a full-stack engineer and AI backend developer based in Mumbai. I build dependable products for healthcare, fleet operations, billing, payments, realtime collaboration, and AI tools.
              </p>
              <p style={{ fontSize: 14, color: C.ink, lineHeight: 1.72, margin: "0 0 18px" }}>
                I care about clear state transitions, safe data handling, and interfaces that help teams act. The work I enjoy most sits where product and backend meet: taking an operational problem, modelling the states carefully, and making the next action clear.
              </p>
              <div className="about-proof-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 9 }}>
                {proof.map(item => (
                  <div key={item.v} style={{ padding: "13px 14px", borderRadius: 12, background: item.c === C.navy ? C.navy : item.c + "12", border: `1px solid ${item.c}28` }}>
                    <p style={{ fontSize: 22, fontWeight: 950, color: item.c === C.navy ? "#fff" : item.c, margin: 0 }}><CountUp value={item.k} /></p>
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
                { label: "Role", value: "AI Backend Developer · Boston Institute of Analytics India" },
                { label: "Study", value: "BSc IT · Class of 2025" },
                { label: "Current work", value: "MedConnect APIs · publishing, jobs, resumes, feeds" },
                { label: "Focus", value: "AI infrastructure, dev tools, production SaaS" },
                { label: "Open to", value: "Paris roles with credible sponsorship + relocation" },
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
                  <div style={{ position: "absolute", left: -21, top: 2, width: 15, height: 15, borderRadius: "50%", background: i === timelineItems.length - 1 ? C.coral : C.soft, border: `1px solid ${i === timelineItems.length - 1 ? C.coral : C.muted + "30"}`, color: i === timelineItems.length - 1 ? "#fff" : C.muted, display: "flex", alignItems: "center", justifyContent: "center" }}><t.Icon size={8} strokeWidth={2.4} aria-hidden="true" /></div>
                  <p style={{ fontSize: 9, fontWeight: 800, color: i === timelineItems.length - 1 ? C.coral : C.muted, margin: "0 0 2px", fontFamily: "monospace" }}>{t.year}</p>
                  <p style={{ fontSize: 11, color: C.ink, margin: 0, lineHeight: 1.45 }}>{t.event}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ padding: "20px 22px", background: C.navy, border: `1px solid ${C.navy}` }} delay={0.14}>
            <p style={{ fontSize: 9.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: C.coral, margin: "0 0 9px" }}>Get in touch</p>
            <p style={{ fontSize: 12.5, color: "#fff", fontWeight: 800, margin: "0 0 4px", wordBreak: "break-word" }}>muhammadimrank034@gmail.com</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.68)", margin: "0 0 12px", lineHeight: 1.5 }}>Open to Paris-based full-stack, applied-AI, product-engineering, founding-engineer, forward-deployed, or integration-engineering roles with a credible sponsorship and relocation path. London may also be considered selectively.</p>
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
Full-stack engineer and AI backend developer based in Mumbai. I build dependable software for healthcare APIs, fleet operations, billing and payout systems, realtime collaboration, and AI infrastructure. ${PROJECTS.length} portfolio projects; 150+ production features, 5+ companies adopting DriveAccessible, and 60+ production issues resolved.

EXPERIENCE
Boston Institute of Analytics India | AI Backend Developer | Current | Mumbai
• Built and refined article APIs for slug-based detail, owner draft access, published-status filtering, and complete create responses.
• Improved job discovery and applications with fresher flags, multi-city/state data, search, recommendations, recent applications, visibility rules, and pagination.
• Strengthened resume, profile, feed, and media workflows through status checks, readable filenames, user-specific response fields, normalized paths, and reusable URL handling.

SvayambhuTech | Associate Software Engineer | Oct 2025 – Mar 2026 | Mumbai
• Owned end-to-end development and production operations for DriveAccessible, a fleet-management and rental SaaS adopted by 5+ companies within four months of launch.
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
Frontend: React, Next.js, Vue.js, TypeScript, JavaScript, Tailwind CSS, Vite
Backend: Python, FastAPI, Django REST Framework, Node.js, Express, PHP, Laravel
Database: PostgreSQL, MySQL, MongoDB, Redis, pgvector
AI: OpenAI, Anthropic, Gemini, RAG, semantic search, vector search, agentic workflows, speech-to-text, text-to-speech
Tools/Infra: Docker, Linux, GitHub Actions, CI/CD, NGINX, Azure, GCP

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
          <Download size={14} strokeWidth={2.4} aria-hidden="true" />
          Download .txt
        </motion.button>
      </div>

      <Card>
        {/* Resume header */}
        <div style={{ padding: "32px 36px 24px", borderBottom: `1px solid ${C.line}`, background: C.bg }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: C.ink, margin: "0 0 5px", letterSpacing: "-0.04em" }}>Imran Khan</h1>
              <p style={{ fontSize: 13, color: C.coral, fontWeight: 700, margin: "0 0 12px" }}>Full-Stack Engineer · AI Backend Developer · Mumbai</p>
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
              Full-stack engineer and AI backend developer based in Mumbai. I build dependable software for healthcare APIs, fleet operations, billing and payout systems, realtime collaboration, and AI infrastructure. <strong>150+ production features</strong>, adoption by <strong>5+ companies</strong> for DriveAccessible, and <strong>60+ production issues resolved</strong>.
            </p>
          </Section>

          <Section title="Experience" color="#0ea5e9">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ padding: "18px 20px", background: C.soft, borderRadius: 12, borderLeft: `3px solid ${C.coral}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5, gap: 10, flexWrap: "wrap" }}>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 800, color: C.ink, margin: 0 }}>AI Backend Developer</h4>
                    <p style={{ fontSize: 11.5, color: C.coral, margin: "3px 0 0", fontWeight: 700 }}>Boston Institute of Analytics India · Mumbai</p>
                  </div>
                  <span style={{ fontSize: 9.5, color: C.muted, fontFamily: "monospace", background: C.card, padding: "3px 9px", borderRadius: 5, whiteSpace: "nowrap" }}>Current</span>
                </div>
                <ul style={{ margin: 0, padding: "0 0 0 16px", display: "flex", flexDirection: "column", gap: 5 }}>
                  {MEDCONNECT_BULLETS.map((b, i) => <li key={i} style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{b}</li>)}
                </ul>
              </div>
              <div style={{ padding: "18px 20px", background: C.soft, borderRadius: 12, borderLeft: `3px solid ${C.navy}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5, gap: 10, flexWrap: "wrap" }}>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 800, color: C.ink, margin: 0 }}>Associate Software Engineer</h4>
                    <p style={{ fontSize: 11.5, color: C.coral, margin: "3px 0 0", fontWeight: 700 }}>SvayambhuTech · Mumbai</p>
                  </div>
                  <span style={{ fontSize: 9.5, color: C.muted, fontFamily: "monospace", background: C.card, padding: "3px 9px", borderRadius: 5, whiteSpace: "nowrap" }}>Oct 2025 – Mar 2026</span>
                </div>
                <ul style={{ margin: 0, padding: "0 0 0 16px", display: "flex", flexDirection: "column", gap: 5 }}>
                  {["Owned end-to-end development and production operations for DriveAccessible, adopted by 5+ companies within four months of launch.", "Built conflict detection, billing and renewal workflows, operational dashboards, role-based access controls, and a public SEO site.", "Resolved 60+ production issues across edge-case bugs, workflow fixes, and feature deliveries."].map((b, i) => <li key={i} style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{b}</li>)}
                </ul>
              </div>
            </div>
          </Section>

          <Section title="Selected Projects" color="#8b5cf6">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {FEATURED_PROJECTS.slice(0, 6).map(p => (
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
                { cat: "Frontend", items: "React, Next.js, Vue.js, TypeScript, JavaScript, Tailwind CSS, Vite" },
                { cat: "Backend", items: "Python, FastAPI, Django REST Framework, Node.js, Express, PHP, Laravel" },
                { cat: "Database", items: "PostgreSQL, MySQL, MongoDB, Redis, pgvector" },
                { cat: "AI & Search", items: "OpenAI, Anthropic, Gemini, RAG, semantic search, vector search, agentic workflows, speech-to-text, text-to-speech" },
                { cat: "Tools & Infra", items: "Docker, Linux, GitHub Actions, CI/CD, NGINX, Azure, GCP" },
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
        <span style={{ fontSize: 9, fontWeight: 800, color: C.coral, letterSpacing: "0.2em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 5 }}><Mail size={13} aria-hidden="true" />Contact</span>
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
              style={{ padding: "12px 0", background: sent ? "#10b981" : C.coral, color: "#fff", border: "none", borderRadius: 10, fontSize: 11, fontWeight: 800, cursor: "pointer", letterSpacing: "0.04em", textTransform: "uppercase", transition: "background 0.3s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              {sent ? "✓ Opening Email Client..." : <><Send size={14} strokeWidth={2.3} aria-hidden="true" />Send Message</>}
            </motion.button>
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { Icon: Mail, label: "Email", value: "muhammadimrank034@gmail.com", href: "mailto:muhammadimrank034@gmail.com" },
            { Icon: Phone, label: "Phone", value: "+91 7506190224", href: "tel:+917506190224" },
            { Icon: Linkedin, label: "LinkedIn", value: "imranrkhan13", href: "https://linkedin.com/in/imranrkhan13" },
            { Icon: Github, label: "GitHub", value: "imranrkhan13", href: "https://github.com/imranrkhan13" },
            { Icon: Globe2, label: "Portfolio", value: "imran-silk.vercel.app", href: "https://imran-silk.vercel.app" },
            { Icon: Building2, label: "Studio", value: "techiesaie.com", href: "https://techiesaie.com" },
          ].map(c => {
            const ContactIcon = c.Icon;
            return (
            <Card key={c.label} style={{ padding: "12px 14px" }}>
              <a href={c.href} target="_blank" rel="noreferrer" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 28, height: 28, borderRadius: 8, background: C.coralFaint, color: C.coral, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><ContactIcon size={15} strokeWidth={2.2} aria-hidden="true" /></span>
                <div>
                  <p style={{ fontSize: 8, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: C.muted, margin: "0 0 1px" }}>{c.label}</p>
                  <p style={{ fontSize: 10.5, color: C.ink, margin: 0, fontWeight: 600 }}>{c.value}</p>
                </div>
                <ArrowUpRight size={14} strokeWidth={2.3} color={C.coral} style={{ marginLeft: "auto", flexShrink: 0 }} aria-hidden="true" />
              </a>
            </Card>
            );
          })}
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
  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="resume-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 34 }}
            transition={{ type: "spring", stiffness: 360, damping: 34 }}
            className="resume-sheet"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-title"
          >
            <div className="resume-toolbar">
              <div>
                <span>Resume</span>
                <strong>Clean view · PDF ready</strong>
              </div>
              <div className="resume-toolbar-actions">
                <a href="/Imran-Khan-Resume.pdf" download="Imran-Khan-Resume.pdf" className="resume-download">
                  <Download size={15} strokeWidth={2.4} aria-hidden="true" />
                  Download PDF
                </a>
                <button type="button" onClick={onClose} aria-label="Close resume">×</button>
              </div>
            </div>
            <div className="resume-document">
              <header className="resume-document-header">
                <div className="resume-identity">
                  <img src={niceFace} alt="" />
                  <div>
                    <p>Full-stack engineer · AI backend developer</p>
                    <h2 id="resume-title">Imran Khan</h2>
                    <span>Mumbai, India · Open to product engineering roles</span>
                  </div>
                </div>
                <div className="resume-contact-links">
                  <a href="mailto:muhammadimrank034@gmail.com"><Mail size={13} />muhammadimrank034@gmail.com</a>
                  <a href="tel:+917506190224"><Phone size={13} />+91 7506190224</a>
                  <a href="https://github.com/imranrkhan13" target="_blank" rel="noreferrer"><Github size={13} />github.com/imranrkhan13</a>
                </div>
              </header>

              <div className="resume-metrics">
                {[["150+", "Features shipped"], ["5+", "Companies using DriveAccessible"], ["60+", "Production issues resolved"]].map(([value, label]) => (
                  <div key={label}><strong>{value}</strong><span>{label}</span></div>
                ))}
              </div>

              <div className="resume-document-body">
                <main>
                  <section className="resume-section">
                    <p className="resume-section-label">Profile</p>
                    <p className="resume-summary">I turn complex workflows into dependable products. My work spans healthcare APIs, fleet operations, billing and payouts, realtime tools, and practical AI infrastructure—from data models and APIs to product UI, debugging, and deployment.</p>
                  </section>

                  <section className="resume-section">
                    <p className="resume-section-label">Experience</p>
                    <article className="resume-role is-current">
                      <div className="resume-role-heading">
                        <div><h3>AI Backend Developer</h3><p>Boston Institute of Analytics India · Mumbai</p></div>
                        <span>Current</span>
                      </div>
                      <ul>{MEDCONNECT_BULLETS.map(item => <li key={item.slice(0, 24)}>{item}</li>)}</ul>
                    </article>
                    <article className="resume-role">
                      <div className="resume-role-heading">
                        <div><h3>Associate Software Engineer</h3><p>SvayambhuTech · Mumbai</p></div>
                        <span>Oct 2025 – Mar 2026</span>
                      </div>
                      <ul>
                        <li>Owned development and production operations for DriveAccessible, adopted by 5+ companies within four months.</li>
                        <li>Built booking-conflict checks, billing and renewal flows, dashboards, role-based access, and a public SEO site.</li>
                        <li>Resolved 60+ production issues across edge cases, workflows, and feature delivery.</li>
                      </ul>
                    </article>
                  </section>
                </main>

                <aside>
                  <section className="resume-side-section">
                    <p className="resume-section-label">Core skills</p>
                    {[
                      ["Backend", "Python, FastAPI, Django, Node.js, Express, PHP, Laravel"],
                      ["Frontend", "React, Next.js, Vue.js, TypeScript, JavaScript"],
                      ["Data", "PostgreSQL, MySQL, MongoDB, Redis, pgvector"],
                      ["AI", "RAG, vector search, model APIs, agent workflows"],
                      ["Delivery", "Docker, Linux, CI/CD, NGINX, Azure, GCP"],
                    ].map(([label, value]) => <div className="resume-skill-row" key={label}><strong>{label}</strong><span>{value}</span></div>)}
                  </section>

                  <section className="resume-side-section">
                    <p className="resume-section-label">Selected products</p>
                    {FEATURED_PROJECTS.slice(0, 4).map(project => (
                      <div className="resume-project-row" key={project.id}>
                        <span style={{ background: project.color }} />
                        <div><strong>{project.name}</strong><p>{project.tagline}</p></div>
                      </div>
                    ))}
                  </section>

                  <section className="resume-side-section resume-education">
                    <p className="resume-section-label">Education</p>
                    <strong>BSc Information Technology</strong>
                    <span>MVM College, University of Mumbai</span>
                    <small>2022 – 2025</small>
                  </section>
                </aside>
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

  const navItems = NAV_ITEMS;

  return (
    <>
      <header className="site-nav" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, minHeight: 52, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "0 20px", background: "rgba(250,249,246,0.94)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.line}` }}>
        <button onClick={() => { setPage("home"); close(); }} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 800, color: C.ink, background: "none", border: "none", cursor: "pointer", letterSpacing: "-0.01em" }}>
          <img src={niceFace} alt="" style={{ width: 29, height: 29, objectFit: "contain", borderRadius: 8, background: C.navy, border: `1px solid ${C.coralLight}` }} />
          Imran Khan
        </button>
        {/* Desktop nav */}
        <nav className="site-nav-links" style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {navItems.slice(0, 3).map(item => {
            const [id, label] = item;
            const NavIcon = item[2];
            return (
            <button key={id} onClick={() => setPage(id)}
              style={{ padding: "5px 12px", borderRadius: 99, border: "none", cursor: "pointer", fontSize: 11, fontWeight: page === id ? 700 : 500, background: page === id ? C.soft : "transparent", color: page === id ? C.ink : C.muted, transition: "all 0.15s", display: "inline-flex", alignItems: "center", gap: 5 }}>
              <NavIcon size={12} strokeWidth={2.1} aria-hidden="true" />{label}
            </button>
            );
          })}
          <button onClick={onResume} style={{ padding: "5px 12px", borderRadius: 99, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 650, background: "transparent", color: C.muted, transition: "all 0.15s", display: "inline-flex", alignItems: "center", gap: 5 }}><FileText size={12} strokeWidth={2.1} aria-hidden="true" />Resume</button>
          <a href="mailto:muhammadimrank034@gmail.com" style={{ marginLeft: 6, padding: "5px 14px", borderRadius: 99, border: "none", background: C.coral, color: "#fff", fontSize: 10, fontWeight: 800, textDecoration: "none", letterSpacing: "0.04em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 5 }}><Mail size={12} strokeWidth={2.2} aria-hidden="true" />Contact</a>
        </nav>
        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation menu"
          className="mobile-menu-btn hidden max-[600px]:flex absolute right-5 top-1/2 -translate-y-1/2 flex-col gap-1"
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
              {navItems.map((item, i) => {
                const [id, label] = item;
                const NavIcon = item[2];
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
                    <NavIcon size={18} strokeWidth={2.1} color={isActive ? C.coral : "rgba(255,255,255,0.36)"} aria-hidden="true" />
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
                style={{ background: C.coral, color: "#fff", textAlign: "center", padding: "15px 0", borderRadius: 999, fontWeight: 800, fontSize: 13.5, textDecoration: "none", letterSpacing: "0.01em", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                <Mail size={16} strokeWidth={2.2} aria-hidden="true" />Say hi
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
    <MotionConfig reducedMotion="user">
    <div style={{ background: C.bg, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: C.ink, minHeight: "100vh" }}>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;}
        body{margin:0;overflow-x:hidden;}
        html{scroll-behavior:smooth;}
        @keyframes fadeInPanel{from{opacity:0;transform:translateX(8px);}to{opacity:1;transform:translateX(0);}}

        /* ── Scrollbar ── */
        .custom-scrollbar::-webkit-scrollbar{width:4px;}
        .custom-scrollbar::-webkit-scrollbar-track{background:transparent;}
        .custom-scrollbar::-webkit-scrollbar-thumb{background:rgba(61,64,91,0.18);border-radius:99px;}

        /* ── Desktop: home rows ── */
        .profile-strip{display:grid;grid-template-columns:270px 1fr;gap:32px;}
        .home-grid-bottom{display:grid;grid-template-columns:1.35fr 0.9fr;gap:10px;}
        .featured-work-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;}

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
          .home-grid-bottom{grid-template-columns:1fr!important;}
          .featured-work-grid{grid-template-columns:1fr!important;}
          .site-nav-links{display:none!important;}
          .mobile-menu-btn{display:flex!important;}
          .page-shell{padding-top:64px!important;}
          .about-proof-grid{grid-template-columns:1fr!important;}
          .profile-strip{padding:20px!important;}
          .work-detail-padding{padding:20px 18px!important;}
        }

        /* ── Very small (≤ 400px) ── */
        @media(max-width:400px){
          .intro-headline{font-size:34px!important;}
        }

        @media(prefers-reduced-motion:reduce){
          html{scroll-behavior:auto;}
        }
      `}</style>
      <Nav page={page} setPage={setPage} onResume={() => setResumeOpen(true)} />
      <AnimatePresence mode="wait">
        <motion.div key={page} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.24, ease: EASE }}>
          {page === "home" && <HomePage setPage={setPage} />}
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
    </MotionConfig>
  );
}
