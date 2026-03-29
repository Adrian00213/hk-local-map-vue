import { useState } from 'react'
import { Sparkles, Calendar, MapPin, Clock, Users, ChevronRight, Loader2, Plus, Trash2, Share2, Check, Wand2 } from 'lucide-react'
import { CATEGORY_ICONS, CATEGORY_LABELS } from '../context/MapContext'

const TRIP_TYPES = [
  { id: 'food', label: '美食之旅', icon: '🍜', desc: '品嚐香港美食' },
  { id: 'sightseeing', label: '觀光遊覽', icon: '🏛️', desc: '探索景點' },
  { id: 'shopping', label: '購物血拼', icon: '🛍️', desc: '商場與市集' },
  { id: 'mixed', label: '綜合體驗', icon: '✨', desc: '全部都要' },
]

const SAMPLE_ITINERARIES = {
  food: [
    { time: '09:00', title: '傳統港式早餐', place: '茶餐廳', desc: '菠蘿油、絲襪奶茶', icon: '🍵' },
    { time: '11:30', title: '中環蓮香樓', place: '上環', desc: '傳統點心體驗', icon: '🥟' },
    { time: '14:00', title: '九記牛腩', place: '中環', desc: '必試招牌牛腩麵', icon: '🍜' },
    { time: '16:30', title: '旺角街頭小食', place: '旺角', desc: '咖喱魚蛋、雞蛋仔', icon: '🍡' },
    { time: '19:00', title: '廚師發辦晚餐', place: '尖沙咀', desc: '高級日本料理', icon: '🍣' },
  ],
  sightseeing: [
    { time: '09:30', title: '山頂纜車', place: '中環', desc: '乘坐纜車上山頂', icon: '🚡' },
    { time: '11:00', title: '凌霄閣觀景台', place: '山頂', desc: '360度維港景色', icon: '🏙️' },
    { time: '13:00', title: '香港公園午餐', place: '金鐘', desc: '環境優美嘅休閒', icon: '🌳' },
    { time: '15:00', title: '香港故宮博物館', place: '西九', desc: '文化藝術之旅', icon: '🏛️' },
    { time: '18:00', title: '尖沙咀海傍', place: '尖沙咀', desc: '欣賞幻彩詠香江', icon: '🌉' },
  ],
  shopping: [
    { time: '10:00', title: '海港城', place: '尖沙咀', desc: '最大型商場之一', icon: '🛍️' },
    { time: '13:00', title: '午餐時間', place: '海港城', desc: '商場內美食廣場', icon: '🍽️' },
    { time: '15:00', title: '女人街', place: '旺角', desc: '露天市集尋寶', icon: '🏪' },
    { time: '17:30', title: '波鞋街', place: '旺角', desc: '運動品牌集中地', icon: '👟' },
    { time: '20:00', title: '又一城', place: '九龍塘', desc: '晚間購物', icon: '🛒' },
  ],
  mixed: [
    { time: '09:00', title: '傳統早餐', place: '茶餐廳', desc: '港式奶茶+多士', icon: '🍵' },
    { time: '11:00', title: '山頂纜車', place: '山頂', desc: '遊覽維港景色', icon: '🚡' },
    { time: '13:30', title: '午餐', place: '中環', desc: '中環美食推薦', icon: '🍜' },
    { time: '15:30', title: '逛市集', place: 'PMQ', desc: '本地設計師商品', icon: '🎨' },
    { time: '18:00', title: '天星小輪', place: '尖沙咀', desc: '過海體驗', icon: '🚢' },
    { time: '20:00', title: '晚餐', place: '蘭桂坊', desc: '中西美食薈萃', icon: '🍽️' },
  ],
}

