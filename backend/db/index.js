const mongoose = require('mongoose')

async function startDB() {
	mongoose.connection.once('open', () => {
		console.log('DB connected successfully')
	})

	// await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/`, {}).catch(e => {
	await mongoose.connect('mongodb://photo-marks-database/test', {}).catch(e => {
		console.log('DB connecting error: ', e)
	})
}

startDB()

module.exports = mongoose
