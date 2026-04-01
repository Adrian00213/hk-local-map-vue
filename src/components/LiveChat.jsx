import { useState, useEffect, useRef } from 'react'
import { Send, Mic, Image, Video, X, Play, Heart, MoreHorizontal, MessageCircle, Trash2, Plus, ArrowLeft, Clock, User, ChevronRight, MessageSquare, Eye } from 'lucide-react'

// Demo topics
const DEMO_TOPICS = [
  {
    id: 'topic_1',
    title: '灣仔有咩好食？求推介 🇭🇰',
    category: '美食',
    author: '灣仔咖啡控',
    authorId: 'demo_1',
    createdAt: { toDate: () => new Date(Date.now() - 3600000) },
    likes: 24,
    comments: 8,
    views: 156,
    isHot: true
  },
  {
    id: 'topic_2',
    title: '旺角掃街攻略 🏮 必食小店',
    category: '美食',
    author: '九龍遊客',
    authorId: 'demo_2',
    createdAt: { toDate: () => new Date(Date.now() - 7200000) },
    likes: 45,
    comments: 15,
    views: 312,
    isHot: true
  },
  {
    id: 'topic_3',
    title: '長洲一日遊 有咩玩？🐚',
    category: '旅遊',
    author: '週末旅行家',
    authorId: 'demo_3',
    createdAt: { toDate: () => new Date(Date.now() - 86400000) },
    likes: 18,
    comments: 6,
    views: 89,
    isHot: false
  },
  {
    id: 'topic_4',
    title: '中環酒吧推介 🍸 Happy Hour',
    category: '娛樂',
    author: '中環OL',
    authorId: 'demo_4',
    createdAt: { toDate: () => new Date(Date.now() - 172800000) },
    likes: 32,
    comments: 12,
    views: 234,
    isHot: false
  },
  {
    id: 'topic_5',
    title: '香港行山徑邊個最靚？⛰️',
    category: '運動',
    author: '山系情侶',
    authorId: 'demo_5',
    createdAt: { toDate: () => new Date(Date.now() - 259200000) },
    likes: 56,
    comments: 22,
    views: 445,
    isHot: true
  }
]

// Demo comments for topic 1
const DEMO_COMMENTS = {
  'topic_1': [
    {
      id: 'c1',
      text: '灣仔嘅Hashtag Coffee幾好，環境舒服之餘咖啡質素高 👍',
      author: '咖啡愛好者',
      authorId: 'user_c1',
      createdAt: { toDate: () => new Date(Date.now() - 3000000) },
      likes: 8
    },
    {
      id: 'c2',
      text: '船街有間幾隱世嘅日本餐廳，師傅好有心機 🍣',
      author: '灣仔居民',
      authorId: 'user_c2',
      createdAt: { toDate: () => new Date(Date.now() - 2400000) },
      likes: 5
    },
    {
      id: 'c3',
      text: '偉南記可以去試下，奶茶正！🧋',
      author: '茶記迷',
      authorId: 'user_c3',
      createdAt: { toDate: () => new Date(Date.now() - 1800000) },
      likes: 12
    }
  ]
}

const ANONYMOUS_NAMES = [
  '香港遊客', '灣仔居民', '旺角街坊', '中環OL', '九龍塘學生',
  '銅鑼灣購物者', '深水埗街坊', '紅磡港漂', '太子網紅', '油麻地小店',
  '堅尼地茶記迷', '北角老街坊', '筲箕灣海鮮佬', '西環讀書人'
]

const CATEGORIES = ['全部', '美食', '旅遊', '娛樂', '運動', '生活', '其他']

