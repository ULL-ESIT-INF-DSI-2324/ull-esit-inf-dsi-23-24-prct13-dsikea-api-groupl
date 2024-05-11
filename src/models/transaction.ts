import { Schema, model, Document } from "mongoose";
import { customerSchema } from "./customer.js";
import { providerSchema } from "./provider.js";
import { furnitureSchema } from "./furniture.js";
import IFurniture from "./furniture.js";

// Definición de la interfaz para el documento de transacción
interface ITransaction extends Document {
  type: "Compra" | "Venta";
  furniture: Array<{
    furniture: typeof furnitureSchema,
    quantity: Number,
  }>,
  customer: typeof customerSchema;
  provider: typeof providerSchema;
  price: Number;
  timestamp: Date;
}

// Definición del esquema de transacción
export const transactionSchema = new Schema({
  type: {
    type: String,
    enum: ["Compra", "Venta"],
    required: true,
  },
  furniture: [{
    furnitureId: {
      type: Schema.Types.ObjectId,
      ref: 'Furniture',
    },
    quantity: {
      type: Number,
    }
  }],
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
  },
  provider: {
    type: Schema.Types.ObjectId,
    ref: "Provider",
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required:true,
  },
  price: {
    type: Number,
    required: true,
    validate: {
      validator: (value: number) => value >= 0,
      message: "Price must be a positive number",
    },
  },
});

// Creación del modelo de transacción
const Transaction = model<ITransaction>("Transaction", transactionSchema);
/* 
// Creación de la primera transacción
const transaction1: ITransaction = new Transaction({
  type: 'Compra',
  furniture: [{
    furnitureId: '<ID del mueble comprado>',
    quantity: 5, // Cantidad de muebles comprados
  }],
  customer: '123',
  provider: '1',
  timestamp: new Date(),
  price: 1500, // Precio total de la compra
});

// Creación de la segunda transacción
const transaction2: ITransaction = new Transaction({
  type: 'Venta',
  furniture: [{
    furnitureId: '<ID del mueble vendido>',
    quantity: 2, // Cantidad de muebles vendidos
  }],
  customer: '321',
  provider: '2',
  timestamp: new Date(),
  price: 800, // Precio total de la venta
});

// Guardamos las nuevas transacciones en la base de datos
transaction1.save()
  .then((savedTransaction1: ITransaction) => {
    console.log('Nueva transacción creada:', savedTransaction1);
  })
  .catch((error: Error) => {
    console.error('Error al crear la nueva transacción:', error);
  });

transaction2.save()
  .then((savedTransaction2: ITransaction) => {
    console.log('Nueva transacción creada:', savedTransaction2);
  })
  .catch((error: Error) => {
    console.error('Error al crear la nueva transacción:', error);
  }); */
export default Transaction;
