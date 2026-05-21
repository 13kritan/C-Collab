import React from "react" 
import { Navigate } from "react-router-dom" 

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token")  // check if JWT exists

  if (!token) {
    return <Navigate to="/auth" replace /> 
  }

  return children 
} 

export default ProtectedRoute 
