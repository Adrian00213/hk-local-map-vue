import { useState } from 'react'
import { Sparkles, Calendar, MapPin, Clock, Users, ChevronRight, Loader2, Plus, Trash2, Share2, Wand2, Search, X, Globe, Plane, Train, Bus, Footprints, TrainFront, Ship, PlaneTakeoff, Info, Utensils, Building, ShoppingBag } from 'lucide-react'

const CITIES = [
  { id: 'hongkong', name: '香港', country: '香港', flag: '🇭🇰', timezone: 'GMT+8', currency: '港幣 (HKD)', language: '粵語、普通話、英語', transport: { icon: '🚇', name: '港鐵 MTR', tips: '覆蓋全面，又快又準' } },
  { id: 'tokyo', name: '東京', country: '日本', flag: '🇯🇵', timezone: 'GMT+9', currency: '日圓 (JPY)', language: '日語', transport: { icon: '🚇', name: 'JR 電車', tips: '建議購買 Suica 卡' } },
  { id: 'osaka', name: '大阪', country: '日本', flag: '🇯🇵', timezone: 'GMT+9', currency: '日圓 (JPY)', language: '日語', transport: { icon: '🚇', name: 'JR / 地下鐵', tips: '周遊券抵玩' } },
  { id: 'seoul', name: '首爾', country: '韓國', flag: '🇰🇷', timezone: 'GMT+9', currency: '韓圜 (KRW)', language: '韓語', transport: { icon: '🚇', name: '地鐵', tips: 'T-money 卡必備' } },
  { id: 'bangkok', name: '曼谷', country: '泰國', flag: '🇹🇭', timezone: 'GMT+7', currency: '泰銖 (THB)', language: '泰語', transport: { icon: '� BTS', name: 'BTS / MRT', tips: '避開繁忙時間' } },
  { id: 'singapore', name: '新加坡', country: '新加坡', flag: '🇸🇬', timezone: 'GMT+8', currency: '新加坡元 (SGD)', language: '英語、普通話、馬來語', transport: { icon: '🚇', name: 'MRT', tips: 'EZ-Link 卡適用' } },
  { id: 'taipei', name: '台北', country: '台灣', flag: '🇹🇼', timezone: 'GMT+8', currency: '台幣 (TWD)', language: '國語、普通話', transport: { icon: '🚇', name: '捷運', tips: '悠遊卡必備' } },
  { id: 'london', name: '倫敦', country: '英國', flag: '🇬🇧', timezone: 'GMT+0', currency: '英鎊 (GBP)', language: '英語', transport: { icon: '🚇', name: 'London Underground', tips: 'Oyster 卡慳錢' } },
  { id: 'paris', name: '巴黎', country: '法國', flag: '🇫🇷', timezone: 'GMT+1', currency: '歐元 (EUR)', language: '法語', transport: { icon: '🚇', name: 'Metro', tips: 'Paris Visit Pass' } },
  { id: 'newyork', name: '紐約', country: '美國', flag: '🇺🇸', timezone: 'GMT-5', currency: '美元 (USD)', language: '英語', transport: { icon: '🚇', name: 'NYC Subway', tips: 'MetroCard 必備' } },
]

const TRANSPORT_TYPES = [
  { id: 'walk', icon: '🚶', label: '步行', desc: '近距離移動' },
  { id: 'mrt', icon: '🚇', label: '地鐵', desc: '快又準' },
  { id: 'bus', icon: '🚌', label: '巴士', desc: '路線多' },
  { id: 'taxi', icon: '🚕', label: '的士', desc: '方便但貴' },
  { id: 'train', icon: '🚆', label: '火車', desc: '城際交通' },
  { id: 'ferry', icon: '⛴️', label: '渡輪', desc: '維港/渡假' },
]

const TRIP_TYPES = [
  { id: 'food', label: '美食之旅', icon: '🍜', desc: '品嚐當地美食' },
  { id: 'sightseeing', label: '觀光遊覽', icon: '🏛️', desc: '探索景點' },
  { id: 'shopping', label: '購物血拼', icon: '🛍️', desc: '商場與市集' },
  { id: 'mixed', label: '綜合體驗', icon: '✨', desc: '全部都要' },
]

