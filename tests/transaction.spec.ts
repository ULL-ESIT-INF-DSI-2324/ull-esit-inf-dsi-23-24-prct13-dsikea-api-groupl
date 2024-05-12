
 import request from 'supertest';
 import { expect } from 'chai';
 import { app } from '../src/index.js';
 import Customer from '../src/models/customer.js';
 import Provider from '../src/models/provider.js';
 import Transaction from '../src/models/transaction.js';
 import Furniture from '../src/models/furniture.js';

 // Define los esquemas
const firstCustomer = {
  nombre: "John",
  apellido: "Doe",
  nif: "12345678A",
  direccion: "Calle Principal 123",
  telefono: "123456789"
};

const firstProvider = {
  name: "Provider Inc.",
  contact: "Jane Doe",
  address: "123 Provider St.",
  cif: "87654321B"
};

const firstFurniture = {
  name: "Table",
  description: "Wooden table",
  material: "wood",
  dimensions: {
    length: 120,
    width: 80,
    height: 75
  },
  price: 100,
  stock: 10,
  color: "brown"
};


 describe('Transactions API', () => {

  // Antes de cada prueba, eliminamos todas las transacciones y clientes
  beforeEach(async () => {
    await Transaction.deleteMany();
    await Customer.deleteMany();
  });

  describe('GET /transactions/:id', () => {
    it('debería devolver la transacción por el id', async () => {
      const customer = await new Customer({ 
        nombre: "John", 
        apellido: "Doe",
        nif: "12345678A", 
        direccion: "Calle Principal 123",
        telefono: "123456789"
      }).save();
      const furniture = await new Furniture({ 
        name: "Table", 
        description: "Wooden table", 
        material: "wood",
        dimensions: { length: 100, width: 50, height: 70 },
        price: 50, 
        stock: 10,
        color: "brown"
      }).save();
      const transaction = await new Transaction({ 
        type: "Venta", 
        furniture: [{ furniture: furniture, quantity: 2 }], 
        customer: customer,
        provider: null, 
        price: 100,
        timestamp: new Date()
      }).save();
      
      const res = await request(app).get(`/transactions/${transaction._id}`);
      expect(res.status).to.equal(200);
      expect(res.body._id).to.equal(transaction._id.toString());
      expect(res.body.type).to.equal("Venta");
      expect(res.body.customer).to.equal(customer._id.toString());
      expect(res.body.provider).to.equal(null); 
      expect(res.body.price).to.equal(100);
    });

    it('Retorna error 500 al haber error en la búsqueda de la transacción', async () => {
      const res = await request(app).get('/transactions/60b1f7b3b3f3b3b3b3b3b3b');
      expect(res.status).to.equal(500);
    });
  });

});

describe('POST /transactions', () => {
  it('debería crear una nueva transacción con datos válidos', async () => {
    const customer = await new Customer(firstCustomer).save();
    const provider = await new Provider(firstProvider).save();
    const furniture = await new Furniture(firstFurniture).save();
    // Datos válidos para una nueva transacción
    const newTransactionData = {
      type: "Venta",
      furniture: [{ furniture: furniture._id, quantity: 1 }],
      customer: customer._id,
      provider: provider._id,
      price: 150,
      timestamp: new Date()
    };

    const response = await request(app).post('/transactions').send(newTransactionData).expect(201);
    expect(response.body).to.be.an('object');
  });

  it('debería devolver un error si no hay suficiente stock para la transacción', async () => {
    const customer = await new Customer(firstCustomer).save();
    const provider = await new Provider(firstProvider).save();
    const furniture = await new Furniture(firstFurniture).save();
    // Datos de transacción donde hay exceso de cantidad de muebles en comparación con el stock disponible
    const transactionWithInsufficientStock = {
      type: "Venta",
      furniture: [{ furniture: furniture._id, quantity: 60 }],
      customer: customer._id,
      provider: provider._id,
      price: 2000,
      timestamp: new Date()
    };

    const response = await request(app).post('/transactions').send(transactionWithInsufficientStock).expect(400);
    expect(response.body).to.have.property('message', 'No hay suficiente stock');
  });

  it('debería devolver un error si los datos de la transacción son inválidos', async () => {
    // Datos de transacción inválidos
    const invalidTransactionData = {
      type: "Venta",
      price: 150,
      timestamp: new Date() 
    };

    const response = await request(app).post('/transactions').send(invalidTransactionData).expect(404);
    expect(response.body).to.have.property('message', 'No se ha podido crear la transacción');
  });
});

