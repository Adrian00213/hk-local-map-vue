import { useState } from 'react'
import { Search, MapPin } from 'lucide-react'
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
    <div className="h-full w-full flex flex-col bg-slate-50">
      {/* Search Header */}
      <div className="bg-white px-4 pt-4 pb-5 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="搜尋地點、餐廳、優惠..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
          />
        </div>
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          <button
            onClick={() => setCat(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              !cat ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            全部
          </button>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setCat(k)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                cat === k ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <span>{CATEGORY_ICONS[k]}</span>
              <span>{v}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-sm text-slate-400 mb-4">
          {results.length === 0 ? '沒有結果' : `${results.length} 個結果`}
        </p>

        {results.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-slate-500">找不到符合條件的地點</p>
            <p className="text-sm text-slate-400 mt-1">嘗試其他關鍵字</p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map(m => (
              <div key={m.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl shrink-0">
                    {CATEGORY_ICONS[m.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 truncate">{m.title}</h3>
                    </div>
                    <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-500 text-xs font-medium rounded-full">
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
