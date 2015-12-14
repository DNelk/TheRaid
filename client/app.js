"use strict";
//--------------------PRELOAD--------------------
var game = new Phaser.Game(800, 800, Phaser.AUTO, '', { preload: preload, create: create});
var headgears = [];
var skintones = [];
var bodies = [];
var charData;
var socket;
var bossGroup;
//Preload assets
function preload() {
	this.stage.disableVisibiltyChange = true;
	charData = JSON.parse(formatString($("input[name='myCharacter']").val()));
	//BG
	game.stage.backgroundColor = '#ffea9f';
	//Buttons
	game.load.image('arrow', 'characterAssets/arrow.png');
	game.load.image('create', 'characterAssets/create.png');
	game.load.image('barFrame', 'characterAssets/barframe.png');
	game.load.image('barRed', 'characterAssets/barred.png');
	game.load.image('barGreen', 'characterAssets/bargreen.png');
	game.load.image('attack', 'characterAssets/attack.png');
	game.load.image('dead', 'characterAssets/dead.png');
	game.load.image('bossDead', 'characterAssets/bossdead.png');

	//Headgear
	game.load.image('anime','characterAssets/headgear/anime.png');
	game.load.image('melon','characterAssets/headgear/melon.png');
	game.load.image('normal','characterAssets/headgear/normal.png');
	game.load.image('wizard','characterAssets/headgear/wizard.png');
	game.load.image('shaved','characterAssets/headgear/shaved.png');
	game.load.image('pomp','characterAssets/headgear/pomp.png');
	game.load.image('twindrills','characterAssets/headgear/twindrills.png');
	game.load.image('helmet','characterAssets/headgear/helmet.png');
	headgears.push('anime');
	headgears.push('melon');
	headgears.push('normal');
	headgears.push('wizard');
	headgears.push('shaved');
	headgears.push('pomp');
	headgears.push('twindrills');
	headgears.push('helmet');
	
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
	game.load.image('Grandpa Princess', 'characterAssets/bosses/princessgramps.png');
	game.load.image('Crabbo', 'characterAssets/bosses/crabbo.png');
	game.load.image('The Rock Monster', 'characterAssets/bosses/rockmonster.png');
	game.load.image('H Y P E R  D O G', 'characterAssets/bosses/hyperdog.png');

	
	game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
}

//--------------------GAME--------------------
var title, stats;
var bosstext;
var boss;
var randomChars;
var bossBar, myBar;
var atkSprite;
var atkThreshold;
var atkTotal = 0;
var deadScreen;
var date;
var respawnText;
var bossDead = false;
var bossDeadButton, bossDeadGroup;
var levelUpText;
var inGame = true;

//Create assets and set up socket
function create() {
	var style = {font: "32px Roboto", fill: "#8f8359", align: "center"};
	
	bosstext = game.add.text(300,150,"Boss Info",style); //Boss Info
	
	//Health labels
	var bosshealth = game.add.text(50, 70,"Boss Health:",style);
	var myhealth = game.add.text(275, 650, "Health:",style);
	
	//Create my character
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
	
	//Group of npcs set later by server
	randomChars = game.add.group();
	
	//Boss Health Bar
	bossBar = game.add.group();
	bossBar.x = bossBar.y = 0;
	bossBar.create(0,0,'barRed');
	bossBar.create(0,0,'barGreen');
	bossBar.create(0,0,'barFrame');
	bossBar.x = 250;
	bossBar.y = 50;
	bossBar.scale.setTo(0.8,0.5);
	
	//My health bar
	myBar = game.add.group();
	myBar.x = myBar.y = 0;
	myBar.create(0,0,'barRed');
	myBar.create(0,0,'barGreen');
	myBar.create(0,0,'barFrame');
	myBar.x = 400;
	myBar.y = 650;
	myBar.scale.setTo(0.3,0.25);
	
	//Graphic when boss attacks
	atkSprite = game.add.sprite(game.world.centerX, game.world.centerY, 'attack');
	atkSprite.anchor.setTo(0.5, 0.5);
    atkSprite.alpha = 0;
	
	//Screen When you die
	deadScreen = game.add.group();
	deadScreen.create(0,0,'dead');
	deadScreen.alpha = 0;
	respawnText = game.add.text(550, 450, "", {font: "100px Roboto", fill: "#ff0000", align: "center"});
	respawnText.anchor.setTo(0.5, 0.5);
	respawnText.alpha = 0;
	deadScreen.add(respawnText);
	
	//Screen When boss dies
	bossDeadGroup = game.add.group();
	bossDeadButton = game.add.button(0,0,'bossDead',function(){
		inGame = true;
		bossDeadGroup.visible = false;
		}, true);
	bossDeadGroup.add(bossDeadButton);
	levelUpText = game.add.text(400, 450, "Level UP! Your stats have increased!", {font: "40px Roboto", fill: "#00ff00", align: "center"});
	levelUpText.anchor.setTo(0.5, 0.5);
	bossDeadGroup.add(levelUpText);
	bossDeadGroup.visible = false;
	
	
	game.input.onDown.add(changeTint, this);
	game.input.onUp.add(changeTint, this);
	
	//Connect to socket
	socket = io.connect();
	socket.on('connect', function() {
		console.log('connecting');
		socket.emit('join', {});
		setupSocket();
	});
}

