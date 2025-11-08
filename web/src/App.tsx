import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Challenges } from './pages/Challenges'
import { ChallengeDetail } from './pages/ChallengeDetail'
import { Docs } from './pages/Docs'
import { About } from './pages/About'
import { GettingStarted } from './pages/GettingStarted'
import { CLIReference } from './pages/CLIReference'
import { APIReference } from './pages/APIReference'
import { OrganicClipPaths } from './components/OrganicShapes'

function App() {
  return (
    <BrowserRouter>
      <OrganicClipPaths />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/challenges/:id" element={<ChallengeDetail />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/docs/getting-started" element={<GettingStarted />} />
        <Route path="/docs/cli-reference" element={<CLIReference />} />
        <Route path="/docs/api-reference" element={<APIReference />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

