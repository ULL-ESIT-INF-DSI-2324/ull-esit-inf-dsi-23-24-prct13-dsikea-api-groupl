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

// Exportamos el modelo Customer
export default Customer;

// crear un cliente
export const createCustomer = async (req: Request, res: Response) => {
    try {
        // Creamos una nueva instancia del modelo Customer con los datos del cuerpo de la solicitud (req.body)
        const newCustomer = new Customer(req.body);
        // Guardamos el nuevo cliente en la base de datos
        const savedCustomer = await newCustomer.save();
        // Respondemos con el cliente recién guardado
        res.status(201).json(savedCustomer);
    } catch (error) {
        // En caso de error, respondemos con un código de estado 400 y un mensaje de error
        res.status(400).json({ message: error.message });
    }
};

// leer un cliente
export const getCustomer = async (req: Request, res: Response) => {
    try {
        const { customerId } = req.params;
        const customer = await Customer.findById(customerId);
        res.json(customer);
    } catch (error) {
        res.status(404).json({ message: 'Cliente no encontrado' });
    }
};

// actualizar un cliente
export const updateCustomer = async (req: Request, res: Response) => {
    try {
        const { customerId } = req.params;
        const updatedCustomer = await Customer.findByIdAndUpdate(customerId, req.body, { new: true });
        res.json(updatedCustomer);
    } catch (error) {
        res.status(404).json({ message: 'Cliente no encontrado' });
    }
};

// borrar un cliente
export const deleteCustomer = async (req: Request, res: Response) => {
    try {
        const { customerId } = req.params;
        await Customer.findByIdAndDelete(customerId);
        res.json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
        res.status(404).json({ message: 'Cliente no encontrado' });
    }
};

// leer un cliente por NIF
export const getCustomerByNIF = async (req: Request, res: Response) => {
    try {
        const { nif } = req.query;
        const customer = await Customer.findOne({ nif: nif as string });
        res.json(customer);
    } catch (error) {
        res.status(404).json({ message: 'Cliente no encontrado' });
    }
};

// actualizar un cliente por NIF
export const updateCustomerByNIF = async (req: Request, res: Response) => {
    try {
        const { nif } = req.query;
        const updatedCustomer = await Customer.findOneAndUpdate({ nif: nif as string }, req.body, { new: true });
        res.json(updatedCustomer);
    } catch (error) {
        res.status(404).json({ message: 'Cliente no encontrado' });
    }
};

// borrar un cliente por NIF
export const deleteCustomerByNIF = async (req: Request, res: Response) => {
    try {
        const { nif } = req.query;
        await Customer.findOneAndDelete({ nif: nif as string });
        res.json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
        res.status(404).json({ message: 'Cliente no encontrado' });
    }
};
