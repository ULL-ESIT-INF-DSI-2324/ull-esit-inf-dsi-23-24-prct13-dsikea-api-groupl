import request from 'supertest';
import { expect } from 'chai';
import { app } from '../src/index.js';
import Provider from '../src/models/provider.js';

const firstProvider = {
  name: "Provider1",
  contact: "Contact1",
  address: "Address1",
  cif: '123456789',
  email: 'provider1@example.com',
  mobilePhone: 123456789
};

const secondProvider = {
  name: "Provider2",
  contact: "Contact2",
  address: "Address2",
  cif: '987654321',
  email: 'provider2@example.com',
  mobilePhone: 987654321
};

beforeEach(async () => {
  await Provider.deleteMany({});
  await new Provider(firstProvider).save();
});

describe('PROVIDERS', function() {
  context('GET /providers', function() {
    it('Should find a provider by id', async () => {
      const newProvider = await new Provider(secondProvider).save();
      await request(app).get(`/providers/id/${newProvider._id}`).expect(200);
    });
    it('Should find a provider by cif', async () => {
      await request(app).get(`/providers/${firstProvider.cif}`).expect(200);
    });
    it('Should not find a provider by cif', async () => {
      await request(app).get(`/providers/000000000`).expect(404);
    });
  });

  context('POST /providers', () => {
    it('Should successfully create a new provider', async () => {
      await request(app).post('/providers').send({
        name: "Provider3",
        contact: "Contact3",
        address: "Address3",
        cif: '333333333',
        email: 'provider3@example.com',
        mobilePhone: 333333333
      }).expect(201);
    });
    it('Should not create a new provider. Missing required field', async () => {
      await request(app).post('/providers').send({
        contact: "Contact3",
        address: "Address3",
        cif: '333333333',
        email: 'provider3@example.com',
        mobilePhone: 333333333
      }).expect(400);
    });
    it('Should not create a new provider. Duplicated cif', async () => {
      await request(app).post('/providers').send({
        name: "Provider3",
        contact: "Contact3",
        address: "Address3",
        cif: firstProvider.cif,
        email: 'provider3@example.com',
        mobilePhone: 333333333
      }).expect(400);
    });
  });

  context('PATCH /providers', () => {
    it('Should successfully update a provider', async () => {
      const newProvider = await new Provider(secondProvider).save();
      await request(app).patch(`/providers?cif=${newProvider.cif}`).send({ mobilePhone: 555555555 }).expect(200);
    });
    it('Should not update a provider. Invalid cif', async () => {
      await request(app).patch('/providers').send({ mobilePhone: 555555555 }).expect(400);
    });
  });

  context('DELETE /providers', () => {
    it('Should successfully delete a provider by cif', async () => {
      const newProvider = await new Provider(secondProvider).save();
      await request(app).delete(`/providers/${newProvider.cif}`).expect(200);
    });
    it('Should not delete a provider. Invalid cif', async () => {
      await request(app).delete('/providers/123').expect(400);
    });
    it('Should successfully delete a provider by id', async () => {
      const newProvider = await new Provider(secondProvider).save();
      await request(app).delete(`/providers/id/${newProvider._id}`).expect(200);
    });
  });
});
