import { useState } from 'react'
import { Sparkles, Calendar, MapPin, Clock, Users, ChevronRight, Loader2, Plus, Trash2, Share2, Check, Wand2, Search, X, GripVertical, Save, Globe, Plane, Utensils, Building, ShoppingBag } from 'lucide-react'
import { useMap } from '../context/MapContext'
import { CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'

const CITIES = [
  {
    id: 'hongkong',
    name: '香港',
    country: '香港',
    flag: '🇭🇰',
    categories: { food: '🍜', sightseeing: '🏛️', shopping: '🛍️', mixed: '✨' }
  },
  {
    id: 'tokyo',
    name: '東京',
    country: '日本',
    flag: '🇯🇵',
    categories: { food: '🍣', sightseeing: '🗼', shopping: '🛍️', mixed: '✨' }
  },
  {
    id: 'osaka',
    name: '大阪',
    country: '日本',
    flag: '🇯🇵',
    categories: { food: '🥮', sightseeing: '🏯', shopping: '🛍️', mixed: '✨' }
  },
  {
    id: 'seoul',
    name: '首爾',
    country: '韓國',
    flag: '🇰🇷',
    categories: { food: '🍖', sightseeing: '🕌', shopping: '🛍️', mixed: '✨' }
  },
  {
    id: 'bangkok',
    name: '曼谷',
    country: '泰國',
    flag: '🇹🇭',
    categories: { food: '🍲', sightseeing: '🛕', shopping: '🛍️', mixed: '✨' }
  },
  {
    id: 'singapore',
    name: '新加坡',
    country: '新加坡',
    flag: '🇸🇬',
    categories: { food: '🥘', sightseeing: '🏙️', shopping: '🛍️', mixed: '✨' }
  },
  {
    id: 'taipei',
    name: '台北',
    country: '台灣',
    flag: '🇹🇼',
    categories: { food: '🥟', sightseeing: '🗻', shopping: '🛍️', mixed: '✨' }
  },
  {
    id: 'london',
    name: '倫敦',
    country: '英國',
    flag: '🇬🇧',
    categories: { food: '🍔', sightseeing: '🗿', shopping: '🛍️', mixed: '✨' }
  },
  {
    id: 'paris',
    name: '巴黎',
    country: '法國',
    flag: '🇫🇷',
    categories: { food: '🥐', sightseeing: '🗼', shopping: '🛍️', mixed: '✨' }
  },
  {
    id: 'newyork',
    name: '紐約',
    country: '美國',
    flag: '🇺🇸',
    categories: { food: '🍕', sightseeing: '🗽', shopping: '🛍️', mixed: '✨' }
  },
]

const TRIP_TYPES = [
  { id: 'food', label: '美食之旅', icon: '🍜', desc: '品嚐當地美食' },
  { id: 'sightseeing', label: '觀光遊覽', icon: '🏛️', desc: '探索景點' },
  { id: 'shopping', label: '購物血拼', icon: '🛍️', desc: '商場與市集' },
  { id: 'mixed', label: '綜合體驗', icon: '✨', desc: '全部都要' },
]

const PLACE_SUGGESTIONS = {
  hongkong: {
    food: [
      { title: '蓮香樓', time: '09:00', desc: '傳統點心', icon: '🥟' },
      { title: '九記牛腩', time: '12:00', desc: '必試牛腩麵', icon: '🍜' },
      { title: '添好運', time: '15:00', desc: '米芝蓮點心', icon: '🥧' },
      { title: '鏞記燒鵝', time: '19:00', desc: '金牌燒鵝', icon: '🍗' },
    ],
    sightseeing: [
      { title: '山頂纜車', time: '10:00', desc: '維港全景', icon: '🚡' },
      { title: '故宮博物館', time: '14:00', desc: '文化藝術', icon: '🏛️' },
      { title: '天星小輪', time: '17:00', desc: '維港渡輪', icon: '🚢' },
    ],
    shopping: [
      { title: '海港城', time: '11:00', desc: '最大商場', icon: '🛍️' },
      { title: '女人街', time: '15:00', desc: '露天市集', icon: '🏪' },
      { title: '又一城', time: '19:00', desc: '室內商場', icon: '🛒' },
    ],
  },
  tokyo: {
    food: [
      { title: '壽司大', time: '09:00', desc: '超人氣壽司', icon: '🍣' },
      { title: '一蘭拉麵', time: '12:00', desc: '博多拉麵', icon: '🍜' },
      { title: '築地市場', time: '15:00', desc: '海鮮美食', icon: '🦐' },
      { title: '燒肉店', time: '19:00', desc: '和牛燒肉', icon: '🥩' },
    ],
    sightseeing: [
      { title: '淺草寺', time: '10:00', desc: '雷門觀音', icon: '🛕' },
      { title: '晴空塔', time: '14:00', desc: '東京全景', icon: '🗼' },
      { title: '明治神宮', time: '17:00', desc: '傳統神社', icon: '⛩️' },
    ],
    shopping: [
      { title: '新宿伊勢丹', time: '11:00', desc: '百貨公司', icon: '🛍️' },
      { title: '秋葉原', time: '15:00', desc: '電器動漫', icon: '🎮' },
      { title: '銀座', time: '19:00', desc: '高級商場', icon: '💎' },
    ],
  },
  osaka: {
    food: [
      { title: '道頓堀', time: '09:00', desc: '章魚小丸子', icon: '🐙' },
      { title: '黑門市場', time: '12:00', desc: '海鮮天堂', icon: '🦐' },
      { title: '大阪燒', time: '15:00', desc: '特色料理', icon: '🥞' },
      { title: '串炸店', time: '19:00', desc: '酥脆串炸', icon: '🍢' },
    ],
    sightseeing: [
      { title: '大阪城', time: '10:00', desc: '歷史城堡', icon: '🏯' },
      { title: '通天閣', time: '14:00', desc: '新世界', icon: '🗼' },
      { title: '環球影城', time: '17:00', desc: '主題樂園', icon: '🎢' },
    ],
    shopping: [
      { title: '心齋橋', time: '11:00', desc: '潮流購物', icon: '🛍️' },
      { title: '難波', time: '15:00', desc: '庶民商場', icon: '🏪' },
    ],
  },
  seoul: {
    food: [
      { title: '廣藏市場', time: '09:00', desc: '傳統小吃', icon: '🍜' },
      { title: '明洞烤肉', time: '12:00', desc: '韓燒', icon: '🥩' },
      { title: '弘大美食', time: '15:00', desc: '年輕人天堂', icon: '🍻' },
      { title: '東大門', time: '19:00', desc: '深夜美食', icon: '🌙' },
    ],
    sightseeing: [
      { title: '景福宮', time: '10:00', desc: '宮殿', icon: '🏯' },
      { title: '南山塔', time: '14:00', desc: '首爾全景', icon: '🗼' },
      { title: '明洞', time: '17:00', desc: '購物中心', icon: '🛍️' },
    ],
    shopping: [
      { title: '弘大', time: '11:00', desc: '潮牌', icon: '👕' },
      { title: '東大門設計廣場', time: '15:00', desc: 'DDP', icon: '🏢' },
    ],
  },
  bangkok: {
    food: [
      { title: '恰圖恰市場', time: '09:00', desc: '街頭小吃', icon: '🍜' },
      { title: '建興酒家', time: '12:00', desc: '海鮮', icon: '🦐' },
      { title: '水上市場', time: '15:00', desc: '特色美食', icon: '🚣' },
      { title: '夜市美食', time: '19:00', desc: '燒烤海鮮', icon: '🍖' },
    ],
    sightseeing: [
      { title: '大皇宮', time: '10:00', desc: '皇室宮殿', icon: '🕌' },
      { title: '鄭王廟', time: '14:00', desc: '黎明寺', icon: '🛕' },
      { title: '四面佛', time: '17:00', desc: '愛神', icon: '🙏' },
    ],
    shopping: [
      { title: 'MBK商場', time: '11:00', desc: '平價商品', icon: '🛍️' },
      { title: 'Terminal 21', time: '15:00', desc: '主題商場', icon: '✈️' },
    ],
  },
  singapore: {
    food: [
      { title: '松發肉骨茶', time: '09:00', desc: '潮汕肉骨茶', icon: '🥘' },
      { title: '天天海南雞飯', time: '12:00', desc: '國菜', icon: '🍚' },
      { title: '辣椒螃蟹', time: '15:00', desc: '特色海鮮', icon: '🦀' },
      { title: '克拉碼頭', time: '19:00', desc: '酒吧區', icon: '🍺' },
    ],
    sightseeing: [
      { title: '魚尾獅公園', time: '10:00', desc: '地標', icon: '🦁' },
      { title: '濱海灣花園', time: '14:00', desc: '超級樹', icon: '🌴' },
      { title: '牛車水', time: '17:00', desc: '華人區', icon: '🏮' },
    ],
    shopping: [
      { title: '烏節路', time: '11:00', desc: '購物大道', icon: '🛍️' },
      { title: '樟宜機場', time: '15:00', desc: '星耀樟宜', icon: '✈️' },
    ],
  },
  taipei: {
    food: [
      { title: '寧夏夜市', time: '09:00', desc: '夜市小吃', icon: '🍜' },
      { title: '鼎泰豐', time: '12:00', desc: '小籠包', icon: '🥟' },
      { title: '士林夜市', time: '15:00', desc: '大夜市', icon: '🦐' },
      { title: '欣葉台菜', time: '19:00', desc: '台灣料理', icon: '🍲' },
    ],
    sightseeing: [
      { title: '台北101', time: '10:00', desc: '摩天大樓', icon: '🏢' },
      { title: '故宮博物院', time: '14:00', desc: '歷史文物', icon: '🏛️' },
      { title: '西門町', time: '17:00', desc: '潮流區', icon: '🎬' },
    ],
    shopping: [
      { title: '信義區', time: '11:00', desc: '新光三越', icon: '🛍️' },
      { title: '迪化街', time: '15:00', desc: '老街', icon: '🏮' },
    ],
  },
}

const getAllSuggestions = (cityId, tripType) => {
  const city = PLACE_SUGGESTIONS[cityId]
  if (!city) return []
  return [...(city[tripType] || []), ...(city.mixed || [])]
}

export default function TripPlannerView() {
  const { markers } = useMap()
  const [selectedCity, setSelectedCity] = useState('hongkong')
  const [tripType, setTripType] = useState(null)
  const [days, setDays] = useState(1)
  const [companions, setCompanions] = useState('solo')
  const [generating, setGenerating] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [savedTrips, setSavedTrips] = useState([])
  const [currentTrip, setCurrentTrip] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [customPlaces, setCustomPlaces] = useState([])

  const currentCity = CITIES.find(c => c.id === selectedCity)

  const handleGenerate = async () => {
    if (!tripType) return
    setGenerating(true)
    
    await new Promise(r => setTimeout(r, 2000))
    
    const suggestions = getAllSuggestions(selectedCity, tripType)
    
    const itinerary = Array.from({ length: days }, (_, dayIndex) => {
      let activities = [...suggestions]
      
      if (customPlaces.length > 0) {
        const placesToAdd = customPlaces.slice(0, Math.ceil(customPlaces.length / days))
        const insertPos = Math.floor(activities.length / 2)
        activities = [
          ...activities.slice(0, insertPos),
          ...placesToAdd.map(p => ({ ...p, icon: p.icon || '📍' })),
          ...activities.slice(insertPos)
        ]
      }
      
      return {
        day: dayIndex + 1,
        date: `Day ${dayIndex + 1}`,
        activities
      }
    })
    
    setCurrentTrip({
      city: selectedCity,
      type: tripType,
      days,
      companions,
      itinerary
    })
    
    setGenerating(false)
    setShowResult(true)
    setShowSearch(false)
  }

  const addCustomPlace = (place) => {
    setCustomPlaces(prev => [...prev, { ...place, time: place.time || '12:00' }])
    setShowSearch(false)
    setSearchQuery('')
  }

  const removeCustomPlace = (index) => {
    setCustomPlaces(prev => prev.filter((_, i) => i !== index))
  }

  const saveTrip = () => {
    if (currentTrip) {
      setSavedTrips(prev => [...prev, { ...currentTrip, id: Date.now() }])
    }
  }

  const deleteTrip = (id) => {
    setSavedTrips(prev => prev.filter(t => t.id !== id))
  }

  const shareTrip = (trip) => {
    const city = CITIES.find(c => c.id === trip.city)
    const typeLabels = { food: '美食之旅', sightseeing: '觀光遊覽', shopping: '購物血拼', mixed: '綜合體驗' }
    const text = `${city?.flag} ${city?.name} ${typeLabels[trip.type]} ${trip.days}日遊\n\n` +
      trip.itinerary.map(day => 
        `${day.date}:\n` + 
        day.activities.map(a => `⏰ ${a.time} ${a.title} - ${a.desc}`).join('\n')
      ).join('\n\n')
    
    if (navigator.share) {
      navigator.share({ title: `${city?.name}行程`, text })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  const tripTypeLabels = { food: '美食之旅', sightseeing: '觀光遊覽', shopping: '購物血拼', mixed: '綜合體驗' }

  const filteredSuggestions = searchQuery
    ? getAllSuggestions(selectedCity, tripType || 'mixed').filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : getAllSuggestions(selectedCity, tripType || 'mixed')

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-b from-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-5 pt-6 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-200">
              <Plane className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">AI 行程規劃</h1>
              <p className="text-sm text-slate-400">輕鬆規劃完美旅程</p>
            </div>
          </div>
          {showResult && currentTrip && (
            <button
              onClick={() => { setShowSearch(true); setShowResult(false); }}
              className="px-4 py-2 bg-violet-100 text-violet-600 rounded-xl font-semibold text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              加入地點
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {!showResult ? (
          <div className="space-y-6 animate-slide-up">
            {/* City Selection */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-violet-500" />
                選擇目的地
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {CITIES.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => setSelectedCity(city.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      selectedCity === city.id
                        ? 'border-violet-500 bg-violet-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-3xl mb-2 block">{city.flag}</span>
                    <h3 className="font-bold text-slate-900">{city.name}</h3>
                    <p className="text-xs text-slate-500">{city.country}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Search/Add Places */}
            {showSearch && (
              <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Search className="w-5 h-5 text-violet-500" />
                    加入自訂地點
                  </h3>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`搜索 ${currentCity?.name} 的地點...`}
                      className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    />
                  </div>
                </div>
                
                {customPlaces.length > 0 && (
                  <div className="p-4 border-b border-slate-100 bg-violet-50">
                    <p className="text-sm font-semibold text-violet-600 mb-2">已選擇 {customPlaces.length} 個地點：</p>
                    <div className="space-y-2">
                      {customPlaces.map((place, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-3">
                          <span className="text-2xl">{place.icon}</span>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{place.title}</p>
                            <p className="text-xs text-slate-500">{place.desc}</p>
                          </div>
                          <button onClick={() => removeCustomPlace(i)} className="p-1 text-red-500">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="p-4 max-h-64 overflow-y-auto">
                  <p className="text-sm text-slate-400 mb-3">{filteredSuggestions.length} 個建議地點</p>
                  <div className="space-y-2">
                    {filteredSuggestions.slice(0, 10).map((place, i) => (
                      <button
                        key={i}
                        onClick={() => addCustomPlace(place)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                      >
                        <span className="text-2xl">{place.icon}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{place.title}</p>
                          <p className="text-xs text-slate-500">{place.desc}</p>
                        </div>
                        <Plus className="w-5 h-5 text-violet-500" />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 border-t border-slate-100">
                  <button
                    onClick={() => setShowSearch(false)}
                    className="w-full py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl"
                  >
                    完成
                  </button>
                </div>
              </div>
            )}

            {!showSearch && (
              <button
                onClick={() => setShowSearch(true)}
                className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border-2 border-dashed border-violet-200 text-violet-600 font-semibold hover:from-violet-100 hover:to-purple-100 transition-all"
              >
                <Plus className="w-5 h-5" />
                加入自訂地點
              </button>
            )}

            {/* Trip Type */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-violet-500" />
                行程類型
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {TRIP_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setTripType(type.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      tripType === type.id
                        ? 'border-violet-500 bg-violet-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-3xl mb-2 block">{type.icon}</span>
                    <h3 className="font-bold text-slate-900">{type.label}</h3>
                    <p className="text-xs text-slate-500 mt-1">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Days */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                行程天數
              </h2>
              <div className="flex gap-2">
                {[1, 2, 3, 5, 7].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDays(d)}
                    className={`flex-1 py-4 rounded-2xl font-bold transition-all ${
                      days === d
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {d}日
                  </button>
                ))}
              </div>
            </div>

            {/* Companions */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-500" />
                同行人數
              </h2>
              <div className="flex gap-2">
                {[
                  { id: 'solo', label: '獨自', icon: '🧑' },
                  { id: 'couple', label: '情侶', icon: '💑' },
                  { id: 'family', label: '家庭', icon: '👨‍👩‍👧' },
                  { id: 'friends', label: '朋友', icon: '👯' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCompanions(c.id)}
                    className={`flex-1 py-3 rounded-2xl font-semibold transition-all flex flex-col items-center gap-1 ${
                      companions === c.id
                        ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{c.icon}</span>
                    <span className="text-xs">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!tripType || generating}
              className="w-full py-5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white font-bold rounded-2xl shadow-xl shadow-violet-200 hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {generating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>AI 規劃中...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>生成 {currentCity?.flag} {currentCity?.name} 行程</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-slide-up">
            <button
              onClick={() => { setShowResult(false); setCurrentTrip(null); }}
              className="flex items-center gap-2 text-slate-500 font-medium"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
              重新規劃
            </button>

            {/* Trip Header */}
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 rounded-3xl p-5 text-white">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{currentCity?.flag}</span>
                <div>
                  <h2 className="text-xl font-extrabold">{currentCity?.name} {tripTypeLabels[currentTrip.type]}</h2>
                  <p className="text-white/80 text-sm">
                    {currentCity?.country} • {currentTrip.days} 日遊
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={saveTrip} className="flex-1 py-3 bg-white/20 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/30 transition-all">
                  <Save className="w-5 h-5" />
                  保存
                </button>
                <button onClick={() => shareTrip(currentTrip)} className="flex-1 py-3 bg-white/20 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/30 transition-all">
                  <Share2 className="w-5 h-5" />
                  分享
                </button>
              </div>
            </div>

            {/* Itinerary */}
            {currentTrip.itinerary.map((day) => (
              <div key={day.day} className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-lg">{day.date}</h3>
                </div>
                <div className="p-4 space-y-3">
                  {day.activities.map((activity, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl">
                          {activity.icon}
                        </div>
                        {i < day.activities.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 my-1" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <span className="text-xs font-semibold text-violet-500 bg-violet-50 px-2 py-0.5 rounded">{activity.time}</span>
                        <h4 className="font-bold text-slate-900 mt-1">{activity.title}</h4>
                        <p className="text-sm text-slate-500 mt-0.5">{activity.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Saved Trips */}
            {savedTrips.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-900 mb-3">已保存的行程</h3>
                <div className="space-y-2">
                  {savedTrips.map((trip) => {
                    const city = CITIES.find(c => c.id === trip.city)
                    return (
                      <div key={trip.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{city?.flag}</span>
                          <div>
                            <h4 className="font-semibold text-slate-900">{city?.name} {tripTypeLabels[trip.type]}</h4>
                            <p className="text-xs text-slate-400">{trip.days} 日遊</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => shareTrip(trip)} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200">
                            <Share2 className="w-4 h-4 text-slate-500" />
                          </button>
                          <button onClick={() => deleteTrip(trip.id)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
