import { Document, model, Schema } from 'mongoose';

/**
 * Interfaz que define la estructura de un mueble en la base de datos.
 */
interface IFurniture extends Document {
  name: string;
  description: string;
  material: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  price: number;
  stock: number;
  color: string;
}

/**
 * Esquema de Mongoose que define la estructura de un mueble en la base de datos.
 */
export const furnitureSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  material: {
    type: String,
    required: true,
    enum: ["plastic", "fabric", "metal", "wood", "glass",  "leather"],
  },
  dimensions: {
    type: {
      length: Number,
      width: Number,
      height: Number,
    },
    required: true,
  },
  price: { type: Number, required: true, validate: {
      validator: (value: number) => value >= 0,
      message: 'Price must be a positive number'
    }
  },
  stock: { type: Number,
    required: true,
   },
  color: {
    type: String,
    required: true,
    enum: ["red", "purple", "blue", "green", "orange", "brown", "yellow", "black", "white", "pink"],
  },
});



// Creamos el modelo Customer con model<ICustomer>("Customer", customerSchema)
const Furniture = model<IFurniture>("Furniture", furnitureSchema);

// Creación de un nuevo mueble
 /* const newFurniture: IFurniture = new Furniture({
  name: 'Silla de madera',
  description: 'Una silla fabricada en madera de roble',
  material: 'wood',
  dimensions: {
    length: 60,
    width: 50,
    height: 80,
  },
  price: 150,
  stock: 1,
  color: 'brown',
});

// Guardamos el nuevo mueble en la base de datos
newFurniture.save()
  .then((furniture: IFurniture) => {
    console.log('Nuevo mueble creado:', furniture);
  })
  .catch((error: Error) => {
    console.error('Error al crear el nuevo mueble:', error);
  });  */

// Exportamos el modelo Customer
export default Furniture;