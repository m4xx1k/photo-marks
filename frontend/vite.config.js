import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	preview: {
		port: 3000,
		strictPort: true,
	},
	server: {
		host: true,
		port: 5173, // This is the port which we will use in docker
		// Thanks @sergiomoura for the window fix
		// add the next lines if you're using windows and hot reload doesn't work
		watch: {
			usePolling: true,
		},
	},
})
