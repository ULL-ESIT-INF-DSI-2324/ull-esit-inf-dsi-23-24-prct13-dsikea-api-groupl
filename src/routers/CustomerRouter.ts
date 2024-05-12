import express, { Request, Response } from 'express';
import Customer from '../models/customer.js'; 

export const CustomerRouter = express.Router();

/**
 * Método para crear un nuevo cliente.
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - El cliente creado
 */
CustomerRouter.post('/customers', async (req: Request, res: Response) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).send(customer);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * Método para leer todos los clientes o buscar por NIF si se proporciona.
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - Los clientes encontrados
 */
CustomerRouter.get('/customers', async (req: Request, res: Response) => {
  // si en el query string se encuentra el parámetro nif se busca por nif
  if (req.query.nif) {
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
  } else {
    //si el parámetro nif no se encuentra se listan todos los clientes
    try {
      const customers = await Customer.find();
      return res.send(customers);
    } catch (error) {
      return  res.status(500).send(error);
  }
}

});

/**
 * Método para leer un cliente por su ID.
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - El cliente encontrado
 */
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
  

/**
 * Método para actualizar un cliente por su NIF.
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - El cliente actualizado
 */
CustomerRouter.patch('/customers/', async (req: Request, res: Response) => {
   // si en el query string se encuentra el parámetro nif se busca por nif y se actualiza con el cliente nuevo
  if (req.query.nif) {
    const nif = req.query.nif;
    // comprobar que el cliente del body es válido 
    
    try {
      const customer = await Customer.findOneAndUpdate({ nif }, req.body, { new: true });
      if (!customer) {
        return res.status(404).send({ message: 'Cliente no encontrado' });
      }
      return res.send(customer);
    } catch (error) {
      return res.status(500).send(error);
    }
  } else {
    //si el parámetro nif no se encuentra se devuelve un error
    return res.status(400).send({ message: 'No se ha proporcionado un NIF' });
  }

});

/**
 * Método para actualizar un cliente por su NIF.
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - El cliente actualizado
 */
CustomerRouter.patch('/customers/', async (req: Request, res: Response) => {
  // Si en el query string se encuentra el parámetro nif, se busca por nif y se actualiza con el cliente nuevo
  if (req.query.nif) {
      const nif = req.query.nif as string;
      // Comprobar que el cliente del body es válido
      const allowedUpdates = ['nombre', 'apellido', 'direccion', 'telefono'];
      const actualUpdates = Object.keys(req.body);
      const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

      if (!isValidUpdate) {
          return res.status(400).send({
              error: 'Actualización no permitida',
          });
      }

      try {
          const customer = await Customer.findOneAndUpdate({ nif }, req.body, { new: true });
          if (!customer) {
              return res.status(404).send({ message: 'Cliente no encontrado' });
          }
          return res.send(customer);
      } catch (error) {
          return res.status(500).send(error);
      }
  } else {
      // Si el parámetro nif no se encuentra se devuelve un error
      return res.status(400).send({ message: 'No se ha proporcionado un NIF' });
  }
});

/**
 * Método para borrar un cliente por su NIF.
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - El cliente eliminado
 */
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

/**
 * Método para borrar un cliente por su ID.
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - El cliente eliminado
 */
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

