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
    } //si se incluye el parametro id se busca por id de la base de datos
    else if (req.query.id) {
      const id = req.query.id;
      try {
        const furniture = await Furniture.findById({ id });
        if (!furniture) {
          return res.status(404).send({ message: 'Mueble no encontrado' });
        }
        return res.send(furniture);
      }
      catch (error) {
        return res.status(500).send({message: 'Error en la busqueda por id'}); 
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


// Actualizar un mueble por ID
FurnitureRouter.patch('/furnitures/id/:id', async (req: Request, res: Response) => {
  try {
    const furniture = await Furniture.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (furniture) {
      return res.send(furniture);
    } else {
      return res.status(404).send('Furniture not found');
    }
  } catch (err) {
    return res.status(400).send(err);
  }
});
  

// Borrar un mueble por ID
FurnitureRouter.delete('/furnitures/id/:id', async (req: Request, res: Response) => {
// buscar un mueble por id y si existe eliminarlo
    const id = req.params.id;
    try {
      const furniture = await Furniture.findByIdAndDelete(id);
      if (!furniture) {
        return res.status(404).send({ message: 'Mueble no encontrado' });
      }
      return res.send(furniture);
    } catch (error) {
      return res.status(500).send(error);
    }
});
  
  
// Actualizar un mueble por query string (campos flexibles)
FurnitureRouter.patch('/furnitures/', async (req: Request, res: Response) => {
  const { name, id, material, ...updates } = req.query; // Obtener los campos de la consulta
  let query = {}; // Inicializar el objeto de consulta

  // Construir la consulta en función de los campos proporcionados
  if (name) {
    query = { ...query, name: name.toString() };
  }
  if (id) {
    query = { ...query, _id: id.toString() };
  }
  if (material) {
    query = { ...query, material: material.toString() };
  }

  // Verificar si hay campos para actualizar
  if (Object.keys(updates).length === 0) {
    return res.status(400).send({ error: 'No updates provided' }); // Si no hay campos para actualizar, devolver un error 400
  }

  try {
    const furniture = await Furniture.findOneAndUpdate(query, updates, { new: true, runValidators: true }); // Actualizar el mueble según la consulta y los campos proporcionados
    if (!furniture) {
      return res.status(404).send('Furniture not found'); // Si no se encuentra el mueble, devolver un error 404
    }
    return res.send(furniture); // Enviar el mueble actualizado como respuesta
  } catch (error) {
    return res.status(400).send(error); // Si ocurre algún error, devolver un error 400
  }
});
  

// Borrar un mueble por query string (campos flexibles)
FurnitureRouter.delete('/furnitures', async (req: Request, res: Response) => {
  //si en el query string se encuentra el parámetro id se busca por id y se actualiza con el mueble nuevo
  if (req.query.id) {
    const id = req.query.id;
    try {
      const furniture = await Furniture.findByIdAndDelete({id});
      if (!furniture) {
        return res.status(404).send({ message: 'Mueble no encontrado' });
      }
      return res.send(furniture);
    } catch (error) {
      return res.status(404).send({message: 'fallo en la busqueda del id'});
    }
  } // si se encuentra el parámetro nombre se busca por nombre y se actualiza con el mueble nuevo
  else if (req.query.nombre) {
    const nombre = req.query.nombre;
    try {
      const furniture = await Furniture.findOneAndDelete({ nombre });
      if (!furniture) {
        return res.status(404).send({ message: 'Mueble no encontrado' });
      }
      return res.send(furniture);
    } catch (error) {
      return res.status(500).send(error);
    }
  } // si se encuentra el parámetro material se busca por material y se actualiza con el mueble nuevo
  else if (req.query.material) {
    const material = req.query.material;
    try {
      const furniture = await Furniture.findOneAndDelete({ material });
      if (!furniture) {
        return res.status(404).send({ message: 'Mueble no encontrado' });
      }
      return res.send(furniture);
    } catch (error) {
      return res.status(500).send(error);
    }
  } // si no se encuentra ningun parametro se devuelve un error
  else {
    return res.status(404).send({message: 'No se ha encontrado el mueble'});
  }
});