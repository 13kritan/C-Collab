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
            <div className="flex relative h-full">
                <Sidebar />
                <main className="pt-20 p-4 ml-64 min-h-screen w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default LandingLayout;
