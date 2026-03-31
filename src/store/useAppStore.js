import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  calculateBMR, calculateTDEE, calculateTargetCalories, 
  calculateProteinNeeds, getToday, DEMO_PROFILE, DEMO_MEALS, generateWeeklyData
} from '@/lib/utils'

const computeProfileStats = (profile) => {
  if (!profile.age || !profile.weight || !profile.height) return {}
  const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender)
  const tdee = calculateTDEE(bmr, profile.activityLevel)
  const targetCalories = calculateTargetCalories(tdee, profile.goal)
  const proteinNeeds = calculateProteinNeeds(profile.weight, profile.goal)
  return { bmr, tdee, targetCalories, proteinNeeds }
}

export const useAppStore = create(
  persist(
    (set, get) => ({
      // API Key
apiKey: 'AIzaSyAvKwbf9SvXwk9G2GLmy2BUCHklfBHchec',
      setApiKey: (key) => set({ apiKey: key }),

      // Profile
      profile: {
        name: '',
        age: '',
        weight: '',
        height: '',
        gender: 'male',
        goal: 'maintain',
        activityLevel: 'moderate',
        dietType: 'none',
        targetCalories: 2000,
        proteinNeeds: 120,
      },
      profileComplete: false,
      updateProfile: (updates) => set((state) => {
        const newProfile = { ...state.profile, ...updates }
        const stats = computeProfileStats(newProfile)
        const merged = { ...newProfile, ...stats }
        const isComplete = merged.age && merged.weight && merged.height
        return { profile: merged, profileComplete: !!isComplete }
      }),

      // Meals
      meals: [],
      addMeal: (meal) => set((state) => {
        const newMeal = { ...meal, id: Date.now().toString(), date: getToday(), timestamp: Date.now() }
        const newMeals = [newMeal, ...state.meals]
        // Update streak
        const streak = get().updateStreak()
        return { meals: newMeals }
      }),
      removeMeal: (id) => set((state) => ({
        meals: state.meals.filter(m => m.id !== id)
      })),
      clearTodayMeals: () => set((state) => ({
        meals: state.meals.filter(m => m.date !== getToday())
      })),

      // Streak
      streak: { count: 0, lastDate: '', longestStreak: 0 },
      updateStreak: () => {
        const state = get()
        const today = getToday()
        const { streak } = state
        if (streak.lastDate === today) return streak.count

        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]

        let newCount = streak.lastDate === yesterdayStr ? streak.count + 1 : 1
        const longestStreak = Math.max(newCount, streak.longestStreak)
        
        set({ streak: { count: newCount, lastDate: today, longestStreak } })
        return newCount
      },

      // Chat messages
      chatMessages: [],
      addChatMessage: (msg) => set((state) => ({
        chatMessages: [...state.chatMessages, { ...msg, id: Date.now().toString(), timestamp: Date.now() }]
      })),
      clearChat: () => set({ chatMessages: [] }),

      // Weekly data (for charts)
      weeklyData: [],

      // UI state
      activeTab: 'dashboard',
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Demo mode
      loadDemo: () => {
        const stats = computeProfileStats(DEMO_PROFILE)
        const fullProfile = { ...DEMO_PROFILE, ...stats }
        set({
          profile: fullProfile,
          profileComplete: true,
          meals: [...DEMO_MEALS],
          weeklyData: generateWeeklyData(),
          streak: { count: 7, lastDate: getToday(), longestStreak: 14 },
          activeTab: 'dashboard',
        })
      },

      // Reset
      resetAll: () => set({
        profile: {
          name: '', age: '', weight: '', height: '', gender: 'male',
          goal: 'maintain', activityLevel: 'moderate', dietType: 'none',
          targetCalories: 2000, proteinNeeds: 120,
        },
        profileComplete: false,
        meals: [],
        chatMessages: [],
        streak: { count: 0, lastDate: '', longestStreak: 0 },
        weeklyData: [],
      }),
    }),
    {
      name: 'nutrisense-storage',
      partialize: (state) => ({
        apiKey: state.apiKey,
        profile: state.profile,
        profileComplete: state.profileComplete,
        meals: state.meals.slice(0, 50), // keep last 50 meals
        streak: state.streak,
        weeklyData: state.weeklyData,
      }),
    }
  )
)
