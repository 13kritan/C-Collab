import React, { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import Sidebar from "../components/SideBar"
import { AuthContext } from "../context/AuthContext"

const LandingLayout = () => {
    const user  = useContext(AuthContext)

    if (!user) 
      return <Navigate to="/auth" replace />

    return (
        <div className="min-h-screen relative w-full">
            <Navbar />
            <div className="flex relative">
                <Sidebar />
                <main className="mt-16 ml-72 p-4 w-full h-full">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default LandingLayout;
