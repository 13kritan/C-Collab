import { useState } from "react"
import axios from "axios"
import { authConfig } from "../utils/authConfig"
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify'

const API_URL = "http://localhost:5000/api"

export default function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    // LOGIN
    const login = async ({ email, password }) => {
        try {
            setLoading(true)
            setError(null)

            if (!email || !password) {
                setError("Invalid Credentials")
                setLoading(false)
                return
            }

            const res = await axios.post(`${API_URL}/auth/login`, { email, password }, authConfig)

            localStorage.setItem("token", res.data.token)
            localStorage.setItem("user", JSON.stringify(res.data.user));
            setUser(res.data.user)
            toast.success("Logged In")
            navigate('/')
            return res.data

        } catch (err) {
            setError(err.response?.data?.message || "Login failed")
            toast.error("Login Failed")
        } finally {
            setLoading(false)
        }
    }

    // REGISTER
    const register = async ({ name, email, password, confirmPassword }) => {
        try {
            setLoading(true)
            setError(null)

            if (!name || !email || password !== confirmPassword) {
                setError("Invalid Credentials")
                setLoading(false)
                return
            }

            const res = await axios.post(`${API_URL}/auth/register`, { name, email, password }, authConfig)

            localStorage.setItem("token", res.data.token)
            localStorage.setItem("user", JSON.stringify(res.data.user))
            toast.success("Registered User")
            setUser(res.data.user)
            navigate('/')

            return res.data
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed")
            toast.error("Error Registering User.")
            throw err
        } finally {
            setLoading(false)
        }
    };

    // LOGOUT
    const logout = async () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
        toast.success("Logged Out.")
        navigate('/auth')
    }

    // Edit Profile
    const editProfile = async (formData, userId) => {
        try {
            setLoading(true)
            setError(null)

            const res = await axios.post(`${API_URL}/auth/editProfile/${userId}`, { formData, }, authConfig)

            localStorage.setItem("user", JSON.stringify(res.data.user))

            setUser(res.data.user)
            window.location.reload()
            toast.success("User Edited.")
            navigate('/profile')

            return res.data
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed")
            toast.error("Update Failed.")
            throw err
        } finally {
            setLoading(false)
        }
    }

    return {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        editProfile
    }

}




