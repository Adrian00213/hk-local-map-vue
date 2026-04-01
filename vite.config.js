import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync, existsSync } from 'fs'

// Copy CSV files to dist/docs folder during build
const copyCsvFiles = () => ({
  name: 'copy-csv-files',
  closeBundle: () => {
    const csvSource = 'public/hk-local-map/data'
    const csvDest = 'docs/data'
    
    if (existsSync(csvSource)) {
      if (!existsSync(csvDest)) {
        mkdirSync(csvDest, { recursive: true })
      }
      
      const files = ['restaurants.csv', 'traffic_sensors.csv']
      files.forEach(file => {
        try {
          copyFileSync(`${csvSource}/${file}`, `${csvDest}/${file}`)
          console.log(`Copied ${file} to ${csvDest}`)
        } catch (e) {
          // File may not exist
        }
      })
    }
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyCsvFiles()],
  base: './',
  build: {
    outDir: 'docs',
    rollupOptions: {
      external: []
    }
  },
  assetsInclude: ['**/*.csv']
})
