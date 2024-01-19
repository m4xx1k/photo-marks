require('dotenv').config()
const express = require('express')
const router = require('./routers/index')
const cors = require('cors')
const app = new express(),
	PORT = 5000 || process.env.PORT

app.use(express.json())
app.use('/api', express.static(__dirname + '/photos'))
app.use(
	cors({
		origin: [
			'http://localhost:5173',
			'https://t8vb4v36-5173.euw.devtunnels.ms',
			'http://localhost:3000',
			'http://127.0.0.1:3000',
			'http://photo-marks-frontend:3000',
			'http://photo-marks-frontend:3000',
			'http://frontend:3000',
			'http://84.247.167.199',
		],
	})
)
app.use('/api', router)
const Start = () => {
	app.listen(PORT, () => {
		console.log('Server start on port:', PORT)
	})
}

Start()
