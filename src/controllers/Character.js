var _  = require('underscore');
var models = require('../models');

var Character = models.Character;

var display = function(req, res){
	Character.CharacterModel.findByOwner(req.session.account._id, function(err, docs){
		if(err){
			console.log(err);
			return res.status(400).json({error: "An error occurred"});
		}
		if(docs.length === 0){ //No characters, character creator
			console.log("going to creator");
			res.render('creator', {csrfToken: req.csrfToken()});
		}
		else{ //Show Character
			res.render('app', {csrfToken: req.csrfToken(), myCharacter:docs});
		}
	});
};

var create = function(req, res){
	var characterData = {
		name: "unknown",
		headgear: req.body.headgear,
		skintone: req.body.skintone,
		archtype: req.body.archtype,
		strength: req.body.strength,
		agility: req.body.agility,
		health: req.body.health,
		owner: req.session.account._id
	};
	
	var newCharacter = new Character.CharacterModel(characterData);
	
	newCharacter.save(function(err) {
		if(err){
			console.log(err);
			return res.status(400).json({error: 'An error occurred'});
		}
		
		res.json({redirect: '/character'});
	});
};

module.exports.display = display;
module.exports.create = create;