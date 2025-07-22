

const express = require("express");
const { productRouter } = require("./controller/product.js");
const { workoutRouter } = require("./controller/workout.js");
const { authRouter } = require("./controller/auth.js");
const { chatRouter } = require("./controller/chat.js")  



const mainRouter = express.Router();

mainRouter.use( "/workout", workoutRouter );
mainRouter.use( "/product", productRouter );
mainRouter.use( "/auth", authRouter );
mainRouter.use( "/chat", chatRouter );

// mainRouter.use( "/chat", chatRouter );

module.exports = { mainRouter } ;

