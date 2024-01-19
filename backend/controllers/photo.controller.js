const ApiError = require(`../errors/api.error`)
const photoService = require('../services/photo.service')

class photoController {
	async create(req, res, next) {
		try {
			console.log(1)
			const photo = req.file
			const { imageWidth, imageHeight, name } = req.body
			if (!photo) {
				return next(ApiError.badRequest('missing photo'))
			}

			const url = photo.filename,
				type = photo.mimetype

			const response = await photoService.create(
				name,
				url,
				type,
				imageWidth,
				imageHeight
			)

			return res.json(response)
		} catch (e) {
			console.log(e)
			next(e)
		}
	}

	async search(req, res, next) {
		try {
			let { text, filter } = req.query
			text = text || ''
			if (text.length < 2) {
				text = ''
			}
			const photos = await photoService.search(text, filter)
			return res.json(photos)
		} catch (e) {
			next(e)
		}
	}
	async findAll(req, res, next) {
		try {
			const photos = await photoService.findAll()

			return res.json(photos)
		} catch (e) {
			next(e)
		}
	}

	async findById(req, res, next) {
		try {
			let { photo_id } = req.query

			if (!photo_id) {
				return next(ApiError.badRequest('missing photo_id'))
			}

			const photos = await photoService.findById(photo_id)

			return res.json(photos)
		} catch (e) {
			next(e)
		}
	}

	async deleteById(req, res, next) {
		try {
			let { photo_id } = req.body

			if (!photo_id) {
				return next(ApiError.badRequest('missing photo_id'))
			}

			const photo = await photoService.deleteById(photo_id)

			return res.json(photo)
		} catch (e) {
			next(e)
		}
	}

	async updateById(req, res, next) {
		try {
			let { photo_id, name } = req.body

			if (!photo_id || !name) {
				return next(ApiError.badRequest('missing photo_id or name'))
			}

			const photo = await photoService.updateById(photo_id, name)

			return res.json(photo)
		} catch (e) {
			next(e)
		}
	}
}

module.exports = new photoController()
