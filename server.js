'use strict';

const express = require('express');

const app = express();

// Load array of notes
const data = require('./db/notes');

console.log('Hello Noteful!');


app.use(express.static('public'));

app.get('/api/notes', function(req,res){
    if(req.query.searchTerm === undefined){
        res.json(data)}
    else{
        res.json(data.filter(function(item){
            return item.title.includes(req.query.searchTerm)
            })
        )
    }
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
