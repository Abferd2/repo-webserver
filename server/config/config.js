//==========================
//  PORT
//==========================

process.env.PORT = process.env.PORT || 3000;

//==========================
//  ambiente
//==========================

process.env.NODE_ENV = process.env.NODE_ENV || 'DEV';

let urlDB;

if (process.env.NODE_ENV !== 'DEV') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://new-admin:T7fEUuHNgqPa3Rvn@cluster0-al2mu.mongodb.net/cafe'
}

process.env.URLDB = urlDB;