const db = require('../db/index')

const schema = new db.Schema({
	x: {
		type: Number,
		default: 0,
	},
	y: {
		type: Number,
		default: 0,
	},
	width: {
		type: Number,
		default: 0,
	},
	height: {
		type: Number,
		default: 0,
	},
	settings: {
		type: db.Schema.Types.ObjectId,
		ref: 'Settings',
		required: true,
	},
	photo: {
		type: db.Schema.Types.ObjectId,
		ref: 'Photo',
		required: true,
	},
	scaleX: {
		type: Number,
		default: 1,
	},
	scaleY: {
		type: Number,
		default: 1,
	},
})

module.exports = db.model('Mark', schema)
