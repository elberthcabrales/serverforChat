// Load the test dependencies
const supertest = require('supertest');
const should = require('should');

const faker = require('faker');
var server = supertest.agent("http://localhost:4500/");

before((done) => {		
		
		server.post('api/')
			.send({cat_prec_id:faker.random.number(),nombre:faker.name.findName(), precio: faker.finance.amount()})
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end((err, res) => {
				res.status.should.equal(200);
				done();
			});
			
});
		


describe('unit test for Productcontroller:', (done) => {
		
    it('List Product with method get',(done) => {
        server.get('api/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    res.body.should.be.an.Array()
                    //cuando se retorna un json no tiene status en res
                    done();
                });
    });
    
});