"use strict";
var game = new Phaser.Game(800, 800, Phaser.AUTO, '', { preload: preload, create: create});
var headgears = [];
var skintones = [];
var bodies = [];
var charData;
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

var headgear;
var skintone;
var body;
var title, stats;
var comingsoon;
function create() {
	var style = {font: "32px Roboto", fill: "#8f8359", align: "center"};
	title = game.add.text(350,100,"Your Character:",style);
	title.x = title.x - title.width/3;
	stats = game.add.text(200, 400,"Strength: " + charData.strength + " Agility: " + charData.agility + " Health: " + charData.health, style);
	//Body
	body = game.add.sprite(350,200,bodies[charData.archtype]);
	//Skintone
	skintone = game.add.sprite(350,200,skintones[charData.skintone]);
	//Headgear
	headgear = game.add.sprite(350,200,headgears[charData.headgear]);
	comingsoon = game.add.text(160, 500,"Stay tuned! Full game coming soon!", style);
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
function handleError(message) {
     //Handle error messages
	$("#errorMessage").text(message);
    $("#slideMessage").animate({width:'toggle'},350);
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