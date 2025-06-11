
import express from "express";
import http from "http";
import { Server } from "socket.io";

import { Game } from "./src/game"
import { setup_socket } from "./src/socket";


const app = express();
const server = http.createServer(app);
const io = new Server(server);
let game = new Game();

const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.use(express.static("public"))

setup_socket(io, game);

app.get("/", (_: any, res: any) => {
    res.render("index")
})

server.listen(PORT, () => console.log(`Server running on port: ${PORT}..`))
