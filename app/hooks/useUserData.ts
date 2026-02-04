"use client";

import { useState, useEffect } from "react";
import { updateUserScore } from "../../lib/userService";

export interface UserData {
    name: string;
    photo?: string; // base64 encoded image
    quizScore?: number;
    firebaseId?: string; // Store the Firebase document ID
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

        // If updating quiz score and we have a Firebase ID, update Firebase too
        if (data.quizScore !== undefined && newData.firebaseId) {
            updateUserScore(newData.firebaseId, data.quizScore).catch((error) => {
                console.error("Failed to update quiz score in Firebase:", error);
            });
        }
    };

    const clearUserData = () => {
        setUserData({ name: "" });
        localStorage.removeItem("valentineUserData");
    };

    return { userData, saveUserData, clearUserData };
}
