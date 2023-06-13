const express = require('express');
const router = express.Router();
const configRoute = require('./configRoute');
const languagesRoute = require('./languagesRoute');
const translationRoute = require('./translationRoute');
const currencyRoute = require('./currencyRoute');
const userRoute = require('./userRoute');
const transferRoute = require('./transferRoute');
const notifyRoute = require('./notifyRoute');
const coinsRoute = require('./coinsRoute');
const applicationRoute = require('./applicationRoute');
const categoryRoute = require('./categoryRoute');
const agentRoute = require('./agentRoute');

router.use('/coins', coinsRoute);
router.use('/config', configRoute);
router.use('/language', languagesRoute);
router.use('/translation', translationRoute);
router.use('/currency', currencyRoute);
router.use('/user', userRoute);
router.use('/transfer', transferRoute);
router.use('/notify', notifyRoute);
router.use('/application', applicationRoute);
router.use('/category', categoryRoute);
router.use('/agent', agentRoute);

module.exports = router;
