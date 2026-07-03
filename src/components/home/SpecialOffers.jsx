import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowRight } from '../ui/Icons'
import { useTranslation } from '../../context/LanguageContext'

export default function SpecialOffers() {
  const { t } = useTranslation()
  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 8,
    minutes: 45,
    seconds: 30,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-24 relative">
      {/* <div className="max-w-7xl mx-auto px-6">
        <div
          className="relative rounded-premium overflow-hidden p-12 md:p-20"
          style={{
            background: 'linear-gradient(135deg, rgba(0,123,255,0.1), rgba(0,229,255,0.05))',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-primary/10 rounded-full blur-[50px] md:blur-[100px] animate-float" />
            <div className="absolute bottom-0 left-0 w-[200px] md:w-[300px] h-[200px] md:h-[300px] bg-accent/5 rounded-full blur-[40px] md:blur-[80px] animate-float" style={{ animationDelay: '-3s' }} />
          </div>

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse-slow" />
                {t('specialOffers.badge')}
              </motion.div>

              <motion.h2
                className="text-4xl md:text-5xl font-heading font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                {t('specialOffers.title')}
                <br />
                <span className="gradient-text">{t('specialOffers.titleHighlight')}</span>
              </motion.h2>

              <motion.p
                className="text-muted text-lg mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                {t('specialOffers.subtitle')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white hover:glow-blue transition-all group"
                >
                  {t('specialOffers.cta')}
                  <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="grid grid-cols-4 gap-4">
                {Object.entries(timeLeft).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div
                      className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-heading font-bold"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {String(value).padStart(2, '0')}
                    </div>
                    <p className="text-xs text-muted mt-2 capitalize">{t(`specialOffers.${key}`)}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div> */}
    </section>
  )
}
