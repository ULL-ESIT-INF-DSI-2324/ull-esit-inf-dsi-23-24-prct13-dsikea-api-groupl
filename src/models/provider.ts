import { Document, connect, model, Schema } from "mongoose";
import validator from 'validator';

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
      message: 'El CIF debe tener 9 carácteres.'
    }
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: 'Email es inválido.'
    }
  },
  mobilePhone: {
    type: Number,
    validate: {
      validator: (value: number) => validator.isMobilePhone(value.toString()),
      message: 'Telefono es inválido.'
    }
  },
});


export const Provider = model<Provider>('Provider', providerSchema);