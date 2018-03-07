// Load the test dependencies
// Load the test dependencies
const app = require('./../app');
const supertest = require('supertest');
const should = require('should');

var server = supertest.agent("http://localhost:4500/");
let elberth, ana=null;
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
                //res.body.email.should.equal(admin.email);
            })
            .end((err, res) => {
                res.status.should.equal(200);
                done();
            });
    });
   
});