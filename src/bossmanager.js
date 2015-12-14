var models = require('./models');
var sockets = require('./socket.js');
var Boss = models.Boss;

var model; //Our boss singleton
var io; //Pass this into socket... kinda hacky
var names = ["Bad Man", "Grandpa Princess","Crabbo","The Rock Monster","H Y P E R  D O G"]; //Boss names
var init = function(overrideHealth, socketio){
	io = socketio;
	if(!overrideHealth || overrideHealth === 0){ //Not starting over, lets try and get the boss
		Boss.BossModel.getBoss(setModel);
	}
	else{ //New boss!
		createBoss(overrideHealth);
	}

};

//Save boss model
var save = function(){
	model.save(function(err) {
		if(err){
			console.log(err);
			return res.status(400).json({error: 'An error occurred'});
		}
	});
};

//Use previous model
function setModel(err, docs){
	model = docs;
	if(!model){
		createBoss();
	}
	sockets.configureSockets(io);
	update();
	return model;
}
//Create new boss model
function createBoss(overrideHealth){
	var startingHealth = overrideHealth || 1000;
	var bossData = {
		name: names[0],
		maxhealth: startingHealth,
		currenthealth: startingHealth,
		bossnum: 1
	};
	model = new Boss.BossModel(bossData);
	model.save(function(err) {
		if(err){
			console.log(err);
			return res.status(400).json({error: 'An error occurred'});
		}
	});
	sockets.configureSockets(io);
	update();
	return model;
}

var getModel = function(){
	return model;
};

//Save every 5 seconds
function update(){
	save();
	setTimeout(update, 5000);
}

//Boss dies
var killBoss = function(){
	Boss.BossModel.getBoss(setNewBoss);
};

//Make new boss
function setNewBoss(err, docs){
	var prevHealth = docs.maxhealth;
	var prevNum = docs.bossnum;
	docs.name = names[prevNum];
	docs.maxhealth = prevHealth * 10;
	docs.currenthealth = prevHealth * 10;
	docs.bossnum = prevNum + 1;
	
	docs.save(function(err) {
		if(err){
			console.log(err);
			return res.status(400).json({error: 'An error occurred'});
		}
	});
	model = docs;
	sockets.emitNewBoss(); //Update the sockets
}
module.exports.init = init;
module.exports.getModel = getModel;
module.exports.save = save;
module.exports.killBoss = killBoss;