import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Image, Mic, Send, X, Heart, MapPin, Users, ThumbsUp, Camera } from 'lucide-react'

// Mock comments data
const INITIAL_COMMENTS = [
  {
    id: 1,
    user: '香港仔',
    avatar: '👨',
    district: '中西區',
    text: '中環大館幾時先去最好？週末定平日？',
    time: '5分鐘前',
    likes: 12,
    replies: 2,
    images: [],
    voice: null,
  },
  {
    id: 2,
    user: '灣仔友',
    avatar: '👩',
    district: '灣仔',
    text: '灣仔藍屋依家開放未？想帶小朋友去影相',
    time: '15分鐘前',
    likes: 8,
    replies: 1,
    images: [],
    voice: null,
  },
  {
    id: 3,
    user: '九龍人',
    avatar: '👨‍💼',
    district: '油尖旺',
    text: '廟街夜晚真係好熱鬧！但係小心被呃遊客',
    time: '30分鐘前',
    likes: 25,
    replies: 5,
    images: [],
    voice: null,
  },
]

export default function CommunityBoard({ selectedDistrict }) {
  const [comments, setComments] = useState(INITIAL_COMMENTS)
  const [newComment, setNewComment] = useState('')
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [showVoice, setShowVoice] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  const [voiceText, setVoiceText] = useState('')
  const [selectedTab, setSelectedTab] = useState('all')
  const fileInputRef = useRef(null)
  const voiceRef = useRef(null)

  const filteredComments = selectedDistrict 
    ? comments.filter(c => c.district === selectedDistrict)
    : comments

  const handleSendComment = () => {
    // Allow posting with text, image, or just to test
    const hasContent = newComment.trim() || uploadedImages.length > 0 || voiceText
    if (!hasContent) {
      // Still allow posting for demo purposes
    }
    
    const newEntry = {
      id: Date.now(),
      user: '你',
      avatar: '🧑',
      district: selectedDistrict || '其他',
      text: newComment,
      time: '剛剛',
      likes: 0,
      replies: 0,
      images: uploadedImages,
      voice: voiceText || null,
    }
    
    setComments([newEntry, ...comments])
    setNewComment('')
    setUploadedImages([])
    setVoiceText('')
    setShowImageUpload(false)
    setShowVoice(false)
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImages(prev => [...prev, event.target.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleVoiceRecord = () => {
    if (isRecording) {
      setIsRecording(false)
      // Simulate voice to text
      setVoiceText('灣仔有咩好嘢食？')
    } else {
      setIsRecording(true)
      setTimeout(() => {
        setIsRecording(false)
        setVoiceText('灣仔有咩好嘢食？')
      }, 3000)
    }
  }

  const handleLike = (id) => {
    setComments(comments.map(c => 
      c.id === id ? { ...c, likes: c.likes + 1 } : c
    ))
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          香港社區
        </h3>
        <p className="text-sm text-white/80 mt-1">
          分享你嘅發現，同香港人傾偈！
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedTab('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            selectedTab === 'all' 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          全部
        </button>
        <button
          onClick={() => setSelectedTab('district')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            selectedTab === 'district' 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          {selectedDistrict ? `📍 ${selectedDistrict}` : '📍 我附近'}
        </button>
      </div>

      {/* Comment Input */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
        {/* Text Input */}
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-lg shrink-0">
            🧑
          </div>
          <div className="flex-1 min-w-0">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="喺度輸入留言..."
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white placeholder-gray-400"
            />
            
            {/* Uploaded Images Preview */}
            {uploadedImages.length > 0 && (
              <div className="flex gap-2 mt-2 overflow-x-auto">
                {uploadedImages.map((img, i) => (
                  <div key={i} className="relative shrink-0">
                    <img src={img} alt="" className="w-20 h-20 object-cover rounded-xl" />
                    <button
                      onClick={() => setUploadedImages(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Voice Preview */}
            {voiceText && (
              <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center gap-2">
                <Mic className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-purple-600 dark:text-purple-400">{voiceText}</span>
                <button 
                  onClick={() => setVoiceText('')}
                  className="ml-auto text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex gap-2">
            <button
              onClick={() => setShowImageUpload(!showImageUpload)}
              className={`p-2 rounded-xl transition-all ${showImageUpload ? 'bg-purple-100 text-purple-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}
            >
              <Image className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowVoice(!showVoice)}
              className={`p-2 rounded-xl transition-all ${showVoice ? 'bg-purple-100 text-purple-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={handleSendComment}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
          >
            <Send className="w-4 h-4" />
            留言
          </button>
        </div>

        {/* Image Upload Panel */}
        {showImageUpload && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center gap-2 text-gray-500 hover:border-purple-500 hover:text-purple-500 transition-all"
            >
              <Camera className="w-6 h-6" />
              <span className="text-sm">點擊上傳相片</span>
            </button>
          </div>
        )}

        {/* Voice Record Panel */}
        {showVoice && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={handleVoiceRecord}
              className={`w-full py-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                isRecording 
                  ? 'bg-red-100 text-red-500 animate-pulse' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-purple-100 hover:text-purple-500'
              }`}
            >
              <Mic className={`w-6 h-6 ${isRecording ? 'animate-pulse' : ''}`} />
              <span className="text-sm">{isRecording ? '錄音中... 點擊停止' : '點擊開始錄音'}</span>
            </button>
            {voiceText && (
              <p className="text-xs text-center text-gray-500 mt-2">
                語音已轉換為文字：{voiceText}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {filteredComments.map(comment => (
          <div key={comment.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-lg">
                {comment.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">{comment.user}</span>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500">
                    📍 {comment.district}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{comment.text}</p>
                
                {/* Images */}
                {comment.images && comment.images.length > 0 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto">
                    {comment.images.map((img, i) => (
                      <img key={i} src={img} alt="" className="w-24 h-24 object-cover rounded-xl" />
                    ))}
                  </div>
                )}
                
                {/* Voice */}
                {comment.voice && (
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center gap-2">
                    <Mic className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{comment.voice}</span>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex items-center gap-4 mt-3">
                  <button 
                    onClick={() => handleLike(comment.id)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{comment.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-purple-500 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>{comment.replies}</span>
                  </button>
                  <span className="text-xs text-gray-400 ml-auto">{comment.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredComments.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">💬</div>
          <p className="text-gray-500">暫時冇評論</p>
          <p className="text-xs text-gray-400 mt-1">成為第一個發佈嘅人！</p>
        </div>
      )}
    </div>
  )
}
