import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineHeart, HiHeart, BsWhatsapp } from '../components/ui/Icons'
import { useTranslation } from '../context/LanguageContext'
import SectionHeader from '../components/ui/SectionHeader'
import { products as initialProducts } from '../data/products'
import { formatPrice, generateWhatsAppLink, WHATSAPP_NUMBER, getMinPrice } from '../utils/helpers'
import { getWishlist, toggleWishlist } from '../utils/wishlist'
import { decrementStock } from '../utils/stock'
import { loadProducts, persistProducts, updateVariantStock } from '../utils/productStorage'

export default function Wishlist() {
  const { t } = useTranslation()
  const [products] = useState(() => loadProducts(initialProducts))
  const [wishlistIds, setWishlistIds] = useState(getWishlist())
  const wishlistItems = products.filter((p) => wishlistIds.includes(p.id))

  useEffect(() => {
    setWishlistIds(getWishlist())
  }, [])

  const handleRemove = (id) => {
    toggleWishlist(id)
    setWishlistIds(getWishlist())
  }

  return (
    <main className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader title={t('wishlist.title')} subtitle={t('wishlist.subtitle')} />

        {wishlistItems.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-7xl mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/5">
              <HiOutlineHeart size={40} className="text-muted" />
            </div>
            <h3 className="text-2xl font-heading font-semibold mb-3">{t('wishlist.empty')}</h3>
            <p className="text-muted mb-8 max-w-md mx-auto">
              {t('wishlist.emptyDesc')}
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white hover:glow-blue transition-all"
            >
              {t('wishlist.browse')}
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-premium overflow-hidden"
                style={{
                  background: 'rgba(15,17,21,0.6)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <Link to={`/products/${product.id}`}>
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={product.variants[0]?.image || product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </Link>
                <div className="p-5">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-heading font-semibold mb-2 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-lg font-bold mb-3">{formatPrice(getMinPrice(product.variants))}</p>
                  <div className="flex items-center gap-2">
                    {product.variants.every((v) => v.stock <= 0) ? (
                      <span className="flex-1 px-4 py-2.5 rounded-full bg-gray-500/10 text-gray-500 text-xs font-medium flex items-center justify-center gap-2 cursor-not-allowed">
                        غير متوفر
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          const firstVariant = product.variants[0]
                          if (firstVariant) {
                            decrementStock(`${product.id}-${firstVariant.id}`)
                            const saved = loadProducts(initialProducts)
                            persistProducts(updateVariantStock(saved, product.id, firstVariant.id, -1))
                          }
                          window.open(generateWhatsAppLink(WHATSAPP_NUMBER, `Hello, I'm interested in ${product.name}`), '_blank')
                        }}
                        className="flex-1 px-4 py-2.5 rounded-full bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                      >
                        <BsWhatsapp size={15} />
                        اشتري الآن
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      <HiHeart size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
