import { useState, useEffect } from 'react'
import { Sparkles, Calendar, MapPin, Clock, Users, ChevronRight, Loader2, Plus, Trash2, Share2, Wand2, Search, X, Globe, Plane, DollarSign, Wallet, TrendingUp, PiggyBank, Check, ArrowRight } from 'lucide-react'

const CITIES = [
  { id: 'hongkong', name: '香港', country: '香港', flag: '🇭🇰', currency: 'HKD', avgCost: 800 },
  { id: 'tokyo', name: '東京', country: '日本', flag: '🇯🇵', currency: 'JPY', avgCost: 1200 },
  { id: 'osaka', name: '大阪', country: '日本', flag: '🇯🇵', currency: 'JPY', avgCost: 1000 },
  { id: 'seoul', name: '首爾', country: '韓國', flag: '🇰🇷', currency: 'KRW', avgCost: 900 },
  { id: 'bangkok', name: '曼谷', country: '泰國', flag: '🇹🇭', currency: 'THB', avgCost: 600 },
  { id: 'singapore', name: '新加坡', country: '新加坡', flag: '🇸🇬', currency: 'SGD', avgCost: 1400 },
  { id: 'taipei', name: '台北', country: '台灣', flag: '🇹🇼', currency: 'TWD', avgCost: 500 },
  { id: 'london', name: '倫敦', country: '英國', flag: '🇬🇧', currency: 'GBP', avgCost: 1500 },
  { id: 'paris', name: '巴黎', country: '法國', flag: '🇫🇷', currency: 'EUR', avgCost: 1600 },
  { id: 'newyork', name: '紐約', country: '美國', flag: '🇺🇸', currency: 'USD', avgCost: 2000 },
]

const BUDGET_LEVELS = [
  { id: 'budget', label: '省錢', icon: '💰', color: 'from-green-500 to-emerald-500', desc: '青年旅舍、 street food', perDay: 300 },
  { id: 'medium', label: '普通', icon: '💳', color: 'from-blue-500 to-cyan-500', desc: '3星酒店、餐廳', perDay: 800 },
  { id: 'luxury', label: '奢華', icon: '💎', color: 'from-purple-500 to-pink-500', desc: '5星酒店、米芝蓮', perDay: 2500 },
]

const TRIP_TYPES = [
  { id: 'food', label: '美食之旅', icon: '🍜', emoji: '🥢' },
  { id: 'sightseeing', label: '觀光遊覽', icon: '🏛️', emoji: '📸' },
  { id: 'shopping', label: '購物血拚', icon: '🛍️', emoji: '🛒' },
  { id: 'mixed', label: '綜合體驗', icon: '✨', emoji: '🌟' },
]

