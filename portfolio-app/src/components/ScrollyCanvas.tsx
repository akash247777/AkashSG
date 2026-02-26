"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

interface ScrollyCanvasProps {
    containerRef: React.RefObject<HTMLDivElement | null>;
    scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}

export default function ScrollyCanvas({
    containerRef,
    scrollYProgress,
}: ScrollyCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const currentFrameRef = useRef<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [frameNames, setFrameNames] = useState<string[]>([]);

    // Fetch frame filenames from API
    useEffect(() => {
        fetch("/api/canvas-frames")
            .then((res) => res.json())
            .then((data) => {
                setFrameNames(data.files || []);
            })
            .catch(() => setFrameNames([]));
    }, []);

    // Object-fit: cover draw function
    const drawFrame = useCallback((canvas: HTMLCanvasElement, img: HTMLImageElement) => {
        const ctx = canvas.getContext("2d");
        if (!ctx || !img) return;

        const canvasW = canvas.width;
        const canvasH = canvas.height;
        const imgW = img.naturalWidth;
        const imgH = img.naturalHeight;

        if (!imgW || !imgH) return;

        const canvasAspect = canvasW / canvasH;
        const imgAspect = imgW / imgH;

        let sx = 0, sy = 0, sw = imgW, sh = imgH;

        if (imgAspect > canvasAspect) {
            // Image is wider: crop sides
            sw = Math.round(imgH * canvasAspect);
            sx = Math.round((imgW - sw) / 2);
        } else {
            // Image is taller: crop top/bottom
            sh = Math.round(imgW / canvasAspect);
            sy = Math.round((imgH - sh) / 2);
        }

        ctx.clearRect(0, 0, canvasW, canvasH);
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvasW, canvasH);
    }, []);

    // Resize canvas and redraw current frame
    const handleResize = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const img = imagesRef.current[currentFrameRef.current];
        if (img) drawFrame(canvas, img);
    }, [drawFrame]);

    // Preload all images once frameNames are known
    useEffect(() => {
        if (frameNames.length === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const images: HTMLImageElement[] = [];
        let loaded = 0;
        const total = frameNames.length;

        frameNames.forEach((name, i) => {
            const img = new Image();
            img.src = `/canvas/${name}`;
            img.onload = () => {
                loaded++;
                images[i] = img;
                if (loaded === total) {
                    imagesRef.current = images;
                    setIsLoading(false);
                    // Draw first frame
                    if (images[0]) drawFrame(canvas, images[0]);
                }
            };
            img.onerror = () => {
                loaded++;
                if (loaded === total) {
                    imagesRef.current = images;
                    setIsLoading(false);
                }
            };
        });

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [frameNames, drawFrame, handleResize]);

    // Map scroll progress to frame index
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const total = imagesRef.current.length;
        if (total === 0) return;

        const index = Math.min(
            Math.floor(latest * total),
            total - 1
        );

        if (index !== currentFrameRef.current) {
            currentFrameRef.current = index;
            const canvas = canvasRef.current;
            const img = imagesRef.current[index];
            if (canvas && img) drawFrame(canvas, img);
        }
    });

    return (
        <>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#121212]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <p className="text-white/60 text-sm font-light tracking-[0.3em] uppercase">
                            Loading Sequence...
                        </p>
                    </div>
                </div>
            )}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ display: isLoading ? "none" : "block" }}
            />
        </>
    );
}
