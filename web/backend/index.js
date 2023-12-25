require('dotenv').config();

const express = require('express');

const app = express();
const http = require('http')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./apis/authentication.js');

const backLogs = require('./apis/backlog.js');

const projects = require('./apis/projects.js')

const team = require('./apis/team.js')

const notifcation = require('./apis/notifications.js')

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
app.use('/api/project', projects);
app.use('/api/team', team);
app.use('/api/notifications', notifcation);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});


http.createServer(app).listen(process.env.PORT || 3000, "0.0.0.0", () => {
    console.log(`--Server is running on port *:${process.env.PORT || 3000}`);
});