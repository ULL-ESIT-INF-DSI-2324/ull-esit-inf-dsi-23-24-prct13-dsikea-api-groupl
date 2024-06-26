import express, { Request, Response } from 'express';
import Provider  from "../models/provider.js";

export const ProvidersRouter = express.Router();

/**
 * Ruta para crear un nuevo proveedor.
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - El proveedor creado
 */
ProvidersRouter.post('/providers', async (req: Request, res: Response) => {
  const provider = new Provider(req.body);
  try {
    await provider.save();
    res.status(201).send(provider);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * Ruta para leer todos los proveedores.
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - Los proveedores encontrados
 */
ProvidersRouter.get('/providers', async (req: Request, res: Response) => {
  try {
    const providers = await Provider.find();
    res.send(providers);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * Ruta para leer un proveedor por su CIF.
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - El proveedor encontrado
 */
ProvidersRouter.get('/providers/:cif', async (req: Request, res: Response) => {
    const cif = req.params.cif;
    try {
      const provider = await Provider.findOne({ cif });
      if (!provider) {
        return res.status(404).send({ message: 'Proveedor no encontrado' });
      }
      return res.send(provider);
    } catch (error) {
      return res.status(500).send(error);
    }
  });

/**
 * Ruta para leer un proveedor por su ID.
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - El proveedor encontrado
 */
ProvidersRouter.get('/providers/id/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const provider = await Provider.findById(id);
      if (!provider) {
        return res.status(404).send({ message: 'Proveedor no encontrado' });
      }
      return res.send(provider);
    } catch (error) {
      return res.status(500).send(error);
    }
  });


/**
 * Ruta para actualizar un proveedor por su CIF.
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - El proveedor actualizado
 */
ProvidersRouter.patch('/providers', async (req: Request, res: Response) => {
  if (!req.query.cif) {
    return res.status(400).send({
      error: 'Se debe proporcionar un CIF',});
  }

  const Updates = ['name', 'contact', 'address', 'email', 'mobilePhone'];
  const UpdateExistente = Object.keys(req.body);
  const isValidUpdate = UpdateExistente.every((update) => Updates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
        error: 'Actualización no permitida',
    });
  }

  try {
    const provider = await Provider.findOneAndUpdate(
        { cif: req.query.cif.toString() },
        req.body,
        { new: true, runValidators: true }
    );

    if (provider) {
      return res.send(provider);
    }
    return res.status(404).send();
  } catch (error) {
      return res.status(500).send(error);
  }
});

/**
 * Ruta para borrar un proveedor por su CIF.
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - El proveedor eliminado
 */
ProvidersRouter.delete('/providers/cif/:cif', async (req: Request, res: Response) => {
    const cif = req.params.cif;
    try {
      const provider = await Provider.findOneAndDelete({ cif });
      if (!provider) {
        return res.status(404).send({ message: 'Proveedor no encontrado' });
      }
      return res.send(provider);
    } catch (error) {
      return res.status(500).send(error);
    }
});

/**
 * Ruta para borrar un proveedor por su ID.
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - El proveedor eliminado
 */
ProvidersRouter.delete('/providers/id/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const provider = await Provider.findByIdAndDelete(id);
      if (!provider) {
        return res.status(404).send({ message: 'Proveedor no encontrado' });
      }
      return res.send(provider);
    } catch (error) {
      return res.status(500).send(error);
    }
  });

