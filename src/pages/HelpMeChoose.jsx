import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiArrowLeft } from '../components/ui/Icons'
import { Link } from 'react-router-dom'
import SectionHeader from '../components/ui/SectionHeader'
import { products as initialProducts } from '../data/products'
import { formatPrice, getMinPrice } from '../utils/helpers'
import { loadProducts } from '../utils/productStorage'

const usageSpecMap = {
  gaming: 'processor',
  camera: 'camera',
  battery: 'battery',
  work: 'ram',
  normal: 'storage',
}

export default function HelpMeChoose() {
  const questions = [
    {
      id: 'budget',
      question: 'ما هي ميزانيتك؟',
      options: [
        { label: 'أقل من ٢٠,٠٠٠ ج.م', value: 'low', min: 0, max: 20000 },
        { label: '٢٠,٠٠٠ - ٣٥,٠٠٠ ج.م', value: 'medium', min: 20000, max: 35000 },
        { label: '٣٥,٠٠٠ - ٥٥,٠٠٠ ج.م', value: 'high', min: 35000, max: 55000 },
        { label: 'أعلى من ٥٥,٠٠٠ ج.م', value: 'premium', min: 55000, max: Infinity },
      ],
    },
    {
      id: 'usage',
      question: 'ما هو الاستخدام الأساسي؟',
      options: [
        { label: '🎮 ألعاب', value: 'gaming' },
        { label: '📸 تصوير', value: 'camera' },
        { label: '🔋 بطارية', value: 'battery' },
        { label: '💼 عمل', value: 'work' },
        { label: '📱 استخدام عام', value: 'normal' },
      ],
    },
    {
      id: 'os',
      question: 'ما هو نظام التشغيل المفضل؟',
      options: [
        { label: 'iOS (آيفون)', value: 'ios' },
        { label: 'أندرويد', value: 'android' },
        { label: 'لا يوجد تفضيل', value: 'both' },
      ],
    },
    {
      id: 'network',
      question: 'هل تحتاج دعم 5G؟',
      options: [
        { label: 'نعم، أحتاج 5G', value: 'yes' },
        { label: 'ليس ضرورياً', value: 'no' },
      ],
    },
    {
      id: 'screen',
      question: 'ما هو حجم الشاشة المفضل؟',
      options: [
        { label: 'صغيرة (أقل من ٦.٥ بوصة)', value: 'small', min: 0, max: 6.5 },
        { label: 'متوسطة (٦.٥ - ٦.٨ بوصة)', value: 'medium', min: 6.5, max: 6.8 },
        { label: 'كبيرة (أكثر من ٦.٨ بوصة)', value: 'large', min: 6.8, max: Infinity },
        { label: 'لا يهم', value: 'any' },
      ],
    },
    {
      id: 'storage',
      question: 'ما هي سعة التخزين التي تحتاجها؟',
      options: [
        { label: '١٢٨ جيجابايت', value: '128' },
        { label: '٢٥٦ جيجابايت', value: '256' },
        { label: '٥١٢ جيجابايت أو أكثر', value: '512' },
        { label: 'لا يهم', value: 'any' },
      ],
    },
  ]
  const [products] = useState(() => loadProducts(initialProducts))
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [questions[step].id]: value })
    if (step < questions.length - 1) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const reset = () => {
    setStep(0)
    setAnswers({})
  }

  const recommendations = useMemo(() => {
    if (Object.keys(answers).length < questions.length) return []

    let filtered = [...products]

    const budgetField = questions[0].options.find((o) => o.value === answers.budget)
    if (budgetField) {
      filtered = filtered.filter((p) => {
        const minPrice = getMinPrice(p.variants)
        return minPrice >= budgetField.min && minPrice <= budgetField.max
      })
    }

    if (answers.os === 'ios') {
      filtered = filtered.filter((p) => p.specs.os.includes('iOS'))
    } else if (answers.os === 'android') {
      filtered = filtered.filter((p) => p.specs.os.includes('Android'))
    }

    if (answers.network === 'yes') {
      filtered = filtered.filter((p) => p.specs.network === '5G')
    }

    if (answers.screen === 'small') {
      filtered = filtered.filter((p) => {
        const size = parseFloat(p.specs.display)
        return !isNaN(size) && size < 6.5
      })
    } else if (answers.screen === 'medium') {
      filtered = filtered.filter((p) => {
        const size = parseFloat(p.specs.display)
        return !isNaN(size) && size >= 6.5 && size <= 6.8
      })
    } else if (answers.screen === 'large') {
      filtered = filtered.filter((p) => {
        const size = parseFloat(p.specs.display)
        return !isNaN(size) && size > 6.8
      })
    }

    if (answers.storage !== 'any') {
      filtered = filtered.filter((p) => {
        const storageGB = parseInt(p.specs.storage)
        const needed = parseInt(answers.storage)
        return !isNaN(storageGB) && storageGB >= needed
      })
    }

    const usageSpec = usageSpecMap[answers.usage]
    if (usageSpec) {
      filtered.sort((a, b) => {
        const aVal = a.specs[usageSpec]?.length || 0
        const bVal = b.specs[usageSpec]?.length || 0
        return bVal - aVal
      })
    }

    return filtered.slice(0, 3)
  }, [answers])

  if (Object.keys(answers).length === questions.length) {
    return (
      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <SectionHeader
              title="وجدنا لك المطابقة المثالية!"
              subtitle="بناءً على تفضيلاتك، هذه أفضل توصياتنا"
            />

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {recommendations.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-premium overflow-hidden"
                  style={{
                    background: 'rgba(15,17,21,0.6)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <Link to={`/products/${product.id}`}>
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={product.variants[0]?.image || product.images[0]} alt={product.name} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                  </Link>
                  <div className="p-5">
                    <Link to={`/products/${product.id}`}>
                      <h3 className="font-heading font-semibold mb-2 hover:text-primary transition-colors">{product.name}</h3>
                    </Link>
                    <p className="text-lg font-bold mb-1">{formatPrice(getMinPrice(product.variants))}</p>
                    <div className="flex text-yellow-400 text-xs mb-3">
                      {'★'.repeat(Math.floor(product.rating))}
                      <span className="text-muted ml-1">({product.reviews})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-xs text-muted">{product.specs.ram}</span>
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-xs text-muted">{product.specs.storage}</span>
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-xs text-muted">{product.specs.processor?.split(' ')[0]}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {recommendations.length === 0 && (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">😕</div>
                <p className="text-muted mb-4">لا توجد منتجات تطابق معاييرك بالضبط. جرب تعديل تفضيلاتك.</p>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={reset}
                className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
              >
                ابدأ من جديد
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-32 pb-24">
      <div className="max-w-2xl mx-auto px-6">
        <SectionHeader title="ساعدني في الاختيار" subtitle="أجب على الأسئلة التالية وسنجد لك الهاتف المثالي" />
        <div className="flex items-center justify-center gap-2 mb-12" dir="ltr">
          {questions.map((q, i) => (
            <div key={q.id} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                  i <= step ? 'bg-primary text-white' : 'bg-white/5 text-muted'
                }`}
              >
                {i + 1}
              </div>
              {i < questions.length - 1 && (
                <div
                  className={`w-8 h-0.5 transition-all ${
                    i < step ? 'bg-primary' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-8">
              {questions[step].question}
            </h2>

            <div className="space-y-3">
              {questions[step].options.map((option, i) => (
                <motion.button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full p-4 rounded-xl text-right transition-all group"
                  style={{
                    background: 'rgba(15,17,21,0.6)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                  whileHover={{ scale: 1.01, borderColor: 'rgba(0,123,255,0.3)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <span className="font-medium">{option.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {step > 0 && (
          <button
            onClick={handleBack}
            className="mt-8 inline-flex items-center gap-2 text-muted hover:text-white transition-colors"
          >
            <HiArrowLeft size={16} />
            رجوع
          </button>
        )}
      </div>
    </main>
  )
}
