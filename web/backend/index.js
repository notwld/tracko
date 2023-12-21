require('dotenv').config();

const express = require('express');

const app = express();
const http = require('http')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./apis/authentication.js');

const backLogs = require('./apis/backlog.js');

const productOwner = require('./apis/product_owner.js');

const projects = require('./apis/projects.js')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(session({
    secret: 'huzzukingshing',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));

app.use('/api/auth', authRoutes);
app.use('/api/backlog', backLogs);
app.use('/api/product-owner', productOwner);
app.use('/api/project', projects );

// app.use((err) => {
//     console.error(err);
//     res.status(500).json({
//         error: err.message,
//     });
// });

http.createServer(app).listen(process.env.PORT || 3000,"0.0.0.0", () => {
    console.log(`--Server is running on port *:${process.env.PORT || 3000}`);
});