import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, Cell
} from 'recharts'
import { TrendingUp, Flame, Target, Award, Plus, ArrowRight, Utensils } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { MacroBar } from '@/components/ui/MacroBar'
import { MealCard } from '@/components/features/MealCard'
import { Skeleton, CardSkeleton, MealSkeleton } from '@/components/ui/Skeleton'
import { getTodayMeals, sumMacros, generateWeeklyData, getDecisionColor } from '@/lib/utils'
import { AnimatePresence } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
}

export function Dashboard() {
  const { profile, meals, removeMeal, setActiveTab, streak, weeklyData } = useAppStore()
  const todayMeals = getTodayMeals(meals)
  const todayTotals = sumMacros(todayMeals)
  const chartData = weeklyData.length ? weeklyData : generateWeeklyData()
  const avgScore = todayMeals.length
    ? Math.round(todayMeals.reduce((a, m) => a + (m.score ?? 50), 0) / todayMeals.length)
    : 0
  const dc = getDecisionColor(avgScore)

  const statCards = [
    {
      label: 'Calories Today',
      value: Math.round(todayTotals.calories),
      unit: 'kcal',
      target: profile.targetCalories,
      icon: Flame,
      iconBg: 'bg-gradient-to-br from-orange-400 to-red-400',
      barColor: 'bg-gradient-to-r from-orange-400 to-red-400',
      pct: Math.min((todayTotals.calories / (profile.targetCalories || 2000)) * 100, 100),
    },
    {
      label: 'Protein',
      value: Math.round(todayTotals.protein),
      unit: 'g',
      target: profile.proteinNeeds,
      icon: TrendingUp,
      iconBg: 'bg-gradient-to-br from-blue-400 to-indigo-500',
      barColor: 'bg-gradient-to-r from-blue-400 to-indigo-500',
      pct: Math.min((todayTotals.protein / (profile.proteinNeeds || 120)) * 100, 100),
    },
    {
      label: 'Avg Score',
      value: avgScore || '–',
      unit: avgScore ? '/100' : '',
      icon: Award,
      iconBg: avgScore >= 70 ? 'bg-gradient-to-br from-emerald-400 to-brand-500' : avgScore >= 40 ? 'bg-gradient-to-br from-amber-400 to-orange-400' : 'bg-gradient-to-br from-red-400 to-rose-500',
      barColor: avgScore >= 70 ? 'bg-gradient-to-r from-emerald-400 to-brand-500' : avgScore >= 40 ? 'bg-gradient-to-r from-amber-400 to-orange-400' : 'bg-gradient-to-r from-red-400 to-rose-500',
      pct: avgScore,
    },
    {
      label: 'Streak',
      value: streak.count,
      unit: 'days',
      icon: () => <span className="text-base">🔥</span>,
      iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
      barColor: 'bg-gradient-to-r from-amber-400 to-orange-400',
      pct: Math.min((streak.count / 30) * 100, 100),
    },
  ]

  return (
    <div className="space-y-5">
      {/* Welcome banner */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={0}
        className="relative overflow-hidden rounded-2xl text-white p-6"
        style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 40%, #166534 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/8 rounded-full" aria-hidden="true" />
        <div className="absolute -bottom-12 -right-4 w-56 h-56 bg-white/8 rounded-full" aria-hidden="true" />
        <div className="absolute top-4 right-16 w-20 h-20 bg-white/8 rounded-full" aria-hidden="true" />
        <div className="absolute inset-0 opacity-10 bg-noise" />
        
        <div className="relative">
        <div className="flex items-start justify-between">
            <div>
              <p className="text-green-200 text-sm font-medium">Good {getGreeting()},</p>
              <h2 className="text-2xl font-display font-bold mt-0.5 tracking-tight">
                {profile.name || 'there'} 👋
              </h2>
              <p className="text-green-200/80 text-sm mt-1.5 max-w-xs leading-relaxed">
                {todayMeals.length === 0
                  ? 'Start logging meals to get AI-powered decisions.'
                  : `${todayMeals.length} meal${todayMeals.length > 1 ? 's' : ''} logged today · ${Math.round(todayTotals.calories)} kcal consumed`
                }
              </p>
            </div>
            {todayMeals.length > 0 && (
              <div className="flex-shrink-0 text-right">
                <div className="text-3xl font-display font-bold">{avgScore || '–'}</div>
                <div className="text-green-200 text-xs font-medium">avg score</div>
              </div>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('analyzer')}
            className="mt-4 flex items-center gap-2 text-sm font-semibold bg-white/20 hover:bg-white/30 px-4 py-2.5 rounded-xl transition-colors backdrop-blur-sm border border-white/20"
          >
            <Plus className="w-4 h-4" /> Analyze Meal <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            variants={fadeUp} initial="hidden" animate="visible" custom={i + 1}
            whileHover={{ y: -2, scale: 1.01 }}
            className="glass-card rounded-2xl p-4 transition-all duration-300 cursor-default"
          >
            <div className={`w-9 h-9 ${card.iconBg} rounded-xl flex items-center justify-center mb-3 shadow-sm`}>
              <card.icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-xs text-surface-400 font-medium">{card.label}</div>
            <div className="flex items-baseline gap-0.5 mt-0.5">
              <span className="text-xl font-display font-bold text-surface-900">{card.value}</span>
              <span className="text-xs text-surface-400">{card.unit}</span>
            </div>
            {card.target && (
              <div className="text-xs text-surface-400 mt-0.5">of {card.target}{card.unit}</div>
            )}
            {card.pct > 0 && (
              <div className="mt-2.5 h-1.5 bg-surface-100 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${card.barColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${card.pct}%` }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Macros + Chart row */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* Macros */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={5}
          className="glass-card rounded-2xl p-5 lg:col-span-2 space-y-4"
        >
          <h3 className="font-display font-bold text-surface-800 text-sm tracking-tight">Today's Macros</h3>
          <MacroBar
            label="Calories"
            value={todayTotals.calories}
            max={profile.targetCalories || 2000}
            unit="kcal"
            color="bg-gradient-to-r from-orange-400 to-red-400"
          />
          <MacroBar
            label="Protein"
            value={todayTotals.protein}
            max={profile.proteinNeeds || 120}
            unit="g"
            color="bg-gradient-to-r from-blue-400 to-indigo-500"
          />
          <MacroBar
            label="Carbs"
            value={todayTotals.carbs}
            max={Math.round((profile.targetCalories || 2000) * 0.5 / 4)}
            unit="g"
            color="bg-gradient-to-r from-amber-400 to-yellow-400"
          />
          <MacroBar
            label="Fat"
            value={todayTotals.fat}
            max={Math.round((profile.targetCalories || 2000) * 0.3 / 9)}
            unit="g"
            color="bg-gradient-to-r from-rose-400 to-pink-400"
          />
        </motion.div>

        {/* Weekly chart */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={6}
          className="glass-card rounded-2xl p-5 lg:col-span-3"
        >
          <h3 className="font-display font-bold text-surface-800 text-sm mb-4 tracking-tight">Weekly Calories</h3>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="calGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                labelStyle={{ fontWeight: 600, color: '#334155' }}
              />
              <Area type="monotone" dataKey="calories" stroke="#22c55e" strokeWidth={2.5} fill="url(#calGradient)" dot={{ fill: '#22c55e', strokeWidth: 0, r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Score chart */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={7}
        className="glass-card rounded-2xl p-5"
      >
        <h3 className="font-display font-bold text-surface-800 text-sm mb-4 tracking-tight">Weekly Decision Score</h3>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.score >= 70 ? '#22c55e' : entry.score >= 40 ? '#f59e0b' : '#ef4444'}
                  opacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Today's meals */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={8}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-surface-800 tracking-tight">Today's Meals</h3>
          {todayMeals.length > 0 && (
            <span className="text-xs text-surface-400 bg-white px-2.5 py-1 rounded-full border border-surface-100 shadow-sm">{todayMeals.length} logged</span>
          )}
        </div>

        {todayMeals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-10 text-center"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="text-5xl mb-4 motion-safe:animate-bounce"
              style={{ animation: 'none' }}
            >
              🍽️
            </motion.div>
            <h4 className="font-display font-bold text-surface-700 mb-1.5">No meals logged yet</h4>
            <p className="text-sm text-surface-400 mb-5">Use the Meal Analyzer to get AI-powered decisions</p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab('analyzer')}
              className="btn-primary mx-auto"
            >
              <Plus className="w-4 h-4" /> Analyze First Meal
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {todayMeals.map((meal, i) => (
                <MealCard key={meal.id} meal={meal} onRemove={removeMeal} index={i} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
