import React, { useState } from 'react'
import Login from '../components/Login';
import Register from '../components/Register';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(false)
    const [loading, setLoading] = useState(false)
    return (
        <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center font-sans text-slate-200">
            {/* Subtle Background Mesh Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#1E293B] via-transparent to-transparent opacity-50"></div>

            {/* Main Glassmorphism Card */}
            <div className="relative w-full max-w-md p-8 bg-[#0F121A]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">

                {/* Logo Section */}
                <div className="text-center mb-8">
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <span className="text-3xl font-bold text-[#3B82F6]">[C]</span>
                        <h1 className="text-2xl font-semibold tracking-tight">C-Collab</h1>
                    </div>
                    <p className="text-sm text-slate-400 italic">Compile. Collaborate. Conquer.</p>
                </div>
                
                {/* Register/Login */}
                {
                    isLogin ? <Login setIsLogin={setIsLogin} />
                        : <Register setIsLogin={setIsLogin} />
                }

            </div>
        </div>
    );
};

export default AuthPage;