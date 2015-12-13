var bossManager = require('./bossmanager');
var io; //our socket.io server (passed in from the app)
var temphealth = 100000;
var configureSockets = function(socketio) {
	io = socketio; 
	console.log(bossManager.getModel().currenthealth);
    //on new socket connections
    //new socket connection is passed in
	io.sockets.on('connection', function(socket) { 
        //join them all into the same socket room
        socket.join('room1');
		io.sockets.in('room1').emit("bossupdate", bossManager.getModel());
       //recieve an attack
        socket.on('atk', function(data) {
			bossManager.getModel().currenthealth -= data.dmg;
			io.sockets.in('room1').emit("bossupdate", bossManager.getModel());
        });
        
        //when the client disconnects from the server
		socket.on('disconnect', function(data){
			console.log("leave and save");
            bossManager.save();
			socket.leave('room1'); 	
		});
	});
};

module.exports.configureSockets = configureSockets;