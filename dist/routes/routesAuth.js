"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controller/auth.controller");
const checks_1 = require("../middleware/checks");
const router = express_1.default.Router();
router.post('/authentication', auth_controller_1.authentic);
router.post('/register', auth_controller_1.register);
router.get('/check', checks_1.verify);
router.post('/degradeToken', auth_controller_1.logout);
exports.default = router;
