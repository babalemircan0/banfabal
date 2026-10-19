import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import SingUp from './pages/SingUp.jsx'
import IlanVer from './pages/IlanVer.jsx'
import IlanDuzenle from './pages/IlanDuzenle.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Hesabim from './pages/Hesabim.jsx'
import Ilanlarim from './pages/Ilanlarim.jsx'
import Mesajlar from './pages/Mesajlar.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/giris" element={<Login />} />
        <Route path="/kayit" element={<SingUp />} />
        <Route path="/ilan-ver" element={<IlanVer />} />
        <Route path="/ilan-duzenle/:id" element={<IlanDuzenle />} />
        <Route path="/ilan/:id" element={<ProductDetail />} />
        <Route path="/hesabim" element={<Hesabim />} />
        <Route path="/ilanlarim" element={<Ilanlarim />} />
        <Route path="/mesajlar" element={<Mesajlar />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
