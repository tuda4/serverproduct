'use strict';
const dev = {
    app:{ port: process.env.DEV_APP_PORT || 3000},
    db: {
        host : process.env.DEV_DB_HOST || '127.0.0.1',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'devDb'
    }
}

const product = {
    app: {
        port : process.env.PRO_APP_PORT || 3001
    },
    db: {
        host : process.env.PRO_DB_HOST || '127.0.0.1',
        port : process.env.PRO_DB_PORT || 27017,
        name: process.env.PRO_DB_NAME || 'productDb'
    }
}

const config = {dev, product}

const env = process.env.NODE_ENV || 'dev'

module.exports = config[env]