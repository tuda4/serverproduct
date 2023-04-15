'use strict';

const accessService = require("../services/access.service");
const {OK, Created, SuccessResponse} = require("../core/success.response")
class AccessController {

    handlerRefreshToken = async (req, res, next) => {
        const metadata = await accessService.handlerRefreshToken({
          user: req.user,
          refreshToken: req.refreshToken,
          keyStore: req.keyStore
        });
        return new SuccessResponse({
          message: 'Refresh token successful',
          metadata
        }).send(res);
      }
      

    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'logout successfully',
            metadata: await accessService.logout(req.keyStore)
        }).send(res)
    }
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