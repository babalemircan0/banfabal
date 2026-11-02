import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Navbar from './components/Navbar.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import SayfaYukleniyor from './components/SayfaYukleniyor.jsx'

// Ana sayfa dışındaki sayfaları ayrı paketlere bölerek ilk yüklemeyi hızlandır.
const Login = lazy(() => import('./pages/Login.jsx'))
const SignUp = lazy(() => import('./pages/SignUp.jsx'))
const SifreSifirla = lazy(() => import('./pages/SifreSifirla.jsx'))
const SifreYenile = lazy(() => import('./pages/SifreYenile.jsx'))
const IlanVer = lazy(() => import('./pages/IlanVer.jsx'))
const IlanDuzenle = lazy(() => import('./pages/IlanDuzenle.jsx'))
const ProductDetail = lazy(() => import('./pages/ProductDetail.jsx'))
const Hesabim = lazy(() => import('./pages/Hesabim.jsx'))
const Ilanlarim = lazy(() => import('./pages/Ilanlarim.jsx'))
const Mesajlar = lazy(() => import('./pages/Mesajlar.jsx'))
const Yasal = lazy(() => import('./pages/Yasal.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ErrorBoundary>
        <Suspense fallback={<SayfaYukleniyor />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/giris" element={<Login />} />
            <Route path="/kayit" element={<SignUp />} />
            <Route path="/sifre-sifirla" element={<SifreSifirla />} />
            <Route path="/sifre-yenile" element={<SifreYenile />} />
            <Route path="/ilan-ver" element={<IlanVer />} />
            <Route path="/ilan-duzenle/:id" element={<IlanDuzenle />} />
            <Route path="/ilan/:id" element={<ProductDetail />} />
            <Route path="/hesabim" element={<Hesabim />} />
            <Route path="/ilanlarim" element={<Ilanlarim />} />
            <Route path="/mesajlar" element={<Mesajlar />} />
            <Route path="/kvkk" element={<Yasal tur="kvkk" />} />
            <Route path="/gizlilik" element={<Yasal tur="gizlilik" />} />
            <Route path="/kullanim-sartlari" element={<Yasal tur="kullanim-sartlari" />} />
            <Route path="/cerez-politikasi" element={<Yasal tur="cerez-politikasi" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
