
import express, { Request, Response } from 'express';
import  Transaction, { transactionSchema }  from '../models/transaction.js';
import  Customer from '../models/customer.js';
import  Furniture  from '../models/furniture.js';
import  Provider  from '../models/provider.js';

export const TransactionRouter = express.Router();
/**
 * Ruta para obtener una transacción por su ID.
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - La transacción encontrada
 */
TransactionRouter.get('/transactions/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).send({ error: 'La transacción no existe' });
    }
    return res.status(200).send(transaction);
  } catch (error) {
    return res.status(500).send({ error: 'Hubo un error al buscar la transacción' });
  }
});


/**
 * Ruta para obtener transacciones filtradas según diferentes parámetros.
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - Las transacciones encontradas
 */

TransactionRouter.get('/transactions', async(req: Request, res: Response) => {

// si se incluye un query string en el que aparezca el parámetro nif se pusca por ese nif, si aparece el parámetro date este tendrá dos fechas y deberá buscar las transacciones entre esas dos fechas 
if (req.query.nif) {
    const nif = req.query.nif;
    try {
      const customer = await Customer.findOne({ nif });
      if (!customer) {
        return res.status(404).send({ message: 'Cliente no encontrado' });
      }
      const transactions = await Transaction.find({customer: customer._id});
      return res.send(transactions);
    } catch (error) {
      return res.status(404).send({ message: 'No existen transacciones'});
    } // debe buscar tambien en la base de datos de providers
  } else if (req.query.nif) {
    const nif = req.query.nif;
    try {
      const provider = await Provider.findOne({ nif });
      if (!provider) {
        return res.status(404).send({ message: 'Proveedor no encontrado' });
      }
      const transactions = await Transaction.find({provider: provider._id});
      return res.send(transactions);
    } catch (error) {
      return res.status(404).send({ message: 'No existen transacciones'});
    }
  } else if (req.query.date){
    const date = req.query.date;
    try {
      const transactions = await Transaction.find({date});
      return res.send(transactions);
    } catch (error) {
      return res.status(404).send({ message: 'No existen transacciones'});
    }
  } // si en el query se incluye un parámetro tipo se buscará por ese tipo
  else if(req.query.type){
    const type = req.query.type;
    try {
      const transactions = await Transaction.find({ type });
      return res.send(transactions);
    } catch ( error ){
      return res.status(404).send({ message: 'No existen transacciones de ese tipo'});
    }
  } // si se incluye el parámetro id se buscará por el id de la base de datos
  else if(req.query.id){
    const id = req.query.id;
    try {
      const transactions = await Transaction.findById({ id })
      return res.send(transactions);

  } catch (error){
    return res.status(404).send({ message: 'No existen transacciones con ese id' });
  } 
  } else {
    try {
      const transactions = await Transaction.find();
      return res.send(transactions);
    } catch (error) {
      return res.status(404).send({ message: 'No existen transacciones'});
    }
  }
});

/**
 * Ruta para crear una nueva transacción.
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - La transacción creada
 */
TransactionRouter.post('/transactions', async(req: Request, res: Response) => {
  // Extraer datos de la solicitud
  const { type, furniture, customer, provider, price, timestamp } = req.body;

  try {
    // Verificar si hay suficiente stock para los muebles
    for (const item of furniture) {
      const { furniture: furnitureId, quantity } = item;
      const existingFurniture = await Furniture.findById(furnitureId);
      if (!existingFurniture || existingFurniture.stock < quantity) {
        return res.status(400).send({ message: 'No hay suficiente stock' });
      }
    }

    // Crear una nueva transacción
    const newTransaction = new Transaction({ type, furniture, customer, provider, price, timestamp });
    await newTransaction.save();

    // Actualizar el stock de los muebles
    for (const item of furniture) {
      const { furniture: furnitureId, quantity } = item;
      const existingFurniture = await Furniture.findById(furnitureId);
      if (!existingFurniture) {
        return res.status(404).send({ message: 'Mueble no encontrado' });
      }
      existingFurniture.stock -= quantity;
      await existingFurniture.save();
    }

    // Enviar respuesta exitosa
    return res.status(201).send(newTransaction);
  } catch (error) {
    return res.status(404).send({message: 'No se ha podido crear la transacción'});
  }
});

