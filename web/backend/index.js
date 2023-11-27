require('dotenv').config();

const express = require('express');

const app = express();
const http = require('http')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./apis/Auth/index');
const userRoutes = require('./apis/UserManagement/index');
const projRoutes = require('./apis/ProjectManagement/index');
const taskRoutes = require('./apis/TaskManagement/index');
const sprintRoutes = require('./apis/SprintManagement/index');
const teamRoutes = require('./apis/TeamManagement/index');
const commRoutes = require('./apis/CommunicationManagement/index');
const sessionRoutes = require('./apis/SessionManagement/index');
const attendanceRoutes = require('./apis/AttendanceManagement/index');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(session({
    secret: process.env.SECRET_TOKEN,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/project', projRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/sprint', sprintRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/comm', commRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/attendance', attendanceRoutes);

app.use((err) => {
    console.error(err);
    res.status(500).json({
        error: err.message,
    });
});

http.createServer(app).listen(process.env.PORT || 3000,"0.0.0.0", () => {
    console.log(`--Server is running on port *:${process.env.PORT || 3000}`);
});