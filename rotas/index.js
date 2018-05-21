var express = require('express')
var app = express()

app.get('/', function(req, res) {
	res.render('index', {title: 'Cadastro de produtos'})
})


module.exports = app;
