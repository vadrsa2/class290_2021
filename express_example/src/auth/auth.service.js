const User = require('../users/user.entity');
const users = require('../users/users.service');
const { Unauthorized, Locked } = require('http-errors')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
    async validate(username, password) {
        const user = await User.findOne({ username });
        if (!user) {
            throw new Unauthorized();
        }
        else if(user.isLockedOut){
            throw new Locked("The user is locked!");
        }
        else if(!bcrypt.compareSync(password, user.password)){
            user.attempts = user.attempts + 1;
            if(user.attempts == (process.env.MAX_FAILED_LOGIN_ATTEMPTS || 3)){
                user.isLockedOut = true;
                user.save();
                throw new Locked("The user is locked!");
            }
            else{
                user.save();
                throw new Unauthorized();
            }
        }
        if(user.attempts > 0){
            user.attempts = 0;
            user.save();
        }
        return user;
    }

    async login(username, password) {
        const user = await this.validate(username, password);

        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })

        return token;
    }

    validateToken(token) {
        const obj = jwt.verify(token, process.env.JWT_SECRET, {
            ignoreExpiration: false
        })

        return { userId: obj.userId, username: obj.username };
    }
}

module.exports = new AuthService();