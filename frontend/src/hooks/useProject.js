import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { authConfig } from "../utils/authConfig"

const API = "http://localhost:5000/api"

export const useProject = () => {
    const [projects, setProjects] = useState([])
    const [sharedProjects, setSharedProjects] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    //   Fetch My Projects
    const fetchProjects = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await axios.get(`${API}/project`, authConfig())
            setProjects(res.data.projects)
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch projects")
        } finally {
            setLoading(false)
        }
    }

    // Fetch Shared Projects
    const fetchSharedProjects = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await axios.get(`${API}/project/shared`, authConfig())
            setSharedProjects(res.data)
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch shared projects")
        } finally {
            setLoading(false)
        }
    }

    // Fetch Project By Id
    const fetchProjectById = async (id) => {
        setLoading(true)
        setError(null)
        try {
            const res = await axios.get(`${API}/project/${id}`, authConfig())
            return res.data
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch shared projects")
        } finally {
            setLoading(false)
        }
    }

    // Create Project
    const createProject = async (data) => {
        setLoading(true)
        setError(null)
        try {
            const res = await axios.post(
                `${API}/project`,
                {
                    name: data.name,
                    description: data.description
                },
                authConfig()
            )
            setProjects((prev) => [...prev, res.data.project])
            return res.data.project
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create project")
            throw err
        } finally {
            setLoading(false)
        }
    }

    // Update Project
    const updateProject = async (projectId, data) => {
        setLoading(true)
        setError(null)
        try {
            const res = await axios.put(
                `${API}/project/${projectId}`,
                {
                    name: data.name,
                    description: data.description
                },
                authConfig()
            )
            setProjects((prev) =>
                prev.map((p) => (p._id === projectId ? res.data : p))
            )
            return res.data
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update project")
            throw err
        } finally {
            setLoading(false)
        }
    }

    // Delete Project
    const deleteProject = async (projectId) => {
        setLoading(true)
        setError(null)
        try {
            const res = await axios.delete(`${API}/project/${projectId}`, authConfig())
            setProjects((prev) => prev.filter((p) => p._id !== projectId))
            return res
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete project")
            throw err
        } finally {
            setLoading(false)
        }
    }

    //   Auto-Fetch Project On Mount
    useEffect(() => {
        fetchProjects()
    }, [])

    return {
        projects,
        sharedProjects,
        loading,
        error,
        fetchProjects,
        fetchProjectById,
        fetchSharedProjects,
        createProject,
        updateProject,
        deleteProject
    }
}
