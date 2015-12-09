var bossName;
var bossHealthMAX, bossHealthCurrent;
var bossIndex;

var updateHealth(dmg){
	bossHealthCurrent -= dmg;
	return bossHealthCurrent;
}

