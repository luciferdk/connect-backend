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
exports.sendMessages = exports.getMessages = exports.getUsersForSideBar = void 0;
// src/controller/message.controller.ts
const prisma_1 = require("../generated/prisma");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const socket_1 = require("../config/socket");
const prisma = new prisma_1.PrismaClient();
// NOTE: Fetches user's data and their contacts endpoint
const getUsersForSideBar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        // Fetch the logged-in user's details
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                profileUrl: true,
                bio: true,
            },
        });
        if (!user) {
            // The `res.status().json()` call sends the response.
            // We just need to exit the function with a simple `return;`
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Fetch the user's saved contacts
        const contacts = yield prisma.contact.findMany({
            where: { ownerId: userId },
            select: {
                // Using select to retrive scalar fields and the reloation
                id: true,
                nickName: true, //Retain the nicname from the Contact Model
                contact: {
                    select: {
                        id: true,
                        name: true,
                        profileUrl: true,
                        bio: true,
                        mobile: true,
                    },
                },
            },
        });
        // Format the contacts data
        const formattedContacts = contacts.map((entry) => (Object.assign(Object.assign({}, entry.contact), { 
            //OverWrite/add the ncikname from the Contact Model
            nickName: entry.nickName })));
        // Combine user's data and contacts into a single response
        const sidebarData = {
            user,
            contacts: formattedContacts,
        };
        // This line sends the final response. No `return` is needed here either.
        res.status(200).json(sidebarData);
    }
    catch (error) {
        console.error('Error in getUsersForSideBar:', error);
        // Send an error response. The function will implicitly end here.
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getUsersForSideBar = getUsersForSideBar;
// NOTE: chat history display endpoint
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const otherUserId = req.params.id;
        // Calculate 24 hours ago cutoff for deletion
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        // STEP 1: Delete messages older than 24 hours (PERMANENT DELETE)
        yield prisma.message.deleteMany({
            where: {
                AND: [
                    {
                        OR: [
                            { senderId: userId, recipientId: otherUserId },
                            { senderId: otherUserId, recipientId: userId },
                        ],
                    },
                    {
                        timestamp: { lt: twentyFourHoursAgo }, // older than 24 hours
                    },
                ],
            },
        });
        // STEP 2: Fetch only messages from last 24 hours
        const messages = yield prisma.message.findMany({
            where: {
                AND: [
                    {
                        timestamp: { gte: twentyFourHoursAgo }, // only last 24 hrs
                    },
                    {
                        OR: [
                            { senderId: userId, recipientId: otherUserId },
                            { senderId: otherUserId, recipientId: userId },
                        ],
                    },
                ],
            },
            orderBy: { timestamp: 'asc' },
        });
        res.status(200).json(messages);
    }
    catch (error) {
        console.log('error while loading chat history', error);
        res.status(500).json({ messages: 'failed to get messages' });
    }
});
exports.getMessages = getMessages;
// NOTE: send messages endpoint
const sendMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const io = (0, socket_1.getIo)();
    try {
        const { content, mediaBase64, mediaType } = req.body;
        const recipientId = req.params.id;
        const senderId = req.user.id;
        let mediaUrl;
        if (mediaBase64) {
            const upload = yield cloudinary_1.default.uploader.upload(mediaBase64, {
                resource_type: 'auto', //auto handle image, video, audio, docs
            });
            mediaUrl = upload.secure_url;
        }
        const newMessage = yield prisma.message.create({
            data: {
                senderId,
                recipientId,
                content,
                mediaUrl,
                mediaType,
            },
        });
        // Emit to recipient
        io.to(recipientId).emit('receive_message', newMessage);
        // Emit to sender for confirmation
        io.to(senderId).emit('message_sent', newMessage);
        res.status(201).json(newMessage);
    }
    catch (error) {
        console.log('error while sending message', error);
        res.status(500).json({ message: 'Message sending failed' });
    }
});
exports.sendMessages = sendMessages;
