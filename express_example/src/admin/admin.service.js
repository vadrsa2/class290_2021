const { Forbidden } = require('http-errors');
const mongoose = require('mongoose');
const util = require('../commons/util');
const users = require('../users/users.service');

class AdminService {
    async unlockUser(loggedUser, id) {
        if (loggedUser.role !== util.ADMIN) {
            throw Forbidden('Not authorized!');
        }
        let user = await users.findOne(id);
        user.isLockedOut = false;
        user.attempts = 0;
        await user.save();
    }

    async lockUser(loggedUser, id) {
        if (loggedUser.role !== util.ADMIN) {
            throw Forbidden('Not authorized!');
        }
        let user = await users.findOne(id);
        user.isLockedOut = true;
        await user.save();
    }

}

module.exports = new AdminService();