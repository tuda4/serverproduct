'use strict';

const accessService = require("../services/access.service");
const {OK, Created} = require("../core/success.response")
class AccessController {

    signUp = async(req, res, next) => {
     
        new Created({
            message: "Registered  successfully",
            metadata: await accessService.singUp(req.body)
        }).send(res)
    }
}

module.exports = new AccessController();