import { connect } from 'mongoose';


// Connect to Database
export let Launch = async () => {
   await connect("mongodb+srv://DSIkea-rest-api:DSIkea@clusterdsikea.3wvgsf9.mongodb.net/DSIkea-api").then(() => {
    console.log('Connected to the database');
  }).catch(() => {
    console.log('Something went wrong when conecting to the database');
    process.exit(-1);
  });
}