import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

const IS_DEV = true

export default defineConfig({
	mode: IS_DEV ? 'development' : undefined,

	base: './',

	plugins: [solid({ hot: false })],

	server: {
		port: 8080,
	},
})
