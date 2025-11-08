import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Challenges } from './pages/Challenges'
import { ChallengeDetail } from './pages/ChallengeDetail'
import { OrganicClipPaths } from './components/OrganicShapes'

function App() {
  return (
    <BrowserRouter>
      <OrganicClipPaths />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/challenges/:id" element={<ChallengeDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

