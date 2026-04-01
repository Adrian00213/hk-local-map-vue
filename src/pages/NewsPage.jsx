import { useState, useEffect } from 'react'
import { Newspaper, RefreshCw, ExternalLink, Music, Calendar, MapPin } from 'lucide-react'
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

// 演唱會及活動數據
const EVENTS_API = [
  {
    id: 'e1',
    title: '周杰倫 2026 香港演唱會',
    type: 'concert',
    date: '2026年4月15-17日',
    venue: '香港紅磡體育館',
    price: 'HK$580 - $1380',
    image: '🎤',
    status: '熱賣中'
  },
  {
    id: 'e2',
    title: '香港國際七人欖球賽',
    type: 'sports',
    date: '2026年4月5-7日',
    venue: '香港大球場',
    price: 'HK$450 - $1200',
    image: '🏉',
    status: '即將開售'
  },
  {
    id: 'e3',
    title: '五月天 2026 世界巡演唱',
    type: 'concert',
    date: '2026年4月20-22日',
    venue: '香港迪士尼樂園',
    price: 'HK$680 - $1580',
    image: '🎸',
    status: '預售中'
  },
  {
    id: 'e4',
    title: '香港巴塞爾藝術博覽會',
    type: 'art',
    date: '2026年3月26-30日',
    venue: '香港會議展覽中心',
    price: 'HK$300 - $800',
    image: '🎨',
    status: '進行中'
  },
  {
    id: 'e5',
    title: '張學友 60+ 巡迴演唱會',
    type: 'concert',
    date: '2026年5月10-15日',
    venue: '香港紅磡體育館',
    price: 'HK$480 - $1280',
    image: '🎵',
    status: '熱賣中'
  },
  {
    id: 'e6',
    title: '香港美酒佳餚節',
    type: 'food',
    date: '2026年10月',
    venue: '中環海濱',
    price: '免費入場',
    image: '🍷',
    status: '預告'
  },
  {
    id: 'e7',
    title: '林俊傑 JJ20 世界巡演唱',
    type: 'concert',
    date: '2026年6月5-8日',
    venue: '亞洲國際博覽館',
    price: 'HK$580 - $1380',
    image: '🎤',
    status: '預售中'
  },
  {
    id: 'e8',
    title: '香港網球公開賽',
    type: 'sports',
    date: '2026年1月',
    venue: '香港維多利亞公園',
    price: 'HK$100 - $500',
    image: '🎾',
    status: '已結束'
  }
]

export default function NewsPage() {
  const { markers } = useMap()
  const [news, setNews] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('news') // 'news' or 'events'

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

  const getEventIcon = (type) => {
    const icons = {
      concert: '🎤',
      sports: '🏆',
      art: '🎨',
      food: '🍜',
      default: '📍'
    }
    return icons[type] || icons.default
  }

  const getStatusColor = (status) => {
    if (status === '熱賣中') return 'bg-red-500 text-white'
    if (status === '預售中') return 'bg-orange-500 text-white'
    if (status === '即將開售') return 'bg-blue-500 text-white'
    if (status === '進行中') return 'bg-green-500 text-white'
    return 'bg-gray-500 text-white'
  }

  return (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 shadow-sm z-10 p-4">
        <div className="flex items-center justify-between mb-3">
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
        
        {/* Tab Switcher */}
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('news')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'news'
                ? 'bg-white dark:bg-gray-600 text-primary shadow-sm'
                : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            資訊
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'events'
                ? 'bg-white dark:bg-gray-600 text-primary shadow-sm'
                : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100'
            }`}
          >
            <Music className="w-4 h-4" />
            演唱會/活動
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'news' ? (
      /* News List */
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
      ) : (
      /* Events Section */
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">演唱會及活動</h2>
        </div>
        
        {/* Featured Event */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🎤</span>
            <div>
              <p className="text-xs opacity-80">本周精選</p>
              <h3 className="text-lg font-bold">周杰倫 2026 香港演唱會</h3>
              <p className="text-sm opacity-90">4月15-17日 · 紅磡體育館</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">熱賣中</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">HK$580起</span>
          </div>
        </div>

        {/* Events List */}
        <div className="grid grid-cols-1 gap-3">
          {EVENTS_API.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl">
                  {event.image}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {event.date}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                    <MapPin className="w-3 h-3" />
                    {event.venue}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {event.price}
                    </span>
                    <button className="px-3 py-1 bg-primary text-white text-xs rounded-full hover:bg-opacity-90">
                      立即購票
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* External Link to Events */}
        <div className="p-4">
          <a
            href="https://www.ticketmaster.hk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-purple-500 hover:text-purple-600"
          >
            <span>前往購票網站</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
      )}
    </div>
  )
}
