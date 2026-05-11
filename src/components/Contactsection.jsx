import { motion } from "framer-motion";

export default function ContactSection() {
    return (
        <>
            <section id="contact" className="px-6 py-24 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative bg-[#e27d60] rounded-[3rem] p-12 md:p-24 text-white overflow-hidden text-center"
                >
                    {/* Decorative rings */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
                                transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
                                className="absolute w-32 h-32 rounded-full border border-white/10"
                                style={{ left: `${10 + i * 15}%`, top: `${20 + (i % 2) * 40}%` }}
                            />
                        ))}
                    </div>

                    <div className="relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-60 block mb-6">✦ Get in Touch</span>
                        <h2 className="text-5xl md:text-8xl font-black tracking-tight leading-none mb-8">
                            Let's Build<br />Together.
                        </h2>
                        <p className="text-xl opacity-70 font-medium mb-12 max-w-lg mx-auto">
                            Have a project in mind? I'm always open to discussing new opportunities and ideas.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full px-4">
                            <a
                                href="mailto:muhammadimrank034@gmail.com"
                                className="w-full sm:w-auto px-6 sm:px-10 py-5 bg-white text-[#e27d60] rounded-full text-[12px] sm:text-sm font-black hover:scale-105 active:scale-95 transition-all shadow-xl text-center truncate"
                            >
                                muhammadimrank034@gmail.com ↗
                            </a>
                            <a
                                href="https://linkedin.com/in/imranrkhan13"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full sm:w-auto px-6 sm:px-10 py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full text-[12px] sm:text-sm font-black hover:bg-white/20 active:scale-95 transition-all text-center"
                            >
                                LinkedIn ↗
                            </a>
                        </div>
                    </div>
                </motion.div>
            </section>

            <footer className="text-center py-12 px-6">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20">
                    Made with care by Imran Khan · 2026
                </p>
            </footer>
        </>
    );
}