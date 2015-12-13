"use strict";
//--------------------PRELOAD--------------------
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
	game.load.image('barFrame', 'characterAssets/barframe.png');
	game.load.image('barRed', 'characterAssets/barred.png');
	game.load.image('barGreen', 'characterAssets/bargreen.png');

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
	
	
	//Bosses
	game.load.image('Bad Man', 'characterAssets/bosses/badman.png');
	
	game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
}

//--------------------GAME--------------------
var title, stats;
var bosstext;
var boss;
var randomChars;
var bossBar, myBar;

//Create character and set up socket
function create() {
	var style = {font: "32px Roboto", fill: "#8f8359", align: "center"};
	
	bosstext = game.add.text(300,150,"Boss Info",style);
	
	var bosshealth = game.add.text(50, 70,"Boss Health:",style);
	var myhealth = game.add.text(275, 650, "Health:",style);
	var myCharacter = game.add.group();
	myCharacter.x = myCharacter.y = 0;
	//Body
	myCharacter.create(0,0,bodies[charData.archtype]);
	//Skintone
	myCharacter.create(0,0,skintones[charData.skintone]);
	//Headgear
	myCharacter.create(0,0,headgears[charData.headgear]);
	
	myCharacter.x = 350;
	myCharacter.y = 475;
	myCharacter.scale.setTo(0.8,0.8);
	
	randomChars = game.add.group();
	
	bossBar = game.add.group();
	bossBar.x = bossBar.y = 0;
	bossBar.create(0,0,'barRed');
	bossBar.create(0,0,'barGreen');
	bossBar.create(0,0,'barFrame');
	bossBar.x = 250;
	bossBar.y = 50;
	bossBar.scale.setTo(0.8,0.5);
	
	
	myBar = game.add.group();
	myBar.x = myBar.y = 0;
	myBar.create(0,0,'barRed');
	myBar.create(0,0,'barGreen');
	myBar.create(0,0,'barFrame');
	myBar.x = 400;
	myBar.y = 650;
	myBar.scale.setTo(0.3,0.25);
	updateCharacter(charData);
	
	game.input.onDown.add(changeTint, this);
	game.input.onUp.add(changeTint, this);
	socket = io.connect();
	socket.on('connect', function() {
		console.log('connecting');
		socket.emit('join', {});
		setupSocket();
	});
}

function changeTint(){
	if(game.input.x > 250 && game.input.x < 550 && game.input.y >200 && game.input.y < 500){
		if(boss.tint == 0xffffff) boss.tint = 0xff0000;
		else if(boss.tint == 0xff0000) boss.tint = 0xffffff;
	}
}
function attack(){
	socket.emit('atk', {dmg: charData.strength});
}

function setupSocket(){
	socket.on('bossupdate', function(data){
		updateBoss(data);
	});
	socket.on('bossatk', function(data){
		//alert("Boss Attack!");
	});
	socket.on('bossdeath', function(data){
	});
	socket.on('join', function(data){
		for(var i = 0; i < data.count - randomChars.children.length; i++){
			createRandomCharacter();
		}
	});
	socket.on('leave', function(data){
		randomChars.children[randomChars.length-1].destroy(true,false);
	});
	socket.emit('test', {_id: charData._id});
}
function updateBoss(data){
	if(boss == undefined){
		boss = game.add.button(275, 200, data.name, attack, this);
		boss.width = 250;
		boss.height = 250;
	}
	bossBar.children[1].scale.setTo(data.currenthealth/data.maxhealth, 1);
	bosstext.text = "Boss #" + data.bossnum + " - " + data.name;
	bosstext.x = 400 - (bosstext.width/2);
}

function updateCharacter(data){
	myBar.children[1].scale.setTo(data.currenthealth/data.health, 1);
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

//--------------------UTILS--------------------
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

function handleError(message) {
     //Handle error messages
	$("#errorMessage").text(message);
    $("#slideMessage").animate({width:'toggle'},350);
}

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