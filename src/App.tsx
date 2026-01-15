import { Route, Routes } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { config } from './wagmi'

import LandingLayout from './components/LandingLayout'
import Pool from './pages/pool'
import Bridge from './pages/bridge'
import Swap from './pages/swap'
import Exchange from './pages/Exchange'
import Home from './pages/Home'
import Lending from './pages/LB'
import Insurance from './pages/Insurance'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <Routes>
            <Route element={<LandingLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/pool" element={<Pool />} />
              <Route path="/bridge" element={<Bridge />} />
              <Route path="/swap" element={<Swap />} />
              <Route path="/Exchange" element={<Exchange />} />
              <Route path="/Insurance" element={<Insurance />} />
              <Route path="/LendingBorrowing" element={<Lending />} />
            </Route>
          </Routes>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App