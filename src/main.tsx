import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { SwapProvider } from './contexts/SwapContext.tsx'
import { LiquidityProvider } from './contexts/LiquidityContext.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <SwapProvider>
                <LiquidityProvider>
                <App />
                </LiquidityProvider>
            </SwapProvider>
        </BrowserRouter>
    </StrictMode>
)
