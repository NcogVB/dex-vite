import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './components/Layout'
import LandingLayout from './components/LandingLayout'
import Limit from './pages/limit'
import Pool from './pages/pool'
import Bridge from './pages/bridge'
import Swap from './pages/swap'


function App() {
  return (
    <Routes>
      {/* Landing page with dark theme */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* App pages with light theme */}
      <Route element={<Layout />}>
        <Route path="/swap" element={<Swap />} />
        <Route path="/bridge" element={<Bridge />} />
        <Route path="/limit" element={<Limit />} />
        <Route path="/pool" element={<Pool />} />
      </Route>
    </Routes>
  )
}

export default App
