import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import LandingFooter from './LandingFooter'
import LandingHeader from './LandingHeader'

const LandingLayout = () => {
    useEffect(() => {
        // Add dark theme class to body when landing page is mounted
        document.body.classList.add('dark-theme')

        // Remove dark theme class when component unmounts
        return () => {
            document.body.classList.remove('dark-theme')
        }
    }, [])

    return (
        <>
            <LandingHeader />
            <main className="pt-[100px]">
                <Outlet />
            </main>
            <LandingFooter />
        </>
    )
}

export default LandingLayout
