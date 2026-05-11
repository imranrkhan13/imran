import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navItems } from "../data";

export default function Navbar({ activeSection }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <motion.nav
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.5, type: "spring", damping: 30 }}
                className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center bg-white/80 backdrop-blur-xl px-2 py-2 md:px-3 md:py-3 rounded-full shadow-xl border border-[#3d405b]/8 w-[90%] max-w-fit"
            >
                <div className="w-8 h-8 rounded-full bg-[#e27d60] flex items-center justify-center shrink-0">
                    <span className="text-white text-[10px] font-black">IK</span>
                </div>

                <div className="hidden md:flex items-center gap-1 ml-2">
                    {navItems.map(item => (
                        <a key={item} href={`#${item}`}
                            className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${activeSection === item ? "bg-[#e27d60] text-white" : "text-[#3d405b] hover:bg-[#e27d60]/10"}`}>
                            {item}
                        </a>
                    ))}
                </div>

                <a href="mailto:muhammadimrank034@gmail.com"
                    className="hidden md:block ml-2 px-5 py-2 rounded-full bg-[#1a1a2e] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#e27d60] transition-colors">
                    Hire Me
                </a>

                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden ml-auto p-2 text-[#3d405b]">
                    <div className="flex flex-col gap-1 w-5">
                        <span className={`h-0.5 w-full bg-current transition-all ${isOpen ? "rotate-45 translate-y-1.5" : ""}`} />
                        <span className={`h-0.5 w-full bg-current transition-all ${isOpen ? "opacity-0" : ""}`} />
                        <span className={`h-0.5 w-full bg-current transition-all ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
                    </div>
                </button>
            </motion.nav>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-[#1a1a2e]/60 backdrop-blur-2xl z-[98] md:hidden" />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: -40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -40 }}
                            transition={{ type: "spring", damping: 20, stiffness: 200 }}
                            className="fixed top-24 left-1/2 -translate-x-1/2 w-[94%] z-[99] bg-white/95 backdrop-blur-3xl rounded-[40px] p-3 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border border-white md:hidden overflow-hidden"
                        >
                            <div className="absolute inset-0 opacity-[0.15] pointer-events-none"
                                style={{ backgroundImage: "radial-gradient(#3d405b 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

                            <div className="flex flex-col gap-1.5 relative z-10">
                                {navItems.map((item, i) => (
                                    <motion.a key={item} href={`#${item}`} onClick={() => setIsOpen(false)}
                                        initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.08, type: "spring", bounce: 0.4 }}
                                        className={`relative px-6 py-5 rounded-[24px] text-[13px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-between ${activeSection === item ? "text-white" : "text-[#3d405b]"}`}>
                                        {activeSection === item && (
                                            <motion.div layoutId="activeBg" className="absolute inset-0 bg-[#e27d60] z-[-1]"
                                                style={{ borderRadius: "24px" }} transition={{ type: "spring", bounce: 0.3 }} />
                                        )}
                                        <span>{item}</span>
                                        <span className="text-[14px] opacity-40">→</span>
                                    </motion.a>
                                ))}

                                <motion.a href="mailto:muhammadimrank034@gmail.com"
                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                    className="mt-3 px-6 py-6 rounded-[30px] bg-[#1a1a2e] text-white flex items-center justify-center gap-4 shadow-xl">
                                    <span className="text-[12px] font-black uppercase tracking-[0.4em]">Let's Talk</span>
                                    <div className="w-2.5 h-2.5 bg-[#e27d60] rounded-full shadow-[0_0_10px_#e27d60]" />
                                </motion.a>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}