const Settings = require('../models/settings.model')
const Mark = require('../models/mark.model')
class settingsService {
	async create(data) {
		try {
			return await Settings.create(data)
		} catch (e) {
			console.log('error: ', e)
		}
	}

	async findAll() {
		try {
			return await Settings.find()
		} catch (e) {
			console.log('error: ', e)
		}
	}

	async findById(settings_id) {
		try {
			return await Settings.findById(settings_id)
		} catch (e) {
			console.log('error: ', e)
		}
	}

	async updateById({ id, data }) {
		try {
			return Settings.findByIdAndUpdate(id, data, { new: true })
		} catch (e) {
			console.log('error: ', e)
		}
	}

	async deleteById(settings_id) {
		try {
			const settings = await Settings.findByIdAndDelete(settings_id)
			const marks = await Mark.deleteMany({ settings: settings_id })

			return settings
		} catch (e) {
			console.log('error: ', e)
		}
	}
}
module.exports = new settingsService()
