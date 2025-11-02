"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const session_1 = require("../utils/session");
const message_controller_1 = require("../controller/message.controller");
const router = express_1.default.Router();
//sideBar
router.get('/users', session_1.verifyToken, message_controller_1.getUsersForSideBar);
//retrive messages
router.get('/:id', session_1.verifyToken, message_controller_1.getMessages);
//sendMessages
router.post('/send/:id', session_1.verifyToken, message_controller_1.sendMessages);
exports.default = router;
