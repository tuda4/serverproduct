'use strict';

const accessService = require("../services/access.service");
const {OK, Created, SuccessResponse} = require("../core/success.response")
class AccessController {
    login = async(req, res, next) => {
        new SuccessResponse({
            message: 'login successful',
            metadata: await accessService.login(req.body)
        }).send(res)
    }
    signUp = async(req, res, next) => {
     
        new Created({
            message: "Registered  successfully",
            metadata: await accessService.singUp(req.body)
        }).send(res)
    }
}

module.exports = new AccessController();