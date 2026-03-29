import { useState } from 'react'
import { Search } from 'lucide-react'
import { useMap, CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'

export default function SearchView() {
  const { markers } = useMap()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState(null)

  const results = markers.filter(m => {
    const matchQ = !q || m.title.toLowerCase().includes(q.toLowerCase()) || m.description?.toLowerCase().includes(q.toLowerCase())
    const matchCat = !cat || m.category === cat
    return matchQ && matchCat
  })

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <div className="bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="搜尋地點..." className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl text-sm" />
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto">
          <button onClick={() => setCat(null)} className={`px-4 py-1.5 rounded-full text-sm ${!cat ? 'bg-red-500 text-white' : 'bg-gray-100'}`}>全部</button>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
            <button key={k} onClick={() => setCat(k)} className={`px-4 py-1.5 rounded-full text-sm flex items-center gap-1 ${cat === k ? 'bg-red-500 text-white' : 'bg-gray-100'}`}>{CATEGORY_ICONS[k]}{v}</button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-sm text-gray-500 mb-3">{results.length} 個結果</p>
        <div className="space-y-3">
          {results.map(m => (
            <div key={m.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl">{CATEGORY_ICONS[m.category]}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900">{m.title}</h3>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{CATEGORY_LABELS[m.category]}</span>
                  {m.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{m.description}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
