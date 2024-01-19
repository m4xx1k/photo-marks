const db = require('../db/index')

const schema = new db.Schema({
	name: {
		type: String,
		default: '',
	},
	name_lowercase: {
		type: String,
		default: '',
	},
	url: {
		type: String,
		default: '',
	},
	type: {
		type: String,
		default: '',
	},
	imageWidth: {
		type: Number,
		default: 0,
	},
	imageHeight: {
		type: Number,
		default: 0,
	},
})

module.exports = db.model('Photo', schema)
