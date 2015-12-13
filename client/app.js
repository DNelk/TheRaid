"use strict";
var game = new Phaser.Game(800, 800, Phaser.AUTO, '', { preload: preload, create: create});
var headgears = [];
var skintones = [];
var bodies = [];
var charData;
var socket;
function preload() {
	charData = JSON.parse(formatString($("input[name='myCharacter']").val()));
	//BG
	game.stage.backgroundColor = '#ffea9f';
	//Buttons
	game.load.image('arrow', 'characterAssets/arrow.png');
	game.load.image('create', 'characterAssets/create.png');
	
	//Headgear
	game.load.image('anime','characterAssets/headgear/anime.png');
	game.load.image('melon','characterAssets/headgear/melon.png');
	game.load.image('normal','characterAssets/headgear/normal.png');
	game.load.image('wizard','characterAssets/headgear/wizard.png');
	headgears.push('anime');
	headgears.push('melon');
	headgears.push('normal');
	headgears.push('wizard');
	
	//Skintone
	game.load.image('pale','characterAssets/skin/pale.png');
	game.load.image('rosy pale','characterAssets/skin/rosy_pale.png');
	game.load.image('light','characterAssets/skin/light.png');
	game.load.image('average','characterAssets/skin/average.png');
	game.load.image('tan','characterAssets/skin/tan.png');
	game.load.image('darker tan','characterAssets/skin/darker_tan.png');
	game.load.image('medium','characterAssets/skin/medium.png');
	game.load.image('dark','characterAssets/skin/dark.png');
	game.load.image('reddish','characterAssets/skin/reddish.png');
	skintones.push('pale');
	skintones.push('rosy pale');
	skintones.push('average');
	skintones.push('tan');
	skintones.push('darker tan');
	skintones.push('medium');
	skintones.push('dark');
	skintones.push('reddish');
	
	//Bodies
	game.load.image('warrior', 'characterAssets/bodies/warrior.png');
	game.load.image('rogue', 'characterAssets/bodies/rogue.png');
	game.load.image('mage', 'characterAssets/bodies/mage.png');
	bodies.push('warrior');
	bodies.push('rogue');
	bodies.push('mage');
	
	game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
}

var title, stats;
var bosstext;
var buttonTest;
var randomChars;
//Create character and set up socket
function create() {
	socket = io.connect();
	socket.on('connect', function() {
		console.log('connecting');
		socket.emit('join', {});
		setupSocket();
	});
	var style = {font: "32px Roboto", fill: "#8f8359", align: "center"};
	title = game.add.text(350,100,"Your Character:",style);
	title.x = title.x - title.width/3;
	
	stats = game.add.text(200, 400,"Strength: " + charData.strength + " Agility: " + charData.agility + " Health: " + charData.health, style);
	var myCharacter = game.add.group();
	myCharacter.x = myCharacter.y = 0;
	//Body
	myCharacter.create(0,0,bodies[charData.archtype]);
	//Skintone
	myCharacter.create(0,0,skintones[charData.skintone]);
	//Headgear
	myCharacter.create(0,0,headgears[charData.headgear]);
	randomChars = game.add.group();
	createRandomCharacter();
	createRandomCharacter();
	//randomChars.children[0].destroy(true,false);
	//console.log(randomCharacters);
	bosstext = game.add.text(160, 500,"Boss health: ", style);
	buttonTest = game.add.button(350, 600, 'arrow', attack, this);
}

function attack(){
	console.log("attacking");
	socket.emit('atk', {dmg: 1});
};

function sendAjax(action, data) {
		console.log(data);
        $.ajax({
            cache: false,
            type: "POST",
            url: action,
            data: data,
            dataType: "json",
            success: function(result, status, xhr) {
                $("#slideMessage").animate({width:'hide'},350);

                window.location = result.redirect;
            },
            error: function(xhr, status, error) {
                var messageObj = JSON.parse(xhr.responseText);
            
                handleError(messageObj.error);
            }
        });        
}
function setupSocket(){
	socket.on('bossupdate', function(data){
		console.log("boss update");
		handleMessage(data);
	});
}
function handleMessage(data){
	bosstext.text = "Boss health: " + data.currenthealth;
}
function handleError(message) {
     //Handle error messages
	$("#errorMessage").text(message);
    $("#slideMessage").animate({width:'toggle'},350);
}

function createRandomCharacter(){
	var randomChar = game.add.group();
	randomChar.create(0,0,bodies[getRandomInt(0,bodies.length-1)]);
	randomChar.create(0,0,skintones[getRandomInt(0,skintones.length-1)]);
	randomChar.create(0,0,headgears[getRandomInt(0,headgears.length-1)]);
	randomChar.scale.setTo(0.5, 0.5);
	switch(getRandomInt(0,2)){
		case 0:
			randomChar.x = getRandomInt(25,200);
			break;
		case 1:
			randomChar.x = getRandomInt(600,775);
			break;
	}
	randomChar.y = getRandomInt(100,700);
	randomChars.add(randomChar);
}
function formatString(str){
	str = str.replace(/\r?\n|\r/g, "");
	str = str.replace(/: /g, " :");
	str = str.replace(/  /g, "");
	str = str.replace(/,/g, ", ");
	str = str.replace(/ /g, "\"");
	str = str.replace(/'/g, "\"");
	str = str.replace(/"_id":/, "\"_id\":\"");
	return str;
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}