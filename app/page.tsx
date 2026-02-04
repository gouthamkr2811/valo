"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserData } from "./hooks/useUserData";
import { saveUserToFirebase } from "../lib/userService";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Home() {
  const router = useRouter();
  const { saveUserData } = useUserData();
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heartsContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Entrance animations for the form elements
    const tl = gsap.timeline();

    tl.from(".animate-target-header", {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: "back.out(1.7)",
    })
      .from(".animate-target-form", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.5")
      .from(".animate-target-input", {
        x: -20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.2,
        ease: "power2.out",
      }, "-=0.3");

    // Dynamic floating hearts
    const hearts = gsap.utils.toArray<HTMLElement>(".floating-heart-gsap");
    hearts.forEach((heart) => {
      gsap.set(heart, {
        x: gsap.utils.random(0, window.innerWidth),
        y: gsap.utils.random(window.innerHeight, window.innerHeight + 200),
        scale: gsap.utils.random(0.5, 1.5),
        opacity: gsap.utils.random(0.3, 0.7),
      });

      gsap.to(heart, {
        y: -200,
        x: "+=" + gsap.utils.random(-100, 100),
        duration: gsap.utils.random(6, 12),
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
  }, { scope: containerRef });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Photo size should be less than 5MB 📸");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file 🖼️");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // Compress image to reduce size
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Resize to max 800px width while maintaining aspect ratio
          const maxWidth = 800;
          const scale = maxWidth / img.width;
          canvas.width = img.width > maxWidth ? maxWidth : img.width;
          canvas.height = img.width > maxWidth ? img.height * scale : img.height;

          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Convert to base64 with reduced quality (0.7 = 70% quality)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setPhoto(compressedBase64);
          setError("");
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter your name ❤️");
      return;
    }

    if (!photo) {
      setError("Please upload your photo 📸");
      return;
    }

    setLoading(true);
    setError("");

    // Save to localStorage first (immediate backup)
    saveUserData({ name: name.trim(), photo });

    try {
      // Save to Firebase (setting score to 0 as quiz is removed)
      await saveUserToFirebase(name.trim(), photo, 0);
      console.log('Saved to Firebase successfully');
    } catch (err) {
      console.warn('Firebase save failed, continuing anyway:', err);
    }

    // Redirect directly to proposal page
    router.push("/proposal");
  };

  return (
    <div ref={containerRef} className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-pink-50 to-red-50">
      {/* GSAP Floating Hearts */}
      <div ref={heartsContainerRef} className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="floating-heart-gsap absolute text-2xl"
          >
            {i % 3 === 0 ? "❤️" : i % 3 === 1 ? "💕" : "💖"}
          </div>
        ))}
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="animate-target-form bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="animate-target-header text-center mb-8">
            <h1 className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500" style={{ fontFamily: "var(--font-dancing)" }}>
              Valentine's Day ❤️
            </h1>
            <p className="text-gray-600 text-lg">
              Something special awaits... 💕
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="animate-target-input">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name 💖
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:border-pink-400 transition-all focus:ring-4 focus:ring-pink-100 placeholder-gray-400 bg-white/50"
                placeholder="Enter your name..."
              />
            </div>

            {/* Photo Upload */}
            <div className="animate-target-input">
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
                Your Photo 📸 <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col items-center gap-4">
                {photo && (
                  <div className="relative group">
                    <img
                      src={photo}
                      alt="Preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setPhoto("")}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <label className="w-full cursor-pointer">
                  <div className="w-full px-4 py-3 border-2 border-dashed border-pink-200 rounded-xl hover:border-pink-400 transition-all bg-pink-50/30 text-center group hover:bg-pink-50">
                    <span className="text-pink-600 font-medium group-hover:scale-110 inline-block transition-transform">
                      {photo ? "Change Photo 🔄" : "Upload Photo 📷"}
                    </span>
                  </div>
                  <input
                    type="file"
                    id="photo"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm text-center animate-bounce">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all transform shadow-lg active:scale-95 ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-red-500 text-white hover:shadow-pink-200 hover:shadow-xl hover:-translate-y-1"
                }`}
            >
              {loading ? "Saving... 💕" : "Continue 💝"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
