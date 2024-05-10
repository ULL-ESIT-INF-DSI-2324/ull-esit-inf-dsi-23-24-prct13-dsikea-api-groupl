import { Document, connect, model, Schema } from 'mongoose';

// Definición del esquema
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
  quantity?: number;
  color: string;
}

// Creación del esquema de la base de datos
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
  quantity: { type: Number },
  color: {
    type: String,
    required: true,
    enum: ["red", "purple", "blue", "green", "orange", "brown", "yellow", "black", "white", "pink"],
  },
});



// Creamos el modelo Customer con model<ICustomer>("Customer", customerSchema)
const Furniture = model<IFurniture>("Customer", furnitureSchema);

// Exportamos el modelo Customer
export default Furniture;