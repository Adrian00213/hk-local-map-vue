import { useState } from 'react'
import { Search, MapPin, SlidersHorizontal } from 'lucide-react'
import { useMap, CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'

export default function SearchView() {
  const { markers } = useMap()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState(null)

  const results = markers.filter(m => {
    const matchQ = !q || m.title.toLowerCase().includes(q.toLowerCase()) || m.description?.toLowerCase().includes(q.toLowerCase()) || m.contact?.toLowerCase().includes(q.toLowerCase())
    const matchCat = !cat || m.category === cat
    return matchQ && matchCat
  })

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-b from-white to-slate-50">
      {/* Premium Header */}
      <div className="bg-white border-b border-slate-100 px-5 pt-6 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-4">搜尋</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="搜尋地點、餐廳、優惠..."
            className="w-full pl-12 pr-4 py-4 bg-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
          />
        </div>
        <div className="flex gap-2 mt-4 overflow-x-auto">
          <button
            onClick={() => setCat(null)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              !cat ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-200' : 'bg-slate-100 text-slate-600'
            }`}
          >
            全部
          </button>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setCat(k)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                cat === k ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-200' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <span>{CATEGORY_ICONS[k]}</span>
              <span>{v}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-5">
        <p className="text-sm text-slate-400 mb-4 font-medium">
          {results.length === 0 ? '沒有結果' : `${results.length} 個結果`}
        </p>

        {results.length === 0 ? (
          <div className="text-center py-20 animate-float">
            <div className="w-24 h-24 mx-auto mb-5 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <Search className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">找不到結果</h3>
            <p className="text-sm text-slate-400">嘗試其他關鍵字</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((m, i) => (
              <div
                key={m.id}
                className="bg-white rounded-3xl p-5 shadow-md border border-slate-100 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer animate-slide-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-3xl shrink-0">
                    {CATEGORY_ICONS[m.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-slate-900 mb-1">{m.title}</h3>
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-xs font-semibold rounded-full">
                      {CATEGORY_LABELS[m.category]}
                    </span>
                    {m.description && (
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2">{m.description}</p>
                    )}
                    {m.contact && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                        <MapPin size={12} />
                        <span>{m.contact}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
