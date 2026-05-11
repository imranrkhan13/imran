import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS } from "../constants";

export function ProjectCard({ p, onClick }) {
    const [hovered, setHovered] = useState(false);
    const isFeatured = p.featured;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onClick(p)}
            className="cursor-pointer h-full"
        >
            <motion.div
                animate={{ y: hovered ? -8 : 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`relative rounded-3xl overflow-hidden border border-[#3d405b]/8 shadow-sm h-full flex flex-col ${isFeatured ? "p-8 md:p-10" : "p-6 md:p-7"}`}
                style={{ background: p.bg }}
            >
                <motion.div
                    animate={{ scale: hovered ? 1.4 : 1, opacity: hovered ? 0.15 : 0.07 }}
                    transition={{ duration: 0.6 }}
                    className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl"
                    style={{ background: p.color }}
                />

                <div className="relative z-10 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-5">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.35em] opacity-40">{p.tag}</span>
                            <h3 className={`font-black tracking-tight leading-none ${isFeatured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"}`} style={{ color: COLORS.dark }}>
                                {p.name}
                            </h3>
                        </div>
                        <div className="flex items-center gap-3 sm:flex-col sm:items-end shrink-0">
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-30 whitespace-nowrap">{p.year}</span>
                            {p.liveUrl && (
                                <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-white whitespace-nowrap" style={{ background: p.color }}>
                                    Live ↗
                                </span>
                            )}
                        </div>
                    </div>

                    <p className={`font-medium opacity-60 leading-relaxed mb-5 flex-1 ${isFeatured ? "text-base" : "text-sm"}`}>
                        {p.short}
                    </p>

                    {isFeatured && p.bullets.length > 0 && (
                        <div className="space-y-2 mb-6">
                            {p.bullets.slice(0, 3).map((b, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: p.color }} />
                                    <p className="text-sm opacity-55 leading-snug">{b}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-5">
                        {p.tech.map(t => (
                            <span key={t} className="px-3 py-1.5 bg-white/70 rounded-lg text-[10px] font-black uppercase tracking-widest border border-[#3d405b]/8">
                                {t}
                            </span>
                        ))}
                    </div>

                    <motion.div animate={{ gap: hovered ? "12px" : "8px" }} className="flex items-center" style={{ display: "flex" }}>
                        <span className="text-[11px] font-black uppercase tracking-[0.3em]" style={{ color: p.color }}>View Details</span>
                        <motion.span animate={{ x: hovered ? 4 : 0 }} style={{ color: p.color }}>→</motion.span>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export function Modal({ project, onClose }) {
    useEffect(() => {
        const esc = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", esc);
        return () => window.removeEventListener("keydown", esc);
    }, [onClose]);

    const modalSpring = { type: "spring", damping: 30, stiffness: 300, mass: 0.8 };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-[#1a1a2e]/80 backdrop-blur-2xl" />

            <motion.div
                initial={{ y: 50, scale: 0.9, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: 50, scale: 0.9, opacity: 0 }}
                transition={modalSpring}
                onClick={e => e.stopPropagation()}
                className="relative z-10 w-full max-w-5xl h-full max-h-[85vh] md:h-auto overflow-hidden rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col md:flex-row"
                style={{ background: project.bg || COLORS.cream }}
            >
                <div className="hidden md:flex w-16 items-center justify-center border-r border-black/5" style={{ background: `${project.color}10` }}>
                    <span className="origin-center -rotate-90 text-[10px] font-black tracking-[0.6em] uppercase opacity-20 whitespace-nowrap">
                        Technical Archive // {project.year}
                    </span>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="h-2 w-full" style={{ background: project.color }} />

                    <div className="p-8 md:p-14 overflow-y-auto">
                        <div className="flex justify-between items-start mb-10">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-black/5 text-slate-500">{project.tag}</span>
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: project.color }} />
                                    <span className="text-[10px] font-mono opacity-40">{project.year}</span>
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none" style={{ color: COLORS.dark }}>
                                    {project.name}<span style={{ color: project.color }}>.</span>
                                </h2>
                            </motion.div>

                            <button onClick={onClose} className="group w-14 h-14 rounded-2xl flex items-center justify-center transition-all bg-black/5 hover:bg-black hover:text-white">
                                <span className="text-2xl font-light group-hover:rotate-90 transition-transform duration-300">✕</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            <div className="lg:col-span-7">
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                                    className="text-lg font-medium leading-relaxed mb-8 opacity-80" style={{ color: COLORS.dark }}>
                                    {project.short}
                                </motion.p>

                                <div className="space-y-3">
                                    {project.bullets.map((b, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + i * 0.05 }}
                                            className="group flex items-start gap-5 p-4 bg-white/40 border border-transparent hover:border-black/5 hover:bg-white rounded-2xl transition-all">
                                            <span className="font-mono text-[10px] opacity-20 mt-1 shrink-0">0{i + 1}</span>
                                            <p className="text-sm font-semibold opacity-70 leading-relaxed group-hover:opacity-100 transition-opacity">{b}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-5 space-y-8">
                                <div className="p-6 rounded-[2rem] bg-black/5 border border-black/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-5">Stack Overview</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech.map(t => (
                                            <span key={t} className="px-4 py-2 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-black/5 shadow-sm hover:scale-105 transition-transform" style={{ color: COLORS.muted }}>
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {project.liveUrl && (
                                        <a href={project.liveUrl} target="_blank" rel="noreferrer"
                                            className="flex items-center justify-between px-8 py-5 rounded-2xl text-white text-sm font-black transition-all hover:brightness-110 shadow-xl"
                                            style={{ background: project.color }}>
                                            <span>LAUNCH PROJECT</span>
                                            <span className="text-xl">↗</span>
                                        </a>
                                    )}
                                    {project.fleetUrl && (
                                        <a href={project.fleetUrl} target="_blank" rel="noreferrer"
                                            className="flex items-center justify-between px-8 py-5 rounded-2xl text-sm font-black border-2 transition-all hover:bg-black hover:text-white hover:border-black"
                                            style={{ borderColor: `${project.color}40`, color: project.color }}>
                                            <span>FLEET DASHBOARD</span>
                                            <span className="font-mono text-[10px] opacity-50">v2.0</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}