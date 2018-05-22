'use strict';

const express = require('express');

const app = express();

// Load array of notes
const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);


const {PORT} = require('./config');
const {logger} = require('./middleware/logger')


app.use(logger);
app.use(express.static('public'));
app.use(express.json())



app.get('/api/notes', function(req,res,next){
    const searchTerm = req.query.searchTerm;

    notes.filter(searchTerm, (err, list) =>{
        return err ? next(err) : res.json(list)
    })
});


app.get('/api/notes/:id', function(req,res){
    const {id} = req.params;
    notes.find(id, (err, item) =>{
        console.log(item)
        return err ? next(err) : res.json(item)
    })
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
