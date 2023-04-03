'use strict'

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409
}

const ResponseCode = {
    FORBIDDEN: 'Bad request error',
    CONFLICT: 'Conflict error' 
}

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

module.exports = {
    ConflictErrorResponse, 
    BadRequestErrorResponse
}