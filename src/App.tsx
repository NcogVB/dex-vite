import { Route, Routes } from 'react-router-dom'
import LandingLayout from './components/LandingLayout'
import Pool from './pages/pool'
import Bridge from './pages/bridge'
import Swap from './pages/swap'
import Exchange from './pages/Exchange'


function App() {
  return (
    <Routes>
      {/* All pages with dark theme */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Swap />} />
        <Route path="/pool" element={<Pool />} />
        <Route path="/bridge" element={<Bridge />} />
        <Route path="/swap" element={<Swap />} />
        <Route path="/Exchange" element={<Exchange />} />
      </Route>
    </Routes>
  )
}

export default App
