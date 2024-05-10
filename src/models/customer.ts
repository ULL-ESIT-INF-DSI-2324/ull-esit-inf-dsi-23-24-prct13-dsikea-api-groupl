import mongoose, { Schema, Document, model } from 'mongoose';
import { Request, Response } from 'express';
import validator from 'validator';

// haz un validador de NIF con regex
function validarNIF(nif: string): boolean {
    const regex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
    return regex.test(nif);
}


// Definimos la interfaz para el modelo Customer
interface ICustomer extends Document {
    nombre: string;
    apellido: string;
    nif: string;
    direccion: string;
    telefono: string;
}

// Definimos el esquema del modelo Customer
export const customerSchema: Schema = new Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    nif: { 
      type: String, 
      required: true, 
      unique: true, 
      // incluye el validador aquí
        validate: {
            validator: validarNIF,
            message: 'NIF no válido'
        }
    },
    direccion: { type: String, required: true },
    telefono: { type: String, required: true }
});


// Creamos el modelo Customer con model<ICustomer>("Customer", customerSchema)
const Customer = model<ICustomer>("Customer", customerSchema);

// Exportamos el modelo Customer
export default Customer;