/* import request from 'supertest';
import { expect } from 'chai';
import { app } from '../src/index.js';
import Furniture from '../src/models/furniture.js';

const firstFurniture = {
  name: "Mesa",
  description: "Mesa de madera",
  material: "wood",
  dimensions: {
    length: 100,
    width: 50,
    height: 75
  },
  price: 150,
  stock: 10,
  color: "brown"
};

const secondFurniture = {
  name: "Silla",
  description: "Silla de plástico",
  material: "plastic",
  dimensions: {
    length: 80,
    width: 40,
    height: 90
  },
  price: 50,
  stock: 20,
  color: "white"
};

let firstFurnitureId, secondFurnitureId;

beforeEach(async () => {
  await Furniture.deleteMany({});

  const firstFurnitureSaved = await new Furniture(firstFurniture).save();
  const secondFurnitureSaved = await new Furniture(secondFurniture).save();
  firstFurnitureId = firstFurnitureSaved._id;
  secondFurnitureId = secondFurnitureSaved._id;
});

describe('FURNITURES', function() {

  context('GET /furnitures', () => {
    it('Should get all furnitures', async () => {
      const response = await request(app).get('/furnitures').expect(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.equal(2);
    });
  }).timeout(3000);

  context('POST /furnitures', () => {
    it('Should successfully create a new furniture', async () => {
      await request(app).post('/furnitures').send({
        name: "Sofá",
        description: "Sofá de cuero",
        material: "leather",
        dimensions: {
          length: 200,
          width: 90,
          height: 85
        },
        price: 500,
        stock: 5,
        color: "black"
      }).expect(201);
    }).timeout(3000);
    it('Should not create a new furniture. Missing required field', async () => {
      await request(app).post('/furnitures').send({
        description: "Armario de madera",
        material: "wood",
        dimensions: {
          length: 150,
          width: 60,
          height: 200
        },
        price: 300,
        stock: 8,
        color: "brown"
      }).expect(400);
    }).timeout(3000);
  });

  context('PATCH /furnitures/id/:id', () => {
    it('Should successfully update a furniture by ID', async () => {
      await request(app).patch(`/furnitures/id/${firstFurnitureId}`).send({ price: 200 }).expect(200);
    }).timeout(3000);
    it('Should not update a furniture. Invalid id', async () => {
      await request(app).patch('/furnitures/id/123').send({ price: 200 }).expect(404);
    }).timeout(3000);
  });

  context('DELETE /furnitures/id/:id', () => {
    it('Should successfully delete a furniture by ID', async () => {
      await request(app).delete(`/furnitures/id/${secondFurnitureId}`).expect(200);
    }).timeout(3000);
    it('Should not delete a furniture. Invalid id', async () => {
      await request(app).delete('/furnitures/id/123').expect(404);
    }).timeout(3000);
  });

  context('GET /furnitures/:id', () => {
    it('Should get a furniture by ID', async () => {
      const response = await request(app).get(`/furnitures/${firstFurnitureId}`).expect(200);
      expect(response.body._id).to.equal(firstFurnitureId.toString());
    }).timeout(3000);
    it('Should not get a furniture. Invalid id', async () => {
      await request(app).get('/furnitures/123').expect(404);
    }).timeout(3000);
  });

  context('PATCH /furnitures/', () => {
    it('Should successfully update a furniture by query string', async () => {
      await request(app).patch(`/furnitures/?id=${firstFurnitureId}`).send({ price: 250 }).expect(200);
    }).timeout(3000);
    it('Should not update a furniture by query string. Invalid id', async () => {
      await request(app).patch('/furnitures/?id=123').send({ price: 250 }).expect(404);
    }).timeout(3000);
  });

  context('DELETE /furnitures/query', () => {
    it('Should successfully delete a furniture by query string', async () => {
      await request(app).delete(`/furnitures/query?id=${secondFurnitureId}`).expect(200);
    }).timeout(3000);
    it('Should not delete a furniture by query string. Invalid id', async () => {
      await request(app).delete('/furnitures/query?id=123').expect(404);
    }).timeout(3000);
  });
}); */
