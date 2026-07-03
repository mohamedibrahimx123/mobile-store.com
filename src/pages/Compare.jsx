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
  }
  const specs = Object.keys(specLabels)

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

        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          {products.slice(0, 6).map((product) => (
            <button
              key={product.id}
              onClick={() => toggleProduct(product.id)}
              className={`px-4 py-2 rounded-full text-sm transition-all border ${
                selectedIds.includes(product.id)
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-white/5 text-muted border-white/5 hover:text-white'
              }`}
            >
              {product.name}
            </button>
          ))}
        </div>

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
                        {specLabels[spec]}
                      </td>
                      {compareProducts.map((p) => {
                        const values = compareProducts.map((cp) => cp.specs[spec])
                        const best = values.filter((v) => v !== undefined)
                        const isBest = p.specs[spec] === best.sort().slice(-1)[0]
                        return (
                          <td
                            key={p.id}
                            className={`p-4 text-sm text-center ${isBest ? 'text-primary font-medium' : ''}`}
                          >
                            {p.specs[spec]}
                            {isBest && <span className="block text-xs text-primary mt-0.5">{t('compare.best')}</span>}
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
