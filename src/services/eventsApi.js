// Hong Kong Government Events API
// Source: https://ogcef.one.gov.hk/event-api/eventList

const BASE_URL = 'https://ogcef.one.gov.hk/event-api'

// Fetch all events
export async function getAllEvents() {
  try {
    const response = await fetch(`${BASE_URL}/eventList`)
    const data = await response.json()
    return data.filter(e => e.event_status === 'A') // Only active events
  } catch (error) {
    console.error('Failed to fetch events:', error)
    return []
  }
}

// Get event by ID
export async function getEventById(eventId) {
  try {
    const response = await fetch(`${BASE_URL}/eventList`)
    const data = await response.json()
    return data.find(e => e.event_id === eventId)
  } catch (error) {
    console.error('Failed to fetch event:', error)
    return null
  }
}

// Get events by organization
export async function getEventsByOrg(org) {
  const all = await getAllEvents()
  return all.filter(e => e.event_org.includes(org))
}

// Format event date
export function formatEventDate(dateStr) {
  if (!dateStr) return '日期待定'
  
  // Parse the complex date format
  const parts = dateStr.split('\n').filter(p => p.trim())
  if (parts.length === 0) return '日期待定'
  
  // Get first date and time
  const firstPart = parts[0]
  const timeMatch = firstPart.match(/(\d{2}:\d{2})-(\d{2}:\d{2})/)
  
  if (timeMatch) {
    return `${timeMatch[1]} - ${timeMatch[2]}`
  }
  
  return firstPart
}

// Parse multiple dates
export function parseEventDates(dateStr) {
  if (!dateStr) return []
  
  const lines = dateStr.split('\n').filter(p => p.trim())
  const dates = []
  
  for (const line of lines) {
    // Match date patterns like "2026 Apr 01(Wed)"
    const match = line.match(/(\d{4})\s+(\w+)\s+(\d{2})\((\w+)\)/)
    if (match) {
      dates.push({
        year: match[1],
        month: match[2],
        day: match[3],
        weekday: match[4]
      })
    }
  }
  
  return dates
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
  
  if (orgLower.includes('hospital') || orgLower.includes('medical') || orgLower.includes('clinic')) {
    return '醫療健康'
  }
  if (orgLower.includes('school') || orgLower.includes('college') || orgLower.includes('university') || orgLower.includes('education')) {
    return '教育'
  }
  if (orgLower.includes('cultural') || orgLower.includes('museum') || orgLower.includes('art')) {
    return '文化藝術'
  }
  if (orgLower.includes('sport') || orgLower.includes('leisure') || orgLower.includes('recreation')) {
    return '康體'
  }
  if (orgLower.includes('social') || orgLower.includes('community') || orgLower.includes('caritas') || orgLower.includes(' welfare')) {
    return '社福'
  }
  if (orgLower.includes('gov') || orgLower.includes('district') || orgLower.includes('home affairs')) {
    return '政府'
  }
  
  return '其他'
}
