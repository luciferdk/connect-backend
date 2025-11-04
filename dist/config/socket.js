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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIo = exports.setupSocket = void 0;
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let io;
let isInitialized = false;
const onlineUsers = new Map(); //userId -> socketId
const setupSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
            methods: ['GET', 'POST'],
        },
    });
    isInitialized = true;
    io.on('connection', (socket) => {
        // console.log('✅ A user Connected', socket.id);
        socket.on('join', (userId) => __awaiter(void 0, void 0, void 0, function* () {
            onlineUsers.set(userId, socket.id);
            socket.join(userId);
            // console.log(`📦 User ${userId} joined room`);
            //notify everyone that this user is online
            socket.emit('online_users', Array.from(onlineUsers.keys())); //send lint of  current online user
            socket.broadcast.emit('user_online', userId);
        }));
        socket.on('disconnect', () => {
            var _a;
            const disconnectedUserId = (_a = [...onlineUsers.entries()].find(([, sid]) => sid === socket.id)) === null || _a === void 0 ? void 0 : _a[0];
            if (disconnectedUserId) {
                onlineUsers.delete(disconnectedUserId);
                socket.broadcast.emit('user_offline', disconnectedUserId);
                //console.log(`❌ User user ${disconnectedUserId} went offline`);
            }
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
