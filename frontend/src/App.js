import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import AuthPage from './pages/AuthPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import ProtectedRoute from './utils/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import LandingLayout from './utils/HomeLayout';
import Recent from './pages/Recent';
import Shared from './pages/Shared';
import Activity from './pages/Activity';
import CreateProject from './pages/CreateProject';
import ProjectView from './pages/Project';
import Profile from './pages/Profile';

function App() {
  const contextClass = {
    success: "bg-[#0d1117] border-l-4 border-emerald-500",
    error: "bg-[#0d1117] border-l-4 border-red-500",
    info: "bg-[#0d1117] border-l-4 border-blue-500",
    default: "bg-[#0d1117]",
  }
  const ideToastStyle = {
    background: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: '0px',
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    fontSize: '12px',
    boxShadow: 'none',
  }
  return (
    <div className="App bg-bg-primary">
      <AuthProvider>
        <BrowserRouter>

            <Routes>
              <Route path='/auth' element={<AuthPage />} />
              {/* Protected Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <LandingLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Home />} />
                <Route path="home" element={<Home />} />
                <Route path="recent" element={<Recent />} />
                <Route path="shared" element={<Shared />} />
                <Route path="activity" element={<Activity />} />
                <Route path="create" element={<CreateProject />} />
                <Route path="project/:id" element={<ProjectView />} />
              </Route>

              <Route path='/profile' element={<Profile />} />
            </Routes>

        </BrowserRouter>
      </AuthProvider>
      <ToastContainer
        position="top-center"
        toastClassName="ide-toast"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        icon={false}        
        closeButton={false} 
        toastStyle={ideToastStyle} 
      />
    </div>
  )
}

export default App;