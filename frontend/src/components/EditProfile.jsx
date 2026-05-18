import React, { useState } from 'react'
import { Github, Linkedin, Bell, Camera, X, ChevronDown, Search } from 'lucide-react'
import useAuth from '../hooks/useAuth'

const EditProfile = ({ user, isEditOpen, Pfp }) => {
    const { editProfile } = useAuth()
    const [tagInput, setTagInput] = useState("")
    const [formData, setFormData] = useState({
        name: user.user.name,
        description: user.user.description,
        location: user.user.location,
        image: user.user.image || Pfp,
        title: user.user.title,
        expertise: user.user.expertise || [],
        social: {
            github: user.user.social?.github,
            linkedin: user.user.social?.linkedin,
        },
    })
    const [image, setImage] = useState(null)
    console.log(user)

    const handleImageChange = (e) => {
        const file = e.target.files[0]

        if (!file) return

        const reader = new FileReader()

        reader.onloadend = () => {
            const base64String = reader.result

            setFormData((prev) => ({
                ...prev,
                image: base64String, 
            }))
        }

        reader.readAsDataURL(file)
        console.log(formData)
    }

    const handleKeyDown = (e) => {
        console.log(formData)
        if (e.key === 'Enter') {
            e.preventDefault()
            const value = tagInput.trim()

            if (value && !formData.expertise?.includes(`[${value}]`)) {
                const formattedTag = value.startsWith('[') ? value : `[${value}]`

                setFormData(prev => ({
                    ...prev,
                    expertise: [...prev.expertise, formattedTag]
                }));
                setTagInput("")
            }
        } else if (e.key === 'Backspace' && !tagInput && formData.expertise.length > 0) {
            removeTag(formData.expertise.length - 1)
        }
    }

    const removeTag = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            expertise: prev?.expertise?.filter((_, index) => index !== indexToRemove)
        }))
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        if (name === "github" || name === "linkedin") {
            setFormData((prev) => ({
                ...prev,
                social: {
                    ...prev?.social,
                    [name]: value,
                },
            }))
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const userId = user.user._id
        console.log(userId)
        try {
            await editProfile(formData, userId)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="max-w-4xl text-[#c9d1d9] font-mono">
            <div className="w-full mx-auto bg-[#0d1117] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden">
                <div className="p-8 grid grid-cols-12 gap-10">

                    {/* Left Column: Avatar Upload */}
                    <div className="col-span-3 flex flex-col items-center">
                        <label className="relative group cursor-pointer">

                            <img
                                src={formData.image}
                                className="w-28 h-28 md:w-40 md:h-40 rounded-full border-4 border-[#161b22] object-cover filter brightness-75"
                                alt="Image"
                            />

                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition">
                                <span className="text-xs font-bold text-white mb-2 leading-tight">
                                    Upload
                                    <br />
                                    New Photo
                                </span>
                            </div>

                            <div className="absolute bottom-1 right-2 bg-[#161b22] p-1.5 rounded-full border border-[#30363d]">
                                <Camera size={16} className="text-white" />
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>

                        <button
                            type="button"
                            className="mt-4 text-blue-400 text-xs hover:underline">
                            Change Photo
                        </button>
                    </div>

                    {/* Right Column: Form Fields */}
                    <div className="col-span-9 space-y-8">
                        <h3 className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                            {user.user.email}
                        </h3>

                        {/* 1. Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Basic Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    defaultValue={formData.name}
                                    className="bg-[#0d1117] border border-[#30363d] rounded-md p-2 text-sm text-gray-400 focus:outline-none" />
                                <input name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    defaultValue={formData.title || "Professional Title"}
                                    className="bg-[#0d1117] border border-[#30363d] rounded-md p-2 text-sm text-gray-400 focus:outline-none" />
                                <input name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    defaultValue={formData.location || "Location"}
                                    className="bg-[#0d1117] border border-[#30363d] rounded-md p-2 text-sm text-gray-400 focus:outline-none" />
                            </div>
                        </div>

                        {/* 2. Detailed Bio */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. Description</h3>
                            <textarea name="description"
                                value={formData.description}
                                onChange={handleChange}
                                defaultValue={formData.description || "Description"}
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md p-3 text-sm text-gray-400 h-24 focus:outline-none resize-none"
                            />
                        </div>

                        {/* 3. Technical Expertise */}
                        <div className="space-y-4 relative">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">3. Technical Expertise & C standards</h3>
                            <div className="w-full bg-[#0d1117] border border-[#30363d] rounded-md p-2 flex flex-wrap gap-2 min-h-[44px] focus-within:border-blue-500 transition-colors">
                                {/* Render Existing Tags */}
                                {formData.expertise?.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="flex items-center gap-1 bg-[#161b22] px-2 py-0.5 rounded border border-[#30363d] text-xs text-blue-400 font-mono"
                                    >
                                        {tag}
                                        <X
                                            size={12}
                                            className="text-gray-500 cursor-pointer hover:text-red-400"
                                            onClick={() => removeTag(index)}
                                        />
                                    </span>
                                ))}

                                {/* The Dynamic Input */}
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={formData.expertise?.length === 0 ? "Add Tag (e.g., C++, CMake)" : formData.expertise}
                                    className="flex-1 bg-transparent border-none outline-none text-sm text-gray-300 min-w-[120px]"
                                />
                            </div>
                        </div>

                        {/* 4. Social Connections */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">4. Social Connections</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Github size={20} />
                                    <input name="github"
                                        value={formData.social.github}
                                        onChange={handleChange}
                                        defaultValue={formData.social?.github || "https://github.com/"} className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-md p-2 text-xs text-gray-500 focus:outline-none" />
                                    <X size={16} className="text-gray-600" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <Linkedin size={20} />
                                    <input name="linkedin"
                                        value={formData.social.linkedin}
                                        onChange={handleChange}
                                        defaultValue={formData.social?.linkedin || "https://www.linkedin.com/"} className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-md p-2 text-xs text-gray-500 focus:outline-none" />
                                    <X size={16} className="text-gray-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-8 py-6 border-t border-[#30363d] flex gap-4">
                    <button onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-bold transition-all shadow-lg shadow-blue-900/20">
                        Save Changes
                    </button>
                    <button onClick={() => isEditOpen(false)}
                        className="bg-[#1c2128] border border-[#30363d] text-gray-300 px-8 py-2 rounded-md text-sm font-bold hover:bg-[#21262d]">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;