import { connect } from 'mongoose';

connect("mongodb+srv://DSIkea-rest-api:DSIkea@clusterdsikea.3wvgsf9.mongodb.net/")
.then(() => {
  console.log('Connection to MongoDB server established');
}).catch(() => {
  console.log('Unable to connect to MongoDB server');
});