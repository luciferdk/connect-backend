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
exports.contactName = exports.updateUser = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user; // cast user
        const userId = user === null || user === void 0 ? void 0 : user.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { name, bio, profileUrl } = req.body;
        const file = req.file;
        const updateData = {};
        if (name === null || name === void 0 ? void 0 : name.trim())
            updateData.name = name.trim();
        if (bio === null || bio === void 0 ? void 0 : bio.trim())
            updateData.bio = bio.trim();
        if (file) {
            const uploadResult = yield cloudinary_1.default.uploader.upload(file.path, {
                folder: 'user_profiles',
                resource_type: 'image',
            });
            updateData.profileUrl = uploadResult.secure_url;
        }
        else if (profileUrl === null || profileUrl === void 0 ? void 0 : profileUrl.trim()) {
            updateData.profileUrl = profileUrl.trim();
        }
        if (Object.keys(updateData).length === 0) {
            res.status(400).json({ message: 'No fields provided for update' });
            return;
        }
        const updatedUser = yield prisma.user.update({
            where: { id: userId },
            data: updateData,
        });
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});
exports.updateUser = updateUser;
const contactName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ownerId = req.user.id;
        const { mobile, nickName } = req.body;
        // Validate required fields
        if (!mobile || !nickName) {
            res.status(400).json({ message: 'Mobile and nickname are required' });
            return;
        }
        // Find the contact user
        const contactUser = yield prisma.user.findUnique({
            where: { mobile },
        });
        if (!contactUser) {
            res.status(404).json({ message: 'Contact User not found' });
            return;
        }
        // Check if contact relationship exists
        const existingContact = yield prisma.contact.findUnique({
            where: {
                ownerId_contactId: {
                    ownerId,
                    contactId: contactUser.id,
                }
            }
        });
        if (!existingContact) {
            res.status(404).json({ message: 'Contact not found in your contact list' });
            return;
        }
        // Update the contact's nickname
        const updatedContact = yield prisma.contact.update({
            where: {
                ownerId_contactId: {
                    ownerId,
                    contactId: contactUser.id,
                }
            },
            data: {
                nickName: nickName,
            },
        });
        res.status(200).json(updatedContact);
    }
    catch (error) {
        console.error(error);
        // Handle Prisma specific errors
        if (error instanceof Error) {
            if (error.message.includes('Record to update not found')) {
                res.status(404).json({ message: 'Contact not found in your contact list' });
                return;
            }
        }
        res.status(500).json({ message: 'Failed to update contact name' });
    }
});
exports.contactName = contactName;
