'use strict';

const _ = require('lodash')

const getData = ({fields = [], object = {}}) => {
    return _.pick(object, fields)
}

const getSelectedData = (select = []) => {
    return Object.fromEntries(select.map(el => [el , 1]))
}

const getUnSelectedData = (select = []) => {
    return Object.fromEntries(select.map(el => [el , 0]))
}

module.exports = {
    getData,
    getSelectedData,
    getUnSelectedData
}