const PLACE_BUDGETS = {
  hongkong: {
    food: [
      { title: '茶餐廳早餐', cost: 40, duration: '1h', icon: '🍵', rating: 4 },
      { title: '街邊小吃', cost: 30, duration: '30m', icon: '🦐', rating: 5 },
      { title: '傳統酒樓午餐', cost: 150, duration: '1.5h', icon: '🥟', rating: 4 },
      { title: '茶餐廳晚餐', cost: 80, duration: '1h', icon: '🍜', rating: 4 },
    ],
    sightseeing: [
      { title: '山頂纜車來回', cost: 100, duration: '2h', icon: '🚡', rating: 5 },
      { title: '天星小輪', cost: 10, duration: '30m', icon: '⛴️', rating: 5 },
      { title: '巴士觀光', cost: 30, duration: '1h', icon: '🚌', rating: 4 },
    ],
    shopping: [
      { title: '便利店手信', cost: 100, duration: '30m', icon: '🏪', rating: 4 },
      { title: '特賣場購物', cost: 500, duration: '2h', icon: '🛍️', rating: 5 },
    ],
  },
  tokyo: {
    food: [
      { title: '便利店早餐', cost: 500, duration: '30m', icon: '🍙', rating: 4 },
      { title: '拉麵午餐', cost: 1000, duration: '45m', icon: '🍜', rating: 5 },
      { title: '居酒屋晚餐', cost: 3000, duration: '2h', icon: '🍺', rating: 5 },
      { title: '壽司', cost: 2500, duration: '1h', icon: '🍣', rating: 5 },
    ],
    sightseeing: [
      { title: '淺草寺', cost: 0, duration: '1.5h', icon: '🛕', rating: 5 },
      { title: '晴空塔', cost: 2000, duration: '2h', icon: '🗼', rating: 5 },
      { title: '明治神宮', cost: 0, duration: '1h', icon: '⛩️', rating: 4 },
    ],
    shopping: [
      { title: '秋葉原', cost: 3000, duration: '3h', icon: '🎮', rating: 5 },
      { title: '藥妝店', cost: 2000, duration: '1h', icon: '💊', rating: 4 },
    ],
  },
  osaka: {
    food: [
      { title: '章魚小丸子', cost: 400, duration: '30m', icon: '🐙', rating: 5 },
      { title: '大阪燒', cost: 1500, duration: '1h', icon: '🥞', rating: 5 },
      { title: '串炸', cost: 1200, duration: '1h', icon: '🍢', rating: 4 },
      { title: '拉麵', cost: 800, duration: '45m', icon: '🍜', rating: 5 },
    ],
    sightseeing: [
      { title: '大阪城', cost: 600, duration: '2h', icon: '🏯', rating: 5 },
      { title: '通天閣', cost: 800, duration: '1.5h', icon: '🗼', rating: 4 },
    ],
    shopping: [
      { title: '心齋橋', cost: 3000, duration: '3h', icon: '🛍️', rating: 5 },
      { title: '黑門市場', cost: 1500, duration: '2h', icon: '🦐', rating: 5 },
    ],
  },
  seoul: {
    food: [
      { title: '廣藏市場', cost: 8000, duration: '1.5h', icon: '🍜', rating: 5 },
      { title: '韓燒', cost: 25000, duration: '2h', icon: '🥩', rating: 5 },
      { title: '炸雞', cost: 15000, duration: '45m', icon: '🍗', rating: 4 },
    ],
    sightseeing: [
      { title: '景福宮', cost: 0, duration: '2h', icon: '🏯', rating: 5 },
      { title: 'N首爾塔', cost: 15000, duration: '2h', icon: '🗼', rating: 5 },
    ],
    shopping: [
      { title: '明洞', cost: 50000, duration: '3h', icon: '🛍️', rating: 5 },
      { title: '弘大', cost: 30000, duration: '2h', icon: '🎨', rating: 4 },
    ],
  },
  bangkok: {
    food: [
      { title: '街邊米粉', cost: 50, duration: '30m', icon: '🍜', rating: 5 },
      { title: '購物中心美食', cost: 300, duration: '1h', icon: '🍲', rating: 4 },
      { title: '海鮮晚餐', cost: 800, duration: '1.5h', icon: '🦐', rating: 5 },
    ],
    sightseeing: [
      { title: '大皇宮', cost: 500, duration: '2h', icon: '🕌', rating: 5 },
      { title: '鄭王廟', cost: 50, duration: '1h', icon: '🛕', rating: 5 },
    ],
    shopping: [
      { title: 'MBK商場', cost: 1000, duration: '3h', icon: '🛍️', rating: 4 },
      { title: '火車夜市', cost: 500, duration: '2h', icon: '🏪', rating: 5 },
    ],
  },
  singapore: {
    food: [
      { title: '肉骨茶', cost: 15, duration: '1h', icon: '🥘', rating: 5 },
      { title: '海南雞飯', cost: 10, duration: '45m', icon: '🍚', rating: 5 },
      { title: '辣椒螃蟹', cost: 80, duration: '1.5h', icon: '🦀', rating: 5 },
    ],
    sightseeing: [
      { title: '魚尾獅公園', cost: 0, duration: '1h', icon: '🦁', rating: 5 },
      { title: '濱海灣花園', cost: 28, duration: '3h', icon: '🌴', rating: 5 },
    ],
    shopping: [
      { title: '烏節路', cost: 200, duration: '3h', icon: '🛍️', rating: 4 },
    ],
  },
  taipei: {
    food: [
      { title: '豆漿早餐', cost: 80, duration: '45m', icon: '🥛', rating: 5 },
      { title: '鼎泰豐', cost: 500, duration: '1h', icon: '🥟', rating: 5 },
      { title: '夜市小吃', cost: 300, duration: '2h', icon: '🍡', rating: 5 },
    ],
    sightseeing: [
      { title: '101大樓', cost: 600, duration: '2h', icon: '🏢', rating: 5 },
      { title: '故宮博物院', cost: 350, duration: '3h', icon: '🏛️', rating: 5 },
    ],
    shopping: [
      { title: '西門町', cost: 1000, duration: '2h', icon: '🛍️', rating: 4 },
      { title: '迪化街', cost: 500, duration: '1.5h', icon: '🏮', rating: 4 },
    ],
  },
}

const getCityPlaces = (cityId, tripType, budget) => {
  const cityData = PLACE_BUDGETS[cityId]
  if (!cityData) return []
  const typeKey = tripType === 'mixed' ? 'sightseeing' : tripType
  let places = cityData[typeKey] || []
  
  // Filter by budget
  if (budget === 'budget') {
    places = places.filter(p => p.cost <= 500)
  } else if (budget === 'medium') {
    places = places.filter(p => p.cost <= 1500)
  }
  
  return places.slice(0, 4)
}

