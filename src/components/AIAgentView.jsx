import { useState, useRef, useEffect } from 'react'
import { Brain, Send, Loader, CheckCircle, XCircle, AlertTriangle, Sparkles, Clock, Zap, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react'

// Simulated AI thinking process
const THINKING_STEPS = [
  '分析用戶問題...',
  '搜索相關資訊...',
  '評估可行方案...',
  '生成回覆...',
]

// Simulated tool usage
const TOOL_USAGE = [
  { tool: 'WebSearch', status: 'success', time: '0.3s' },
  { tool: 'FileRead', status: 'success', time: '0.1s' },
]

export default function AIAgentView() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 我係金龍！你嘅香港十八區導賞員。有咩想問關於香港嘅嘢？',
      time: new Date().toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' }),
      thinking: null,
      tools: [],
      pendingAction: null, // For approval workflow
    }
  ])
  const [isThinking, setIsThinking] = useState(false)
  const [showThinking, setShowThinking] = useState(true)
  const [stats, setStats] = useState({ searches: 0, reads: 0, writes: 0 })
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = {
      role: 'user',
      content: input,
      time: new Date().toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsThinking(true)

    // Simulate thinking process
    for (let i = 0; i < THINKING_STEPS.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    // Simulate tool usage
    const toolsUsed = [...TOOL_USAGE]
    setStats(prev => ({ ...prev, searches: prev.searches + 1 }))

    // Simulate response
    const responses = [
      '根據我嘅分析，灣仔係一個好有趣嘅地區！佢由昔日嘅紅燈區變成今日嘅商業中心，變遷故事多籮籮。',
      '中西區係香港嘅心臟地带，蘭桂坊係外國人集中地，但係你想試地道嘢食可以去九記牛腩！',
      '如果你想探索香港歷史，我建議你去大館（前中央警署），佢係一級歷史建築！',
    ]

    const response = responses[Math.floor(Math.random() * responses.length)]

    setIsThinking(false)
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: response,
      time: new Date().toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' }),
      thinking: showThinking ? THINKING_STEPS : null,
      tools: toolsUsed,
      pendingAction: null,
    }])
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-purple-50/50 to-pink-50/50 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">🤖 金龍 AI</h1>
            <p className="text-xs text-gray-500">香港十八區導賞員</p>
          </div>
          <button
            onClick={() => setShowThinking(!showThinking)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              showThinking 
                ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300' 
                : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            🧠 思考
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800 px-4 py-2">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-500" />
            搜索: {stats.searches}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3 text-blue-500" />
            回覆: {messages.filter(m => m.role === 'assistant').length}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
              {/* Thinking Process */}
              {msg.role === 'assistant' && msg.thinking && showThinking && (
                <div className="mb-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-xl rounded-bl-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    <span className="text-xs font-medium text-gray-500">思考過程</span>
                  </div>
                  <div className="space-y-1">
                    {msg.thinking.map((step, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        {j === msg.thinking.length - 1 ? (
                          <Loader className="w-3 h-3 text-purple-500 animate-spin" />
                        ) : (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        )}
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tool Usage */}
              {msg.role === 'assistant' && msg.tools && msg.tools.length > 0 && (
                <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
                  <Zap className="w-3 h-3" />
                  使用工具: {msg.tools.map(t => t.tool).join(', ')}
                </div>
              )}

              {/* Message Content */}
              <div className={`rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-sm' 
                  : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-bl-sm'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>

              {/* Time & Actions */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-400">{msg.time}</span>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1">
                    <button className="p-1 text-gray-400 hover:text-green-500 transition-colors">
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-bl-sm p-4 max-w-[85%]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="h-2 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  <div className="h-2 w-24 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse mt-2" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="問我關於香港..."
            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-purple-500/30"
          >
            <Send className="w-4 h-4" />
            發送
          </button>
        </div>
      </div>
    </div>
  )
}
