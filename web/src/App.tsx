import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { AuthProvider } from './auth/AuthProvider'
import { ThemeProvider } from './theme/ThemeContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { PageLoader } from './components/ui/PageLoader'
import { NavigationProgress } from './components/routing/NavigationProgress'
import { OrganicClipPaths } from './components/OrganicShapes'

// Code splitting with lazy loading
const Landing = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })))
const Challenges = lazy(() => import('./pages/Challenges').then(m => ({ default: m.Challenges })))
const ChallengeDetail = lazy(() => import('./pages/ChallengeDetail').then(m => ({ default: m.ChallengeDetail })))
const Docs = lazy(() => import('./pages/Docs').then(m => ({ default: m.Docs })))
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })))
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })))
const Signup = lazy(() => import('./pages/Signup').then(m => ({ default: m.Signup })))
const Auth = lazy(() => import('./pages/Auth').then(m => ({ default: m.Auth })))

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <OrganicClipPaths />
          <NavigationProgress />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/challenges" element={<Challenges />} />
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
          </Suspense>
          <Analytics />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

