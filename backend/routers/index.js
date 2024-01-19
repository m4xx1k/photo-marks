const express = require('express');
const photoRouter = require('./photo.router')
const markRouter = require('./mark.router')
const settingsRouter = require('./settings.router')

const router = new express();

router.use('/photo', photoRouter)
router.use('/mark', markRouter)
router.use('/settings', settingsRouter)

module.exports = router
