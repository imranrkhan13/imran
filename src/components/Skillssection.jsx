import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skills, skillLevels } from "../data";

function SkillPill({ skill, delay, color }) {
    const [hov, setHov] = useState(false);
    const level = skillLevels[skill] || 75;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay, type: "spring", stiffness: 280 }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{ position: "relative", borderRadius: 10, overflow: "hidden" }}
        >
            <motion.div
                animate={{ scale: hov ? 1.03 : 1 }}
                style={{ padding: "9px 12px", background: "white", borderRadius: 10, border: "1px solid rgba(61,64,91,0.07)", position: "relative" }}
            >
                <AnimatePresence>
                    {hov && (
                        <motion.div
                            initial={{ width: 0 }} animate={{ width: `${level}%` }} exit={{ width: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            style={{ position: "absolute", inset: 0, background: color, opacity: 0.14, borderRadius: 10 }}
                        />
                    )}
                </AnimatePresence>
                <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>{skill}</span>
                    <AnimatePresence>
                        {hov && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                                style={{ fontSize: 9, fontWeight: 900, color }}
                            >
                                {level}%
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function SkillsSection() {
    return (
        <section id="skills" style={{ padding: "clamp(40px,6vw,60px) clamp(24px,5vw,64px) clamp(60px,8vw,96px)" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <motion.div
                    initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    style={{ marginBottom: 40 }}
                >
                    <span style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.5em", color: "#e27d60", display: "block", marginBottom: 10 }}>
                        ✦ Toolkit
                    </span>
                    <h2 style={{ fontSize: "clamp(40px,7vw,88px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, margin: "0 0 10px" }}>
                        Skills<span style={{ color: "#e27d60" }}>.</span>
                    </h2>
                    <p style={{ fontSize: 12, opacity: 0.36, fontWeight: 500 }}>Hover any skill to reveal proficiency</p>
                </motion.div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
                    {Object.entries(skills).map(([cat, { items, color }], ci) => (
                        <motion.div
                            key={cat}
                            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            transition={{ delay: ci * 0.1 }}
                            style={{ background: "white", borderRadius: 24, padding: 22, border: "1px solid rgba(61,64,91,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                                <span style={{ fontSize: 8, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.4em", color }}>{cat}</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {items.map((skill, si) => (
                                    <SkillPill key={skill} skill={skill} delay={ci * 0.1 + si * 0.06} color={color} />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}