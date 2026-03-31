import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function calculateBMR(weight, height, age, gender = 'male') {
  // Mifflin-St Jeor
  if (gender === 'male') return Math.round(10 * weight + 6.25 * height - 5 * age + 5)
  return Math.round(10 * weight + 6.25 * height - 5 * age - 161)
}

export function calculateTDEE(bmr, activityLevel = 'moderate') {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }
  return Math.round(bmr * (multipliers[activityLevel] || 1.55))
}

export function calculateTargetCalories(tdee, goal) {
  if (goal === 'lose') return Math.round(tdee - 500)
  if (goal === 'gain') return Math.round(tdee + 300)
  return tdee
}

export function calculateProteinNeeds(weight, goal) {
  if (goal === 'gain') return Math.round(weight * 2.2)
  if (goal === 'lose') return Math.round(weight * 2.0)
  return Math.round(weight * 1.6)
}

export function getDecisionColor(score) {
  if (score >= 70) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Great Choice', icon: '🟢', ring: '#22c55e' }
  if (score >= 40) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Okay Choice', icon: '🟡', ring: '#f59e0b' }
  return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Not Ideal', icon: '🔴', ring: '#ef4444' }
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', { 
    day: '2-digit', month: 'short', year: 'numeric' 
  }).format(new Date(date))
}

export function getToday() {
  return new Date().toISOString().split('T')[0]
}

export function getTodayMeals(meals) {
  const today = getToday()
  return meals.filter(m => m.date === today)
}

export function sumMacros(meals) {
  return meals.reduce((acc, meal) => ({
    calories: acc.calories + (meal.calories || 0),
    protein: acc.protein + (meal.protein || 0),
    carbs: acc.carbs + (meal.carbs || 0),
    fat: acc.fat + (meal.fat || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 })
}

export function getMealTypeByTime() {
  const h = new Date().getHours()
  if (h < 10) return 'Breakfast'
  if (h < 13) return 'Brunch'
  if (h < 16) return 'Lunch'
  if (h < 19) return 'Snack'
  return 'Dinner'
}

// Demo data
export const DEMO_PROFILE = {
  name: 'Arjun Mehta',
  age: 25,
  weight: 72,
  height: 175,
  gender: 'male',
  goal: 'lose',
  activityLevel: 'moderate',
  dietType: 'vegetarian',
}

export const DEMO_MEALS = [
  {
    id: 'demo1',
    name: 'Oatmeal with banana',
    calories: 320,
    protein: 12,
    carbs: 58,
    fat: 6,
    score: 82,
    decision: 'Great Choice',
    reason: 'Excellent fiber and slow-releasing carbs for sustained energy.',
    suggestion: 'Add a scoop of protein powder for an extra 20g protein.',
    goalAligned: true,
    mealType: 'Breakfast',
    date: getToday(),
    timestamp: Date.now() - 7200000,
  },
  {
    id: 'demo2',
    name: 'Paneer tikka with roti',
    calories: 480,
    protein: 28,
    carbs: 42,
    fat: 18,
    score: 74,
    decision: 'Great Choice',
    reason: 'High protein paneer supports muscle retention during fat loss.',
    suggestion: 'Replace one roti with salad to cut 80 calories.',
    goalAligned: true,
    mealType: 'Lunch',
    date: getToday(),
    timestamp: Date.now() - 3600000,
  },
  {
    id: 'demo3',
    name: 'Samosa (2 pieces)',
    calories: 360,
    protein: 6,
    carbs: 44,
    fat: 18,
    score: 32,
    decision: 'Not Ideal',
    reason: 'Deep-fried, high fat, and low protein — doesn\'t align with fat loss goal.',
    suggestion: 'Opt for baked tikki or boiled chana chat instead.',
    goalAligned: false,
    mealType: 'Snack',
    date: getToday(),
    timestamp: Date.now() - 1800000,
  },
  {
    id: 'demo4',
    name: 'Dal tadka + brown rice',
    calories: 410,
    protein: 18,
    carbs: 64,
    fat: 8,
    score: 68,
    decision: 'Okay Choice',
    reason: 'Good plant protein but slightly high in carbs for evening meal.',
    suggestion: 'Reduce rice portion by half and add a cucumber salad.',
    goalAligned: true,
    mealType: 'Dinner',
    date: getToday(),
    timestamp: Date.now() - 600000,
  },
]

export function generateWeeklyData(meals) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map((day, i) => ({
    day,
    calories: Math.round(1400 + Math.random() * 600),
    protein: Math.round(60 + Math.random() * 40),
    score: Math.round(55 + Math.random() * 35),
  }))
}
