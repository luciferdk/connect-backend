"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//  ---  These fucking two line must be top if you use redis
const dotenv = __importStar(require("dotenv"));
dotenv.config();
//  --now no one care these line where imported
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routesAuth_1 = __importDefault(require("./routes/routesAuth"));
const routesMessages_1 = __importDefault(require("./routes/routesMessages"));
const routesUpdate_1 = __importDefault(require("./routes/routesUpdate"));
const routesContact_1 = __importDefault(require("./routes/routesContact"));
const routesDelete_1 = __importDefault(require("./routes/routesDelete"));
const socket_1 = require("./config/socket");
const PORT = Number(process.env.PORT);
const app = (0, express_1.default)();
const server = http_1.default.createServer(app); //Important: attach to server
//middleware
app.use((0, cors_1.default)({ origin: 'https://connect.x-dev.site', credentials: true }));
app.use(express_1.default.json({ limit: '100mb' }));
app.use((0, cookie_parser_1.default)());
// <- Routes ->
//for authentication, logout,checkAuth
app.use('/api/auth', routesAuth_1.default);
//for sidebar, getMessage, sendMessage
app.use('/api/messages', routesMessages_1.default);
//for updateCredential
app.use('/api/profile', routesUpdate_1.default);
//for addContact
app.use('/api/contact', routesContact_1.default);
//for delete user
app.use('/api/delete', routesDelete_1.default);
//Initialize Socket.io
(0, socket_1.setupSocket)(server);
// Start server
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server + socket.io is listening on PORT http://${PORT}`);
});