/**
 * Ruta para actualizar una transacción por su ID.
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - La transacción actualizada
 */
TransactionRouter.patch('/transactions/:id', async (req: Request, res: Response) => {
  try {
    // Validar las actualizaciones permitidas
    const updates = Object.keys(req.body);
    const allowedFields = ['type', 'furniture', 'customer', 'provider', 'price', 'timestamp'];
    const isUpdateAllowed = updates.every((update) => allowedFields.includes(update));
    if (!isUpdateAllowed) {
      return res.status(400).send({ error: 'No se pudo realizar la actualización' });
    }

    // Obtener el ID de la transacción y los campos de actualización
    const id = req.params.id;
    const updatedFields: { [key: string]: any } = {};
    for (const key of updates) {
      updatedFields[key] = req.body[key];
    }

    // Actualizar la transacción
    const transaction = await Transaction.findOne({ _id: id });
    if (!transaction) {
      return res.status(404).send({ error: 'La transacción no existe' });
    }

    for (const key in updatedFields) {
      // Asegurar que la clave es válida y hacer una aserción de tipo
      if (Object.prototype.hasOwnProperty.call(updatedFields, key)) {
        (transaction as any)[key] = updatedFields[key];
      }
    }
    await transaction.save();

    // Manejar la respuesta
    return res.status(200).send(transaction);
  } catch (error) {
    // Manejar errores
    return res.status(500).send({ error: 'Hubo un error tratando de modificar la transacción' });
  }
});

/**
 * Ruta para eliminar una transacción por su ID.
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - Mensaje de éxito o error
 */
TransactionRouter.delete('/transactions/:id', async (req: Request, res: Response) => {
  try {
    // Filtrado de la transacción
    const id = req.params.id;
    const filter = { _id: id };


    // Búsqueda de la transacción
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).send({ error: 'La transacción no existe' });
    }

    // Verificación de existencia del participante
    const customer = await Customer.findById(transaction.customer);
    const provider = await Provider.findById(transaction.provider);
    if (!customer && !provider) {
      return res.status(404).send({ error: 'El cliente o proveedor asociado a la transacción no existe' });
    }

    // Verificación del tipo de transacción y manipulación de stock
    if (transaction.type === 'Venta' && customer) {
      // Se aumenta el stock para los muebles vendidos al cliente
      for (const furnitureData of transaction.furniture) {
        const furniture = await Furniture.findById(furnitureData.furniture);
        if (!furniture) {
          return res.status(404).send({ error: 'Uno de los muebles asociados a la transacción no existe' });
        }
        furniture.stock += furnitureData.quantity.valueOf();
        await furniture.save();
      }
    } else if (transaction.type === 'Compra' && provider) {
      // Se disminuye el stock para los muebles comprados al proveedor
      for (const furnitureData of transaction.furniture) {
        const furniture = await Furniture.findById(furnitureData.furniture);
        if (!furniture) {
          return res.status(404).send({ error: 'Uno de los muebles asociados a la transacción no existe' });
        }
        if (furniture.stock < furnitureData.quantity.valueOf()) {
          return res.status(400).send({ error: 'No hay suficiente stock para realizar la eliminación' });
        }
        furniture.stock -= furnitureData.quantity.valueOf();
        await furniture.save();
      }
    }

    // Eliminación de la transacción
    await Transaction.findByIdAndDelete(id);

    // Respuesta HTTP en caso de éxito
    return res.status(200).send({ message: 'Transacción eliminada exitosamente' });
  } catch (error) {
    // Respuesta HTTP en caso de error
    return res.status(500).send({ error: 'Hubo un error tratando de eliminar la transacción' });
  }
});
