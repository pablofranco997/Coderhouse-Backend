import mongoose from "mongoose";

const dbMongoose = () => {
    const URL = 'mongodb+srv://admin:admin@cluster0.lj9yk.mongodb.net/ecommerce?retryWrites=true&w=majority';

        let rta = await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Base de datos conectada');
}

const dbFirebase = () => {
    var admin = require("firebase-admin");

    var serviceAccount = require("./utilities/firebase/backendcoder-eee3f-firebase-adminsdk-bfk5v-8b16d5fd19.json");

    admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    });

    console.log('Base de datos conectada');
}

export default (dbMongoose, dbFirebase)