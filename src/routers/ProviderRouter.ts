import express, { Request, Response } from 'express';
import initialize from '../models/provider.js'; // Ajusta la ruta y el nombre del archivo según sea necesario

export const ProvidersRouter = express.Router();

// Crear un nuevo proveedor
ProvidersRouter.post('/providers', async (req: Request, res: Response) => {
  try {
    const ProviderModel = await initialize();
    const provider = new ProviderModel(req.body);
    await provider.save();
    res.status(201).send(provider);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Leer todos los proveedores
ProvidersRouter.get('/providers', async (req: Request, res: Response) => {
  try {
    const ProviderModel = await initialize();
    const providers = await ProviderModel.find();
    res.send(providers);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Leer un proveedor por CIF
ProvidersRouter.get('/providers/:cif', async (req: Request, res: Response) => {
    const cif = req.params.cif;
    try {
      const ProviderModel = await initialize();
      const provider = await ProviderModel.findOne({ cif });
      if (!provider) {
        return res.status(404).send({ message: 'Proveedor no encontrado' });
      }
      return res.send(provider);
    } catch (error) {
      return res.status(500).send(error);
    }
  });

// Leer un proveedor por ID
ProvidersRouter.get('/providers/id/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const ProviderModel = await initialize();
      const provider = await ProviderModel.findById(id);
      if (!provider) {
        return res.status(404).send({ message: 'Proveedor no encontrado' });
      }
      return res.send(provider);
    } catch (error) {
      return res.status(500).send(error);
    }
  });


// Actualizar un proveedor por CIF
ProvidersRouter.put('/providers/:cif', async (req: Request, res: Response) => {
    const cif = req.params.cif;
    try {
      const ProviderModel = await initialize();
      const provider = await ProviderModel.findOneAndUpdate({ cif }, req.body, { new: true });
      if (!provider) {
        return res.status(404).send({ message: 'Proveedor no encontrado' });
      }
      return res.send(provider);
    } catch (error) {
      return res.status(400).send(error);
    }
  });

// Borrar un proveedor por CIF
ProvidersRouter.delete('/providers/:cif', async (req: Request, res: Response) => {
    const cif = req.params.cif;
    try {
      const ProviderModel = await initialize();
      const provider = await ProviderModel.findOneAndDelete({ cif });
      if (!provider) {
        return res.status(404).send({ message: 'Proveedor no encontrado' });
      }
      return res.send(provider);
    } catch (error) {
      return res.status(500).send(error);
    }
});

// Borrar un proveedor por ID
ProvidersRouter.delete('/providers/id/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const ProviderModel = await initialize();
      const provider = await ProviderModel.findByIdAndDelete(id);
      if (!provider) {
        return res.status(404).send({ message: 'Proveedor no encontrado' });
      }
      return res.send(provider);
    } catch (error) {
      return res.status(500).send(error);
    }
  });

