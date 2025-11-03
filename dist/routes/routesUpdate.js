"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const update_controller_1 = require("../controller/update.controller");
const session_1 = require("../utils/session");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
router.put('/updateMySelf', session_1.verifyToken, upload_1.upload.single('profileImage'), update_controller_1.updateUser);
router.put('/updateNickName', session_1.verifyToken, update_controller_1.contactName);
exports.default = router;
