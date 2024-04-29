import express, { Request, Response } from 'express';
import Customer from '../models/customer.js'; 

const router = express.Router();

// Crear un nuevo cliente
router.post('/customers', async (req: Request, res: Response) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).send(customer);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Leer todos los clientes
router.get('/customers', async (req: Request, res: Response) => {
  try {
    const customers = await Customer.find();
    res.send(customers);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Leer un cliente por NIF
router.get('/customers/nif/:nif', async (req: Request, res: Response) => {
  const nif = req.params.nif;
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
router.get('/customers/id/:id', async (req: Request, res: Response) => {
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
router.put('/customers/nif/:nif', async (req: Request, res: Response) => {
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
router.put('/customers/id/:id', async (req: Request, res: Response) => {
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
router.delete('/customers/nif/:nif', async (req: Request, res: Response) => {
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
router.delete('/customers/id/:id', async (req: Request, res: Response) => {
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

export default router;
