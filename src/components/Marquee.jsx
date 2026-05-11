import { motion } from "framer-motion";

const items = ["React", "Node.js", "TypeScript", "MySQL", "MongoDB", "Full-Stack", "Freelance", "Mumbai", "2025", "Available for Work"];

export default function Marquee() {
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