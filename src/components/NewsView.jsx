import { useState, useEffect } from 'react'
import { Newspaper, Clock, ChevronRight } from 'lucide-react'
import { useMap, CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'

const NEWS = [
  { id: '1', title: '香港美食節 2026 強勢回歸', desc: '超過200間本地及國際美食參與', cat: 'news', source: '香港旅遊發展局', time: '2小時前' },
  { id: '2', title: 'Nike 夏季大特賣 最高70% OFF', desc: '全線門店及網店同步進行', cat: 'deals', source: 'Nike HK', time: '5小時前' },
  { id: '3', title: '西九文化區新展覽開幕', desc: '當代藝術展覽，免費入場', cat: 'places', source: '西九文化區', time: '昨日' },
  { id: '4', title: '人氣茶餐廳登陸旺角', desc: '灣仔名店首度在九龍區開分店', cat: 'restaurants', source: '飲食天地', time: '昨日' },
]

const catColors = {
  deals: 'from-red-500 to-pink-500',
  restaurants: 'from-orange-500 to-amber-500',
  places: 'from-blue-500 to-indigo-500',
  news: 'from-green-500 to-emerald-500'
}

export default function NewsView() {
  const { markers } = useMap()
  const [news, setNews] = useState([])

  useEffect(() => {
    const latest = markers.slice(0, 2).map(m => ({ id: m.id, title: m.title, desc: m.description, cat: m.category, source: '用戶分享', time: '最新' }))
    setNews([...NEWS, ...latest])
  }, [markers])

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
              <p className="text-sm text-zinc-400">精選優惠、好去處</p>
            </div>
          </div>
        </div>
      </div>

      {/* News List */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="space-y-4 stagger-children">
          {news.map((n, i) => (
            <div
              key={n.id || i}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-zinc-100/80 card-hover"
            >
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${catColors[n.cat]} flex items-center justify-center text-2xl shadow-lg`}>
                    {CATEGORY_ICONS[n.cat]}
                  </div>
                  <div className="flex-1">
                    <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-zinc-100 text-zinc-600`}>
                      {CATEGORY_LABELS[n.cat]}
                    </span>
                    <div className="flex items-center gap-1 mt-1 text-xs text-zinc-400">
                      <Clock size={10} />
                      <span>{n.time}</span>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-zinc-900 text-lg mb-1 leading-tight">{n.title}</h3>
                {n.desc && <p className="text-sm text-zinc-500 leading-relaxed">{n.desc}</p>}
              </div>
              <div className="px-5 py-3 bg-zinc-50/80 flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-medium">{n.source}</span>
                <button className="flex items-center gap-1 text-xs text-violet-500 font-semibold">
                  查看 <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
