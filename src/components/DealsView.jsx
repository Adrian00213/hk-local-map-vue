import { useState, useEffect } from 'react'
import { CreditCard, Smartphone, Star, Shield, Gift, Zap, Clock, MapPin, Check, X } from 'lucide-react'

// Hong Kong Payment & Deals Data
const HK_DEALS = [
  {
    id: '1',
    title: 'AlipayHK 消費券',
    desc: '用 AlipayHK 付款最高回贈 $500',
    brand: '支付寶HK',
    icon: '💜',
    type: 'payment',
    validUntil: '2026-03-31',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: '2',
    title: 'WeChat Pay 超市優惠',
    desc: '惠康、百佳滿$200減$30',
    brand: 'WeChat Pay',
    icon: '💚',
    type: 'payment',
    validUntil: '2026-03-31',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: '3',
    title: '八達通 交通優惠',
    desc: '每月公共交通回贈 $100',
    brand: '八達通',
    icon: '🟠',
    type: 'octopus',
    validUntil: '2026-04-30',
    color: 'from-stone-700 to-stone-600'
  },
  {
    id: '4',
    title: 'HSBC 信用卡 餐飲85折',
    desc: '指定餐廳消費85折優惠',
    brand: 'HSBC',
    icon: '🔴',
    type: 'creditcard',
    validUntil: '2026-03-31',
    color: 'from-red-500 to-rose-500'
  },
  {
    id: '5',
    title: '中銀BOC 電影買一送一',
    desc: '逢星期五戲院購票優惠',
    brand: '中銀',
    icon: '🔵',
    type: 'creditcard',
    validUntil: '2026-03-31',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: '6',
    title: '恒生 超市95折',
    desc: '永明/惠康/一田95折',
    brand: '恒生',
    icon: '🟡',
    type: 'creditcard',
    validUntil: '2026-03-31',
    color: 'from-yellow-500 to-amber-500'
  },
  {
    id: '7',
    title: 'Tap & Go 消費券優惠',
    desc: '消費券指定商戶最高15%回贈',
    brand: 'Tap & Go',
    icon: '💙',
    type: 'payment',
    validUntil: '2026-04-30',
    color: 'from-blue-400 to-indigo-500'
  },
  {
    id: '8',
    title: 'AEON 週年慶',
    desc: '全線貨品85折起',
    brand: 'AEON',
    icon: '❤️',
    type: 'creditcard',
    validUntil: '2026-04-15',
    color: 'from-red-400 to-pink-500'
  },
]

const DEAL_TYPES = [
  { id: 'all', label: '全部', icon: '✨' },
  { id: 'payment', label: '電子支付', icon: '📱' },
  { id: 'octopus', label: '八達通', icon: '🟠' },
  { id: 'creditcard', label: '信用卡', icon: '💳' },
]

export default function DealsView() {
  const [deals, setDeals] = useState([])
  const [filter, setFilter] = useState('all')
  const [saved, setSaved] = useState([])

  useEffect(() => {
    // Load saved deals
    const savedDeals = localStorage.getItem('hk_saved_deals')
    if (savedDeals) setSaved(JSON.parse(savedDeals))
    
    // Filter deals
    if (filter === 'all') {
      setDeals(HK_DEALS)
    } else {
      setDeals(HK_DEALS.filter(d => d.type === filter))
    }
  }, [filter])

  const toggleSave = (id) => {
    const newSaved = saved.includes(id) 
      ? saved.filter(s => s !== id)
      : [...saved, id]
    setSaved(newSaved)
    localStorage.setItem('hk_saved_deals', JSON.stringify(newSaved))
  }

  const getDaysLeft = (dateStr) => {
    const days = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
    return days > 0 ? `${days}日` : '已過期'
  }

  return (
    <div className="h-full w-full flex flex-col bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-100/80 px-5 pt-5 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-stone-600 to-stone-700 flex items-center justify-center shadow-lg shadow-amber-200/50">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">香港優惠</h1>
            <p className="text-sm text-zinc-400">電子支付 • 信用卡 • 八達通</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {DEAL_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filter === t.id 
                  ? 'bg-gradient-to-r from-stone-600 to-stone-700 text-white shadow-md' 
                  : 'bg-zinc-100 text-zinc-600'
              }`}
            >
              <span className="mr-1">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Deals List */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="space-y-4 stagger-children">
          {deals.map((deal) => {
            const isSaved = saved.includes(deal.id)
            return (
              <div 
                key={deal.id} 
                className="bg-white rounded-2xl shadow-sm border border-zinc-100/80 overflow-hidden card-hover"
              >
                <div className={`h-2 bg-gradient-to-r ${deal.color}`} />
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${deal.color} flex items-center justify-center text-3xl shadow-lg`}>
                      {deal.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs text-zinc-400 font-medium">{deal.brand}</span>
                          <h3 className="font-bold text-zinc-900 text-lg leading-tight">{deal.title}</h3>
                        </div>
                        <button
                          onClick={() => toggleSave(deal.id)}
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                            isSaved 
                              ? 'bg-stone-200 text-stone-600' 
                              : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'
                          }`}
                        >
                          <Star className={`w-5 h-5 ${isSaved ? 'fill-amber-500' : ''}`} />
                        </button>
                      </div>
                      <p className="text-sm text-zinc-500 mt-1 leading-relaxed">{deal.desc}</p>
                      
                      <div className="flex items-center gap-3 mt-3">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                          deal.type === 'payment' ? 'bg-purple-50 text-purple-600' :
                          deal.type === 'octopus' ? 'bg-stone-100 text-orange-600' :
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {deal.type === 'payment' ? '📱 電子支付' :
                           deal.type === 'octopus' ? '🟠 八達通' : '💳 信用卡'}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-zinc-400">
                          <Clock className="w-3.5 h-3.5" />
                          有效期：{getDaysLeft(deal.validUntil)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {deals.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-zinc-100 flex items-center justify-center">
              <Gift className="w-10 h-10 text-zinc-300" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-700 mb-2">暫時沒有此類優惠</h3>
            <p className="text-sm text-zinc-400">稍後再看看</p>
          </div>
        )}
      </div>
    </div>
  )
}
