import mongoose, { Schema, Document, model } from 'mongoose';
import { Request, Response } from 'express';

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
    nif: { type: String, required: true, unique: true },
    direccion: { type: String, required: true },
    telefono: { type: String, required: true }
});


// Creamos el modelo Customer con model<ICustomer>("Customer", customerSchema)
const Customer = model<ICustomer>("Customer", customerSchema);

const customer = new Customer({
    nombre: "Loren",
    apellido: "PEPE",
    nif: "333333M",
    direccion: "Micasa",
    telefono: "666666666"
  });

customer.save().then((result) => {
    console.log(result);
  }).catch((error) => {
    console.log(error);
  });

// Exportamos el modelo Customer
export default Customer;