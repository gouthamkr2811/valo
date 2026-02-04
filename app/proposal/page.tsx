"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useUserData } from "../hooks/useUserData";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ProposalPage() {
    const router = useRouter();
    const { userData } = useUserData();
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useGSAP(() => {
        console.log("GSAP animation starting for proposal page");
        const tl = gsap.timeline();

        // Entrance animation
        tl.from(".animate-target-card", {
            scale: 0.8,
            opacity: 0,
            duration: 1.2,
            ease: "back.out(1.7)",
        })
            .from(".animate-target-photo", {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
            }, "-=0.5")
            .from(".animate-target-quote", {
                opacity: 0,
                y: 20,
                duration: 0.8,
                ease: "power2.out",
            }, "-=0.3")
            .from(".animate-target-message", {
                opacity: 0,
                scale: 0.9,
                duration: 0.8,
                ease: "elastic.out(1, 0.7)",
            }, "-=0.3")
            .from(".animate-target-hearts-decor", {
                opacity: 0,
                stagger: 0.1,
                rotation: 45,
                scale: 0,
                duration: 0.5,
                ease: "back.out(2)",
            }, "-=0.4")
            .from(".animate-target-btn", {
                y: 30,
                opacity: 0,
                stagger: 0.2,
                duration: 0.6,
                ease: "power2.out",
            }, "-=0.3");

        // Background hearts
        const hearts = gsap.utils.toArray<HTMLElement>(".floating-heart-gsap");
        hearts.forEach((heart) => {
            gsap.set(heart, {
                x: gsap.utils.random(0, window.innerWidth),
                y: gsap.utils.random(window.innerHeight, window.innerHeight + 500),
                scale: gsap.utils.random(0.5, 1.5),
                opacity: gsap.utils.random(0.2, 0.6),
            });

            gsap.to(heart, {
                y: -200,
                x: "+=" + gsap.utils.random(-150, 150),
                rotation: gsap.utils.random(-45, 45),
                duration: gsap.utils.random(8, 15),
                repeat: -1,
                ease: "none",
                delay: gsap.utils.random(0, 10),
                onRepeat: () => {
                    gsap.set(heart, {
                        x: gsap.utils.random(0, window.innerWidth),
                        y: window.innerHeight + 100,
                    });
                }
            });
        });

        // Continuous pulse for the photo
        gsap.to(".animate-target-photo", {
            scale: 1.05,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

    }, { scope: containerRef }); // Removed dependencies: [mounted] and if (!mounted) return

    const handleYes = () => {
        router.push("/quiz");
    };

    // We'll keep the top-level mounted check for now to ensure userData is loaded,
    // but the GSAP hook will run independently.
    if (!mounted) return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-pink-50">
            <div className="animate-pulse text-pink-300 text-6xl">💖</div>
        </div>
    );

    return (
        <div ref={containerRef} className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-red-50 to-pink-50">
            {/* GSAP Floating Hearts Background */}
            <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 25 }).map((_, i) => (
                    <div
                        key={i}
                        className="floating-heart-gsap absolute text-2xl"
                    >
                        {i % 4 === 0 ? "❤️" : i % 4 === 1 ? "💕" : i % 4 === 2 ? "💖" : "✨"}
                    </div>
                ))}
            </div>

            <div className="max-w-2xl w-full relative z-10">
                <div className="animate-target-card bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
                    {/* Image Section */}
                    <div className="animate-target-photo flex justify-center mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-red-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                            <img
                                src={userData.photo || "https://via.placeholder.com/200x200/FF69B4/FFFFFF?text=Your+Photo"}
                                alt="Valentine"
                                className="relative w-48 h-48 rounded-full object-cover border-8 border-white shadow-2xl"
                            />
                        </div>
                    </div>

                    {/* Romantic Quote */}
                    <div className="animate-target-quote text-center mb-8">
                        <p className="text-2xl md:text-3xl italic text-gray-700 mb-4 font-serif leading-relaxed">
                            "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine."
                        </p>
                        <p className="text-sm text-gray-400 tracking-widest uppercase">- Maya Angelou -</p>
                    </div>

                    {/* Main Message */}
                    <div className="animate-target-message text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-600">
                            {userData.name ? `Dear ${userData.name},` : "Hey Beautiful,"}
                        </h1>
                        <p className="text-3xl md:text-4xl text-gray-800 mb-6 font-dancing" style={{ fontFamily: "var(--font-dancing)" }}>
                            Will you be my Valentine? 💝
                        </p>
                    </div>

                    {/* Decorative Hearts */}
                    <div className="flex justify-center gap-3 text-4xl mb-8">
                        <span className="animate-target-hearts-decor">💖</span>
                        <span className="animate-target-hearts-decor">💕</span>
                        <span className="animate-target-hearts-decor">❤️</span>
                        <span className="animate-target-hearts-decor">💕</span>
                        <span className="animate-target-hearts-decor">💖</span>
                    </div>

                    {/* Buttons - Both say YES */}
                    <div className="space-y-4">
                        <button
                            onClick={handleYes}
                            className="animate-target-btn w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-5 rounded-2xl font-bold text-xl hover:from-pink-600 hover:to-red-600 transform hover:scale-105 active:scale-95 shadow-xl shadow-pink-100"
                        >
                            YES, ALWAYS 💖
                        </button>
                        <button
                            onClick={handleYes}
                            className="animate-target-btn w-full bg-white border-2 border-pink-500 text-pink-600 py-5 rounded-2xl font-bold text-xl hover:bg-pink-50 transform hover:scale-105 active:scale-95"
                        >
                            YES, A THOUSAND TIMES 😍
                        </button>
                    </div>

                    {/* Playful Note */}
                    <p className="animate-target-quote text-center text-gray-400 text-sm mt-8 italic">
                        (There's no "No" option because I know you'll say yes! 😊)
                    </p>
                </div>
            </div>
        </div>
    );
}
