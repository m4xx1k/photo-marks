const express = require('express');
const settingsController = require('../controllers/settings.controller')

const router = new express();

router.post('/create', settingsController.create)
router.get('/findAll', settingsController.findAll)
router.get('/findById', settingsController.findById)
router.put('/updateById', settingsController.updateById)
router.delete('/deleteById', settingsController.deleteById)

module.exports = router
