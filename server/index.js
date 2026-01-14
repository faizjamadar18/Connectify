import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from "node:http"; // used for manually creating our own server 


import { connectToSocket } from './controllers/socketController.js';

import authRoute from './routes/authRoutes.js';
import userRoute from './routes/userRoutes.js';
import chatRoute from './routes/chatRoutes.js';
import userChat from './routes/userChatRoutes.js';







dotenv.config();

const app = express();
const PORT = process.env.PORT || 8989;
const { MONGO_URL } = process.env;

const server = createServer(app);
connectToSocket(server);


// parse : converting raw data into usable format 
app.use(express.json());  //Parses JSON request bodies 
app.use(express.urlencoded({ extended: true }));   // Parses form data supporting nested objects
app.use(cors({
    origin: ["https://connectifyx.vercel.app", "http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));





app.use('/user', authRoute);

app.use('/user-update', userRoute);


app.use("/chatRoute", chatRoute);

app.use("/chat-user", userChat);






app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});


app.use((err, req, res, next) => {
    return res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

const startServer = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('MongoDB is connected.');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }

    server.listen(PORT, () => {
        console.log(`App has been listening on port: ${PORT}`);
    });
};

startServer();