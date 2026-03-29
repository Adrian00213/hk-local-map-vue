import { useState, useEffect } from 'react'
import { Newspaper } from 'lucide-react'
import { useMap, CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'

const NEWS = [
  { id: '1', title: '香港美食節 2026', desc: '超過200間本地及國際美食', cat: 'news', source: '旅發局', time: '2小時前' },
  { id: '2', title: 'Nike 夏季大特賣 70% OFF', desc: '全線門店同步進行', cat: 'deals', source: 'Nike HK', time: '5小時前' },
  { id: '3', title: '西九新展覽開幕', desc: '當代藝術展，免費入場', cat: 'places', source: '西九文化區', time: '昨日' },
  { id: '4', title: '人氣茶餐廳登陸旺角', desc: '灣仔名店首度在九龍區開分店', cat: 'restaurants', source: '飲食天地', time: '昨日' },
  { id: '5', title: '端午龍舟競渡', desc: '年度盛事，接受報名', cat: 'news', source: '康文署', time: '3日前' },
]

export default function NewsView() {
  const { markers } = useMap()
  const [news, setNews] = useState([])

  useEffect(() => {
    const latest = markers.slice(0, 3).map(m => ({ id: m.id, title: m.title, desc: m.description, cat: m.category, source: '用戶分享', time: '最新' }))
    setNews([...NEWS, ...latest])
  }, [markers])

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-blue-500" />
          <h1 className="text-xl font-bold text-gray-900">最新資訊</h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {news.map((n, i) => (
            <div key={n.id || i} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl">{CATEGORY_ICONS[n.cat]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{CATEGORY_LABELS[n.cat]}</span>
                    <span className="text-xs text-gray-400">{n.time}</span>
                  </div>
                  <h3 className="font-medium text-gray-900">{n.title}</h3>
                  {n.desc && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{n.desc}</p>}
                  <p className="text-xs text-gray-400 mt-1">{n.source}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
