import { useState, useEffect } from 'react'
import { Bus, Search, MapPin, Navigation, Clock, ArrowRight, ChevronRight, Train, Activity, X, Route, Locate, Crosshair } from 'lucide-react'
import { getStopList, getStopETA, getRouteList, getRouteETA, getRouteStopList, formatETA } from '../services/kmbApi'
import { MTR_LINES, MTR_STATIONS, getMTRSchedule, formatMinutes, getStationName } from '../services/mtrApi'
import { getTrafficData, getTrafficColor, getDistrictSummary } from '../services/trafficApi'

// Calculate distance between two coordinates
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export default function TransportationPage() {
  const [activeTab, setActiveTab] = useState('nearby') // 'nearby', 'bus', 'mtr', 'traffic'
  
  // User Location
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)
  
  // MTR State
  const [selectedMTRLine, setSelectedMTRLine] = useState(null)
  const [selectedMTRStation, setSelectedMTRStation] = useState(null)
  const [mtrSchedule, setMTRSchedule] = useState(null)
  const [mtrLoading, setMTRLoading] = useState(false)
  
  // Nearby State
  const [nearbyStations, setNearbyStations] = useState([])
  const [nearbyStops, setNearbyStops] = useState([])
  
  // Traffic State
  const [trafficData, setTrafficData] = useState([])
  const [districtSummary, setDistrictSummary] = useState([])
  
  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude }
          setUserLocation(loc)
          loadNearbyData(loc)
        },
        (error) => {
          console.error('Location error:', error)
          setLocationError('無法獲取位置')
          // Use default Hong Kong center
          const defaultLoc = { lat: 22.3193, lng: 114.1694 }
          setUserLocation(defaultLoc)
          loadNearbyData(defaultLoc)
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    } else {
      setLocationError('瀏覽器不支持定位')
      const defaultLoc = { lat: 22.3193, lng: 114.1694 }
      setUserLocation(defaultLoc)
      loadNearbyData(defaultLoc)
    }
  }, [])
  
  // Load nearby MTR stations and bus stops
  const loadNearbyData = (loc) => {
    // Calculate distances for all MTR stations
    const allStations = []
    Object.entries(MTR_STATIONS).forEach(([lineCode, stations]) => {
      stations.forEach(station => {
        // Approximate station coordinates
        const stationCoords = getApproximateCoords(station.code, lineCode)
        const distance = getDistance(loc.lat, loc.lng, stationCoords.lat, stationCoords.lng)
        allStations.push({
          ...station,
          lineCode,
          distance,
          lineColor: MTR_LINES[lineCode]?.color
        })
      })
    })
    
    // Sort by distance and take nearest
    const nearest = allStations.sort((a, b) => a.distance - b.distance).slice(0, 8)
    setNearbyStations(nearest)
    
    // Generate nearby bus stops (mock)
    const mockStops = [
      { code: 'BUS001', name: '港鐵旺角站', name_tc: '港鐵旺角站', distance: 0.3, routes: ['1', '2', '6'] },
      { code: 'BUS002', name: '旺角街市', name_tc: '旺角街市', distance: 0.5, routes: ['10', '25'] },
      { code: 'BUS003', name: '港鐵太子站', name_tc: '港鐵太子站', distance: 0.7, routes: ['1A', '42'] },
      { code: 'BUS004', name: '旺角中心', name_tc: '旺角中心', distance: 0.4, routes: ['14', '30X'] },
      { code: 'BUS005', name: '朗豪坊', name_tc: '朗豪坊', distance: 0.6, routes: ['N21'] },
    ].map(s => ({ ...s, distance: s.distance + (Math.random() - 0.5) * 0.2 }))
      .sort((a, b) => a.distance - b.distance)
    setNearbyStops(mockStops)
  }
  
  // Approximate MTR station coordinates
  const getApproximateCoords = (stationCode, lineCode) => {
    // Known coordinates for major stations
    const coords = {
      'CEN': { lat: 22.2793, lng: 114.1581 }, // Central
      'ADM': { lat: 22.2803, lng: 114.1612 }, // Admiralty
      'TST': { lat: 22.2944, lng: 114.1725 }, // Tsim Sha Tsui
      'MOK': { lat: 22.3171, lng: 114.1717 }, // Mong Kok
      'PRE': { lat: 22.3193, lng: 114.1694 }, // Prince Edward
      'HUH': { lat: 22.3019, lng: 114.1818 }, // Hung Hom
      'KOT': { lat: 22.3299, lng: 114.1754 }, // Kowloon Tong
      'TAW': { lat: 22.3606, lng: 114.1766 }, // Tai Wai
      'SHT': { lat: 22.3708, lng: 114.1878 }, // Sha Tin
    }
    if (coords[stationCode]) return coords[stationCode]
    // Return approximate based on line
    return { lat: 22.3 + Math.random() * 0.1, lng: 114.15 + Math.random() * 0.05 }
  }
  
  // Load traffic data when tab is opened
  useEffect(() => {
    if (activeTab === 'traffic') {
      const loadTraffic = async () => {
        const data = await getTrafficData()
        const summary = await getDistrictSummary()
        setTrafficData(data)
        setDistrictSummary(summary)
      }
      loadTraffic()
    }
  }, [activeTab])
  
  // Bus Search State
  const [busQuery, setBusQuery] = useState('')
  const [kmbRoutes, setKmbRoutes] = useState([])
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [routeStops, setRouteStops] = useState([])
  const [selectedStop, setSelectedStop] = useState(null)
  const [stopETAs, setStopETAs] = useState([])
  const [loading, setLoading] = useState(false)
  const [routeLoading, setRouteLoading] = useState(false)

  // Search KMB routes when query changes
  useEffect(() => {
    const searchRoutes = async () => {
      if (busQuery.length >= 1) {
        setRouteLoading(true)
        const routes = await getRouteList(busQuery)
        setKmbRoutes(routes.slice(0, 30))
        setRouteLoading(false)
      } else {
        setKmbRoutes([])
      }
    }
    searchRoutes()
  }, [busQuery])

  // When route is selected, get its stops
  useEffect(() => {
    const loadRouteStops = async () => {
      if (selectedRoute) {
        setRouteLoading(true)
        const stops = await getRouteStopList(selectedRoute.route, 'O', '1')
        
        // Get stop details for each stop
        const allStops = await getStopList()
        const enrichedStops = stops.map(s => {
          const stopInfo = allStops.find(st => st.stop === s.stop)
          return {
            ...s,
            name_tc: stopInfo?.name_tc || s.stop,
            name_en: stopInfo?.name_en || '',
            name_sc: stopInfo?.name_sc || ''
          }
        }).sort((a, b) => parseInt(a.seq) - parseInt(b.seq))
        
        setRouteStops(enrichedStops)
        setRouteLoading(false)
      } else {
        setRouteStops([])
      }
    }
    loadRouteStops()
  }, [selectedRoute])

  // Get stop ETAs when stop is selected
  useEffect(() => {
    const loadETAs = async () => {
      if (selectedStop) {
        setLoading(true)
        const etas = await getStopETA(selectedStop.stop)
        setStopETAs(etas || [])
        setLoading(false)
      } else {
        setStopETAs([])
      }
    }
    loadETAs()
  }, [selectedStop])

  const handleRouteSelect = (route) => {
    setSelectedRoute(route)
    setSelectedStop(null)
    setStopETAs([])
    setBusQuery('')
  }

  const handleStopSelect = (stop) => {
    setSelectedStop(stop)
  }

  return (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 shadow-sm z-10 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Bus className="w-6 h-6 text-blue-500" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">交通資訊</h1>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('nearby')}
            className={`flex-none py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 ${
              activeTab === 'nearby'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-300'
            }`}
          >
            <Locate className="w-4 h-4" />
            附近
          </button>
          <button
            onClick={() => setActiveTab('bus')}
            className={`flex-none py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 ${
              activeTab === 'bus'
                ? 'bg-white dark:bg-gray-600 text-primary shadow-sm'
                : 'text-gray-500 dark:text-gray-300'
            }`}
          >
            <Bus className="w-4 h-4" />
            巴士
          </button>
          <button
            onClick={() => setActiveTab('mtr')}
            className={`flex-none py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 ${
              activeTab === 'mtr'
                ? 'bg-white dark:bg-gray-600 text-primary shadow-sm'
                : 'text-gray-500 dark:text-gray-300'
            }`}
          >
            <Train className="w-4 h-4" />
            港鐵
          </button>
          <button
            onClick={() => setActiveTab('traffic')}
            className={`flex-none py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 ${
              activeTab === 'traffic'
                ? 'bg-white dark:bg-gray-600 text-primary shadow-sm'
                : 'text-gray-500 dark:text-gray-300'
            }`}
          >
            <Activity className="w-4 h-4" />
            路況
          </button>
        </div>
      </div>

      {/* Content */}
      
      {/* Nearby Tab */}
      {activeTab === 'nearby' && userLocation && (
        <div className="p-4 space-y-4">
          {/* Location Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Locate className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold">📍 你的位置</p>
                  <p className="text-sm opacity-90">
                    {locationError ? '無法獲取精確位置' : '已開啟定位'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => loadNearbyData(userLocation)}
                className="px-3 py-1.5 bg-white/20 rounded-xl text-sm font-medium flex items-center gap-1"
              >
                <Crosshair className="w-4 h-4" />
                重新整理
              </button>
            </div>
          </div>

          {/* Nearby MTR Stations */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Train className="w-5 h-5 text-red-500" />
                  附近港鐵站
                </h3>
                <p className="text-xs text-gray-500 mt-1">按距離排序</p>
              </div>
              <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">
                {nearbyStations.length} 個
              </span>
            </div>
            <div className="space-y-2">
              {nearbyStations.slice(0, 5).map((station, idx) => (
                <div 
                  key={`${station.lineCode}-${station.code}`}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    idx === 0 ? 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200' : 'bg-gray-50 dark:bg-gray-700/50'
                  }`}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: station.lineColor }}
                  >
                    {station.lineCode}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white">{station.name}</p>
                    <p className="text-xs text-gray-500">{MTR_LINES[station.lineCode]?.name_tc} · {station.name_en}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${idx === 0 ? 'text-green-600' : 'text-gray-600 dark:text-gray-300'}`}>
                      {station.distance < 1 ? `${Math.round(station.distance * 1000)}m` : `${station.distance.toFixed(1)}km`}
                    </p>
                    {idx === 0 && (
                      <span className="text-xs text-green-600 font-medium">最近</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Bus Stops */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Bus className="w-5 h-5 text-amber-500" />
                  附近巴士站
                </h3>
                <p className="text-xs text-gray-500 mt-1">按距離排序</p>
              </div>
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-600 rounded-full">
                {nearbyStops.length} 個
              </span>
            </div>
            <div className="space-y-2">
              {nearbyStops.map((stop, idx) => (
                <div 
                  key={stop.code}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    idx === 0 ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200' : 'bg-gray-50 dark:bg-gray-700/50'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                    <Bus className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white">{stop.name_tc}</p>
                    <p className="text-xs text-gray-500 flex gap-1">
                      {stop.routes.slice(0, 3).map(r => (
                        <span key={r} className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">{r}</span>
                      ))}
                      {stop.routes.length > 3 && <span className="text-gray-400">+{stop.routes.length - 3}</span>}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${idx === 0 ? 'text-green-600' : 'text-gray-600 dark:text-gray-300'}`}>
                      {stop.distance < 1 ? `${Math.round(stop.distance * 1000)}m` : `${stop.distance.toFixed(1)}km`}
                    </p>
                    {idx === 0 && (
                      <span className="text-xs text-green-600 font-medium">最近</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Traffic */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  附近路況
                </h3>
                <p className="text-xs text-gray-500 mt-1">基於你嘅位置</p>
              </div>
            </div>
            <div className="space-y-2">
              {trafficData.slice(0, 5).map((road) => (
                <div 
                  key={road.id}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    road.status === 'congested' ? 'bg-red-50 border border-red-100' :
                    road.status === 'moderate' ? 'bg-yellow-50 border border-yellow-100' :
                    'bg-green-50 border border-green-100'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    road.status === 'congested' ? 'bg-red-100' :
                    road.status === 'moderate' ? 'bg-yellow-100' :
                    'bg-green-100'
                  }`}>
                    {road.status === 'congested' ? '🚗💨' : road.status === 'moderate' ? '🚙' : '🚕'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{road.road_tc}</p>
                    <p className="text-xs text-gray-500">{road.district}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${
                      road.status === 'congested' ? 'text-red-600' :
                      road.status === 'moderate' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {road.speed}
                    </p>
                    <p className="text-xs text-gray-400">km/h</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading State for Nearby */}
      {activeTab === 'nearby' && !userLocation && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-500">緊係搵你嘅位置...</p>
          </div>
        </div>
      )}
      <div className="p-4">
        {/* Bus Tab */}
        {activeTab === 'bus' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                <Search className="w-4 h-4" />
                搜尋巴士路線
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={busQuery}
                  onChange={(e) => setBusQuery(e.target.value.toUpperCase())}
                  placeholder="輸入路線號碼..."
                  className="w-full px-4 py-3 pl-10 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 text-lg font-medium"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* Route Results */}
              {routeLoading && (
                <div className="mt-4 text-center py-4">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              )}

              {kmbRoutes.length > 0 && !selectedRoute && (
                <div className="mt-3 space-y-2">
                  {kmbRoutes.slice(0, 15).map((route) => (
                    <button
                      key={`${route.route}-${route.bound}`}
                      onClick={() => handleRouteSelect(route)}
                      className="w-full p-3 text-left bg-yellow-50 dark:bg-yellow-900/20 rounded-xl hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-all flex items-center gap-3"
                    >
                      <span className="w-12 h-12 bg-yellow-500 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                        {route.route}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {route.orig_tc} → {route.dest_tc}
                        </p>
                        <p className="text-xs text-gray-500">
                          {route.orig_en} → {route.dest_en}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Route */}
            {selectedRoute && !selectedStop && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-yellow-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-xl">{selectedRoute.route}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{selectedRoute.route} 號巴士</h3>
                      <p className="text-sm text-gray-500">{selectedRoute.orig_tc} → {selectedRoute.dest_tc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedRoute(null)
                      setRouteStops([])
                      setBusQuery('')
                    }}
                    className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <p className="text-sm text-gray-500 mb-3">
                  👆 選擇車站查看到站時間
                </p>

                {/* Route Stops List */}
                {routeLoading ? (
                  <div className="text-center py-4">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">載入車站中...</p>
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {routeStops.map((stop) => (
                      <button
                        key={stop.stop}
                        onClick={() => handleStopSelect(stop)}
                        className="w-full p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all flex items-center gap-3"
                      >
                        <span className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {stop.seq}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">{stop.name_tc}</p>
                          <p className="text-xs text-gray-500 truncate">{stop.name_en}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Selected Stop & ETAs */}
            {selectedStop && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Bus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{selectedStop.name_tc}</h3>
                      <p className="text-sm text-gray-500">{selectedStop.name_en}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStop(null)
                      setStopETAs([])
                    }}
                    className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    清除
                  </button>
                </div>

                {/* ETAs */}
                {loading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">載入中...</p>
                  </div>
                ) : stopETAs.length > 0 ? (
                  <div className="space-y-2">
                    {stopETAs.slice(0, 8).map((eta, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          index === 0 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'
                        }`}>
                          <span className={`font-bold text-lg ${
                            index === 0 ? 'text-white' : 'text-gray-600 dark:text-gray-200'
                          }`}>{eta.route}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            往 {eta.dir === 'O' ? eta.dest_tc : eta.orig_tc}
                          </p>
                          <p className="text-xs text-gray-500">第 {eta.seq} 站</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xl font-bold ${
                            index === 0 ? 'text-green-500' : 'text-primary'
                          }`}>{formatETA(eta.eta)}</p>
                          <p className="text-xs text-gray-400">
                            {eta.eta_seq ? `第 ${eta.eta_seq} 班` : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-gray-500">暫無到站時間</p>
                )}
              </div>
            )}

            {/* Citybus Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                <Bus className="w-4 h-4 text-red-500" />
                城巴 / 新巴
              </h3>
              <p className="text-sm text-gray-500">
                城巴路線功能準備中，請稍後...
              </p>
              <p className="text-xs text-gray-400 mt-2">
                數據來源：data.etagmb.gov.hk
              </p>
            </div>
          </div>
        )}

        {/* MTR Tab */}
        {activeTab === 'mtr' && (
          <div className="space-y-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-2xl p-4 shadow-lg text-white">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Train className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">🚇 港鐵列車</h2>
                  <p className="text-sm opacity-90">即時到站時間</p>
                </div>
              </div>
            </div>

            {/* Lines */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">選擇港鐵線路</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(MTR_LINES).map(([code, line]) => (
                  <button
                    key={code}
                    onClick={() => {
                      setSelectedMTRLine(code)
                      setSelectedMTRStation(null)
                      setMTRSchedule(null)
                    }}
                    className={`p-4 rounded-2xl text-left transition-all border-2 hover:shadow-md ${
                      selectedMTRLine === code ? 'shadow-md' : ''
                    }`}
                    style={{ 
                      borderColor: selectedMTRLine === code ? line.color : 'transparent',
                      backgroundColor: selectedMTRLine === code ? `${line.color}15` : 'transparent'
                    }}
                  >
                    <p className="font-bold text-lg" style={{ color: line.color }}>{line.name_tc}</p>
                    <p className="text-xs opacity-70 text-gray-500">{line.name_en}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Stations */}
            {selectedMTRLine && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                  選擇車站 · {MTR_LINES[selectedMTRLine]?.name_tc}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {MTR_STATIONS[selectedMTRLine]?.map((station) => (
                    <button
                      key={station.code}
                      onClick={async () => {
                        setSelectedMTRStation(station.code)
                        setMTRLoading(true)
                        const schedule = await getMTRSchedule(selectedMTRLine, station.code, 'TC')
                        setMTRSchedule(schedule)
                        setMTRLoading(false)
                      }}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedMTRStation === station.code
                          ? 'text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                      }`}
                      style={{
                        backgroundColor: selectedMTRStation === station.code ? MTR_LINES[selectedMTRLine]?.color : undefined
                      }}
                    >
                      {station.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Schedule */}
            {selectedMTRStation && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: MTR_LINES[selectedMTRLine]?.color }}
                  >
                    {selectedMTRLine}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {MTR_STATIONS[selectedMTRLine]?.find(s => s.code === selectedMTRStation)?.name_tc}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {MTR_LINES[selectedMTRLine]?.name_tc}
                    </p>
                  </div>
                </div>

                {mtrLoading ? (
                  <div className="text-center py-4">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">載入中...</p>
                  </div>
                ) : !mtrSchedule ? (
                  <div className="text-center py-4 text-gray-500">
                    <p>選擇車站查看時間</p>
                  </div>
                ) : mtrSchedule.status === 0 || mtrSchedule.error ? (
                  <div className="text-center py-4 text-gray-500">
                    <p>{mtrSchedule.message || mtrSchedule.error?.errorMsg || '暫時未能取得數據'}</p>
                    <p className="text-xs mt-2">港鐵 API 有時不穩定，請稍後再試</p>
                  </div>
                ) : mtrSchedule.data && Object.keys(mtrSchedule.data).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(mtrSchedule.data).map(([key, stationData]) => {
                      // API returns: { "TWL-TST": { "UP": [...], "DOWN": [...] } }
                      // So stationData = { UP: [...], DOWN: [...] }
                      const directions = stationData || {}
                      return Object.entries(directions).map(([dirKey, trains]) => {
                        if (!Array.isArray(trains) || trains.length === 0) return null
                        return (
                          <div key={`${key}-${dirKey}`}>
                            <p className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                              {dirKey === 'UP' ? '↑ 上行' : '↓ 下行'}
                              <span className="text-xs font-normal text-gray-400">
                                → {getStationName(trains[0]?.dest)?.name_tc || trains[0]?.dest || '終點'}
                              </span>
                            </p>
                            {trains.slice(0, 4).map((train, idx) => (
                              <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl mb-2 ${
                                idx === 0 ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-700/50'
                              }`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                                  idx === 0 ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-200'
                                }`}>
                                  {train.ttnt === '0' ? '🚉' : train.ttnt}
                                </div>
                                <div className="flex-1">
                                  <p className={`font-bold text-lg ${idx === 0 ? 'text-green-600' : 'text-gray-700 dark:text-gray-200'}`}>
                                    {formatMinutes(train.ttnt)}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {train.plat ? `月台 ${train.plat}` : ''}
                                  </p>
                                </div>
                                {idx === 0 && (
                                  <div className="flex flex-col items-center">
                                    <span className="px-2.5 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">下一班</span>
                                    {trains[1] && (
                                      <span className="text-xs text-gray-400 mt-1">第2班: {formatMinutes(trains[1].ttnt)}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )
                      })
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>暫無到站數據</p>
                  </div>
                )}
              </div>
            )}

            {/* Info */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-4 shadow-lg text-white">
              <h3 className="font-bold mb-2">📍 實用資訊</h3>
              <div className="space-y-2 text-sm">
                <p>🚇 港鐵路線：10條</p>
                <p>🚉 車站數目：99個</p>
                <p>⏰ 服務時間：05:55 - 01:00</p>
              </div>
            </div>
          </div>
        )}

        {/* Traffic Tab */}
        {activeTab === 'traffic' && (
          <div className="space-y-4">
            {/* Greeting with Time */}
            {(() => {
              const hour = new Date().getHours()
              const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)
              const greeting = hour >= 5 && hour < 9 ? '🌅 早起身'
                : hour >= 9 && hour < 12 ? '☀️ 上午'
                : hour >= 12 && hour < 14 ? '🍜 午膳'
                : hour >= 14 && hour < 17 ? '☀️ 下午'
                : hour >= 17 && hour < 20 ? '🌆 放工'
                : hour >= 20 && hour < 23 ? '🌙 夜晚'
                : '😴 深夜'
              const trafficTip = isRushHour ? '⏰ 高峰時段，建議預留更多出行時間' : '✅ 交通大致正常'
              
              return (
                <div className="bg-gradient-to-r from-slate-600 via-slate-700 to-gray-800 rounded-2xl p-4 shadow-lg text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">
                        {hour >= 7 && hour <= 9 ? '🚗' : hour >= 17 && hour <= 19 ? '🚙' : '🚕'}
                      </div>
                      <div>
                        <p className="text-lg font-bold">{greeting}</p>
                        <p className="text-sm opacity-80">{trafficTip}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{new Date().toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' })}</p>
                      <p className="text-xs opacity-60">{new Date().toLocaleDateString('zh-HK', { month: 'numeric', day: 'numeric', weekday: 'short' })}</p>
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* Overall Traffic Index */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">🚦 整體交通狀況</h3>
                  <p className="text-xs text-gray-500 mt-1">實時路面情況</p>
                </div>
                {(() => {
                  const smooth = trafficData.filter(s => s.status === 'smooth').length
                  const total = trafficData.length || 1
                  const smoothPercent = Math.round(smooth / total * 100)
                  return (
                    <div className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                      smoothPercent >= 70 ? 'bg-green-100 text-green-700' :
                      smoothPercent >= 50 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {smoothPercent >= 70 ? '🟢 通暢' : smoothPercent >= 50 ? '🟡 正常' : '🔴 擠塞'}
                    </div>
                  )
                })()}
              </div>
              
              {/* Traffic Stats Cards */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {(() => {
                  const smooth = trafficData.filter(s => s.status === 'smooth').length
                  const moderate = trafficData.filter(s => s.status === 'moderate').length
                  const congested = trafficData.filter(s => s.status === 'congested').length
                  const total = trafficData.length || 1
                  
                  return [
                    { label: '通暢', count: smooth, icon: '🟢', bg: 'bg-green-50', textColor: 'text-green-600' },
                    { label: '中等', count: moderate, icon: '🟡', bg: 'bg-yellow-50', textColor: 'text-yellow-600' },
                    { label: '擠塞', count: congested, icon: '🔴', bg: 'bg-red-50', textColor: 'text-red-600' },
                    { label: '感應器', count: total, icon: '📡', bg: 'bg-blue-50', textColor: 'text-blue-600' },
                  ].map((item) => (
                    <div key={item.label} className={`${item.bg} rounded-xl p-3 text-center`}>
                      <p className="text-lg font-bold">{item.icon}</p>
                      <p className={`text-xl font-bold ${item.textColor}`}>{item.count}</p>
                      <p className="text-xs text-gray-500">{item.label}</p>
                    </div>
                  ))
                })()}
              </div>

              {/* Speed Distribution Bar */}
              <div className="mb-2">
                <div className="flex text-xs text-gray-500 mb-1">
                  <span className="flex-1 text-left">通暢 &gt;60km/h</span>
                  <span className="flex-1 text-center">中等 40-60km/h</span>
                  <span className="flex-1 text-right">擠塞 &lt;40km/h</span>
                </div>
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex">
                  {(() => {
                    const smooth = trafficData.filter(s => s.status === 'smooth').length
                    const moderate = trafficData.filter(s => s.status === 'moderate').length
                    const congested = trafficData.filter(s => s.status === 'congested').length
                    const total = trafficData.length || 1
                    return [
                      { count: smooth, color: 'bg-green-500' },
                      { count: moderate, color: 'bg-yellow-500' },
                      { count: congested, color: 'bg-red-500' },
                    ].map((item, i) => (
                      <div 
                        key={i}
                        className={`${item.color} transition-all`}
                        style={{ width: total > 0 ? `${(item.count / total) * 100}%` : '33%' }}
                      />
                    ))
                  })()}
                </div>
              </div>
            </div>

            {/* Hot Roads Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">🔥 熱門路段</h3>
                  <p className="text-xs text-gray-500 mt-1">實時車速監測</p>
                </div>
                <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                  {trafficData.length} 路段
                </span>
              </div>
              
              <div className="space-y-2">
                {/* Congested Roads First */}
                {trafficData
                  .sort((a, b) => a.speed - b.speed)
                  .slice(0, 8)
                  .map((road, index) => (
                    <div 
                      key={road.id}
                      className={`p-3 rounded-xl border transition-all ${
                        road.status === 'congested' ? 'bg-red-50 border-red-100' :
                        road.status === 'moderate' ? 'bg-yellow-50 border-yellow-100' :
                        'bg-green-50 border-green-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Status Icon */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          road.status === 'congested' ? 'bg-red-100' :
                          road.status === 'moderate' ? 'bg-yellow-100' :
                          'bg-green-100'
                        }`}>
                          {road.status === 'congested' ? '🚗💨' : road.status === 'moderate' ? '🚙' : '🚕'}
                        </div>
                        
                        {/* Road Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {road.road_tc || road.road_en}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-2">
                            <span>{road.district}</span>
                            <span>·</span>
                            <span className="uppercase">{road.direction}</span>
                          </p>
                        </div>
                        
                        {/* Speed */}
                        <div className="text-right">
                          <p className={`text-xl font-bold ${
                            road.status === 'congested' ? 'text-red-600' :
                            road.status === 'moderate' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {road.speed}
                          </p>
                          <p className="text-xs text-gray-500">km/h</p>
                        </div>
                      </div>
                      
                      {/* Speed Bar */}
                      <div className="mt-2">
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              road.status === 'congested' ? 'bg-red-500' :
                              road.status === 'moderate' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(100, road.speed)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* District Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">📍 各區平均車速</h3>
                  <p className="text-xs text-gray-500 mt-1">按區域分類</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {districtSummary
                  .sort((a, b) => b.avgSpeed - a.avgSpeed)
                  .map((d) => (
                    <div key={d.district} className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                        style={{ backgroundColor: `${getTrafficColor(d.avgSpeed)}20` }}
                      >
                        {getTrafficColor(d.avgSpeed) === '#22c55e' ? '🟢' : 
                         getTrafficColor(d.avgSpeed) === '#eab308' ? '🟡' : '🔴'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{d.district}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-400">{d.sensorCount} 感應器</span>
                            <span className={`font-bold ${
                              d.avgSpeed >= 60 ? 'text-green-600' :
                              d.avgSpeed >= 40 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {d.avgSpeed} km/h
                            </span>
                          </div>
                        </div>
                        <div className="mt-1">
                          <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                d.avgSpeed >= 60 ? 'bg-green-500' :
                                d.avgSpeed >= 40 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(100, d.avgSpeed)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3 text-center">📊 速度標準</h4>
              <div className="grid grid-cols-3 gap-4 text-center text-xs">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="font-medium text-green-700 dark:text-green-400">通暢</p>
                  <p className="text-gray-500">&gt; 60 km/h</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                    <span className="text-white text-sm">~</span>
                  </div>
                  <p className="font-medium text-yellow-700 dark:text-yellow-400">中等</p>
                  <p className="text-gray-500">40-60 km/h</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-white text-sm">✗</span>
                  </div>
                  <p className="font-medium text-red-700 dark:text-red-400">擠塞</p>
                  <p className="text-gray-500">&lt; 40 km/h</p>
                </div>
              </div>
            </div>

            {/* Update Info */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>數據更新中 · 基於 {trafficData.length} 個路面感應器</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
