import { useState, useRef } from 'react'
import { X, Image, Mic, Video, MapPin, Loader2, Navigation, Utensils, Compass, Bus, Train, AlertCircle } from 'lucide-react'
import { useMap } from '../context/MapContext'
import { useAuth } from '../context/AuthContext'

// Category templates for quick fill
const CATEGORY_TEMPLATES = {
  restaurants: [
    { label: '茶餐廳', icon: '🍜' },
    { label: 'Café', icon: '☕' },
    { label: '快餐店', icon: '🍔' },
    { label: '中菜', icon: '🥢' },
    { label: '日本菜', icon: '🍣' },
    { label: '西餐', icon: '🍽️' },
    { label: '甜品', icon: '🍰' },
  ],
  places: [
    { label: '商場', icon: '🛍️' },
    { label: '公園', icon: '🌳' },
    { label: '海灘', icon: '🏖️' },
    { label: '博物館', icon: '🏛️' },
    { label: '主題樂園', icon: '🎢' },
    { label: '天文館', icon: '🔭' },
    { label: '圖書館', icon: '📚' },
  ],
  transport: [
    { label: '港鐵站', icon: '🚇' },
    { label: '巴士站', icon: '🚌' },
    { label: '的士站', icon: '🚕' },
    { label: '渡輪', icon: '⛴️' },
    { label: '停車場', icon: '🅿️' },
    { label: '單車徑', icon: '🚴' },
  ],
  deals: [
    { label: '餐廳優惠', icon: '🍜' },
    { label: '商場優惠', icon: '🛍️' },
    { label: '信用卡優惠', icon: '💳' },
    { label: '電子支付', icon: '📱' },
    { label: '演唱會/活動', icon: '🎫' },
    { label: '旅遊優惠', icon: '✈️' },
  ],
  news: [
    { label: '新店開幕', icon: '🆕' },
    { label: '活動消息', icon: '📢' },
    { label: '交通消息', icon: '🚧' },
    { label: '天氣警告', icon: '⛈️' },
    { label: '優惠情報', icon: '💰' },
  ]
}

