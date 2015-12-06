var mongoose = require('mongoose');
var _ = require('underscore');

var CharacterModel;

var setName = function(name){
	return _.escape(name).trim();
};

var CharacterSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		set: setName
	},
	headgear: {
		type: Number,
		min: 0,
		required: true
	},
	
	skintone: {
		type: Number,
		min: 0,
		required: true
	},
	
	archtype: {
		type: Number,
		min: 0,
		required: true
	},
	
	strength: {
		type: Number,
		min: 0,
		required: true
	},
	
	agility: {
		type: Number,
		min: 0,
		required: true
	},
	
	health: {
		type: Number,
		min: 0,
		required: true
	},
	
	owner: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'Account'
	},
	
	createdData: {
		type: Date,
		default: Date.now
	}
});

CharacterSchema.methods.toAPI = function() {
	return {
		name: this.name,
		headgear: this.headgear,
		skintone: this.skintone,
		archtype: this.archtype,
		strength: this.strength,
		agility: this.agility,
		health: this.health
	};
};

CharacterSchema.statics.findByOwner = function(ownerId, callback) {
	var search = {
		owner: mongoose.Types.ObjectId(ownerId)
	};
	
	return CharacterModel.find(search).select("name headgear skintone archtype strength agility health").exec(callback);
};

CharacterModel = mongoose.model('Character', CharacterSchema);

module.exports.CharacterModel = CharacterModel;
module.exports.CharacterSchema = CharacterSchema;