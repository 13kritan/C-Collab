import React, { useContext, useState, useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import ResponsiveBreak from "../components/ResponsiveBreak"
import Sidebar from "../components/SideBar"
import { AuthContext } from "../context/AuthContext"

const LandingLayout = () => {
    const user = useContext(AuthContext)
    const [viewportWidth, setViewportWidth] = useState(0)
    const [sidebarOpen, isSidebarOpen] = useState(false)

    useEffect(() => {
        const checkDimensions = () => {
            setViewportWidth(window.innerWidth)
        }
        checkDimensions()
        
        window.addEventListener('resize', checkDimensions)
        return () => window.removeEventListener('resize', checkDimensions)
        
    }, [])

    
    if (!user)
        return <Navigate to="/auth" replace />



    return (
        <>
            {viewportWidth < 767 ?
                <ResponsiveBreak viewportWidth={viewportWidth} />
                :
                <div className="min-h-screen relative w-full">
                    <Navbar sidebarOpen={sidebarOpen} isSidebarOpen={isSidebarOpen} />
                    <div className="flex relative h-full">
                        <Sidebar sidebarOpen={sidebarOpen} isSidebarOpen={isSidebarOpen} />
                        <main className="pt-20 p-4 ml-64 tablet:ml-0 min-h-screen w-full">
                            <Outlet sidebarOpen={sidebarOpen} isSidebarOpen={isSidebarOpen} />
                        </main>
                    </div>
                </div>
            }
        </>
    )
}

export default LandingLayout 
