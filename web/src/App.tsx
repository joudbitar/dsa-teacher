import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Challenges } from './pages/Challenges'
import { ChallengeDetail } from './pages/ChallengeDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/challenges/:id" element={<ChallengeDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