export default function TripPlannerView() {
  const [tripType, setTripType] = useState(null)
  const [days, setDays] = useState(1)
  const [companions, setCompanions] = useState('solo')
  const [generating, setGenerating] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [savedTrips, setSavedTrips] = useState([])
  const [currentTrip, setCurrentTrip] = useState(null)

  const handleGenerate = async () => {
    if (!tripType) return
    setGenerating(true)
    
    // Simulate AI generation
    await new Promise(r => setTimeout(r, 2000))
    
    const itinerary = Array.from({ length: days }, (_, dayIndex) => ({
      day: dayIndex + 1,
      date: `第 ${dayIndex + 1} 天`,
      activities: SAMPLE_ITINERARIES[tripType]
    }))
    
    setCurrentTrip({
      type: tripType,
      days,
      companions,
      itinerary
    })
    
    setGenerating(false)
    setShowResult(true)
  }

  const saveTrip = () => {
    if (currentTrip) {
      setSavedTrips(prev => [...prev, { ...currentTrip, id: Date.now() }])
    }
  }

  const deleteTrip = (id) => {
    setSavedTrips(prev => prev.filter(t => t.id !== id))
  }

  const shareTrip = (trip) => {
    const text = `${TRIP_TYPES[trip.type].label} ${trip.days}日遊\n` +
      trip.itinerary.map(day => 
        `\n${day.date}:\n` + 
        day.activities.map(a => `${a.time} ${a.title} (${a.place})`).join('\n')
      ).join('')
    
    if (navigator.share) {
      navigator.share({ title: '香港行程', text })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  const tripTypeLabels = { food: '美食之旅', sightseeing: '觀光遊覽', shopping: '購物血拼', mixed: '綜合體驗' }

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-b from-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-200">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">AI 行程規劃</h1>
            <p className="text-sm text-slate-400">智能推薦最適合你的路線</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {!showResult ? (
          <div className="space-y-6 animate-slide-up">
            {/* Trip Type */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-violet-500" />
                選擇行程類型
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {TRIP_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setTripType(type.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      tripType === type.id
                        ? 'border-violet-500 bg-violet-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-3xl mb-2 block">{type.icon}</span>
                    <h3 className="font-bold text-slate-900">{type.label}</h3>
                    <p className="text-xs text-slate-500 mt-1">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Days */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                行程天數
              </h2>
              <div className="flex gap-2">
                {[1, 2, 3, 5].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDays(d)}
                    className={`flex-1 py-4 rounded-2xl font-bold transition-all ${
                      days === d
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {d} 日
                  </button>
                ))}
              </div>
            </div>

            {/* Companions */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-500" />
                同行人數
              </h2>
              <div className="flex gap-2">
                {[
                  { id: 'solo', label: '一个人', icon: '🧑' },
                  { id: 'couple', label: '情侶', icon: '💑' },
                  { id: 'family', label: '家庭', icon: '👨‍👩‍👧' },
                  { id: 'friends', label: '朋友', icon: '👯' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCompanions(c.id)}
                    className={`flex-1 py-3 rounded-2xl font-semibold transition-all flex flex-col items-center gap-1 ${
                      companions === c.id
                        ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{c.icon}</span>
                    <span className="text-xs">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!tripType || generating}
              className="w-full py-5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white font-bold rounded-2xl shadow-xl shadow-violet-200 hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {generating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>AI 規劃中...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>AI 生成專屬行程</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-slide-up">
            {/* Back Button */}
            <button
              onClick={() => { setShowResult(false); setCurrentTrip(null); }}
              className="flex items-center gap-2 text-slate-500 font-medium"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
              重新規劃
            </button>

            {/* Trip Header */}
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 rounded-3xl p-5 text-white">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{TRIP_TYPES.find(t => t.id === currentTrip.type)?.icon}</span>
                <div>
                  <h2 className="text-xl font-extrabold">{tripTypeLabels[currentTrip.type]}</h2>
                  <p className="text-white/80 text-sm">{currentTrip.days} 日遊 • {currentTrip.companions === 'solo' ? '獨自出遊' : currentTrip.companions === 'couple' ? '情侶出行' : currentTrip.companions === 'family' ? '家庭樂' : '朋友同遊'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={saveTrip}
                  className="flex-1 py-3 bg-white/20 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/30 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  保存行程
                </button>
                <button
                  onClick={() => shareTrip(currentTrip)}
                  className="flex-1 py-3 bg-white/20 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/30 transition-all"
                >
                  <Share2 className="w-5 h-5" />
                  分享
                </button>
              </div>
            </div>

            {/* Itinerary */}
            {currentTrip.itinerary.map((day) => (
              <div key={day.day} className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-lg">{day.date}</h3>
                </div>
                <div className="p-4 space-y-3">
                  {day.activities.map((activity, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl">
                          {activity.icon}
                        </div>
                        {i < day.activities.length - 1 && (
                          <div className="w-0.5 flex-1 bg-slate-200 my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-violet-500 bg-violet-50 px-2 py-0.5 rounded">{activity.time}</span>
                        </div>
                        <h4 className="font-bold text-slate-900">{activity.title}</h4>
                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {activity.place}
                        </p>
                        <p className="text-sm text-slate-400 mt-1">{activity.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Saved Trips */}
            {savedTrips.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-900 mb-3">已保存的行程</h3>
                <div className="space-y-2">
                  {savedTrips.map((trip) => (
                    <div key={trip.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{TRIP_TYPES.find(t => t.id === trip.type)?.icon}</span>
                        <div>
                          <h4 className="font-semibold text-slate-900">{tripTypeLabels[trip.type]}</h4>
                          <p className="text-xs text-slate-400">{trip.days} 日遊</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => shareTrip(trip)} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200">
                          <Share2 className="w-4 h-4 text-slate-500" />
                        </button>
                        <button onClick={() => deleteTrip(trip.id)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
