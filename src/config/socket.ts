import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import dotenv from 'dotenv';

dotenv.config();
let io: Server;
let isInitialized = false;

const onlineUsers = new Map<string, string>(); //userId -> socketId

export const setupSocket = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });
  isInitialized = true;

  io.on('connection', (socket) => {
    // console.log('✅ A user Connected', socket.id);

    socket.on('join', async (userId: string) => {
      onlineUsers.set(userId, socket.id);
      socket.join(userId);
      // console.log(`📦 User ${userId} joined room`);

      //notify everyone that this user is online
      socket.emit('online_users', Array.from(onlineUsers.keys())); //send lint of  current online user
      socket.broadcast.emit('user_online', userId);
    });
    socket.on('disconnect', () => {
      const disconnectedUserId = [...onlineUsers.entries()].find(
        ([, sid]) => sid === socket.id,
      )?.[0];

      if (disconnectedUserId) {
        onlineUsers.delete(disconnectedUserId);
        socket.broadcast.emit('user_offline', disconnectedUserId);
        //console.log(`❌ User user ${disconnectedUserId} went offline`);
      }
    });
  });
};
export const getIo = () => {
  if (!isInitialized || !io) throw new Error('socket.io not Initialized');
  return io;
};
