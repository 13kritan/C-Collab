import axios from "axios"
import React, { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchUserByEmail = async () => {
            try {
                const storedUser = localStorage.getItem("user")
                if (!storedUser) return
                const data = JSON.parse(storedUser)
                if (!data?.email) return

                const res = await axios.get(
                    `http://localhost:5000/api/auth/user/${data.email}`
                )

                setUser(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchUserByEmail()
    }, [])

    console.log(user)

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    )
}
