// app/routes.js
var functions 	= require('./functions');

module.exports = function(app) {
	app.get('/', function (req, res) {
		res.render('index', {
			title: "Deliveroo - How Many Meals Left?"
		});
	});
}