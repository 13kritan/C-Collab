import React, { useState } from 'react'
import { Github, Chrome, Eye, EyeOff } from 'lucide-react'
import useAuth from '../hooks/useAuth'
import { InlineCloader } from '../utils/PageLoader'

export default function Register({ setIsLogin }) {
    const { register, loading, error } = useAuth()

    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    // On Change Function
    const dataOnChange = (e) => {
        const { name, value } = e.target

        setData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // Handle Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault()
        const user = await register({ name: data.name, email: data.email, password: data.password, confirmPassword: data.confirmPassword })
        if (!user) alert(error)
    }

    return (
        <div>
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-medium">Welcome</h2>
                    <p className="text-sm text-slate-500">Register for a collaborative journey</p>
                </div>

                {/* Form Inputs */}
                <div className="space-y-4">
                    <div className="relative group">
                        <input
                            onChange={(e) => dataOnChange(e)}
                            name='name'
                            value={data.name}
                            type="text"
                            placeholder="Username"
                            className="w-full bg-[#05070A] border border-white/5 rounded-lg px-4 py-3 outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all"
                        />
                    </div>

                    <div className="relative group">
                        <input
                            onChange={(e) => dataOnChange(e)}
                            name='email'
                            value={data.email}
                            type="email"
                            placeholder="Email Address"
                            className="w-full bg-[#05070A] border border-white/5 rounded-lg px-4 py-3 outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all"
                        />
                    </div>

                    <div className='relative'>
                        <input
                            onChange={(e) => dataOnChange(e)}
                            name='password'
                            value={data.password}
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Password"
                            className="w-full bg-[#05070A] border border-white/5 rounded-lg px-4 py-3 outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all"
                        />

                        {
                            !passwordVisible ? <Eye onClick={() => setPasswordVisible(true)} size={16} className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-500 cursor-pointer hover:text-white transition-colors"></Eye>
                                : <EyeOff onClick={() => setPasswordVisible(false)} size={16} className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-500 cursor-pointer hover:text-white transition-colors"></EyeOff>
                        }

                    </div>
                    <div className='relative'>
                        <input

                            onChange={(e) => dataOnChange(e)}
                            name='confirmPassword'
                            value={data.confirmPassword}
                            type={confirmPasswordVisible ? "text" : "password"}
                            placeholder="Confirm Password"
                            className="w-full bg-[#05070A] border border-white/5 rounded-lg px-4 py-3 outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all"
                        />

                        {
                            !confirmPasswordVisible ? <Eye onClick={() => setConfirmPasswordVisible(true)} size={16} className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-500 cursor-pointer hover:text-white transition-colors"></Eye>
                                : <EyeOff onClick={() => setConfirmPasswordVisible(false)} size={16} className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-500 cursor-pointer hover:text-white transition-colors"></EyeOff>
                        }

                    </div>
                </div>

                {/* Login Button */}
                <button onClick={handleSubmit} className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium py-3 rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]">
                    {
                        loading ? <InlineCloader /> : "Log In to Terminal"
                    }
                </button>

                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0F121A] px-2 text-slate-500">or continue with</span></div>
                </div>

                {/* Social Buttons */}
                <div className="flex gap-4">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-[#161B22] border border-white/10 py-2.5 rounded-lg hover:bg-[#21262D] transition-colors">
                        <Github size={18} /> <span className="text-sm">GitHub</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-[#161B22] border border-white/10 py-2.5 rounded-lg hover:bg-[#21262D] transition-colors">
                        <Chrome size={18} /> <span className="text-sm">Google</span>
                    </button>
                </div>

                <p className="text-center text-sm text-slate-500 mt-4">
                    Already have an account? <span onClick={() => setIsLogin(true)} className="text-[#3B82F6] cursor-pointer hover:underline">Login</span>
                </p>
            </div>
        </div>
    )
}
