import { Schema, model, Document } from "mongoose";
import { customerSchema } from "./customer.js";
import { providerSchema } from "./provider.js";
import { furnitureSchema } from "./furniture.js";

// Definición de la interfaz para el documento de transacción
interface ITransaction extends Document {
  type: "Compra" | "Venta";
  furniture: (typeof furnitureSchema)[];
  customer?: typeof customerSchema;
  provider?: typeof providerSchema;
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
  furniture: [
    {
      type: Schema.Types.ObjectId,
      ref: "Furniture",
      required: true,
    },
  ],
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


export default Transaction;
