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
const session_1 = require("../utils/session");
const prisma = new prisma_1.PrismaClient();
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized: User not found' });
            return;
        }
        yield prisma.message.deleteMany({
            where: {
                OR: [{ senderId: userId }, { recipientId: userId }],
            },
        });
        yield prisma.contact.deleteMany({
            where: {
                OR: [{ ownerId: userId }, { contactId: userId }],
            },
        });
        yield prisma.user.delete({
            where: { id: userId },
        });
        // Degrade token after deleting user
        (0, session_1.degradeToken)(res);
        res.status(204).json({ message: 'user deleted Successfully' });
    }
    catch (error) {
        console.error(error, 'Deleting user Failed');
        res.status(500).json({ message: 'User deletation failed' });
    }
});
exports.default = deleteUser;
