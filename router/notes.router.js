'use strict';

const express = require('express');

const router = express.Router();

const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);



router.get('', function(req,res,next){
  const searchTerm = req.query.searchTerm;
  
  notes.filter(searchTerm, (err, list) =>{
    return err ? next(err) : res.json(list)
  })
});
  
  
router.get('/:id', function(req, res, next){
  const {id} = req.params;
  notes.find(id, (err, item) =>{
    return err ? next(err) : res.json(item)
  })
});
  
//updates a note
router.put('/:id', function(req, res, next){
      
  
  const id = req.params.id;
  
  const updateObj = {};
  const updateFields = ['title', 'content'];
  
  updateFields.forEach(field =>{
    if(field in req.body){updateObj[field] = req.body[field]}
  });
  //    console.log(updateObj);
  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  })
  
});



module.exports = router;