//Tint boss on hit
function changeTint(){

	if(game.input.x > 250 && game.input.x < 550 && game.input.y >200 && game.input.y < 500 && inGame){
		if(boss.tint == 0xffffff) boss.tint = 0xff0000;
		else if(boss.tint == 0xff0000) boss.tint = 0xffffff;
	}
}

//When boss is attacked
function attack(forceSend){
	if(charData.currenthealth > 0)
		atkTotal += charData.strength;
	if(atkTotal > atkThreshold && inGame|| forceSend){ //Set a threshold so we don't break the server with too many messages
		socket.emit('atk', {dmg: atkTotal});
		atkTotal = 0;
	}
}

//Set up connections
function setupSocket(){
	socket.on('bossupdate', function(data){ //General update
		updateBoss(data);
	});
	socket.on('bossatk', function(data){ //Boss attacks us
		bossAttack(data.dmg);
	});
	socket.on('bossdeath', function(data){ //Boss Dies
		bossDeathScreen(data);
	});
	socket.on('join', function(data){ //Someone joins, Create NPCs
		for(var i = 0; i < data.count - randomChars.children.length; i++){
			createRandomCharacter();
		}
	});
	socket.on('leave', function(data){ //Someone leaves, Destroy NPCs
		randomChars.children[randomChars.length-1].destroy(true,false);
	});
	updateCharacter();
}

//Display stuff when boss dies
function bossDeathScreen(data){
	inGame = false;
	bossDead = true;
	bossDeadGroup.visible = true;
	game.world.bringToTop(bossDeadGroup);
	
	//Calculate EXP gained by defeating boss (the server will also do this)
	var exp = data.bossnum * 500;
	socket.emit('expup', {_id: charData._id, exp: exp});
	charData.exp += exp;
	if(charData.exp >= charData.level * charData.level * 500){
		charData.level++;
		charData.attack *= 1.5;
		charData.agility *= 1.5;
		charData.health *= 1.5;
		charData.currenthealth = charData.health;
		levelUpText.visible = true;
	}
	else{
		levelUpText.visible = false;
	}
}

//Update the boss' health and other info if needed
function updateBoss(data){
	//console.log(data);
	if(boss == undefined || bossDead){
		if(bossDead) boss.destroy();
		boss = game.add.button(275, 200, data.name, attack, this);
		boss.width = 250;
		boss.height = 250;
		atkThreshold = 0.01 * data.maxhealth;
		bossDead = false;
		game.world.bringToTop(bossDeadGroup);
	}
	bossBar.children[1].scale.setTo(data.currenthealth/data.maxhealth, 1);
	bosstext.text = "Boss #" + data.bossnum + " - " + data.name;
	bosstext.x = 400 - (bosstext.width/2);
}

//Boss attacks us, what happens
function bossAttack(dmg){
	if(charData.currenthealth > 0 && inGame){
		atkSprite.bringToTop();
		var alphaTween = game.add.tween(atkSprite).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0, 1, true);
		socket.emit('takedamage', {_id: charData._id});
		//Do the same thing client side, just to keep it quick
		charData.currenthealth -= 1;
		if(charData.currenthealth <= 0){
			inGame = false;
			charData.currenthealth = 0;
			date = new Date();
			charData.timeofdeath = date.getTime();
		}
		updateCharacter();
	}
}

//Update character health or trigger death
function updateCharacter(){
	myBar.children[1].scale.setTo(charData.currenthealth/charData.health, 1);
	if(charData.currenthealth <= 0){
		playerDead();
		attack(true);
		if(boss && boss.tint == 0xff0000) boss.tint = 0xffffff;
	}
}

//Display character death screen
function playerDead(){
	date = new Date();
	var current = date.getTime();
	var timeSinceDead = (current - charData.timeofdeath)/1000;
	var respawnTime =  15/charData.agility;
	if(timeSinceDead < respawnTime){
		game.world.bringToTop(deadScreen);
		deadScreen.alpha = 1;
		respawnText.alpha = 1;
		respawnText.text = Math.round(respawnTime - timeSinceDead);
		setTimeout(playerDead, 1000);
	}
	else{
		deadScreen.alpha = 0;
		respawnText.alpha = 0;
		respawn();
	}
}

//Respawn from death
function respawn(){
	socket.emit('respawn', {_id: charData._id});
	charData.currenthealth = charData.health;
	inGame = true;
	updateCharacter();
}

//Generate a random NPC
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
	randomChar.y = getRandomInt(100,600);
	randomChars.add(randomChar);
}

//--------------------UTILS--------------------
function formatString(str){ //For formatting char data
	str = str.replace(/\r?\n|\r/g, "");
	str = str.replace(/: /g, " :");
	str = str.replace(/  /g, "");
	str = str.replace(/,/g, ", ");
	str = str.replace(/ /g, "\"");
	str = str.replace(/'/g, "\"");
	str = str.replace(/"_id":/, "\"_id\":\"");
	return str;
}

//Return random integer
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function handleError(message) {
     //Handle error messages
	$("#errorMessage").text(message);
    $("#slideMessage").animate({width:'toggle'},350);
}

//Send ajax
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