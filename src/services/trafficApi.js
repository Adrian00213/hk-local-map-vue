// Traffic Data API - Hong Kong Traffic Sensors
// Primary: CSV data, Fallback: Mock data

// Cache
let sensorsCache = null
let trafficDataCache = null

// Load CSV with fallbacks
const loadCSV = async (filename) => {
  const paths = [
    `./data/${filename}`,
    `/hk-local-map-vue/data/${filename}`,
    `/hk-local-map/data/${filename}`
  ]
  
  for (const path of paths) {
    try {
      const response = await fetch(path)
      if (response.ok) {
        return await response.text()
      }
    } catch (e) {
      // Continue to next path
    }
  }
  
  throw new Error('CSV not found')
}

// Parse CSV
const parseCSV = (csvText) => {
  const lines = csvText.split('\n')
  const headers = lines[0].split(',')
  
  return lines.slice(1).filter(line => line.trim()).map(line => {
    const values = line.split(',')
    const obj = {}
    headers.forEach((h, i) => {
      obj[h.trim()] = values[i]?.trim() || ''
    })
    return obj
  })
}

// Get all sensors
export const getAllSensors = async () => {
  if (sensorsCache) return sensorsCache
  
  try {
    const csvText = await loadCSV('traffic_sensors.csv')
    sensorsCache = parseCSV(csvText)
    return sensorsCache
  } catch (error) {
    console.warn('Traffic CSV not found, using fallback:', error.message)
    return getFallbackSensors()
  }
}

// Fallback sensors (when CSV unavailable)
function getFallbackSensors() {
  return [
    { AID_ID_Number: 'AID01101', District: 'Southern', Road_EN: 'Aberdeen Praya Road', Road_TC: '香港仔海旁道', Latitude: '22.2481', Longitude: '114.1525', Direction: 'SE' },
    { AID_ID_Number: 'AID01108', District: 'Wan Chai', Road_EN: 'Wong Nai Chung Gap Flyover', Road_TC: '黃泥涌峽天橋', Latitude: '22.2719', Longitude: '114.1801', Direction: 'NW' },
    { AID_ID_Number: 'AID01111', District: 'Kowloon City', Road_EN: 'Hong Chong Road', Road_TC: '康莊道', Latitude: '22.3041', Longitude: '114.1810', Direction: 'E' },
    { AID_ID_Number: 'AID01117', District: 'Kowloon City', Road_EN: 'Waterloo Road', Road_TC: '窩打老道', Latitude: '22.3244', Longitude: '114.1783', Direction: 'N' },
    { AID_ID_Number: 'AID01123', District: 'Kowloon City', Road_EN: 'Lion Rock Tunnel Road', Road_TC: '獅子山隧道公路', Latitude: '22.3452', Longitude: '114.1813', Direction: 'N' },
    { AID_ID_Number: 'AID02104', District: 'Kwun Tong', Road_EN: 'Kwun Tong Bypass', Road_TC: '觀塘繞道', Latitude: '22.3069', Longitude: '114.2331', Direction: 'NW' },
    { AID_ID_Number: 'AID03106', District: 'Yau Tsim Mong', Road_EN: 'West Kowloon Highway', Road_TC: '西九龍公路', Latitude: '22.3078', Longitude: '114.1607', Direction: 'N' },
    { AID_ID_Number: 'AID04106', District: 'Eastern', Road_EN: 'Island Eastern Corridor', Road_TC: '東區走廊', Latitude: '22.2933', Longitude: '114.1972', Direction: 'E' },
    { AID_ID_Number: 'AID08101', District: 'Islands', Road_EN: 'North Lantau Highway', Road_TC: '北大嶼山公路', Latitude: '22.3276', Longitude: '114.0253', Direction: 'W' },
    { AID_ID_Number: 'AID09101', District: 'Tsuen Wan', Road_EN: 'Tuen Mun Road', Road_TC: '屯門公路', Latitude: '22.3743', Longitude: '114.1030', Direction: 'E' },
  ]
}

// Simulate traffic
const simulateTraffic = (sensor, index) => {
  const hour = new Date().getHours()
  const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)
  
  // Different speeds for different roads
  let baseSpeed = 70
  const road = (sensor.Road_EN || '').toLowerCase()
  
  if (road.includes('highway') || road.includes('expressway') || road.includes('corridor')) {
    baseSpeed = 80
  } else if (road.includes('tunnel')) {
    baseSpeed = 70
  } else if (road.includes('road')) {
    baseSpeed = 50
  }
  
  if (isRushHour) {
    baseSpeed = baseSpeed * 0.4
  } else if (hour >= 10 && hour <= 16) {
    baseSpeed = baseSpeed * 0.8
  } else if (hour >= 22 || hour <= 5) {
    baseSpeed = baseSpeed * 1.1
  }
  
  const variance = (Math.random() - 0.5) * 20
  const speed = Math.max(15, Math.min(100, baseSpeed + variance))
  
  let status = 'smooth'
  if (speed < 40) status = 'congested'
  else if (speed < 60) status = 'moderate'
  
  return {
    id: sensor.AID_ID_Number || `sensor_${index}`,
    district: sensor.District || '其他',
    road_en: sensor.Road_EN || 'Unknown Road',
    road_tc: sensor.Road_TC || '未知道路',
    lat: parseFloat(sensor.Latitude) || 22.3 + Math.random() * 0.1,
    lon: parseFloat(sensor.Longitude) || 114.1 + Math.random() * 0.1,
    direction: sensor.Direction || 'N',
    speed: Math.round(speed),
    status
  }
}

