const Bootcamp = require('../database/models/Bootcamp');
const request = require('supertest');
const expect = require('chai').expect;
const app = require("../server");

//Setup Data
const bootcamps = [
  {
    name: "LIFE",
    description: "Is coding your passion? Codemasters will give you the skills and the tools to become the best developer possible. We specialize in front end and full stack web development",
    website: "https://devcentral.com",
    phone: "(444) 444-4444",
    email: "enroll@devcentral.com",
    address: "45 Upper College Rd Kingston RI 02881",
    careers: [
      "Mobile Development",
      "Web Development",
      "Data Science",
      "Business"
    ]
  },

  {
    name: "TEST BOOTCAMP",
    description: "Is coding your passion? Codemasters will give you the skills and the tools to become the best developer possible. We specialize in front end and full stack web development",
    website: "https://devcentral.com",
    phone: "(444) 444-4444",
    email: "enroll@devcentral.com",
    address: "45 Upper College Rd Kingston RI 02881",
    careers: [
      "Mobile Development",
      "Web Development",
      "Data Science",
      "Business"
    ]
  }
];


  describe('Test Suite for Bootcamp CRUD functionality', () => {
    //Tear down DB before test
    beforeEach( (done) => {
      Bootcamp.deleteMany({}, (err) => {
     });
     done();
   });

    describe('/GET/bootcamps', () => {
      it('should fetch all bootcamps from db', (done) => {
          Bootcamp.insertMany(bootcamps);
            request(app)
              .get('/api/v1/bootcamps')
              .end((err, res) => {
                 expect(res.status).to.equal(200);
                 expect(res.body).to.have.property('success');
                 expect(res.body).to.have.property('success').eql(true);
                 expect(res.body).to.have.property('count').eql(bootcamps.length);
        });
        done();
      });
    });


   describe('/GET/:id bootcamp', () => {
     it('should fetch a single bootcamp from db by ID', (done) => {
        let bootcamp = new Bootcamp({
          name: "LIFE",
          description: "Is coding your passion? Codemasters will give you the skills and the tools to become the best developer possible. We specialize in front end and full stack web development",
          website: "https://devcentral.com",
          phone: "(444) 444-4444",
          email: "enroll@devcentral.com",
          address: "45 Upper College Rd Kingston RI 02881",
          careers: [
            "Mobile Development",
            "Web Development",
            "Data Science",
            "Business"
          ]
        });

        bootcamp.save();
          request(app)
            .get('/api/v1/bootcamps/' + bootcamp.id)
            .send(bootcamp)
            .end((err, res) => {
               expect(res.status).to.equal(200);
               expect(res.body).to.have.property('success');
               expect(res.body).to.have.property('success').eql(true);
               expect(res.body).to.have.property('data');
        });
        done();
      });
    });


    describe('/PUT/:id bootcamp', () => {
      it('should update bootcamp from db by ID', (done) => {
        let bootcamp = new Bootcamp({
          name: "UPDATE TEST",
          description: "Is coding your passion? Codemasters will give you the skills and the tools to become the best developer possible. We specialize in front end and full stack web development",
          website: "https://devcentral.com",
          phone: "(444) 444-4444",
          email: "enroll@devcentral.com",
          address: "45 Upper College Rd Kingston RI 02881",
          careers: [
            "Mobile Development",
            "Web Development",
            "Data Science",
            "Business"
          ]
        });

        bootcamp.save();
            request(app)
              .put('/api/v1/bootcamps/' + bootcamp.id)
              .send({ email: 'email@test.com'}, { new: true, runValidators: true})
              .end((err, res) => {
                 expect(res.status).to.equal(200);
                 expect(res.body).to.have.property('success');
                 expect(res.body).to.have.property('success').eql(true);
        });
        done();
      });
    });

    describe('/DEL/:id bootcamp', () => {
      it('should delete bootcamp from db by ID', (done) => {
        let bootcamp = new Bootcamp({
          name: "DB",
          description: "Is coding your passion? Codemasters will give you the skills and the tools to become the best developer possible. We specialize in front end and full stack web development",
          website: "https://devcentral.com",
          phone: "(444) 444-4444",
          email: "enroll@devcentral.com",
          address: "45 Upper College Rd Kingston RI 02881",
          careers: [
            "Mobile Development",
            "Web Development",
            "Data Science",
            "Business"
          ]
        });

        bootcamp.save();
            request(app)
              .delete('/api/v1/bootcamps/' + bootcamp.id)
              .end((err, res) => {
                 expect(res.status).to.equal(200);
                 expect(res.body).to.have.property('success');
                 expect(res.body).to.have.property('success').eql(true);
        });
        done();
      });
    });
});