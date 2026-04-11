import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
    const [view, setView] = useState("login"); // 'login', 'register', 'forgot-password'
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        // Check if user is already logged in
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                navigate("/dashboard");
            }
        });
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            setMessage("Registration successful! Please check your email to confirm your account.");
            setView("login");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            });
            if (error) throw error;
            setMessage("Password reset link sent! Check your email.");
            setView("login");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
            if (error) throw error;
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col lg:flex-row w-full relative">
            {/* Left Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:px-12 bg-white">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 bg-gray-900 flex items-center justify-center rounded-lg">
                                <i className="fas fa-cube text-white"></i>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">BlockAnalytics</span>
                        </div>
                        <p className="text-sm text-gray-600">
                            {view === "login" && "Sign in to access your analytics dashboard"}
                            {view === "register" && "Create an account to get started"}
                            {view === "forgot-password" && "Enter your email to reset your password"}
                        </p>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm border border-red-200 mb-6">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="bg-green-50 text-green-500 p-3 rounded-md text-sm border border-green-200 mb-6">
                            {message}
                        </div>
                    )}

                    {/* Forms */}
                    {view === "login" && (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:border-gray-900 focus:ring-0 transition-colors"
                                    />
                                    <i className="fas fa-envelope absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:border-gray-900 focus:ring-0 transition-colors"
                                    />
                                    <i className="fas fa-lock absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 border-2 border-gray-300 rounded text-gray-900 focus:ring-gray-900" />
                                    <span className="text-sm text-gray-700">Remember me</span>
                                </label>
                                <button type="button" onClick={() => setView("forgot-password")} className="text-sm text-gray-900 font-semibold hover:underline">
                                    Forgot Password?
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-gray-900/20"
                            >
                                {loading ? <span className="flex items-center justify-center"><i className="fas fa-circle-notch fa-spin mr-2"></i> Signing in...</span> : "Sign In"}
                            </button>
                        </form>
                    )}

                    {view === "register" && (
                        <form onSubmit={handleRegister} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:border-gray-900 focus:ring-0 transition-colors"
                                    />
                                    <i className="fas fa-envelope absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Create a password"
                                        required
                                        minLength={6}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:border-gray-900 focus:ring-0 transition-colors"
                                    />
                                    <i className="fas fa-lock absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-gray-900/20"
                            >
                                {loading ? <span className="flex items-center justify-center"><i className="fas fa-circle-notch fa-spin mr-2"></i> Creating Account...</span> : "Create Account"}
                            </button>
                        </form>
                    )}

                    {view === "forgot-password" && (
                        <form onSubmit={handleForgotPassword} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:border-gray-900 focus:ring-0 transition-colors"
                                    />
                                    <i className="fas fa-envelope absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-gray-900/20"
                            >
                                {loading ? <span className="flex items-center justify-center"><i className="fas fa-circle-notch fa-spin mr-2"></i> Sending Link...</span> : "Send Reset Link"}
                            </button>
                            <div className="text-center">
                                <button type="button" onClick={() => setView("login")} className="text-sm text-gray-900 font-semibold hover:underline">
                                    Back to Sign In
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Divider & Social (Only for Login/Register) */}
                    {view !== "forgot-password" && (
                        <>
                            <div className="relative mt-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors text-gray-700 hover:border-gray-300"
                                >
                                    <i className="fab fa-google text-lg"></i>
                                    <span className="text-sm font-semibold">Google</span>
                                </button>
                            </div>

                            <div className="text-center pt-4 border-t border-gray-100 mt-6">
                                <p className="text-sm text-gray-600">
                                    {view === "login" ? "Don't have an account?" : "Already have an account?"}
                                    <button
                                        type="button"
                                        onClick={() => setView(view === "login" ? "register" : "login")}
                                        className="text-gray-900 font-semibold hover:underline ml-1"
                                    >
                                        {view === "login" ? "Create Account" : "Sign In"}
                                    </button>
                                </p>
                            </div>
                        </>
                    )}

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                            <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
                            <span>•</span>
                            <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
                            <span>•</span>
                            <a href="#" className="hover:text-gray-900 transition-colors">Help Center</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side (Same as before) */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0f172a] items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 pointer-events-none"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

                <div className="w-full max-w-2xl relative z-10">
                    <div className="relative w-full h-96 bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl mb-12 group">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-gray-700 rounded-full border-4 border-gray-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                            <i className="fas fa-cube text-gray-400 text-xl"></i>
                        </div>
                        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-gray-800 rounded-full border-4 border-gray-700 shadow-lg group-hover:translate-x-2 transition-transform duration-500 delay-75"></div>
                        <div className="absolute bottom-1/4 left-1/3 w-14 h-14 bg-gray-700 rounded-full border-4 border-gray-600 shadow-lg group-hover:-translate-y-2 transition-transform duration-500 delay-100"></div>
                        <div className="absolute bottom-1/3 right-1/3 w-10 h-10 bg-gray-800 rounded-full border-4 border-gray-700 shadow-lg"></div>

                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full border-4 border-white/10 flex items-center justify-center shadow-2xl shadow-blue-500/30 z-20 animate-pulse">
                            <i className="fas fa-network-wired text-white text-3xl"></i>
                        </div>

                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                            <line x1="25%" y1="25%" x2="50%" y2="50%" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
                            <line x1="75%" y1="33%" x2="50%" y2="50%" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
                            <line x1="33%" y1="75%" x2="50%" y2="50%" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
                        </svg>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-start space-x-5 group">
                            <div className="w-12 h-12 bg-gray-800/50 rounded-xl border border-gray-700 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition-colors">
                                <i className="fas fa-chart-line text-blue-400 text-xl"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Real-Time Analytics</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">Monitor blockchain transactions and network activity in real-time with millisecond precision.</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-5 group">
                            <div className="w-12 h-12 bg-gray-800/50 rounded-xl border border-gray-700 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:border-purple-500/50 transition-colors">
                                <i className="fas fa-shield-alt text-purple-400 text-xl"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Enterprise Security</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">Bank-level encryption and advanced security protocols to keep your data safe.</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-5 group">
                            <div className="w-12 h-12 bg-gray-800/50 rounded-xl border border-gray-700 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
                                <i className="fas fa-project-diagram text-emerald-400 text-xl"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Network Insights</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">Discover hidden patterns and deep connections across distributed networks.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
