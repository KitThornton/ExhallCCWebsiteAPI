var express = require('express'),
    router = express.Router(),
    pool = require("../DB.js");

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
