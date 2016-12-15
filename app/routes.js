var expectancy_m = 79,
	expectancy_f = 83,
	fate_factor = 5

// app/routes.js
var functions 	= require('./functions');

module.exports = function(app) {
	app.get('/', function (req, res) {
		res.render('index', {
			title: "Deliveroo - How Many Meals Left?"
		});
	});
	
	app.post('/date_path', function (req, res) {
		var gender = req.body.gender;
		var expectancy;
		
		var num = Math.floor(Math.random()*fate_factor) + 1;
			num *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
		
		if(gender == "male") {
			expectancy = expectancy_m + num;
		} else {
			expectancy = expectancy_f + num;
		}
		
		var dob = new Date(req.body.date);
		var birthYear = dob.getFullYear();
		var birthMonth = dob.getMonth();
		var birthDay  = dob.getDate();
		
		var today = new Date();
		var todayYear = today.getFullYear();
		var todayMonth = today.getMonth();
		var todayDay = today.getDate();
		
		var age = todayYear - birthYear; 

		if (todayMonth < birthMonth - 1) {
			age--;
  		}

  		if (birthMonth - 1 == todayMonth && todayDay < birthDay) {
  			age--;
  		}
  		
  		var years_left = expectancy - age;
  		var meals_left = years_left * 365 * 3;
		
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({ meals_left: meals_left }));
	});
}