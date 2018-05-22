'use strict';

const express = require('express');

const app = express();

// Load array of notes
const data = require('./db/notes');
const {PORT} = require('./config');
const {logger} = require('./middleware/logger')


app.use(logger);

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




app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.status(404).json({ message: 'Not Found' });
  });

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});


app.listen(PORT, function(){
    console.info(`Server listening on ${this.address().port}`)
}).on('error', err => {
    console.error(err)    
});
