import express from 'express';
import './database/mongoose.js';
import {CustomerRouter}  from './routers/CustomerRouter.js';
import {FurnitureRouter}  from './routers/FurnitureRouter.js';
import {ProvidersRouter}  from './routers/ProviderRouter.js';
import { TransactionRouter } from './routers/TransactionRouter.js';
// Creación de la aplicación Express
export const app = express();
// Middleware para parsear el cuerpo de las solicitudes entrantes como JSON
app.use(express.json());
// Configuración de los enrutadores
app.use(CustomerRouter);
app.use(ProvidersRouter);
app.use(FurnitureRouter);
app.use(TransactionRouter);
// Definición del puerto, utilizando el proporcionado en las variables de entorno o el puerto 3000 por defecto
const port = process.env.PORT || 3000;
// Inicio del servidor en el puerto especificado
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});