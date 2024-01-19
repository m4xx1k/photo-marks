const ApiError = require(`../errors/api.error`)
const markService = require('../services/mark.service')

class markController {
	async create(req, res, next) {
		try {
			const data = req.body

			if (!data) {
				return next(ApiError.badRequest('missing settings_id or photo_id'))
			}

			const mark = await markService.create(data)

			return res.json(mark)
		} catch (e) {
			next(e)
		}
	}

	async findAll(req, res, next) {
		try {
			const mark = await markService.findAll()

			return res.json(mark)
		} catch (e) {
			next(e)
		}
	}

	async findById(req, res, next) {
		try {
			const { mark_id } = req.query

			if (!mark_id) {
				return next(ApiError.badRequest('missing mark_id'))
			}

			const mark = await markService.findById(mark_id)
			return res.json(mark)
		} catch (e) {
			next(e)
		}
	}

	async findByPhotoId(req, res, next) {
		try {
			const { photo_id } = req.query

			if (!photo_id) {
				return next(ApiError.badRequest('missing photo_id'))
			}
			const marks = await markService.findByPhotoId(photo_id)

			return res.json(marks)
		} catch (e) {
			next(e)
		}
	}

	async updateById(req, res, next) {
		try {
			const body = req.body

			const mark = await markService.updateById(body)

			return res.json(mark)
		} catch (e) {
			next(e)
		}
	}

	async deleteById(req, res, next) {
		try {
			const { id } = req.params

			if (!id) {
				return next(ApiError.badRequest('missing mark_id'))
			}
			const mark = await markService.deleteById(id)

			return res.json(mark)
		} catch (e) {
			next(e)
		}
	}
}

module.exports = new markController()
