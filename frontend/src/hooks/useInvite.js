import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { authConfig } from "../utils/authConfig"
import { useNavigate } from 'react-router-dom'

const API = "http://localhost:5000/api"

export const useInvite = (projectId) => {
  const [inviteData, setInviteData] = useState({
    code: null,
    role: null,
    timeLeft: 0, // In seconds
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (inviteData.timeLeft <= 0) return

    const timer = setInterval(() => {
      setInviteData((prev) => ({
        ...prev,
        timeLeft: prev.timeLeft - 1,
      }))
    }, 1000)

    return () => clearInterval(timer)
  }, [inviteData.timeLeft])

  // --- GENERATE CODE FUNCTION ---
  const generateInvite = useCallback(async (role) => {
    setLoading(true)
    setError(null)
    try {
      // Role should be "collaborators" or "viewers" to match your backend
      const response = await axios.post(`${API}/invite/${projectId}/inviteUser`, { role }, authConfig())
      
      setInviteData({
        code: response.data.code,
        role: response.data.role,
        timeLeft: 600, // Reset to 10 minutes
      })
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate code")
    } finally {
      setLoading(false)
    }
  }, [projectId])

// Join Project using Code
  const joinProject = async (code, userId) => {
    if (!code || code.length !== 6) {
      setError("Please enter a valid 6-character code.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(`${API}/invite/joinProject`, { 
        code: code.toUpperCase(), 
        userId 
      }, authConfig())
      
      // On success, redirect the user to the project they just joined
      const { projectId } = response.data
      navigate(`/project/${projectId}`)
      
    } catch (err) {
      setError(err.response?.data?.error || "Failed to join project. The code may be expired.")
    } finally {
      setLoading(false)
    }
  }

  //  FORMAT TIME (MM:SS) 
  const formatTime = () => {
    const mins = Math.floor(inviteData.timeLeft / 60)
    const secs = inviteData.timeLeft % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return {
    ...inviteData,
    loading,
    error,
    generateInvite,
    joinProject,
    formatTime: formatTime(),
    isExpired: inviteData.code && inviteData.timeLeft <= 0
  }
}