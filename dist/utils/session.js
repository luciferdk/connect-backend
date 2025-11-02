"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.degradeToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// ---------------- GENERATE TOKEN ----------------
const generateToken = (user, res) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables.');
    }
    // Generate JWT
    const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
    // Set cookie with the token
    res.cookie('jwt', token, {
        httpOnly: true, // JS cannot access
        secure: process.env.NODE_ENV === 'production', // ✅ only HTTPS in prod
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // ✅ cross-site cookies in prod
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    console.log('✅ Token generated for user:', user.id);
};
exports.generateToken = generateToken;
// ---------------- VERIFY TOKEN ----------------
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt;
    if (!token) {
        res.status(401).json({ error: 'Access denied. No token provided.' });
        return;
    }
    if (!process.env.JWT_SECRET) {
        console.error('❌ JWT_SECRET missing in environment variables');
        res.status(500).json({ error: 'Server configuration error.' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach user payload to request
        next();
    }
    catch (error) {
        console.error('❌ Token verification error:', error);
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
};
exports.verifyToken = verifyToken;
// ---------------- LOGOUT ----------------
const degradeToken = (res) => {
    try {
        res.cookie('jwt', '', {
            maxAge: 0,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
        console.log('✅ User logged out');
    }
    catch (error) {
        console.error('❌ Logout error:', error);
        res.status(500).json({ message: 'Unsuccessful logout' });
    }
};
exports.degradeToken = degradeToken;