export default function MarkerForm({ onClose, onLoginRequired }) {
  const { addMarker, userLocation } = useMap()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    category: 'places',
    description: '',
    contact: '',
    subcategory: ''
  })
  const [media, setMedia] = useState({
    image: null,
    voice: null,
    video: null
  })
  const [preview, setPreview] = useState(null)
  const [showTemplates, setShowTemplates] = useState(false)
  
  const imageRef = useRef(null)
  const voiceRef = useRef(null)
  const videoRef = useRef(null)

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('請選擇圖片文件')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('圖片不能超過5MB')
        return
      }
      setMedia(prev => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleVoiceRecord = () => {
    // Voice recording would use MediaRecorder API
    setError('語音功能需要 Firebase 設定')
  }

  const handleVideoSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('video/')) {
        setError('請選擇影片文件')
        return
      }
      if (file.size > 20 * 1024 * 1024) {
        setError('影片不能超過20MB')
        return
      }
      setMedia(prev => ({ ...prev, video: file }))
    }
  }

  const handleTemplateSelect = (template) => {
    const prefix = template.icon + ' '
    setForm(prev => ({ 
      ...prev, 
      title: prefix + prev.title.replace(/^[^\s]+\s/, ''),
      subcategory: template.label
    }))
  }

  const handleSubmit = async () => {
    if (!user) {
      onLoginRequired()
      return
    }
    if (!form.title.trim()) {
      setError('請輸入地點名稱')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const imageUrl = media.image ? 'uploaded_image_url' : null
      
      await addMarker({
        ...form,
        lat: userLocation?.lat || 22.3193,
        lng: userLocation?.lng || 114.1694,
        userId: user.uid,
        imageUrl,
        mediaType: media.voice ? 'voice' : media.video ? 'video' : media.image ? 'image' : null
      })
      onClose()
    } catch (err) {
      setError('添加失敗，請重試')
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: 'places', label: '好去處', icon: '🎯', color: 'from-blue-500 to-indigo-500' },
    { id: 'restaurants', label: '餐廳', icon: '🍜', color: 'from-orange-500 to-amber-500' },
    { id: 'transport', label: '交通', icon: '🚌', color: 'from-emerald-500 to-teal-500' },
    { id: 'deals', label: '優惠', icon: '💰', color: 'from-pink-500 to-rose-500' },
    { id: 'news', label: '資訊', icon: '📰', color: 'from-violet-500 to-purple-500' },
  ]

  const currentTemplates = CATEGORY_TEMPLATES[form.category] || []

  return (
    <div className="fixed inset-0 z-[3000] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[95vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-extrabold text-white">加入資訊</h2>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors active:scale-95">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-white/80 text-sm mt-1">幫我哋完善香港生活地圖！</p>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[calc(95vh-180px)]">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-500 text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Image Preview */}
          {preview && (
            <div className="relative">
              <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-2xl" />
              <button
                onClick={() => { setMedia(prev => ({ ...prev, image: null })); setPreview(null); }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center active:scale-95"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          )}

          {/* Media Buttons */}
          <div className="flex gap-3">
            <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
            <input ref={voiceRef} type="file" accept="audio/*" className="hidden" onChange={handleVoiceRecord} />
            <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={handleVideoSelect} />
            
            <button
              onClick={() => imageRef.current?.click()}
              className="flex-1 flex flex-col items-center gap-2 p-4 bg-zinc-100 rounded-2xl hover:bg-zinc-200 transition-all active:scale-95"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Image className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-zinc-700">📷 圖片</span>
            </button>

            <button
              onClick={handleVoiceRecord}
              className="flex-1 flex flex-col items-center gap-2 p-4 bg-zinc-100 rounded-2xl hover:bg-zinc-200 transition-all active:scale-95"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-zinc-700">🎤 語音</span>
            </button>

            <button
              onClick={() => videoRef.current?.click()}
              className="flex-1 flex flex-col items-center gap-2 p-4 bg-zinc-100 rounded-2xl hover:bg-zinc-200 transition-all active:scale-95"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-zinc-700">🎬 影片</span>
            </button>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-3">📂 選擇分類</label>
            <div className="grid grid-cols-5 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { 
                    setForm(prev => ({ ...prev, category: cat.id, subcategory: '' })); 
                    setShowTemplates(true);
                  }}
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 active:scale-95 ${
                    form.category === cat.id
                      ? `border-transparent bg-gradient-to-br ${cat.color} text-white shadow-lg`
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-xs font-bold">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Templates */}
          {showTemplates && currentTemplates.length > 0 && (
            <div className="animate-slide-up">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-zinc-700">⚡ 快速選擇</label>
                <button 
                  onClick={() => setShowTemplates(false)}
                  className="text-xs text-zinc-400 hover:text-zinc-600"
                >
                  隱藏
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentTemplates.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => handleTemplateSelect(t)}
                    className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-xl text-sm font-medium text-zinc-700 flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-2">📍 地點名稱 *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder={form.category === 'transport' ? '例如：港鐵中環站A出口' : '例如：麥當勞旺角店'}
              className="w-full px-4 py-4 bg-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all placeholder:text-zinc-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-2">📝 詳細資訊</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder={
                form.category === 'transport' ? '例如：出口向右行5分鐘就到' :
                form.category === 'restaurants' ? '例如：必試牛腩麵，加小食減$10' :
                form.category === 'deals' ? '例如：AlipayHK付款最高回贈$100' :
                '分享一下呢個地方嘅特色...'
              }
              rows={3}
              className="w-full px-4 py-4 bg-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none placeholder:text-zinc-400"
            />
          </div>

          {/* Contact / Address */}
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-2">
              {form.category === 'transport' ? '🚏 交通提示' : '📍 地址/聯絡'}
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                value={form.contact}
                onChange={(e) => setForm(prev => ({ ...prev, contact: e.target.value }))}
                placeholder={
                  form.category === 'transport' ? '例如：港鐵荃灣線，步行5分鐘' :
                  '地址或聯絡電話'
                }
                className="w-full pl-12 pr-4 py-4 bg-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 placeholder:text-zinc-400"
              />
            </div>
          </div>

          {/* Location Info */}
          {userLocation && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl">
              <Navigation className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-emerald-700">
                📍 將會添加到你目前位置附近
              </span>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-amber-200 hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              '✅ 加入地圖'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
