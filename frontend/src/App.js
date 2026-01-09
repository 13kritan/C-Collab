import './App.css'
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

function App() {
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
            </Routes>

        </BrowserRouter>
      </AuthProvider>
    </div>
  )
}

export default App;