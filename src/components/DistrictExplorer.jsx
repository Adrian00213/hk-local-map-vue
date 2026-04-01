import { useState, useEffect } from 'react'
import { MapPin, ChevronRight, Star, Utensils, Lightbulb, Shuffle, Compass, X } from 'lucide-react'
import { DISTRICT_DATA, getRandomDistrict, getTodayDistrict } from '../data/districtData'

export default function DistrictExplorer({ onSelectDistrict }) {
  const [todayDistrict, setTodayDistrict] = useState(null)
  const [randomDistrict, setRandomDistrict] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    setTodayDistrict(getTodayDistrict())
    setRandomDistrict(getRandomDistrict())
  }, [])

  const handleShuffle = () => {
    setRandomDistrict(getRandomDistrict())
  }

  if (!todayDistrict) return null

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <Compass className="w-6 h-6 text-orange-500" />
          十八區深度遊
        </h2>
        <p className="text-gray-500 mt-1">探索香港每一個角落</p>
      </div>

      {/* Today's District */}
      {randomDistrict && (
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 bg-white/20 rounded-full">✨ 今日推薦</span>
            </div>
            <button 
              onClick={handleShuffle}
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-5xl">{randomDistrict.icon}</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{randomDistrict.name}</h3>
              <p className="text-sm text-white/80">{randomDistrict.tagline}</p>
            </div>
          </div>
          
          <p className="mt-3 text-sm text-white/90 leading-relaxed">
            {randomDistrict.description}
          </p>
          
          <button
            onClick={() => onSelectDistrict?.(randomDistrict.key)}
            className="mt-4 w-full py-3 bg-white text-orange-600 font-semibold rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <MapPin className="w-4 h-4" />
            探索 {randomDistrict.name}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Categories */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setShowAll(!showAll)}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-2 hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
            <span className="text-xl">🗺️</span>
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">全部18區</span>
        </button>
        
        <button
          onClick={() => onSelectDistrict?.('中西區')}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-2 hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 flex items-center justify-center">
            <span className="text-xl">🏛️</span>
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">中西區</span>
        </button>
        
        <button
          onClick={() => onSelectDistrict?.('油尖旺')}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-2 hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 flex items-center justify-center">
            <span className="text-xl">✨</span>
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">油尖旺</span>
        </button>
      </div>

      {/* All Districts Grid */}
      {showAll && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(DISTRICT_DATA).map(([key, d]) => (
              <button
                key={key}
                onClick={() => onSelectDistrict?.(key)}
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                <span className="text-xl">{d.icon}</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{d.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* District Detail (Expandable) */}
      {Object.entries(DISTRICT_DATA).slice(0, showAll ? 18 : 3).map(([key, d]) => (
        <div 
          key={key}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <button
            onClick={() => setExpanded(expanded === key ? null : key)}
            className="w-full p-4 flex items-center gap-3"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${d.color} flex items-center justify-center text-2xl`}>
              {d.icon}
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-bold text-gray-900 dark:text-white">{d.name}</h4>
              <p className="text-xs text-gray-500">{d.tagline}</p>
            </div>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expanded === key ? 'rotate-90' : ''}`} />
          </button>
          
          {expanded === key && (
            <div className="px-4 pb-4 space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{d.description}</p>
              
              <div>
                <h5 className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                  <Star className="w-3 h-3" /> 必去推介
                </h5>
                <div className="space-y-1">
                  {d.highlights.map((h, i) => (
                    <p key={i} className="text-sm text-gray-700 dark:text-gray-300">• {h}</p>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                  <Utensils className="w-3 h-3" /> 區之選
                </h5>
                <div className="space-y-1">
                  {d.food.map((f, i) => (
                    <p key={i} className="text-sm text-gray-700 dark:text-gray-300">• {f}</p>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" /> 冷知識
                </h5>
                <div className="space-y-1">
                  {d.secrets.map((s, i) => (
                    <p key={i} className="text-sm text-gray-700 dark:text-gray-300">• {s}</p>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => onSelectDistrict?.(key)}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              >
                <MapPin className="w-4 h-4" />
                探索 {d.name}
              </button>
            </div>
          )}
        </div>
      ))}
      
      {!showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-3 text-orange-500 font-medium text-sm flex items-center justify-center gap-1"
        >
          查看更多地區
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
