import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import User from '../models/User';

const { expect } = chai;
chai.use(chaiHttp);

describe('Auth API', () => {
  before(async () => {
    // Cleanup database
    await User.deleteMany({});
  });

  it('should register a new user', (done) => {
    chai.request(app)
      .post('/auth/register')
      .send({ name: 'Test User', email: 'testuser@example.com', password: 'password123' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('user');
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('should log in a user', (done) => {
    chai.request(app)
      .post('/auth/login')
      .send({ email: 'testuser@example.com', password: 'password123' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('user');
        expect(res.body).to.have.property('token');
        done();
      });
  });
});