export default function LiveChat({ channel = 'general' }) {
  const [view, setView] = useState('topics') // 'topics', 'topic_detail', 'create_topic'
  const [topics, setTopics] = useState([])
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [comments, setComments] = useState({})
  const [newComment, setNewComment] = useState('')
  const [newTopicTitle, setNewTopicTitle] = useState('')
  const [newTopicCategory, setNewTopicCategory] = useState('美食')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [likedTopics, setLikedTopics] = useState(new Set())
  const [likedComments, setLikedComments] = useState(new Set())
  const [isDemoMode] = useState(true)
  
  const commentsEndRef = useRef(null)
  const anonymousId = useRef('demo_' + Math.random().toString(36).substr(2, 9))
  const anonymousName = useRef(ANONYMOUS_NAMES[Math.floor(Math.random() * ANONYMOUS_NAMES.length)])

  // Load data from localStorage
  useEffect(() => {
    const savedTopics = JSON.parse(localStorage.getItem('hk_demo_topics') || '[]')
    const savedComments = JSON.parse(localStorage.getItem('hk_demo_comments') || '{}')
    const savedLikedTopics = JSON.parse(localStorage.getItem('hk_liked_topics') || '[]')
    const savedLikedComments = JSON.parse(localStorage.getItem('hk_liked_comments') || '[]')
    
    if (savedTopics.length > 0) {
      setTopics(savedTopics)
    } else {
      setTopics(DEMO_TOPICS)
    }
    
    if (Object.keys(savedComments).length > 0) {
      setComments(savedComments)
    } else {
      setComments(DEMO_COMMENTS)
    }
    
    setLikedTopics(new Set(savedLikedTopics))
    setLikedComments(new Set(savedLikedComments))
  }, [])

  // Scroll to bottom when comments change
  useEffect(() => {
    if (view === 'topic_detail') {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [comments, view])

  const saveTopics = (topicsData) => {
    localStorage.setItem('hk_demo_topics', JSON.stringify(topicsData))
  }

  const saveComments = (commentsData) => {
    localStorage.setItem('hk_demo_comments', JSON.stringify(commentsData))
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const diff = Math.floor((new Date() - date) / 1000)
    
    if (diff < 60) return '剛剛'
    if (diff < 3600) return `${Math.floor(diff / 60)} 分鐘前`
    if (diff < 86400) return `${Math.floor(diff / 3600)} 小時前`
    return `${Math.floor(diff / 86400)} 日前`
  }

  const handleCreateTopic = () => {
    if (!newTopicTitle.trim()) return
    
    const topic = {
      id: 'topic_' + Date.now(),
      title: newTopicTitle.trim(),
      category: newTopicCategory,
      author: anonymousName.current,
      authorId: anonymousId.current,
      createdAt: { toDate: () => new Date() },
      likes: 0,
      comments: 0,
      views: 1,
      isHot: false
    }
    
    const newTopics = [topic, ...topics]
    setTopics(newTopics)
    saveTopics(newTopics)
    setNewTopicTitle('')
    setNewTopicCategory('美食')
    setView('topics')
  }

  const handleLikeTopic = (topicId) => {
    const newLiked = new Set(likedTopics)
    const newTopics = topics.map(t => {
      if (t.id === topicId) {
        if (newLiked.has(topicId)) {
          newLiked.delete(topicId)
          return { ...t, likes: t.likes - 1 }
        } else {
          newLiked.add(topicId)
          return { ...t, likes: t.likes + 1 }
        }
      }
      return t
    })
    
    localStorage.setItem('hk_liked_topics', JSON.stringify([...newLiked]))
    setLikedTopics(newLiked)
    setTopics(newTopics)
    saveTopics(newTopics)
  }

  const handleLikeComment = (topicId, commentId) => {
    const newLiked = new Set(likedComments)
    const key = `${topicId}_${commentId}`
    const topicComments = comments[topicId] || []
    const newTopicComments = topicComments.map(c => {
      if (c.id === commentId) {
        if (newLiked.has(key)) {
          newLiked.delete(key)
          return { ...c, likes: c.likes - 1 }
        } else {
          newLiked.add(key)
          return { ...c, likes: c.likes + 1 }
        }
      }
      return c
    })
    
    const newComments = { ...comments, [topicId]: newTopicComments }
    localStorage.setItem('hk_liked_comments', JSON.stringify([...newLiked]))
    setLikedComments(newLiked)
    setComments(newComments)
    saveComments(newComments)
  }

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedTopic) return
    
    const comment = {
      id: 'c_' + Date.now(),
      text: newComment.trim(),
      author: anonymousName.current,
      authorId: anonymousId.current,
      createdAt: { toDate: () => new Date() },
      likes: 0
    }
    
    const topicComments = comments[selectedTopic.id] || []
    const newTopicComments = [...topicComments, comment]
    const newComments = { ...comments, [selectedTopic.id]: newTopicComments }
    
    const newTopics = topics.map(t => {
      if (t.id === selectedTopic.id) {
        return { ...t, comments: t.comments + 1 }
      }
      return t
    })
    
    setComments(newComments)
    saveComments(newComments)
    setTopics(newTopics)
    saveTopics(newTopics)
    setSelectedTopic({ ...selectedTopic, comments: selectedTopic.comments + 1 })
    setNewComment('')
  }

  const filteredTopics = selectedCategory === '全部' 
    ? topics 
    : topics.filter(t => t.category === selectedCategory)

  // ========== TOPICS LIST VIEW ==========
  if (view === 'topics') {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-stone-50 to-amber-50/50">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur border-b border-stone-200 px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">💬 討論區</h3>
                <p className="text-xs text-gray-500">{topics.length} 個話題</p>
              </div>
            </div>
            <button
              onClick={() => setView('create_topic')}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl text-sm font-bold flex items-center gap-1 shadow-lg shadow-pink-200 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              新話題
            </button>
          </div>
          
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md' 
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Topics List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredTopics.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>暫時冇話題</p>
              <p className="text-sm">成為第一個創建話題嘅人！</p>
            </div>
          ) : (
            filteredTopics.map(topic => (
              <div 
                key={topic.id}
                onClick={() => {
                  setSelectedTopic(topic)
                  setView('topic_detail')
                }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 cursor-pointer active:scale-98 transition-all hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-2xl shrink-0">
                    {topic.category === '美食' ? '🍜' : 
                     topic.category === '旅遊' ? '✈️' : 
                     topic.category === '娛樂' ? '🎉' : 
                     topic.category === '運動' ? '⚽' : '💬'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {topic.isHot && (
                        <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded font-bold animate-pulse">🔥 熱門</span>
                      )}
                      <span className="px-1.5 py-0.5 bg-stone-100 text-stone-500 text-xs rounded">{topic.category}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 line-clamp-2">{topic.title}</h4>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {topic.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(topic.createdAt)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 shrink-0" />
                </div>
                
                {/* Stats */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-stone-100">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleLikeTopic(topic.id) }}
                    className={`flex items-center gap-1 text-sm ${likedTopics.has(topic.id) ? 'text-red-500' : 'text-gray-400'}`}
                  >
                    <Heart className="w-4 h-4" fill={likedTopics.has(topic.id) ? 'currentColor' : 'none'} />
                    {topic.likes}
                  </button>
                  <span className="flex items-center gap-1 text-sm text-gray-400">
                    <MessageSquare className="w-4 h-4" />
                    {topic.comments}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-400">
                    <Eye className="w-4 h-4" />
                    {topic.views}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={commentsEndRef} />
        </div>
      </div>
    )
  }

  // ========== CREATE TOPIC VIEW ==========
  if (view === 'create_topic') {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-stone-50 to-amber-50/50">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur border-b border-stone-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('topics')}
              className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h3 className="font-bold text-gray-900">創建新話題</h3>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">話題標題</label>
            <input
              type="text"
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              placeholder="例如：灣仔有咩好食？求推介 🇭🇰"
              className="w-full px-4 py-3 bg-white rounded-2xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-pink-300"
              maxLength={100}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{newTopicTitle.length}/100</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">分類</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.filter(c => c !== '全部').map(cat => (
                <button
                  key={cat}
                  onClick={() => setNewTopicCategory(cat)}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
                    newTopicCategory === cat 
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md' 
                      : 'bg-white border border-stone-200 text-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
            <p className="text-sm text-amber-700">
              💡 <strong>提示：</strong>發佈虛假或垃圾訊息可能被移除。
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="p-4 bg-white border-t border-stone-200">
          <button
            onClick={handleCreateTopic}
            disabled={!newTopicTitle.trim()}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-pink-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 transition-all"
          >
            發佈話題
          </button>
        </div>
      </div>
    )
  }

  // ========== TOPIC DETAIL VIEW ==========
  if (view === 'topic_detail' && selectedTopic) {
    const topicComments = comments[selectedTopic.id] || []
    
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-stone-50 to-amber-50/50">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur border-b border-stone-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('topics')}
              className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{selectedTopic.title}</h3>
              <p className="text-xs text-gray-500">{topicComments.length} 個留言</p>
            </div>
            <button 
              onClick={() => handleLikeTopic(selectedTopic.id)}
              className={`p-2 rounded-2xl ${likedTopics.has(selectedTopic.id) ? 'bg-red-100 text-red-500' : 'bg-stone-100 text-gray-400'}`}
            >
              <Heart className="w-5 h-5" fill={likedTopics.has(selectedTopic.id) ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Topic Content */}
        <div className="p-4 bg-white border-b border-stone-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded">{selectedTopic.category}</span>
            {selectedTopic.isHot && <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded font-bold">🔥 熱門</span>}
          </div>
          <h2 className="font-bold text-lg text-gray-900 mb-2">{selectedTopic.title}</h2>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {selectedTopic.author}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(selectedTopic.createdAt)}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {selectedTopic.views} 次瀏覽
            </span>
          </div>
        </div>

        {/* Comments */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <h4 className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            {topicComments.length} 個留言
          </h4>
          
          {topicComments.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>暫時冇留言</p>
              <p className="text-sm">成為第一個留言嘅人！</p>
            </div>
          ) : (
            topicComments.map(comment => (
              <div key={comment.id} className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shrink-0">
                    {comment.author.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm">{comment.author}</span>
                      <span className="text-xs text-gray-400">{formatTime(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{comment.text}</p>
                    <button 
                      onClick={() => handleLikeComment(selectedTopic.id, comment.id)}
                      className={`flex items-center gap-1 mt-2 text-xs ${likedComments.has(`${selectedTopic.id}_${comment.id}`) ? 'text-red-500' : 'text-gray-400'}`}
                    >
                      <Heart className="w-4 h-4" fill={likedComments.has(`${selectedTopic.id}_${comment.id}`) ? 'currentColor' : 'none'} />
                      {comment.likes}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={commentsEndRef} />
        </div>

        {/* Comment Input */}
        <div className="p-4 bg-white border-t border-stone-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="寫下你的留言..."
              className="flex-1 px-4 py-3 bg-stone-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-pink-300"
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white disabled:opacity-50 active:scale-95 transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Fallback
  return (
    <div className="flex items-center justify-center h-full">
      <button onClick={() => setView('topics')} className="px-4 py-2 bg-pink-500 text-white rounded-2xl">
        返回討論區
      </button>
    </div>
  )
}
