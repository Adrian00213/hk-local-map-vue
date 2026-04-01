#!/usr/bin/env node
/**
 * HK All Places Fetcher - Optimized Version
 * Quick but comprehensive coverage
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'AIzaSyDN-4Lx5sbdc6Dq226afApkINXQIhe42Dw';

// Strategic locations (major areas + surrounding)
const LOCATIONS = [
  // Hong Kong Island
  { lat: 22.2808, lng: 114.1588, area: 'Central' },
  { lat: 22.2760, lng: 114.1650, area: 'Wan Chai' },
  { lat: 22.2820, lng: 114.1850, area: 'Causeway Bay' },
  { lat: 22.2480, lng: 114.1800, area: 'Aberdeen' },
  { lat: 22.2360, lng: 114.1580, area: 'Stanley' },
  
  // Kowloon
  { lat: 22.2956, lng: 114.1720, area: 'Tsim Sha Tsui' },
  { lat: 22.3172, lng: 114.1686, area: 'Mong Kok' },
  { lat: 22.3080, lng: 114.1714, area: 'Yau Ma Tei' },
  { lat: 22.3230, lng: 114.1750, area: 'Sham Shui Po' },
  { lat: 22.3126, lng: 114.1850, area: 'Kowloon City' },
  { lat: 22.3136, lng: 114.2240, area: 'Kwun Tong' },
  { lat: 22.3336, lng: 114.2000, area: 'Wong Tai Sin' },
  
  // New Territories
  { lat: 22.3703, lng: 114.1160, area: 'Tsuen Wan' },
  { lat: 22.3916, lng: 113.9780, area: 'Tuen Mun' },
  { lat: 22.4493, lng: 114.0310, area: 'Yuen Long' },
  { lat: 22.3795, lng: 114.1880, area: 'Sha Tin' },
  { lat: 22.4433, lng: 114.1720, area: 'Tai Po' },
  { lat: 22.4939, lng: 114.1390, area: 'Sheung Shui' },
  { lat: 22.3159, lng: 114.2640, area: 'Sai Kung' },
  { lat: 22.2863, lng: 113.9433, area: 'Lantau' },
  
  // Sub-areas for dense coverage
  { lat: 22.2640, lng: 114.1750, area: 'Southern' },
  { lat: 22.2830, lng: 114.1450, area: 'Sheung Wan' },
  { lat: 22.3050, lng: 114.1700, area: 'Jordan' },
  { lat: 22.3200, lng: 114.1750, area: 'Prince Edward' },
  { lat: 22.3260, lng: 114.1900, area: 'Diamond Hill' },
  { lat: 22.3380, lng: 114.1550, area: 'Lai Chi Kok' },
  { lat: 22.3569, lng: 114.1320, area: 'Kwai Chung' },
  { lat: 22.4100, lng: 114.1950, area: 'Ma On Shan' },
  { lat: 22.3850, lng: 114.0950, area: 'Tuen Mun South' },
  { lat: 22.4150, lng: 114.0450, area: 'Yuen Long South' },
  { lat: 22.4450, lng: 114.1650, area: 'Sha Tin South' },
  { lat: 22.3700, lng: 114.2500, area: 'Tseung Kwan O' },
];

// Sub-locations (expanding each main area)
const SUB_LOCATIONS = [];
const OFFSETS = [
  { lat: 0, lng: 0 },
  { lat: 0.015, lng: 0 },
  { lat: -0.015, lng: 0 },
  { lat: 0, lng: 0.015 },
  { lat: 0, lng: -0.015 },
  { lat: 0.015, lng: 0.015 },
  { lat: -0.015, lng: -0.015 },
  { lat: 0.015, lng: -0.015 },
  { lat: -0.015, lng: 0.015 },
];

for (const loc of LOCATIONS) {
  for (const offset of OFFSETS) {
    SUB_LOCATIONS.push({
      lat: parseFloat((loc.lat + offset.lat).toFixed(4)),
      lng: parseFloat((loc.lng + offset.lng).toFixed(4)),
      area: loc.area
    });
  }
}

// Place types to search
const SEARCH_TYPES = [
  'restaurant',
  'cafe',
  'bar',
  'fast_food',
  'bakery',
  'food',
];

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      resolve({ status: 'timeout' });
    }, 10000);
    
    https.get(url, (res) => {
      clearTimeout(timeout);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { resolve({ status: 'error' }); }
      });
    }).on('error', (e) => {
      clearTimeout(timeout);
      resolve({ status: 'error' });
    });
  });
}

async function fetchPlacesForLocation(location, type) {
  const results = [];
  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=2000&type=${type}&key=${API_KEY}`;
    const data = await httpGet(url);
    
    if (data.results) {
      results.push(...data.results);
      
      // Only 1 page for speed
      if (data.next_page_token) {
        await new Promise(r => setTimeout(r, 2000));
        const pageUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${data.next_page_token}&key=${API_KEY}`;
        const pageData = await httpGet(pageUrl);
        if (pageData.results) {
          results.push(...pageData.results);
        }
      }
    }
  } catch (e) {
    // Silently fail
  }
  return results;
}

async function main() {
  console.log('🚀 HK All Places Fetcher');
  console.log(`📍 Base locations: ${LOCATIONS.length}`);
  console.log(`📍 Total with grid: ${SUB_LOCATIONS.length}`);
  console.log(`🍽️ Types: ${SEARCH_TYPES.join(', ')}`);
  console.log('');
  
  const allPlaces = new Map();
  const seenPlaceIds = new Set();
  
  const totalTasks = SUB_LOCATIONS.length * SEARCH_TYPES.length;
  let completed = 0;
  
  for (const location of SUB_LOCATIONS) {
    for (const type of SEARCH_TYPES) {
      completed++;
      
      if (completed % 50 === 0) {
        process.stdout.write(`\r[${completed}/${totalTasks}] Places: ${allPlaces.size}`);
      }
      
      const results = await fetchPlacesForLocation(location, type);
      
      for (const place of results) {
        if (!seenPlaceIds.has(place.place_id)) {
          seenPlaceIds.add(place.place_id);
          allPlaces.set(place.place_id, {
            placeId: place.place_id,
            name: place.name,
            address: place.vicinity || '',
            lat: place.geometry?.location?.lat,
            lng: place.geometry?.location?.lng,
            rating: place.rating || null,
            userRatingsTotal: place.user_ratings_total || 0,
            priceLevel: place.price_level || null,
            types: place.types || [],
            businessStatus: place.business_status || '',
            openNow: place.opening_hours?.open_now || null,
          });
        }
      }
      
      // Fast delay
      await new Promise(r => setTimeout(r, 300));
    }
    
    // Save progress
    if (completed % 200 === 0) {
      fs.writeFileSync(path.join(__dirname, 'hk_all_places_progress.json'), 
        JSON.stringify({ totalFound: allPlaces.size, places: Array.from(allPlaces.values()) }, null, 2));
    }
  }
  
  // Final save
  const finalData = {
    timestamp: new Date().toISOString(),
    source: 'Google Places API Extended',
    totalPlaces: allPlaces.size,
    places: Array.from(allPlaces.values())
  };
  
  const outputPath = path.join(__dirname, 'hk_all_places.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2));
  
  console.log(`\n\n✅ Done! Total: ${allPlaces.size} places`);
  console.log(`📁 Saved to: ${outputPath}`);
  
  // Type summary
  const typeCount = {};
  for (const place of allPlaces.values()) {
    for (const t of place.types || []) {
      typeCount[t] = (typeCount[t] || 0) + 1;
    }
  }
  console.log('\n📊 Top types:');
  Object.entries(typeCount).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([t, c]) => {
    console.log(`   ${t}: ${c}`);
  });
}

main().catch(console.error);
