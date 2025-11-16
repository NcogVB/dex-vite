import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import LandingLayout from './components/LandingLayout'
import Limit from './pages/limit'
import Pool from './pages/pool'
import Bridge from './pages/bridge'
import Swap from './pages/swap'


function App() {
  return (
    <Routes>
      {/* All pages with dark theme */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/pool" element={<Pool />} />
        <Route path="/bridge" element={<Bridge />} />
        <Route path="/limit" element={<Limit />} />
        <Route path="/swap" element={<Swap />} />
      </Route>
    </Routes>
  )
}

export default App
