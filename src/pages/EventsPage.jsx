import { useState, useEffect } from 'react'
import { Calendar, MapPin, Clock, Filter, Search, ChevronRight, Users, AlertCircle, CheckCircle } from 'lucide-react'
import { getAllEvents, formatEventDate, parseEventDates, getEventStatus, getOrgCategory } from '../services/eventsApi'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)

  const categories = [
    { id: '', label: '全部' },
    { id: '醫療健康', label: '🏥 醫療健康' },
    { id: '教育', label: '🎓 教育' },
    { id: '文化藝術', label: '🎨 文化藝術' },
    { id: '康體', label: '⚽ 康體' },
    { id: '社福', label: '❤️ 社福' },
    { id: '政府', label: '🏛️ 政府' },
    { id: '其他', label: '📌 其他' },
  ]

  // Load events
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      const data = await getAllEvents()
      setEvents(data)
      setFilteredEvents(data)
      setLoading(false)
    }
    loadEvents()
  }, [])

  // Filter events
  useEffect(() => {
    let result = events

    // Category filter
    if (categoryFilter) {
      result = result.filter(e => getOrgCategory(e.event_org) === categoryFilter)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(e =>
        e.event_summary?.toLowerCase().includes(query) ||
        e.event_org?.toLowerCase().includes(query) ||
        e.event_location?.toLowerCase().includes(query)
      )
    }

    setFilteredEvents(result)
  }, [categoryFilter, searchQuery, events])

  // Group events by organization category
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const category = getOrgCategory(event.event_org)
    if (!acc[category]) acc[category] = []
    acc[category].push(event)
    return acc
  }, {})

  return (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 shadow-sm z-10 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">🇭🇰 政府活動</h1>
            <p className="text-sm text-gray-500">一站式活動資訊平台</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋活動名稱、主辦機構..."
            className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-blue-500">{filteredEvents.length}</p>
            <p className="text-xs text-gray-500">活動總數</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-green-500">{Object.keys(groupedEvents).length}</p>
            <p className="text-xs text-gray-500">類別數目</p>
          </div>
        </div>

        {/* Category Pills */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-500">活動類別</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  categoryFilter === cat.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-500">載入活動中...</p>
          </div>
        )}

        {/* Events List */}
        {!loading && (
          <div className="space-y-4">
            {Object.entries(groupedEvents).map(([category, categoryEvents]) => (
              <div key={category}>
                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  {category}
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                    {categoryEvents.length}
                  </span>
                </h3>
                <div className="space-y-2">
                  {categoryEvents.slice(0, 5).map((event) => (
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
                            {event.event_location?.split(',').slice(-2).join(',').trim() || '地點待定'}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                            <Users className="w-3 h-3" />
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
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">暫時未有相關活動</p>
              </div>
            )}
          </div>
        )}

        {/* Data Source */}
        <div className="text-center text-xs text-gray-400 py-4">
          <p>📡 數據來源：香港政府一站通</p>
        </div>
      </div>

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
                    {selectedEvent.event_date && (
                      <p className="text-xs text-gray-400 mt-1">{selectedEvent.event_date.split('\n')[0]}</p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 flex items-start gap-3">
                  <Users className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">主辦機構</p>
                    <p className="text-sm text-gray-500">{selectedEvent.event_org}</p>
                  </div>
                </div>

                {selectedEvent.event_duration && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">活動時間</p>
                      <p className="text-sm text-gray-500">{formatEventDate(selectedEvent.event_date)}</p>
                    </div>
                  </div>
                )}
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
  )
}
