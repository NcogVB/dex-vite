import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { SwapProvider } from './contexts/SwapContext.tsx'
import { LiquidityProvider } from './contexts/LiquidityContext.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './wagmi'
import '@rainbow-me/rainbowkit/styles.css'
import { WagmiProvider } from 'wagmi'
import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={darkTheme()}>

                    <BrowserRouter>
                        <SwapProvider>
                            <LiquidityProvider>

                                <App />

                            </LiquidityProvider>
                        </SwapProvider>
                    </BrowserRouter>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    </StrictMode>
)
