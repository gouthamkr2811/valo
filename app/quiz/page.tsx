"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserData } from "../hooks/useUserData";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface Question {
    question: string;
    options: string[];
    correctAnswer: number;
}

const quizQuestions: Question[] = [
    {
        question: "എനിക്ക് ഏറ്റവും ഇഷ്ടമുള്ള നിറം ഏത്?",
        options: ["ചുവപ്പ് (Red)", "നീല (Blue)", "പിങ്ക് (Pink)", "പച്ച (Green)"],
        correctAnswer: 2,
    },
    {
        question: "നമ്മൾ ആദ്യം കണ്ടത് എവിടെയാണ്?",
        options: ["കോളേജിൽ", "കോഫി ഷോപ്പിൽ", "പാർക്കിൽ", "ഓൺലൈനിൽ"],
        correctAnswer: 0,
    },
    {
        question: "എനിക്ക് ഏറ്റവും ഇഷ്ടമുള്ള ഭക്ഷണം എന്താണ്?",
        options: ["പിസ്സ", "ബിരിയാണി", "ചോക്ലേറ്റ്", "ഐസ്ക്രീം"],
        correctAnswer: 2,
    },
    {
        question: "എനിക്ക് ഏറ്റവും ഇഷ്ടമുള്ള സിനിമ ഏത്?",
        options: ["പ്രേമം", "പ്രണയം", "സ്നേഹം", "ഇഷ്ടം"],
        correctAnswer: 0,
    },
    {
        question: "ഞാൻ ഏറ്റവും കൂടുതൽ സമയം ചെലവഴിക്കുന്നത് എവിടെയാണ്?",
        options: ["വീട്ടിൽ", "ഓഫീസിൽ", "നിന്നെ കുറിച്ച് ചിന്തിക്കുമ്പോൾ", "ജിമ്മിൽ"],
        correctAnswer: 2,
    },
];

