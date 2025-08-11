"use client";

import { useEffect, useState } from "react";

export function PinkBubbles() {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setOffset(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const bubbles = [
        { size: 32, top: "15%", left: "7%", speed: 0.2 },
        { size: 32, top: "40%", left: "25%", speed: 0.1 },        
        { size: 50, top: "55%", left: "10%", speed: 0.2 },
        { size: 40, top: "80%", left: "27%", speed: 0.1 },
        { size: 24, top: "22%", right: "14%", speed: 0.1 },
        { size: 24, top: "45%", right: "28%", speed: 0.2 },
        { size: 32, bottom: "32%", right: "10%", speed: 0.1 },
        { size: 54, bottom: "10%", right: "30%", speed: 0.1 },
    ];

    return (
        <div className="pointer-events-none absolute inset-0">
            {bubbles.map((b, i) => (
                <img
                    key={i}
                    src="/bubble.svg"
                    alt=""
                    style={{
                        position: "absolute",
                        width: b.size,
                        height: b.size,
                        top: b.top,
                        left: b.left,
                        right: b.right,
                        bottom: b.bottom,
                        transform: `translateY(${offset * b.speed}px)`,
                        transition: "transform 0.05s linear",
                    }}
                />
            ))}
        </div>
    );
}
