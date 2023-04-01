const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
// check number of connections

const checkConnectionMongo = () => {
    const countConnections = mongoose.connections.length
    console.log(`Have ${countConnections} connections to mongodb`)
}

// check overload 
const _CHECK_TIME = 5000
const checkOverloadMongo = () => {
    setInterval(() => {
        const numberOfConnections = mongoose.connections.length
        const numberOfCore = os.cpus().length  
        const memoryUsage = process.memoryUsage().rss
        // example maximum connection of your system
        console.log(`Memory usage: ${memoryUsage / 1024/1024}`)
        console.log(`number of cores: ${numberOfCore}`)
        const maximumConnections = numberOfCore * 3
        if(numberOfConnections > maximumConnections) {
            console.log(`Connected is overloaded`)
        }
    }, _CHECK_TIME)
}

module.exports ={
    checkConnectionMongo,
    checkOverloadMongo
}

