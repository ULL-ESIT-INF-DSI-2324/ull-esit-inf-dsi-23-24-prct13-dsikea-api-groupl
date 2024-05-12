/*import request from 'supertest';
import { expect } from 'chai';
import { app } from '../src/index.js';
import Customer from '../src/models/customer.js';
import Provider from '../src/models/provider.js';
import Transaction from '../src/models/transaction.js';
import Furniture from '../src/models/furniture.js';

const firstCustomer = {
  nombre: "Juan",
  apellido: "Pérez",
  nif: '76524168M',
  direccion: 'Calle Principal 123',
  telefono: '123456789'
};
const secondCustomer = {
  nombre: "Samantha",
  apellido: "Hernández",
  nif: '42876542M',
  direccion: 'Calle Secundaria 456',
  telefono: '987654321'
};

const firstProvider = {
  name: "Pepito",
  contact: "Contact1",
  address: "Address1",
  cif: '987654321',
  email: 'pepito@gmail.com',
  mobilePhone: 123456789
};

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

let firstCustomerId:string , secondCustomerId:string, firstProviderId:string, firstFurnitureId:string, secondFurnitureId:string;

beforeEach(async () => {
  await Customer.deleteMany({});
  await Provider.deleteMany({});
  await Transaction.deleteMany({});
  await Furniture.deleteMany({});

  const firstCustomerSaved = await new Customer(firstCustomer).save();
  const secondCustomerSaved = await new Customer(secondCustomer).save();
  firstCustomerId = firstCustomerSaved._id;
  secondCustomerId = secondCustomerSaved._id;

  const firstProviderSaved = await new Provider(firstProvider).save();
  firstProviderId = firstProviderSaved._id;

  const firstFurnitureSaved = await new Furniture(firstFurniture).save();
  const secondFurnitureSaved = await new Furniture(secondFurniture).save();
  firstFurnitureId = firstFurnitureSaved._id;
  secondFurnitureId = secondFurnitureSaved._id;

  
});

describe('TRANSACTIONS', function() {

  context('GET /transactions', () => {
    it('Should get all transactions', async () => {
      const response = await request(app).get('/transactions').expect(200);
      expect(response.body.length).to.equal(1);
    });
  }).timeout(3000);
}); 
*/