"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIo = exports.setupSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
let isInitialized = false;
const setupSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: 'https://connect.x-dev.site',
            credentials: true,
            methods: ['GET', 'POST'],
        },
    });
    isInitialized = true;
    io.on('connection', (socket) => {
        console.log('✅ A user Connected', socket.id);
        socket.on('join', (userId) => __awaiter(void 0, void 0, void 0, function* () {
            socket.join(userId);
            console.log(`📦 User ${userId} joined room`);
        }));
        /*socket.on('send_message', ({ recipientId, message }) => {
          io.to(recipientId).emit('recive_message', message); //send to recipient
          io.to(message.senderId).emit('rececive_message', message); // send back to sender for confirmation
        });*/
        socket.on('❌ disconnect', () => {
            console.log('A user disconnected', socket.id);
        });
    });
};
exports.setupSocket = setupSocket;
const getIo = () => {
    if (!isInitialized || !io)
        throw new Error('socket.io not Initialized');
    return io;
};
exports.getIo = getIo;
