import { useState, useEffect, useRef } from 'react'
import { MessageCircle, ThumbsUp, ThumbsDown, Clock, User, Star, Mic, Video, Image, MapPin, Shield, CheckCircle, AlertCircle } from 'lucide-react'

// Sample verified reviews
const SAMPLE_REVIEWS = [
  {
    id: '1',
    placeId: '1',
    placeName: '九記牛腩',
    userName: 'foodie_hk',
    userBadge: 'verified', // verified, elite, new
    rating: 5,
    text: '真係必試！牛腩軟腍入味，麵底掛湯。下午兩點去都排咗15分鐘，值得👍',
    images: [],
    voiceNote: null,
    video: null,
    likes: 234,
    time: '2小時前',
    isLiked: false,
  },
  {
    id: '2',
    placeId: '2',
    placeName: '山頂纜車',
    userName: 'tourist_guide',
    userBadge: 'elite',
    rating: 4,
    text: '維港景色一流！建議傍晚去，睇埋日落再睇夜景。記得提前網上購票，唔使排隊',
    images: [],
    voiceNote: null,
    video: null,
    likes: 189,
    time: '5小時前',
    isLiked: false,
  },
  {
    id: '3',
    placeId: '3',
    placeName: '蘭桂坊',
    userName: 'night_owl',
    userBadge: 'verified',
    rating: 3,
    text: '氣氛唔錯，但消費偏貴。外國遊客多，想體驗香港夜生活可以去試試',
    images: [],
    voiceNote: null,
    video: null,
    likes: 67,
    time: '昨日',
    isLiked: false,
  },
  {
    id: '4',
    placeName: '西九文化區',
    userName: 'art_lover',
    userBadge: 'elite',
    rating: 5,
    text: '免費入場！香港故宮博物館真係好靚，配合M+視覺文化博物館，一路睇一路打卡',
    images: [],
    voiceNote: null,
    video: null,
    likes: 456,
    time: '昨日',
    isLiked: false,
  },
]

const BADGE_CONFIG = {
  verified: { icon: CheckCircle, color: 'text-blue-500 bg-blue-50', label: '已驗證' },
  elite: { icon: Shield, color: 'text-stone-600 bg-stone-100', label: '精英用家' },
  new: { icon: AlertCircle, color: 'text-green-500 bg-green-50', label: '新用家' },
}

