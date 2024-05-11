import request from 'supertest';
import { expect } from 'chai';
import { app } from '../src/index.js';
import Customer from '../src/models/customer.js';

const firstCustomer = {
  nombre: "Marta",
  apellido: "Díaz",
  nif: '51177772B',
  direccion: 'Calle Principal 123',
  telefono: '123456789'
};

const secondCustomer = {
  nombre: "Alicia",
  apellido: "Hernández",
  nif: '51177772X"',
  direccion: 'Calle Secundaria 456',
  telefono: '987654321'
};

beforeEach(async () => {
  await Customer.deleteMany({});
  await new Customer(firstCustomer).save();
});

describe('CUSTOMERS', function() {


  context('GET /customers', () => {
    it('Should get all customers', async () => {
      const response = await request(app).get('/customers').expect(200);
      expect(response.body.length).to.equal(1);
    });
  }).timeout(3000); 

  context('POST /customers', () => {
    it('Should successfully create a new customer', async () => {
      await request(app).post('/customers').send({
        nombre: "Bob",
        apellido: "Gonzalez",
        nif: '54321678B',
        direccion: 'Avenida Principal 789',
        telefono: '543216789'
      }).expect(201);
    }).timeout(3000); 
    it('Should not create a new customer. Missing required field', async () => {
      await request(app).post('/customers').send({
        nombre: "Bob",
        apellido: "Johnson",
        direccion: 'Avenida Principal 789',
        telefono: '543216789'
      }).expect(400);
    }).timeout(3000); 
    it('Should not create a new customer. Duplicated nif', async () => {
      await request(app).post('/customers').send({
        nombre: "Bob",
        apellido: "Johnson",
        nif: firstCustomer.nif,
        direccion: 'Avenida Principal 789',
        telefono: '543216789'
      }).expect(400);
    }).timeout(3000); 
  });

  context('PATCH /customers', () => {
    it('Should successfully update a customer', async () => {
      const newCustomer = await new Customer(secondCustomer).save();
      await request(app).patch(`/customers/${newCustomer._id}`).send({ telefono: '123456789' }).expect(200);
    }).timeout(3000); 
    it('Should not update a customer. Invalid id', async () => {
      await request(app).patch('/customers/123').send({ telefono: '123456789' }).expect(400);
    }).timeout(3000); 
  });

  context('DELETE /customers', () => {
    it('Should successfully delete a customer', async () => {
            const newCustomer = await new Customer(secondCustomer).save();
      await request(app).delete(`/customers/${newCustomer._id}`).expect(200);
    }).timeout(3000); 
    it('Should not delete a customer. Invalid id', async () => {
      await request(app).delete('/customers/123').expect(400);
    }).timeout(3000); 
  });
});
