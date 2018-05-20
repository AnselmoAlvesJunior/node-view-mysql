var express = require('express')
var app = express()
 
var mysql = require('mysql')

var myConnection  = require('express-myconnection') 
var config = require('./config')
var dbOptions = {
    host:      config.database.host,
    user:       config.database.user,
    port:       config.database.port, 
    database: config.database.db
}
app.use(myConnection(mysql, dbOptions, 'pool'))
 
app.set('view engine', 'ejs')
 
var index = require('./rotas/index')
var produto = require('./rotas/produto')
 
 
var expressValidator = require('express-validator')
app.use(expressValidator())
 
 
 
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
 
 
var methodOverride = require('method-override')
 
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    
    var method = req.body._method
    delete req.body._method
    return method
  }
}))
 
var flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');
 
app.use(cookieParser('keyboard cat'))
app.use(session({ 
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
app.use(flash())
 
 
app.use('/', index)
app.use('/produto', produto)
 
app.listen(3000, function(){
    console.log('servidor rodando na porta 3000: http://127.0.0.1:3000')
})
