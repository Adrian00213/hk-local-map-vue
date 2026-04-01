import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync, existsSync, readdirSync } from 'fs'

// Copy data files to dist/docs folder during build
const copyDataFiles = () => ({
  name: 'copy-data-files',
  closeBundle: () => {
    const sourceDir = 'public/data'
    const destDir = 'docs/data'
    
    if (existsSync(sourceDir)) {
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true })
      }
      
      // Copy all files from public/data to docs/data
      const files = readdirSync(sourceDir)
      files.forEach(file => {
        try {
          copyFileSync(`${sourceDir}/${file}`, `${destDir}/${file}`)
          console.log(`Copied ${file} to ${destDir}`)
        } catch (e) {
          console.log(`Failed to copy ${file}: ${e.message}`)
        }
      })
    }
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyDataFiles()],
  base: './',
  build: {
    outDir: 'docs',
    rollupOptions: {
      external: []
    }
  },
  assetsInclude: ['**/*.csv', '**/*.json']
})
