// import request from 'supertest';
// import { expect } from 'chai';
// import { app } from '../src/index.js';
// import Customer from '../src/models/customer.js';
// import Provider from '../src/models/provider.js';
// import Transaction from '../src/models/transaction.js';
// import Furniture from '../src/models/furniture.js';

// const firstCustomer = {
//   nombre: "Juan",
//   apellido: "Pérez",
//   nif: '76524168K',
//   direccion: 'Calle Principal 123',
//   telefono: '123456789'
// };
// const secondCustomer = {
//   nombre: "Samantha",
//   apellido: "Hernández",
//   nif: '42876542A',
//   direccion: 'Calle Secundaria 456',
//   telefono: '987654321'
// };

// const firstProvider = {
//   name: "Pepito",
//   contact: "Contact1",
//   address: "Address1",
//   cif: '987654321',
//   email: 'pepito@gmail.com',
//   mobilePhone: 123456789
// };

// const firstFurniture = {
//   name: "Mesa",
//   description: "Mesa de madera",
//   material: "wood",
//   dimensions: {
//     length: 100,
//     width: 50,
//     height: 75
//   },
//   price: 150,
//   stock: 10,
//   color: "brown"
// };

// const secondFurniture = {
//   name: "Silla",
//   description: "Silla de plástico",
//   material: "plastic",
//   dimensions: {
//     length: 80,
//     width: 40,
//     height: 90
//   },
//   price: 50,
//   stock: 20,
//   color: "white"
// };

// let firstCustomerId:string , secondCustomerId:string, firstProviderId:string, firstFurnitureId:string, secondFurnitureId:string;

// beforeEach(async () => {
//   await Customer.deleteMany({});
//   await Provider.deleteMany({});
//   await Transaction.deleteMany({});
//   await Furniture.deleteMany({});

//   const firstCustomerSaved = await new Customer(firstCustomer).save();
//   const secondCustomerSaved = await new Customer(secondCustomer).save();
//   firstCustomerId = firstCustomerSaved._id;
//   secondCustomerId = secondCustomerSaved._id;

//   const firstProviderSaved = await new Provider(firstProvider).save();
//   firstProviderId = firstProviderSaved._id;

//   const firstFurnitureSaved = await new Furniture(firstFurniture).save();
//   const secondFurnitureSaved = await new Furniture(secondFurniture).save();
//   firstFurnitureId = firstFurnitureSaved._id;
//   secondFurnitureId = secondFurnitureSaved._id;
// });

// describe('TRANSACTIONS', function() {

//   context('GET /transactions', () => {
//     it('Should get all transactions', async () => {
//       const response = await request(app).get('/transactions').expect(200);
//       expect(response.body).to.be.an('array');
//       expect(response.body.length).to.equal(0);
//     });
//   }).timeout(3000);

//   context('POST /transactions', () => {
//     it('should create a new transaction Sale To Customer', async () => {
//       const furniture = await new Furniture(firstFurniture).save();

//       request(app).post('/transactions').send({
//         type: "Compra",
//           furniture: [
//             {
//               furnitureId: firstFurnitureId,
//               quantity: 2
//             }],
//           customer: secondCustomerId,
//           price: 200
//         }).expect(201);
//     });
//     it('Should not create a new transaction. Insufficient stock', async () => {
//       await request(app).post('/transactions').send({
//         type: "Venta",
//         furniture: [{
//           furnitureId: firstFurnitureId,
//           quantity: 20 // More than available stock
//         }],
//         customer: firstCustomerId,
//         provider: firstProviderId,
//         price: 2000,
//         timestamp: new Date()
//       }).expect(404);
//     }).timeout(3000);
//   });

//   context('PATCH /transactions', () => {
//     it('Should successfully update a transaction', async () => {
//       const newTransaction = await new Transaction({
//         type: "Venta",
//         furniture: [{
//           furnitureId: firstFurnitureId,
//           quantity: 1
//         }],
//         customer: secondCustomerId,
//         provider: firstProviderId,
//         price: 100,
//         timestamp: new Date()
//       }).save();
//       await request(app).patch(`/transactions/${newTransaction._id}`).send({ price: 150 }).expect(200);
//     }).timeout(3000);
//     it('Should not update a transaction. Invalid id', async () => {
//       await request(app).patch('/transactions/123').send({ price: 150 }).expect(500);
//     }).timeout(3000);
//   });

//   context('DELETE /transactions', () => {

//     it('Should successfully delete a transaction', async () => {
//       const newTransaction = await new Transaction({
//         type: "Compra",
//         furniture: [{
//           furnitureId: firstFurnitureId,
//           quantity: 1
//         }],
//         customer: firstCustomerId,
//         provider: firstProviderId,
//         price: 50,
//         timestamp: new Date()
//       }).save();
//       console.log('New transaction:', newTransaction._id);
//       await request(app).delete(`/transactions/${newTransaction._id}`).expect(200);
//     }).timeout(3000);


//     it('Should not delete a transaction. Invalid id', async () => {
//       await request(app).delete('/transactions/123').expect(500);
//     }).timeout(3000);
//   });
// }); 