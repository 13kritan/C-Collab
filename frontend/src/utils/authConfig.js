export function authConfig() {
    const token = localStorage.getItem("token") 
  
    return {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    } 
  }
  