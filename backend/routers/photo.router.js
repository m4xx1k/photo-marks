const express = require('express')
const photoController = require('../controllers/photo.controller')
const multer = require('multer')
const path = require('path')

const router = new express()
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '..', 'photos'))
	},
	filename: function (req, file, cb) {
		// const suffix = file.originalname.split('.')[1]
		const suffix = file.mimetype.split('/')[1]
		console.log(suffix, file.originalname, file)
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
		cb(null, uniqueSuffix + '.' + suffix)
	},
})

const upload = multer({ storage: storage })

router.post('/create', upload.single('photo'), photoController.create)
router.get('/search', photoController.search)
router.get('/findAll', photoController.findAll)
router.get('/findById', photoController.findById)
router.delete('/deleteById', photoController.deleteById)
router.put('/updateById', photoController.updateById)

module.exports = router
