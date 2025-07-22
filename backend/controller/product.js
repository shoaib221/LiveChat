

const { Product, Order } = require( "../models/products.js" ); 
const express = require("express"); 
const { requireAuth } = require("./middlewire.js"); 
const { User } = require("../models/auth.js"); 


const CreateProduct = async ( req, res, next ) => { 
    console.log(req.body); 
    const { name, price } = req.body; 

    try { 
        
        const product = await Product.create({ name, price, availability:true, owner: req.user_id });
        // console.log("here"); 
        // console.log(product); 
        res.status(200).json( product ); 
    } catch (error) { 
        console.log(error.message);
        res.status(400).json( { error: error.message} ); 
    } finally { 
        next(); 
    } 
}


const fetchProduct = async ( req, res, next ) => {
    console.log("fetch product");
    try {
        const products = await Product.find({owner : req.user_id});
        let restaurants = await User.find({});
        restaurants = restaurants.filter( x=> {
            if( req.user_id.toString() === x._id.toString() ) return 0;
            return 1;
        } );
        res.status(200).json( {products, restaurants} );
    } catch (error) {
        res.status(400).json( { error: error.message } );
    } finally {
        next();
    }
}


const deleteProduct = async ( req, res, next ) => {
    
    const {_id} = req.body;

    console.log(_id);
    
    try {
        const ret = await Product.deleteOne({ _id });
        res.status(200).json(ret);
    } catch (error) {
        res.status(400).json( { error: error.message } );
        console.log(error.message);
    }

    next();
}


const RestautrantMenu = async ( req, res, next ) => {
    
    try {
        const { restaurant_id } = req.body;
        let products = await Product.find( { owner: restaurant_id } );
        let restaurant = await User.findOne( { _id: restaurant_id } );
        res.status(200).json( { products, restaurant } );
        next();
    } catch (arror) {
        res.status(400).json( { error: arror.message } );
    }
}


const PlaceOrder = async ( req, res, next ) => {
    
    try {

        let { products, owner } = req.body;

        //console.log(owner,  products );

        let real_owner = await User.findOne({ username: owner });
        let real_buyer = await User.findOne({ _id: req.user_id });

        // console.log(real_owner);

        let new_order = {  
            owner: { _id: real_owner._id.toString(), username: real_owner.username },
            buyer: { _id: real_buyer._id.toString(), username: real_buyer.username },
            total_price: 0, 
            product_list: [], 
            when: new Date().toLocaleString()
        }

        products.map( x => {
            new_order.total_price += x.price * x.quantity;
            new_order.product_list.push( x );
        });

        console.log(new_order);
        const saved_order = await Order.create( new_order );
        res.status(200).json( saved_order );
        next();

    } catch (error) {
        console.log( error.message );
        res.status(400).json( { error: error.message } );
    }
    next();
}


const MyOrder = async ( req, res, next ) => {

    try {
        received_orders = await Order.find( { 'owner._id': req.user_id } );
        placed_orders = await Order.find( { 'buyer._id': req.user_id } );
        res.status(200).json( { received_orders, placed_orders } );
    }
    catch (err) {
        res.status(400).json( { error: err.message } );
    }
    next();
    
}




const productRouter = express.Router();
productRouter.use(requireAuth);
productRouter.get( "/fetch", fetchProduct );
productRouter.post( "/create", CreateProduct );
productRouter.post( "/delete", deleteProduct);
productRouter.post( "/restaurant-menu", RestautrantMenu );
productRouter.post( "/place-order", PlaceOrder );
productRouter.get( "/my-orders", MyOrder );

module.exports = { productRouter };

