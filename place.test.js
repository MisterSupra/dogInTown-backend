const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./app');


//Test la route get pour accéder à tous les lieux dans la base de donnée
it('GET /', async () => {
    const res = await request(app).get('/places');

    expect(res.statusCode).toBe(200); //Attends un code status 200
    expect(res.body.result).toBe(true); //Attends une valeur truthy dans .result
});


afterAll(() => {
    mongoose.connection.close();
});
