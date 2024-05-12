import { Document, connect, model, Schema } from "mongoose";
import validator from 'validator';

/**
 * Interfaz que define la estructura de un proveedor en la base de datos.
 */
interface IProvider extends Document {
  name: string;
  contact: string;
  address: string;
  cif: string;
  email?: string;
  mobilePhone?: number;
}

/**
 * Esquema de Mongoose que define la estructura de un proveedor en la base de datos.
 */
export const providerSchema = new Schema({
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


const Provider = model<IProvider>('Provider', providerSchema);

export default Provider;