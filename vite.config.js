/* eslint-disable no-undef */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import daisyui from 'daisyui'
import path from 'path';
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  // import.meta.env.VITE_NAME available here with: process.env.VITE_NAME
  // import.meta.env.VITE_PORT available here with: process.env.VITE_PORT

  return defineConfig({
    plugins: [react(), daisyui],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'), // Sử dụng path.resolve để đảm bảo đường dẫn chính xác
      },
    },
    server: {
      port: parseInt(process.env.VITE_PORT),
    },
  });
}