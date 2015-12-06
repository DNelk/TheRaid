var controllers = require('./controllers');
var mid = require('./middleware');
var router = function(app){	
	app.get("/login", mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
	app.post("/login", mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
	app.get("/signup", mid.requiresSecure, mid.requiresLogout, controllers.Account.signupPage);
	app.post("/signup", mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
	app.get("/logout", mid.requiresLogin, controllers.Account.logout);
	app.get("/", mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
	app.get("/character", mid.requiresLogin, controllers.Character.display);
	app.post("/character", mid.requiresLogin, controllers.Character.create);
};

module.exports = router;