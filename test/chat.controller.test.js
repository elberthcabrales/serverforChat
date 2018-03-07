// Load the test dependencies
// Load the test dependencies
const app = require('./../app');
const supertest = require('supertest');
const should = require('should');
const faker = require('faker');

var server = supertest.agent("http://localhost:4500/");
let elberth, ana, idToRemove=null;
before((done) => {		
    server.post('api/user/login')
        .send({email:"elberthcabrales@gmail.com",password:"cabrales"})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            elberth={user:res.body.user,token:res.body.token};
            //console.log(elberth)
            res.status.should.equal(200);
        });
    server.post('api/user/login')
        .send({email:"ana@gmail.com",password:"cabrales"})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            ana={user:res.body.user,token:res.body.token};
            //console.log(ana)
            res.status.should.equal(200);
            done();
        });
        
});
		
describe('User unit test for controller:', (done) => {
    it('Get all users without removed',(done) => {

        server.get('api/user/removed')
            .set('Accept', 'application/json')
            .set('Authorization', elberth.token)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res)=>{
            })
            .end((err, res) => {
                res.status.should.equal(200);
                done();
            });
    });
    it('Get info from user by Id',(done) => {
        server.get('api/user/detail/'+ana.user._id)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {      
                    res.body.should.have.property('username', "ana");
                    done();
                });
    });
    it('Create user',(done) => {
        let name =faker.name.findName();
        server.post('api/user')
            .send({username:name, email:faker.internet.email(),password:'cabrales' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res)=>{
                res.body.user.name.should.equal(name);
                
            })
            .end((err, res) => {
                res.status.should.equal(200);
                idToRemove = res.body.user._id;
                done();
            });
    });
    it('mark user as removed',(done) => {
        let name =faker.name.findName();
        server.delete('api/user/'+idToRemove)
            .set('Accept', 'application/json')
            .set('Authorization', elberth.token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                res.status.should.equal(200);
                done();
            });
    });
    it('update user by id',(done) => {
        let name =faker.name.findName();
        server.put('api/user/'+idToRemove)
            .send({username:name, email:faker.internet.email(),password:'cabrales' })
            .set('Accept', 'application/json')
            .set('Authorization', elberth.token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                res.status.should.equal(200);
                done();
            });
    });
    it('Change password',(done) => {
       
        server.put('api/user/changepw/'+elberth.user._id)
            .send({password:'cabrales'})
            .set('Accept', 'application/json')
            .set('Authorization', elberth.token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                res.status.should.equal(200);
                done();
            });
    });
    
});

describe('Message unit test for controller:', (done) => {
    it('Create message from Ana to Elberth',(done) => {
        server.post('api/message')
            .set('Accept', 'application/json')
            .send({text:"Hola elberth mi amor no te deje en visto!", from: ana.user._id, to: elberth.user._id})
            .set('Authorization', ana.token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                res.status.should.equal(200);
                done();
            });
    });

    it('Elberth get in chat with ana',(done) => {
        server.post('api/getmessage')
            .set('Accept', 'application/json')
            .send({to:ana.user._id})
            .set('Authorization', elberth.token)
            .expect('Content-Type', /json/)
            .expect(200)
           // .expect((res)=>{
           //     res.body[0].email.should.equal(elberth.user._id);
           // })
            .end((err, res) => {
                //res.body.should.have.property('to', ana.user._id);
                done();
            });
    });
});