var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Muestra = require('../models/Muestra.js');
var Centro = require('../models/CentroMedico.js');
var Laboratorio = require('../models/Laboratorio.js');
var Paciente = require('../models/Paciente.js');
var login = require('../routes/login.js');

module.exports = router; 


//obtiene todas las muestras del sistema
router.get('/muestras', login.checkLaboratorista, function(req, res, next){
	Muestra.find()
	.populate('_paciente')
	.populate('_laboratorio')
	.populate('_centro')
	.exec(function(err, muestras){
		if(err){
			return next(err);
		}
		res.json(muestras);
	});
});

router.get('/muestra/:id', login.checkLaboratorista, function(req, res, next){
	Muestra.find({_id: req.params.id})
	.populate('_paciente')
	.populate('_laboratorio')
	.populate('_centro')
	.exec(function(err, doc){
		if(err){
			return next(err);
		}
		res.json(doc);
	});
});

//crea una nueva muestra
router.post('/muestra', login.checkOperario, function(req, res, next){

	var cod_barras = Math.floor(Math.random() * (99999999 - 11111111 + 1)) + 11111111;//genera cadena aleatoria

	var muestra = new Muestra({
		tipo: req.body.tipo,
		cod_barras: cod_barras,
		_paciente: req.body.paciente,
		_laboratorio: req.body.laboratorio,
		_centro: req.body.centro
	});

	Laboratorio.findOne({_id: req.body.laboratorio}, function(err, lab){
		lab.muestras.push(muestra);
		lab.save();
	});

	Centro.findOne({_id: req.body.centro}, function(err, centro){
		centro.muestras.push(muestra);
		centro.save();
	});

	Paciente.findOne({_id: req.body.paciente}, function(err, paciente){
		paciente.muestras.push(muestra);
		paciente.save();
	});

	muestra.save(function(err, doc){
		if (err) {
			return res.json(err);
		} else {
			res.json(doc);
		}
	});
});

//Se actualiza una mueestra medica
router.put('/muestra/:id', login.checkOperario,function(req, res){
	Muestra.findOne({ _id: req.params.id}, function(err, muestra){
		muestra._paciente = req.body.paciente;
		muestra._laboratorio= req.body.laboratorio;
		muestra._centro = req.body.centro;
		muestra.tipo = req.body.tipo;

		muestra.save(function(err){
			if(err){
				res.send(err);
			}
			res.json({message: 'La muestra se edito'});
		});
	});
});

//Se elimina una muestra medica
router.delete('/muestra/:id', login.checkOperario, function(req, res, next){
	Muestra.findOne({ _id: req.params.id}, function(err, muestra){
		muestra.remove();
		res.json({message: 'la muestra se elimino'});
	});
});

//Metodo que elimina todas las muestras medicas
router.delete('/muestras', login.checkOperario, function(req, res, next){
	Muestra.remove({}, function(err){
		if(err){
			res.send(err);
		}
		res.json({mensagee: 'las muestras se eliminaron'});
	});
});

//metodo que cambia la fecha de la muestra
router.put('/muestra/:id/fecha', function(req, res){
	Muestra.findOne({_id: req.params.id}, function(err, muestra){
		muestra.fecha = req.body.fecha;
		muestra.save(function(err){
			if(err){
				res.send(err);
			}
			res.json({message: 'Se actualizo la fecha de la muestra'});
		});
	});
});

//metodo que cambia el estado de una muestra a "en proceso"
router.put('/muestra/:id/observacion', login.checkOperario, function(req, res){
	Muestra.findOne({_id: req.params.id}, function(err, muestra){
		muestra.observacion = req.body.observacion;
		muestra.save(function(err){
			if(err){
				res.send(err);
			}
			res.json({message: 'Se actualiza la observacion de la muestra'});
		});
	});
});

//metodo que cambia el estado de una muestra a "en proceso"
router.put('/muestra/:id/estado/registrada', login.checkOperario, function(req, res){
	Muestra.findOne({_id: req.params.id}, function(err, muestra){
		muestra.estado = "registrada";
		muestra.save(function(err){
			if(err){
				res.send(err);
			}
			res.json({message: 'Muestra REGISTRADA'});
		});
	});
});

//metodo que cambia el estado de una muestra a "en proceso"
router.put('/muestra/:id/estado/proceso', login.checkOperario, function(req, res){
	Muestra.findOne({_id: req.params.id}, function(err, muestra){
		muestra.estado = "en proceso";
		muestra.save(function(err){
			if(err){
				res.send(err);
			}
			res.json({message: 'Muestra EN PROCESO'});
		});
	});
});

//metodo que cambia el estado de una muestra a "finalizado"
router.put('/muestra/:id/estado/finalizado', login.checkOperario, function(req, res){
	Muestra.findOne({_id: req.params.id}, function(err, muestra){
		muestra.estado = "finalizado";
		muestra.save(function(err){
			if(err){
				res.send(err);
			}
			res.json({message: 'Muestra FINALIZADA'});
		});
	});
});


