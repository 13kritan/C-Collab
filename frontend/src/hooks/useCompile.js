import { useState } from "react"
import axios from "axios"
import { authConfig } from "../utils/authConfig"

const API = "http://localhost:5000/api"

export default function useCompile() {
    const [compiling, setCompiling] = useState(false)
    const [error, setError] = useState(null)

    const cCodeCompile = async (code) => {
        setCompiling(true)
        setError(null)
        try {
            const res = await axios.post(
                `${API}/compile/c`,
                {code},
                authConfig()
            )
            return res.data
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch document")
        } finally {
            setCompiling(false)
        }
    }
    return {
        cCodeCompile,
        compiling,
        error
    }
}




