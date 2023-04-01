'use strict';

const mongoose = require('mongoose')
const {checkConnectionMongo} = require('../helpers/check.mongo');
const {db : {host , port , name}} = require('../configs/config.mongo')
const connectString = `mongodb://${host}:${port}/${name}`

class DataBase {
    constructor() {
        this.connect()
    }
    connect() {
        // dev environments
        if(1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', {color: true})
        }

        mongoose.connect(connectString, {maxPoolSize: 100})
        .then( _ => {
            console.log(`Connected Mongodb is success`)
            checkConnectionMongo()
        })
        .catch(error => console.log(`Error connecting to`, error ))
    }
    static getInstance() {
        if(!DataBase.instance) {
            DataBase.instance = new DataBase
        }
        return DataBase.instance
    }
}

const instanceMongodb = DataBase.getInstance()

module.exports = instanceMongodb


