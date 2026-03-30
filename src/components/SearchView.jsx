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
    <div className="h-full w-full flex flex-col bg-zinc-50">
      {/* Search Header */}
      <div className="bg-white border-b border-zinc-100/80 px-5 pt-5 pb-4">
        <h1 className="text-2xl font-bold text-zinc-900 mb-4">搜尋</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="搜尋地點、餐廳、優惠..."
            className="w-full pl-12 pr-4 py-4 bg-zinc-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
          />
        </div>
        <div className="flex gap-2 mt-4 overflow-x-auto">
          <button
            onClick={() => setCat(null)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              !cat ? 'bg-violet-500 text-white' : 'bg-zinc-100 text-zinc-600'
            }`}
          >
            全部
          </button>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setCat(k)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                cat === k ? 'bg-violet-500 text-white' : 'bg-zinc-100 text-zinc-600'
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
        <p className="text-sm text-zinc-400 mb-4 font-medium">
          {results.length === 0 ? '沒有結果' : `${results.length} 個結果`}
        </p>

        {results.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-zinc-100 flex items-center justify-center">
              <Search className="w-10 h-10 text-zinc-300" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-700 mb-2">找不到結果</h3>
            <p className="text-sm text-zinc-400">嘗試其他關鍵字</p>
          </div>
        ) : (
          <div className="space-y-3 stagger-children">
            {results.map(m => (
              <div key={m.id} className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100/80 card-hover">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center text-2xl shrink-0">
                    {CATEGORY_ICONS[m.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-zinc-900 text-base leading-tight mb-1.5">{m.title}</h3>
                    <span className="inline-block px-2.5 py-0.5 bg-zinc-100 text-zinc-500 text-xs font-medium rounded-full">
                      {CATEGORY_LABELS[m.category]}
                    </span>
                    {m.description && (
                      <p className="text-sm text-zinc-500 mt-2 leading-relaxed line-clamp-2">{m.description}</p>
                    )}
                    {m.contact && (
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-400">
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
