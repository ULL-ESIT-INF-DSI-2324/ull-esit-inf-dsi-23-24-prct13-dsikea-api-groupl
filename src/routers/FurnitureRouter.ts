import express, { Request, Response } from 'express';
import Furniture from '../models/furniture.js'; // Ajusta la importación según sea necesario

export const FurnitureRouter = express.Router();

// Crear un nuevo mueble
FurnitureRouter.post('/furnitures', async (req: Request, res: Response) => {
  try {
    const furniture = new Furniture(req.body);
    await furniture.save();
    res.status(201).send(furniture);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Leer todos los muebles
FurnitureRouter.get('/furnitures', async (req: Request, res: Response) => {
  /*
    try {
      const furnitures = await Furniture.find();
      res.send(furnitures);
    } catch (error) {
      res.status(500).send(error);
    }
    */
   //si en el query se encuentra el parámetro material o nombre o descripcion se busca por esos campos
    if (req.query.material || req.query.nombre || req.query.descripcion) {
      const material = req.query.material;
      const nombre = req.query.nombre;
      const descripcion = req.query.descripcion;
      try {
        const furniture = await Furniture.find({ material, nombre, descripcion });
        if (!furniture) {
          return res.status(404).send({ message: 'Mueble no encontrado' });
        }
        return res.send(furniture);
      } catch (error) {
        return res.status(500).send(error);
      }
    } else {
      //si no se encuentra ningun parametro se listan todos los muebles
      try {
        const furnitures = await Furniture.find();
        return res.send(furnitures);
      } catch (error) {
        return  res.status(500).send(error);
    }
  }

});
  

// Leer un mueble por ID
FurnitureRouter.get('/furnitures/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const furniture = await Furniture.findById(id);
      if (!furniture) {
        return res.status(404).send({ message: 'Mueble no encontrado' });
      }
      return res.send(furniture);
    } catch (error) {
      return res.status(500).send(error);
    }
}); 

/*
// Actualizar un mueble por ID
FurnitureRouter.put('/furnitures/id/:id', async (req: Request, res: Response) => {
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
FurnitureRouter.delete('/furnitures/id/:id', async (req: Request, res: Response) => {
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
FurnitureRouter.get('/furnitures/query', async (req: Request, res: Response) => {
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
FurnitureRouter.put('/furnitures/query', async (req: Request, res: Response) => {
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
FurnitureRouter.delete('/furnitures/query', async (req: Request, res: Response) => {
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
*/
