"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deleteuser_controller_1 = __importDefault(require("../controller/deleteuser.controller"));
const session_1 = require("../utils/session");
const router = express_1.default.Router();
router.post('/userdeleted', session_1.verifyToken, deleteuser_controller_1.default);
exports.default = router;