export default function QuizPage() {
    const router = useRouter();
    const { userData, saveUserData } = useUserData();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const questionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useGSAP(() => {
        console.log("GSAP animation starting for quiz page");
        // Entrance animation for the quiz card
        gsap.from(".animate-quiz-card", {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "back.out(1.7)",
        });

        // Floating hearts in background
        const hearts = gsap.utils.toArray<HTMLElement>(".floating-heart-gsap");
        hearts.forEach((heart) => {
            gsap.set(heart, {
                x: gsap.utils.random(0, window.innerWidth),
                y: gsap.utils.random(window.innerHeight, window.innerHeight + 500),
                scale: gsap.utils.random(0.5, 1.2),
                opacity: gsap.utils.random(0.2, 0.5),
            });

            gsap.to(heart, {
                y: -100,
                x: "+=" + gsap.utils.random(-100, 100),
                duration: gsap.utils.random(10, 20),
                repeat: -1,
                ease: "none",
                delay: gsap.utils.random(0, 10),
            });
        });
    }, { scope: containerRef }); // Removed dependencies: [mounted] and if (!mounted) return

    // Transition animation when question changes
    useGSAP(() => {
        if (currentQuestion === 0 || showResult) return;

        const tl = gsap.timeline();
        tl.to(".animate-question-content", {
            x: -20,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in"
        })
            .set(".animate-question-content", { x: 20 })
            .to(".animate-question-content", {
                x: 0,
                opacity: 1,
                duration: 0.4,
                ease: "power2.out"
            });
    }, { scope: containerRef, dependencies: [currentQuestion] });

    // Result reveal animation
    useGSAP(() => {
        if (!showResult) return;

        const tl = gsap.timeline();
        tl.from(".animate-result-reveal", {
            scale: 0.5,
            opacity: 0,
            duration: 1,
            ease: "elastic.out(1, 0.5)",
        })
            .from(".animate-result-item", {
                y: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.2,
                ease: "power2.out"
            }, "-=0.5");

        // Celebration burst
        gsap.to(".celebration-icon", {
            scale: 1.2,
            duration: 0.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }, { scope: containerRef, dependencies: [showResult] });

    const handleAnswerSelect = (answerIndex: number) => {
        setSelectedAnswer(answerIndex);
    };

    const handleNext = () => {
        if (selectedAnswer === null) return;

        // Always increment score - every answer is correct in love! 💕
        setScore(score + 1);

        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
        } else {
            setShowResult(true);
        }
    };

    const handleFinish = () => {
        // Always save perfect score of 5
        saveUserData({ quizScore: 5 });
        router.push("/final");
    };

    if (!mounted) return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="animate-pulse text-purple-300 text-6xl">✨</div>
        </div>
    );

    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

    return (
        <div ref={containerRef} className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
            {/* GSAP Floating Background Hearts */}
            <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="floating-heart-gsap absolute text-xl">
                        {i % 3 === 0 ? "💜" : i % 3 === 1 ? "💗" : "✨"}
                    </div>
                ))}
            </div>

            <div className="max-w-2xl w-full relative z-10">
                {!showResult ? (
                    <div className="animate-quiz-card bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
                        {/* Progress Header */}
                        <div className="mb-8">
                            <div className="flex justify-between items-end mb-3">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Question {currentQuestion + 1} / {quizQuestions.length}</span>
                                <span className="text-2xl font-bold text-pink-500">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-700 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Question Content */}
                        <div ref={questionRef} className="animate-question-content">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center leading-tight">
                                {quizQuestions[currentQuestion].question}
                            </h2>

                            <div className="space-y-4 mb-10">
                                {quizQuestions[currentQuestion].options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelect(index)}
                                        className={`w-full p-5 rounded-2xl border-2 text-left transition-all transform active:scale-95 ${selectedAnswer === index
                                            ? "border-pink-500 bg-pink-50/50 shadow-lg shadow-pink-100 ring-2 ring-pink-200"
                                            : "border-gray-100 hover:border-pink-200 bg-white hover:bg-pink-50/20"
                                            }`}
                                    >
                                        <div className="flex items-center">
                                            <div
                                                className={`w-7 h-7 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${selectedAnswer === index
                                                    ? "border-pink-500 bg-pink-500"
                                                    : "border-gray-200 bg-white"
                                                    }`}
                                            >
                                                {selectedAnswer === index && (
                                                    <div className="w-3 h-3 bg-white rounded-full"></div>
                                                )}
                                            </div>
                                            <span className={`text-lg font-medium ${selectedAnswer === index ? "text-pink-700" : "text-gray-700"}`}>
                                                {option}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Bar */}
                        <button
                            onClick={handleNext}
                            disabled={selectedAnswer === null}
                            className={`w-full py-5 rounded-2xl font-bold text-xl transition-all transform shadow-2xl ${selectedAnswer === null
                                ? "bg-gray-100 text-gray-300 cursor-not-allowed translate-y-0"
                                : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:-translate-y-1 active:translate-y-1"
                                }`}
                        >
                            {currentQuestion === quizQuestions.length - 1 ? "Finish with Love! 💝" : "Next Question ✨"}
                        </button>
                    </div>
                ) : (
                    <div className="animate-result-reveal bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-10 text-center border border-white/20">
                        <div className="celebration-icon text-7xl mb-6">🎉</div>
                        <h2 className="animate-result-item text-4xl font-black mb-4 text-gray-800">
                            Quiz Complete!
                        </h2>

                        <div className="animate-result-item inline-block mb-8 relative">
                            <div className="absolute inset-0 bg-pink-200 blur-3xl opacity-30 rounded-full animate-pulse"></div>
                            <div className="relative text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-pink-500">
                                {score} <span className="text-4xl text-gray-300">/</span> {quizQuestions.length}
                            </div>
                        </div>

                        <div className="animate-result-item mb-10 text-lg font-medium">
                            {score === quizQuestions.length ? (
                                <p className="text-green-600 bg-green-50 py-3 px-6 rounded-full inline-block">
                                    Perfect! You know me so well! 💖
                                </p>
                            ) : score >= quizQuestions.length / 2 ? (
                                <p className="text-blue-600 bg-blue-50 py-3 px-6 rounded-full inline-block">
                                    Great job! You know me pretty well! 💕
                                </p>
                            ) : (
                                <p className="text-purple-600 bg-purple-50 py-3 px-6 rounded-full inline-block">
                                    We'll get to know each other better! ❤️
                                </p>
                            )}
                        </div>

                        <button
                            onClick={handleFinish}
                            className="animate-result-item w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-5 rounded-2xl font-bold text-xl hover:from-pink-600 hover:to-red-600 transform hover:scale-105 active:scale-95 shadow-2xl shadow-pink-100"
                        >
                            Continue to Surprise 💝
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
