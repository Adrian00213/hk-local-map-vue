import { useState, useEffect } from 'react'
import { Search, MapPin, Clock, TrendingUp, X, Sparkles, Navigation } from 'lucide-react'
import { useMap, CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'

// Smart search suggestions based on context
const getSmartSuggestions = () => {
  const hour = new Date().getHours()
  const isWeekend = [0, 6].includes(new Date().getDay())
  
  const suggestions = {
    timeBased: [],
    popular: [
      { text: '茶餐廳', icon: '🍜', cat: 'restaurants' },
      { text: '優惠', icon: '💰', cat: 'deals' },
      { text: '好去處', icon: '🎯', cat: 'places' },
      { text: '咖啡店', icon: '☕', cat: 'restaurants' },
      { text: '商場', icon: '🛍️', cat: 'places' },
      { text: '巴士站', icon: '🚌', cat: 'transport' },
      { text: '港鐵站', icon: '🚇', cat: 'transport' },
    ],
    contextual: []
  }
  
  // Time-based suggestions
  if (hour >= 5 && hour < 11) {
    suggestions.timeBased = [
      { text: '早餐', icon: '🍳', cat: 'restaurants' },
      { text: '茶餐廳', icon: '🍜', cat: 'restaurants' },
    ]
  } else if (hour >= 11 && hour < 14) {
    suggestions.timeBased = [
      { text: '午餐', icon: '🍜', cat: 'restaurants' },
      { text: '快餐', icon: '🍔', cat: 'restaurants' },
    ]
  } else if (hour >= 17 && hour < 21) {
    suggestions.timeBased = [
      { text: '晚餐', icon: '🍽️', cat: 'restaurants' },
      { text: '餐廳', icon: '🍜', cat: 'restaurants' },
    ]
  } else if (hour >= 21 || hour < 5) {
    suggestions.timeBased = [
      { text: '夜宵', icon: '🌙', cat: 'restaurants' },
      { text: '便利店', icon: '🏪', cat: 'places' },
    ]
  }
  
  if (isWeekend) {
    suggestions.contextual = [
      { text: '好去處', icon: '🎯', cat: 'places' },
      { text: '商場', icon: '🛍️', cat: 'places' },
    ]
  }
  
  return suggestions
}

const RECENT_SEARCHES_KEY = 'hk_recent_searches'

export default function SearchView() {
  const { markers } = useMap()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState(null)
  const [recentSearches, setRecentSearches] = useState([])
  const [showRecent, setShowRecent] = useState(true)
  const [suggestions, setSuggestions] = useState({ timeBased: [], popular: [], contextual: [] })

  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY)
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
    setSuggestions(getSmartSuggestions())
  }, [])

  const saveSearch = (text) => {
    if (!text.trim()) return
    const updated = [text, ...recentSearches.filter(s => s !== text)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  }

  const clearRecent = (text) => {
    const updated = recentSearches.filter(s => s !== text)
    setRecentSearches(updated)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  }

  const clearAllRecent = () => {
    setRecentSearches([])
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  }

  const results = markers.filter(m => {
    const matchQ = !q || 
      m.title.toLowerCase().includes(q.toLowerCase()) || 
      m.description?.toLowerCase().includes(q.toLowerCase()) || 
      m.contact?.toLowerCase().includes(q.toLowerCase())
    const matchCat = !cat || m.category === cat
    return matchQ && matchCat
  })

  const handleSearch = (searchText) => {
    setQ(searchText)
    setShowRecent(false)
    saveSearch(searchText)
  }

  const handleInputChange = (e) => {
    setQ(e.target.value)
    setShowRecent(e.target.value === '')
  }

  const handleClear = () => {
    setQ('')
    setCat(null)
    setShowRecent(true)
  }

  return (
    <div className="h-full w-full flex flex-col bg-zinc-50">
      {/* Search Header */}
      <div className="bg-white border-b border-zinc-100/80 px-5 pt-5 pb-4">
        <h1 className="text-2xl font-bold text-zinc-900 mb-4">🔍 搜尋</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            value={q}
            onChange={handleInputChange}
            onFocus={() => setShowRecent(true)}
            placeholder="搜尋餐廳、優惠、好去處..."
            className="w-full pl-12 pr-12 py-4 bg-zinc-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all placeholder:text-zinc-400"
          />
          {q && (
            <button 
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-200 hover:bg-zinc-300 flex items-center justify-center transition-colors active:scale-95"
            >
              <X className="w-4 h-4 text-zinc-500" />
            </button>
          )}
        </div>
        
        {/* Category Filters */}
        <div className="flex gap-2 mt-4 overflow-x-auto">
          <button
            onClick={() => setCat(null)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all active:scale-95 ${
              !cat ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 active:bg-zinc-300'
            }`}
          >
            全部
          </button>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setCat(k)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 ${
                cat === k ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 active:bg-zinc-300'
              }`}
            >
              <span>{CATEGORY_ICONS[k]}</span>
              <span>{v}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* Show when input is empty */}
        {showRecent && !q && (
          <div className="space-y-6 animate-fade-in">
            {/* Time-based Suggestions */}
            {suggestions.timeBased.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-zinc-500 flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4" />
                  而家啱啱好
                </h3>
                <div className="flex flex-wrap gap-2">
                  {suggestions.timeBased.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearch(s.text)}
                      className="px-4 py-2.5 bg-amber-50 border border-amber-200/50 rounded-xl text-sm font-medium text-amber-700 flex items-center gap-1.5 hover:bg-amber-100 active:scale-95 transition-all"
                    >
                      <span>{s.icon}</span>
                      {s.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-zinc-500 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    最近搜尋
                  </h3>
                  <button 
                    onClick={clearAllRecent}
                    className="text-xs text-zinc-400 hover:text-zinc-600"
                  >
                    清除全部
                  </button>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-zinc-100/80">
                      <Clock className="w-4 h-4 text-zinc-300" />
                      <button 
                        onClick={() => handleSearch(s)}
                        className="flex-1 text-left text-sm text-zinc-700"
                      >
                        {s}
                      </button>
                      <button 
                        onClick={() => clearRecent(s)}
                        className="w-6 h-6 rounded-full hover:bg-zinc-100 flex items-center justify-center"
                      >
                        <X className="w-3 h-3 text-zinc-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div>
              <h3 className="text-sm font-bold text-zinc-500 flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4" />
                熱門搜尋
              </h3>
              <div className="flex flex-wrap gap-2">
                {suggestions.popular.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearch(s.text)}
                    className="px-4 py-2.5 bg-white border border-zinc-200/80 rounded-xl text-sm font-medium text-zinc-700 flex items-center gap-1.5 hover:bg-zinc-50 active:scale-95 transition-all"
                  >
                    <span>{s.icon}</span>
                    <span>{s.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contextual Suggestions */}
            {suggestions.contextual.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-zinc-500 flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4" />
                  週末精選
                </h3>
                <div className="flex flex-wrap gap-2">
                  {suggestions.contextual.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearch(s.text)}
                      className="px-4 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-xl text-sm font-medium text-amber-700 flex items-center gap-1.5 hover:bg-amber-100 active:scale-95 transition-all"
                    >
                      <span>{s.icon}</span>
                      {s.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search Results */}
        {q && (
          <div>
            <p className="text-sm text-zinc-400 mb-4 font-medium">
              {results.length === 0 ? '搵唔到' : `搵到 ${results.length} 個結果`}
            </p>

            {results.length === 0 ? (
              <div className="text-center py-16 animate-fade-in">
                <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-zinc-100 flex items-center justify-center">
                  <Search className="w-10 h-10 text-zinc-300" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-700 mb-2">搵唔到你想要嘅</h3>
                <p className="text-sm text-zinc-400 mb-4">試下其他關鍵字啦</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['茶餐廳', '優惠', 'café', '商場', '港鐵站'].map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearch(s)}
                      className="px-3 py-1.5 bg-amber-50 text-amber-600 text-sm rounded-lg hover:bg-amber-100 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3 stagger-children">
                {results.map(m => (
                  <div key={m.id} className="bg-white rounded-2xl p-4 shadow-sm border border-zinc-100/80 card-hover active:scale-[0.98] transition-transform">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center text-xl shrink-0">
                        {CATEGORY_ICONS[m.category]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-zinc-900 text-base leading-tight mb-1.5">{m.title}</h3>
                        <span className="inline-block px-2.5 py-0.5 bg-amber-50 text-amber-600 text-xs font-medium rounded-full">
                          {CATEGORY_LABELS[m.category]}
                        </span>
                        {m.description && (
                          <p className="text-sm text-zinc-500 mt-2 leading-relaxed line-clamp-2">{m.description}</p>
                        )}
                        {m.contact && (
                          <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-400">
                            <MapPin size={12} />
                            <span>{m.contact}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