// Get all traffic data
export const getTrafficData = async () => {
  if (trafficDataCache) return trafficDataCache
  
  const sensors = await getAllSensors()
  
  if (sensors.length > 0) {
    trafficDataCache = sensors
      .map((s, i) => simulateTraffic(s, i))
      .filter(s => !isNaN(s.lat) && !isNaN(s.lon))
    return trafficDataCache
  }
  
  return getFallbackTrafficData()
}

// Fallback traffic data
function getFallbackTrafficData() {
  const hour = new Date().getHours()
  const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)
  
  return [
    { id: 'T001', district: 'Southern', road_en: 'Aberdeen Praya Road', road_tc: '香港仔海旁道', lat: 22.2481, lon: 114.1525, direction: 'SE', speed: isRushHour ? 25 : 45, status: isRushHour ? 'congested' : 'moderate' },
    { id: 'T002', district: 'Wan Chai', road_en: 'Wong Nai Chung Gap Flyover', road_tc: '黃泥涌峽天橋', lat: 22.2719, lon: 114.1801, direction: 'NW', speed: isRushHour ? 20 : 55, status: isRushHour ? 'congested' : 'moderate' },
    { id: 'T003', district: 'Kowloon City', road_en: 'Hong Chong Road', road_tc: '康莊道', lat: 22.3041, lon: 114.1810, direction: 'E', speed: isRushHour ? 30 : 50, status: isRushHour ? 'congested' : 'moderate' },
    { id: 'T004', district: 'Kowloon City', road_en: 'Waterloo Road', road_tc: '窩打老道', lat: 22.3244, lon: 114.1783, direction: 'N', speed: isRushHour ? 35 : 55, status: isRushHour ? 'congested' : 'moderate' },
    { id: 'T005', district: 'Kowloon City', road_en: 'Lion Rock Tunnel Road', road_tc: '獅子山隧道公路', lat: 22.3452, lon: 114.1813, direction: 'N', speed: isRushHour ? 15 : 40, status: 'congested' },
    { id: 'T006', district: 'Kwun Tong', road_en: 'Kwun Tong Bypass', road_tc: '觀塘繞道', lat: 22.3069, lon: 114.2331, direction: 'NW', speed: isRushHour ? 30 : 60, status: isRushHour ? 'congested' : 'moderate' },
    { id: 'T007', district: 'Yau Tsim Mong', road_en: 'West Kowloon Highway', road_tc: '西九龍公路', lat: 22.3078, lon: 114.1607, direction: 'N', speed: 80, status: 'smooth' },
    { id: 'T008', district: 'Eastern', road_en: 'Island Eastern Corridor', road_tc: '東區走廊', lat: 22.2933, lon: 114.1972, direction: 'E', speed: isRushHour ? 35 : 65, status: isRushHour ? 'congested' : 'moderate' },
    { id: 'T009', district: 'Islands', road_en: 'North Lantau Highway', road_tc: '北大嶼山公路', lat: 22.3276, lon: 114.0253, direction: 'W', speed: 90, status: 'smooth' },
    { id: 'T010', district: 'Tsuen Wan', road_en: 'Tuen Mun Road', road_tc: '屯門公路', lat: 22.3743, lon: 114.1030, direction: 'E', speed: isRushHour ? 25 : 50, status: isRushHour ? 'congested' : 'moderate' },
    { id: 'T011', district: 'Sha Tin', road_en: 'Tai Po Road', road_tc: '大埔公路', lat: 22.3820, lon: 114.1950, direction: 'N', speed: isRushHour ? 20 : 45, status: 'congested' },
    { id: 'T012', district: 'Yuen Long', road_en: 'Castle Peak Road', road_tc: '青山公路', lat: 22.4450, lon: 114.0350, direction: 'W', speed: isRushHour ? 30 : 55, status: isRushHour ? 'congested' : 'moderate' },
  ]
}

// Get traffic color
export const getTrafficColor = (speed) => {
  if (speed >= 60) return '#22c55e'
  if (speed >= 40) return '#eab308'
  return '#ef4444'
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
