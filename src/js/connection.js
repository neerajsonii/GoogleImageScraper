const mongoose = require('mongoose');

// connect to mongo db
mongoose.connect('mongodb://admin:admin123@ds147864.mlab.com:47864/darwin_task');

mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connection established...')
});
var image_table = mongoose.Schema({
    keyword: String,
    image_url: Array,
    new_url:String
});
var image_table = mongoose.model('image_table', image_table);

module.exports = image_table;
