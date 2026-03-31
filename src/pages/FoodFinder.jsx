import { motion } from 'framer-motion'
import { MapPin, ExternalLink, Search, Star, Clock, Leaf, Dumbbell } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

const HEALTHY_CUISINES = [
  { name: 'Salad Bowls', emoji: '🥗', query: 'salad bowl restaurant near me', desc: 'Fresh greens, grains, proteins' },
  { name: 'Protein Café', emoji: '🍳', query: 'health food cafe near me', desc: 'High-protein meals & shakes' },
  { name: 'Smoothie Bar', emoji: '🥤', query: 'smoothie bar near me', desc: 'Nutrient-dense drinks' },
  { name: 'Vegan Food', emoji: '🌱', query: 'vegan restaurant near me', desc: 'Plant-based goodness' },
  { name: 'Grain Bowls', emoji: '🍚', query: 'grain bowl restaurant near me', desc: 'Complex carbs & fiber' },
  { name: 'Juice Bar', emoji: '🍊', query: 'juice bar near me', desc: 'Cold-pressed nutrition' },
]

const FOOD_TIPS = [
  { icon: '🎯', title: 'Order First, Sides Later', desc: 'Choose your main protein dish first, then add sides. Prevents defaulting to comfort food.' },
  { icon: '💧', title: 'Water Before Eating', desc: 'Drink a glass of water 20 minutes before. Reduces appetite by up to 13%.' },
  { icon: '🥗', title: 'Salad-First Rule', desc: 'Start with a salad or vegetables. Fills you up and slows glucose absorption.' },
  { icon: '📏', title: 'Half-Plate Rule', desc: 'Fill half your plate with vegetables, a quarter protein, a quarter complex carbs.' },
  { icon: '🚫', title: 'Avoid Liquid Calories', desc: 'Skip sugary drinks. Choose water, lassi (unsweetened), or buttermilk.' },
  { icon: '⏰', title: 'Eat Slowly', desc: 'It takes 20 minutes for fullness signals. Eating slow prevents overeating by 20%.' },
]

export function FoodFinder() {
  const { profile } = useAppStore()

  const openMaps = (query) => {
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank')
  }

  const openNearMe = () => {
    window.open('https://www.google.com/maps/search/healthy+food+near+me', '_blank')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white"
      >
        <div className="absolute top-0 right-0 text-8xl opacity-10 -translate-y-2 translate-x-2">🗺️</div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4" />
            <span className="text-emerald-200 text-sm font-medium">Smart Food Finder</span>
          </div>
          <h2 className="text-2xl font-display font-bold mb-1">Find Healthy Food Near You</h2>
          <p className="text-emerald-200 text-sm">
            {profile.goal === 'lose' ? 'Discover calorie-smart, protein-rich options nearby.'
              : profile.goal === 'gain' ? 'High-calorie, nutritious restaurants for muscle gain.'
              : 'Balanced, nutritious eateries matching your lifestyle.'}
          </p>
          <button
            onClick={openNearMe}
            className="mt-4 flex items-center gap-2 bg-white text-emerald-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors shadow-sm"
          >
            <Search className="w-4 h-4" />
            Open Google Maps
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* Cuisine filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-5"
      >
        <h3 className="font-display font-bold text-surface-800 text-sm mb-3">Search by Category</h3>
        <div className="grid grid-cols-2 gap-2">
          {HEALTHY_CUISINES.map(c => (
            <motion.button
              key={c.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openMaps(c.query)}
              className="flex items-start gap-3 p-3 bg-surface-50 hover:bg-brand-50 border border-surface-200 hover:border-brand-200 rounded-xl text-left transition-all duration-200 group"
            >
              <span className="text-2xl mt-0.5">{c.emoji}</span>
              <div>
                <div className="text-sm font-semibold text-surface-700 group-hover:text-brand-700">{c.name}</div>
                <div className="text-xs text-surface-400">{c.desc}</div>
              </div>
              <ExternalLink className="w-3 h-3 text-surface-300 group-hover:text-brand-400 ml-auto mt-0.5 flex-shrink-0" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Indian healthy options */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card rounded-2xl p-5"
      >
        <h3 className="font-display font-bold text-surface-800 text-sm mb-1">🇮🇳 Healthy Indian Options</h3>
        <p className="text-xs text-surface-400 mb-3">Smart choices at common Indian food spots</p>
        <div className="space-y-2">
          {[
            { place: 'Subway / Wrap cafés', pick: 'Grilled chicken sub, extra veggies, mustard sauce', avoid: 'Cookies, extra cheese', score: 75, icon: '🥪' },
            { place: 'South Indian restaurant', pick: 'Idli sambhar, rasam, plain dosa', avoid: 'Masala dosa with extra ghee, vada', score: 80, icon: '🫓' },
            { place: 'North Indian dhaba', pick: 'Dal tadka, roti (2), raita, salad', avoid: 'Naan, paneer makhani, lassi', score: 68, icon: '🍛' },
            { place: 'Street food', pick: 'Boiled chana chat, sprouts bhel, corn', avoid: 'Samosa, pav bhaji, vada pav', score: 55, icon: '🌽' },
            { place: 'Juice / cafe', pick: 'Watermelon juice (no sugar), plain lassi', avoid: 'Mango milkshake, packed juices', score: 70, icon: '🥤' },
          ].map(item => (
            <div key={item.place} className="p-3 bg-surface-50 rounded-xl border border-surface-100">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <span className="text-sm font-semibold text-surface-700">{item.place}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  item.score >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {item.score}/100
                </span>
              </div>
              <div className="flex gap-3 text-xs">
                <div className="flex-1">
                  <span className="text-emerald-600 font-medium">✓ Best: </span>
                  <span className="text-surface-600">{item.pick}</span>
                </div>
              </div>
              <div className="text-xs mt-0.5">
                <span className="text-red-500 font-medium">✗ Skip: </span>
                <span className="text-surface-500">{item.avoid}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Smart eating tips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-5"
      >
        <h3 className="font-display font-bold text-surface-800 text-sm mb-3">💡 Smart Eating Out Tips</h3>
        <div className="grid grid-cols-1 gap-2">
          {FOOD_TIPS.map(tip => (
            <div key={tip.title} className="flex gap-3 p-3 hover:bg-surface-50 rounded-xl transition-colors">
              <span className="text-lg flex-shrink-0">{tip.icon}</span>
              <div>
                <div className="text-sm font-semibold text-surface-700">{tip.title}</div>
                <div className="text-xs text-surface-400 mt-0.5">{tip.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
