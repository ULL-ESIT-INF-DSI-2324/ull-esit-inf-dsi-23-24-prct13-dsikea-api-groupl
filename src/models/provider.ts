import { Document, connect, model, Schema } from "mongoose";
import validator from 'validator';


// Conexión a la base de datos
async function connectToDatabase() {
  try {
    await connect("mongodb://127.0.0.1:27017/providers");
    console.log("Connected to the providers database");
  } catch (error) {
    console.log("Failed to connect to the providers database");
  }
}

// Interfaz para el modelo de proveedores
interface Provider extends Document {
  name: string;
  contact: string;
  address: string;
  cif: string;
  email?: string;
  mobilePhone?: number;
}

// Esquema para el modelo de proveedores
export const providerSchema: Schema<Provider> = new Schema({
  name: { type: String, required: true, trim: true },
  contact: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  cif: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => validator.isLength(value, { min: 9, max: 9 }),
      message: 'CIF must have 9 characters'
    }
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: 'Email is invalid'
    }
  },
  mobilePhone: {
    type: Number,
    validate: {
      validator: (value: number) => validator.isMobilePhone(value.toString()),
      message: 'Telephone is invalid'
    }
  },
});

// Conexión a la base de datos y exportación del modelo
async function initialize() {
  await connectToDatabase();
  return model<Provider>("Provider", providerSchema);
}

export default initialize;
