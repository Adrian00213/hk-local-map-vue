import { useState, useEffect, useRef } from 'react'
import { Send, Mic, Image, Video, X, Play, Heart, MoreHorizontal, MessageCircle, Trash2 } from 'lucide-react'

// Demo messages for showcase
const DEMO_MESSAGES = [
  {
    id: 'demo_1',
    text: '👋 大家好！灣仔有間新開嘅咖啡店，環境好舒服',
    type: 'text',
    userName: '灣仔咖啡控',
    userId: 'demo_user_1',
    isAnonymous: true,
    createdAt: { toDate: () => new Date(Date.now() - 300000) },
    likes: 12
  },
  {
    id: 'demo_2',
    text: '🗺️ 旺角邊度有嘢食？求推介',
    type: 'text',
    userName: '九龍遊客',
    userId: 'demo_user_2',
    isAnonymous: true,
    createdAt: { toDate: () => new Date(Date.now() - 180000) },
    likes: 3
  },
  {
    id: 'demo_3',
    text: '🍜 義順牛奶公司幾好食！可以去試下',
    type: 'text',
    userName: '旺角街坊',
    userId: 'demo_user_3',
    isAnonymous: true,
    createdAt: { toDate: () => new Date(Date.now() - 60000) },
    likes: 8
  }
]

const ANONYMOUS_NAMES = [
  '香港遊客', '灣仔居民', '旺角街坊', '中環OL', '九龍塘學生',
  '銅鑼灣購物者', '深水埗街坊', '紅磡港漂', '太子網紅', '油麻地小店',
  '堅尼地茶記迷', '北角老街坊', '筲箕灣海鮮佬', '西環讀書人'
]

