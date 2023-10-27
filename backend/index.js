import express from 'express';
import cors from 'cors';
import { config } from 'dotenv'; // Import config from dotenv
import mysql from 'mysql';
import cookieParser from 'cookie-parser';
import Jwt from 'jsonwebtoken';

config(); // Initialize dotenv

const app = express();
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Move the middleware that requires the body parsing above other routes
app.use(express.static('Public'));

const jwtSecretKey = process.env.JWT_SECRET_KEY; // Use environment variable for JWT secret
const dbPassword = process.env.DB_PASSWORD; // Use environment variable for database password

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sagehill#23',
    database: 'authusers'
});

// Connect to the database
connection.connect(function (error) {
    if (error) throw error;
    else console.log('Successful connection');
});

// Handle errors in JWT verification
const handleJWTError = (res, error) => {
    console.error('JWT Verification Error: ', error);
    return res.status(401).json({ Status: false, Error: 'Unauthorized' });
};

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        Jwt.verify(token, jwtSecretKey, (err, decoded) => {
            if (err) return handleJWTError(res, err);
            req.id = decoded.id;
            req.role = decoded.role;
            next();
        });
    } else {
        return res.status(401).json({ Status: false, Error: 'Not authenticated' });
    }
};

app.get('/verify', verifyUser, (req, res) => {
    return res.json({ Status: true, role: req.role, id: req.id });
});

app.listen(3000, () => {
    console.log('Server is running');
});
