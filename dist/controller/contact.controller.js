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
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
const addNewContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ownerId = req.user.id;
        const { mobile, nickName } = req.body;
        const contactUser = yield prisma.user.findUnique({ where: { mobile } });
        if (!contactUser) {
            res.status(404).json({ message: 'user not found' });
            return;
        }
        if (contactUser.id === ownerId) {
            res.status(400).json({ message: 'Connot add yourself' });
            return;
        }
        const alreadyExists = yield prisma.contact.findFirst({
            where: {
                ownerId,
                contactId: contactUser.id,
            },
        });
        if (alreadyExists) {
            res.status(400).json({ message: 'Already in Contact List' });
            return;
        }
        const newContact = yield prisma.contact.create({
            data: {
                ownerId,
                contactId: contactUser.id,
                nickName: nickName,
            },
        });
        res.status(201).json(newContact);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add contact' });
    }
});
exports.default = addNewContact;
