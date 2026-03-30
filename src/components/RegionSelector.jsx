import { useState, useEffect } from 'react'
import { Globe, MapPin, ChevronDown, Check } from 'lucide-react'

const REGIONS = [
  { 
    id: 'hong_kong', 
    name: '🇭🇰 香港', 
    lang: '繁體',
    mapType: 'google',
    description: 'Google Maps 地圖'
  },
  { 
    id: 'china', 
    name: '🇨🇳 大陸', 
    lang: '簡體',
    mapType: 'amap',
    description: '高德/騰訊地圖'
  },
  { 
    id: 'global', 
    name: '🌏 全球', 
    lang: 'English',
    mapType: 'osm',
    description: 'OpenStreetMap'
  },
  {
    id: 'taiwan',
    name: '🇹🇼 台灣',
    lang: '繁體',
    mapType: 'google',
    description: 'Google Maps 地圖'
  },
  {
    id: 'japan',
    name: '🇯🇵 日本',
    lang: '日本語',
    mapType: 'google',
    description: 'Google Maps 地圖'
  },
  {
    id: 'korea',
    name: '🇰🇷 韓國',
    lang: '한국어',
    mapType: 'google',
    description: 'Google Maps 地圖'
  },
  {
    id: 'se_asia',
    name: '🌴 東南亞',
    lang: 'English',
    mapType: 'google',
    description: '泰國/新加坡/馬來西亞'
  },
  {
    id: 'europe',
    name: '🇪🇺 歐洲',
    lang: 'English',
    mapType: 'osm',
    description: 'OpenStreetMap'
  }
]

export default function RegionSelector({ currentRegion, onRegionChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [autoDetected, setAutoDetected] = useState(false)
  
  const current = REGIONS.find(r => r.id === currentRegion) || REGIONS[0]

  useEffect(() => {
    // Auto detect region based on browser language
    const lang = navigator.language || ''
    
    if (lang.toLowerCase().includes('zh-cn')) {
      setAutoDetected('china')
    } else if (lang.toLowerCase().includes('zh-tw') || lang.toLowerCase().includes('zh-hk')) {
      setAutoDetected('hong_kong')
    } else {
      setAutoDetected('hong_kong') // Default
    }
  }, [])

  const handleRegionSelect = (regionId) => {
    onRegionChange(regionId)
    setIsOpen(false)
    localStorage.setItem('hk_selected_region', regionId)
  }

  return (
    <div className="relative">
      {/* Current Region Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur rounded-xl shadow-md hover:bg-white transition-all active:scale-95"
      >
        <Globe className="w-4 h-4 text-amber-500" />
        <span className="text-sm font-medium text-zinc-700">{current.name}</span>
        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Menu */}
          <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-2xl shadow-xl border border-zinc-100/80 overflow-hidden z-50 animate-slide-up">
            <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100/50">
              <p className="text-xs text-amber-700 font-medium">🌍 選擇地區 / Select Region</p>
              {autoDetected && autoDetected !== currentRegion && (
                <button 
                  onClick={() => handleRegionSelect(autoDetected)}
                  className="mt-1 text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3" />
                  自動偵測到: {REGIONS.find(r => r.id === autoDetected)?.name}
                </button>
              )}
            </div>
            
            <div className="max-h-80 overflow-y-auto p-2">
              {REGIONS.map((region) => (
                <button
                  key={region.id}
                  onClick={() => handleRegionSelect(region.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all active:scale-[0.98] ${
                    region.id === currentRegion 
                      ? 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200' 
                      : 'hover:bg-zinc-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-lg">
                    {region.name.split(' ')[0]}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-zinc-900 text-sm">{region.name.split(' ')[1]}</p>
                    <p className="text-xs text-zinc-500">{region.description}</p>
                  </div>
                  {region.id === currentRegion && (
                    <Check className="w-5 h-5 text-amber-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