const PLACE_DATA = {
  hongkong: {
    food: [
      { title: '蓮香樓', time: '09:00', duration: '1.5小時', transport: '🚇', desc: '傳統點心，茶樓文化', address: '中環威靈頓街152號' },
      { title: '九記牛腩', time: '12:00', duration: '1小時', transport: '🚇', desc: '必試牛腩麵，米芝蓮推薦', address: '中環歌賦街21號地舖' },
      { title: '添好運', time: '15:00', duration: '1小時', transport: '🚶', desc: '平價米芝蓮點心', address: '深水埗福華街115號' },
      { title: '鏞記燒鵝', time: '19:00', duration: '1.5小時', transport: '🚕', desc: '金牌燒鵝，名人飯堂', address: '中環威靈頓街32-33號' },
    ],
    sightseeing: [
      { title: '山頂纜車', time: '10:00', duration: '2小時', transport: '🚡', desc: '維港全景，凌霄閣', address: '花園道山頂纜車總站' },
      { title: '香港故宮博物館', time: '13:00', duration: '3小時', transport: '🚌', desc: '文化藝術，珍貴藏品', address: '西九文化區' },
      { title: '天星小輪', time: '17:00', duration: '15分鐘', transport: '⛴️', desc: '維港渡輪，黎打卡', address: '尖沙咀/中環碼頭' },
    ],
    shopping: [
      { title: '海港城', time: '11:00', duration: '3小時', transport: '🚇', desc: '最大商場，品牌齊全', address: '尖沙咀海港城' },
      { title: '女人街', time: '15:00', duration: '2小時', transport: '🚶', desc: '露天市集，議價購物', address: '旺角登打士街' },
      { title: '又一城', time: '18:00', duration: '2小時', transport: '🚇', desc: '室內商場，蘋果店', address: '九龍塘又一城' },
    ],
  },
  tokyo: {
    food: [
      { title: '壽司大', time: '09:00', duration: '1小時', transport: '🚇', desc: '超人氣壽司，朝早排隊', address: '築地市場6號館' },
      { title: '一蘭拉麵', time: '12:00', duration: '45分鐘', transport: '🚇', desc: '博多拉麵，豚骨湯底', address: '新宿區歌舞伎町' },
      { title: '淺草今半', time: '15:00', duration: '1.5小時', transport: '🚇', desc: '壽喜燒老店', address: '淺草雷門對面' },
      { title: '燒肉店', time: '19:00', duration: '2小時', transport: '🚕', desc: '和牛燒肉，高級享受', address: '澀谷區' },
    ],
    sightseeing: [
      { title: '淺草寺', time: '10:00', duration: '1.5小時', transport: '🚇', desc: '雷門觀音，東京最古', address: '淺草雷門' },
      { title: '晴空塔', time: '13:00', duration: '2.5小時', transport: '🚇', desc: '東京塔高，購物商場', address: '墨田區押上' },
      { title: '明治神宮', time: '16:00', duration: '1.5小時', transport: '🚇', desc: '傳統神社，巨大鳥居', address: '澀谷區代代木' },
    ],
    shopping: [
      { title: '新宿伊勢丹', time: '11:00', duration: '3小時', transport: '🚇', desc: '百貨公司，高級品牌', address: '新宿區新宿' },
      { title: '秋葉原', time: '15:00', duration: '2小時', transport: '🚇', desc: '電器、動漫、玩具', address: '秋葉原站' },
      { title: '銀座', time: '18:00', duration: '2小時', transport: '🚇', desc: '高級品牌，繁華商業區', address: '銀座' },
    ],
  },
  osaka: {
    food: [
      { title: '道頓堀', time: '09:00', duration: '2小時', transport: '🚇', desc: '章魚小丸子，街頭美食', address: '道頓堀堀筋' },
      { title: '黑門市場', time: '12:00', duration: '1.5小時', transport: '🚶', desc: '海鮮天堂，平價美食', address: '日本橋黑門市場' },
      { title: '大阪燒', time: '15:00', duration: '1小時', transport: '🚇', desc: '特色料理，即叫即整', address: '心齋橋' },
      { title: '串炸店', time: '19:00', duration: '1.5小時', transport: '🚇', desc: '酥脆串炸，沾醬食', address: '新世界通天閣' },
    ],
    sightseeing: [
      { title: '大阪城', time: '10:00', duration: '2小時', transport: '🚇', desc: '歷史城堡，天守閣', address: '大阪城公園' },
      { title: '通天閣', time: '13:00', duration: '1.5小時', transport: '🚇', desc: '新世界地標，拉麵街', address: '惠比須町' },
      { title: '環球影城', time: '15:00', duration: '4小時', transport: '🚇', desc: '主題樂園，哈利波特', address: '此花區' },
    ],
    shopping: [
      { title: '心齋橋', time: '11:00', duration: '3小時', transport: '🚇', desc: '潮流購物，美國村', address: '心齋橋筋' },
      { title: '難波', time: '15:00', duration: '2小時', transport: '🚇', desc: '庶民商場，黑門市場', address: '難波' },
    ],
  },
  seoul: {
    food: [
      { title: '廣藏市場', time: '09:00', duration: '1.5小時', transport: '🚇', desc: '傳統小吃，綠豆餅', address: '鍾路區基洞' },
      { title: '明洞烤肉', time: '12:00', duration: '1.5小時', transport: '🚇', desc: '韓燒，任食牛肉', address: '明洞' },
      { title: '弘大美食', time: '15:00', duration: '2小時', transport: '🚇', desc: '年輕人天堂，酒吧', address: '弘大' },
      { title: '東大门', time: '19:00', duration: '2小時', transport: '🚇', desc: '深夜美食，批發市場', address: '東大门' },
    ],
    sightseeing: [
      { title: '景福宮', time: '10:00', duration: '2小時', transport: '🚇', desc: '朝鮮皇宮，守將換班', address: '鍾路區世憲路' },
      { title: 'N首爾塔', time: '13:00', duration: '2小時', transport: '🚡', desc: '南山塔，鎖頭橋', address: '南山' },
      { title: '明洞', time: '16:00', duration: '2小時', transport: '🚇', desc: '購物中心，化妝品', address: '明洞' },
    ],
    shopping: [
      { title: '弘大', time: '11:00', duration: '3小時', transport: '🚇', desc: '潮牌，年輕人設計', address: '弘大' },
      { title: '东大门设计广场', time: '15:00', duration: '2小時', transport: '🚇', desc: 'DDP，建築設計', address: '東大门' },
    ],
  },
  bangkok: {
    food: [
      { title: '恰圖恰市場', time: '09:00', duration: '2小時', transport: '🚂', desc: '最大市集，濕貨/乾貨', address: 'Chatuchak' },
      { title: '建興酒家', time: '12:00', duration: '1.5小時', transport: '🚕', desc: '海鮮，芒果糯米飯', address: '是隆/素里翁' },
      { title: '水上市場', time: '15:00', duration: '2小時', transport: '🚌', desc: '丹嫩莎朵，美食體驗', address: 'Damnoen Saduak' },
      { title: '考山路', time: '19:00', duration: '2小時', transport: '🚕', desc: '夜市，酒吧街', address: 'Khao San Road' },
    ],
    sightseeing: [
      { title: '大皇宮', time: '10:00', duration: '2小時', transport: '🚍', desc: '皇室宮殿，玉佛寺', address: 'Phra Nakhon' },
      { title: '鄭王廟', time: '13:00', duration: '1.5小時', transport: '⛴️', desc: '黎明寺，湄南河', address: 'Wat Arun' },
      { title: '四面佛', time: '16:00', duration: '1小時', transport: '🚇', desc: '愛神，許願必靈', address: '四面佛站' },
    ],
    shopping: [
      { title: 'MBK商場', time: '11:00', duration: '3小時', transport: '🚇', desc: '平價商品，科技產品', address: 'Phayathai' },
      { title: 'Terminal 21', time: '15:00', duration: '2小時', transport: '🚇', desc: '主題商場，每層不同國', address: 'Asok' },
    ],
  },
  singapore: {
    food: [
      { title: '松發肉骨茶', time: '09:00', duration: '1小時', transport: '🚇', desc: '潮汕肉骨茶，唐人街', address: 'New Bridge Road' },
      { title: '天天海南雞飯', time: '12:00', duration: '45分鐘', transport: '🚇', desc: '國菜，麥士威', address: 'Maxwell Road' },
      { title: '辣椒螃蟹', time: '15:00', duration: '1.5小時', transport: '🚇', desc: '特色海鮮，珍寶', address: '克拉碼頭' },
      { title: '老巴剎', time: '19:00', duration: '1.5小時', transport: '🚇', desc: '熟食中心，沙爹', address: ' Raffles Place' },
    ],
    sightseeing: [
      { title: '魚尾獅公園', time: '10:00', duration: '1小時', transport: '🚶', desc: '地標，拍照打卡', address: 'Marina Bay' },
      { title: '濱海灣花園', time: '13:00', duration: '3小時', transport: '🚇', desc: '超級樹，雲霧林', address: 'Marina Bay' },
      { title: '牛車水', time: '17:00', duration: '1.5小時', transport: '🚇', desc: '華人區，寺廟', address: 'Chinatown' },
    ],
    shopping: [
      { title: '烏節路', time: '11:00', duration: '3小時', transport: '🚇', desc: '購物大道，ION', address: 'Orchard' },
      { title: '樟宜機場', time: '15:00', duration: '2小時', transport: '🚇', desc: '星耀樟宜，瀑布', address: 'Changi Airport' },
    ],
  },
  taipei: {
    food: [
      { title: '寧夏夜市', time: '09:00', duration: '2小時', transport: '🚇', desc: '夜市小吃，蚵仔煎', address: 'Datong District' },
      { title: '鼎泰豐', time: '12:00', duration: '1小時', transport: '🚇', desc: '小籠包，米芝蓮', address: '信義路' },
      { title: '士林夜市', time: '15:00', duration: '2小時', transport: '🚇', desc: '大夜市，大香腸', address: 'Shihlin' },
      { title: '欣葉台菜', time: '19:00', duration: '1.5小時', transport: '🚇', desc: '台灣料理，個人建議', address: '雙城街' },
    ],
    sightseeing: [
      { title: '台北101', time: '10:00', duration: '2小時', transport: '🚇', desc: '觀景台，信義區', address: 'Xinyi District' },
      { title: '故宮博物院', time: '13:00', duration: '3小時', transport: '🚌', desc: '歷史文物，翠玉白菜', address: 'Shilin District' },
      { title: '西門町', time: '17:00', duration: '2小時', transport: '🚇', desc: '潮流區，電影街', address: 'Ximending' },
    ],
    shopping: [
      { title: '信義區', time: '11:00', duration: '3小時', transport: '🚇', desc: '新光三越，微風', address: 'Xinyi' },
      { title: '迪化街', time: '15:00', duration: '1.5小時', transport: '🚇', desc: '老街，年貨大街', address: 'Dihua Street' },
    ],
  },
}

