import express, { Request, Response } from 'express';
import initializeFurnitureModel from '../models/furniture.js'; // Ajusta la importación según sea necesario

const router = express.Router();

// Crear un nuevo mueble
router.post('/furnitures', async (req: Request, res: Response) => {
  try {
    const Furniture = await initializeFurnitureModel(); // Llama a la función para obtener el modelo
    const furniture = new Furniture(req.body);
    await furniture.save();
    res.status(201).send(furniture);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Leer todos los muebles
router.get('/furnitures', async (req: Request, res: Response) => {
    try {
      const Furniture = await initializeFurnitureModel(); // Llama a la función para obtener el modelo
      const furnitures = await Furniture.find();
      res.send(furnitures);
    } catch (error) {
      res.status(500).send(error);
    }
});
  

// Leer un mueble por ID
router.get('/furnitures/id/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const Furniture = await initializeFurnitureModel(); // Llama a la función para obtener el modelo
      const furniture = await Furniture.findById(id);
      if (!furniture) {
        return res.status(404).send({ message: 'Mueble no encontrado' });
      }
      return res.send(furniture);
    } catch (error) {
      return res.status(500).send(error);
    }
}); 

// Actualizar un mueble por ID
router.put('/furnitures/id/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const Furniture = await initializeFurnitureModel(); // Llama a la función para obtener el modelo
      const furniture = await Furniture.findByIdAndUpdate(id, req.body, { new: true });
      if (!furniture) {
        return res.status(404).send({ message: 'Mueble no encontrado' });
      }
      return res.send(furniture);
    } catch (error) {
      return res.status(400).send(error);
    }
});
  

// Borrar un mueble por ID
router.delete('/furnitures/id/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const Furniture = await initializeFurnitureModel(); // Llama a la función para obtener el modelo
      const furniture = await Furniture.findByIdAndDelete(id);
      if (!furniture) {
        return res.status(404).send({ message: 'Mueble no encontrado' });
      }
      return res.send(furniture);
    } catch (error) {
      return res.status(500).send(error);
    }
});
  

// Leer un mueble por query string (campos flexibles)
router.get('/furnitures/query', async (req: Request, res: Response) => {
    const query = req.query;
    try {
      const Furniture = await initializeFurnitureModel(); // Llama a la función para obtener el modelo
      const furnitures = await Furniture.find(query);
      res.send(furnitures);
    } catch (error) {
      res.status(500).send(error);
    }
});
  

// Actualizar un mueble por query string (campos flexibles)
router.put('/furnitures/query', async (req: Request, res: Response) => {
    const query = req.query;
    const newData = req.body;
    try {
      const Furniture = await initializeFurnitureModel(); // Llama a la función para obtener el modelo
      const furniture = await Furniture.findOneAndUpdate(query, newData, { new: true });
      if (!furniture) {
        return res.status(404).send({ message: 'Mueble no encontrado' });
      }
      return res.send(furniture);
    } catch (error) {
      return res.status(400).send(error);
    }
});
  

// Borrar un mueble por query string (campos flexibles)
router.delete('/furnitures/query', async (req: Request, res: Response) => {
    const query = req.query;
    try {
      const Furniture = await initializeFurnitureModel(); // Llama a la función para obtener el modelo
      const furniture = await Furniture.findOneAndDelete(query);
      if (!furniture) {
        return res.status(404).send({ message: 'Mueble no encontrado' });
      }
      return res.send(furniture);
    } catch (error) {
      return res.status(500).send(error);
    }
});
  
export default router;
