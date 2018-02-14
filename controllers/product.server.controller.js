'use strict'
var Product = require('../models/product.server.model');


function create(req, res) {
		
			var product = new Product(req.body);
			product.save().then((result)=>{
				res.status(200).send({
						product: result
			});	
		}).catch(err=>{ return err})
}
function findById(req, res, next, id) {
		Product.findById(id).exec((err, product)=>{
			if(err) return res.status(500).send({err:err})
			req.product = product
			next();
		})
}
function update(req, res){
	
	let product = req.product
	if(req.body.nombre){
		product.nombre= req.body.nombre
		product.save().then((result)=>{
			res.status(200).send({product:result})
		}).catch(err=>{ return err})
	}else{
		return res.status(204).send({message:"no content!"})
	}
}
function remove(req,res){
	let product = req.product;
	product.remove().then((removed)=>{
			res.status(200).send({product:removed})
	}).catch(err=>{ return err})
}

function list(req,res){
	Product.find().exec((err, products) => {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else { 
            res.json(products);
        }
    });
}
function show(req, res){
	let prodcut = req.prodcut;
	if(product){
		 res.json(product);
	}else{
		return res.status(204).send({message:"no content!"})
	}
}

module.exports = {
	create,
	findById,
	remove,
	list,
	show,
	update
};