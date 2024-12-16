const request = require('supertest');
require('dotenv').config();
const app = require('../app');
const User = require('../models/users');

// simulation de la database mangoDB
jest.mock('../models/users');
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue('Connected'),
  model: jest.fn().mockReturnValue({ findOne: jest.fn() }),
  Schema: jest.fn(),
}));

describe('GET /users/:token', () => {
  const token = 'testtoken';
  const mockUser = { username: 'test', email: 'test@gmail.com', token };
  it('devrait retourner les informations utilisateur via le token', async () => {

    User.findOne.mockResolvedValue(mockUser);

    const response = await request(app).get(`/users/${token}`);

    expect(response.status).toBe(200);
    expect(response.body.result).toBe(true);
    expect(response.body.profilUser).toEqual(mockUser);
  });
});