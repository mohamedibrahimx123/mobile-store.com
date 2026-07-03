import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Lenis from 'lenis'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Wishlist from './pages/Wishlist'
import Compare from './pages/Compare'
import HelpMeChoose from './pages/HelpMeChoose'
import Reviews from './pages/Reviews'
import Admin from './pages/admin/Admin'

function App() {
  const location = useLocation()

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window
    if (isMobile) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      smoothWheel: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen bg-dark text-white font-body">
      {!isAdmin && <Navbar />}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/help-me-choose" element={<HelpMeChoose />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
      {!isAdmin && <Footer />}
    </div>
  )
}

export default App
