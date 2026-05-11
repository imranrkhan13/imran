import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPhp, FaReact, FaNodeJs } from "react-icons/fa";
import { SiTypescript, SiTailwindcss, SiNextdotjs } from "react-icons/si";
import { COLORS } from "../constants";

function TooltipIcon({ social }) {
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
}

export function SocialLinks() {
    const socials = [
        {
            name: "Twitter", handle: "@imran_k_12", href: "https://x.com/imran_k_12",
            icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
        },
        {
            name: "LinkedIn", handle: "imranrkhan13", href: "https://linkedin.com/in/imranrkhan13",
            icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
        },
        {
            name: "GitHub", handle: "imranrkhan13", href: "https://github.com/imranrkhan13",
            icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>,
        },
        {
            name: "Instagram", handle: "imran.k_12", href: "https://instagram.com/imran.k_12",
            icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2h-8.5zm0 2h8.5C18.284 4 20 5.716 20 7.75v8.5c0 2.034-1.716 3.75-3.75 3.75h-8.5C5.716 20 4 18.284 4 16.25v-8.5C4 5.716 5.716 4 7.75 4zm8.75 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" /></svg>,
        },
    ];
    return (
        <div className="flex gap-6">
            {socials.map(s => <TooltipIcon key={s.name} social={s} />)}
        </div>
    );
}

export default function HeroSection() {
    return (
        <section id="about" className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden px-6 py-20">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.1] blur-[100px]"
                    style={{ background: "#e27d60" }}
                />
                <div className="absolute inset-0 opacity-[0.02]"
                    style={{ backgroundImage: "linear-gradient(#3d405b 1px, transparent 1px), linear-gradient(90deg, #3d405b 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto w-full">
                {/* Top row */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mb-4">
                            <span className="w-8 h-[1px] bg-[#e27d60]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#e27d60]">Architect & Engineer</span>
                        </motion.div>
                        <h1 className="text-[clamp(45px,8vw,90px)] font-black tracking-tighter leading-[0.9] text-[#3d405b]">
                            Imran <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e27d60] to-[#e27d60]/70">Khan.</span>
                        </h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="bg-white border border-[#e27d60]/20 p-5 rounded-2xl shadow-[0_8px_30px_-6px_rgba(226,125,96,0.15)] max-w-xs relative"
                    >
                        <div className="absolute top-4 right-4 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e27d60] opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#e27d60]" />
                        </div>
                        <p className="text-xs font-bold text-[#e27d60] uppercase tracking-widest mb-3">Current Role</p>
                        <p className="text-sm font-semibold text-[#3d405b] leading-relaxed">
                            Working on a real-world fleet management system — handling bookings, vehicles and payments at{" "}
                            <span className="text-[#e27d60] font-black">DriveAccessible</span>.
                        </p>
                    </motion.div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Main card */}
                    <motion.div whileHover={{ y: -5 }}
                        className="md:col-span-2 bg-[#3d405b] text-white p-8 rounded-[2rem] flex flex-col justify-between relative overflow-hidden group">
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
                                        <span className={`inline-flex items-center gap-2 px-2.5 mx-0.5 rounded-md border text-[11px] sm:text-[13px] font-bold transition-all hover:scale-105 ${tech.color}`}>
                                            <span className="text-[14px]">{tech.icon}</span>{tech.name}
                                        </span>
                                        <span className="mr-1.5 text-white/40">{i < arr.length - 2 ? "," : i === arr.length - 2 ? " and" : ""}</span>
                                    </span>
                                ))}
                                {" "}keeping things clean and easy to use.
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
                        <div className="absolute right-[-10%] bottom-[-10%] text-[150px] font-black opacity-[0.03] select-none">CODE</div>
                    </motion.div>

                    {/* Techiesaie card */}
                    <motion.a href="https://techiesaie.com/blog" target="_blank" whileHover={{ y: -8, transition: { duration: 0.2 } }}
                        className="relative group bg-white border border-[#85cdca]/30 p-8 rounded-[2rem] flex flex-col justify-between shadow-[0_10px_40px_-15px_rgba(133,205,202,0.2)] hover:shadow-[0_20px_60px_-10px_rgba(133,205,202,0.3)] hover:border-[#85cdca] transition-all duration-300 overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#85cdca]/10 rounded-full blur-3xl group-hover:bg-[#85cdca]/20 transition-colors" />
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-[#85cdca] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-[0_8px_20px_-4px_rgba(133,205,202,0.5)] transform group-hover:rotate-6 transition-transform">T</div>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-[#85cdca]/10 text-[#5da9a6] px-2 py-1 rounded-md">Featured</span>
                            </div>
                            <h3 className="text-2xl font-black text-[#3d405b] mb-1">Techiesaie</h3>
                            <p className="text-[10px] font-bold text-[#85cdca] uppercase tracking-[0.3em] mb-4">Personal Brand</p>
                            <p className="text-sm font-medium text-[#3d405b]/70 leading-relaxed">Sharing deep dives into React, performance, and the future of web dev.</p>
                        </div>
                        <div className="flex items-center gap-2 mt-8">
                            <span className="text-xs font-black text-[#3d405b] uppercase tracking-wider">Read Blogs</span>
                            <motion.svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-[#85cdca] stroke-[3]"
                                animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                            </motion.svg>
                        </div>
                    </motion.a>

                    {/* Social bar */}
                    <div className="md:col-span-3 flex flex-wrap items-center justify-between bg-white border border-[#3d405b]/5 p-6 rounded-[2rem] shadow-sm">
                        <SocialLinks />
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#3d405b]/40">Scroll to view work</span>
                            <div className="w-12 h-[1px] bg-[#3d405b]/10" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}