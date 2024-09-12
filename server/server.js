const express = require('express');

const app = express();

app.get('/',(req,res) =>{
    res.send({hi:'welcome'})
   console.log('test the console log! im Maslak Server.js working');
});

app.listen(5000);