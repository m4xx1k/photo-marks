const Mark = require('../models/mark.model')
class markService {
	async create(data) {
		try {
			return await Mark.create(data)
		} catch (e) {
			console.log('error: ', e)
		}
	}

	async findAll() {
		try {
			return await Mark.find().populate('settings')
		} catch (e) {
			console.log('error: ', e)
		}
	}

	async findById(mark_id) {
		try {
			return await Mark.findById(mark_id).populate('settings')
		} catch (e) {
			console.log('error: ', e)
		}
	}

	async updateById(data) {
		try {
			return await Mark.findByIdAndUpdate(data._id, data)
		} catch (e) {
			console.log('error: ', e)
		}
	}

	async deleteById(mark_id) {
		try {
			return await Mark.findByIdAndDelete(mark_id)
		} catch (e) {
			console.log('error: ', e)
		}
	}

	async findByPhotoId(photo) {
		try {
			return await Mark.find({ photo }).populate('settings').lean()
		} catch (e) {
			console.log('error: ', e)
		}
	}
}
module.exports = new markService()
