import express from 'express';
import './database/mongoose.js';
import {CustomerRouter}  from './routers/CustomerRouter.js';
import {FurnitureRouter}  from './routers/FurnitureRouter.js';
import {ProvidersRouter}  from './routers/ProviderRouter.js';
import { TransactionRouter } from './routers/TransactionRouter.js';

export const app = express();
app.use(express.json());
app.use(CustomerRouter);
app.use(ProvidersRouter);
app.use(FurnitureRouter);
app.use(TransactionRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});