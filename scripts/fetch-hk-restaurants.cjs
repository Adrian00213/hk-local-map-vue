#!/usr/bin/env node
/**
 * HK Restaurant Data Fetcher - Optimized Version
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'AIzaSyDN-4Lx5sbdc6Dq226afApkINXQIhe42Dw';

// HK Grid locations
const LOCATIONS = [
  { lat: 22.2808, lng: 114.1588, district: '中西區' },
  { lat: 22.2839, lng: 114.2200, district: '東區' },
  { lat: 22.2456, lng: 114.1620, district: '南區' },
  { lat: 22.2783, lng: 114.1747, district: '灣仔' },
  { lat: 22.3126, lng: 114.1850, district: '九龍城' },
  { lat: 22.3136, lng: 114.2240, district: '觀塘' },
  { lat: 22.3308, lng: 114.1630, district: '深水埗' },
  { lat: 22.3336, lng: 114.2000, district: '黃大仙' },
  { lat: 22.2956, lng: 114.1720, district: '油尖旺' },
  { lat: 22.2863, lng: 113.9433, district: '離島' },
  { lat: 22.3569, lng: 114.1320, district: '葵青' },
  { lat: 22.4939, lng: 114.1390, district: '北區' },
  { lat: 22.3159, lng: 114.2640, district: '西頁' },
  { lat: 22.3795, lng: 114.1880, district: '沙田' },
  { lat: 22.4433, lng: 114.1720, district: '大埔' },
  { lat: 22.3703, lng: 114.1160, district: '荃灣' },
  { lat: 22.3916, lng: 113.9780, district: '屯門' },
  { lat: 22.4493, lng: 114.0310, district: '元朗' },
];

function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function fetchRestaurants(location) {
  const results = [];
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=3000&type=restaurant&key=${API_KEY}`;
  
  try {
    const data = await httpGet(url);
    if (data.results) {
      results.push(...data.results);
      
      // Get more pages
      let nextToken = data.next_page_token;
      let page = 1;
      while (nextToken && page < 3) {
        await new Promise(r => setTimeout(r, 2000));
        const pageUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${nextToken}&key=${API_KEY}`;
        const pageData = await httpGet(pageUrl);
        if (pageData.results) {
          results.push(...pageData.results);
          nextToken = pageData.next_page_token;
        } else {
          break;
        }
        page++;
      }
    }
  } catch (e) {
    console.error(`Error: ${e.message}`);
  }
  
  return results;
}

async function main() {
  console.log('🍜 Starting HK Restaurant Fetcher...\n');
  
  const allRestaurants = new Map();
  
  for (let i = 0; i < LOCATIONS.length; i++) {
    const loc = LOCATIONS[i];
    console.log(`[${i+1}/${LOCATIONS.length}] ${loc.district}...`);
    
    const results = await fetchRestaurants(loc);
    console.log(`   Found ${results.length} restaurants`);
    
    for (const r of results) {
      if (!allRestaurants.has(r.place_id)) {
        allRestaurants.set(r.place_id, {
          name: r.name,
          address: r.vicinity,
          lat: r.geometry.location.lat,
          lng: r.geometry.location.lng,
          rating: r.rating,
          userRatingsTotal: r.user_ratings_total,
          priceLevel: r.price_level,
          district: loc.district,
          placeId: r.place_id,
          types: r.types,
          openNow: r.opening_hours?.open_now,
        });
      }
    }
    
    // Save progress
    const progress = {
      timestamp: new Date().toISOString(),
      total: allRestaurants.size,
      restaurants: Array.from(allRestaurants.values())
    };
    fs.writeFileSync(path.join(__dirname, 'restaurants_partial.json'), JSON.stringify(progress, null, 2));
    
    // Delay between requests
    await new Promise(r => setTimeout(r, 1000));
  }
  
  // Final save
  const finalData = {
    timestamp: new Date().toISOString(),
    source: 'Google Places API',
    total: allRestaurants.size,
    restaurants: Array.from(allRestaurants.values())
  };
  
  fs.writeFileSync(path.join(__dirname, 'hk_restaurants.json'), JSON.stringify(finalData, null, 2));
  
  console.log(`\n✅ Done! Total: ${allRestaurants.size} restaurants`);
  console.log(`📁 Saved to: hk_restaurants.json`);
}

main().catch(console.error);
