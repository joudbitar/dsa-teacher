import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { ThemeProvider } from './theme/ThemeContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Landing } from './pages/Landing'
import { Challenges } from './pages/Challenges'
import { ChallengeDetail } from './pages/ChallengeDetail'
import { Docs } from './pages/Docs'
import { About } from './pages/About'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Auth } from './pages/Auth'
import { OrganicClipPaths } from './components/OrganicShapes'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <OrganicClipPaths />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/challenges"
              element={
                <ProtectedRoute>
                  <Challenges />
                </ProtectedRoute>
              }
            />
            <Route
              path="/challenges/:id"
              element={
                <ProtectedRoute>
                  <ChallengeDetail />
                </ProtectedRoute>
              }
            />
            <Route path="/docs" element={<Docs />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

