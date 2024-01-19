// const ApiError = require(`../errors/api.error`)
const settingsService = require('../services/settings.service')

class settingsController {
	async create(req, res, next) {
		try {
			const body = req.body

			const settings = await settingsService.create(body)

			return res.json(settings)
		} catch (e) {
			next(e)
		}
	}

	async findAll(req, res, next) {
		try {
			const settings = await settingsService.findAll()

			return res.json(settings)
		} catch (e) {
			next(e)
		}
	}

	async findById(req, res, next) {
		try {
			const { settings_id } = req.query

			if (!settings_id) {
			}

			const settings = await settingsService.findById(settings_id)

			return res.json(settings)
		} catch (e) {
			next(e)
		}
	}

	async updateById(req, res, next) {
		try {
			const data = req.body

			const settings = await settingsService.updateById({ id: data._id, data })

			return res.json(settings)
		} catch (e) {
			next(e)
		}
	}

	async deleteById(req, res, next) {
		try {
			const { settings_id } = req.body

			if (!settings_id) {
			}
			const settings = await settingsService.deleteById(settings_id)

			return res.json(settings)
		} catch (e) {
			next(e)
		}
	}
}

module.exports = new settingsController()
