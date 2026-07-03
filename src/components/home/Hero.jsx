import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowRight, BsWhatsapp } from '../ui/Icons'
import MagneticButton from '../ui/MagneticButton'
import { WHATSAPP_NUMBER } from '../../utils/helpers'
import { useTranslation } from '../../context/LanguageContext'
import samsungImage from '../../assets/Samsung-Galaxy-S25-Ultra-Titanium-Black-Premium-Smartphone-1.png'

export default function Hero() {
  const { t, lang } = useTranslation()
  const containerRef = useRef(null)
  const isArabic = lang === 'ar'

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/10 rounded-full blur-[60px] md:blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-accent/5 rounded-full blur-[50px] md:blur-[100px] animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute top-1/2 right-1/3 w-[200px] md:w-[300px] h-[200px] md:h-[300px] bg-secondary/5 rounded-full blur-[40px] md:blur-[80px] animate-float" style={{ animationDelay: '-4s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-muted mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-slow" />
              {t('hero.badge')}
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold  mb-7">
              {isArabic ? (
                <motion.span
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <span>وجهتك الممتازة</span>
                  <div className="w-13 h-0.5 mx-auto my-1 rounded-full" />
                  <span className="text-4xl md:text-5xl lg:text-6xl">للهواتف المحمولة</span>
                </motion.span>
              ) : (
                <motion.span
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <span className="text-4xl md:text-5xl lg:text-6xl">Your Premium</span>
                  <div className="w-16 h-0.5 bg-primary/60 mx-auto my-4 rounded-full" />
                  <span className="text-4xl md:text-5xl lg:text-6xl">Mobile Destination</span>
                </motion.span>
              )}
            </h1>



            <motion.p
              className="text-lg md:text-xl text-muted max-w-lg mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Link to="/products">
                <MagneticButton className="bg-primary text-white hover:glow-blue text-sm">
                  {t('hero.browseProducts')}
                  <HiArrowRight size={18} />
                </MagneticButton>
              </Link>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                <MagneticButton className="bg-white/5 text-white border border-white/10 hover:bg-white/10 text-sm">
                  <BsWhatsapp size={18} />
                  {t('hero.contactUs')}
                </MagneticButton>
              </a>
            </motion.div>
          </div>

          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 0.8 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="relative w-[280px] h-[380px] sm:w-[330px] sm:h-[440px] md:w-[380px] md:h-[490px]">
              <div
                className="absolute -inset-4 rounded-premium blur-3xl animate-float"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,123,255,0.4), rgba(0,229,255,0.25), rgba(93,169,255,0.15))',
                }}
              />
              <div
                className="relative w-full h-full rounded-premium p-[2px]"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,123,255,0.6), rgba(0,229,255,0.4), rgba(93,169,255,0.3))',
                }}
              >
                <div
                  className="w-full h-full rounded-[20px] flex items-center justify-center p-3 sm:p-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,123,255,0.12), rgba(0,229,255,0.06))',
                  }}
                >
                  <img
                    src={samsungImage}
                    alt="Samsung Galaxy S25 Ultra"
                    className="w-full h-full object-contain drop-shadow-2xl"
                    style={{
                      filter: 'drop-shadow(0 0 30px rgba(0,123,255,0.2))',
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 rounded-full bg-primary animate-bounce" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
