import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineHeart, HiHeart, HiArrowLeft, BsWhatsapp, BsShieldCheck } from '../components/ui/Icons'
import { products as initialProducts, brands } from '../data/products'
import { formatPrice, generateOrderMessage, generateWhatsAppLink, WHATSAPP_NUMBER, getStorageOptions, getRamOptions, getColorName, getMinPrice } from '../utils/helpers'
import Modal from '../components/ui/Modal'
import InstallmentForm from '../components/products/InstallmentForm'
import ReviewPopup from '../components/ui/ReviewPopup'
import { useTranslation } from '../context/LanguageContext'
import { toggleWishlist, isInWishlist } from '../utils/wishlist'
import { getStock, decrementStock } from '../utils/stock'
import { loadProducts, persistProducts, updateVariantStock } from '../utils/productStorage'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [products] = useState(() => loadProducts(initialProducts))
  const product = products.find((p) => p.id === Number(id))
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedStorage, setSelectedStorage] = useState('')
  const [selectedRam, setSelectedRam] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [installmentOpen, setInstallmentOpen] = useState(false)
  const [reviewPopupOpen, setReviewPopupOpen] = useState(false)
  const [wishlisted, setWishlisted] = useState(isInWishlist(Number(id)))
  const { t } = useTranslation()

  const handleWishlist = () => {
    toggleWishlist(product.id)
    setWishlisted(!wishlisted)
  }

  if (!product) {
    return (
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl mb-4">📱</div>
          <h1 className="text-2xl font-heading font-bold mb-4">{t('productDetails.notFound')}</h1>
          <Link to="/products" className="text-primary hover:underline">{t('productDetails.back')}</Link>
        </div>
      </main>
    )
  }

  const brand = brands.find((b) => b.id === product.brand)
  const storageOptions = getStorageOptions(product)
  const ramOptions = getRamOptions(product)
  const currentStorage = selectedStorage || storageOptions[0]
  const currentRam = selectedRam || ramOptions[0]

  const colorsForSelection = useMemo(() => {
    return [...new Set(product.variants
      .filter((v) => v.storage === currentStorage && v.ram === currentRam)
      .map((v) => v.color))]
  }, [product.variants, currentStorage, currentRam])

  const currentColor = selectedColor || colorsForSelection[0] || ''

  const currentVariant = useMemo(() => {
    return product.variants.find(
      (v) => v.storage === currentStorage && v.ram === currentRam && v.color === currentColor
    )
  }, [product.variants, currentStorage, currentRam, currentColor])

  const stockCount = currentVariant ? (getStock(`${product.id}-${currentVariant.id}`) ?? currentVariant.stock) : 0

  const displayImage = currentVariant?.image || product.images[selectedImage]
  const conditionLabel = { 'new': 'جديد', 'like-new': 'مستعمل بحالة الزيرو', 'used': 'مستعمل' }
  const conditionColor = { 'new': 'text-green-400', 'like-new': 'text-blue-400', 'used': 'text-yellow-400' }
  const conditionBg = { 'new': 'bg-green-500/10 border-green-500/30', 'like-new': 'bg-blue-500/10 border-blue-500/30', 'used': 'bg-yellow-500/10 border-yellow-500/30' }

  const handleWhatsAppOrder = () => {
    if (!currentVariant || stockCount <= 0) return
    const message = generateOrderMessage(product, currentVariant)
    decrementStock(`${product.id}-${currentVariant.id}`)
    const saved = loadProducts(initialProducts)
    persistProducts(updateVariantStock(saved, product.id, currentVariant.id, -1))
    window.open(generateWhatsAppLink(WHATSAPP_NUMBER, message), '_blank')
    setReviewPopupOpen(true)
  }

  return (
    <main className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors mb-8 text-sm"
        >
          <HiArrowLeft size={16} />
          {t('productDetails.back')}
        </Link>

        <div className="grid lg:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative rounded-premium overflow-hidden mb-4 aspect-[4/5]">
              <img
                src={displayImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {stockCount <= 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-sm font-semibold text-red-400 bg-black/80 px-4 py-2 rounded-full border border-red-500/30">
                    غير متوفر
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i && !currentVariant?.image ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
              {currentVariant?.image && (
                <button
                  className="w-20 h-20 rounded-xl overflow-hidden border-2 border-primary"
                >
                  <img src={currentVariant.image} alt="" loading="lazy" className="w-full h-full object-cover" />
                </button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 flex-wrap">
              {brand && (
                <span className="text-sm font-medium" style={{ color: brand.color }}>
                  {brand.name}
                </span>
              )}
              <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-white/10 text-muted border border-white/10">
                {{ 'phone': 'جوال', 'headphones': 'سماعات', 'watch': 'ساعة', 'accessory': 'إكسسوار' }[product.category] || product.category}
              </span>
              {currentVariant && (
                <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border ${conditionBg[currentVariant.condition] || 'bg-white/5'} ${conditionColor[currentVariant.condition] || 'text-muted'}`}>
                  {conditionLabel[currentVariant.condition]}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mt-2 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400 text-sm">
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
              </div>
              <span className="text-sm text-muted">({product.reviews} {t('productDetails.reviews')})</span>
            </div>

            <div className="flex items-baseline gap-3 mb-8">
              {currentVariant && (
                <>
                  <span className="text-3xl font-bold">{formatPrice(currentVariant.price)}</span>
                  {currentVariant.originalPrice > currentVariant.price && (
                    <span className="text-lg text-muted line-through">{formatPrice(currentVariant.originalPrice)}</span>
                  )}
                </>
              )}
            </div>

            {storageOptions.length > 1 && (
              <div className="mb-8">
                <h4 className="text-sm text-muted mb-3">{t('productDetails.storage')}</h4>
                <div className="flex flex-wrap gap-3">
                  {storageOptions.map((storage) => (
                    <button
                      key={storage}
                      onClick={() => { setSelectedStorage(storage); setSelectedColor('') }}
                      className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        currentStorage === storage
                          ? 'bg-primary text-white border border-primary'
                          : 'bg-white/5 text-muted border border-white/10 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {storage}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {ramOptions.length > 1 && (
              <div className="mb-8">
                <h4 className="text-sm text-muted mb-3">الرام</h4>
                <div className="flex flex-wrap gap-3">
                  {ramOptions.map((ram) => (
                    <button
                      key={ram}
                      onClick={() => { setSelectedRam(ram); setSelectedColor('') }}
                      className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        currentRam === ram
                          ? 'bg-primary text-white border border-primary'
                          : 'bg-white/5 text-muted border border-white/10 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {ram}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <h4 className="text-sm text-muted mb-3">{t('productDetails.color')}</h4>
              <div className="flex flex-wrap gap-3">
                {colorsForSelection.map((color) => {
                  const variant = product.variants.find(
                    (v) => v.storage === currentStorage && v.ram === currentRam && v.color === color
                  )
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        currentColor === color
                          ? 'bg-primary text-white border border-primary'
                          : 'bg-white/5 text-muted border border-white/10 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {variant?.colorName || getColorName(color)}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center gap-6 mb-8 text-sm">
              <span className="flex items-center gap-2 text-green-400">
                <BsShieldCheck size={18} />
                {t('productDetails.warranty')}
              </span>
              <span className={`flex items-center gap-2 ${stockCount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                <span className={`w-2 h-2 rounded-full ${stockCount > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
                {stockCount > 0 ? `الكمية: ${stockCount}` : 'غير متوفر'}
              </span>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={handleWhatsAppOrder}
                disabled={!currentVariant || stockCount <= 0}
                className={`flex-1 min-w-[200px] px-8 py-4 rounded-full font-medium transition-all flex items-center justify-center gap-2 ${
                  !currentVariant || stockCount <= 0
                    ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                <BsWhatsapp size={20} />
                {!currentVariant || stockCount <= 0 ? 'غير متوفر' : t('productDetails.buyNow')}
              </button>
              <button
                onClick={() => setInstallmentOpen(true)}
                className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
              >
                {t('productDetails.installment')}
              </button>
            </div>

            <div className="flex gap-2 mb-8">
              <button onClick={handleWishlist} className={`flex-1 px-6 py-3 rounded-full border flex items-center justify-center gap-2 text-sm transition-all ${
                wishlisted ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20'
              }`}>
                {wishlisted ? <HiHeart size={18} /> : <HiOutlineHeart size={18} />}
                {wishlisted ? 'في المفضلة' : t('productDetails.addToWishlist')}
              </button>
              <button onClick={() => navigate('/compare')} className="flex-1 px-6 py-3 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all flex items-center justify-center gap-2 text-sm">
                مقارنة
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-heading font-bold mb-8">{t('productDetails.specifications')}</h2>
          <div
            className="rounded-premium overflow-hidden"
            style={{
              background: 'rgba(15,17,21,0.6)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {Object.entries(product.specs).map(([key, value], i) => (
                <div
                  key={key}
                  className={`flex items-center justify-between px-6 py-4 ${
                    i % 2 === 0 ? 'bg-white/[0.02]' : ''
                  }`}
                >
                  <span className="text-sm text-muted capitalize">
                    {key === 'ram' ? 'الرام' : key === 'storage' ? 'التخزين' : key === 'display' ? 'الشاشة' : key === 'battery' ? 'البطارية' : key === 'processor' ? 'المعالج' : key === 'camera' ? 'الكاميرا' : key === 'os' ? 'نظام التشغيل' : key === 'network' ? 'الشبكة' : key}
                  </span>
                  <span className="text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <Modal isOpen={installmentOpen} onClose={() => setInstallmentOpen(false)} title="{t('productDetails.installment')}">
        {currentVariant && <InstallmentForm product={product} variant={currentVariant} onClose={() => setInstallmentOpen(false)} />}
      </Modal>

      <ReviewPopup
        isOpen={reviewPopupOpen}
        onClose={() => setReviewPopupOpen(false)}
        productName={product.name}
      />
    </main>
  )
}
