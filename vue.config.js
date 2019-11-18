module.exports = {
	devServer: {
		// https: true,
		proxy: {
			'/api': {
				// target: 'http://122.114.95.115:8091',
				// target: 'http://122.114.0.88:8093',
				target: 'http://localhost:4270',
				// target: 'http://192.168.101.253:8080', // mxy
				// ws: true,
				// changeOrigin: true
			}
		}
	}
}
