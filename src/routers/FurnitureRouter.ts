import express, { Request, Response } from 'express';
import Furniture from '../models/furniture.js'; // Ajusta la importación según sea necesario

export const FurnitureRouter = express.Router();

/**
 * Ruta para crear un nuevo mueble.
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - El mueble creado
 */
FurnitureRouter.post('/furnitures', async (req: Request, res: Response) => {
  try {
    const furniture = new Furniture(req.body);
    await furniture.save();
    res.status(201).send(furniture);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * Ruta para leer todos los muebles o buscar por material, nombre o descripción si se proporciona en el query string.
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - Los muebles encontrados
 */
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
  

/**
 * Ruta para leer un mueble por su ID.
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - El mueble encontrado
 */
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


/**
 * Ruta para actualizar un mueble por su ID.
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - El mueble actualizado
 */
FurnitureRouter.patch('/furnitures/:id', async (req: Request, res: Response) => {
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
  

/**
 * Ruta para borrar un mueble por su ID.
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - El mueble eliminado
 */
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
  
  
/**
 * Ruta para actualizar un mueble por query string (campos flexibles).
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - El mueble actualizado
 */
FurnitureRouter.patch('/furnitures', async (req: Request, res: Response) => {
  if(req.query.nombre){
    const name:string = req.query.nombre.toString();
    const filter = {name: name}
    try{
      const furniture = await Furniture.updateMany(filter, req.body)
      if (furniture) {
        return res.send(furniture);
      } else {
        return res.status(404).send('Furniture not found');
      }
    } catch(error){
      return res.status(404).send(error);
    }
  } else if(req.query.id){
    try{
      const furniture = await Furniture.findByIdAndUpdate(req.query.id, req.body)
      if (furniture) {
        return res.send(furniture);
      } else {
        return res.status(404).send('Furniture not found');
      }
    } catch(error){
      return res.status(404).send(error);
    }
  } else {
    return res.status(400).send('Name parameter is required');
  }
});
  

/**
 * Ruta para borrar un mueble por query string (campos flexibles).
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @returns - El mueble eliminado
 */
FurnitureRouter.delete('/furnitures', async (req: Request, res: Response) => {
  //si en el query string se encuentra el parámetro id se busca por id y se actualiza con el mueble nuevo
  if (req.query.id) {
    const id = req.query.id;
    try {
      const furniture = await Furniture.findByIdAndDelete(id);
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
    const material = req.query.material.toString();
    let filter = { material: material }
    try {
      const furniture = await Furniture.deleteMany(filter);
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