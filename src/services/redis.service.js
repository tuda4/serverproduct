'use strict';

const redis = require('redis')
const {promisify} = require('util') // convert func callback => func promise 
const {reservationInventory} = require('../models/reposistories/inventory.repo')

const redisClient = redis.createClient()

const pExpire = promisify(redisClient.pExpire).bind(redisClient) // create a expire key 
const setnxAsync = promisify(redisClient.setnx).bind(redisClient) // set if not exist (set up pessimistic locking )

const acquireKeyLock = async (productId, quantity, cartId) => {
    const key = `key_lock_v1_${productId}`
    const retryCount = 10;
    const expireTime = 5000;

    for (let i = 0; i < retryCount; i++) {
        const result = await setnxAsync(key, expireTime)
        console.log({result})
        if(result === 1) {
            // handle action with inventory product
            const isReservation = await reservationInventory({productId, quantity, cartId})
            if(isReservation.modifiedCount) {
                await pExpire(key, expireTime)
                return key
            }
            return null
        }  else {
            await new Promise((resolve, reject) => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async (keyLock) => {
    const deleteAsyncKeyLock = promisify(redisClient.del).bind(redisClient)
    return await deleteAsyncKeyLock(keyLock)
}

module.exports = {
    acquireKeyLock,
    releaseLock
}