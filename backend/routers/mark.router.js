const express = require('express')
const markController = require('../controllers/mark.controller')

const router = new express()

router.post('/create', markController.create)
router.get('/findAll', markController.findAll)
router.get('/findById', markController.findById)
router.get('/findByPhotoId', markController.findByPhotoId)
router.put('/updateById', markController.updateById)
router.delete('/:id', markController.deleteById)

module.exports = router
