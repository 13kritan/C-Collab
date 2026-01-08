import './App.css'
import AuthPage from './pages/AuthPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import ProtectedRoute from './utils/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import LandingLayout from './utils/HomeLayout';

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
              </Route>
            </Routes>

        </BrowserRouter>
      </AuthProvider>
    </div>
  )
}

export default App;