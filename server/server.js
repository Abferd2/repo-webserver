require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


require('./routes/usuario');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

/*mongoose.connect('mongodb://localhost:27017/cafe',
    (err, res) => {
        if (err) throw err;
        console.log('base de datos online', res);

    });*/
//mongodb+srv://new-admin:T7fEUuHNgqPa3Rvn@cluster0-al2mu.mongodb.net/cafe
const connectDB = async() => {
    //let conection = await mongoose.connect('mongodb://localhost:27017/cafe', {
    let conection = await mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        server: {
            socketOptions: {
                keepAlive: 300000,
                connectTimeoutMS: 30000
            }
        },
        replset: {
            socketOptions: {
                keepAlive: 300000,
                connectTimeoutMS: 30000
            }
        }
    });
    console.log('conection');
}

connectDB();
//T7fEUuHNgqPa3Rvn
//new-admin
app.use(require('./routes/usuario'));

app.get('/ports', (req, res) => {
    res.json({
        port: process.env.PORT
    });
})

app.listen(process.env.PORT, () => {
    console.log('escuchando puerto: ', process.env.PORT);
})