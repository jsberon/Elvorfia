var express = require('express');
var router = express.Router();

/* GET home page. */
// eslint-disable-next-line no-unused-vars
router.get('/', function(req, res, next) {
    var context = {
        title: 'Elvorfia',
    };
    res.render('home/home.hbs', context);
});

module.exports = router;
