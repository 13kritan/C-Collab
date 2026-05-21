import { useState, useEffect } from "react"
import axios from "axios"
import { authConfig } from "../utils/authConfig"
import { toast } from 'react-toastify'

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
            toast.success(`[PROC] INIT_SUCCESS: PROJECT_DIR_CREATED`)
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
            toast.success(`[CONF] MOD_CONFIG: SETTINGS_SYNC_OK`)
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
            toast.success(`[PROC] DESTRUCT: ALL_RESOURCES_WIPED`)
            return res
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete project")
            throw err
        } finally {
            setLoading(false)
        }
    }

    // Delete Project
    const deleteCollaborator = async (projectId, id) => {
        setLoading(true)
        setError(null)
        try {
            const res = await axios.delete(`${API}/project/deletecollab/${projectId}`, {
                ...authConfig(),
                data: { id },
            })
            toast.success(`[PROC] DESTRUCT: ALL_RESOURCES_WIPED`)
            return res
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete collaborator")
            throw err
        } finally {
            setLoading(false)
        }
    }

    // Delete Project
    const deleteViewer = async (projectId, id) => {
        setLoading(true)
        setError(null)
        try {
            const res = await axios.delete(`${API}/project/deleteviewer/${projectId}`, {
                ...authConfig(),
                data: { userId: id },
            })
            toast.success(`[PROC] DESTRUCT: ALL_RESOURCES_WIPED`)
            return res
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete collaborator")
            throw err
        } finally {
            setLoading(false)
        }
    }

    // Fetch Project By Id
    const fetchAuditLogs = async (id) => {
        setLoading(true)
        setError(null)
        try {
            const res = await axios.get(`${API}/project/${id}/auditlogs`, authConfig())
         
            return res.data
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch shared projects")
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
        deleteProject,
        fetchAuditLogs,
        deleteCollaborator,
        deleteViewer
    }
}
