var models = require('./models');
var sockets = require('./socket.js');
var Boss = models.Boss;

var model;
var io; //Pass this into socket... kinda hacky
var names = ["Bad Man"];
var init = function(overrideHealth, socketio){
	io = socketio;
	if(!overrideHealth || overrideHealth == 0){ //Not starting over, lets try and get the boss
		Boss.BossModel.getBoss(setModel);
	}
	else{
		createBoss(overrideHealth);
	}

};

var save = function(){
	model.save(function(err) {
		if(err){
			console.log(err);
			return res.status(400).json({error: 'An error occurred'});
		}
	});
};

function setModel(err, docs){
	model = docs;
	if(model.length === 0){
		createBoss();
	}
	sockets.configureSockets(io);
	update();
	return model;
}

function createBoss(overrideHealth){
	var startingHealth = overrideHealth || 100;
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
}

function update(){
	save();
	setTimeout(update, 5000);
}
module.exports.init = init;
module.exports.getModel = getModel;
module.exports.save = save;