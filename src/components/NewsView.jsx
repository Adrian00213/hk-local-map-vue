import { useState, useEffect } from 'react'
import { Newspaper, Clock, MapPin, Brain, Star, TrendingUp, Gift, AlertCircle, RefreshCw } from 'lucide-react'
import { CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'

// Static news data - always available
const STATIC_NEWS = [
  {
    id: 'static_1',
    title: '🎉 香港美食節 2026 強勢回歸',
    desc: '超過200間本地及國際美食參與，多間餐廳推出限定優惠',
    cat: 'restaurants',
    source: '香港旅遊發展局',
    time: '今日',
    badge: '🔥 熱辣辣',
    urgent: true
  },
  {
    id: 'static_2',
    title: '💳 AlipayHK 消費券優惠',
    desc: '用 AlipayHK 付款最高回贈 $500，指定商戶再享額外折扣',
    cat: 'deals',
    source: '支付寶HK',
    time: '本月',
    badge: '💰 必搵',
    urgent: false
  },
  {
    id: 'static_3',
    title: '🛍️ 海港城春季購物節',
    desc: '超過500間商店參與，最高7折優惠',
    cat: 'places',
    source: '商場資訊',
    time: '進行中',
    badge: '🛒 購物',
    urgent: false
  },
  {
    id: 'static_4',
    title: '🏛️ M+博物館 免費導賞團',
    desc: '每日3場免費導賞，預約從速',
    cat: 'places',
    source: '西九文化區',
    time: '本週',
    badge: '🎨 免費',
    urgent: false
  },
  {
    id: 'static_5',
    title: '🍜 譚仔三哥 新口味登場',
    desc: '全新雲南麻辣湯底，辣度任選',
    cat: 'restaurants',
    source: '譚仔三哥',
    time: '新店',
    badge: '🆕 新店',
    urgent: false
  },
  {
    id: 'static_6',
    title: '🚇 MTR 週末優惠',
    desc: '八達通週日免費轉乘優惠',
    cat: 'transport',
    source: '港鐵',
    time: '週末',
    badge: '🚇 交通',
    urgent: false
  },
  {
    id: 'static_7',
    title: '🌤️ 週末天氣預報',
    desc: '週六週日大致天晴，氣溫25-30度',
    cat: 'news',
    source: '天文台',
    time: '預報',
    badge: '🌤️ 天氣',
    urgent: false
  },
  {
    id: 'static_8',
    title: '🎫 香港故宮博物館 新展覽',
    desc: '北京故宮珍藏清代宮廷文物展',
    cat: 'places',
    source: '故宮博物館',
    time: '新展',
    badge: '🏛️ 文化',
    urgent: false
  },
]

// Time-specific news
const getTimeNews = () => {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 11) {
    return {
      id: 'time_1',
      title: '🌅 朝早優惠 - 早餐套餐最低$25',
      desc: '美心MX、麥當勞、大快活朝早優惠，最低$25起',
      cat: 'deals',
      source: '即時優惠',
      time: '今日朝早',
      badge: '🌅 朝早特選',
      urgent: true
    }
  } else if (hour >= 11 && hour < 14) {
    return {
      id: 'time_2',
      title: '☀️ 午餐優惠 - 午市套餐',
      desc: '多間餐廳午市特價，最高慳$30',
      cat: 'deals',
      source: '優惠精選',
      time: '今日午餐',
      badge: '☀️ 午餐精選',
      urgent: true
    }
  } else if (hour >= 17 && hour < 21) {
    return {
      id: 'time_3',
      title: '🌆 晚餐優惠 - 晚市8折',
      desc: '指定餐廳晚市優惠，送前菜或甜品',
      cat: 'deals',
      source: '今晚限定',
      time: '今日晚市',
      badge: '🍽️ 今晚啱',
      urgent: true
    }
  } else if (hour >= 21 || hour < 5) {
    return {
      id: 'time_4',
      title: '🌙 夜貓特選 - 便利店特價',
      desc: '7-11、全家夜間折扣，精選貨品買一送一',
      cat: 'deals',
      source: '夜貓專屬',
      time: '深夜',
      badge: '🌃 夜貓著',
      urgent: false
    }
  }
  
  return null
}

const catColors = {
  deals: 'from-red-500 to-pink-500',
  restaurants: 'from-orange-500 to-amber-500',
  places: 'from-blue-500 to-indigo-500',
  news: 'from-green-500 to-emerald-500',
  transport: 'from-emerald-500 to-teal-500'
}

export default function NewsView() {
  const [news, setNews] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    // Load news immediately
    loadNews()
    
    // Refresh every 5 minutes
    const interval = setInterval(loadNews, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const loadNews = () => {
    setRefreshing(true)
    
    // Combine time-specific news with static news
    const timeNews = getTimeNews()
    let allNews = [...STATIC_NEWS]
    
    // Add time-specific news at the top if exists
    if (timeNews) {
      allNews = [timeNews, ...allNews]
    }
    
    // Add weekday/weekend specific news
    const isWeekend = [0, 6].includes(new Date().getDay())
    if (isWeekend) {
      allNews = [
        {
          id: 'weekend_1',
          title: '🎉 週末活動精選',
          desc: '香港美食節、海濱市集、露天電影節',
          cat: 'places',
          source: '週末玩轉香港',
          time: '本週末',
          badge: '🎊 週末必睇',
          urgent: false
        },
        ...allNews
      ]
    }
    
    setNews(allNews)
    setLastUpdate(new Date())
    setRefreshing(false)
  }

  const handleRefresh = () => {
    loadNews()
  }

  const getTimeGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 11) return '🌅 朝早好'
    if (hour >= 11 && hour < 14) return '☀️ 午飯時間'
    if (hour >= 14 && hour < 18) return '🌤️ 下午時光'
    if (hour >= 18 && hour < 22) return '🌆 晚晚開始'
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
          <button 
            onClick={handleRefresh}
            className={`w-10 h-10 rounded-xl bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-all active:scale-95 ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-5 h-5 text-zinc-500" />
          </button>
        </div>
      </div>

      {/* Time-based Greeting Banner */}
      <div className="px-5 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100/50">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-blue-700">
            {getTimeGreeting()}！我為你精選咗以下資訊：
          </span>
        </div>
      </div>

      {/* News List */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="space-y-4">
          {news.map((n, i) => (
            <div
              key={n.id || i}
              className={`bg-white rounded-2xl shadow-sm ${n.urgent ? 'border-2 border-amber-200' : 'border border-zinc-100/80'} overflow-hidden card-hover`}
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
                    <span className="text-xl">{CATEGORY_ICONS[n.cat] || '📰'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Last Update */}
        <div className="text-center py-4 mt-4">
          <p className="text-xs text-zinc-400">
            最後更新：{lastUpdate.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  )
}
