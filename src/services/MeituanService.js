/**
 * 美团开放平台 (Meituan Open Platform) Scraper
 * 
 * 官方API申请地址: https://open.meituan.com/
 * 
 * 免费申请流程:
 * 1. 注册美团开放平台账号
 * 2. 创建应用获取 AppID 和 AppSecret
 * 3. 申请相关API权限（餐饮、酒店等）
 * 
 * NOTE: 此文件为预留接口，需要有效的 AppID 和 AppSecret 才能使用
 */

const MEITUAN_CONFIG = {
  // 从环境变量或配置获取
  appId: import.meta.env.VITE_MEITUAN_APP_ID || '',
  appSecret: import.meta.env.VITE_MEITUAN_APP_SECRET || '',
  baseUrl: 'https://open.meituan.com/api'
}

// 签名生成（美团API需要）
const generateSign = (params, appSecret) => {
  // 按key排序后拼接并加密
  const sortedKeys = Object.keys(params).sort()
  let str = ''
  sortedKeys.forEach(key => {
    if (params[key] !== '' && params[key] !== null) {
      str += `${key}=${params[key]}&`
    }
  })
  str = str.slice(0, -1) + appSecret
  // MD5签名（需要引入md5库）
  return md5(str)
}

// 搜索餐厅
export const searchMeituanRestaurants = async (cityId, keyword, page = 1) => {
  if (!MEITUAN_CONFIG.appId || !MEITUAN_CONFIG.appSecret) {
    console.log('⚠️ 美团 API 未配置，请先申请 AppID 和 AppSecret')
    return null
  }

  const timestamp = Math.floor(Date.now() / 1000)
  const params = {
    app_id: MEITUAN_CONFIG.appId,
    city_id: cityId,
    keyword: keyword,
    page: page,
    timestamp: timestamp
  }
  
  // 添加签名
  params.sign = generateSign(params, MEITUAN_CONFIG.appSecret)

  try {
    const response = await fetch(`${MEITUAN_CONFIG.baseUrl}/v2/pois/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
    
    const data = await response.json()
    
    if (data.status === 0) {
      return data.data.map(poi => ({
        id: poi.id,
        name: poi.name,
        address: poi.address,
        lat: poi.lat,
        lng: poi.lng,
        avgPrice: poi.avgPrice,
        rating: poi.rating,
        category: 'restaurants'
      }))
    }
    
    console.error('❌ 美团API错误:', data)
    return null
  } catch (error) {
    console.error('❌ 美团请求失败:', error)
    return null
  }
}

// 获取城市ID列表
export const getMeituanCities = async () => {
  if (!MEITUAN_CONFIG.appId) return null

  try {
    const response = await fetch(`${MEITUAN_CONFIG.baseUrl}/v1/cities`)
    const data = await response.json()
    
    if (data.status === 0) {
      return data.data
    }
    return null
  } catch (error) {
    console.error('❌ 获取城市列表失败:', error)
    return null
  }
}

// 获取餐厅详情
export const getMeituanPoiDetail = async (poiId) => {
  if (!MEITUAN_CONFIG.appId) return null

  try {
    const timestamp = Math.floor(Date.now() / 1000)
    const params = {
      app_id: MEITUAN_CONFIG.appId,
      poi_id: poiId,
      timestamp: timestamp
    }
    params.sign = generateSign(params, MEITUAN_CONFIG.appSecret)

    const response = await fetch(`${MEITUAN_CONFIG.baseUrl}/v1/poi/${poiId}`, {
      method: 'GET',
      headers: { params }
    })
    
    const data = await response.json()
    return data.data || null
  } catch (error) {
    console.error('❌ 获取餐厅详情失败:', error)
    return null
  }
}

// 检查API是否已配置
export const isMeituanConfigured = () => {
  return !!(MEITUAN_CONFIG.appId && MEITUAN_CONFIG.appSecret)
}

// 获取配置信息
export const getMeituanSetupGuide = () => ({
  name: '美团开放平台',
  url: 'https://open.meituan.com/',
  steps: [
    '1. 访问 open.meituan.com 注册账号',
    '2. 登录后创建应用（选择"移动应用"）',
    '3. 获取 AppID 和 AppSecret',
    '4. 在环境变量中设置 VITE_MEITUAN_APP_ID 和 VITE_MEITUAN_APP_SECRET',
    '5. 申请相关API权限（餐饮搜索等）'
  ],
  environmentVars: [
    'VITE_MEITUAN_APP_ID=your_app_id',
    'VITE_MEITUAN_APP_SECRET=your_app_secret'
  ],
  note: '美团API需要企业认证或个人开发者认证，部分高级API可能需要付费'
})