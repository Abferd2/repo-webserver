//==========================
//  PORT
//==========================

process.env.PORT = process.env.PORT || 3000;

//==========================
//  ambiente
//==========================

process.env.NODE_ENV = process.env.NODE_ENV || 'DEV';

let urlDB;

if (process.env.NODE_ENV === 'DEV') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//==========================
//  vencimiento token
//==========================
let time = 60 * 60 * 24 * 30 * 12;
process.env.TIMETOKEN = time;

//==========================
//  SEED
//==========================
process.env.NODE_SEED = process.env.NODE_SEED || 'seed-dev-demo';

//==========================
//  GOOGLE CLIENT
//==========================
process.env.GOOGLE_CLI = process.env.GOOGLE_CLI || '1075211621180-bsh4poosbl7f3i0qhrnk9daug4dvga1t.apps.googleusercontent.com';