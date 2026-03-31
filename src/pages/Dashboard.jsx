import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, Cell
} from 'recharts'
import { TrendingUp, Flame, Target, Award, Plus, ArrowRight } from 'lucide-react'
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
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      pct: Math.min((todayTotals.calories / (profile.targetCalories || 2000)) * 100, 100),
    },
    {
      label: 'Protein',
      value: Math.round(todayTotals.protein),
      unit: 'g',
      target: profile.proteinNeeds,
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      pct: Math.min((todayTotals.protein / (profile.proteinNeeds || 120)) * 100, 100),
    },
    {
      label: 'Avg Score',
      value: avgScore || '–',
      unit: avgScore ? '/100' : '',
      icon: Award,
      color: dc.text,
      bg: dc.bg,
      pct: avgScore,
    },
    {
      label: 'Streak',
      value: streak.count,
      unit: 'days',
      icon: () => <span className="text-lg">🔥</span>,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      pct: Math.min((streak.count / 30) * 100, 100),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={0}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 text-white p-6"
      >
        <div className="absolute inset-0 opacity-10 bg-noise" />
        <div className="relative">
          <p className="text-brand-200 text-sm font-medium">Good {getGreeting()},</p>
          <h2 className="text-2xl font-display font-bold mt-0.5">
            {profile.name || 'there'} 👋
          </h2>
          <p className="text-brand-200 text-sm mt-1">
            {todayMeals.length === 0
              ? 'Start logging meals to get AI-powered decisions.'
              : `${todayMeals.length} meal${todayMeals.length > 1 ? 's' : ''} logged today · ${Math.round(todayTotals.calories)} kcal consumed`
            }
          </p>
        </div>
        <button
          onClick={() => setActiveTab('analyzer')}
          className="mt-4 flex items-center gap-1.5 text-sm font-medium bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Analyze Meal <ArrowRight className="w-3 h-3" />
        </button>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            variants={fadeUp} initial="hidden" animate="visible" custom={i + 1}
            className="glass-card rounded-2xl p-4 hover:shadow-card-hover transition-all duration-300"
          >
            <div className={`w-8 h-8 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
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
              <div className="mt-2 h-1 bg-surface-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-brand-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${card.pct}%` }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
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
          <h3 className="font-display font-bold text-surface-800 text-sm">Today's Macros</h3>
          <MacroBar
            label="Calories"
            value={todayTotals.calories}
            max={profile.targetCalories || 2000}
            unit="kcal"
            color="bg-orange-400"
          />
          <MacroBar
            label="Protein"
            value={todayTotals.protein}
            max={profile.proteinNeeds || 120}
            unit="g"
            color="bg-blue-500"
          />
          <MacroBar
            label="Carbs"
            value={todayTotals.carbs}
            max={Math.round((profile.targetCalories || 2000) * 0.5 / 4)}
            unit="g"
            color="bg-amber-400"
          />
          <MacroBar
            label="Fat"
            value={todayTotals.fat}
            max={Math.round((profile.targetCalories || 2000) * 0.3 / 9)}
            unit="g"
            color="bg-rose-400"
          />
        </motion.div>

        {/* Weekly chart */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={6}
          className="glass-card rounded-2xl p-5 lg:col-span-3"
        >
          <h3 className="font-display font-bold text-surface-800 text-sm mb-4">Weekly Calories</h3>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="calGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 12 }}
                labelStyle={{ fontWeight: 600, color: '#334155' }}
              />
              <Area type="monotone" dataKey="calories" stroke="#22c55e" strokeWidth={2} fill="url(#calGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Score chart */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={7}
        className="glass-card rounded-2xl p-5"
      >
        <h3 className="font-display font-bold text-surface-800 text-sm mb-4">Weekly Decision Score</h3>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 12 }}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.score >= 70 ? '#22c55e' : entry.score >= 40 ? '#f59e0b' : '#ef4444'}
                  opacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Today's meals */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={8}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-surface-800">Today's Meals</h3>
          {todayMeals.length > 0 && (
            <span className="text-xs text-surface-400">{todayMeals.length} logged</span>
          )}
        </div>

        {todayMeals.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">🍽️</div>
            <h4 className="font-medium text-surface-700 mb-1">No meals logged yet</h4>
            <p className="text-sm text-surface-400 mb-4">Use the Meal Analyzer to get AI-powered decisions</p>
            <button onClick={() => setActiveTab('analyzer')} className="btn-primary mx-auto">
              <Plus className="w-4 h-4" /> Analyze First Meal
            </button>
          </div>
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
