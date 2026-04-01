// Traffic Data API - Real Hong Kong Traffic Sensors
// Data source: Hong Kong Transport Department

const BASE_URL = '/hk-local-map/data/traffic_sensors.csv'

// Cache for parsed data
let sensorsCache = null

// Parse CSV
const parseCSV = (csvText) => {
  const lines = csvText.split('\n')
  const headers = lines[0].split(',')
  
  return lines.slice(1).filter(line => line.trim()).map(line => {
    const values = []
    let current = ''
    let inQuotes = false
    
    for (let char of line) {
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim())
    
    const obj = {}
    headers.forEach((h, i) => {
      obj[h.trim()] = values[i] || ''
    })
    return obj
  })
}

// Get all sensors
export const getAllSensors = async () => {
  if (sensorsCache) return sensorsCache
  
  try {
    const response = await fetch(BASE_URL)
    const csvText = await response.text()
    sensorsCache = parseCSV(csvText)
    return sensorsCache
  } catch (error) {
    console.error('Error loading traffic sensors:', error)
    return []
  }
}

// Simulate traffic speed based on time and location
const simulateTraffic = (sensor) => {
  const hour = new Date().getHours()
  
  // Base speed for the road type
  let baseSpeed = 70 // km/h
  
  // Adjust based on road type
  const road = (sensor.Road_EN || '').toLowerCase()
  if (road.includes('highway') || road.includes('expressway') || road.includes('tunnel')) {
    baseSpeed = 80
  } else if (road.includes('road') && road.includes('main')) {
    baseSpeed = 60
  } else if (road.includes('street')) {
    baseSpeed = 40
  }
  
  // Rush hour simulation (7-9 AM, 5-7 PM)
  if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
    baseSpeed = baseSpeed * 0.4 // 60% reduction during rush
  } else if (hour >= 10 && hour <= 16) {
    baseSpeed = baseSpeed * 0.85 // 15% reduction during day
  } else if (hour >= 22 || hour <= 5) {
    baseSpeed = baseSpeed * 1.1 // 10% increase at night
  }
  
  // Add some randomness
  const variance = (Math.random() - 0.5) * 20
  const speed = Math.max(10, Math.min(120, baseSpeed + variance))
  
  // Determine status
  let status = 'smooth'
  if (speed < 40) status = 'congested'
  else if (speed < 60) status = 'moderate'
  
  return {
    id: sensor.AID_ID_Number,
    district: sensor.District,
    road_en: sensor.Road_EN,
    road_tc: sensor.Road_TC,
    lat: parseFloat(sensor.Latitude),
    lon: parseFloat(sensor.Longitude),
    direction: sensor.Direction,
    speed: Math.round(speed),
    status
  }
}

// Get all traffic data with simulated speeds
let trafficDataCache = null

export const getTrafficData = async () => {
  if (trafficDataCache) return trafficDataCache
  
  const sensors = await getAllSensors()
  
  if (sensors.length > 0) {
    trafficDataCache = sensors
      .map(simulateTraffic)
      .filter(s => !isNaN(s.lat) && !isNaN(s.lon))
    return trafficDataCache
  }
  
  return getFallbackData()
}

// Fallback data
function getFallbackData() {
  const hour = new Date().getHours()
  const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)
  
  return [
    { id: 'AID01101', district: 'Southern', road_en: 'Aberdeen Praya Road', road_tc: '香港仔海旁道', lat: 22.2481, lon: 114.1525, direction: 'SE', speed: isRushHour ? 25 : 45, status: isRushHour ? 'congested' : 'moderate' },
    { id: 'AID01108', district: 'Wan Chai', road_en: 'Wong Nai Chung Gap Flyover', road_tc: '黃泥涌峽天橋', lat: 22.2719, lon: 114.1801, direction: 'NW', speed: isRushHour ? 20 : 55, status: isRushHour ? 'congested' : 'moderate' },
    { id: 'AID01111', district: 'Kowloon City', road_en: 'Hong Chong Road', road_tc: '康莊道', lat: 22.3041, lon: 114.1810, direction: 'E', speed: isRushHour ? 30 : 50, status: isRushHour ? 'congested' : 'moderate' },
    { id: 'AID01117', district: 'Kowloon City', road_en: 'Waterloo Road', road_tc: '窩打老道', lat: 22.3244, lon: 114.1783, direction: 'N', speed: isRushHour ? 35 : 55, status: isRushHour ? 'congested' : 'moderate' },
    { id: 'AID01123', district: 'Kowloon City', road_en: 'Lion Rock Tunnel Road', road_tc: '獅子山隧道公路', lat: 22.3452, lon: 114.1813, direction: 'N', speed: isRushHour ? 15 : 40, status: 'congested' },
    { id: 'AID02104', district: 'Kwun Tong', road_en: 'Kwun Tong Bypass', road_tc: '觀塘繞道', lat: 22.3069, lon: 114.2331, direction: 'NW', speed: isRushHour ? 30 : 60, status: isRushHour ? 'congested' : 'moderate' },
    { id: 'AID03106', district: 'Yau Tsim Mong', road_en: 'West Kowloon Highway', road_tc: '西九龍公路', lat: 22.3078, lon: 114.1607, direction: 'N', speed: 80, status: 'smooth' },
    { id: 'AID04106', district: 'Eastern', road_en: 'Island Eastern Corridor', road_tc: '東區走廊', lat: 22.2933, lon: 114.1972, direction: 'E', speed: isRushHour ? 35 : 65, status: isRushHour ? 'congested' : 'moderate' },
    { id: 'AID08101', district: 'Islands', road_en: 'North Lantau Highway', road_tc: '北大嶼山公路', lat: 22.3276, lon: 114.0253, direction: 'W', speed: 90, status: 'smooth' },
    { id: 'AID09101', district: 'Tsuen Wan', road_en: 'Tuen Mun Road', road_tc: '屯門公路', lat: 22.3743, lon: 114.1030, direction: 'E', speed: isRushHour ? 25 : 50, status: isRushHour ? 'congested' : 'moderate' },
    { id: 'TDS90016', district: 'Tuen Mun', road_en: 'Tuen Mun Road', road_tc: '屯門公路', lat: 22.3738, lon: 114.1016, direction: 'W', speed: isRushHour ? 20 : 45, status: 'congested' },
  ]
}

// Get traffic color
export const getTrafficColor = (speed) => {
  if (speed >= 60) return '#22c55e' // green
  if (speed >= 40) return '#eab308' // yellow
  return '#ef4444' // red
}

// Get traffic label
export const getTrafficLabel = (status) => {
  if (status === 'smooth') return '通暢'
  if (status === 'moderate') return '中等'
  return '擠塞'
}

// Get district summary
export const getDistrictSummary = async () => {
  const data = await getTrafficData()
  
  const districts = {}
  data.forEach(sensor => {
    const district = sensor.district || '其他'
    if (!districts[district]) {
      districts[district] = { total: 0, speeds: [], congested: 0 }
    }
    districts[district].total++
    districts[district].speeds.push(sensor.speed)
    if (sensor.status === 'congested') districts[district].congested++
  })
  
  return Object.entries(districts).map(([district, info]) => ({
    district,
    avgSpeed: Math.round(info.speeds.reduce((a, b) => a + b, 0) / info.speeds.length),
    sensorCount: info.total,
    congestedCount: info.congested
  }))
}

// Get sensors by district
export const getSensorsByDistrict = async (district) => {
  const sensors = await getAllSensors()
  return sensors.filter(s => s.District === district)
}
