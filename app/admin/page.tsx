"use client";

import { useEffect, useState } from "react";
import { getAllUsers, UserSubmission, deleteUser, updateUserScore } from "../../lib/userService";

export default function AdminPage() {
    const [users, setUsers] = useState<UserSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editScore, setEditScore] = useState<number>(0);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            console.log('Fetching users from Firestore...');
            const data = await getAllUsers();
            console.log('Fetched users:', data);
            setUsers(data);
            setError("");
        } catch (err: any) {
            console.error("Error loading users:", err);
            setError(`Failed to load submissions: ${err.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this submission? 💔")) return;

        try {
            await deleteUser(id);
            setUsers(users.filter(u => u.id !== id));
        } catch (err: any) {
            alert(`Error deleting: ${err.message}`);
        }
    };

    const startEditing = (user: UserSubmission) => {
        setEditingId(user.id);
        setEditScore(user.quizScore || 0);
    };

    const handleUpdateScore = async (id: string) => {
        try {
            await updateUserScore(id, editScore);
            setUsers(users.map(u => u.id === id ? { ...u, quizScore: editScore } : u));
            setEditingId(null);
        } catch (err: any) {
            alert(`Error updating: ${err.message}`);
        }
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "Unknown";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-red-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500 mb-2">
                                Admin Dashboard 💕
                            </h1>
                            <p className="text-gray-600">
                                Total submissions: <span className="font-bold text-pink-600">{users.length}</span>
                            </p>
                        </div>
                        <button
                            onClick={loadUsers}
                            className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-red-600 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                        >
                            Refresh 🔄
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-6">
                        <input
                            type="text"
                            placeholder="Search by name... 🔍"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-400 transition-colors"
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4 animate-heartbeat">❤️</div>
                        <p className="text-xl text-gray-700">Loading submissions...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-100 border-2 border-red-300 rounded-2xl p-6 text-center">
                        <p className="text-red-700 text-lg">{error}</p>
                    </div>
                )}

                {/* Users Grid */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredUsers.length === 0 ? (
                            <div className="col-span-full text-center py-12 bg-white/95 rounded-3xl shadow-lg">
                                <div className="text-6xl mb-4">💔</div>
                                <p className="text-xl text-gray-700">
                                    {searchTerm ? "No submissions found" : "No submissions yet"}
                                </p>
                            </div>
                        ) : (
                            filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all transform hover:scale-[1.02] flex flex-col h-full"
                                >
                                    {/* Action Buttons */}
                                    <div className="flex justify-end gap-2 mb-4">
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Submission"
                                        >
                                            🗑️
                                        </button>
                                    </div>

                                    {/* Photo */}
                                    <div className="flex justify-center mb-4">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-red-400 rounded-full blur-lg opacity-50"></div>
                                            {user.photoURL ? (
                                                <img
                                                    src={user.photoURL}
                                                    alt={user.name}
                                                    className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                                />
                                            ) : (
                                                <div className="relative w-32 h-32 rounded-full bg-gradient-to-r from-pink-200 to-purple-200 border-4 border-white shadow-lg flex items-center justify-center text-4xl">
                                                    ❤️
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Name */}
                                    <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
                                        {user.name}
                                    </h3>

                                    {/* Quiz Score Display/Edit */}
                                    <div className="mt-auto">
                                        <div className="text-center mb-4">
                                            {editingId === user.id ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={editScore}
                                                        onChange={(e) => setEditScore(Number(e.target.value))}
                                                        className="w-20 px-2 py-1 border-2 border-pink-300 rounded-lg text-center font-bold"
                                                        min="0"
                                                        max="5"
                                                    />
                                                    <button
                                                        onClick={() => handleUpdateScore(user.id)}
                                                        className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 text-sm"
                                                    >
                                                        ✅
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="bg-gray-400 text-white p-2 rounded-lg hover:bg-gray-500 text-sm"
                                                    >
                                                        ❌
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="group relative inline-block">
                                                    <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-full font-bold text-lg flex items-center gap-2">
                                                        Score: {user.quizScore || 0}/5
                                                        <button
                                                            onClick={() => startEditing(user)}
                                                            className="text-xs bg-white/20 hover:bg-white/40 p-1 rounded-md transition-colors"
                                                            title="Edit Score"
                                                        >
                                                            ✏️
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Timestamp */}
                                        <p className="text-xs text-gray-500 text-center italic">
                                            {formatDate(user.timestamp)}
                                        </p>

                                        {/* Decorative Hearts */}
                                        <div className="flex justify-center gap-2 mt-4 text-xl">
                                            <span className="animate-heartbeat">💖</span>
                                            <span className="animate-heartbeat" style={{ animationDelay: "0.2s" }}>
                                                💕
                                            </span>
                                            <span className="animate-heartbeat" style={{ animationDelay: "0.4s" }}>
                                                ❤️
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
