// Hong Kong Events API - Mock Data
// Since external APIs often have CORS issues, we use comprehensive local mock data

// Popular Hong Kong Events
const HK_EVENTS = [
  {
    id: 'evt001',
    title: '香港美酒佳餚節 2026',
    description: '品嚐來自世界各地的美酒與美食，欣賞維多利亞港夜景',
    location: '中環海濱活動空間',
    startDate: '2026-04-15',
    endDate: '2026-04-18',
    time: '10:00 - 22:00',
    category: '美食',
    org: '香港旅遊發展局',
    status: 'A',
    price: '免費',
    image: '🍷'
  },
  {
    id: 'evt002',
    title: '香港國際七人欖球賽',
    description: '世界級欖球盛事，勁旅雲集香港大球場',
    location: '香港大球場',
    startDate: '2026-04-05',
    endDate: '2026-04-07',
    time: '12:00 - 20:00',
    category: '體育',
    org: '香港欖球總會',
    status: 'A',
    price: '$380-$1,200',
    image: '🏉'
  },
  {
    id: 'evt003',
    title: '香港花卉展覽 2026',
    description: '超過35萬株花卉參展，全城花香四溢',
    location: '維多利亞公園',
    startDate: '2026-03-15',
    endDate: '2026-03-24',
    time: '09:00 - 21:00',
    category: '展覽',
    org: '康樂及文化事務署',
    status: 'C',
    price: '$14-$24',
    image: '🌸'
  },
  {
    id: 'evt004',
    title: '香港國際博物館日',
    description: '多家博物館免費開放，特別展覽與工作坊',
    location: '香港歷史博物館等',
    startDate: '2026-05-18',
    endDate: '2026-05-18',
    time: '10:00 - 18:00',
    category: '文化',
    org: '康樂及文化事務署',
    status: 'A',
    price: '免費',
    image: '🏛️'
  },
  {
    id: 'evt005',
    title: '香港龍舟節',
    description: '傳統龍舟賽事，鼓聲震天，緊張刺激',
    location: '大埔海濱公園',
    startDate: '2026-06-01',
    endDate: '2026-06-01',
    time: '08:00 - 17:00',
    category: '體育',
    org: '民政事務總署',
    status: 'A',
    price: '免費',
    image: '🐉'
  },
  {
    id: 'evt006',
    title: '香港動漫電玩節',
    description: '動漫迷年度盛事，最新動漫產品與電競比賽',
    location: '香港會議展覽中心',
    startDate: '2026-07-27',
    endDate: '2026-07-31',
    time: '10:00 - 21:00',
    category: '展覽',
    org: '香港動漫電玩節籌委會',
    status: 'A',
    price: '$35-$250',
    image: '🎮'
  },
  {
    id: 'evt007',
    title: '香港美食節',
    description: '傳統與創新美食薈萃，食遍全港特色小吃',
    location: '香港仔海濱公園',
    startDate: '2026-08-15',
    endDate: '2026-08-20',
    time: '11:00 - 22:00',
    category: '美食',
    org: '香港餐飲聯業協會',
    status: 'A',
    price: '免費',
    image: '🍜'
  },
  {
    id: 'evt008',
    title: '香港單車節',
    description: '單車愛好者盛會，踩遍港九新界美景',
    location: '青馬大橋',
    startDate: '2026-10-12',
    endDate: '2026-10-12',
    time: '05:30 - 14:00',
    category: '體育',
    org: '香港旅遊發展局',
    status: 'A',
    price: '$200-$500',
    image: '🚴'
  },
  {
    id: 'evt009',
    title: '香港繽紛冬日節',
    description: '聖誕新年大型慶祝活動，璀璨燈飾與表演',
    location: '香港多處',
    startDate: '2026-12-01',
    endDate: '2026-12-31',
    time: '全天',
    category: '節慶',
    org: '香港旅遊發展局',
    status: 'A',
    price: '免費',
    image: '🎄'
  },
  {
    id: 'evt010',
    title: '香港國際帆船賽',
    description: '維港帆船競速，國際頂尖船隊雲集',
    location: '維多利亞港',
    startDate: '2026-01-15',
    endDate: '2026-01-15',
    time: '10:00 - 17:00',
    category: '體育',
    org: '香港帆船總會',
    status: 'C',
    price: '免費觀賞',
    image: '⛵'
  },
  {
    id: 'evt011',
    title: '香港藝術節',
    description: '雲集國際與本地藝術家，戲劇、音樂、舞蹈盛宴',
    location: '香港文化中心等',
    startDate: '2026-02-01',
    endDate: '2026-03-15',
    time: '各時段',
    category: '文化',
    org: '香港藝術節協會',
    status: 'C',
    price: '$100-$800',
    image: '🎭'
  },
  {
    id: 'evt012',
    title: '長洲太平清醮',
    description: '傳統飄色巡遊、搶包山，獨特搶包活動',
    location: '長洲',
    startDate: '2026-05-03',
    endDate: '2026-05-07',
    time: '全日',
    category: '傳統',
    org: '長洲鄉事委員會',
    status: 'A',
    price: '免費',
    image: '🏮'
  },
  {
    id: 'evt013',
    title: '香港國際演唱會',
    description: 'K-POP天王天后登陸香港紅館',
    location: '香港體育館',
    startDate: '2026-04-20',
    endDate: '2026-04-30',
    time: '19:30 - 23:00',
    category: '音樂',
    org: '香港體育館',
    status: 'A',
    price: '$380-$1,280',
    image: '🎤'
  },
  {
    id: 'evt014',
    title: '香港電影節',
    description: '中外電影佳作雲集，電影人見面會',
    location: '香港文化中心',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    time: '各場次',
    category: '電影',
    org: '香港國際電影節協會',
    status: 'C',
    price: '$70-$180',
    image: '🎬'
  },
  {
    id: 'evt015',
    title: '香港書展',
    description: '亞洲最大書展之一，書籍折扣優惠',
    location: '香港會議展覽中心',
    startDate: '2026-07-17',
    endDate: '2026-07-23',
    time: '10:00 - 21:00',
    category: '展覽',
    org: '香港貿易發展局',
    status: 'A',
    price: '$25-$35',
    image: '📚'
  },
  {
    id: 'evt016',
    title: '香港美食博覽',
    description: '環球美食嘉年華，試食、試飲、工作坊',
    location: '香港會議展覽中心',
    startDate: '2026-08-15',
    endDate: '2026-08-19',
    time: '10:00 - 22:00',
    category: '美食',
    org: '香港貿易發展局',
    status: 'A',
    price: '$30',
    image: '🍽️'
  },
  {
    id: 'evt017',
    title: '香港電子科技博覽',
    description: '最新電子產品、智能家居、科技玩意',
    location: '香港會議展覽中心',
    startDate: '2026-10-13',
    endDate: '2026-10-16',
    time: '09:00 - 18:00',
    category: '科技',
    org: '香港貿易發展局',
    status: 'A',
    price: '$100',
    image: '💻'
  },
  {
    id: 'evt018',
    title: '大坑舞火龍',
    description: '中秋傳統習俗，火龍蜿蜒穿梭巷弄',
    location: '銅鑼灣大坑',
    startDate: '2026-09-17',
    endDate: '2026-09-17',
    time: '20:00 - 22:00',
    category: '傳統',
    org: '大坑坊眾福利會',
    status: 'A',
    price: '免費',
    image: '🐲'
  },
  {
    id: 'evt019',
    title: '香港馬拉松',
    description: '全港最大型跑步賽事，跑遍港九各區',
    location: '尖沙咀彌敦道',
    startDate: '2026-02-09',
    endDate: '2026-02-09',
    time: '05:30 - 14:00',
    category: '體育',
    org: '香港業餘田徑總會',
    status: 'C',
    price: '$400-$800',
    image: '🏃'
  },
  {
    id: 'evt020',
    title: '香港維港渡泳',
    description: '横渡維多利亞港，經典海上渡泳挑戰',
    location: '維多利亞港',
    startDate: '2026-10-26',
    endDate: '2026-10-26',
    time: '08:00 - 12:00',
    category: '體育',
    org: '中國香港泳總',
    status: 'A',
    price: '$300',
    image: '🏊'
  }
]

