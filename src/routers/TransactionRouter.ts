
import express, { Request, Response } from 'express';
import  Transaction, { transactionSchema }  from '../models/transaction.js';
import  Customer from '../models/customer.js';
import  Furniture  from '../models/furniture.js';
import  Provider  from '../models/provider.js';

export const TransactionRouter = express.Router();


TransactionRouter.get('/transactions', async(req: Request, res: Response) => {

// si se incluye un query string en el que aparezca el parámetro nif se pusca por ese nif, si aparece el parámetro date este tendrá dos fechas y deberá buscar las transacciones entre esas dos fechas 
if (req.query.nif) {
    const nif = req.query.nif;
    try {
      const customer = await Customer.findOne({ nif });
      if (!customer) {
        return res.status(404).send({ message: 'Cliente no encontrado' });
      }
      const transactions = await Transaction.find({customer: customer._id});
      return res.send(transactions);
    } catch (error) {
      return res.status(404).send({ message: 'No existen transacciones'});
    }
  } else if (req.query.date){
    const date = req.query.date;
    try {
      const transactions = await Transaction.find({date});
      return res.send(transactions);
    } catch (error) {
      return res.status(404).send({ message: 'No existen transacciones'});
    }
  } // si en el query se incluye un parámetro tipo se buscará por ese tipo
  else if(req.query.type){
    const type = req.query.type;
    try {
      const transactions = await Transaction.find({ type });
      return res.send(transactions);
    } catch ( error ){
      return res.status(404).send({ message: 'No existen transacciones de ese tipo'});
    }
  } // si se incluye el parámetro id se buscará por el id de la base de datos
  else if(req.query.id){
    const id = req.query.id;
    try {
      const transactions = await Transaction.findById({ id })
      return res.send(transactions);

  } catch (error){
    return res.status(404).send({ message: 'No existen transacciones con ese id' });
  } 
  } else {
    try {
      const transactions = await Transaction.find();
      return res.send(transactions);
    } catch (error) {
      return res.status(404).send({ message: 'No existen transacciones'});
    }
  }
});


/*


TransactionRouter.post('/transactions', async(req: Request, res: Response) => {
  // comprobar que el cliente o el proveedor existe
  const customer = await Customer.findById(req.body.customer);
  const provider = await Provider.findById(req.body.provider);    
});

*/

/*
TransactionRouter.delete('/transactions/id/:id', async(req: Request, res: Response) => {
  //para realizar el borrado de una transaccion se debe de proporcionar el id de la transaccion, se tendrá que actualizar la informacion del stock se los muebles involucrados
  const id = req.params.id;
  try {
    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
      return res.status(404).send({  message: 'No existen clientes/proveedores con ese id' });


});

*/