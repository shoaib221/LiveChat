
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({

    // unique - name & owner
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    availability : {
        type: Boolean,
        required: true
    },
    owner: {
        type: String,
        required: true
    }
});

const Product = mongoose.model('Product', ProductSchema);

const OrderSchema = new mongoose.Schema({
    owner: {
        _id : {
            type: String,
            required: true
        },
        username : {
            type: String,
            required: true
        }
    },
    buyer: {
        _id : {
            type: String,
            required: true
        },
        username : {
            type: String,
            required: true
        }
    },
    total_price: {
        type: Number,
        required: true
    },
    when: {
        type: String,
        required: true
    },
    product_list:[ {
        _id : {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    } ]
})

const Order = mongoose.model('Order', OrderSchema);

module.exports = { Product, Order };
