import { useState, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiAdjustments, HiX, HiOutlineHeart, HiHeart, BsWhatsapp } from '../components/ui/Icons'
import SectionHeader from '../components/ui/SectionHeader'
import { products as initialProducts, brands } from '../data/products'
import { formatPrice, WHATSAPP_NUMBER, generateWhatsAppLink, getMinPrice } from '../utils/helpers'
import { useTranslation } from '../context/LanguageContext'
import { toggleWishlist, isInWishlist } from '../utils/wishlist'
import { getStock, decrementStock } from '../utils/stock'
import { loadProducts, persistProducts, updateVariantStock } from '../utils/productStorage'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products] = useState(() => loadProducts(initialProducts))
  const [search, setSearch] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState({
    brand: searchParams.get('brand') || '',
    category: '',
    priceRange: '',
    ram: '',
    storage: '',
    os: '',
    availability: '',
    sort: 'newest',
  })

  const { t } = useTranslation()
  const sortOptions = [
    { value: 'newest', label: t('products.newest') },
    { value: 'cheapest', label: t('products.cheapest') },
    { value: 'expensive', label: t('products.expensive') },
    { value: 'bestselling', label: t('products.bestselling') },
  ]

  const priceRanges = [
    { label: t('products.priceRanges.under'), value: '0-20000' },
    { label: t('products.priceRanges.mid'), value: '20000-35000' },
    { label: t('products.priceRanges.high'), value: '35000-50000' },
    { label: t('products.priceRanges.premium'), value: '50000-999999' },
  ]

  const ramOptions = ['8GB', '12GB', '16GB']
  const storageOptions = ['128GB', '256GB', '512GB']
  const osOptions = ['iOS', 'Android']

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (filters.brand) {
      result = result.filter((p) => p.brand === filters.brand)
    }
    if (filters.category) {
      result = result.filter((p) => (p.category || 'phone') === filters.category)
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number)
      result = result.filter((p) => {
        const minPrice = getMinPrice(p.variants)
        return minPrice >= min && minPrice <= max
      })
    }
    if (filters.ram) {
      result = result.filter((p) => p.specs.ram === filters.ram)
    }
    if (filters.storage) {
      result = result.filter((p) => p.specs.storage === filters.storage)
    }
    if (filters.os) {
      result = result.filter((p) =>
        filters.os === 'iOS' ? p.specs.os.includes('iOS') : p.specs.os.includes('Android')
      )
    }
    if (filters.availability === 'available') {
      result = result.filter((p) => p.available)
    } else if (filters.availability === 'unavailable') {
      result = result.filter((p) => !p.available)
    }

    switch (filters.sort) {
      case 'cheapest':
        result.sort((a, b) => getMinPrice(a.variants) - getMinPrice(b.variants))
        break
      case 'expensive':
        result.sort((a, b) => getMinPrice(b.variants) - getMinPrice(a.variants))
        break
      case 'bestselling':
        result.sort((a, b) => b.reviews - a.reviews)
        break
      default:
        break
    }

    return result
  }, [search, filters])

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      brand: '',
      category: '',
      priceRange: '',
      ram: '',
      storage: '',
      os: '',
      availability: '',
      sort: 'newest',
    })
    setSearch('')
    setSearchParams({})
  }

  const hasFilters = Object.values(filters).some((v) => v) || search

  return (
    <main className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          title={t('products.title')}
          subtitle={t('products.subtitle')}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div
            className={`lg:w-80 flex-shrink-0 ${filtersOpen ? 'block' : 'hidden'} lg:block`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div
              className="sticky top-28 rounded-premium p-6"
              style={{
                background: 'rgba(15,17,21,0.6)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-semibold">{t('products.filters')}</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-primary hover:underline">
                    {t('products.clearAll')}
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm text-muted mb-3">{t('products.brand')}</h4>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => updateFilter('brand', filters.brand === brand.id ? '' : brand.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          filters.brand === brand.id
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'text-muted hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        {brand.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-muted mb-3">التصنيف</h4>
                  <div className="space-y-2">
                    {[
                      { id: 'phone', label: 'جوال' },
                      { id: 'headphones', label: 'سماعات' },
                      { id: 'watch', label: 'ساعة' },
                      { id: 'accessory', label: 'إكسسوار' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => updateFilter('category', filters.category === cat.id ? '' : cat.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          filters.category === cat.id
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'text-muted hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-muted mb-3">{t('products.priceRange')}</h4>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.value}
                        onClick={() => updateFilter('priceRange', filters.priceRange === range.value ? '' : range.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          filters.priceRange === range.value
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'text-muted hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-muted mb-3">{t('products.ram')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {ramOptions.map((ram) => (
                      <button
                        key={ram}
                        onClick={() => updateFilter('ram', filters.ram === ram ? '' : ram)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          filters.ram === ram
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'text-muted hover:text-white hover:bg-white/5 border border-white/5'
                        }`}
                      >
                        {ram}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-muted mb-3">{t('products.storage')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {storageOptions.map((storage) => (
                      <button
                        key={storage}
                        onClick={() => updateFilter('storage', filters.storage === storage ? '' : storage)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          filters.storage === storage
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'text-muted hover:text-white hover:bg-white/5 border border-white/5'
                        }`}
                      >
                        {storage}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-muted mb-3">{t('products.os')}</h4>
                  <div className="space-y-2">
                    {osOptions.map((os) => (
                      <button
                        key={os}
                        onClick={() => updateFilter('os', filters.os === os ? '' : os)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          filters.os === os
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'text-muted hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        {os}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-muted mb-3">{t('products.availability')}</h4>
                  <div className="space-y-2">
                    {[
                      { label: t('products.inStock'), value: 'available' },
                      { label: t('products.outOfStock'), value: 'unavailable' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => updateFilter('availability', filters.availability === opt.value ? '' : opt.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          filters.availability === opt.value
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'text-muted hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={t('products.searchPlaceholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 transition-all text-sm"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="lg:hidden px-5 py-3.5 rounded-full bg-white/5 border border-white/10 text-muted hover:text-white hover:bg-white/10 transition-all"
                >
                    <HiAdjustments size={20} />
                  </button>
                  <span className="text-sm text-muted mr-2">{t('products.sort')}</span>
                  <select
                  value={filters.sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="px-5 py-3.5 rounded-full bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all text-sm appearance-none cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-dark">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: '', label: 'الكل' },
                { id: 'phone', label: 'جوال' },
                { id: 'headphones', label: 'سماعات' },
                { id: 'watch', label: 'ساعة' },
                { id: 'accessory', label: 'إكسسوار' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateFilter('category', cat.id)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    filters.category === cat.id
                      ? 'bg-primary text-white'
                      : 'bg-white/5 text-muted border border-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="text-6xl mb-4">📱</div>
                  <h3 className="text-xl font-heading font-semibold mb-2">{t('products.noProducts')}</h3>
                  <p className="text-muted">{t('products.noProductsDesc')}</p>
                </motion.div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {filteredProducts.map((product, i) => (
                    <ProductListItem key={product.id} product={product} index={i} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  )
}

function ProductListItem({ product, index }) {
  const brand = brands.find((b) => b.id === product.brand)
  const navigate = useNavigate()
  const [wishlisted, setWishlisted] = useState(isInWishlist(product.id))
  const minPrice = getMinPrice(product.variants)
  const firstVariant = product.variants[0]
  const variantKey = firstVariant ? `${product.id}-${firstVariant.id}` : null
  const conditionLabel = { 'new': 'جديد', 'like-new': 'بحالة الزيرو', 'used': 'مستعمل' }
  const conditionBg = { 'new': 'bg-green-500/10 border-green-500/30 text-green-400', 'like-new': 'bg-blue-500/10 border-blue-500/30 text-blue-400', 'used': 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' }
  const [stockCount, setStockCount] = useState(variantKey ? (getStock(variantKey) ?? firstVariant?.stock ?? 0) : 0)
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0)

  const handleWhatsApp = (e, product) => {
    e.preventDefault()
    e.stopPropagation()
    if (totalStock <= 0) return
    if (firstVariant) {
      decrementStock(`${product.id}-${firstVariant.id}`)
      const savedProducts = loadProducts(initialProducts)
      const updated = updateVariantStock(savedProducts, product.id, firstVariant.id, -1)
      persistProducts(updated)
    }
    setStockCount(Math.max(0, stockCount - 1))
    window.open(generateWhatsAppLink(WHATSAPP_NUMBER, `Hello, I'm interested in ${product.name}`), '_blank')
  }

  const handleWishlist = () => {
    toggleWishlist(product.id)
    setWishlisted(!wishlisted)
    navigate('/wishlist')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group rounded-premium overflow-hidden transition-all duration-500"
      style={{
        background: 'rgba(15,17,21,0.6)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <Link to={`/products/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-black/20 flex items-center justify-center p-4">
          <img
            src={firstVariant?.image || product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain transition-all duration-700 group-hover:scale-105"
          />

          {totalStock <= 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-sm font-semibold text-red-400 bg-black/80 px-4 py-2 rounded-full border border-red-500/30">
                غير متوفر
              </span>
            </div>
          )}
          {firstVariant?.condition && firstVariant.condition !== 'new' && (
            <span className={`absolute top-3 right-3 text-[10px] font-medium px-2 py-0.5 rounded-full border ${conditionBg[firstVariant.condition]}`}>
              {conditionLabel[firstVariant.condition]}
            </span>
          )}
        </div>
      </Link>
      <div className="p-5">
        {brand && (
          <span className="text-xs text-muted" style={{ color: brand.color }}>
            {brand.name}
          </span>
        )}
        <Link to={`/products/${product.id}`}>
          <h3 className="font-heading font-semibold text-base mt-1 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold">{formatPrice(minPrice)}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-yellow-400 text-xs">
            {'★'.repeat(Math.floor(product.rating))}
            <span className="text-muted ml-1">({product.reviews})</span>
          </div>
          <div className="flex gap-1.5">
            <button onClick={handleWishlist} className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              wishlisted ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-muted hover:text-red-400 hover:bg-red-500/10'
            }`}>
              {wishlisted ? <HiHeart size={13} /> : <HiOutlineHeart size={13} />}
            </button>
            <button onClick={() => navigate('/compare')} className="px-2 h-7 rounded-full bg-white/5 flex items-center justify-center text-muted hover:text-primary hover:bg-primary/10 transition-all text-[10px] font-medium">
              مقارنة
            </button>
            <button
              onClick={(e) => handleWhatsApp(e, product)}
              disabled={totalStock <= 0}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                totalStock <= 0
                  ? 'bg-gray-500/10 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
              }`}
            >
              <BsWhatsapp size={13} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
