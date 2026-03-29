import { useState, useEffect } from 'react'
import { Heart, Star, MapPin } from 'lucide-react'
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
    <div className="h-full w-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white px-4 pt-6 pb-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">我的收藏</h1>
            <p className="text-sm text-slate-400">{items.length} 個收藏地點</p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Heart className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">還沒有收藏</h3>
            <p className="text-sm text-slate-400">在地圖上點擊❤️收藏地點</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(m => (
              <div key={m.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl shrink-0">
                    {CATEGORY_ICONS[m.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-slate-900">{m.title}</h3>
                        <span className="inline-block mt-1 px-2.5 py-0.5 bg-slate-100 text-slate-500 text-xs font-medium rounded-full">
                          {CATEGORY_LABELS[m.category]}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleFav(m.id)}
                        className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0"
                      >
                        <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                      </button>
                    </div>
                    {m.description && (
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2">{m.description}</p>
                    )}
                    {m.contact && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                        <MapPin size={12} />
                        <span>{m.contact}</span>
                      </div>
                    )}

                    {/* Rating Stars */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <button
                            key={s}
                            onClick={() => setRating(m.id, s)}
                            className="p-0.5 transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                s <= (ratings[m.id] || 0)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-slate-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">
                        {ratings[m.id] ? `${ratings[m.id]} 星` : '評分'}
                      </span>
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
