require('dotenv').config()
const express = require('express');
const compression = require('compression');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();
const {app : {port}} = require('./src/configs/config.mongo')
// init middleware
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// init db
require('./src/db/init.mongo')
// const {checkOverloadMongo} = require('./src/helpers/check.mongo')
// checkOverloadMongo()
// init routes
app.use('/', require('./src/routes'))

// handle errors

app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500  
    return res.status(statusCode).json({
        status: 'Error',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal Server Error'
    })
})

const PORT = port || 3001
const server = app.listen(PORT, () => {
    console.log(`WSV eCommerce started on http://localhost:${PORT}`);
});

process.on('SIGINT', () =>{
    server.close(() => {console.log(`WSV eCommerce stopped`);});
})