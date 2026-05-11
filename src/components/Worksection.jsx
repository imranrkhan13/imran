import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard, Modal } from "./Projectcard";
import { projects } from "../data";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};
const titleMask = {
    hidden: { y: "100%" },
    visible: { y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export default function WorkSection() {
    const [activeProject, setActiveProject] = useState(null);
    const featured = projects.filter(p => p.featured);
    const rest = projects.filter(p => !p.featured);

    return (
        <>
            <section id="work" className="max-w-7xl mx-auto px-6 py-20">
                <header className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
                    <div>
                        <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                            className="text-[10px] font-black uppercase tracking-[0.3em] text-[#e27d60] block mb-2">
                            ✦ Selected Projects
                        </motion.span>
                        <div className="overflow-hidden">
                            <motion.h2 variants={titleMask} initial="hidden" whileInView="visible" viewport={{ once: true }}
                                className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
                                My Work<span className="text-[#e27d60]">.</span>
                            </motion.h2>
                        </div>
                    </div>
                    <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                        className="text-sm opacity-60 font-medium max-w-xs md:text-right leading-relaxed">
                        A look at my top projects — built with clean code and focused on solving real problems.
                    </motion.p>
                </header>

                {/* Featured */}
                <section className="mb-20">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-[2px] w-8 bg-[#e27d60]" />
                        <h3 className="text-xs font-bold uppercase tracking-widest opacity-80 text-slate-500">Main Projects</h3>
                        <span className="text-[10px] font-mono opacity-30 ml-auto">01 — 0{featured.length}</span>
                    </div>
                    <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {featured.map(p => (
                            <motion.div key={p.id} variants={itemVariants}>
                                <ProjectCard p={p} onClick={() => setActiveProject(p)} />
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* Other builds */}
                <section>
                    <div className="flex items-center justify-between mb-8 border-b border-black/5 pb-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Other Builds</h3>
                        <span className="text-[10px] font-mono opacity-30">0{featured.length + 1} — {String(projects.length).padStart(2, "0")}</span>
                    </div>
                    <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rest.map(p => (
                            <motion.div key={p.id} variants={itemVariants}>
                                <ProjectCard p={p} onClick={() => setActiveProject(p)} />
                            </motion.div>
                        ))}
                    </motion.div>
                </section>
            </section>

            <AnimatePresence>
                {activeProject && <Modal project={activeProject} onClose={() => setActiveProject(null)} />}
            </AnimatePresence>
        </>
    );
}