describe('PATCH /transactions/:id', () => {
  it('debería actualizar una transacción existente correctamente', async () => {
    const customer = await new Customer(firstCustomer).save();
    const provider = await new Provider(firstProvider).save();
    const furniture = await new Furniture(firstFurniture).save();
    // Crear una nueva transacción para actualizar
    const newTransactionData = {
      type: 'Compra',
      furniture: [{ furniture: furniture._id, quantity: 2 }],
      customer: customer._id,
      provider: furniture._id,
      price: 300,
      timestamp: new Date()
    };
    const newTransaction = new Transaction(newTransactionData);
    await newTransaction.save();

    // Datos actualizados para la transacción
    const updatedTransactionData = {
      type: 'Venta',
      price: 500,
    };

    // Realizar la solicitud PATCH para actualizar la transacción
    const response = await request(app)
      .patch(`/transactions/${newTransaction._id}`)
      .send(updatedTransactionData)
      .expect(200);

    // Verificar que la respuesta contiene los datos actualizados
    expect(response.body).to.have.property('type', updatedTransactionData.type);
    expect(response.body).to.have.property('price', updatedTransactionData.price);
  });

  it('debería devolver un error si se intenta actualizar un campo no permitido', async () => {
    const customer = await new Customer(firstCustomer).save();
    const provider = await new Provider(firstProvider).save();
    const furniture = await new Furniture(firstFurniture).save();
    // Crear una nueva transacción para intentar actualizar
    const newTransactionData = {
      type: 'Compra',
      furniture: [{ furniture: furniture._id, quantity: 2 }],
      customer: customer._id,
      provider: provider._id,
      price: 300,
      timestamp: new Date()
    };
    const newTransaction = new Transaction(newTransactionData);
    await newTransaction.save();

    // Intentar actualizar un campo no permitido
    const updatedTransactionData = {
      invalidField: 'Valor inválido'
    };

    // Realizar la solicitud PATCH con datos de actualización no permitidos
    const response = await request(app)
      .patch(`/transactions/${newTransaction._id}`)
      .send(updatedTransactionData)
      .expect(400);

    // Verificar que la respuesta contiene el mensaje de error esperado
    expect(response.body).to.have.property('error', 'No se pudo realizar la actualización');
  });

  it('debería devolver un error si se intenta actualizar una transacción que no existe', async () => {
    // ID de una transacción que no existe en la base de datos
    const nonExistentTransactionId = '609c36671c50b36c79d9bdcf';

    // Datos para la actualización (en este caso, no importa porque la transacción no existe)
    const updatedTransactionData = {
      type: 'Venta',
      price: 500,
    };

    // Realizar la solicitud PATCH para actualizar una transacción que no existe
    const response = await request(app)
      .patch(`/transactions/${nonExistentTransactionId}`)
      .send(updatedTransactionData)
      .expect(404);

    // Verificar que la respuesta contiene el mensaje de error esperado
    expect(response.body).to.have.property('error', 'La transacción no existe');
  });
});

describe('DELETE /transactions/:id', () => {

  it('debería devolver un error si se intenta eliminar una transacción que no existe', async () => {
    // ID de una transacción que no existe en la base de datos
    const nonExistentTransactionId = '609c36671c50b36c79d9bdcf';

    // Realizar la solicitud DELETE para eliminar una transacción que no existe
    const response = await request(app)
      .delete(`/transactions/${nonExistentTransactionId}`)
      .expect(404);

    // Verificar que la respuesta contiene el mensaje de error esperado
    expect(response.body).to.have.property('error', 'La transacción no existe');
  });
});
