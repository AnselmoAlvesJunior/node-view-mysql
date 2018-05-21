var express = require('express')
var app = express()

// mostra produtos
app.get('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM produto ORDER BY id DESC',function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('produto/list', {
					title: 'Lista de produtos', 
					data: ''
				})
			} else {
				// renderiza para views/prod/lista.ejs template 
				res.render('produto/list', {
					title: 'produto Lista', 
					data: rows
					})
				}
			})
		})
})

// mostra lista de produtos
app.get('/add', function(req, res, next){	
	// render to views/prod/add.ejs
	res.render('produto/add', {
		title: 'Adicionar novo produto',
		nome: '',
		marca: '',
		valor: ''		
	})
})

// adc novo produto por action
app.post('/add', function(req, res, next){	
	req.assert('nome', 'nome is required').notEmpty()           
	req.assert('marca', 'marca is required').notEmpty()             
    req.assert('valor', 'A valid valor is required').notEmpty()  

    var errors = req.validationErrors()
    
    if( !errors ) { 
		var produto = {
			nome: req.sanitize('nome').escape().trim(),
			marca: req.sanitize('marca').escape().trim(),
			valor: req.sanitize('valor').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO produto SET ?', produto, function(err, result) {
				if (err) {
					req.flash('error', err)
					
					res.render('produto/add', {
						title: 'Adiciona novo produto',
						nome: produto.nome,
						marca: produto.marca,
						valor: produto.valor					
					})
				} else {				
					req.flash('success', 'produto adicionado com sucesso!')
					
					// render to views/prod/add.ejs
					res.render('produto/add', {
						title: 'Adicionar produtos',
						nome: '',
						marca: '',
						valor: ''					
					})
				}
			})
		})
	}
	else {   
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
		
        res.render('produto/add', { 
            title: 'Adiciona novo produto',
            nome: req.body.nome,
            marca: req.body.marca,
            valor: req.body.valor
        })
    }
})

// Mostra produtos a serem editados
app.get('/edit/(:id)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM produto WHERE id = ' + req.params.id, function(err, rows, fields) {
			if(err) throw err
			
			if (rows.length <= 0) {
				req.flash('error', 'produto não encontrado id = ' + req.params.id)
				res.redirect('/produto')
			}
			else { 
				res.render('produto/edit', {
					title: 'Editar produto', 
					id: rows[0].id,
					nome: rows[0].nome,
					marca: rows[0].marca,
					valor: rows[0].valor					
				})
			}			
		})
	})
})


app.put('/edit/(:id)', function(req, res, next) {
	req.assert('nome', 'nome is required').notEmpty()          
	req.assert('marca', 'marca is required').notEmpty()          
    req.assert('valor', 'A valid valor is required').notEmpty()

    var errors = req.validationErrors()
    
    if( !errors ) {   
		
		
		var produto = {
			nome: req.sanitize('nome').escape().trim(),
			marca: req.sanitize('marca').escape().trim(),
			valor: req.sanitize('valor').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('UPDATE produto SET ? WHERE id = ' + req.params.id, produto, function(err, result) {
				if (err) {
					req.flash('error', err)
					
					res.render('produto/edit', {
						title: 'Editar produtos',
						id: req.params.id,
						nome: req.body.nome,
						marca: req.body.marca,
						valor: req.body.valor
					})
				} else {
					req.flash('success', 'produtos atualizados com sucesso!')
					
						res.render('produto/edit', {
						title: 'Editar produtos',
						id: req.params.id,
						nome: req.body.nome,
						marca: req.body.marca,
						valor: req.body.valor
				})
				}
			})
		})
	}
	else {   
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		
        res.render('produto/edit', { 
            title: 'Editar produtos',           
			id: req.params.id, 
			nome: req.body.nome,
			marca: req.body.marca,
			valor: req.body.valor
        })
    }
})

// DELETA TUDOOOO
app.delete('/delete/(:id)', function(req, res, next) {
	var produto = { id: req.params.id }
	
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM produto WHERE id = ' + req.params.id, produto, function(err, result) {
			
			if (err) {
				req.flash('error', err)
				res.redirect('/produto')
			} else {
				req.flash('success', 'Produto deletado com sucesso, id = ' + req.params.id)
				
				res.redirect('/produto')
			}
		})
	})
})

module.exports = app
