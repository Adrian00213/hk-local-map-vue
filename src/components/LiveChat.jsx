import { useState, useEffect, useRef } from 'react'
import { Send, Mic, Image, Video, X, Play, Pause, Download, Heart, MoreHorizontal, MessageCircle } from 'lucide-react'
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../services/firebase'
import { useAuth } from '../context/AuthContext'

// Generate anonymous user ID
const getAnonymousId = () => {
  let id = localStorage.getItem('hk_anonymous_id')
  if (!id) {
    id = 'user_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('hk_anonymous_id', id)
  }
  return id
}

const ANONYMOUS_NAMES = [
  '香港遊客', '灣仔居民', '旺角街坊', '中環OL', '九龍塘學生',
  '銅鑼灣購物者', '深水埗街坊', '紅磡港漂', '太子網紅', '油麻地小店'
]

export default function LiveChat({ channel = 'general' }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [likedMessages, setLikedMessages] = useState(new Set())
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const anonymousId = useRef(getAnonymousId())
  const anonymousName = useRef(ANONYMOUS_NAMES[Math.floor(Math.random() * ANONYMOUS_NAMES.length)])

  // Load liked messages from localStorage
  useEffect(() => {
    const liked = JSON.parse(localStorage.getItem('hk_liked_messages') || '[]')
    setLikedMessages(new Set(liked))
  }, [])

  // Listen to real-time messages
  useEffect(() => {
    const messagesRef = collection(db, 'chats', channel, 'messages')
    const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(50))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setMessages(msgs.reverse())
    })

    return () => unsubscribe()
  }, [channel])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text, type = 'text', mediaUrl = null) => {
    if (!text.trim() && !mediaUrl) return

    const message = {
      text: text.trim(),
      type,
      mediaUrl,
      userId: user?.uid || anonymousId.current,
      userName: user?.displayName || anonymousName.current,
      userPhoto: user?.photoURL || null,
      isAnonymous: !user,
      createdAt: serverTimestamp(),
      likes: 0
    }

    try {
      await addDoc(collection(db, 'chats', channel, 'messages'), message)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      sendMessage(newMessage)
      setNewMessage('')
    }
  }

  const uploadMedia = async (file, type) => {
    setUploading(true)
    try {
      const filename = `${Date.now()}_${file.name}`
      const storageRef = ref(storage, `chats/${channel}/${filename}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      
      const mediaType = file.type.startsWith('video') ? 'video' : 'image'
      sendMessage('', mediaType, url)
    } catch (error) {
      console.error('Upload error:', error)
    }
    setUploading(false)
    setShowMediaPicker(false)
  }

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      uploadMedia(file, type)
    }
  }

  // Voice Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        stream.getTracks().forEach(track => track.stop())
        
        // Upload audio
        setUploading(true)
        try {
          const filename = `voice_${Date.now()}.webm`
          const storageRef = ref(storage, `chats/${channel}/${filename}`)
          await uploadBytes(storageRef, audioBlob)
          const url = await getDownloadURL(storageRef)
          sendMessage('', 'voice', url)
        } catch (error) {
          console.error('Voice upload error:', error)
        }
        setUploading(false)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Recording error:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const toggleLike = async (message) => {
    const messageRef = doc(db, 'chats', channel, 'messages', message.id)
    const newLiked = new Set(likedMessages)
    
    if (newLiked.has(message.id)) {
      newLiked.delete(message.id)
      await updateDoc(messageRef, { likes: increment(-1) })
    } else {
      newLiked.add(message.id)
      await updateDoc(messageRef, { likes: increment(1) })
    }
    
    localStorage.setItem('hk_liked_messages', JSON.stringify([...newLiked]))
    setLikedMessages(newLiked)
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDuration = (url) => {
    return '📎 語音'
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
          <p className="text-xs text-green-500 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {messages.length} 條留言
          </p>
        </div>
      </div>

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
            className={`flex gap-3 ${msg.userId === (user?.uid || anonymousId.current) ? 'flex-row-reverse' : ''}`}
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
            <div className={`max-w-[75%] ${msg.userId === (user?.uid || anonymousId.current) ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-2.5 rounded-2xl ${
                msg.userId === (user?.uid || anonymousId.current)
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-tr-md'
                  : 'bg-white border border-stone-200 text-gray-800 rounded-tl-md'
              }`}>
                {/* Name */}
                <p className={`text-xs font-medium mb-1 ${
                  msg.userId === (user?.uid || anonymousId.current) ? 'text-white/80' : 'text-gray-500'
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
                      className="rounded-xl max-w-full cursor-pointer hover:opacity-90 transition-opacity"
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

                {/* Voice */}
                {msg.type === 'voice' && msg.mediaUrl && (
                  <div className="flex items-center gap-2 min-w-[200px]">
                    <button
                      onClick={() => {
                        const audio = new Audio(msg.mediaUrl)
                        audio.play()
                      }}
                      className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <Play className="w-5 h-5" fill="white" />
                    </button>
                    <div className="flex-1 h-10 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full w-full flex items-center px-3">
                        <Mic className="w-4 h-4" />
                        <div className="flex-1 mx-2 h-1 bg-white/30 rounded-full">
                          <div className="w-1/3 h-full bg-white rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Time & Actions */}
              <div className={`flex items-center gap-2 mt-1 px-1 ${msg.userId === (user?.uid || anonymousId.current) ? 'flex-row-reverse' : ''}`}>
                <span className="text-xs text-gray-400">{formatTime(msg.createdAt)}</span>
                <button
                  onClick={() => toggleLike(msg)}
                  className={`flex items-center gap-1 text-xs transition-colors ${
                    likedMessages.has(msg.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className="w-4 h-4" fill={likedMessages.has(msg.id) ? 'currentColor' : 'none'} />
                  {msg.likes > 0 && msg.likes}
                </button>
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
            onClick={() => {
              setShowMediaPicker(false)
              if (!isRecording) startRecording()
            }}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-stone-100 transition-colors"
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center ${isRecording ? 'animate-pulse' : ''}`}>
              <Mic className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-600">{isRecording ? '錄製中...' : '語音'}</span>
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
        {uploading && (
          <div className="mb-2 text-sm text-gray-500 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            上傳緊，等一等...
          </div>
        )}
        
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowMediaPicker(!showMediaPicker)}
            className="w-11 h-11 rounded-2xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>

          {isRecording ? (
            <button
              type="button"
              onClick={stopRecording}
              className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 animate-pulse"
            >
              <Mic className="w-5 h-5" />
              錄製中... 點擊停止
            </button>
          ) : (
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="寫下你的留言..."
              className="flex-1 py-3 px-4 bg-stone-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
            />
          )}

          <button
            type="submit"
            disabled={!newMessage.trim() || isRecording}
            className="w-11 h-11 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </form>
      </div>
    </div>
  )
}
