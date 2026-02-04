"use client";

import { useState, useEffect } from "react";

export interface UserData {
    name: string;
    photo?: string; // base64 encoded image
    quizScore?: number;
}

export function useUserData() {
    const [userData, setUserData] = useState<UserData>({
        name: "",
    });

    useEffect(() => {
        // Load data from localStorage on mount
        const stored = localStorage.getItem("valentineUserData");
        if (stored) {
            try {
                setUserData(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse user data:", e);
            }
        }
    }, []);

    const saveUserData = (data: Partial<UserData>) => {
        const newData = { ...userData, ...data };
        setUserData(newData);
        localStorage.setItem("valentineUserData", JSON.stringify(newData));
    };

    const clearUserData = () => {
        setUserData({ name: "" });
        localStorage.removeItem("valentineUserData");
    };

    return { userData, saveUserData, clearUserData };
}
