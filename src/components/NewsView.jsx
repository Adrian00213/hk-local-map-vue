import { useState, useEffect } from 'react'
import { Newspaper, Clock, ChevronRight, Zap } from 'lucide-react'
import { useMap, CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'

const NEWS = [
  { id: '1', title: '香港美食節 2026 強勢回歸', desc: '超過200間本地及國際美食參與，為期一周的美食盛宴', cat: 'news', source: '香港旅遊發展局', time: '2小時前' },
  { id: '2', title: 'Nike 夏季大特賣 最高70% OFF', desc: '全線門店及網店同步進行，包括人氣波鞋、運動服裝', cat: 'deals', source: 'Nike HK', time: '5小時前' },
  { id: '3', title: '西九文化區新展覽開幕', desc: '當代藝術展覽，免費入場，展期至年底', cat: 'places', source: '西九文化區', time: '昨日' },
  { id: '4', title: '人氣茶餐廳登陸旺角', desc: '灣仔名店首度在九龍區開分店，必試招牌絲襪奶茶', cat: 'restaurants', source: '飲食天地', time: '昨日' },
  { id: '5', title: '端午節龍舟競渡接受報名', desc: '年度盛事，各組別名額有限，報名從速', cat: 'news', source: '康樂及文化事務署', time: '3日前' },
]

const catColors = {
  deals: 'from-red-500 to-pink-500',
  restaurants: 'from-orange-500 to-amber-500',
  places: 'from-blue-500 to-indigo-500',
  news: 'from-green-500 to-emerald-500'
}

const catBg = {
  deals: 'bg-red-50 text-red-500',
  restaurants: 'bg-orange-50 text-orange-500',
  places: 'bg-blue-50 text-blue-500',
  news: 'bg-green-50 text-green-500'
}

export default function NewsView() {
  const { markers } = useMap()
  const [news, setNews] = useState([])

  useEffect(() => {
    const latest = markers.slice(0, 3).map(m => ({ id: m.id, title: m.title, desc: m.description, cat: m.category, source: '用戶分享', time: '最新' }))
    setNews([...NEWS, ...latest])
  }, [markers])

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-b from-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-5 pt-6 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-200">
              <Newspaper className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">最新資訊</h1>
              <p className="text-sm text-slate-400">精選優惠，好去處</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg shadow-yellow-200">
            <Zap className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* News List */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="space-y-4">
          {news.map((n, i) => (
            <div
              key={n.id || i}
              className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-100 hover:shadow-lg transition-all animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${catColors[n.cat]} flex items-center justify-center text-2xl shadow-lg`}>
                    {CATEGORY_ICONS[n.cat]}
                  </div>
                  <div className="flex-1">
                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${catBg[n.cat]}`}>
                      {CATEGORY_LABELS[n.cat]}
                    </span>
                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                      <Clock size={10} />
                      <span>{n.time}</span>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">{n.title}</h3>
                {n.desc && <p className="text-sm text-slate-500 line-clamp-2">{n.desc}</p>}
              </div>
              <div className="px-5 py-3 bg-slate-50 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{n.source}</span>
                <button className="flex items-center gap-1 text-xs text-red-500 font-bold">
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
