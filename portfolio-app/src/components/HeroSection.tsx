"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import ScrollyCanvas from "./ScrollyCanvas";
import Overlay from "./Overlay";

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    return (
        // 500vh scroll container
        <div ref={containerRef} className="relative" style={{ height: "500vh" }}>
            {/* Sticky 100vh viewport */}
            <div className="sticky top-0 h-screen overflow-hidden bg-[#121212]">
                {/* Canvas layer */}
                <ScrollyCanvas
                    containerRef={containerRef}
                    scrollYProgress={scrollYProgress}
                />
                {/* Text overlay layer */}
                <Overlay scrollYProgress={scrollYProgress} />
            </div>
        </div>
    );
}
