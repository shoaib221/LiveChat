//console.log("controller");


const express = require("express");
const chatRouter = express.Router();
const bcrypt = require("bcrypt");
const validaor = require( "validator" );
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { User } = require( "../models/auth.js" );
const { requireAuth } = require("./middlewire.js");
const { oauth2Client } = require("../utils/googleClient.js");
const { onlineUserMap, io, multer_upload }  = require("../utils/socket.js");
const { Message, Group, GroupMessage, GroupMembers } = require("../models/chat.js");
const { cloudinary } = require("../utils/cloudinary.js");
const { use } = require("react");
const fetch = require("node-fetch");



//console.log( "controller", onlineUserMap);


const fetchMessage  = async ( req, res, next ) => {
	console.log("fetch message");


	try {
		const {receiver} = req.body;
		const sender = req.username;

		console.log( sender, receiver );
		const messages = await Message.find({
			$or: [
				{ receiver: receiver, sender: sender },
				{ receiver: sender, sender: receiver },
			],
		});

		//console.log(messages);

		res.status(200).json( messages );
		next();
	} catch (error) {
		res.status(400).json({ error: error.message  });
	}
}


const sendMessage = async ( req, res, next ) => {
	console.log( "send message" );
	//console.log(onlineUserMap)

	try {
		const { receiver, text } = req.body;

		const new_message = new Message({
			sender: req.username,
			receiver : receiver,
			text : text
		})
		
		const saved_message = await new_message.save();
		console.log("here", saved_message);
		
		const receiver_socket_id = onlineUserMap[receiver]

		console.log( "receiver", receiver_socket_id )
		
		if( receiver_socket_id ) io.to( receiver_socket_id ).emit( "newMessage", saved_message );
		res.status(200).json(saved_message)
		next();
	} catch (err) {
		console.log(err.message);
		res.status(400).json( {error: err.message} );
	}
}


const FetchUsers = async ( req, res, next ) => {

	try {
		console.log( req.username )
		const users = await User.find( { username: { $ne: req.username } } )
		console.log( users )
		res.status(200).json( { users } )
		next()
	} catch (err) {
		res.status(400).json( { error: err.message } )
	}
}


const UploadImageClodianry = async ( req, res, next ) => {
	console.log( "upload image" )
	try {
		const { image } = req.body;
		if(!image) throw Error( "image not found" )
		const response = await cloudinary.uploader.upload(image)
		console.log( response.secure_url )
		await User.updateOne( { username: req.username }, { image: response.secure_url }  )
		const user =await User.findOne( { username: req.username } )
		console.log(user)
		res.status(200).json({ user })
	} catch (err) {
		console.log("error", err.error)
		res.status(400).json( { error: err.error } )
		
	} finally {
		next();
	}
}


const ReceiveFormData = async ( req, res, next ) => {
	try {
	console.log( req.body );
	console.log( req.file );
	res.status(200).json( { "msg": "ok" } );
	} catch (err) {
		res.status(400).json( { error: err.message } )
	}
}

const FormToCloud = async ( req, res, next ) => {
	try {
		console.log( req.body );
		console.log( req.file );
		
		let url = "http://localhost:4000/"+req.file.filename;
		
		
		res.status(200).json( { "url": url } );
	} catch (err) {
		console.log("error", err)
		res.status(400).json( { error: err.message } )
	}
}

const createGroup = async (req, res, next) => {
	console.log("create group")
	try
	{
		const { newGroup } = req.body
		console.log(newGroup)

		const new_group  =  new Group({
			admin: req.username,
			name: newGroup,
		})

		const saved_group = await new_group.save();

		const me = await User.findOne( { username : req.username } )

		const new_member = new GroupMembers({
			group_id: saved_group._id,
			group_name: saved_group.name,
			member: req.username,
			photo: me.photo,
			admin: req.username
		})

		const saved_member = await new_member.save();

		res.status(200).json( saved_member )
	} catch (err) {
		res.status(400).json( { error: err.message } )
	}
}


const FetchGroups = async ( req, res, next  ) => {

	try {
		const groups = await GroupMembers.find( { member: req.username } )
		console.log(groups)
		res.status(200).json( groups )
	} catch(err) {
		res.status(400).json( { error: err.message } )
	}
}


