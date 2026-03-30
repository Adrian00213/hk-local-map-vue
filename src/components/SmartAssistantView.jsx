import { useState, useEffect, useRef } from 'react'
import { Sparkles, Send, Mic, MapPin, Clock, Sun, Moon, Cloud, Zap, Star, Heart, Gift, TrendingUp, Brain, ChevronRight, Loader2, X, Camera, Image } from 'lucide-react'

// AI Assistant responses and intelligence
const AI_RESPONSES = {
  greeting: {
    morning: '早晨！今日天氣不錯，去嘆個早餐先？☀️',
    afternoon: '下午好！想搵嘢食定玩？🌤️',
    evening: '夜晚好！浪漫晚餐定係輕鬆坐下？🌙',
    night: '夜喇！夜宵好去處幫你搵？🌃'
  },
  intents: {
    food: {
      keywords: ['食', '嘢食', '餐廳', '午餐', '晚餐', '早餐', '茶餐廳', 'café', 'coffee'],
      response: (context) => {
        const timeContext = getTimeContext()
        if (timeContext.period === 'morning') {
          return `🍳 早餐推薦：
• 金記茶餐廳 - 早餐套餐 $35
• 太平洋咖啡 - LATTE $42
• 麥當勞早餐 - 豬柳蛋漢堡 $28

⏰ 現在係 ${timeContext.timeString}`
        } else if (timeContext.period === 'afternoon') {
          return `🍜 午餐推薦：
• 九記牛腩 - 牛腩麵 $58
• 翠華 - 海南雞飯 $48
• 一蘭拉麵 - 豚骨拉麵 $108

⏰ 現在係 ${timeContext.timeString}`
        } else if (timeContext.period === 'evening') {
          return `🍽️ 晚餐推薦：
• 鼎泰豐 - 小籠包 $68
• 龍鳳會 - 粵菜 $200+
• 意式餐廳 - 意大利麵 $128

⏰ 現在係 ${timeContext.timeString}`
        } else {
          return `🌙 夜宵推薦：
• 街邊小食 - 魚蛋燒賣 $20
• 便利店 - 叮叮糖水 $15
• 茶餐廳 - 常餐 $45

⏰ 現在係 ${timeContext.timeString}`
        }
      }
    },
    cheap: {
      keywords: ['平', '慳', '便宜', '預算', '$', '價錢', '平嘢'],
      response: (context) => {
        return `💰 平嘢食推薦：

優惠精選：
• 麥當勞 - 超值套餐 $25
• 美心MX - 午市套餐 $35
• 大快活 - 下午茶 $28

🎫 信用卡優惠：
• 中銀：指定餐廳85折
• HSBC：超市95折

⏰ 有效期：今日`
      }
    },
    nearby: {
      keywords: ['附近', '就近', '附近邊度', '附近有'],
      response: (context) => {
        return `📍 附近推介（基於你的位置）：

🗺️ 加琳娜的位置：22.3193, 114.1694

精選推薦：
1. ⭐ 譚仔三哥米線 - 0.5km
2. 🏠 山頂廣場 - 1.2km
3. ☕ Starbucks - 0.3km

🎫 附近優惠：
• AlipayHK：滿$100減$20
• WeChat Pay：超市95折

點擊地圖睇詳情 👆`
      }
    },
    attraction: {
      keywords: ['好去處', '景點', '玩', '行街', '商場', '主題樂園', '博物館'],
      response: (context) => {
        const timeContext = getTimeContext()
        if (timeContext.isWeekend) {
          return `🎢 週末好去處：

1. 🏝️ 香港迪士尼樂園
   • 評分：4.8⭐
   • 票價：$639起

2. 🐬 海洋公園
   • 評分：4.6⭐
   • 票價：$480起

3. 🎨 M+ 博物館
   • 評分：4.7⭐
   • 免費入場

4. 🏛️ 香港故宮博物館
   • 評分：4.8⭐
   • 票價：$120

🌤️ 天氣：部分時間有陽光`
        } else {
          return `🏙️ 室內好去處：

1. 🛍️ 海港城
   • 香港最大商場
   • 700間商店

2. 🎮 荷里活廣場
   • 電影院 + 餐廳

3. 📚 香港書展
   • 免費展覽

4. ☕ 特色咖啡店
   • N1 Coffee
   • % Arabica`
        }
      }
    },
    transport: {
      keywords: ['交通', '地鐵', '巴士', '的士', ' MRT', '點去', '點搭'],
      response: (context) => {
        return `🚌 交通資訊：

港鐵：
• 港島線 / 荃灣線 / 觀塘線
• 繁忙時段：7:30-9:30 / 17:30-19:30

巴士：
• 九巴、新巴、城巴
• 八達通全程OK

🚇 優惠：
• 迪士尼樂園免費巴士
• 昂坪360來回票優惠

📱 八達通：
• 即時余額查詢
• 自動加值優惠`
      }
    },
    weather: {
      keywords: ['天氣', '溫度', '落雨', '太陽', '凍', '熱'],
      response: (context) => {
        return `🌤️ 香港今日天氣：

溫度：26°C - 32°C
濕度：75%
紫外線：中等

🌧️ 降雨機會：30%
🌡️ 感覺溫度：33°C

💡 建議：
• 帶遮防曬
• 多補充水分
• 室內商場係好選擇`
      }
    },
    trip: {
      keywords: ['旅行', '行程', ' trip', ' plan', ' planning', '機票', '酒店', '台北', '東京', '首爾', '曼谷'],
      response: (context) => {
        return `✈️ AI 行程規劃：

熱門目的地：
1. 🇹🇼 台北 - 3日2夜 $3,500起
2. 🇯🇵 東京 - 4日3夜 $6,000起
3. 🇰🇷 首爾 - 3日2夜 $4,200起
4. 🇹🇭 曼谷 - 4日3夜 $3,800起

🔧 幫我規劃行程：
• 輸入目的地
• 選擇日期
• 設定預算
• AI幫你自動排程

點擊「行程」Tab試試 ✈️`
      }
    }
  }
}

