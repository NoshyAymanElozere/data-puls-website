import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: '/hirz/',
  plugins: [
    react(),
    {
      name: 'redirect-root-to-base',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/' || req.url === '' || req.url === '/hirz') {
            res.writeHead(302, { Location: '/hirz/' })
            res.end()
            return
          }
          next()
        })
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/storage': {
        target: 'https://herz-dashboard.am.prompita.com',
        changeOrigin: true,
      },
    },
  },
})
