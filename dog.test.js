const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const app = require('./app'); // Import your Express app
const User = require('./models/users');

let mongoServer;

beforeAll(async () => {
  await mongoose.disconnect();
  mongoServer = await MongoMemoryServer.create();

  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('POST /users/connection', () => {
  let userEmail;
  let userPassword;
  let userToken;
  let userName;

  beforeEach(async () => {
    userName = 'Ranni';
    userEmail = 'ranni@mail.fr';
    userPassword = '123';
    userToken = '6lHCyi-6Vg8QDMhR3ZXBKlQNU070hQvS';

    const hashedPassword = bcrypt.hashSync(userPassword, 10);

    await User.create({
      email: userEmail,
      password: hashedPassword,
      token: userToken,
      username: userName,
    });
  });

  it('should return a token and username when login is successful', async () => {
    const response = await request(app)
      .post('/users/connection')
      .send({
        email: userEmail,
        password: userPassword,
      });

    expect(response.status).toBe(200);
    expect(response.body.result).toBe(true);
    expect(response.body.token).toBe(userToken);
    expect(response.body.username).toBe(userName);
  });

  it('should return an error if the email is missing', async () => {
    const response = await request(app)
      .post('/users/connection')
      .send({
        password: userPassword,
      });

    expect(response.status).toBe(200);
    expect(response.body.result).toBe(false);
    expect(response.body.error).toBe('Missing or empty fields');
  });

  it('should return an error if the password is incorrect', async () => {
    const response = await request(app)
      .post('/users/connection')
      .send({
        email: userEmail,
        password: 'wrongpassword',
      });

    expect(response.status).toBe(200);
    expect(response.body.result).toBe(false);
    expect(response.body.error).toBe('User not found or wrong password');
  });

  it('should return an error if the user is not found', async () => {
    const response = await request(app)
      .post('/users/connection')
      .send({
        email: 'nonexistent@example.com',
        password: userPassword,
      });

    expect(response.status).toBe(200);
    expect(response.body.result).toBe(false);
    expect(response.body.error).toBe('User not found or wrong password');
  });
});
