var io; //our socket.io server (passed in from the app)
var temphealth = 100000;
var configureSockets = function(socketio) {
	io = socketio; 

    //on new socket connections
    //new socket connection is passed in
	io.sockets.on('connection', function(socket) { 
		console.log("connecting");
        //join them all into the same socket room
        socket.join('room1');
		io.sockets.in('room1').emit("bossupdate", {health: temphealth});
       //recieve an attack
        socket.on('atk', function(data) {
			console.log("attack recieved");
			temphealth -= data.dmg;
			io.sockets.in('room1').emit("bossupdate", {health: temphealth});
        });
        
        //when the client disconnects from the server
		socket.on('disconnect', function(data){
            socket.leave('room1'); 
		});
	});
};

module.exports.configureSockets = configureSockets;