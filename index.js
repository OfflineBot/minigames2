"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const game_1 = require("./src/game");
const socket_1 = require("./src/socket");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
let game = new game_1.Game();
const PORT = process.env.PORT || 8000;
app.set("view engine", "ejs");
app.use(express_1.default.static("public"));
(0, socket_1.setup_socket)(io, game);
app.get("/", (_, res) => {
    res.render("index");
});
server.listen(PORT, () => console.log(`Server running on port: ${PORT}..`));
