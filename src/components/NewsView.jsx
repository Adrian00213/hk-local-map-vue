import { useState, useEffect } from 'react'
import { Newspaper, Clock, ChevronRight, MapPin, Zap, Brain, Star, Heart, Gift, TrendingUp, Sun, Cloud, CloudRain, AlertTriangle } from 'lucide-react'
import { useMap, CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'

// Time-aware news context
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
  
  return { hour, period, isWeekend, day }
}

// Smart news based on time and location
const getSmartNews = (userLocation, markers) => {
  const timeCtx = getTimeContext()
  const news = []
  
  // Time-specific breaking news
  if (timeCtx.period === 'morning') {
    news.push({
      id: 'morning1',
      title: '🌅 朝早優惠出爐',
      desc: '美心MX、麥當勞、大快活朝早套餐優惠，最低$25起',
      cat: 'deals',
      source: '即時優惠',
      time: '今日 9:00',
      badge: '🔥 熱辣辣',
      urgent: true
    })
  } else if (timeCtx.period === 'noon') {
    news.push({
      id: 'noon1',
      title: '☀️ 午餐優惠最後召集',
      desc: '12:00-2:00限定，多間餐廳午市特價',
      cat: 'deals',
      source: '優惠精選',
      time: '今日 11:30',
      badge: '⏰ 限時',
      urgent: true
    })
  } else if (timeCtx.period === 'evening') {
    news.push({
      id: 'evening1',
      title: '🌆 晚餐優惠出籠',
      desc: '晚市指定餐廳8折，送前菜或甜品',
      cat: 'deals',
      source: '今晚限定',
      time: '今日 17:00',
      badge: '🍽️ 今晚啱',
      urgent: true
    })
  } else if (timeCtx.period === 'night') {
    news.push({
      id: 'night1',
      title: '🌙 夜貓特選',
      desc: '便利店深夜折扣，7-11、全家指定貨品買一送一',
      cat: 'deals',
      source: '夜貓專屬',
      time: '今日 22:00',
      badge: '🌃 夜貓著',
      urgent: false
    })
  }

  // Weekend special
  if (timeCtx.isWeekend) {
    news.push({
      id: 'weekend1',
      title: '🎉 週末活動精選',
      desc: '香港美食節、海濱市集、露天電影節',
      cat: 'places',
      source: '週末玩轉香港',
      time: '本週末',
      badge: '🎊 週末必睇',
      urgent: false
    })
  }

  // Location-based nearby
  if (userLocation && markers.length > 0) {
    const nearbyTop = markers.slice(0, 2).map(m => ({
      id: m.id,
      title: `📍 ${m.title}`,
      desc: m.description || CATEGORY_LABELS[m.category],
      cat: m.category,
      source: '你附近',
      time: '就在附近',
      badge: '📍 靠近你',
      urgent: false
    }))
    news.push(...nearbyTop)
  }

  // Trending deals
  news.push({
    id: 'trending1',
    title: '💳 信用卡優惠合集',
    desc: 'AlipayHK最高回贈$500、WeChat Pay超市95折',
    cat: 'deals',
    source: '理財精選',
    time: '本月有效',
    badge: '💰 必搵',
    urgent: false
  })

  news.push({
    id: 'trending2',
    title: '🎫 M+博物館免費導賞團',
    desc: '每日3場免費導賞，預約從速',
    cat: 'places',
    source: '文化資訊',
    time: '展期至下月',
    badge: '🎨 免費',
    urgent: false
  })

  news.push({
    id: 'trending3',
    title: '🛍️ 海港城春季購物節',
    desc: '超過500間商店參與，最高7折',
    cat: 'places',
    source: '商場資訊',
    time: '進行中',
    badge: '🛒 購物',
    urgent: false
  })

  // User content
  const userMarkers = markers.filter(m => m.userId).slice(0, 2).map(m => ({
    id: m.id,
    title: `👤 ${m.title}`,
    desc: m.description,
    cat: m.category,
    source: m.userName || '用家分享',
    time: '最新',
    badge: '👤 用家',
    urgent: false
  }))
  news.push(...userMarkers)

  return news
}

const catColors = {
  deals: 'from-red-500 to-pink-500',
  restaurants: 'from-orange-500 to-amber-500',
  places: 'from-blue-500 to-indigo-500',
  news: 'from-green-500 to-emerald-500',
  transport: 'from-emerald-500 to-teal-500'
}

export default function NewsView() {
  const { markers, userLocation } = useMap()
  const [news, setNews] = useState([])
  const [timeContext, setTimeContext] = useState(getTimeContext())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeContext(getTimeContext())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const smartNews = getSmartNews(userLocation, markers)
    setNews(smartNews)
  }, [userLocation, markers, timeContext])

  const getGreeting = () => {
    if (timeContext.period === 'morning') return '🌅 朝早好'
    if (timeContext.period === 'noon') return '☀️ 午飯時間'
    if (timeContext.period === 'afternoon') return '🌤️ 下午時光'
    if (timeContext.period === 'evening') return '🌆 晚晚開始'
    return '🌙 夜喇'
  }

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
              <h1 className="text-2xl font-bold text-zinc-900">📰 最新資訊</h1>
              <p className="text-sm text-zinc-400">為你精挑細選</p>
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
            {getGreeting()}！{timeContext.isWeekend && ' 🎉 今日係週末'} 我為你精選咗以下資訊：
          </span>
        </div>
      </div>

      {/* News List */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="space-y-4 stagger-children">
          {news.map((n, i) => (
            <div
              key={n.id || i}
              className={`bg-white rounded-2xl shadow-sm border ${n.urgent ? 'border-amber-200' : 'border-zinc-100/80'} overflow-hidden card-hover`}
            >
              <div className={`h-1.5 bg-gradient-to-r ${catColors[n.cat] || 'from-zinc-500 to-neutral-500'}`} />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      {n.badge && (
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-lg ${
                          n.urgent 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'bg-blue-50 text-blue-600'
                        }`}>
                          {n.badge}
                        </span>
                      )}
                      <span className="text-xs text-zinc-400 flex items-center gap-1">
                        {n.source}
                      </span>
                    </div>
                    <h3 className="font-bold text-zinc-900 leading-snug text-base">{n.title}</h3>
                    <p className="text-sm text-zinc-500 mt-1 leading-relaxed">{n.desc}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs text-zinc-400 flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      {n.time}
                    </span>
                    <span className="text-xl">{CATEGORY_ICONS[n.cat]}</span>
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
