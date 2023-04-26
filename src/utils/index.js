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

const removeInvalidObjects = (object) => {
    Object.keys(object).forEach(key => {
        if(object[key] == null) {
            delete object[key]
        }
    })
    return object
}

const updateNestedObjects = (object) => {
    const result = {}
    Object.keys(object || {}).forEach(key => {
        if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
            const response = updateNestedObjects(object[key])
            Object.keys(response || {}).forEach(child => {
                result[`${key}.${child}`] = response[child]
            })
        } else {
            result[key] = object[key]
         }
    })
    return result
}

module.exports = {
    getData,
    getSelectedData,
    getUnSelectedData,
    removeInvalidObjects,
    updateNestedObjects
}