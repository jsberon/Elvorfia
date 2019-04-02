var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var jsonData = {
	    title: 'Elvorfia',
        layout: 'home/pt_home.hbs'
    };
    res.render('home/home.hbs', jsonData);
});

module.exports = router;
