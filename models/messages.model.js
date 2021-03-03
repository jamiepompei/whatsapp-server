const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let message = new Schema(
    {
    message: String,
    time: String,
    chat_id: String,
    from: String,
    }
)

module.exports = mongoose.model('messages', message);
