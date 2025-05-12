
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Pricing from './pages/Pricing'
import Login from './pages/Login'


function App() {

  console.log(import.meta.env.VITE_PUBLIC_URL)

  return (
    <>
      <BrowserRouter basename={import.meta.env.VITE_PUBLIC_URL}>
        <Routes>
          <Route index path='/' element={<Login />} />
          <Route index path='/pricing' element={<Pricing />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
