import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiMenu, HiX, IoHeart, IoGitCompare } from '../ui/Icons'
import { useTranslation } from '../../context/LanguageContext'

export default function Navbar() {
  const { t, lang, toggleLang } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/products', label: t('nav.products') },
    { path: '/help-me-choose', label: t('nav.helpMeChoose') },
    { path: '/reviews', label: t('nav.reviews') },
  ]

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div
          className={`mx-auto max-w-7xl px-6 transition-all duration-500 ${
            scrolled
              ? 'bg-[rgba(5,5,5,0.8)] backdrop-blur-2xl border border-white/5 rounded-full shadow-premium'
              : 'bg-transparent'
          }`}
          style={scrolled ? { padding: '0.5rem 1.5rem' } : {}}
        >
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-heading font-bold text-sm">MS</span>
              </div>
              <span className="font-heading font-semibold text-lg hidden sm:block">
                Premium<span className="text-primary">Store</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'bg-white/10 text-white'
                      : 'text-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/wishlist"
                className="w-10 h-10 rounded-full flex items-center justify-center text-muted hover:text-white hover:bg-white/5 transition-all"
              >
                <IoHeart size={20} />
              </Link>
              <Link
                to="/compare"
                className="w-10 h-10 rounded-full flex items-center justify-center text-muted hover:text-white hover:bg-white/5 transition-all"
              >
                <IoGitCompare size={20} />
              </Link>
              <button onClick={toggleLang} className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium text-muted hover:text-white hover:bg-white/5 transition-all border border-white/10">
                {lang === 'ar' ? 'EN' : 'ع'}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-muted hover:text-white hover:bg-white/5 transition-all"
              >
                {mobileOpen ? <HiX size={22} /> : <HiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {mobileOpen && (
        <motion.div
          className="fixed inset-0 z-30 bg-dark/95 backdrop-blur-xl pt-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex flex-col items-center gap-4 p-6">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={link.path}
                  className={`text-2xl font-heading font-semibold transition-colors ${
                    location.pathname === link.path ? 'text-primary' : 'text-white hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </>
  )
}
