var mongoose = require('mongoose');
var _ = require('underscore');

var BossModel;

var setName = function(name){
	return _.escape(name).trim();
};

var BossSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		set: setName
	},
	
	maxhealth: {
		type: Number,
		min: 0,
		required: true
	},
	
	currenthealth: {
		type: Number,
		min: 0,
		required: true
	},
	
	bossnum: {
		type: Number,
		min: 0,
		required: true
	},
	
	createdData: {
		type: Date,
		default: Date.now
	}
});

BossSchema.statics.getBoss = function(callback) {
    return BossModel.findOne().sort({createdData:-1}).exec(callback);
};

BossSchema.methods.toAPI = function() {
	return {
		name: this.name,
		maxhealth: this.maxhealth,
		currenthealth: this.currenthealth,
		bossnum: this.bossnum
	};
};

BossModel = mongoose.model('Boss', BossSchema);

module.exports.BossModel = BossModel;
module.exports.BossSchema = BossSchema;