const AddToGroup = async ( req, res, next  ) => {
	console.log("add to group")
	try {
		const { new_member, group_name } = req.body
		console.log( new_member, group_name )

		const group = await Group.findOne({ name: group_name, admin: req.username })
		const nmember = await User.findOne( { username: new_member } )
		const new_data = new GroupMembers({
			group_id: group._id,
			group_name: group.name,
			member: new_member,
			photo: nmember.photo,
			admin: req.username
		})

		const saved_data = await new_data.save()
		
		res.status(200).json( saved_data )
	} catch(err) {
		res.status(400).json( { error: err.message } )
		console.log( err )
	}
}

const DeleteFromGroup = async ( req, res, next ) => {

	try {
		const { group_id, member } = req.body
		await GroupMembers.deleteOne({ group_id, member })
		res.status(200).json( "ok" )
	} catch (err) {
		res.status(400).json( {error: err.message} )
	}
	finally {
		next()
	}
}


const FetchGroupMembers = async ( req, res, next ) => {
	console.log("fetch members")
	try {
		const { group_id, member } = req.body
		const data = await GroupMembers.find({ group_id })
		console.log(data)
		res.status(200).json(data)
	} catch(err) {
		res.status(200).json({ error: err.message })
	}
}

const DeleteGroup = async (req, res, next) => {
	try {
		const { group_id } =req.body
		await Group.deleteOne( { _id: group_id } )
		await GroupMembers.deleteMany( { group_id } )
		await GroupMessage.deleteMany({ group_id })
		res.status(200).json("ok")
	} catch (err) {
		res.status(400).json({ error: err.message })
	}
}


const FetchGroupMessage =  async ( req, res, next ) => {

	try {
		const { group_id } = req.body
		const messages = await GroupMessage.find( { group_id } )
		console.log(messages)
		res.status(200).json( messages )
 	} catch (err) {
		res.status(400).json( { error: err.message } )
	}
}


chatRouter.use( requireAuth );
chatRouter.post( "/fetchmessage", fetchMessage);
chatRouter.post( "/sendmessage", sendMessage );
chatRouter.get( "/users", FetchUsers );
chatRouter.post( "/image", UploadImageClodianry );
chatRouter.post( "/formdata", multer_upload.single('photo'), ReceiveFormData );
chatRouter.post( '/formtocloud', multer_upload.single('photo'), FormToCloud );
chatRouter.post( "/creategroup", createGroup  );
chatRouter.get( "/fetchgroups", FetchGroups );
chatRouter.post( "/addtogroup", AddToGroup );
chatRouter.post( "/fetchgroupmembers", FetchGroupMembers );
chatRouter.post( "/deletemember", DeleteFromGroup );
chatRouter.post( "/deletegroup", DeleteGroup)
chatRouter.post( "/fetchgroupmessage", FetchGroupMessage )



module.exports = { chatRouter };


/*


const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({

	sender: {
		type: String,
		required: true,
	},
	receiver: {
		type: String,
		required: true,
	},
	text: {
		type: String
	},
	media: {
		type: String
	}
	
}, { timestamps: true } );


const Message = mongoose.model('Message', MessageSchema);


const GroupSchema  = new mongoose.Schema({
	name : {
		type: String,
		required: true
	},
	admin : {
		type: String,
		required: true
	}},
	{ timestamps: true }
)

GroupSchema.index( { name: 1, admin: 1  }, { unique: true } )

const Group = mongoose.model("Group", GroupSchema)

const GroupMembersSchema = new mongoose.Schema({
	group_id: {
		type: String,
		required: true
	},
	group_name: {
		type: String,
		required: true
	},
	member: {
		type: String,
		required: true
	}
},
	{timestamps: true}
)

GroupMembersSchema.index( { group_id:1, member:1 }, { unique: true } )

const GroupMembers = mongoose.model("GroupMember", GroupMembersSchema )

const GroupMessageSchema = new mongoose.Schema({
	group_id: {
		type: String,
		required: true
	},
	sender: {
		type: String,
		required: true
	},
	text: {
		type: String,
	}, 
	media: {
		type: String
	}},
	{ timestamps: true }
)

const GroupMessage = mongoose.model("GroupMessage", GroupMessageSchema );

module.exports = { Message, Group, GroupMessage, GroupMembers };


*/