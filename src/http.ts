import "reflect-metadata"

import express from "express";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import "dotenv/config";

const app = express();
const server = createServer(app);
const io = new Server(server);

// mongoose.connect("mongodb://localhost/rocketsocket");
mongoose.connect(process.env.MONGO_URL);
app.use(express.static(path.join(__dirname, "..", "public")));

io.on("connection", (socket) => {
    console.log("Socket", socket.id);
})

export { server, io };