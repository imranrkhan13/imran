import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { timeline } from "../data";
import { COLORS } from "../constants";

function Counter({ to }) {
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

    return <span ref={ref}>{n}</span>;
}

function TimelineItem({ title, sub, date, index, isLast }) {
    const [hov, setHov] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ display: "flex", gap: 16 }}
        >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <motion.div
                    animate={{ scale: hov ? 1.4 : 1, background: hov ? "#e27d60" : "rgba(226,125,96,0.28)" }}
                    style={{ width: 12, height: 12, borderRadius: "50%", flexShrink: 0, marginTop: 5 }}
                />
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

export default function TimelineSection() {
    return (
        <section id="timeline" style={{ padding: "0 clamp(24px,5vw,64px) clamp(60px,8vw,80px)" }}>
            <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 40 }}>
                <span style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.5em", color: "#e27d60", display: "block", marginBottom: 10 }}>✦ Background</span>
                <h2 style={{ fontSize: "clamp(40px,7vw,88px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, margin: "0 0 14px" }}>
                    Journey<span style={{ color: "#e27d60" }}>.</span>
                </h2>
                <p style={{ fontSize: 13, opacity: 0.6, fontWeight: 500 }}>My academic foundation and professional experience so far.</p>
            </motion.div>

            <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,400px),1fr))", gap: 24 }}>
                {/* Education card */}
                <motion.div initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    style={{ position: "relative", background: "#1a1a2e", color: "white", borderRadius: 40, padding: "clamp(32px,5vw,52px)", overflow: "hidden" }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        style={{ position: "absolute", top: -60, right: -60, width: 260, height: 260, borderRadius: "50%", opacity: 0.1, border: "1px solid rgba(226,125,96,0.4)", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", top: -60, right: -60, width: 260, height: 260, borderRadius: "50%", opacity: 0.08, background: "radial-gradient(circle, #e27d60, transparent)", pointerEvents: "none" }} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                        <span style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.5em", color: "#85cdca", display: "block", marginBottom: 16 }}>✦ Education</span>
                        <h3 style={{ fontSize: "clamp(36px,5vw,50px)", fontWeight: 900, letterSpacing: "-0.03em", margin: "0 0 10px" }}>B.Sc. IT</h3>
                        <p style={{ fontSize: 16, fontWeight: 500, opacity: 0.55, marginBottom: 4 }}>Full Stack Development — shipped production software throughout</p>
                        <p style={{ fontSize: 12, opacity: 0.35, fontWeight: 500 }}>2022 – 2025</p>
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

                {/* Timeline items */}
                <motion.div initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ paddingTop: 8 }}>
                    <span style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.5em", color: "#e27d60", display: "block", marginBottom: 26 }}>✦ Journey</span>
                    {timeline.map((item, i) => (
                        <TimelineItem key={i} {...item} index={i} isLast={i === timeline.length - 1} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}