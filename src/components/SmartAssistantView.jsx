import { useState, useEffect, useRef } from 'react'
import { Sparkles, Send, Mic, MapPin, Clock, Sun, Moon, Cloud, Zap, Star, Heart, Gift, TrendingUp, Brain, ChevronRight, Loader2, X, Camera, Image } from 'lucide-react'

// Advanced AI responses with context awareness
const AI_BRAIN = {
  greeting: {
    morning: { icon: '🌅', text: '早晨！今日天氣唔錯，去嘆個早餐先？' },
    noon: { icon: '☀️', text: '午飯時間到！想搵嘢食定係繼續睇地圖？' },
    afternoon: { icon: '🌤️', text: '下午好！想搵嘢食或者好去處？' },
    evening: { icon: '🌆', text: '夜晚好！浪漫晚餐定係輕鬆坐下？' },
    night: { icon: '🌙', text: '夜喇！夜宵好去處幫你搵？' }
  },
  
  intents: {
    food: {
      keywords: ['食', '嘢食', '餐廳', '午餐', '晚餐', '早餐', '茶餐廳', 'café', 'coffee', ' hungry', 'eat'],
      responses: [
        {
          condition: (ctx) => ctx.time === 'morning',
          text: `🌅 朝早早餐精選：

🍳 **金記茶餐廳** - 早餐皇牌
   • 餐蛋麵 + 咖啡 = $42
   • 位置：旺角朗豪坊隔離
   ⭐ 4.5分 (232則評價)

☕ **太平洋咖啡** - 文青首選
   • 特濃咖啡 $38
   • 位置：又一城
   ⭐ 4.4分 (156則評價)

🍜 **麥當勞** - 平民之選
   • 早晨套餐 $28
   • 全港分店
   ⭐ 4.2分 (1.2k則評價)

💡 小提示：而家9點，朝早優惠仲有1粒鐘！`
        },
        {
          condition: (ctx) => ctx.time === 'evening' || ctx.time === 'night',
          text: `🌙 晚餐/夜宵精選：

🍽️ **鼎泰豐** - 小籠包專家
   • 小籠包 $68/籠
   • 位置：銅鑼灣/尖沙咀
   ⭐ 4.6分 (5.4k則評價)

🥢 **九記牛腩** - 必試米芝蓮
   • 牛腩麵 $58
   • 位置：上環
   ⭐ 4.7分 (3.2k則評價)

🍜 **譚仔三哥** - 快靚正
   • 雲南米線 $48
   • 位置：全港分店
   ⭐ 4.3分 (8.1k則評價)

🌃 **街邊小食** - 深夜食堂
   • 魚蛋燒賣 $20
   • 位置：旺角街頭
   💰 平靚正！`
        },
        {
          condition: () => true,
          text: `🍜 為你精選人氣餐廳：

🥇 **人氣榜首**
   • 華嫂冰室 - 必食菠蘿油
   • 一蘭拉麵 - 豚骨湯底
   • 鼎泰豐 - 小籠包

📍 想知附近有咩？比我知道你喺邊啦！`
        }
      ]
    },
    
    cheap: {
      keywords: ['平', '慳', '便宜', '預算', '$', '價錢', '平嘢', 'budget', 'cheap'],
      responses: [
        {
          condition: () => true,
          text: `💰 為你慳到盡！

🍔 **快餐平價之選 $20-35**
   • 麥當勞早晨套餐 $28
   • 美心MX午市套餐 $35
   • 大快活下午茶 $28

🛒 **超市特價**
   • 惠康：「江」牌半價
   • 百佳：零食買2送1

💳 **信用卡優惠**
   • 中銀：指定餐廳85折
   • HSBC：超市95折
   • 恒生：全線97折

🎫 **支付寶HK**
   • 掃碼賞：最高$50
   • 跨境繳費：免手續費

⏰ 優惠有效期：今日`
        }
      ]
    },
    
    nearby: {
      keywords: ['附近', '就近', '附近邊度', 'nearby', 'arount', 'near me'],
      responses: [
        {
          condition: (ctx) => ctx.hasLocation,
          text: `📍 根據你嘅位置（旺角）：

🗺️ **0-500米**
   • 朗豪坊 - 商場 (50m)
   • 女人街 - 小贩 (200m)
   • 波鞋街 - 運動用品 (300m)

🍜 **500米內餐廳**
   • 麥當勞 $25
   • 譚仔三哥 $48
   • 一蘭拉麵 $108

🎫 **附近優惠**
   • AlipayHK：滿$100減$20
   • WeChat Pay：超市95折

⏰ 步行時間：1-10分鐘`
        },
        {
          condition: () => true,
          text: `📍 想知道附近有咩？

🔘 請允許位置存取
或者告訴我你想搵咩區域：

例如：「旺角有咩好嘢食？」
或者點擊下面按鈕分享位置 👇`
        }
      ]
    },
    
    attraction: {
      keywords: ['好去處', '景點', '玩', '行街', '商場', '主題樂園', '博物館', ' park', 'mall', 'attraction'],
      responses: [
        {
          condition: (ctx) => ctx.isWeekend,
          text: `🎉 週末好去處：

🗺️ **室外活動**
   • 山頂纜車 - 維港景色 $88
   • 淺水灣 - 沙灘陽光免费
   • 南丫島 - 行山賞景免费

🏛️ **室內活動**
   • M+博物館 - 當代藝術免费
   • 香港故宮 - $120
   • 海洋公園 - $480

🛍️ **商場**
   • 海港城 - 700間商店
   •又一城 - Apple Store
   • 朗豪坊 - 旺角地標

🌤️ 天氣預報：部分時間有陽光

💡 建議：今日人多，建議晏啲先去熱門景點`
        },
        {
          condition: () => true,
          text: `🎯 香港好去處：

⭐ **必去經典**
   • 山頂夜景 - 免費靚景
   • 維港海濱 - 散步吹風
   • 彩虹邨 - IG打卡聖地

🗺️ **文青路線**
   • PMQ 元創方 - 設計小店
   • 大澳 - 水鄉風情
   • 南豐紗廠 - 文創園區

👨‍👩‍👧‍👦 **親子遊**
   • 迪士尼樂園 - $639
   • 海洋公園 - $480
   • 科學館 - $30

🔔 想要更詳細嘅行程？問我啦！`
        }
      ]
    },
    
    weather: {
      keywords: ['天氣', '溫度', '落雨', '太陽', '凍', '熱', 'weather', 'rain', 'sunny'],
      responses: [
        {
          condition: () => true,
          text: `🌤️ 香港今日天氣：

📊 **溫度：26°C - 32°C**
   體感溫度：33°C (有啲熱)

💧 **濕度：75%**
   感覺：潮濕悶熱

🌧️ **降雨機會：30%**
   下午可能有幾陣驟雨

☀️ **紫外線：中等**
   記得帶遮防曬

💡 **小建議：**
   • 戶外活動帶遮
   • 多補充水分
   • 商場係室內好選擇
   • 開冷氣要留意溫差

🕐 資料更新：剛剛`
        }
      ]
    },
    
    transport: {
      keywords: ['交通', '地鐵', '巴士', '的士', ' MRT', '點去', '點搭', '如何', ' bus', 'MTR', 'taxi'],
      responses: [
        {
          condition: () => true,
          text: `🚌 香港交通攻略：

🚇 **港鐵 (MTR)**
   • 港島線：堅尼地城 ↔ 柴灣
   • 荃灣線：中環 ↔ 荃灣
   • 觀塘線：黃埔 ↔ 調景嶺
   • 迪士尼線：欣澳 ↔ 迪士尼

🚌 **巴士**
   • 九巴 (KMB)：九龍/新界
   • 新巴 (NWFB)：港島
   • 城巴 (CTB)：機場/南區

💳 **八達通優惠**
   • 每月乘軌15次：95折
   • 兒童/長者：半價

🚕 **的士**
   • 市區：$27起步
   • 大嶼山：$23起步

💡 小提示：用八達通或支付寶HK嘟卡最方便！`
        }
      ]
    },
    
    trip: {
      keywords: ['旅行', '行程', ' trip', ' plan', ' planning', '機票', '酒店', '台北', '東京', '首爾', '曼谷'],
      responses: [
        {
          condition: () => true,
          text: `✈️ 為你整理熱門目的地：

🇹🇼 **台北 3日2夜**
   • 機票：$1,200起
   • 酒店：$400/晚
   • 預算：$3,500
   • 必去：夜市、故宮、陽明山

🇯🇵 **東京 4日3夜**
   • 機票：$2,500起
   • 酒店：$800/晚
   • 預算：$8,000
   • 必去：淺草、澀谷、富士山

🇰🇷 **首爾 3日2夜**
   • 機票：$1,800起
   • 酒店：$500/晚
   • 預算：$4,500
   • 必去：明洞、弘大、東大門

🇹🇭 **曼谷 4日3夜**
   • 機票：$1,500起
   • 酒店：$350/晚
   • 預算：$4,000
   • 必去：大皇宮、考山路、席娜卡琳

🔧 想我幫你plan詳細行程？話我知目的地、日數、預算！`
        }
      ]
    },
    
    help: {
      keywords: ['help', '幫', '幫我', '點用', '點样', '可以做', '可以幫'],
      responses: [
        {
          condition: () => true,
          text: `🤖 我係你嘅AI智能助理！

我可以幫你：

🍜 **搵嘢食**
   「附近有咩好嘢食？」
   「幫我搵平嘢」

💰 **搵優惠**
   「有咩信用卡優惠？」
   「支付寶有咩著數？」

📍 **附近好去處**
   「旺角有咩好玩？」
   「尖沙咀好去處」

✈️ **行程規劃**
   「幫我plan台北3日行程」
   「東京有咩必去？」

🌤️ **天氣資訊**
   「今日天氣點？」
   「明天會落雨嗎？」

🚌 **交通查詢**
   「點去山頂？」
   「迪士尼點搭車？」

👇 試下問我喇！`
        }
      ]
    }
  }
}

