"use strict";
var game = new Phaser.Game(800, 800, Phaser.AUTO, '', { preload: preload, create: create});
var headgears = [];
var skintones = [];
var bodies = [];
var strength = 2;
var agility = 1;
var health = 3;
function preload() {
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

var headgear, headgearindex = 0;
var skintone, skintoneindex = 0;
var body, bodyindex = 0;
var title, headlabel, skinlabel, classlabel, stats;
var create;
function create() {
	var style = {font: "32px Roboto", fill: "#8f8359", align: "center"};
	title = game.add.text(350,100,"Create your character",style);
	title.x = title.x - title.width/3;
	headlabel = game.add.text(100,250,"Head",style);
	skinlabel = game.add.text(100,350,"Skin",style);
	classlabel = game.add.text(350,425,"Warrior",style);
	stats = game.add.text(200, 500,"Strength: " + strength + " Agility: " + agility + " Health: " + health, style);
	create = game.add.button(300, 600, 'create', createClick, this);
	//Body
	body = game.add.sprite(350,200,bodies[bodyindex]);
	var bodyforward = game.add.button(500, 400, 'arrow', forwardBodyClick, this);
	var bodybackward = game.add.button(300, 400, 'arrow', backwardBodyClick, this);
	bodybackward.scale.setTo(-1,1);
	//Skintone
	skintone = game.add.sprite(350,200,skintones[skintoneindex]);
	var skintoneforward = game.add.button(500, 300, 'arrow', forwardSkintoneClick, this);
	var skintonebackward = game.add.button(300, 300, 'arrow', backwardSkintoneClick, this);
	skintonebackward.scale.setTo(-1,1);
	//Headgear
	headgear = game.add.sprite(350,200,headgears[headgearindex]);
	var headgearforward = game.add.button(500, 200, 'arrow', forwardHeadgearClick, this);
	var headgearbackward = game.add.button(300, 200, 'arrow', backwardHeadgearClick, this);
	headgearbackward.scale.setTo(-1,1);
}

function updateStats(){
	switch(bodies[bodyindex]){
		case "warrior":
			classlabel.text = "Warrior";
			strength = 2;
			agility = 1;
			health = 3;
			break;
		case "rogue":
			classlabel.text = "Rogue";
			strength = 2;
			agility = 3;
			health = 1;
			break;
		case "mage":
			classlabel.text = "Mage";
			strength = 3;
			agility = 2;
			health = 1;
			break;	
	}
	stats.text = "Strength: " + strength + " Agility: " + agility + " Health: " + health;
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

//BUTTONS
function forwardHeadgearClick()  { headgearindex++; if(headgearindex >= headgears.length){headgearindex = 0;} headgear.loadTexture(headgears[headgearindex], 0, false);}
function backwardHeadgearClick() { headgearindex--; if(headgearindex < 0){headgearindex = headgears.length-1;} headgear.loadTexture(headgears[headgearindex], 0, false);}
function forwardSkintoneClick()  { skintoneindex++; if(skintoneindex >= skintones.length){skintoneindex = 0;} skintone.loadTexture(skintones[skintoneindex], 0, false);}
function backwardSkintoneClick() { skintoneindex--; if(skintoneindex < 0){skintoneindex = skintones.length-1;} skintone.loadTexture(skintones[skintoneindex], 0, false);}
function forwardBodyClick()  { bodyindex++; if(bodyindex >= bodies.length){bodyindex = 0;} body.loadTexture(bodies[bodyindex], 0, false); updateStats();}
function backwardBodyClick() { bodyindex--; if(bodyindex < 0){bodyindex = bodies.length-1;}body.loadTexture(bodies[bodyindex], 0, false); updateStats();}
function createClick(){
	sendAjax("/character", "headgear=" +headgearindex+ "&skintone=" +skintoneindex+ "&archtype=" +bodyindex+ "&strength=" +strength+ "&agility="  +agility+ "&health="   +health+ "&_csrf="  + $("input[name='_csrf']").val());
}

function handleError(message) {
     //Handle error messages
	$("#errorMessage").text(message);
    $("#slideMessage").animate({width:'toggle'},350);
}