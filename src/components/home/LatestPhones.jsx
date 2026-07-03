import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowRight, HiOutlineHeart, HiHeart, BsWhatsapp, HiOutlineStar } from '../ui/Icons'
import SectionHeader from '../ui/SectionHeader'
import { products as initialProducts, brands } from '../../data/products'
import { formatPrice, WHATSAPP_NUMBER, generateWhatsAppLink, getMinPrice } from '../../utils/helpers'
import { useTranslation } from '../../context/LanguageContext'
import { toggleWishlist, isInWishlist } from '../../utils/wishlist'
import { getStock, decrementStock } from '../../utils/stock'
import { loadProducts, persistProducts, updateVariantStock } from '../../utils/productStorage'

const brandIcons = {
  apple: { icon: 'Apple', color: '#A2AAAD' },
  samsung: { icon: 'Samsung', color: '#1428A0' },
  oppo: { icon: 'Oppo', color: '#1A6D36' },
  realme: { icon: 'Realme', color: '#FF6A00' },
  xiaomi: { icon: 'Xiaomi', color: '#FF6900' },
  infinix: { icon: 'Infinix', color: '#E3000F' },
  huawei: { icon: 'Huawei', color: '#CF0A2C' },
  honor: { icon: 'Honor', color: '#0A0A0A' },
}

function BrandIcon({ brandId }) {
  const b = brandIcons[brandId]
  if (!b) return null
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[8px] font-bold" style={{ backgroundColor: b.color + '20', color: b.color, border: '1px solid ' + b.color + '40' }}>
      {b.icon.slice(0, 2).toUpperCase()}
    </span>
  )
}

export default function LatestPhones() {
  const { t } = useTranslation()
  const [products] = useState(() => loadProducts(initialProducts))
  const featuredPhones = products.filter((p) => p.isFeatured).slice(0, 6)

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          title={t('latestPhones.title')}
          subtitle={t('latestPhones.subtitle')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPhones.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all group"
          >
            {t('latestPhones.viewAll')}
            <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function ProductCard({ product, index }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const cardRef = useRef(null)
  const brand = brands.find((b) => b.id === product.brand)
  const [wishlisted, setWishlisted] = useState(isInWishlist(product.id))
  const minPrice = getMinPrice(product.variants)
  const firstVariant = product.variants[0]
  const variantKey = firstVariant ? `${product.id}-${firstVariant.id}` : null
  const [stockCount, setStockCount] = useState(variantKey ? (getStock(variantKey) ?? firstVariant?.stock ?? 0) : 0)
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0)
  const conditionLabel = { 'new': 'جديد', 'like-new': 'بحالة الزيرو', 'used': 'مستعمل' }
  const conditionBg = { 'new': 'bg-green-500/10 border-green-500/30 text-green-400', 'like-new': 'bg-blue-500/10 border-blue-500/30 text-blue-400', 'used': 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' }

  const handleWhatsApp = (e, product) => {
    e.stopPropagation()
    if (totalStock <= 0) return
    if (firstVariant) {
      decrementStock(`${product.id}-${firstVariant.id}`)
      const saved = loadProducts(initialProducts)
      persistProducts(updateVariantStock(saved, product.id, firstVariant.id, -1))
    }
    setStockCount(Math.max(0, stockCount - 1))
    window.open(generateWhatsAppLink(WHATSAPP_NUMBER, `Hello, I'm interested in ${product.name}`), '_blank')
  }

  const handleWishlist = (e) => {
    e.stopPropagation()
    toggleWishlist(product.id)
    setWishlisted(!wishlisted)
    navigate('/wishlist')
  }

  const handleMouseMove = (e) => {
    if ('ontouchstart' in window) return
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`
  }

  const handleMouseLeave = () => {
    const el = cardRef.current
    if (!el) return
    el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)'
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/products/${product.id}`)}
      className="group rounded-premium overflow-hidden transition-all duration-500 cursor-pointer"
      style={{
        background: 'rgba(15,17,21,0.6)',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <div
        className="relative aspect-[3/4] overflow-hidden bg-black/20 flex items-center justify-center p-4"
      >
        <img
          src={firstVariant?.image || product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain transition-all duration-700 group-hover:scale-105"
        />

        {totalStock <= 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <span className="text-sm font-semibold text-red-400 bg-black/80 px-4 py-2 rounded-full border border-red-500/30">
              غير متوفر
            </span>
          </div>
        )}
        {firstVariant?.condition && firstVariant.condition !== 'new' && (
          <span className={`absolute top-3 right-3 z-10 text-[10px] font-medium px-2 py-0.5 rounded-full border ${conditionBg[firstVariant.condition]}`}>
            {conditionLabel[firstVariant.condition]}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-4 gap-2">
          <button
            onClick={handleWishlist}
            className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
              wishlisted ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white hover:bg-primary/30'
            }`}
          >
            {wishlisted ? <HiHeart size={18} /> : <HiOutlineHeart size={18} />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate('/compare') }}
            className="px-2.5 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary/30 transition-all text-xs font-medium"
          >
            مقارنة
          </button>
          <button
            onClick={(e) => handleWhatsApp(e, product)}
            disabled={totalStock <= 0}
            className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
              totalStock <= 0
                ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            }`}
          >
            <BsWhatsapp size={18} />
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          {brand && (
            <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: brand.color }}>
              <BrandIcon brandId={brand.id} />
              {brand.name}
            </span>
          )}
          <span className="text-xs text-muted">•</span>
          <span className="text-xs text-muted">{product.specs.network}</span>
        </div>
        <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl font-bold">{formatPrice(minPrice)}</span>

        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-yellow-400 text-sm">
            <HiOutlineStar size={14} />
            <span>{product.rating}</span>
            <span className="text-muted ml-1">({product.reviews})</span>
          </div>
          {totalStock > 0 ? (
            <span className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              {t('latestPhones.inStock')}
            </span>
          ) : (
            <span className="text-xs text-red-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              {t('latestPhones.outOfStock')}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
