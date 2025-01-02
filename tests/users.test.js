const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const token = 'hm26UmcAl22HW6yjYnfiddWUet1PGAt6'
//Test pour accéder à un user via son token
it('GET /', async () => {
    const res = await request(app).get(`/users/${token}`);
    expect(res.statusCode).toBe(200); // On attend true et 200.
    expect(res.body.result).toBe(true); 
});


afterAll(() => {
    mongoose.connection.close();
});