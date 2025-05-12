
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Pricing from './pages/Pricing'
import Login from './pages/Login'


const basename = import.meta.env.MODE === "development" ? "/" : `/${import.meta.env.VITE_PUBLIC_URL}`;


function App() {

  return (
    <>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route index path='/' element={<Login />} />
          <Route index path='/pricing' element={<Pricing />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
