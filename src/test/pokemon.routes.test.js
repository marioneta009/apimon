import request from 'supertest';
import app from '../index.js';
import { expect } from 'chai';

describe('GET /:name', () => {
    it('should retrieve and save a pokemon by name', (done) => {
        const name = 'ponyta'; // Replace with the name of the Pokemon you want to retrieve and save
        request(app)
            .get(`/${name}`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('name');
                expect(res.body).to.have.property('moves');
                expect(res.body).to.have.property('types');
                done();
            });
    });
});

describe('GET /', () => {
    it('should return a list of pokemons', (done) => {
        request(app)
            .get('/')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.a('array');
                done();
            });
    });
});

describe('DELETE /free/:name', () => {
    it('should delete a pokemon by name', (done) => {
        const name = 'ponyta'; // Replace with the name of the Pokemon you want to delete
        request(app)
            .delete(`/free/${name}`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.message).to.include("Pokemon deleted successfully"); // Adjust this according to your response
                done();
            });
    });
});