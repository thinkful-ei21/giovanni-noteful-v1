'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');

const expect = chai.expect;

chai.use(chaiHttp);



describe('express static', function(){

  it('GET request to / should return index.html', function(){
    return chai.request(app)
      .get('/')
      .then(function(res){
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });
});

describe('404 handler', function(){

  it('should respond with 404 to bad paths', function(){
    return chai.request(app)
      .get('/not/a/good/path')    
      .then(function(res){
        expect(res).to.have.status(404);
      });
  });
});


describe('requests to /api/notes...', function(){

  it('GET to .../ should respond  with a list of notes', function(){

    return chai.request(app)
      .get('/api/notes')
      .then(function(res){
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.be.above(0);

        res.body.forEach(function(note){
          expect(note).to.have.keys(['id','title','content']);
        });
      });
  });

  //   it('GET to .../ with search query should return a subset of notes', function(){

  //   });

  it('GET to .../[ID] should respond with a note object', function(){

    return chai.request(app)
      .get('/api/notes')
      .then(function(res){
        return chai.request(app)
          .get(`/api/notes/${res.body[0].id}`)
      })
      .then(function(res){
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.keys(['id','title','content'])
      });
  });

  it('GET to .../[BAD ID] should respond with 404', function(){

    return chai.request(app)
      .get('/api/notes/notARealId')
      .then(function(res){
        expect(res).to.have.status(404);
      });
  });

  it('POST to .../ should add a note', function(){

    return chai.request(app)
      .post('/api/notes')
      .send({title: 'test note name', content: 'test note content'})
      .then(function(res){
        expect(res).to.have.status(201);
        expect(res.header.location).to.exist;
        expect(res.body).to.have.keys(['id','title','content']);
        expect(res.header.location.includes(res.body.id)).to.be.true;
      });
  });

  it('POST to .../ should return an error if no title is provided', function(){

    return chai.request(app)
      .post('/api/notes')
      .send({content: 'this doesn\'t matter at all'})
      .then(function(res){
        expect(res).to.have.status(400);
      });
  });

  // it('PUT to /[ID] should edit a note')

  // it('DELETE to /[ID] should delete a note')

});





