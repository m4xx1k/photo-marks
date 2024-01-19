const db = require('../db/index')

const schema = new db.Schema({
	name: {
		type: String,
		default: '',
	},
	color: {
		type: String,
		default: '',
	},
	// hex: {
	// 	type: String,
	// 	default: '',
	// },
	// fill: {
	// 	type: String,
	// 	default: '',
	// },
	// stroke: {
	// 	type: String,
	// 	default: '',
	// },
	// opacity: {
	// 	type: Number,
	// 	default: 0,
	// },
	key: {
		type: String,
		default: '',
	},
	default: {
		type: Boolean,
		default: false,
	},
})

module.exports = db.model('Settings', schema)
