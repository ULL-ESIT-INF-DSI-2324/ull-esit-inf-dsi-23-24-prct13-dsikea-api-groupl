import { connect } from 'mongoose';

try {
  await connect(process.env.MONGODB_URL!);
  // Intenta conectarse a la URL de MongoDB proporcionada en las variables de entorno
  console.log('Connection to MongoDB server established');
} catch (error) {
  console.log(error);
}