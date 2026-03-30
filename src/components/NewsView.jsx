import { useState, useEffect } from 'react'
import { Newspaper, Clock, ChevronRight, MapPin, Zap, Brain, Star, Heart, Gift } from 'lucide-react'
import { useMap, CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'

// Smart localized news based on context
const getSmartNews = (userLocation, markers, timeContext) => {
  const news = []
  
  // 1. Time-based breaking news
  if (timeContext.period === 'morning') {
    news.push({
      id: 'time1',
      title: '🌅 朝早優惠 - 早餐套餐最低$25',
      desc: '美心MX、麥當勞、大快活朝早優惠',
      cat: 'deals',
      source: '智能精選',
      time: '及時',
      badge: '🔥 熱門'
    })
  } else if (timeContext.period === 'noon') {
    news.push({
      id: 'time2',
      title: '☀️ 午餐精選 - 午市套餐優惠',
      desc: '多間餐廳午市特價，最高慳$30',
      cat: 'deals',
      source: '智能精選',
      time: '及時',
      badge: '⏰ 限時'
    })
  } else if (timeContext.period === 'evening') {
    news.push({
      id: 'time3',
      title: '🌆 晚餐優惠 - 晚市8折',
      desc: '指定餐廳晚市優惠，送小食',
      cat: 'deals',
      source: '智能精選',
      time: '及時',
      badge: '🍽️ 今晚限定'
    })
  } else if (timeContext.period === 'night') {
    news.push({
      id: 'time4',
      title: '🌙 夜宵優惠 - 便利店特價',
      desc: '7-11、全家夜間折扣',
      cat: 'deals',
      source: '智能精選',
      time: '及時',
      badge: '🌃 夜貓特選'
    })
  }

  // 2. Location-based nearby places
  if (userLocation) {
    const nearbyMarkers = markers.slice(0, 3).map(m => ({
      id: m.id,
      title: `${CATEGORY_ICONS[m.category]} ${m.title}`,
      desc: m.description || CATEGORY_LABELS[m.category],
      cat: m.category,
      source: '附近熱點',
      time: '就在附近',
      badge: '📍 靠近你'
    }))
    news.push(...nearbyMarkers)
  }

  // 3. Trending deals
  news.push({
    id: 'trend1',
    title: '💳 信用卡優惠 - AlipayHK最高回贈$500',
    desc: 'HSBC、中銀、恒生指定商戶優惠',
    cat: 'deals',
    source: '理財資訊',
    time: '本月有效',
    badge: '💰 必搵'
  })

  news.push({
    id: 'trend2',
    title: '🎫 M+博物館 - 免費導賞團',
    desc: '每日名額有限，先到先得',
    cat: 'places',
    source: '文化資訊',
    time: '本週',
    badge: '🎨 免費'
  })

  news.push({
    id: 'trend3',
    title: '🛍️ 海港城 - 春季購物節',
    desc: '超過500間商店參與，最高7折',
    cat: 'places',
    source: '商場資訊',
    time: '進行中',
    badge: '🛒 購物'
  })

  // 4. User posted content
  const userMarkers = markers.filter(m => m.userId).slice(0, 2).map(m => ({
    id: m.id,
    title: `📍 ${m.title}`,
    desc: m.description,
    cat: m.category,
    source: m.userName || '用家分享',
    time: '最新',
    badge: '👤 用家'
  }))
  news.push(...userMarkers)

  return news
}

// Get time context
const getTimeContext = () => {
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay()
  const isWeekend = day === 0 || day === 6
  
  let period = 'afternoon'
  if (hour >= 5 && hour < 11) period = 'morning'
  else if (hour >= 11 && hour < 14) period = 'noon'
  else if (hour >= 14 && hour < 18) period = 'afternoon'
  else if (hour >= 18 && hour < 22) period = 'evening'
  else period = 'night'
  
  return { hour, period, timeString: `${hour}:${now.getMinutes().toString().padStart(2, '0')}`, isWeekend, day }
}

const catColors = {
  deals: 'from-red-500 to-pink-500',
  restaurants: 'from-orange-500 to-amber-500',
  places: 'from-blue-500 to-indigo-500',
  news: 'from-green-500 to-emerald-500'
}

export default function NewsView() {
  const { markers, userLocation } = useMap()
  const [news, setNews] = useState([])
  const [timeContext, setTimeContext] = useState(getTimeContext())

  useEffect(() => {
    // Update time context every minute
    const timer = setInterval(() => {
      setTimeContext(getTimeContext())
    }, 60000)
    
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Generate smart news based on location and time
    const smartNews = getSmartNews(userLocation, markers, timeContext)
    setNews(smartNews)
  }, [userLocation, markers, timeContext])

  return (
    <div className="h-full w-full flex flex-col bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-100/80 px-5 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-200/50">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">最新資訊</h1>
              <p className="text-sm text-zinc-400">根據位置為你精選</p>
            </div>
          </div>
          {userLocation && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-xl">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-600 font-medium">已定位</span>
            </div>
          )}
        </div>
      </div>

      {/* Smart Context Banner */}
      <div className="px-5 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100/50">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-blue-700">
            {timeContext.period === 'morning' && '🌅 朝早好！今日有咩搵？'}
            {timeContext.period === 'noon' && '☀️ 午飯時間！附近有優惠'}
            {timeContext.period === 'afternoon' && '🌤️ 下午時光！休閒好去處'}
            {timeContext.period === 'evening' && '🌆 晚晚開始！晚餐優惠'}
            {timeContext.period === 'night' && '🌙 夜喇！夜宵優惠'}
            {timeContext.isWeekend && ' 🎉 今日係週末'}
          </span>
        </div>
      </div>

      {/* News List */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="space-y-4 stagger-children">
          {news.map((n, i) => (
            <div
              key={n.id || i}
              className="bg-white rounded-2xl shadow-sm border border-zinc-100/80 overflow-hidden card-hover"
            >
              <div className={`h-1.5 bg-gradient-to-r ${catColors[n.cat] || 'from-zinc-500 to-neutral-500'}`} />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      {n.badge && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg">
                          {n.badge}
                        </span>
                      )}
                      <span className="text-xs text-zinc-400 flex items-center gap-1">
                        {n.source}
                      </span>
                    </div>
                    <h3 className="font-bold text-zinc-900 leading-snug">{n.title}</h3>
                    <p className="text-sm text-zinc-500 mt-1 leading-relaxed">{n.desc}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs text-zinc-400 flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      {n.time}
                    </span>
                    <span className="text-lg">{CATEGORY_ICONS[n.cat]}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {news.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-zinc-100 flex items-center justify-center">
              <Newspaper className="w-10 h-10 text-zinc-300" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-700 mb-2">暫時冇料到</h3>
            <p className="text-sm text-zinc-400">稍後再碌碌啦</p>
          </div>
        )}
      </div>
    </div>
  )
}
