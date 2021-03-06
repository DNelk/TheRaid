var models = require('./models');
var bossManager = require('./bossmanager');

var Character = models.Character;
var io; //our socket.io server (passed in from the app)

var connectedCount = 0; //Number of users connected
var updatingBoss = false; // keeps boss from getting messed up while assigning new values

var configureSockets = function(socketio) {
	io = socketio; 
	bossAttack(); //Start loop
    //on new socket connections
    //new socket connection is passed in
	io.sockets.on('connection', function(socket) { 
        //join them all into the same socket room
		connectedCount++;
        socket.join('room1');
		//Update everything because someone new is here
		if(!updatingBoss)io.sockets.in('room1').emit("bossupdate", bossManager.getModel());
		io.sockets.in('room1').emit("join", {count: connectedCount-1});
       //Boss recieves an attack
        socket.on('atk', function(data) {
			var newHealth = bossManager.getModel().currenthealth - data.dmg;
			if(newHealth <= 0 && !updatingBoss){
				updatingBoss = true;
				bossManager.killBoss();
				io.sockets.in('room1').emit('bossdeath', bossManager.getModel());
			}
			else if(!updatingBoss){
				bossManager.getModel().currenthealth = newHealth;
				io.sockets.in('room1').emit('bossupdate', bossManager.getModel());
			}
        });
        
        //when the client disconnects from the server
		socket.on('disconnect', function(data){
			connectedCount--;
            bossManager.save();
			socket.leave('room1'); 	
			io.sockets.in('room1').emit("leave", {count: connectedCount-1});
		});
		//Character takes damage
		socket.on('takedamage', function(data){
			Character.CharacterModel.findById(data._id, function(err, docs){
				docs.currenthealth -= 1;
				if(docs.currenthealth <= 0){
					docs.currenthealth = 0;
					var d = new Date();
					docs.timeofdeath = d.getTime();
				}
				docs.save(function(err) {
					if(err){
						console.log(err);
						return res.status(400).json({error: 'An error occurred'});
					}
				});
			});
		});
		//Character respawns
		socket.on('respawn', function(data){
			Character.CharacterModel.findById(data._id, function(err, docs){
				docs.currenthealth = docs.health;
				docs.save(function(err) {
					if(err){
						console.log(err);
						return res.status(400).json({error: 'An error occurred'});
					}
				});
			});
		});
		//Character exp increases
		socket.on('expup', function(data){
			Character.CharacterModel.findById(data._id, function(err, docs){
				docs.exp += data.exp;
				if(docs.exp >= docs.level * docs.level * 500){
					docs.level++;
					docs.attack *= 1.5;
					docs.agility *= 1.5;
					docs.health *= 1.5;
					docs.currenthealth = docs.health;
				}
				docs.save(function(err) {
					if(err){
						console.log(err);
						return res.status(400).json({error: 'An error occurred'});
					}
				});
			});
		});
	});
};

//Attack everyone on the server every 15 seconds
function bossAttack(){
	io.sockets.in('room1').emit('bossatk', {dmg: 1});
	setTimeout(bossAttack, 15 * 1000);
}

//Can be externally called by bossmanager to update everyone on the new boss
var emitNewBoss = function(){
	updatingBoss = false;
	io.sockets.in('room1').emit("bossupdate", bossManager.getModel());
};
module.exports.configureSockets = configureSockets;
module.exports.emitNewBoss = emitNewBoss;