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
exports.logout = exports.register = exports.authentic = void 0;
const session_1 = require("../utils/session");
const sendOtp_1 = require("../config/sendOtp");
const redis_1 = require("../config/redis");
const prisma_1 = require("../generated/prisma");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new prisma_1.PrismaClient();
// ------------------ LOGIN ------------------
const authentic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobile, otp } = req.body;
    if (!mobile) {
        res.status(400).json({ error: 'Mobile number is required' });
        return;
    }
    // Step 1 → Send OTP if no OTP provided
    if (!otp) {
        try {
            const otpResponse = yield (0, sendOtp_1.sendOtp)(mobile);
            res.status(200).json({
                message: `OTP sent to ${mobile}`,
                otp: otpResponse.otp,
                info: 'OTP sent Successfully',
            });
            return;
        }
        catch (error) {
            console.error('OTP send error:', error);
            res.status(500).json({ message: 'Failed to send OTP' });
            return;
        }
    }
    try {
        // Step 2 → Verify OTP
        const storeOtp = yield redis_1.redisClient.get(`otp:${mobile}`);
        if (!storeOtp || storeOtp !== otp.toString()) {
            res.status(401).json({ error: 'Invalid or expired OTP' });
            return;
        }
        // Check if user exists
        let user = yield prisma.user.findUnique({ where: { mobile } });
        if (!user) {
            res.status(404).json({ error: 'User not found, please register' });
            return;
        }
        // Delete OTP from redis after successful verification
        yield redis_1.redisClient.del(`otp:${mobile}`);
        // Generate JWT token
        yield (0, session_1.generateToken)(user, res);
        res.status(200).json({ message: 'User Login successful!' });
        return;
    }
    catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ error: 'Server error' });
        return;
    }
});
exports.authentic = authentic;
// ------------------ REGISTER ------------------
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobile, name, bio, profileUrl } = req.body;
    if (!mobile || !name) {
        res.status(400).json({ error: 'Mobile and Name are required' });
        return;
    }
    try {
        const finalProfileUrl = profileUrl !== null && profileUrl !== void 0 ? profileUrl : 'https://avatar.iran.liara.run/public';
        // Check if user already exists
        const existingUser = yield prisma.user.findUnique({ where: { mobile } });
        if (existingUser) {
            res.status(409).json({ error: 'User already exists' });
            return;
        }
        // Create new user
        const user = yield prisma.user.create({
            data: { mobile, name, bio, profileUrl: finalProfileUrl },
        });
        yield (0, session_1.generateToken)(user, res); // sets cookie internally
        res.status(201).json({ message: 'Created successfully' }); // only send JSON, don't include token
        return;
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Unable to create user in Database' });
        return;
    }
});
exports.register = register;
// ------------------ LOGOUT ------------------
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, session_1.degradeToken)(res);
        res.status(200).json({ message: 'You are logged out successfully' });
        return;
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
});
exports.logout = logout;
