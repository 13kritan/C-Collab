import { useState, useCallback } from "react"
import axios from "axios"
import { authConfig } from "../utils/authConfig"

const API = "http://localhost:5000/api"

export const useDocument = () => {
  const [documents, setDocuments] = useState([])
  const [document, setDocument] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)


  //   Fetch Document By Id
  const fetchDocumentById = useCallback(async (docId) => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(
        `${API}/document/${docId}`,
        authConfig()
      )
      setDocument(res.data.document)
      return res.data.document
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch document")
    } finally {
      setLoading(false)
    }
  }, [])

  //   Create Document
  const createDocument = useCallback(async (projectId, data) => {
    setLoading(true)
    setError(null)
    try {
      const content = data.content?.trim() ? data.content : "// C Document"

      const res = await axios.post(
        `${API}/document/project/${projectId}`,
        {
          name: data.name,
          content: content
        },
        authConfig()
      )
      setDocuments((prev) => [...prev, res.data])
      return res.data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create document")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Update Document
  const updateDocument = useCallback(async (docId, data) => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.put(
        `${API}/document/${docId}`,
        data,
        authConfig()
      )
      setDocument(res.data)
      setDocuments((prev) =>
        prev.map((doc) =>
          doc._id === docId ? res.data : doc
        )
      )
      return res.data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update document")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Delete Document
  const deleteDocument = useCallback(async (docId) => {
    setLoading(true)
    setError(null)
    try {
      await axios.delete(
        `${API}/document/${docId}`,
        authConfig()
      )
      setDocuments((prev) =>
        prev.filter((doc) => doc._id !== docId)
      )
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete document")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch Document By Project
  const fetchDocumentsByProject = useCallback(async (projectId) => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(
        `${API}/document/${projectId}/docs`,
        authConfig()
      )
      setDocuments(res.data)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch documents")
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    documents,
    document,
    loading,
    error,
    fetchDocumentsByProject,
    fetchDocumentById,
    createDocument,
    updateDocument,
    deleteDocument
  }
}
