import { useState, useEffect } from 'react'
import { Sparkles, MapPin, Brain, Gift, ChevronRight, X, Check } from 'lucide-react'

const ONBOARDING_STEPS = [
  {
    icon: '🗺️',
    title: '香港生活地圖',
    subtitle: '你嘅智能香港生活指南',
    description: '集優惠、餐廳、好去處於一身，帶你發掘香港每一個精彩角落！',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: '📍',
    title: '智能定位推薦',
    subtitle: '去到邊，搵到邊',
    description: '自動根據你嘅位置，推薦附近最啱你嘅優惠同好去處！',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    icon: '🤖',
    title: 'AI 智能助理',
    subtitle: '用廣東話問我',
    description: '唔使打字！直接問我「附近有咩好嘢食」，我即刻幫你搵！',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: '💰',
    title: '香港優惠',
    subtitle: '幫你慳錢',
    description: 'AlipayHK、WeChat Pay、信用卡優惠全部一網打盡！',
    color: 'from-pink-500 to-rose-500',
  },
]

export default function OnboardingView({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(prev => prev + 1)
        setIsAnimating(false)
      }, 200)
    } else {
      completeOnboarding()
    }
  }

  const handleSkip = () => {
    completeOnboarding()
  }

  const completeOnboarding = () => {
    localStorage.setItem('hk_onboarding_complete', 'true')
    onComplete?.()
  }

  const step = ONBOARDING_STEPS[currentStep]
  const isLast = currentStep === ONBOARDING_STEPS.length - 1

  return (
    <div className="h-full w-full flex flex-col bg-white">
      {/* Skip Button */}
      <div className="p-5 flex justify-end">
        <button 
          onClick={handleSkip}
          className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          跳過
        </button>
      </div>

      {/* Content */}
      <div className={`flex-1 flex flex-col items-center justify-center px-8 transition-all duration-200 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {/* Icon */}
        <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center text-6xl mb-8 shadow-2xl shadow-current/20`}>
          {step.icon}
        </div>

        {/* Text */}
        <h1 className="text-2xl font-bold text-zinc-900 text-center mb-2">
          {step.title}
        </h1>
        <p className="text-sm font-medium text-amber-500 mb-4">
          {step.subtitle}
        </p>
        <p className="text-base text-zinc-500 text-center leading-relaxed max-w-xs">
          {step.description}
        </p>
      </div>

      {/* Progress & Navigation */}
      <div className="p-8 pb-12">
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {ONBOARDING_STEPS.map((_, i) => (
            <div 
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                i === currentStep 
                  ? 'w-6 bg-amber-500' 
                  : i < currentStep 
                    ? 'bg-amber-300' 
                    : 'bg-zinc-200'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          className={`w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg transition-all active:scale-[0.98] bg-gradient-to-r ${step.color}`}
        >
          {isLast ? '開始體驗 🚀' : '繼續'}
        </button>
      </div>
    </div>
  )
}
