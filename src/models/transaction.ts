import { Schema, model, Document } from "mongoose";
import { customerSchema } from "./customer.js";
import { providerSchema } from "./provider.js";
import { furnitureSchema } from "./furniture.js";

// Definición de la interfaz para el documento de transacción
interface Transaction extends Document {
  type: "Compra" | "Venta";
  furniture: (typeof furnitureSchema)[];
  customer?: typeof customerSchema;
  provider?: typeof providerSchema;
  timestamp: Date;
}

// Definición del esquema de transacción
export const transactionSchema = new Schema<Transaction>({
  type: {
    type: String,
    enum: ["Compra", "Venta"],
    required: true,
  },
  furniture: [
    {
      type: Schema.Types.ObjectId,
      ref: "Furniture",
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
  },
});

// Creación del modelo de transacción
const TransactionModel = model<Transaction>("Transaction", transactionSchema);

// Función para obtener transacciones por tipo
export async function getTransactionsByType(type: "Compra" | "Venta"): Promise<Transaction[]> {
  try {
    const transactions = await TransactionModel.find({ type }).populate("furniture customer provider");
    return transactions;
  } catch (error) {
    throw new Error("Error fetching transactions");
  }
}

// Función para obtener transacciones por proveedor
export async function getTransactionsByProvider(providerId: string): Promise<Transaction[]> {
  try {
    const transactions = await TransactionModel.find({ provider: providerId }).populate("furniture customer provider");
    return transactions;
  } catch (error) {
    throw new Error("Error fetching transactions");
  }
}

export default TransactionModel;