const getTimeContext = () => {
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay()
  const isWeekend = day === 0 || day === 6
  
  let period = 'afternoon'
  let timeString = `${hour}:${now.getMinutes().toString().padStart(2, '0')}`
  
  if (hour >= 5 && hour < 11) period = 'morning'
  else if (hour >= 11 && hour < 14) period = 'noon'
  else if (hour >= 14 && hour < 18) period = 'afternoon'
  else if (hour >= 18 && hour < 22) period = 'evening'
  else period = 'night'
  
  return { hour, period, timeString, isWeekend, day }
}

const detectIntent = (message) => {
  const lowerMsg = message.toLowerCase()
  
  for (const [intent, config] of Object.entries(AI_RESPONSES.intents)) {
    for (const keyword of config.keywords) {
      if (lowerMsg.includes(keyword)) {
        return { intent, config }
      }
    }
  }
  return null
}

export default function SmartAssistantView() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [context, setContext] = useState({})
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    // Initialize with greeting
    const timeContext = getTimeContext()
    const greeting = AI_RESPONSES.greeting[timeContext.period]
    
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: `🤖 **智能助理上線喇！**

${greeting}

我可以幫你：
• 🍜 搵嘢食 / 餐廳推薦
• 💰 平嘢優惠
• 📍 附近好去處
• ✈️ 行程規劃
• 🌤️ 天氣資訊
• 🚌 交通查詢

👇 試下問我嘢喇！`
      }
    ])
    
    // Load user preferences
    const savedPrefs = localStorage.getItem('hk_user_prefs')
    if (savedPrefs) {
      setContext(JSON.parse(savedPrefs))
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600))
    
    // Detect intent and generate response
    const intent = detectIntent(input)
    let response
    
    if (intent) {
      response = intent.config.response(context)
    } else {
      // Default intelligent response
      response = generateSmartResponse(input)
    }
    
    const assistantMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: response
    }
    
    setMessages(prev => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const generateSmartResponse = (message) => {
    const lowerMsg = message.toLowerCase()
    const timeContext = getTimeContext()
    
    // Smart contextual responses
    if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('你好') || lowerMsg.includes('早晨')) {
      return `👋 你好！${timeContext.timeString}好！

我係你嘅智能助理，可以幫你：

🍜 搵餐廳 / 嘢食
💰 搵優惠 / 平嘢
📍 附近好去處
✈️ 行程規劃
🌤️ 天氣資訊

你想搵咩？`
    }
    
    if (lowerMsg.includes('邊個') || lowerMsg.includes('邊個') || lowerMsg.includes('邊度')) {
      return `📍 你問緊邊度附近？

請告訴我你嘅位置，或者：
• 🔘 點擊地圖定位
• 📝 輸入地區名稱（如：沙田、旺角）

我就可以幫你搵附近好嘢！`
    }
    
    if (lowerMsg.includes('幾點') || lowerMsg.includes('時間')) {
      return `🕐 現在時間：${timeContext.timeString}
📅 今天係 ${['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][timeContext.day]}

${timeContext.isWeekend ? '🎉 今日係週末，放假去玩啦！' : '💼 今日係平日，打工仔加油！'}`
    }
    
    // Default response with suggestions
    return `🤔 我明你意思，不過我想幫得更精準！

你可以試下問：

🍜 「附近有咩好嘢食？」
💰 「幫我搵平嘢優惠」
📍 「沙田好去處」
✈️ 「幫我計劃台北3日行程」

或者直接問我任何關於香港嘅問題！`
  }

  const quickActions = [
    { icon: '🍜', label: '搵嘢食', prompt: '附近有咩好嘢食？' },
    { icon: '💰', label: '平嘢優惠', prompt: '幫我搵優惠' },
    { icon: '📍', label: '附近好去處', prompt: '附近有咩好玩？' },
    { icon: '✈️', label: '行程規劃', prompt: '幫我計劃台北3日行程' },
    { icon: '🌤️', label: '天氣', prompt: '今日天氣點？' },
    { icon: '🚌', label: '交通', prompt: '點去山頂？' },
  ]

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-amber-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200/50 animate-pulse">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">AI 智能助理</h1>
            <p className="text-xs text-amber-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              在線為你服務
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
          >
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-br-md' 
                : 'bg-white/80 backdrop-blur shadow-lg border border-amber-100 rounded-bl-md'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-slide-up">
            <div className="bg-white/80 backdrop-blur shadow-lg border border-amber-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                </div>
                <span className="text-xs text-zinc-400">AI思考中...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="bg-white/90 backdrop-blur-xl border-t border-amber-100 px-5 py-3">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInput(action.prompt)
                inputRef.current?.focus()
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 rounded-xl text-xs font-medium text-amber-700 whitespace-nowrap transition-colors"
            >
              <span>{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white/90 backdrop-blur-xl border-t border-amber-100 px-5 py-4 pb-8">
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="問我任何關於香港嘅問題..."
            className="flex-1 px-4 py-3 bg-amber-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300/50 placeholder:text-amber-300/50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200/50 disabled:opacity-50 disabled:shadow-none transition-all hover:scale-105 active:scale-95"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
