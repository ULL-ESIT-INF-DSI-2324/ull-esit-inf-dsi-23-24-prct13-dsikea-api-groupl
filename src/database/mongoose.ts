import { connect } from 'mongoose';


// Connect to Database
export let Launch = async () => {
   await connect(process.env.MONGODB_URL!).then(() => {
    console.log('Connected to the database');
  }).catch(() => {
    console.log('Something went wrong when conecting to the database');
    process.exit(-1);
  });
}