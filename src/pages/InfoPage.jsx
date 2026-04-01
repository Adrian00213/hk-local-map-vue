import { useState, useEffect } from 'react'
import { Utensils, Star, ThumbsUp, MapPin, Navigation, Clock, Search, Filter, X, Calendar, AlertCircle, Users } from 'lucide-react'
import { getNearbyRestaurants, getTopRatedRestaurants, getRestaurantsByCuisine, getCuisineTypes, formatPrice, getPopularityScore, initRestaurants } from '../services/restaurantApi'
import { getAllEvents, formatEventDate, parseEventDates, getEventStatus, getOrgCategory } from '../services/eventsApi'

export default function InfoPage() {
  const [activeTab, setActiveTab] = useState('nearby') // 'nearby', 'top', 'events'
  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [nearbyRestaurants, setNearbyRestaurants] = useState([])
  const [topRestaurants, setTopRestaurants] = useState([])
  const [cuisineFilter, setCuisineFilter] = useState('')
  const [cuisineTypes, setCuisineTypes] = useState([])
  const [filteredRestaurants, setFilteredRestaurants] = useState([])
  const [restaurantsLoaded, setRestaurantsLoaded] = useState(false)

  // Get user location and load restaurant data
  useEffect(() => {
    const loadData = async () => {
      await initRestaurants()
      setRestaurantsLoaded(true)
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const loc = {
              lat: position.coords.latitude,
              lon: position.coords.longitude
            }
            setUserLocation(loc)
            setNearbyRestaurants(getNearbyRestaurants(loc.lat, loc.lon, 5).slice(0, 20))
          },
          () => {
            const defaultLoc = { lat: 22.3193, lon: 114.1694 }
            setUserLocation(defaultLoc)
            setNearbyRestaurants(getNearbyRestaurants(defaultLoc.lat, defaultLoc.lon, 5).slice(0, 20))
          }
        )
      }
      setTopRestaurants(getTopRatedRestaurants(50))
      setCuisineTypes(getCuisineTypes().slice(0, 20))
    }
    loadData()
  }, [])

  // Load events when tab is selected
  useEffect(() => {
    if (activeTab === 'events' && events.length === 0) {
      const loadEvents = async () => {
        setEventsLoading(true)
        const data = await getAllEvents()
        setEvents(data)
        setEventsLoading(false)
      }
      loadEvents()
    }
  }, [activeTab])

  // Filter restaurants when cuisine changes
  useEffect(() => {
    if (!cuisineFilter) {
      setFilteredRestaurants(topRestaurants)
    } else {
      setFilteredRestaurants(getRestaurantsByCuisine(cuisineFilter).slice(0, 30))
    }
  }, [cuisineFilter, topRestaurants])

  return (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 shadow-sm z-10 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Utensils className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">🦐 美食指南</h1>
            <p className="text-sm text-gray-500">OpenRice 數據 · {topRestaurants.length}+ 間餐廳</p>
          </div>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('nearby')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'nearby'
                ? 'bg-white dark:bg-gray-600 text-orange-500 shadow-sm'
                : 'text-gray-500 dark:text-gray-300'
            }`}
          >
            <Navigation className="w-4 h-4" />
            附近
          </button>
          <button
            onClick={() => setActiveTab('top')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'top'
                ? 'bg-white dark:bg-gray-600 text-orange-500 shadow-sm'
                : 'text-gray-500 dark:text-gray-300'
            }`}
          >
            <Star className="w-4 h-4" />
            人氣
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'events'
                ? 'bg-white dark:bg-gray-600 text-blue-500 shadow-sm'
                : 'text-gray-500 dark:text-gray-300'
            }`}
          >
            <Calendar className="w-4 h-4" />
            活動
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* User Location */}
        {userLocation && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>📍 {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}</span>
          </div>
        )}

        {/* Nearby Tab */}
        {activeTab === 'nearby' && (
          <div className="space-y-4">
            {!restaurantsLoaded ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-500">載入餐廳資料...</p>
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm text-center">
                    <p className="text-2xl font-bold text-orange-500">{nearbyRestaurants.length}</p>
                    <p className="text-xs text-gray-500">附近餐廳</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm text-center">
                    <p className="text-2xl font-bold text-green-500">
                      {nearbyRestaurants.filter(r => getPopularityScore(r) > 70).length}
                    </p>
                    <p className="text-xs text-gray-500">高評價</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm text-center">
                    <p className="text-2xl font-bold text-blue-500">
                      {nearbyRestaurants.filter(r => r.distance && r.distance < 1).length}
                    </p>
                    <p className="text-xs text-gray-500">1km內</p>
                  </div>
                </div>

                {/* Restaurant List */}
                <div className="space-y-3">
                  {nearbyRestaurants.map((r, idx) => {
                    const score = getPopularityScore(r)
                    return (
                      <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-2xl">
                            🍜
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 dark:text-white truncate">{r.restaurant_name}</h3>
                                <p className="text-xs text-gray-500 truncate mt-0.5">{r.address || r.Districts}</p>
                              </div>
                              {r.distance && (
                                <span className="text-sm font-medium text-orange-500 shrink-0">
                                  {r.distance < 1 ? `${(r.distance * 1000).toFixed(0)}m` : `${r.distance.toFixed(1)}km`}
                                </span>
                              )}
                            </div>
                            
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mt-2">
                              {r.type1 && (
                                <span className="px-2 py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 text-xs rounded-lg">
                                  {r.type1}
                                </span>
                              )}
                              {r.avg_price && (
                                <span className="px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 text-xs rounded-lg">
                                  {formatPrice(r.avg_price)}
                                </span>
                              )}
                              <span className={`px-2 py-1 text-xs rounded-lg ${
                                score > 70 ? 'bg-green-50 text-green-600' : score > 50 ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-100 text-gray-500'
                              }`}>
                                👍 {r.smiles}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-2 mt-3">
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${r.lat},${r.lon}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 px-3 bg-orange-500 text-white text-sm font-medium rounded-xl text-center flex items-center justify-center gap-1"
                          >
                            <Navigation className="w-4 h-4" />
                            導航
                          </a>
                          {r.lat && r.lon && (
                            <a
                              href={`https://www.openrice.com/api/poi/v2/search?searchText=${encodeURIComponent(r.restaurant_name)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-2 px-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-xl text-center flex items-center justify-center gap-1"
                            >
                              <Search className="w-4 h-4" />
                              OpenRice
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Top Rated Tab */}
        {activeTab === 'top' && (
          <div className="space-y-4">
            {/* Cuisine Filter */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-500">美食類型</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCuisineFilter('')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    !cuisineFilter 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  全部
                </button>
                {cuisineTypes.slice(0, 12).map((type) => (
                  <button
                    key={type}
                    onClick={() => setCuisineFilter(type)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      cuisineFilter === type
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Restaurants */}
            <div className="space-y-3">
              {(cuisineFilter ? filteredRestaurants : topRestaurants).slice(0, 30).map((r, idx) => {
                const score = getPopularityScore(r)
                return (
                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 dark:text-white">{r.restaurant_name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{r.Districts} · {r.type1}</p>
                        
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-sm">
                            <ThumbsUp className="w-4 h-4 text-green-500" />
                            <span className="font-medium text-green-600">{r.smiles}</span>
                          </span>
                          {r.avg_price && (
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {formatPrice(r.avg_price)}
                            </span>
                          )}
                        </div>
                      </div>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${r.lat},${r.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-500"
                      >
                        <Navigation className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                <p className="text-2xl font-bold text-blue-500">{events.length}</p>
                <p className="text-xs text-gray-500">活動總數</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                <p className="text-2xl font-bold text-green-500">
                  {events.filter(e => e.event_status === 'A').length}
                </p>
                <p className="text-xs text-gray-500">可報名</p>
              </div>
            </div>

            {/* Events List */}
            {eventsLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-500">載入活動中...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {events.slice(0, 20).map((event) => (
                  <div 
                    key={event.event_id}
                    onClick={() => setSelectedEvent(event)}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                        <Calendar className="w-6 h-6 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 dark:text-white line-clamp-2">
                          {event.event_summary}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.event_org}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          event.event_status === 'A' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {event.event_status === 'A' ? '✅ 可報名' : getEventStatus(event.event_status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Data Source */}
            <div className="text-center text-xs text-gray-400 py-4">
              <p>📡 數據來源：香港政府一站通</p>
            </div>
          </div>
        )}

        {/* Data Source */}
        {activeTab !== 'events' && (
          <div className="text-center text-xs text-gray-400 py-4">
            <p>📡 數據來源：OpenRice · 香港區餐廳</p>
          </div>
        )}

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setSelectedEvent(null)}
          >
            <div 
              className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">活動詳情</h2>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Title & Status */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      selectedEvent.event_status === 'A' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {selectedEvent.event_status === 'A' ? '✅ 接受報名' : getEventStatus(selectedEvent.event_status)}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                      {getOrgCategory(selectedEvent.event_org)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedEvent.event_summary}</h3>
                </div>

                {/* Info Cards */}
                <div className="space-y-3">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">地點</p>
                      <p className="text-sm text-gray-500">{selectedEvent.event_location}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">日期</p>
                      <p className="text-sm text-gray-500">
                        {selectedEvent.event_start_date} 至 {selectedEvent.event_end_date}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 flex items-start gap-3">
                    <Users className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">主辦機構</p>
                      <p className="text-sm text-gray-500">{selectedEvent.event_org}</p>
                    </div>
                  </div>
                </div>

                {/* ICS Download */}
                {selectedEvent.event_ics && (
                  <a
                    href={selectedEvent.event_ics}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 bg-blue-500 text-white text-center font-medium rounded-xl flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    加入行事曆
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
