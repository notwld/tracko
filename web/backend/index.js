require('dotenv').config();

const express = require('express');

const app = express();
const http = require('http')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs/promises');

const authRoutes = require('./apis/authentication.js');

const backLogs = require('./apis/backlog.js');

const projects = require('./apis/projects.js')

const team = require('./apis/team.js')

const notifcation = require('./apis/notifications.js')

const pokerPlanning = require('./apis/poker-planning.js')

const usecase = require('./apis/usecase.js')

const sprint = require('./apis/sprint.js')

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

app.use('/audio-proxy', async (req, res) => {
    const { uri } = req.body;
    const response = await fetch(uri);
    console.log(uri);
    if (!response.ok) {
        res.status(500).json({ error: 'Failed to fetch audio' });
        return;
    }

    const blob = await response.blob();
    console.log(blob);
    try {
        const filePath = path.join(__dirname, 'assets', 'audio', `${Date.now()}.3gpp`); 
        console.log(filePath);
        await fs.writeFile(filePath, blob)
        .then(() => {
            console.log('File written successfully\n');
        })

        res.status(200).json({ success: true, filePath });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save audio' });
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/backlog', backLogs);
app.use('/api/project', projects);
app.use('/api/team', team);
app.use('/api/notifications', notifcation);
app.use('/api/poker-planning', pokerPlanning);
app.use("/api/usecase", usecase);
app.use("/api/sprint", sprint);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});


http.createServer(app).listen(process.env.PORT || 3000, "0.0.0.0", () => {
    console.log(`--Server is running on port *:${process.env.PORT || 3000}`);
});