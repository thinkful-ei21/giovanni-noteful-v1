'use strict';

const express = require('express');

const router = express.Router();

const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);



router.get('', function(req,res,next){
  const searchTerm = req.query.searchTerm;
  notes.filter(searchTerm)
    .then(list => res.json(list))
    .catch(next);  

});
  
  
router.get('/:id', function(req, res, next){
  const {id} = req.params;
  notes.find(id)


    .then(item =>  item ? res.json(item) : next() )
    .catch(next);
});
  
//updates a note
router.put('/:id', function(req, res, next){
  const id = req.params.id;
  const updateObj = {};
  const updateFields = ['title', 'content'];
  
  updateFields.forEach(field =>{
    if(field in req.body){updateObj[field] = req.body[field];}
  });
  notes.update(id, updateObj)
    .then( function(item){
      if(item === null){res.status(400).send('no matching ID')}
      else{
        res.json(item);  
      }})
    .catch(next);

});

router.delete('/:id', function(req,res, next){
  notes.delete(req.params.id)
    .then(res.status(204).end())
    .catch(next);

});

router.post('', function(req, res, next){
  if(!req.body.title){
    const err = new Error('missing title in request body');
    err.status = 400;
    next(err);
  }
  else{const newObj= {'title': req.body.title, 'content':req.body.content};

    notes.create(newObj)
      .then(item => res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item))
      .catch(next);
  }
});
    

module.exports = router;