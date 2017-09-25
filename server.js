var express = require('express');
var routes = require('./src/js/api.js'); // FOR API
var bodyParser = require('body-parser');
var path = require('path');
var PORT = 3100;

app = express();

var origins = ["http://localhost:3100", "http://localhost:3000"];

app.get('/*', function(req, res, next) {
    origins.forEach(function(val, key) {
    res.header("Access-Control-Allow-Origin", val);
    })
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.header('Access-Control-Allow-Credentials', true);
    next();

});

app.get('',function(req, res) {
            res.sendFile(path.join(__dirname, '/src/index.html'));
        });

// Mioddleware for accessing body
app.use(bodyParser.json());


// initialise Apis

app.use('/api', routes);

//console.log(routes(app));
app.use('/node_modules', express.static('node_modules'));
app.use('/src', express.static('src'));
app.use('/data_images', express.static('data_images'));

app.listen(process.env.port || PORT, function() {
    console.log(`Server is running at port - ${PORT}`);
});