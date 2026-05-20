const express = require('express');

const cors = require('cors');

const helmet = require('helmet');

const morgan = require('morgan');

const session = require('express-session');

const passport = require('./config/passport');

const https = require('https');

const fs = require('fs');

require('dotenv').config();

const app = express();


// ================= Middleware =================

app.use(express.json());

app.use(cors());

app.use(helmet());

app.use(morgan('dev'));

app.use(
    session({
        secret: process.env.SESSION_SECRET,

        resave: false,

        saveUninitialized: true
    })
);

app.use(passport.initialize());

app.use(passport.session());


// ================= Routes =================

const authRoutes =
require('./routes/authRoutes');

const adminRoutes =
require('./routes/adminRoutes');

const documentRoutes =
require('./routes/documentRoutes');


app.use(
    '/api/auth',
    authRoutes
);

app.use(
    '/api/admin',
    adminRoutes
);

app.use(
    '/api/documents',
    documentRoutes
);


// ================= HTTPS =================

const options = {

    key:
    fs.readFileSync('server.key'),

    cert:
    fs.readFileSync('server.cert')
};


// ================= Server =================
app.get('/', (req, res) => {

    res.send('Secure Vault API Running');
});
https.createServer(
    options,
    app
).listen(
    process.env.PORT || 5000,

    () => {

        console.log(
            `HTTPS Server Running On Port ${process.env.PORT || 5000}`
        );
    }
);