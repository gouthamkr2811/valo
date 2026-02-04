"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FunnyPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100"></div>

            {/* Floating Emojis */}
            <div className="absolute top-10 left-10 text-6xl animate-float">😂</div>
            <div className="absolute top-20 right-20 text-6xl animate-float" style={{ animationDelay: "0.5s" }}>🤣</div>
            <div className="absolute bottom-20 left-20 text-6xl animate-float" style={{ animationDelay: "1s" }}>😄</div>
            <div className="absolute bottom-10 right-10 text-6xl animate-float" style={{ animationDelay: "1.5s" }}>💔</div>

            <div className="max-w-2xl w-full relative z-10">
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 text-center animate-fadeInUp">
                    {/* Main Message */}
                    <div className="mb-8">
                        <div className="text-8xl mb-6 animate-heartbeat">😅</div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800" style={{ fontFamily: "var(--font-dancing)" }}>
                            Sorry Bro! 😄
                        </h1>
                        <div className="space-y-4 text-xl md:text-2xl text-gray-700">
                            <p className="leading-relaxed">
                                This website is <span className="text-pink-600 font-bold">only for my Valentine</span> ❤️
                            </p>
                            <p className="text-lg text-gray-600">
                                Better luck next time, buddy! 😉
                            </p>
                        </div>
                    </div>

                    {/* Funny Quotes */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
                        <p className="text-lg text-gray-700 italic">
                            "Bros before... wait, not this time! 💕"
                        </p>
                    </div>

                    {/* Emojis Row */}
                    <div className="flex justify-center gap-4 text-4xl mb-8">
                        <span className="animate-float">🙈</span>
                        <span className="animate-float" style={{ animationDelay: "0.3s" }}>😎</span>
                        <span className="animate-float" style={{ animationDelay: "0.6s" }}>🤷‍♂️</span>
                        <span className="animate-float" style={{ animationDelay: "0.9s" }}>💪</span>
                    </div>

                    {/* Back Button */}
                    <button
                        onClick={() => router.push("/")}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                    >
                        ← Go Back Home
                    </button>

                    {/* Footer Message */}
                    <p className="mt-6 text-gray-500 text-sm">
                        Maybe create your own Valentine website? 😏
                    </p>
                </div>
            </div>
        </div>
    );
}