// Fetch all events
export async function getAllEvents() {
  // Return mock data directly - no external API needed
  return HK_EVENTS
}

// Get event by ID
export async function getEventById(eventId) {
  return HK_EVENTS.find(e => e.id === eventId) || null
}

// Get events by organization
export async function getEventsByOrg(org) {
  return HK_EVENTS.filter(e => e.org.includes(org))
}

// Format event date
export function formatEventDate(dateStr) {
  if (!dateStr) return '日期待定'
  
  const months = {
    '01': '1月', '02': '2月', '03': '3月', '04': '4月',
    '05': '5月', '06': '6月', '07': '7月', '08': '8月',
    '09': '9月', '10': '10月', '11': '11月', '12': '12月'
  }
  
  const parts = dateStr.split('-')
  if (parts.length === 3) {
    return `${parts[0]}年${months[parts[1]] || parts[1]}${parseInt(parts[2])}日`
  }
  
  return dateStr
}

// Parse multiple dates
export function parseEventDates(dateStr) {
  if (!dateStr) return []
  
  const parts = dateStr.split('-')
  if (parts.length === 3) {
    return [{
      year: parts[0],
      month: parts[1],
      day: parseInt(parts[2])
    }]
  }
  
  return []
}

// Get event status label
export function getEventStatus(status) {
  const labels = {
    'A': '接受報名',
    'B': '已滿額',
    'C': '已截止',
    'S': '取消'
  }
  return labels[status] || status
}

// Get organization category
export function getOrgCategory(org) {
  if (!org) return '其他'
  
  const orgLower = org.toLowerCase()
  
  if (orgLower.includes('欖球') || orgLower.includes('田徑') || orgLower.includes('泳') || orgLower.includes('帆船') || orgLower.includes('單車')) {
    return '體育'
  }
  if (orgLower.includes('康樂') || orgLower.includes('文化')) {
    return '文化'
  }
  if (orgLower.includes('旅遊') || orgLower.includes('美食') || orgLower.includes('餐飲')) {
    return '旅遊美食'
  }
  if (orgLower.includes('貿易') || orgLower.includes('發展局')) {
    return '商務'
  }
  if (orgLower.includes('醫') || orgLower.includes('健康')) {
    return '醫療'
  }
  
  return '其他'
}
