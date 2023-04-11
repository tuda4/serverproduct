'use strict';

const StatusCode = {
    OK: 200,
    CREATED: 201,
}

const ResponseCode = {
    OK: 'Success',
    CREATED: 'Created',
}

class SuccessResponse {
    constructor({message, metadata, statusCode = StatusCode.OK,responseCode = ResponseCode.OK}) {
        this.message = message || responseCode
        this.metadata = metadata
        this.statusCode = statusCode
        this.responseCode = responseCode
    }

    send(res, headers = {}) {
        return res.status(this.statusCode).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({message, metadata}) {
        super({message, metadata})
    }
}

class Created extends SuccessResponse {
    constructor({message, metadata, statusCode = StatusCode.CREATED, responseCode = ResponseCode.CREATED}) {
        super({message, metadata, statusCode, responseCode})
    }
}

module.exports = {
    OK, 
    Created,
    SuccessResponse
}