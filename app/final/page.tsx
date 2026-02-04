"use client";

import { useEffect, useState, useRef } from "react";
import { useUserData } from "../hooks/useUserData";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function FinalPage() {
    const { userData } = useUserData();
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useGSAP(() => {
        console.log("GSAP animation starting for final page");
        const tl = gsap.timeline();

        // Reveal the main card with a smooth scale-up
        tl.from(".animate-final-card", {
            scale: 0.9,
            opacity: 0,
            duration: 1.5,
            ease: "expo.out",
        })
            .from(".animate-final-header", {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
            }, "-=1")
            .from(".animate-final-stagger", {
                y: 20,
                opacity: 0,
                stagger: 0.3,
                duration: 0.8,
                ease: "power2.out",
            }, "-=0.5");

        // Floating Hearts Background
        const hearts = gsap.utils.toArray<HTMLElement>(".floating-heart-gsap");
        hearts.forEach((heart) => {
            gsap.set(heart, {
                x: gsap.utils.random(0, window.innerWidth),
                y: gsap.utils.random(window.innerHeight, window.innerHeight + 500),
                scale: gsap.utils.random(0.5, 2),
                opacity: gsap.utils.random(0.2, 0.6),
            });

            gsap.to(heart, {
                y: -200,
                x: "+=" + gsap.utils.random(-150, 150),
                rotation: gsap.utils.random(-45, 45),
                duration: gsap.utils.random(10, 20),
                repeat: -1,
                ease: "none",
                delay: gsap.utils.random(0, 10),
                onRepeat: () => {
                    gsap.set(heart, {
                        x: gsap.utils.random(0, window.innerWidth),
                        y: window.innerHeight + 200,
                    });
                }
            });
        });

        // Pulsing heartbeat for the main icon
        gsap.to(".animate-heartbeat-gsap", {
            scale: 1.2,
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });

        // Floating effect for roses
        gsap.to(".animate-float-gsap", {
            y: -15,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            stagger: 0.2,
            ease: "sine.inOut"
        });

    }, { scope: containerRef }); // Removed dependencies: [mounted] and if (!mounted) return

    if (!mounted) return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-100 via-red-100 to-purple-100">
            <div className="animate-pulse text-pink-400 text-8xl">💖</div>
        </div>
    );

    return (
        <div ref={containerRef} className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-pink-100 via-red-100 to-purple-100">
            {/* GSAP Floating Hearts Background */}
            <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 30 }).map((_, i) => (
                    <div
                        key={i}
                        className="floating-heart-gsap absolute text-2xl"
                    >
                        {["❤️", "💕", "💖", "💝", "✨"][i % 5]}
                    </div>
                ))}
            </div>

            <div className="max-w-3xl w-full relative z-10">
                <div className="animate-final-card bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 text-center border border-white/20">
                    {/* Main Heading */}
                    <div className="animate-final-header mb-8">
                        <div className="animate-heartbeat-gsap inline-block text-8xl mb-6">💖</div>
                        <h1 className="text-5xl md:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-purple-600">
                            Happy Valentine's Day!
                        </h1>
                        <div className="flex justify-center gap-4 text-4xl mb-6">
                            <span className="animate-float-gsap">❤️</span>
                            <span className="animate-float-gsap">💕</span>
                            <span className="animate-float-gsap">💖</span>
                        </div>
                    </div>

                    {/* Romantic Quote */}
                    <div className="animate-final-stagger mb-10 bg-gradient-to-r from-pink-50/50 to-purple-50/50 rounded-2xl p-8 shadow-inner">
                        <p className="text-2xl md:text-3xl italic text-gray-700 mb-3 leading-relaxed font-serif">
                            "You are my today and all of my tomorrows."
                        </p>
                        <p className="text-sm text-gray-400 font-bold tracking-widest uppercase">- Leo Christopher -</p>
                    </div>

                    {/* Personalized Message */}
                    <div className="animate-final-stagger mb-10">
                        <p className="text-2xl md:text-3xl text-gray-800 leading-relaxed mb-6 font-dancing" style={{ fontFamily: "var(--font-dancing)" }}>
                            {userData.name ? (
                                <>
                                    Dear <span className="text-pink-600 font-bold underline decoration-pink-200 decoration-4 underline-offset-8">{userData.name}</span>,
                                </>
                            ) : (
                                "Dear Valentine,"
                            )}
                        </p>
                        <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6 px-4">
                            Thank you for being the most amazing person in my life. Every moment with you is a treasure, and I'm so grateful to have you as my Valentine. 💝
                        </p>
                        <p className="text-lg md:text-xl text-pink-500 font-bold leading-relaxed">
                            Here's to many more beautiful memories together! 🌹
                        </p>
                    </div>

                    {/* Quiz Score Display */}
                    {userData.quizScore !== undefined && (
                        <div className="  -final-stagger mb-10 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-pink-100">
                            <p className="text-lg text-gray-600">
                                You scored <span className="text-pink-600 font-black text-3xl">{userData.quizScore}/5</span> in our quiz!
                                <br />
                                <span className="text-pink-400 font-medium">
                                    {userData.quizScore >= 4 ? " You know me so well! 🥰" : " We'll create more memories together! 💕"}
                                </span>
                            </p>
                        </div>
                    )}


                    {/* Audio Player */}
                    <div className="animate-final-stagger mb-12">
                        <div className="bg-pink-50/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-pink-100/20">
                            <p className="text-sm font-bold text-gray-400 mb-4 tracking-widest uppercase">🎵 A special song for you 🎵</p>
                            <audio
                                controls
                                className="w-full h-10 rounded-full"
                                style={{
                                    filter: "hue-rotate(330deg) brightness(1.1)",
                                }}
                            >
                                <source src="/romantic-song.mp3" type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="animate-final-stagger flex justify-center gap-6 text-6xl mb-10">
                        <span className="animate-float-gsap">🌹</span>
                        <span className="animate-float-gsap">💐</span>
                        <span className="animate-float-gsap">🌺</span>
                    </div>

                    {/* Final Message */}
                    <div className="animate-final-stagger text-center pt-6 border-t border-pink-100">
                        <p className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500 mb-4" style={{ fontFamily: "var(--font-dancing)" }}>
                            I Love You! ❤️
                        </p>
                        <p className="text-gray-400 font-bold tracking-widest uppercase">
                            Forever and Always 💕
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
