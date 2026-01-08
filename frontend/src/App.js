import './App.css'
import AuthPage from './pages/AuthPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './utils/ProtectedRoute';

function App() {
  return (
    <div className="App bg-bg-primary">
      <BrowserRouter>
        <Routes>
          <Route path='/auth' element={<AuthPage />} />

          {/* Protected Routes */}
          <Route path='/' element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;