export default function ReviewsView() {
  const [reviews, setReviews] = useState([])
  const [selectedPlace, setSelectedPlace] = useState('')
  const [newReview, setNewReview] = useState({ rating: 5, text: '', images: [], voiceNote: null, video: null })
  const [showAddReview, setShowAddReview] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  useEffect(() => {
    setReviews(SAMPLE_REVIEWS)
  }, [])

  const handleLike = (id) => {
    setReviews(reviews.map(r => {
      if (r.id === id) {
        return { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 }
      }
      return r
    }))
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setNewReview(prev => ({ ...prev, voiceNote: blob }))
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorderRef.current.start()
      setIsRecording(true)
      
      // Timer
      let seconds = 0
      const interval = setInterval(() => {
        seconds++
        setRecordingTime(seconds)
        if (seconds >= 60) { // Max 60 seconds
          stopRecording()
          clearInterval(interval)
        }
      }, 1000)
    } catch (err) {
      console.log('Microphone access denied')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const submitReview = () => {
    if (!newReview.text.trim() && !newReview.voiceNote && !newReview.video) return
    
    const review = {
      id: Date.now().toString(),
      placeId: selectedPlace || 'unknown',
      placeName: selectedPlace || '未指定地點',
      userName: '你',
      userBadge: 'new',
      rating: newReview.rating,
      text: newReview.text,
      images: newReview.images,
      voiceNote: newReview.voiceNote ? URL.createObjectURL(newReview.voiceNote) : null,
      video: null,
      likes: 0,
      time: '刚刚',
      isLiked: false,
    }
    
    setReviews([review, ...reviews])
    setShowAddReview(false)
    setNewReview({ rating: 5, text: '', images: [], voiceNote: null, video: null })
  }

  return (
    <div className="h-full w-full flex flex-col bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-100/80 px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200/50">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">用家點評</h1>
            <p className="text-sm text-zinc-400">真實評分 • 影片/語音點評</p>
          </div>
        </div>
      </div>

      {/* Add Review Button */}
      {!showAddReview && (
        <div className="p-5">
          <button
            onClick={() => setShowAddReview(true)}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200/50 flex items-center justify-center gap-2 btn-premium"
          >
            <MessageCircle className="w-5 h-5" />
            撰寫點評
          </button>
        </div>
      )}

      {/* Add Review Form */}
      {showAddReview && (
        <div className="p-5 animate-slide-up">
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-100/80 overflow-hidden">
            <div className="p-5">
              <h3 className="font-bold text-zinc-900 mb-4">撰寫新點評</h3>
              
              {/* Place Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-600 mb-1.5">地點名稱</label>
                <input
                  type="text"
                  value={selectedPlace}
                  onChange={(e) => setSelectedPlace(e.target.value)}
                  placeholder="例如：九記牛腩"
                  className="w-full px-4 py-3 bg-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              
              {/* Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-600 mb-1.5">評分</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all"
                    >
                      <Star className={`w-8 h-8 ${star <= newReview.rating ? 'text-stone-500 fill-amber-400' : 'text-zinc-200'}`} />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Text Review */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-600 mb-1.5">文字點評</label>
                <textarea
                  value={newReview.text}
                  onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="分享你的真實體驗..."
                  rows={3}
                  className="w-full px-4 py-3 bg-zinc-100 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              
              {/* Voice Note */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-600 mb-1.5">語音點評</label>
                <div className="flex items-center gap-3">
                  {newReview.voiceNote ? (
                    <div className="flex-1 p-3 bg-emerald-50 rounded-xl flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Mic className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-emerald-700">語音已錄製</p>
                        <p className="text-xs text-emerald-500">點擊播放</p>
                      </div>
                      <button 
                        onClick={() => setNewReview(prev => ({ ...prev, voiceNote: null }))}
                        className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center"
                      >
                        <span className="text-red-500">×</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                        isRecording 
                          ? 'bg-red-500 text-white animate-pulse' 
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      <Mic className="w-5 h-5" />
                      {isRecording ? `錄製中 ${formatTime(recordingTime)}` : '點擊錄製語音'}
                    </button>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddReview(false)}
                  className="flex-1 py-3 bg-zinc-100 text-zinc-600 font-medium rounded-xl"
                >
                  取消
                </button>
                <button
                  onClick={submitReview}
                  disabled={!newReview.text.trim() && !newReview.voiceNote}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl disabled:opacity-50"
                >
                  發布點評
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="space-y-4 stagger-children">
          {reviews.map((review) => {
            const badge = BADGE_CONFIG[review.userBadge]
            const BadgeIcon = badge.icon
            return (
              <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-zinc-100/80 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
                      <User className="w-6 h-6 text-zinc-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-zinc-900">{review.userName}</span>
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-medium flex items-center gap-1 ${badge.color}`}>
                          <BadgeIcon className="w-3 h-3" />
                          {badge.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-stone-500 fill-amber-400' : 'text-zinc-200'}`} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {review.time}
                    </span>
                  </div>
                  
                  {review.placeName && (
                    <div className="flex items-center gap-1.5 mb-2 text-sm">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <span className="font-medium text-emerald-600">{review.placeName}</span>
                    </div>
                  )}
                  
                  <p className="text-zinc-600 leading-relaxed">{review.text}</p>
                  
                  {review.voiceNote && (
                    <div className="mt-3 p-3 bg-emerald-50 rounded-xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Mic className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-emerald-700">語音點評</p>
                        <p className="text-xs text-emerald-500">點擊播放</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="px-5 py-3 bg-zinc-50/80 flex items-center gap-4">
                  <button
                    onClick={() => handleLike(review.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                      review.isLiked 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'hover:bg-zinc-100 text-zinc-500'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${review.isLiked ? 'fill-emerald-500' : ''}`} />
                    <span className="text-sm font-medium">{review.likes}</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
