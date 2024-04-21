import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const isProduction = process.env.NODE_ENV === 'production';
export default defineConfig({
  plugins: [react()],
  define:{
    global: !isProduction ? {} : undefined,
  }
})
