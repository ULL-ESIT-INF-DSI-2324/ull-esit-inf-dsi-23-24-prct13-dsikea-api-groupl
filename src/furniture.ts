import { Document, connect, model, Schema } from 'mongoose';

// Conexión a la base de datos
async function connectToDatabase() {
  try {
    await connect("mongodb://127.0.0.1:27017/furnitures");
    console.log("Connected to the furnitures database");
  } catch (error) {
    console.log("Failed to connect to the furnitures database");
  }
}

// Definición del esquema
interface Furniture extends Document {
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
export const furnitureSchema: Schema<Furniture> = new Schema({
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

// Conexión a la base de datos y exportación del modelo
async function initialize() {
  await connectToDatabase();
  return model<Furniture>("Furniture", furnitureSchema);
}

export default initialize;
