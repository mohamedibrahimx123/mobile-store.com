import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { HiX } from '../components/ui/Icons'
import SectionHeader from '../components/ui/SectionHeader'
import { products as initialProducts } from '../data/products'
import { formatPrice, getMinPrice } from '../utils/helpers'
import { useTranslation } from '../context/LanguageContext'
import { loadProducts } from '../utils/productStorage'

export default function Compare() {
  const { t } = useTranslation()
  const [products] = useState(() => loadProducts(initialProducts))
  const [selectedIds, setSelectedIds] = useState([])

  const compareProducts = useMemo(
    () => products.filter((p) => selectedIds.includes(p.id)),
    [selectedIds]
  )

  const specLabels = {
    ram: 'الرام',
    storage: 'التخزين',
    display: 'الشاشة',
    battery: 'البطارية',
    processor: 'المعالج',
    camera: 'الكاميرا',
    os: 'نظام التشغيل',
    network: 'الشبكة',
    connectivity: 'الاتصال',
    type: 'النوع',
    driverSize: 'مقاس السماعة',
    noiseCancelling: 'عزل الضوضاء',
    waterResistance: 'مقاومة الماء',
    material: 'الخامة',
    compatibility: 'التوافق',
    features: 'المميزات',
  }

  const specs = useMemo(() => {
    if (compareProducts.length === 0) return []
    const keys = new Set()
    compareProducts.forEach((p) => {
      if (p.specs) Object.keys(p.specs).forEach((k) => keys.add(k))
    })
    return Array.from(keys)
  }, [compareProducts])

  const toggleProduct = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((s) => s !== id))
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id])
    }
  }

  return (
    <main className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader title={t('compare.title')} subtitle={t('compare.subtitle')} />

        {selectedIds.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            {selectedIds.map((id) => {
              const p = products.find((pr) => pr.id === id)
              return (
                <button
                  key={id}
                  onClick={() => toggleProduct(id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-primary/10 text-primary border border-primary/20 transition-all hover:bg-primary/20"
                >
                  {p?.name}
                  <HiX size={14} />
                </button>
              )
            })}
          </div>
        )}

        {selectedIds.length < 3 && (
          <div className="mb-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {products
                .filter((p) => !selectedIds.includes(p.id))
                .map((product) => (
                  <button
                    key={product.id}
                    onClick={() => toggleProduct(product.id)}
                    className="group flex flex-col items-center gap-2 p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-black/20 flex items-center justify-center p-2">
                      <img
                        src={product.variants[0]?.image || product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <span className="text-xs text-muted group-hover:text-white text-center line-clamp-2 leading-relaxed">
                      {product.name}
                    </span>
                  </button>
                ))}
            </div>
            {products.filter((p) => !selectedIds.includes(p.id)).length === 0 && (
              <p className="text-center text-muted mt-6">{t('compare.noMore')}</p>
            )}
          </div>
        )}

        {compareProducts.length < 2 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-7xl mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/5 text-muted">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="4 22 12 6 20 22"></polygon>
              </svg>
            </div>
            <h3 className="text-2xl font-heading font-semibold mb-3">{t('compare.select')}</h3>
            <p className="text-muted">{t('compare.selectDesc')}</p>
          </motion.div>
        ) : (
          <motion.div
            className="overflow-x-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className="rounded-premium overflow-hidden min-w-[600px]"
              style={{
                background: 'rgba(15,17,21,0.6)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="p-4 text-left text-sm text-muted font-medium w-40">{t('compare.specification')}</th>
                    {compareProducts.map((p) => (
                      <th key={p.id} className="p-4 text-center">
                        <div className="relative">
                          <button
                            onClick={() => setSelectedIds(selectedIds.filter((id) => id !== p.id))}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-all"
                          >
                            <HiX size={14} />
                          </button>
                          <img src={p.variants[0]?.image || p.images[0]} alt={p.name} loading="lazy" className="w-24 h-28 object-cover rounded-xl mx-auto mb-2" />
                          <p className="text-sm font-heading font-semibold">{p.name}</p>
                          <p className="text-lg font-bold text-primary mt-1">{formatPrice(getMinPrice(p.variants))}</p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {specs.map((spec, i) => (
                    <tr key={spec} className={i % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                      <td className="p-4 text-sm text-muted">
                        {specLabels[spec] || spec}
                      </td>
                      {compareProducts.map((p) => {
                        const value = p.specs?.[spec]
                        return (
                          <td
                            key={p.id}
                            className={`p-4 text-sm text-center ${value ? '' : 'text-muted/40'}`}
                          >
                            {value || '—'}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