const getPlaces = (cityId, tripType) => {
  const cityData = PLACE_DATA[cityId]
  if (!cityData) return []
  const typeKey = tripType === 'mixed' ? 'sightseeing' : tripType
  return cityData[typeKey] || []
}

export default function TripPlannerView() {
  const [selectedCity, setSelectedCity] = useState('hongkong')
  const [tripType, setTripType] = useState(null)
  const [days, setDays] = useState(1)
  const [companions, setCompanions] = useState('solo')
  const [generating, setGenerating] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [showCityInfo, setShowCityInfo] = useState(false)
  const [savedTrips, setSavedTrips] = useState([])
  const [currentTrip, setCurrentTrip] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [customPlaces, setCustomPlaces] = useState([])

  const currentCity = CITIES.find(c => c.id === selectedCity)
  const cityPlaces = getPlaces(selectedCity, tripType || 'sightseeing')

  const handleGenerate = async () => {
    if (!tripType) return
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2000))
    
    const itinerary = Array.from({ length: days }, (_, dayIndex) => ({
      day: dayIndex + 1,
      date: `Day ${dayIndex + 1}`,
      activities: [...cityPlaces].slice(0, 4)
    }))
    
    setCurrentTrip({ city: selectedCity, type: tripType, days, companions, itinerary })
    setGenerating(false)
    setShowResult(true)
  }

  const addCustomPlace = (place) => {
    setCustomPlaces(prev => [...prev, { ...place, time: place.time || '12:00' }])
  }

  const removeCustomPlace = (index) => {
    setCustomPlaces(prev => prev.filter((_, i) => i !== index))
  }

  const saveTrip = () => {
    if (currentTrip) setSavedTrips(prev => [...prev, { ...currentTrip, id: Date.now() }])
  }

  const deleteTrip = (id) => setSavedTrips(prev => prev.filter(t => t.id !== id))

  const shareTrip = (trip) => {
    const city = CITIES.find(c => c.id === trip.city)
    const typeLabels = { food: '美食之旅', sightseeing: '觀光遊覽', shopping: '購物血拼', mixed: '綜合體驗' }
    const text = `${city?.flag} ${city?.name} ${typeLabels[trip.type]} ${trip.days}日\n\n` +
      trip.itinerary.map(day => `${day.date}:\n` + day.activities.map(a => `⏰ ${a.time} ${a.title} (${a.transport} ${a.duration})`).join('\n')).join('\n\n')
    
    navigator.share ? navigator.share({ title: `${city?.name}行程`, text }) : navigator.clipboard.writeText(text)
  }

  const filteredPlaces = searchQuery ? cityPlaces.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.desc.toLowerCase().includes(searchQuery.toLowerCase())) : cityPlaces

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-b from-white to-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 pt-6 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-200">
              <Plane className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">AI 行程規劃</h1>
              <p className="text-sm text-slate-400">輕鬆規劃完美旅程</p>
            </div>
          </div>
          <button onClick={() => setShowCityInfo(true)} className="px-3 py-2 bg-blue-100 text-blue-600 rounded-xl font-semibold text-xs flex items-center gap-1">
            <Info className="w-4 h-4" />
            城市資訊
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {!showResult ? (
          <div className="space-y-6 animate-slide-up">
            {/* City Selection */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-violet-500" />
                選擇目的地
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {CITIES.map((city) => (
                  <button key={city.id} onClick={() => setSelectedCity(city.id)} className={`p-4 rounded-2xl border-2 text-left transition-all ${selectedCity === city.id ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <span className="text-3xl mb-2 block">{city.flag}</span>
                    <h3 className="font-bold text-slate-900">{city.name}</h3>
                    <p className="text-xs text-slate-500">{city.country}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* City Transport Info */}
            {currentCity && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{currentCity.transport.icon}</span>
                  <div>
                    <h3 className="font-bold text-slate-900">{currentCity.transport.name}</h3>
                    <p className="text-xs text-slate-500">{currentCity.transport.tips}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/80 rounded-lg p-2">
                    <span className="text-slate-400">貨幣：</span>
                    <span className="font-semibold text-slate-700">{currentCity.currency}</span>
                  </div>
                  <div className="bg-white/80 rounded-lg p-2">
                    <span className="text-slate-400">時區：</span>
                    <span className="font-semibold text-slate-700">{currentCity.timezone}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Trip Type */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-violet-500" />
                行程類型
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {TRIP_TYPES.map((type) => (
                  <button key={type.id} onClick={() => setTripType(type.id)} className={`p-4 rounded-2xl border-2 text-left transition-all ${tripType === type.id ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <span className="text-3xl mb-2 block">{type.icon}</span>
                    <h3 className="font-bold text-slate-900">{type.label}</h3>
                    <p className="text-xs text-slate-500 mt-1">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Days */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                行程天數
              </h2>
              <div className="flex gap-2">
                {[1, 2, 3, 5, 7].map((d) => (
                  <button key={d} onClick={() => setDays(d)} className={`flex-1 py-4 rounded-2xl font-bold transition-all ${days === d ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {d}日
                  </button>
                ))}
              </div>
            </div>

            {/* Companions */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-500" />
                同行人數
              </h2>
              <div className="flex gap-2">
                {[{ id: 'solo', label: '獨自', icon: '🧑' }, { id: 'couple', label: '情侶', icon: '💑' }, { id: 'family', label: '家庭', icon: '👨‍👩‍👧' }, { id: 'friends', label: '朋友', icon: '👯' }].map((c) => (
                  <button key={c.id} onClick={() => setCompanions(c.id)} className={`flex-1 py-3 rounded-2xl font-semibold transition-all flex flex-col items-center gap-1 ${companions === c.id ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    <span>{c.icon}</span>
                    <span className="text-xs">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Add Custom Place */}
            {cityPlaces.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-3">熱門地點</h3>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="搜索地點..." className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
                  </div>
                </div>
                <div className="p-4 max-h-48 overflow-y-auto space-y-2">
                  {filteredPlaces.slice(0, 6).map((place, i) => {
                    const isAdded = customPlaces.some(p => p.title === place.title)
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                        <span className="text-2xl">{place.transport}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{place.title}</p>
                          <p className="text-xs text-slate-500">{place.duration} • {place.desc}</p>
                        </div>
                        <button onClick={() => !isAdded && addCustomPlace(place)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${isAdded ? 'bg-green-100 text-green-600' : 'bg-violet-100 text-violet-600 hover:bg-violet-200'}`}>
                          {isAdded ? '已加' : '+'}
                        </button>
                      </div>
                    )
                  })}
                </div>
                {customPlaces.length > 0 && (
                  <div className="p-4 border-t border-slate-100 bg-violet-50">
                    <p className="text-sm font-semibold text-violet-600 mb-2">已選擇 {customPlaces.length} 個地點</p>
                    <div className="flex flex-wrap gap-2">
                      {customPlaces.map((p, i) => (
                        <span key={i} className="px-3 py-1 bg-white rounded-full text-xs font-semibold flex items-center gap-1">
                          {p.title}
                          <button onClick={() => removeCustomPlace(i)} className="text-red-500">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button onClick={handleGenerate} disabled={!tripType || generating} className="w-full py-5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white font-bold rounded-2xl shadow-xl shadow-violet-200 hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3">
              {generating ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Sparkles className="w-6 h-6" /><span>生成 {currentCity?.flag} {currentCity?.name} 行程</span></>}
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-slide-up">
            <button onClick={() => { setShowResult(false); setCurrentTrip(null); }} className="flex items-center gap-2 text-slate-500 font-medium">
              <ChevronRight className="w-5 h-5 rotate-180" />重新規劃
            </button>

            <div className="bg-gradient-to-r from-violet-500 to-purple-500 rounded-3xl p-5 text-white">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{currentCity?.flag}</span>
                <div>
                  <h2 className="text-xl font-extrabold">{currentCity?.name} {TRIP_TYPES.find(t => t.id === currentTrip.type)?.icon} {TRIP_TYPES.find(t => t.id === currentTrip.type)?.label}</h2>
                  <p className="text-white/80 text-sm">{currentCity?.country} • {currentTrip.days} 日遊</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={saveTrip} className="flex-1 py-3 bg-white/20 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/30"><Plus className="w-5 h-5" />保存</button>
                <button onClick={() => shareTrip(currentTrip)} className="flex-1 py-3 bg-white/20 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/30"><Share2 className="w-5 h-5" />分享</button>
              </div>
            </div>

            {currentTrip.itinerary.map((day) => (
              <div key={day.day} className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-lg">Day {day.day}</h3>
                </div>
                <div className="p-4 space-y-4">
                  {day.activities.map((activity, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl">{activity.transport}</div>
                        {i < day.activities.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 my-1" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-violet-500 bg-violet-50 px-2 py-0.5 rounded">{activity.time}</span>
                          <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{activity.duration}</span>
                        </div>
                        <h4 className="font-bold text-slate-900">{activity.title}</h4>
                        <p className="text-sm text-slate-500 mt-1">{activity.desc}</p>
                        {activity.address && <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{activity.address}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Transport Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><span className="text-xl">{currentCity?.transport.icon}</span>交通建議</h3>
              <p className="text-sm text-slate-600">{currentCity?.transport.name}：{currentCity?.transport.tips}</p>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="bg-white/80 rounded-lg p-2"><span className="text-slate-400">語言：</span><span className="font-semibold text-slate-700">{currentCity?.language}</span></div>
                <div className="bg-white/80 rounded-lg p-2"><span className="text-slate-400">貨幣：</span><span className="font-semibold text-slate-700">{currentCity?.currency}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* City Info Modal */}
      {showCityInfo && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-5" onClick={() => setShowCityInfo(false)}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scale-in max-h-[80vh]" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-900">城市資訊</h2>
              <button onClick={() => setShowCityInfo(false)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">✕</button>
            </div>
            <div className="p-5 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {CITIES.map((city) => (
                  <div key={city.id} className="bg-slate-50 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{city.flag}</span>
                      <div>
                        <h3 className="font-bold text-slate-900">{city.name}</h3>
                        <p className="text-xs text-slate-500">{city.country}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-slate-400">交通：</span><span className="font-semibold">{city.transport.name}</span></div>
                      <div><span className="text-slate-400">時區：</span><span className="font-semibold">{city.timezone}</span></div>
                      <div><span className="text-slate-400">語言：</span><span className="font-semibold">{city.language}</span></div>
                      <div><span className="text-slate-400">貨幣：</span><span className="font-semibold">{city.currency}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
