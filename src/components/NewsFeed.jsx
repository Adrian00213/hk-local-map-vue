import { useState, useEffect } from 'react'
import { X, RefreshCw, ExternalLink } from 'lucide-react'
import { useMap, CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'

// Mock news data
const MOCK_NEWS = [
  {
    id: '1',
    title: '香港美食節 2026 強勢回歸',
    category: 'news',
    description: '超過200間本地及國際美食參與，為期一周的美食盛宴',
    source: '香港旅遊發展局',
    time: '2小時前'
  },
  {
    id: '2',
    title: 'Nike 夏季大特賣 最高70% OFF',
    category: 'deals',
    description: '全線門店及網店同步進行，包括人氣波鞋、運動服裝',
    source: 'Nike HK',
    time: '5小時前'
  },
  {
    id: '3',
    title: '西九文化區新展覽開幕',
    category: 'places',
    description: '當代藝術展覽，免費入場，展期至年底',
    source: '西九文化區',
    time: '昨日'
  },
  {
    id: '4',
    title: '人氣茶餐廳登陸旺角',
    category: 'restaurants',
    description: '灣仔名店首度在九龍區開分店，必試招牌絲襪奶茶',
    source: '飲食天地',
    time: '昨日'
  },
  {
    id: '5',
    title: '端午節龍舟競渡接受報名',
    category: 'news',
    description: '年度盛事，各組別名額有限，報名從速',
    source: '康樂及文化事務署',
    time: '3日前'
  }
]

export default function NewsFeed({ onClose }) {
  const { markers } = useMap()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchNews = async () => {
    setLoading(true)
    try {
      // In a real app, this would fetch from a news API
      // For demo, we combine mock news with latest markers
      const latestMarkers = markers.slice(0, 3).map(m => ({
        id: m.id,
        title: m.title,
        category: m.category,
        description: m.description,
        source: '用戶分享',
        time: '最新'
      }))

      // Combine mock news with latest markers
      const combinedNews = [...MOCK_NEWS, ...latestMarkers]
        .sort((a, b) => {
          // Sort by recency
          if (a.time === '最新') return -1
          if (b.time === '最新') return 1
          return 0
        })
        .slice(0, 8)

      setNews(combinedNews)
    } catch (err) {
      console.error('News error:', err)
      setNews(MOCK_NEWS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
    // Auto refresh every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [markers])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchNews()
    setRefreshing(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden max-h-[400px] flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-accent to-orange-400 text-white flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">📰</span>
          <span className="font-medium">最新資訊</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* News List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {news.map((item) => (
              <div
                key={item.id}
                className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">{CATEGORY_ICONS[item.category]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500">
                        {CATEGORY_LABELS[item.category]}
                      </span>
                      <span className="text-xs text-gray-400">{item.time}</span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {item.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {item.source}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600">
        <a
          href="https://news.google.com/topstories?hl=zh-Hant-HK&gl=HK&ceid=HK:zh-Hant"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 text-xs text-primary hover:underline"
        >
          <span>查看更多資訊</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
