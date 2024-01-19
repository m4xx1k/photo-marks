const Photo = require('../models/photo.model')
const Mark = require('../models/mark.model')
const fs = require('fs')
const ApiError = require('../errors/api.error')
class photoService {
	async create(name, url, type, imageWidth, imageHeight) {
		try {
			const name_lowercase = name.toLowerCase()
			return await Photo.create({
				name,
				name_lowercase,
				url,
				type,
				imageWidth,
				imageHeight,
			})
		} catch (e) {
			console.log('error: ', e)
		}
	}

	async search(text, filter) {
		try {
			text = text.toLowerCase()
			const photos = await Photo.find({
				name_lowercase: {
					$regex: text,
				},
			})
			if (filter !== 'false' && filter !== 'true') {
				return photos
			}

			let photo_filter = []
			for (let key in photos) {
				const mark = await Mark.findOne({ photo_id: photos[key]._id })
				if (mark === null && filter === 'false') {
					photo_filter.push(photos[key])
				} else if (mark !== null && filter === 'true') {
					photo_filter.push(photos[key])
				}
			}

			return photo_filter
		} catch (e) {
			console.log('error: ', e)
		}
	}

	async findAll() {
		return await Photo.find({}).lean()
	}

	async findById(photo_id) {
		try {
			return await Photo.findById(photo_id)
		} catch (e) {
			console.log('error: ', e)
		}
	}

	async deleteById(photo_id) {
		try {
			const photo = await Photo.findByIdAndDelete(photo_id)
			const mark = await Mark.deleteMany({ photo_id })

			const filePath = 'photos/' + photo.url

			fs.unlink(filePath, err => {
				if (err) {
					console.error(err.message)
					ApiError.internal('Error deleting file')
				} else {
				}
			})

			return photo
		} catch (e) {
			console.log('error: ', e)
		}
	}

	async updateById(photo_id, name) {
		try {
			const name_lowercase = name.toLowerCase()
			await Photo.updateOne({ _id: photo_id }, { name, name_lowercase })
			return await Photo.findById(photo_id)
		} catch (e) {
			console.log('error: ', e)
		}
	}
}
module.exports = new photoService()
