const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const admin = require('./admin.service');

router.use(function timeLog (req, res, next) {
    console.log('Time: ', new Date());
    next();
})

router.patch('/unlock-user/:id/', asyncHandler(async (req, res) => {
    const {id} = req.params;
    await admin.unlockUser(req.user, id);
    res.json({"message": "User has successfully been unlocked!"})
}))

router.patch('/lock-user/:id/', asyncHandler(async (req, res) => {
    const {id} = req.params;
    await admin.lockUser(req.user, id);
    res.json({"message": "User has successfully been locked!"})
}))

module.exports = router;