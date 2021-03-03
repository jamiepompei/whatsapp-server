var express = require('express');
var router = express.Router();
let Chat = require('../models/chat.model');

router.get('/', (req, res)=>{
    Chat.find({})
    .populate('messages')
    .exec((err, resp)=>{
        if(err) res.status(500).send(err);
        res.status(200).send(resp);
    })
})

router.post('/', (req, res)=>{
    let newChat = new Chat(req.body);
    newChat.save((err, resp)=>{
        if(err) res.status(500).send(err);
        res.status(201).send(resp);
    })
})

module.exports = router;