'use strict';

const {model, Schema, Types} = require('mongoose');

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

const orderSchema = new Schema({
    orderUserId: {type: String, required: true},
     /**
     * @type {Object = {
     * @totalPrice,
     * @totalApplyDiscount,
     * @freeShip
     * }} orderCheckout
     */
    orderCheckout: {type: Object, default: {}},
    /**
     * @type {Object={
     * @street, 
     * @city,
     * @state,
     * @country,
     * }} => location
     */
    orderShipping: {type: Object, default: {}},
    orderProducts: {type: Array, required: true},
    orderTrackingNumber: {type: String, required: true}, // contact with shipping unit
    orderStatus: {type: String, required: true, enum: ['PENDING', 'CONFIRMED', 'CANCELED', 'SHIPPED' ,'SUCCESSFUL'], default: 'PENDING'},
    orderPayment: {type: Object, required: true, default: {}}
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, orderSchema)