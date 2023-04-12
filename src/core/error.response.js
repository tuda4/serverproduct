'use strict'

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409
}

const ResponseCode = {
    FORBIDDEN: 'Bad request error',
    CONFLICT: 'Conflict error' 
}

const {ReasonPhrases, StatusCodes} = require('../utils/httpStatusCode')

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ConflictErrorResponse extends ErrorResponse {
    constructor(message = ResponseCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}

class BadRequestErrorResponse extends ErrorResponse {
    constructor(message = ResponseCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}

class AuthenticationErrorResponse extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
        super(message, statusCode)
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
        super(message, statusCode)
    }
}

module.exports = {
    AuthenticationErrorResponse,
    ConflictErrorResponse, 
    BadRequestErrorResponse,
    NotFoundError
}