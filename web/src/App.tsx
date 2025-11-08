import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Challenges } from './pages/Challenges'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/challenges/:id" element={<Challenges />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

