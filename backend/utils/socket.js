require('dotenv').config();
const express = require("express");
const cors= require("cors");
const http  =  require("http");
const { Server } = require("socket.io");
const multer = require("multer");


const app = express(); 
app.use(cors());
app.use(express.json());
app.use( express.static('uploads') )

const server = http.createServer(app);
const io = new Server( server, {
	cors: "http://localhost:3000"
} );


const onlineUserMap = {  };

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/'); },
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname); }
});

const multer_upload = multer({ storage: storage });

module.exports = { app, io, onlineUserMap, server, multer_upload }