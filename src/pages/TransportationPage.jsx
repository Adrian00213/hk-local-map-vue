import { useState, useEffect } from 'react'
import { Bus, Search, MapPin, Navigation, Clock, ArrowRight, ChevronRight, Train, Activity, X, Route } from 'lucide-react'
import { getStopList, getStopETA, getRouteList, getRouteETA, getRouteStopList, formatETA } from '../services/kmbApi'
import { MTR_LINES, MTR_STATIONS, getMTRSchedule, formatMinutes, getStationName } from '../services/mtrApi'
import { getTrafficData, getTrafficColor, getDistrictSummary } from '../services/trafficApi'

export default function TransportationPage() {
  const [activeTab, setActiveTab] = useState('bus') // 'bus', 'mtr', 'traffic'
  
  // MTR State
  const [selectedMTRLine, setSelectedMTRLine] = useState(null)
  const [selectedMTRStation, setSelectedMTRStation] = useState(null)
  const [mtrSchedule, setMTRSchedule] = useState(null)
  const [mtrLoading, setMTRLoading] = useState(false)
  
  // Traffic State
  const [trafficData, setTrafficData] = useState([])
  const [districtSummary, setDistrictSummary] = useState([])
  
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
                  <div className="space-y-3">
                    {Object.entries(mtrSchedule.data).map(([key, trains]) => (
                      <div key={key}>
                        <p className="text-sm font-medium text-gray-500 mb-2">
                          {key === 'UP' ? '↑ 上行' : '↓ 下行'}
                        </p>
                        {Array.isArray(trains) && trains.slice(0, 4).map((train, idx) => (
                          <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl mb-2 ${
                            idx === 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-700'
                          }`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                              idx === 0 ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-200'
                            }`}>
                              {train.ttnt}
                            </div>
                            <div className="flex-1">
                              <p className={`font-medium ${idx === 0 ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                                {formatMinutes(train.ttnt)}
                              </p>
                              <p className="text-xs text-gray-500">
                                終點：{getStationName(train.dest)?.name_tc || train.dest}
                              </p>
                            </div>
                            {idx === 0 && (
                              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">下一班</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
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
            {/* Greeting */}
            {(() => {
              const hour = new Date().getHours()
              const greeting = hour >= 5 && hour < 9 ? '🌅 早起身'
                : hour >= 9 && hour < 12 ? '☀️ 上午'
                : hour >= 12 && hour < 14 ? '🍜 午膳'
                : hour >= 14 && hour < 17 ? '☀️ 下午'
                : hour >= 17 && hour < 20 ? '🌆 放工'
                : hour >= 20 && hour < 23 ? '🌙 夜晚'
                : '😴 深夜'
              const trafficTip = hour >= 7 && hour < 9 ? '早高峰時段，記得早啲出門！'
                : hour >= 17 && hour < 19 ? '晚高峰時段，路上會幾塞！'
                : hour >= 22 || hour <= 6 ? '深夜車少，路路暢通！'
                : '交通正常，放心出發！'
              
              return (
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-4 shadow-lg text-white">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{greeting.split(' ')[0]}</span>
                    <div>
                      <p className="text-xl font-bold">{greeting.split(' ')[1]}</p>
                      <p className="text-sm opacity-90">{trafficTip}</p>
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* Traffic Index */}
            <div className="grid grid-cols-3 gap-3">
              {(() => {
                const smooth = trafficData.filter(s => s.status === 'smooth').length
                const moderate = trafficData.filter(s => s.status === 'moderate').length
                const congested = trafficData.filter(s => s.status === 'congested').length
                const total = trafficData.length || 1
                
                return [
                  { label: '🟢 通暢', count: smooth, percent: Math.round(smooth/total*100), color: 'from-green-400 to-green-500' },
                  { label: '🟡 中等', count: moderate, percent: Math.round(moderate/total*100), color: 'from-yellow-400 to-yellow-500' },
                  { label: '🔴 擠塞', count: congested, percent: Math.round(congested/total*100), color: 'from-red-400 to-red-500' },
                ].map((item) => (
                  <div key={item.label} className={`bg-gradient-to-br ${item.color} rounded-2xl p-3 shadow-lg text-white`}>
                    <p className="text-2xl font-bold">{item.count}</p>
                    <p className="text-xs opacity-90">{item.label.split(' ')[1]}</p>
                    <div className="mt-2 bg-white/30 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                    <p className="text-xs mt-1">{item.percent}%</p>
                  </div>
                ))
              })()}
            </div>

            {/* District Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">📍 各區路況</h3>
              <div className="space-y-2">
                {districtSummary.map((d) => (
                  <div key={d.district} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getTrafficColor(d.avgSpeed) }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{d.district}</p>
                      <p className="text-xs text-gray-500">{d.sensorCount} 個感應器</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">{d.avgSpeed} km/h</p>
                      {d.congestedCount > 0 && (
                        <p className="text-xs text-red-500">{d.congestedCount} 個擠塞</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
              <div className="flex justify-around text-center">
                <div>
                  <div className="w-8 h-8 rounded-full bg-green-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">通暢</p>
                  <p className="text-xs font-medium">&gt;60 km/h</p>
                </div>
                <div>
                  <div className="w-8 h-8 rounded-full bg-yellow-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">中等</p>
                  <p className="text-xs font-medium">40-60 km/h</p>
                </div>
                <div>
                  <div className="w-8 h-8 rounded-full bg-red-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">擠塞</p>
                  <p className="text-xs font-medium">&lt;40 km/h</p>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-4">
              <p className="text-sm text-yellow-700 dark:text-yellow-300 text-center">
                📡 基於 {trafficData.length} 個交通感應器數據
              </p>
            </div>

            <div className="text-center text-xs text-gray-400">
              <p>🚦 數據來源：香港運輸署</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
