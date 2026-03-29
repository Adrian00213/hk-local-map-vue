import { useState, useEffect } from 'react'
import { Newspaper, RefreshCw, ExternalLink } from 'lucide-react'
import { useMap, CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'

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

export default function NewsPage() {
  const { markers } = useMap()
  const [news, setNews] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const fetchNews = () => {
    setRefreshing(true)
    const latestMarkers = markers.slice(0, 3).map(m => ({
      id: m.id,
      title: m.title,
      category: m.category,
      description: m.description,
      source: '用戶分享',
      time: '最新'
    }))
    const combined = [...MOCK_NEWS, ...latestMarkers].slice(0, 10)
    setNews(combined)
    setTimeout(() => setRefreshing(false), 500)
  }

  useEffect(() => {
    fetchNews()
  }, [markers])

  return (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 shadow-sm z-10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">最新資訊</h1>
          </div>
          <button
            onClick={fetchNews}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* News List */}
      <div className="p-4 space-y-3">
        {news.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl">
                {CATEGORY_ICONS[item.category]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500">
                    {CATEGORY_LABELS[item.category]}
                  </span>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">{item.source}</p>
              </div>
            </div>
          </div>
        ))}

        {news.length === 0 && (
          <div className="text-center py-16">
            <Newspaper className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              暫時沒有資訊
            </h3>
            <p className="text-sm text-gray-500">
              稍後再看看
            </p>
          </div>
        )}
      </div>

      {/* External Link */}
      <div className="p-4">
        <a
          href="https://news.google.com/topstories?hl=zh-Hant-HK&gl=HK&ceid=HK:zh-Hant"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-blue-500 hover:text-blue-600"
        >
          <span>查看更多資訊</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}
