import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import SidebarToggleButton from "./SidebarToggleButton";
import { useSidebarToggle } from "../hooks/useSidebarToggle";

export default function UpdatePasswordPage() {
    const navigate = useNavigate();
    const { isSidebarOpen, toggleSidebar } = useSidebarToggle(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        // Check for errors in the URL hash (e.g. expired link)
        const hash = window.location.hash;
        if (hash && hash.includes("error_code=otp_expired")) {
            setError("This password reset link has expired. Please request a new one.");
        } else if (hash && hash.includes("error=")) {
            const params = new URLSearchParams(hash.substring(1));
            const errorDescription = params.get("error_description");
            setError(errorDescription || "An error occurred with the reset link.");
        }

        let cancelled = false;

        const checkSession = (session) => {
            if (cancelled) return;
            if (session) {
                setError((prev) =>
                    prev && prev.includes("No active session") ? null : prev,
                );
                return;
            }
            if (!hash) {
                setError("No active session found. Please request a new password reset link.");
            }
        };

        supabase.auth.getSession().then(({ data: { session } }) => {
            checkSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            checkSession(session);
        });

        return () => {
            cancelled = true;
            subscription.unsubscribe();
        };
    }, []);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;
            setMessage("Password updated successfully! Redirecting...");
            setTimeout(() => navigate("/dashboard"), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center px-6 py-12 relative">
            <div className="fixed top-4 left-4 z-50 bg-white border border-gray-300">
                <SidebarToggleButton
                    isSidebarOpen={isSidebarOpen}
                    onToggle={toggleSidebar}
                />
            </div>

            {isSidebarOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-30 z-30"
                        onClick={toggleSidebar}
                    />
                    <div className="fixed left-0 top-0 z-40 h-full">
                        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
                    </div>
                </>
            )}

            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="mb-8 text-center">
                    <div className="w-12 h-12 bg-gray-900 flex items-center justify-center rounded-lg mx-auto mb-4">
                        <i className="fas fa-key text-white"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Set New Password</h2>
                    <p className="text-sm text-gray-600 mt-2">Enter your new password below.</p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm border border-red-200">
                            {error}
                            {error.includes("expired") && (
                                <div className="mt-2">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/")}
                                        className="text-red-700 font-semibold underline hover:text-red-800"
                                    >
                                        Go to Login to request a new link
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    {message && (
                        <div className="bg-green-50 text-green-500 p-3 rounded-md text-sm border border-green-200">
                            {message}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">New Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                required
                                disabled={!!error}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:border-gray-900 focus:ring-0 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
                            />
                            <i className="fas fa-lock absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Confirm Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                required
                                disabled={!!error}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:border-gray-900 focus:ring-0 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
                            />
                            <i className="fas fa-lock absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !!error}
                        className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-gray-900/20"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <i className="fas fa-circle-notch fa-spin mr-2"></i> Updating...
                            </span>
                        ) : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
