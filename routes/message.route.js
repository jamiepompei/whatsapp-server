var express = require('express');
var router = express.Router();

let Message = require('../models/messages.model');
let Chat = require('../models/chat.model');

router.get('/', (req, res)=>{
    Message.find({})
    .exec((err, resp)=>{
        if(err) res.status(500).send(err);
        res.status(200).send(resp);
    })
})

router.post('/', (req, res)=>{
    let newMessage = new Message(req.body);
    newMessage.save((err, resp)=>{
        if(err){
            res.status(500).send(err);
        } else{
            //find the chat the message belongs to 
            // push message to the chat 
            Chat.findById(req.body.chat_id, (err, chat)=>{
                if(err) res.status(500).send(err);
                chat.messages.push(resp._id)
                chat.save((err, resp)=>{
                    if(err) res.status(500).send(err)
                    res.status(200).send(resp)
                })
            })
        }
    })
})

module.exports = router;