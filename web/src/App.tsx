import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Challenges } from './pages/Challenges'
import { Docs } from './pages/Docs'
import { ChallengeDetail } from './pages/ChallengeDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/challenges/:id" element={<ChallengeDetail />} />
        <Route path="/docs" element={<Docs />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