const calculateBudget = (places, city, days) => {
  const dailyBudget = places.reduce((sum, p) => sum + p.cost, 0)
  const accommodation = city.avgCost * days
  const transport = 200 * days
  const total = dailyBudget * days + accommodation + transport
  return { dailyBudget, accommodation, transport, total }
}

export default function TripPlannerView() {
  const [selectedCity, setSelectedCity] = useState('hongkong')
  const [tripType, setTripType] = useState(null)
  const [budget, setBudget] = useState('medium')
  const [days, setDays] = useState(2)
  const [companions, setCompanions] = useState('solo')
  const [generating, setGenerating] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [currentTrip, setCurrentTrip] = useState(null)
  const [step, setStep] = useState(1)

  const currentCity = CITIES.find(c => c.id === selectedCity)

  const handleGenerate = async () => {
    if (!tripType) return
    setGenerating(true)
    
    await new Promise(r => setTimeout(r, 2500))
    
    const places = getCityPlaces(selectedCity, tripType, budget)
    const budgetInfo = calculateBudget(places, currentCity, days)
    
    const itinerary = Array.from({ length: days }, (_, dayIndex) => ({
      day: dayIndex + 1,
      activities: places.slice(0, 3 + Math.floor(Math.random() * 2)).map(p => ({
        ...p,
        time: `${9 + dayIndex * 4}:00`
      }))
    }))
    
    setCurrentTrip({
      city: selectedCity,
      type: tripType,
      budget,
      days,
      companions,
      itinerary,
      budgetInfo
    })
    
    setGenerating(false)
    setShowResult(true)
    setStep(3)
  }

  const formatCurrency = (amount, currency) => {
    const symbols = { HKD: 'HK$', JPY: '¥', KRW: '₩', THB: '฿', SGD: 'S$', TWD: 'NT$', GBP: '£', EUR: '€', USD: '$' }
    return `${symbols[currency] || ''}${Math.round(amount).toLocaleString()}`
  }

  const shareTrip = () => {
    if (!currentTrip) return
    const city = CITIES.find(c => c.id === currentTrip.city)
    const typeLabels = { food: '美食之旅', sightseeing: '觀光遊覽', shopping: '購物血拚', mixed: '綜合體驗' }
    const text = `${city?.flag} ${city?.name} ${typeLabels[currentTrip.type]} ${currentTrip.days}日\n\n` +
      `預算：${formatCurrency(currentTrip.budgetInfo.total, city?.currency)}\n\n` +
      currentTrip.itinerary.map(day => 
        `📅 Day ${day.day}:\n` + 
        day.activities.map(a => `⏰ ${a.time} ${a.title} ${formatCurrency(a.cost, city?.currency)}`).join('\n')
      ).join('\n\n')
    
    navigator.share ? navigator.share({ title: `${city?.name}行程`, text }) : navigator.clipboard.writeText(text)
  }

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-violet-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-xl shadow-violet-200/50">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">AI 智能行程</h1>
            <p className="text-xs text-slate-500">一鍵生成專屬旅程</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            {/* City Selection - Premium Grid */}
            <div>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">選擇目的地</h2>
              <div className="grid grid-cols-2 gap-3">
                {CITIES.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => setSelectedCity(city.id)}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                      selectedCity === city.id
                        ? 'border-violet-500 bg-gradient-to-br from-violet-50 to-purple-50 shadow-lg shadow-violet-200/50'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{city.flag}</span>
                      <div className="text-left">
                        <p className="font-bold text-slate-900">{city.name}</p>
                        <p className="text-xs text-slate-400">{city.country}</p>
                      </div>
                    </div>
                    {selectedCity === city.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setStep(2)} className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold rounded-2xl shadow-xl shadow-violet-200/50 flex items-center justify-center gap-2">
              下一步 <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            {/* Budget Selection - Premium Cards */}
            <div>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">選擇預算</h2>
              <div className="space-y-3">
                {BUDGET_LEVELS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBudget(b.id)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 ${
                      budget === b.id
                        ? `border-transparent bg-gradient-to-r ${b.color} text-white shadow-xl`
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{b.icon}</span>
                      <div className="text-left flex-1">
                        <p className={`font-bold text-lg ${budget === b.id ? 'text-white' : 'text-slate-900'}`}>{b.label}</p>
                        <p className={`text-sm ${budget === b.id ? 'text-white/80' : 'text-slate-500'}`}>{b.desc}</p>
                      </div>
                      <div className={`text-right ${budget === b.id ? 'text-white' : 'text-slate-400'}`}>
                        <p className="text-xs">每日</p>
                        <p className="font-bold">{currentCity?.currency}{b.perDay}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Trip Type */}
            <div>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">行程類型</h2>
              <div className="grid grid-cols-2 gap-3">
                {TRIP_TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTripType(t.id)}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      tripType === t.id
                        ? 'border-violet-500 bg-gradient-to-br from-violet-50 to-purple-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="text-3xl mb-2 block">{t.emoji}</span>
                    <p className="font-bold text-slate-900">{t.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Days */}
            <div>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">行程天數</h2>
              <div className="flex gap-2">
                {[1, 2, 3, 5, 7].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDays(d)}
                    className={`flex-1 py-4 rounded-2xl font-bold transition-all ${
                      days === d
                        ? 'bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {d}日
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">上一步</button>
              <button onClick={() => setStep(3)} disabled={!tripType} className="flex-1 py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold rounded-2xl shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                下一步 <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && !showResult && (
          <div className="space-y-6 animate-fade-in">
            {/* Trip Summary */}
            <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-3xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{currentCity?.flag}</span>
                <div>
                  <p className="font-bold text-lg">{currentCity?.name}</p>
                  <p className="text-white/80 text-sm">{TRIP_TYPES.find(t => t.id === tripType)?.label}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white/20 rounded-xl p-3">
                  <p className="text-2xl font-bold">{days}</p>
                  <p className="text-xs text-white/80">天數</p>
                </div>
                <div className="bg-white/20 rounded-xl p-3">
                  <p className="text-2xl font-bold">{BUDGET_LEVELS.find(b => b.id === budget)?.icon}</p>
                  <p className="text-xs text-white/80">預算</p>
                </div>
                <div className="bg-white/20 rounded-xl p-3">
                  <p className="text-2xl font-bold">{currentCity?.currency}{BUDGET_LEVELS.find(b => b.id === budget)?.perDay * days}</p>
                  <p className="text-xs text-white/80">總預算</p>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white font-bold rounded-2xl shadow-2xl shadow-violet-300/50 flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {generating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>AI 智能規劃中...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>生成 AI 智能行程</span>
                </>
              )}
            </button>

            <button onClick={() => setStep(2)} className="w-full py-3 text-slate-500 font-medium">重新選擇</button>
          </div>
        )}

        {showResult && currentTrip && (
          <div className="space-y-4 animate-fade-in">
            {/* Trip Header */}
            <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-3xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{currentCity?.flag}</span>
                  <div>
                    <p className="font-extrabold text-xl">{currentCity?.name}</p>
                    <p className="text-white/80 text-sm">{TRIP_TYPES.find(t => t.id === currentTrip.type)?.label}</p>
                  </div>
                </div>
                <button onClick={shareTrip} className="px-4 py-2 bg-white/20 rounded-xl font-semibold text-sm flex items-center gap-1">
                  <Share2 className="w-4 h-4" /> 分享
                </button>
              </div>
              
              {/* Budget Summary */}
              <div className="bg-white/20 rounded-2xl p-4">
                <p className="text-xs text-white/80 mb-2">預算概覽</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold">{formatCurrency(currentTrip.budgetInfo.dailyBudget, currentCity?.currency)}</p>
                    <p className="text-xs text-white/70">每日開支</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{formatCurrency(currentTrip.budgetInfo.accommodation, currentCity?.currency)}</p>
                    <p className="text-xs text-white/70">住宿</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{formatCurrency(currentTrip.budgetInfo.total, currentCity?.currency)}</p>
                    <p className="text-xs text-white/70">總預算</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Itinerary */}
            {currentTrip.itinerary.map((day) => (
              <div key={day.day} className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-5 py-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-violet-500" />
                    Day {day.day}
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  {day.activities.map((activity, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-2xl shadow-lg">
                          {activity.icon}
                        </div>
                        {i < day.activities.length - 1 && <div className="w-0.5 flex-1 bg-gradient-to-b from-violet-300 to-purple-200 my-1" />}
                      </div>
                      <div className="flex-1 pb-5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-1 bg-violet-100 text-violet-600 text-xs font-bold rounded-lg">{activity.time}</span>
                          <span className="text-xs text-slate-400">⏱️ {activity.duration}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-lg">{activity.title}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < activity.rating ? 'text-yellow-400' : 'text-slate-200'}>★</span>
                            ))}
                          </div>
                          <span className="font-bold text-violet-600">{formatCurrency(activity.cost, currentCity?.currency)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button onClick={() => { setShowResult(false); setStep(1); }} className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">
              重新規劃
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
