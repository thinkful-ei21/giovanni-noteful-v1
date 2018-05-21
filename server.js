'use strict';

const express = require('express');

const app = express();

// Load array of notes
const data = require('./db/notes');

console.log('Hello Noteful!');


app.use(express.static('public'));

app.get('/api/notes', function(req,res){
    res.json(data);
    //console.log(data)
});

app.get('/api/notes/:id', function(req,res){
    const {id} = req.params;
    const found = data.find(function(item){
        return item.id == id});
    res.json(found);
});



app.listen(8080, function(){
    console.info(`Server listening on ${this.address().port}`)
}).on('error', err => {
    console.error(err)    
});
