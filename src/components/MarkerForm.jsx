import { useState, useRef } from 'react'
import { X, Image, Mic, Video, MapPin, Loader2 } from 'lucide-react'
import { useMap } from '../context/MapContext'
import { useAuth } from '../context/AuthContext'

export default function MarkerForm({ onClose, onLoginRequired }) {
  const { addMarker, userLocation } = useMap()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    category: 'deals',
    description: '',
    contact: ''
  })
  const [media, setMedia] = useState({
    image: null,
    voice: null,
    video: null
  })
  const [preview, setPreview] = useState(null)
  
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

  const handleSubmit = async () => {
    if (!user) {
      onLoginRequired()
      return
    }
    if (!form.title.trim()) {
      setError('請輸入標題')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      // In production, upload media to Firebase Storage first
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
    { id: 'deals', label: '優惠', icon: '🛒', color: 'from-red-500 to-pink-500' },
    { id: 'restaurants', label: '餐廳', icon: '🍜', color: 'from-orange-500 to-amber-500' },
    { id: 'places', label: '好去處', icon: '🎯', color: 'from-blue-500 to-indigo-500' },
    { id: 'news', label: '資訊', icon: '📰', color: 'from-green-500 to-emerald-500' }
  ]

  return (
    <div className="fixed inset-0 z-[3000] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 px-5 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white">添加地點</h2>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-500 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Image Preview */}
          {preview && (
            <div className="relative">
              <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-2xl" />
              <button
                onClick={() => { setMedia(prev => ({ ...prev, image: null })); setPreview(null); }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
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
              className="flex-1 flex flex-col items-center gap-2 p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Image className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-700">圖片</span>
            </button>

            <button
              onClick={handleVoiceRecord}
              className="flex-1 flex flex-col items-center gap-2 p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-700">語音</span>
            </button>

            <button
              onClick={() => videoRef.current?.click()}
              className="flex-1 flex flex-col items-center gap-2 p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-700">影片</span>
            </button>
          </div>

          {/* Media Status */}
          {media.image && !preview && (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
              <Image className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-600 font-medium">已選擇圖片</span>
            </div>
          )}
          {media.video && (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
              <Video className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-600 font-medium">已選擇影片: {media.video.name}</span>
            </div>
          )}

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">分類</label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setForm(prev => ({ ...prev, category: cat.id }))}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    form.category === cat.id
                      ? `border-transparent bg-gradient-to-br ${cat.color} text-white shadow-lg`
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="font-bold">{cat.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">地點名稱 *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="例如：麥當勞旺角店"
              className="w-full px-4 py-4 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">描述</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="描述這個地點..."
              rows={3}
              className="w-full px-4 py-4 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">地址/聯絡</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={form.contact}
                onChange={(e) => setForm(prev => ({ ...prev, contact: e.target.value }))}
                placeholder="地址或聯絡電話"
                className="w-full pl-12 pr-4 py-4 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : '添加到地圖'}
          </button>
        </div>
      </div>
    </div>
  )
}