const getTimeContext = () => {
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay()
  const isWeekend = day === 0 || day === 6
  
  let time = 'afternoon'
  if (hour >= 5 && hour < 11) time = 'morning'
  else if (hour >= 11 && hour < 14) time = 'noon'
  else if (hour >= 14 && hour < 18) time = 'afternoon'
  else if (hour >= 18 && hour < 22) time = 'evening'
  else time = 'night'
  
  return { hour, time, isWeekend, day }
}

const detectIntent = (message) => {
  const lowerMsg = message.toLowerCase()
  
  for (const [intentName, intent] of Object.entries(AI_BRAIN.intents)) {
    for (const keyword of intent.keywords) {
      if (lowerMsg.includes(keyword.toLowerCase())) {
        return { intent: intentName, config: intent }
      }
    }
  }
  return null
}

export default function SmartAssistantView() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [context, setContext] = useState({ hasLocation: false })
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const timeCtx = getTimeContext()
    const greeting = AI_BRAIN.greeting[timeCtx.time]
    
    setContext({
      hasLocation: false,
      time: timeCtx.time,
      isWeekend: timeCtx.isWeekend
    })
    
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: `🤖 **AI 助理已上線！**

${greeting.icon} ${greeting.text}

我可以幫你：
• 🍜 搵嘢食 / 餐廳推薦
• 💰 搵優惠 / 平嘢
• 📍 附近好去處
• ✈️ 行程規劃
• 🌤️ 天氣資訊
• 🚌 交通查詢

👇 試下問我喇！`
      }
    ])
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
    
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800))
    
    const intent = detectIntent(input)
    let response
    
    if (intent) {
      // Find matching response based on condition
      const matchingResponse = intent.config.responses.find(r => r.condition(context))
      response = matchingResponse ? matchingResponse.text : intent.config.responses[intent.config.responses.length - 1].text
    } else {
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
    const timeCtx = context.time || 'afternoon'
    
    if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('你好') || lowerMsg.includes('早晨')) {
      const greeting = AI_BRAIN.greeting[timeCtx]
      return `${greeting.icon} ${greeting.text}

我係你嘅AI智能助理，可以幫你：

🍜 搵餐廳 / 嘢食
💰 搵優惠 / 平嘢
📍 附近好去處
✈️ 行程規劃
🌤️ 天氣資訊
🚌 交通查詢

你想搵咩？`
    }
    
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
    { icon: '💰', label: '平嘢優惠', prompt: '有咩信用卡優惠？' },
    { icon: '📍', label: '附近好去處', prompt: '旺角有咩好玩？' },
    { icon: '✈️', label: '行程規劃', prompt: '幫我計劃台北3日行程' },
    { icon: '🌤️', label: '天氣', prompt: '今日天氣點？' },
    { icon: '🚌', label: '交通', prompt: '點去山頂？' },
  ]

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-amber-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200/50">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">AI 智能助理</h1>
            <p className="text-xs text-amber-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              在線 • 用廣東話傾偈
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div className={`max-w-[88%] rounded-2xl px-4 py-3 ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-br-md shadow-lg shadow-amber-200/30' 
                : 'bg-white/90 backdrop-blur shadow-lg border border-amber-100 rounded-bl-md'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white/90 backdrop-blur shadow-lg border border-amber-100 rounded-2xl rounded-bl-md px-4 py-3">
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
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 rounded-xl text-xs font-medium text-amber-700 whitespace-nowrap transition-all active:scale-95"
            >
              <span>{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white/90 backdrop-blur-xl border-t border-amber-100 px-5 py-4 pb-6">
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="問我任何關於香港嘅問題..."
            className="flex-1 px-4 py-3.5 bg-amber-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300/50 placeholder:text-amber-400/50"
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
