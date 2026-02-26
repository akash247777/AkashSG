"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValueEvent } from "framer-motion";
import { useScroll } from "framer-motion";

interface OverlayProps {
    scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}

type SectionId = 1 | 2 | 3 | null;

function getActiveSection(progress: number): SectionId {
    if (progress >= 0.05 && progress < 0.3) return 1;
    if (progress >= 0.35 && progress < 0.6) return 2;
    if (progress >= 0.65 && progress < 0.9) return 3;
    return null;
}

const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: {
        opacity: 0,
        y: -30,
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

export default function Overlay({ scrollYProgress }: OverlayProps) {
    const [activeSection, setActiveSection] = useState<SectionId>(null);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const section = getActiveSection(latest);
        setActiveSection((prev) => (prev !== section ? section : prev));
    });

    return (
        <div className="absolute inset-0 z-50 pointer-events-none">
            <AnimatePresence mode="wait">
                {activeSection === 1 && (
                    <motion.div
                        key="section-1"
                        variants={sectionVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
                    >
                        <h1
                            className="font-bold tracking-tight text-white"
                            style={{
                                fontSize: "clamp(4rem, 12vw, 9rem)",
                                lineHeight: 1,
                                letterSpacing: "-0.02em",
                            }}
                        >
                            AKASH
                        </h1>
                        <p
                            className="mt-4 text-white/70 font-light tracking-widest uppercase"
                            style={{ fontSize: "clamp(0.9rem, 2vw, 1.25rem)" }}
                        >
                            AI Software Developer.
                        </p>
                    </motion.div>
                )}

                {activeSection === 2 && (
                    <motion.div
                        key="section-2"
                        variants={sectionVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute inset-0 flex flex-col justify-center px-6 md:pl-24"
                    >
                        <p
                            className="font-semibold text-white leading-tight"
                            style={{ fontSize: "clamp(1.5rem, 4vw, 3.5rem)" }}
                        >
                            I build&nbsp;
                            <span className="text-gray-400">
                                intelligent Software
                                <br />
                                Development with AI
                            </span>
                        </p>
                    </motion.div>
                )}

                {activeSection === 3 && (
                    <motion.div
                        key="section-3"
                        variants={sectionVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute inset-0 flex flex-col justify-center items-end px-6 md:pr-24"
                    >
                        <p
                            className="font-semibold text-white leading-tight text-right"
                            style={{ fontSize: "clamp(1.5rem, 4vw, 3.5rem)" }}
                        >
                            Bridging design /
                            <br />
                            <span className="text-gray-400">and engineering.</span>
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