export default function LiveChat({ channel = 'general' }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [likedMessages, setLikedMessages] = useState(new Set())
  const [isDemoMode, setIsDemoMode] = useState(true)
  const [localImage, setLocalImage] = useState(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const anonymousId = useRef('demo_' + Math.random().toString(36).substr(2, 9))
  const anonymousName = useRef(ANONYMOUS_NAMES[Math.floor(Math.random() * ANONYMOUS_NAMES.length)])

  // Load liked messages from localStorage
  useEffect(() => {
    const liked = JSON.parse(localStorage.getItem('hk_liked_messages') || '[]')
    setLikedMessages(new Set(liked))
    
    // Load saved messages from localStorage
    const saved = JSON.parse(localStorage.getItem('hk_demo_messages') || '[]')
    if (saved.length > 0) {
      setMessages(saved)
    } else {
      setMessages(DEMO_MESSAGES)
    }
  }, [])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const saveMessages = (msgs) => {
    localStorage.setItem('hk_demo_messages', JSON.stringify(msgs))
  }

  const sendMessage = (text, type = 'text', mediaUrl = null) => {
    if (!text.trim() && !mediaUrl) return

    const message = {
      id: 'msg_' + Date.now(),
      text: text.trim(),
      type,
      mediaUrl,
      userId: anonymousId.current,
      userName: anonymousName.current,
      userPhoto: null,
      isAnonymous: true,
      createdAt: { toDate: () => new Date() },
      likes: 0
    }

    const newMessages = [...messages, message]
    setMessages(newMessages)
    saveMessages(newMessages)
  }

  const handleSend = (e) => {
    e?.preventDefault()
    if (newMessage.trim()) {
      sendMessage(newMessage)
      setNewMessage('')
    }
  }

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const mediaUrl = ev.target.result
        sendMessage('', type, mediaUrl)
      }
      reader.readAsDataURL(file)
    }
    setShowMediaPicker(false)
  }

  const toggleLike = (messageId) => {
    const newLiked = new Set(likedMessages)
    const newMessages = messages.map(msg => {
      if (msg.id === messageId) {
        if (newLiked.has(messageId)) {
          newLiked.delete(messageId)
          return { ...msg, likes: msg.likes - 1 }
        } else {
          newLiked.add(messageId)
          return { ...msg, likes: msg.likes + 1 }
        }
      }
      return msg
    })
    
    localStorage.setItem('hk_liked_messages', JSON.stringify([...newLiked]))
    setLikedMessages(newLiked)
    setMessages(newMessages)
    saveMessages(newMessages)
  }

  const deleteMessage = (messageId) => {
    if (messages.find(m => m.id === messageId)?.userId !== anonymousId.current) return
    const newMessages = messages.filter(m => m.id !== messageId)
    setMessages(newMessages)
    saveMessages(newMessages)
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-stone-50 to-white">
      {/* Chat Header */}
      <div className="bg-white/90 backdrop-blur border-b border-stone-200 px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900">💬 即時討論</h3>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            {isDemoMode ? (
              <>
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                Demo 模式 · 本地演示
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                {messages.length} 條留言
              </>
            )}
          </p>
        </div>
        {isDemoMode && (
          <button
            onClick={() => setIsDemoMode(false)}
            className="px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-full"
          >
            開啟 Firestore
          </button>
        )}
      </div>

      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="mx-4 mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-xs text-amber-700">
            🎭 <strong>Demo 模式</strong>：訊息保存在本地瀏覽器，唔需要 Firebase。
            配置 Firebase 後即可開啟即時同步功能。
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>暫時冇留言</p>
            <p className="text-sm">成為第一個留言嘅人！</p>
          </div>
        )}

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-3 ${msg.userId === anonymousId.current ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 ${
              msg.isAnonymous 
                ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' 
                : 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white'
            }`}>
              {msg.userPhoto ? (
                <img src={msg.userPhoto} className="w-full h-full rounded-2xl object-cover" />
              ) : (
                msg.userName?.charAt(0) || '?'
              )}
            </div>

            {/* Message Content */}
            <div className={`max-w-[75%] ${msg.userId === anonymousId.current ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-2.5 rounded-2xl ${
                msg.userId === anonymousId.current
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-tr-md'
                  : 'bg-white border border-stone-200 text-gray-800 rounded-tl-md'
              }`}>
                {/* Name */}
                <p className={`text-xs font-medium mb-1 ${
                  msg.userId === anonymousId.current ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {msg.userName}
                </p>

                {/* Text */}
                {msg.type === 'text' && msg.text && (
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                )}

                {/* Image */}
                {msg.type === 'image' && msg.mediaUrl && (
                  <div className="space-y-2">
                    <img 
                      src={msg.mediaUrl} 
                      alt="分享的圖片"
                      className="rounded-xl max-w-full max-h-64 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(msg.mediaUrl, '_blank')}
                    />
                    {msg.text && <p className="text-sm">{msg.text}</p>}
                  </div>
                )}

                {/* Video */}
                {msg.type === 'video' && msg.mediaUrl && (
                  <div className="space-y-2">
                    <video 
                      src={msg.mediaUrl}
                      controls
                      className="rounded-xl max-w-full max-h-64"
                    />
                    {msg.text && <p className="text-sm">{msg.text}</p>}
                  </div>
                )}
              </div>

              {/* Time & Actions */}
              <div className={`flex items-center gap-2 mt-1 px-1 ${msg.userId === anonymousId.current ? 'flex-row-reverse' : ''}`}>
                <span className="text-xs text-gray-400">{formatTime(msg.createdAt)}</span>
                <button
                  onClick={() => toggleLike(msg.id)}
                  className={`flex items-center gap-1 text-xs transition-colors ${
                    likedMessages.has(msg.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className="w-4 h-4" fill={likedMessages.has(msg.id) ? 'currentColor' : 'none'} />
                  {msg.likes > 0 && msg.likes}
                </button>
                {msg.userId === anonymousId.current && (
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Media Picker */}
      {showMediaPicker && (
        <div className="absolute inset-x-0 bottom-20 bg-white border-t border-stone-200 p-4 flex justify-around">
          <button
            onClick={() => {
              setShowMediaPicker(false)
              fileInputRef.current?.click()
            }}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-stone-100 transition-colors"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
              <Image className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-600">相片</span>
          </button>
          <button
            onClick={() => {
              setShowMediaPicker(false)
              videoInputRef.current?.click()
            }}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-stone-100 transition-colors"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center">
              <Video className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-600">影片</span>
          </button>
          <button
            onClick={() => setShowMediaPicker(false)}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      )}

      {/* Hidden Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e, 'image')}
      />
      <input
        type="file"
        ref={videoInputRef}
        accept="video/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e, 'video')}
      />

      {/* Input Area */}
      <div className="bg-white/90 backdrop-blur border-t border-stone-200 p-4">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowMediaPicker(!showMediaPicker)}
            className="w-11 h-11 rounded-2xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="寫下你的留言..."
            className="flex-1 py-3 px-4 bg-stone-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
          />

          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="w-11 h-11 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </form>
      </div>
    </div>
  )
}
