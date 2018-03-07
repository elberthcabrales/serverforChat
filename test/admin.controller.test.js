
// Load the test dependencies
const app = require('../../app');
const supertest = require('supertest');
const should = require('should');
const User = require('../../models/user.server.model');
const Carreer = require('../../models/carreer.server.model');
const Subject = require('../../models/subject.server.model');
const Classroom = require('../../models/classroom.server.model');
const Theme = require('../../models/theme.server.model');
const Forum = require('../../models/forum.server.module');
const Answare = require('../../models/answare.server.model');

const faker = require('faker');

var server = supertest.agent("http://localhost:3000/");
let logged;
let student;
//to run the Controller Test need it run ini to create elberthcabrales@gmail.com
before((done) => {		
		server.post('api/logIn')
			.send({email:"elberthcabrales@gmail.com",password:"cabrales"})
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end((err, res) => {
				logged={user:res.body.user,token:res.body.token};
				res.status.should.equal(200);
			});
		server.post('api/logIn')
			.send({email:"student@gmail.com",password:"cabrales"})
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end((err, res) => {
				student={user:res.body.user,token:res.body.token};
				//console.log(student)
				res.status.should.equal(200);
				done();
			});
			
});
		

describe('Admin unit test for controller:', (done) => {
	describe('Users unit test for controller:', (done) => {
		it('Create admin and return email and role with token',(done) => {
			// Create a SuperTest request
			let admin = new User({
				name: {first:faker.name.findName(), second: faker.name.findName()},
				surname: {first: faker.name.lastName(), second:'cabrales'},
				email: faker.internet.email(),
				role: "student",
				image: faker.image.avatar(),
				phone:faker.phone.phoneNumber('###-###-##-##'),
				address: faker.address.streetAddress(),
				about: faker.lorem.words(5),
				status: true,
				password: 'cabrales',
				curp: 'CAGE890505HNTBTL04'
			});
			/**
			 * permission requiered isAdmin
			 * headders Authorization
			 */
			server.post('api/user')
				.send(admin)
				.set('Accept', 'application/json')
				.set('Authorization', logged.token)
				.expect('Content-Type', /json/)
				.expect(200)
				.expect((res)=>{
					res.body.email.should.equal(admin.email);
					res.body.role.should.equal(admin.role);
				})
				.end((err, res) => {
					res.status.should.equal(200);
					done();
				});
		});
		it('Get all users for panel admin with pagination',(done) => {
			server.post('api/')
				.send({page:1,limit:10, query:{role:'student'}}) //si quiero todos solo deja query en vacio
				.set('Accept', 'application/json')
				.set('Authorization', logged.token)
				.expect('Content-Type', /json/)
				.end((err, res) => {
					//console.log(res.body.users)
					should.equal(res.status,200)
					done();
			});
		});
		/**params user._id
		 * permission requiered student
		 * headders Authorization
		 * Esta prueba edita un usuario y checa si ese admin es el propietario
		 */
		it('Edit admin by id',(done) => {
			server.put('api/user')
			.send({phone:'3231304458'})
			.set('Accept', 'application/json')
			.set('Authorization', logged.token)
			.expect('Content-Type', /json/)
			.end((err, res) => {
				should.equal(res.status,200)
				done();
			});
		});

		it('Soft Delete for users',(done) => {
			User.findOne({email:'teacher@gmail.com'}).exec((err,user)=>{
				server.delete('api/user')
				.send({id:user._id})
				.set('Accept', 'application/json')
				.set('Authorization', logged.token) //necesita ser admin para borrar usuarios
				.expect('Content-Type', /json/)
				.end((err, res) => {
					should.equal(res.status,200)
					done();
				});
			})
		});
		it('Restore when has soft deleted for users',(done) => {
			User.findOne({email:'teacher@gmail.com'}).exec((err,user)=>{
				server.post('api/user/restore')
				.send({id:user._id})
				.set('Accept', 'application/json')
				.set('Authorization', logged.token) //necesita ser admin para borrar usuarios
				.expect('Content-Type', /json/)
				.end((err, res) => {
					should.equal(res.status,200)
					done();
				});
			})
		});
	});
	/**
	 * Pruebas para las carreras con rol de administrador
	 */
	describe('Carreer unit test for controller:', (done) => {
		it('Create Carreer with fake title',(done) => {
			
			let carreer = new Carreer({title:faker.name.jobTitle()});
			
			server.post('api/carreer')
				.send(carreer)
				.set('Accept', 'application/json')
				.set('Authorization', logged.token)
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
		it('Update carrer by id with params middleware',(done) => {
			Carreer.findOne().exec((err,carreer)=>{ //optiene el primero
				server.put('api/carreer/'+carreer._id)
						.send({title:"Derecho"})
						.set('Accept', 'application/json')
						.set('Authorization', logged.token)
						.expect('Content-Type', /json/)
						.expect(200)
						.expect((res)=>{
							//res.body.email.should.equal(admin.email);
						})
						.end((err, res) => {
							res.status.should.equal(200);
							done();
						});
			})
		});
		
		it('List carreer',(done) => {
			server.get('api/carreer')
					.set('Accept', 'application/json')
					.expect('Content-Type', /json/)
					.expect(200)
					.end((err, res) => {
						res.body.should.be.an.Array()
						res.body[0].should.have.property('title', "Derecho");
						//cuando se retorna un json no tiene status en res
						done();
					});
		});

		it('delete carrer by id with params middleware',(done) => {
			Carreer.findOne().exec((err,carreer)=>{ //optiene el primero
				server.delete('api/carreer/'+carreer._id)
						.set('Accept', 'application/json')
						.set('Authorization', logged.token)
						.expect('Content-Type', /json/)
						.expect(200)
						.expect((res)=>{
							//res.body.email.should.equal(admin.email);
						})
						.end((err, res) => {
							res.status.should.equal(200);
							done();
						});
			})
		});
		it('Suscribe students to carrer',(done) => {
			Carreer.findOne().exec((err,carreer)=>{ //optiene el primero
				User.findOne({role:"student"}).exec((err,user)=>{
				  server.post('api/carreer/suscription/'+carreer._id)
				  		.send({userId:user._id,role:user.role})
						.set('Accept', 'application/json')
						.set('Authorization', logged.token)
						.expect('Content-Type', /json/)
						.expect(200)
						.expect((res)=>{
							//res.body.email.should.equal(admin.email);
						})
						.end((err, res) => {
							res.status.should.equal(200);
							done();
						});
				})	
			});
		});
		it('Unsuscribe students to carrer',(done) => {
			Carreer.findOne().exec((err,carreer)=>{ //optiene el primero
				User.findOne({role:"student"}).exec((err,user)=>{
				  server.delete('api/carreer/suscription/'+carreer._id)
				  		.send({userId:user._id,role:user.role})
						.set('Accept', 'application/json')
						.set('Authorization', logged.token)
						.expect('Content-Type', /json/)
						.expect(200)
						.expect((res)=>{
							//res.body.email.should.equal(admin.email);
						})
						.end((err, res) => {
							res.status.should.equal(200);
							done();
						});
					})	
				});
		});
	});
	/**
	 * PRuebas para el controlador Subject(materia) con rol de administrador
	 */
	describe('Classroom unit test for controller:', (done) => {
		it('Create classroom with group name',(done) => {
				let classroom = new Classroom({
					group:"1A"
				});
				
				server.post('api/classroom')
					.send(classroom)
					.set('Accept', 'application/json')
					.set('Authorization', logged.token)
					.expect('Content-Type', /json/)
					.expect(200)
					.end((err, res) => {
						res.status.should.equal(200);
						done();
					});
		});
		it('Update Classroom by id with params middleware',(done) => {
			Classroom.findOne().exec((err,classroom)=>{ //optiene el primero
				server.put('api/classroom/'+classroom._id)
						.send({group:"1B"})
						.set('Accept', 'application/json')
						.set('Authorization', logged.token)
						.expect('Content-Type', /json/)
						.expect(200)
						.end((err, res) => {
							res.status.should.equal(200);
							done();
						});
			})
		});
		
		it('List classrrooms',(done) => {
			server.get('api/classroom')
					.set('Accept', 'application/json')
					.expect('Content-Type', /json/)
					.expect(200)
					.end((err, res) => {
						res.body.should.be.an.Array()
						res.body[0].should.have.property('group', "1B");
						//cuando se retorna un json no tiene status en res
						done();
					});
		});

		it('delete Classroom by id with params middleware',(done) => {
			Classroom.findOne().exec((err,classroom)=>{ //optiene el primero
				server.delete('api/classroom/'+classroom._id)
						.set('Accept', 'application/json')
						.set('Authorization', logged.token)
						.expect('Content-Type', /json/)
						.expect(200)
						.end((err, res) => {
							res.status.should.equal(200);
							done();
						});
			})
		});
	});
		/**
		 * Pruebas para el subject 
		 */
	describe('Subject unit test for controller:', (done) => {
		it('Subject  with fake title',(done) => {
			Carreer.findOne().exec((err,carreer)=>{ //optiene el primero
				let subject = new Subject({
					title:faker.name.title(),
					description: faker.lorem.words(10),
					carreer: carreer._id
				});
				
				server.post('api/subject')
					.send(subject)
					.set('Accept', 'application/json')
					.set('Authorization', logged.token)
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
		it('Update Subject by id with params middleware',(done) => {
			Subject.findOne().exec((err,subject)=>{ //optiene el primero
				server.put('api/subject/'+subject._id)
						.send({title:"matematicas discretas"})
						.set('Accept', 'application/json')
						.set('Authorization', logged.token)
						.expect('Content-Type', /json/)
						.expect(200)
						.end((err, res) => {
							res.status.should.equal(200);
							done();
						});
			})
		});
		
		it('List subjects',(done) => {
			server.get('api/subject')
					.set('Accept', 'application/json')
					.expect('Content-Type', /json/)
					.expect(200)
					.end((err, res) => {
						console.log()
						res.body.should.be.an.Array()
						res.body[0].should.have.property('title', "matematicas discretas");
						//cuando se retorna un json no tiene status en res
						done();
					});
		});

		
		it('Suscribe carreer to subject',(done) => {
			Subject.findOne().exec((err,subject)=>{ //optiene el primero
				Carreer.findOne().exec((err,carreer)=>{
			
				  server.post('api/subject/suscription/'+subject._id)
				  		.send({carreerId:carreer._id})
						.set('Accept', 'application/json')
						.set('Authorization', logged.token)
						.expect('Content-Type', /json/)
						.expect(200)
						.end((err, res) => {
							res.status.should.equal(200);
							done();
						});
				})	
			});
		});
		it('unSuscribe carreer to subject',(done) => {
			Subject.findOne().exec((err,subject)=>{ //optiene el primero
				Carreer.findOne().exec((err,carreer)=>{
				  server.delete('api/subject/suscription/'+subject._id)
				  		//.send({carreerId:carreer._id})
						.set('Accept', 'application/json')
						.set('Authorization', logged.token)
						.expect('Content-Type', /json/)
						.expect(200)
						.end((err, res) => {
							res.status.should.equal(200);
							done();
						});
				})	
			});
		});
		it('Add theme to subject',(done) => {
			Subject.findOne().exec((err,subject)=>{ //optiene el primero
				Theme.findOne().exec((err,theme)=>{
				  server.post('api/subject/theme/'+subject._id)
				  		.send({themeId:theme._id})
						.set('Accept', 'application/json')
						.set('Authorization', logged.token)
						.expect('Content-Type', /json/)
						.expect(200)
						.end((err, res) => {
							res.status.should.equal(200);
							done();
						});
				})	
			});
		});
		it('remove theme in subject',(done) => {
			Subject.findOne().exec((err,subject)=>{ //optiene el primero
				Theme.findOne().exec((err,theme)=>{
				  server.delete('api/subject/theme/'+subject._id)
				  		.send({themeId:theme._id})
						.set('Accept', 'application/json')
						.set('Authorization', logged.token)
						.expect('Content-Type', /json/)
						.expect(200)
						.end((err, res) => {
							res.status.should.equal(200);
							done();
						});
				})	
			});
		});
		it('delete subject by id with params middleware',(done) => {
			Subject.findOne().exec((err,subject)=>{ //optiene el primero
				server.delete('api/subject/'+subject._id)
						.set('Accept', 'application/json')
						.set('Authorization', logged.token)
						.expect('Content-Type', /json/)
						.expect(200)
						.end((err, res) => {
							res.status.should.equal(200);
							done();
						});
			})
		});
	});
	/**
	 * PRuebas para el theme
	 * 
	 */
	describe('Theme unit test for controller:', (done) => {
		it('theme with fake title',(done) => {
			Subject.findOne().exec((err,subject)=>{ //optiene el primero
				let theme = new Theme({
					title:faker.name.title(),
					subject: subject._id
				});
				
				server.post('api/theme')
					.send(theme)
					.set('Accept', 'application/json')
					.set('Authorization', logged.token)
					.expect('Content-Type', /json/)
					.expect(200)
					.end((err, res) => {
						res.status.should.equal(200);
						done();
					});
			});
		});
		it('Update Theme by id with params middleware',(done) => {
			Theme.findOne().exec((err,theme)=>{ //optiene el primero
				server.put('api/theme/'+theme._id)
						.send({title:"Metodos numericos 1"})
						.set('Accept', 'application/json')
						.set('Authorization', logged.token)
						.expect('Content-Type', /json/)
						.expect(200)
						.end((err, res) => {
							res.status.should.equal(200);
							done();
						});
			})
		});
		
		it('List themes',(done) => {
			server.get('api/theme')
					.set('Accept', 'application/json')
					.expect('Content-Type', /json/)
					.expect(200)
					.end((err, res) => {
						res.body.should.be.an.Array()
						res.body[0].should.have.property('title', "Metodos numericos 1");
						//cuando se retorna un json no tiene status en res
						done();
					});
		});

	
		it('delete theme by id with params middleware',(done) => {
			Theme.findOne().exec((err,theme)=>{ //optiene el primero
				server.delete('api/theme/'+theme._id)
						.set('Accept', 'application/json')
						.set('Authorization', logged.token)
						.expect('Content-Type', /json/)
						.expect(200)
						.end((err, res) => {
							res.status.should.equal(200);
							done();
						});
			})
		});
	});
});
describe('Averybody unit test for controller:', (done) => {
		//esta prueba tiene el token del usuario logueado arriba y con el middleware se saca su valor el cual tiene el id del usuario logeado
		it('Add forum to the students',(done) => {
			server.put('api/user')
				.send({phone:'3231304458'})
				.set('Accept', 'application/json')
				.set('Authorization', logged.token)
				.expect('Content-Type', /json/)
				.end((err, res) => {
					should.equal(res.status,200)
					done();
				});
		});
});

describe('Student unit test for controller:', (done) => {
		//esta prueba tiene el token del usuario logueado arriba y con el middleware se saca su valor el cual tiene el id del usuario logeado
		it('Any user can update his user data by id',(done) => {
			server.put('api/user')
			.send({phone:'3231304458'})
			.set('Accept', 'application/json')
			.set('Authorization', logged.token)
			.expect('Content-Type', /json/)
			.end((err, res) => {
				should.equal(res.status,200)
				done();
			});
		});
		
});

