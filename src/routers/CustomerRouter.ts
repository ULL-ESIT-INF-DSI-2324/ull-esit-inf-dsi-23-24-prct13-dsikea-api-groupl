import express, { Request, Response } from 'express';
import Customer from '../models/customer.js'; 

export const CustomerRouter = express.Router();

// Crear un nuevo cliente
CustomerRouter.post('/customers', async (req: Request, res: Response) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).send(customer);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Leer todos los clientes
CustomerRouter.get('/customers', async (req: Request, res: Response) => {
  try {
    const customers = await Customer.find();
    res.send(customers);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Leer un cliente por NIF
CustomerRouter.get('/customers', async (req: Request, res: Response) => {
  const nif = req.query.nif;
  try {
    const customer = await Customer.findOne({ nif });
    if (!customer) {
      return res.status(404).send({ message: 'Cliente no encontrado' });
    }
    return res.send(customer);
  } catch (error) {
    return res.status(500).send(error);
  }
});


// Leer un cliente por ID
CustomerRouter.get('/customers/id/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const customer = await Customer.findById(id);
      if (!customer) {
        return res.status(404).send({ message: 'Cliente no encontrado' });
      }
      return res.send(customer); // Agregar 'return' aquí
    } catch (error) {
      return res.status(500).send(error);
    }
});
  

// Actualizar un cliente por NIF
CustomerRouter.put('/customers/nif/:nif', async (req: Request, res: Response) => {
    const nif = req.params.nif;
    try {
      const customer = await Customer.findOneAndUpdate({ nif }, req.body, { new: true });
      if (!customer) {
        return res.status(404).send({ message: 'Cliente no encontrado' });
      }
      return res.send(customer);
    } catch (error) {
      return res.status(400).send(error);
    }
});

// Actualizar un cliente por ID
CustomerRouter.put('/customers/id/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const customer = await Customer.findByIdAndUpdate(id, req.body, { new: true });
    if (!customer) {
      return res.status(404).send({ message: 'Cliente no encontrado' });
    }
    return res.send(customer);
  } catch (error) {
    return res.status(400).send(error);
  }
});

// Borrar un cliente por NIF
CustomerRouter.delete('/customers/nif/:nif', async (req: Request, res: Response) => {
  const nif = req.params.nif;
  try {
    const customer = await Customer.findOneAndDelete({ nif });
    if (!customer) {
      return res.status(404).send({ message: 'Cliente no encontrado' });
    }
    return res.send(customer);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// Borrar un cliente por ID
CustomerRouter.delete('/customers/id/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return res.status(404).send({ message: 'Cliente no encontrado' });
    }
    return res.send(customer);
  } catch (error) {
    return res.status(500).send(error);
  }
});
