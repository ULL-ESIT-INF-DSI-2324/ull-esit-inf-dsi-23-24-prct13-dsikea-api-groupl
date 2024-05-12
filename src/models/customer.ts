import mongoose, { Schema, Document, model } from 'mongoose';
import { Request, Response } from 'express';
import validator from 'validator';

/**
 * Función para validar el NIF utilizando una expresión regular
 * @param nif Número de identificación fiscal (sin la letra)
 * @returns Devuelve true si el NIF es válido, de lo contrario devuelve false
 */
function validarNIF(nif: string): boolean {
    const regex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
    return regex.test(nif);
}


/**
 * Interfaz que define la estructura del cliente en la base de datos.
 */
interface ICustomer extends Document {
    nombre: string;
    apellido: string;
    nif: string;
    direccion: string;
    telefono: string;
}

/**
 * Esquema de Mongoose que define la estructura del modelo de cliente.
 */
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


/**
 * Modelo de Mongoose para el cliente.
 */
const Customer = model<ICustomer>("Customer", customerSchema);

// Exportamos el modelo Customer
export default Customer;