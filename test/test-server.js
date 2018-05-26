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

  it('GET to .../[ID] should respond with a note object', function(){

    return chai.request(app)
      .get('/api/notes')
      .then(function(res){
        return chai.request(app)
          .get(`/api/notes/${res.body[0].id}`);
      })
      .then(function(res){
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.keys(['id','title','content']);
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

  it('POST to .../ should return an error if no title is provided, and should not create object', function(){

    return chai.request(app)
      .post('/api/notes')
      .send({content: 'this should\'t get added'})
      .then(function(res){
        expect(res).to.have.status(400);
        return chai.request(app)
          .get('/api/notes/')
          .query({searchTerm: 'this should\'t get added'});
      })
      .then(function(res){
        expect(res.body.length).to.equal(0);
      });
  });



  it('GET to .../ with search query should return a subset of notes', function(){

    const uniqueString = '134pud918398yf139oivjadsfyprtapfodig09';
    return chai.request(app)
      .get('/api/notes/')
      .query({searchTerm: `${uniqueString}`})
      .then(function(res){
        expect(res.body.length).to.equal(0);
        return chai.request(app)
          .post('/api/notes')
          .send({title: `${uniqueString}`, content: 'find this note'});
      })
      .then(function(){
        return chai.request(app)
          .get('/api/notes/')
          .query({searchTerm: `${uniqueString}`});
      })
      .then(function(res){
        expect(res).to.have.status(200);
        expect(res.body[0].content).to.equal('find this note');        
      });
  });



  it('PUT to /[ID] should edit a note', function(){
    
    let objId;
    return chai.request(app)
      .get('/api/notes')
      .then(function(res){
        objId = res.body[0].id;

        return chai.request(app)
          .put(`/api/notes/${objId}`)       
          .send({content: 'new note content'});
      })
      .then(function(res){
        expect(res).to.have.status(200);
        expect(res.body.content).to.equal('new note content');

        return chai.request(app)
          .get(`/api/notes/${objId}`);
      })
      .then(function(res){
        expect(res.body.content).to.equal('new note content');
      });

  });

  it('PUT to /[BADID] should return Error', function(){

    return chai.request(app)
      .put('/api/notes/thisIsNotAGoodIdString')
      .send({content: 'this does not matter'})
      .then(function(res){
        expect(res).to.have.status(400);
      });
  });

  it('DELETE to /[ID] should delete a note', function(){

    let objId;
    return chai.request(app)
      .get('/api/notes')
      .then(function(res){
        objId = res.body[0].id;
        return chai.request(app)
        .delete(`/api/notes/${objId}`)
      })
      .then(function(res){
        expect(res).to.have.status(204);
        return chai.request(app)
          .get(`/api/notes/${objId}`)
      })
      .then(function(res){
        expect(res).to.have.status(404);
      });
  });
});





