var express = require('express');
var app = express();
const myModule = require('./myModule.js')
const port = 3000;

app.get('/', function (req, res){
    res.send('hello world')
});

app.listen(port, () =>  {
    console.log("Sever listening at http://localhost:" + port);

});