import { useState, useEffect } from 'react'
import { Heart, Star } from 'lucide-react'
import { useMap, CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'

const FAV = 'hk_favs'
const RAT = 'hk_ratings'

export default function FavoritesView() {
  const { markers } = useMap()
  const [favs, setFavs] = useState([])
  const [ratings, setRatings] = useState({})

  useEffect(() => {
    setFavs(JSON.parse(localStorage.getItem(FAV) || '[]'))
    setRatings(JSON.parse(localStorage.getItem(RAT) || '{}'))
  }, [])

  const toggleFav = (id) => {
    const next = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]
    setFavs(next)
    localStorage.setItem(FAV, JSON.stringify(next))
  }

  const setRating = (id, r) => {
    const next = { ...ratings, [id]: r }
    setRatings(next)
    localStorage.setItem(RAT, JSON.stringify(next))
  }

  const items = markers.filter(m => favs.includes(m.id))

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          <h1 className="text-xl font-bold text-gray-900">我的收藏</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">{items.length} 個收藏</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500">暫時未有收藏</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(m => (
              <div key={m.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl">{CATEGORY_ICONS[m.category]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-900">{m.title}</h3>
                      <button onClick={() => toggleFav(m.id)}><Heart className="w-5 h-5 text-red-500 fill-red-500" /></button>
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{CATEGORY_LABELS[m.category]}</span>
                    {m.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{m.description}</p>}
                    <div className="flex gap-1 mt-2">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} onClick={() => setRating(m.id, s)}>
                          <Star className={`w-4 h-4 ${s <= (ratings[m.id]||0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
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
