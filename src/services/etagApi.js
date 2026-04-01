// e-tag API Service
// HKeMobility Data API: https://data.etagmb.gov.hk/

const BASE_URL = 'https://data.etagmb.gov.hk'

// Region codes
export const REGIONS = {
  HKI: '香港島',
  KLN: '九龍', 
  NT: '新界'
}

// Fetch all routes
export async function getAllRoutes() {
  try {
    const response = await fetch(`${BASE_URL}/route`)
    const data = await response.json()
    return data.data.routes
  } catch (error) {
    console.error('Failed to fetch routes:', error)
    return { HKI: [], KLN: [], NT: [] }
  }
}

// Fetch route details
export async function getRouteDetail(region, routeCode) {
  try {
    const response = await fetch(`${BASE_URL}/route/${region}/${routeCode}`)
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Failed to fetch route detail:', error)
    return []
  }
}

// Get route list for a region
export async function getRoutesByRegion(region) {
  try {
    const response = await fetch(`${BASE_URL}/route/${region}`)
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Failed to fetch routes for region:', error)
    return []
  }
}

// Format headway info
export function formatHeadway(headway) {
  const days = ['一', '二', '三', '四', '五', '六', '日']
  const weekdays = headway.weekdays
  
  let dayStr = ''
  if (weekdays.slice(0, 5).every(d => d)) {
    dayStr = '平日'
  } else if (weekdays.slice(5, 7).every(d => d)) {
    dayStr = '周末'
  } else {
    dayStr = '每天'
  }
  
  const freq = headway.frequency
  const freqUpper = headway.frequency_upper
  
  if (freqUpper) {
    return `${dayStr} ${headway.start_time.slice(0,5)}-${headway.end_time.slice(0,5)} · 每${freq}-${freqUpper}分鐘`
  }
  return `${dayStr} ${headway.start_time.slice(0,5)}-${headway.end_time.slice(0,5)} · 每${freq}分鐘`
}
