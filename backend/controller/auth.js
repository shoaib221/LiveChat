

const { User } = require( "../models/auth.js" );
const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const validaor = require( "validator" );
const jwt = require("jsonwebtoken");
const { requireAuth } = require("./middlewire.js");
const { oauth2Client } = require("../utils/googleClient.js");
const axios = require("axios");
const { multer_upload } = require("../utils/socket.js")


authRouter.get("/test",  ( req, res, next ) => {
    
    res.status(200).json({ "msg": "ok" });
    next();
});

const createToken = (_id, username)  => {
    return jwt.sign( {_id, username}, process.env.JWT_SECRET, { expiresIn: "1d" }  );
}

async function hashy( pass ) {
    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash( pass, salt );
    return hashpass;
}


function checkEmail ( email )
{
    if(!validaor.isEmail(email))
        throw Error("This is not a valid email");
    return true;
}


const Register = async ( req, response, nect ) => {

    const {email, password} = req.body;

    try {
        const exist = await User.findOne({ username: email });
        if( exist ) throw Error("Email already exists");
        const hashedpassword = await hashy(password);
        const user = await User.create({ username: email, password: hashedpassword });
        const token = createToken(user._id);
        response.status(200).json({email, token});
    } catch (error) {
        response.status(400).json({error: error.message})
    } 
}


const Login = async ( request, response, next ) => {
    const { email, password } = request.body;
    
    try {
        const user = await User.findOne({ username : email });
        if (!user) throw Error('Incorrect email');

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw Error('Incorrect password');

        const token = createToken(user._id);
        response.status(200).json({email, token});
    
        
    } catch (error) {
        response.status(400).json({error: error.message}); 
    }
}

const Init = (req, res, next) =>
{
    res.status(200).json( {message: "OK"} );
    console.log( "backend init" );
    next();
}

const GoogleLogin = async ( req, res, next ) => {
    console.log( "google login" );

    try {

        const { code } = req.query;
        const googleRes= await oauth2Client.getToken(code);
        oauth2Client.setCredentials(googleRes.tokens);
        
        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );
        
        const { email, name } = userRes.data;
        
        
        let user = await User.findOne({ username: email });
        const dummy = await hashy(process.env.DUMMY_PASS);
        if (!user) user = await User.create({ username: email, password: dummy });
        
        
        const token = createToken(user._id, user.username);
        
        res.status(200).json({ token,  email });
        
        
    } catch (err) {
        console.log("there", new Date().toLocaleString());
        
        res.status(400).json( {error: err.message} );
    } 
    
}

const Profile = async ( req, res, next  ) => {

    try {
        const response = await User.findOne( { username: req.username } )
        res.status(200).json( response )
    } catch (err) {
        res.status(400).json( { error: err.message } );
    }
}

const UpdateProfile = async ( req, res, next ) => {

    try {   
        console.log( req.body );
		console.log( req.file );
		
		let url = "http://localhost:4000/"+req.file.filename;

        await User.updateOne( { username: req.username }, { $set: { 
            name: req.body.name,
            description: req.body.description,
            photo: url
         } } )

        const saved_user = await User.findOne( { username: req.username } )

        res.status(200).json( saved_user )

    } catch(err) {
        res.status(400).json({ error: err.message })
    }
}

authRouter.post( "/register", Register );
authRouter.post( "/login", Login);
authRouter.get( "/google", GoogleLogin );
authRouter.use( requireAuth );
authRouter.get( "/init", Init );
authRouter.get( "/profile", Profile );
authRouter.patch( "/profile", multer_upload.single('photo'), UpdateProfile )


module.exports = { authRouter };