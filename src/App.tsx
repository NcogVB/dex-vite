import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './components/Layout'
import Limit from './pages/limit'
import Pool from './pages/pool'
import Bridge from './pages/bridge'
import Swap from './pages/swap'
// import ConfirmExchange from './components/ConfirmExchange'
// import Converter from './components/Converter'
// import Converter1 from './components/Converter1'
// import ConverterPool from './components/ConverterPool'
// import Success from './components/Success'
// import YouWillReceive from './components/YouWillRecieve'
// import YouWillReceive2 from './components/YouWillRecieve2'
// import YouWillRecieve3 from './components/YouWillRecieve3'

function App() {
    return (
        //  <div>
        //     models compoent make sure you implements api for popup models i have added the button there you can change the button name whateve you want and then place the mddel where you want to use them 
        //     <ConfirmExchange />
        //     <Converter />
        //     <Converter1 />
        //     <ConverterPool />
        //     <Success />
        //     <YouWillReceive />
        //     <YouWillReceive2 />
        //     <YouWillRecieve3 />
        // </div> 

        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/swap" element={<Swap />} />
            <Route path="/bridge" element={<Bridge />} />
            <Route path="/limit" element={<Limit />} />
            <Route path="/pool" element={<Pool />} />
          </Route>
        </Routes>
    )
}

export default App
