var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Muestra = require('../models/Muestra.js');
var login = require('../routes/login.js');

module.exports = router; 


//obtiene todas las muestras del sistema
router.get('/muestras', login.checkLaboratorista, function(req, res, next){
	Muestra.find(function(err, muestras){
		if(err){
			return next(err);
		}
		res.json(muestras);
	});
});

//crea una nueva muestra
router.post('/muestra', login.checkOperario, function(req, res, next){
	var muestra = new Muestra(req.body);

	muestra.save(function(err, muestra){
		if(err){
			return next(err);
		}
		res.json(muestra);
	});
});

//actualiza una muestra
router.put('/muestra/:id', login.checkOperario,function(req, res){
	Muestra.findById(req.params.id, function(err, muestra){
		muestra.tipo = req.body.tipo;
		muestra.cod_barras= req.body.cod_barras;
		muestra.recibido = req.body.recibido;

		muestra.save(function(err){
			if(err){
				res.send(err);
			}
			res.json(muestra);
		});
	});
});

//Delete
router.delete('/muestra/:id', login.checkOperario, function(req, res, next){
	Muestra.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.send(err);
		}
		res.json({mensaje: 'la muestra se elimino'});
	});
});


router.patch('/muestra/:id', login.checkOperario, function(req, res){
	Muestra.findById(req.params.id, function(err, muestra){
		muestra.recibido = req.body.recibido;
		muestra.save(function(err){
			if(err){
				res.send(err);
			}
			res.json(muestra);
		});
	});
});