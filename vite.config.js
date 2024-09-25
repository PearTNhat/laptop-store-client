import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import daisyui from 'daisyui'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), daisyui],
  resolve: {
    alias: [{ find: '~', replacement: '/src' }]
  }
})
