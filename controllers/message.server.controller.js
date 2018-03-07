'use strict'
var Message = require('../models/message.server.model');

function create(req, res) {
		
			var message = new Message();
			message.text = req.body.text;
			message.from = req.payload.user._id;
			message.to 	 = req.body.to;
			message.save().then((result)=>{
				res.status(200).send({
					message: result //when created need to render to user
			});	
		}).catch(err=>{ return err})
}

function listMessages(req,res){
	Message.find({'$or':[{
			'$and':[{'from':req.payload.user._id},{'to':req.body.other}]
		},{
			'$and':[{'to':  req.payload.user._id},{'from': req.body.other}]
		}]}).sort({'created':1}).exec((err, messages) => {
        if (err) 
            return res.status(400).send({
                err: err
            });
       res.json(messages);
    
    });
}


module.exports = {
	create,
	listMessages,
};