import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app';

dotenv.config();

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';

mongoose.connect(mongoUri)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
