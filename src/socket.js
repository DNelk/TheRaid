var models = require('./models');
var bossManager = require('./bossmanager');

var Character = models.Character;
var io; //our socket.io server (passed in from the app)
var temphealth = 100000;
var connectedCount = 0;
var configureSockets = function(socketio) {
	io = socketio; 
	bossAttack();
    //on new socket connections
    //new socket connection is passed in
	io.sockets.on('connection', function(socket) { 
        //join them all into the same socket room
		connectedCount++;
        socket.join('room1');
		io.sockets.in('room1').emit("bossupdate", bossManager.getModel());
		io.sockets.in('room1').emit("join", {count: connectedCount-1});
       //recieve an attack
        socket.on('atk', function(data) {
			bossManager.getModel().currenthealth -= data.dmg;
			io.sockets.in('room1').emit("bossupdate", bossManager.getModel());
        });
        
        //when the client disconnects from the server
		socket.on('disconnect', function(data){
			connectedCount--;
            bossManager.save();
			socket.leave('room1'); 	
			io.sockets.in('room1').emit("leave", {count: connectedCount-1});
		});
		
		socket.on('test', function(data){
			console.log(data);
			Character.CharacterModel.findById(data._id, function(err, docs){
				//console.log(docs);
			});
		});
	});
};

function bossAttack(){
	io.sockets.in('room1').emit('bossatk', {dmg: 1});
	setTimeout(bossAttack, 30 * 1000);
}
module.exports.configureSockets = configureSockets;