//console.log("server");

const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');


const { io, onlineUserMap, app, server }  =  require("./utils/socket.js");
const { mainRouter }= require("./routes.js");
const { User } = require("./models/auth.js");
const { Message, GroupMessage, Group, GroupMembers }  =  require("./models/chat.js");


app.use(mainRouter);


app.use( ( req, res, next ) => {
	console.log("backend", new Date().toLocaleString() );
	
} );


mongoose.connect(process.env.MONGO_URI).then(() => {
	console.log( "Connected to MongoDB" );
	

	io.on( "connection", async (stream) => {
		

		const auth = stream.handshake.query.auth;
		
		if (!auth) console.log("No auth");
		
		//stream.close( 1008, "Not Authorized" )

  		const token = auth.split(' ')[1]

		

  		try {
    		const { _id } = jwt.verify(token, process.env.JWT_SECRET); 
			//console.log( "token", token );
			const ret = await User.findOne({_id}); 
			if( !ret ) throw Error("No such user"); 
			console.log( "A user connected in websocket", stream.id );
			
			onlineUserMap[ ret.username.toString() ] = stream.id;
			
			io.emit( "onlineUsers", Object.keys(onlineUserMap) )
			
			stream.on( "disconnect", () => {
				console.log( "A user disconnected from web socket", stream.id)
				delete onlineUserMap[ ret.username.toString() ]
				io.emit( "onlineUsers", Object.keys(onlineUserMap) );
				
			}  );

			stream.on( "sendMessage", async (data) => {
				const new_message = new Message ({
					sender: data.sender,
					receiver: data.receiver,
					text: data.text
				})

				const saved_message = await new_message.save();

				if( onlineUserMap[data.receiver] ) {
					io.to( onlineUserMap[data.receiver] ).emit( "newMessage", saved_message )
				}

				if( onlineUserMap[data.sender] )
				{
					io.to( onlineUserMap[data.sender] ).emit( "newMessage", saved_message )
				}

				console.log("successfull");
			} )


			stream.on("sendGroupMessage", async(data) => {
				console.log(data)
				const group = await Group.findOne({ _id: data.receiver });
				if(!group) return

				const new_message = new GroupMessage({
					group_id: data.receiver,
					sender: data.sender,
					text: data.text
				})

				const saved_message = await new_message.save();

				const group_members = await GroupMembers.find( { group_id: data.receiver } )

				console.log( onlineUserMap )
				group_members.map(x => {
					console.log(x)
					if( onlineUserMap[x.member] ) 
						console.log("got it")
						io.to( onlineUserMap[x.member] ).emit( "newGroupMessage", saved_message )
				})

				console.log("successful")

			} )

		}
		catch(error) {
			console.log( "socket failed", error.message );
		}

		
	} )


	server.listen(process.env.PORT, () => {
		console.log(`Listening on Port ${process.env.PORT}`);
	});


}).catch((err) => console.log(`Error: ${err}`));

