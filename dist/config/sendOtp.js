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
exports.sendOtp = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const redis_1 = require("./redis");
const generateOtp_1 = require("../utils/generateOtp");
// ----------generating otp and sending to user phone-------------------//
const sendOtp = (mobile) => __awaiter(void 0, void 0, void 0, function* () {
    //validate 10-digit mobile number
    const isValid = /^[6-9]\d{9}$/.test(mobile);
    if (!isValid) {
        throw new Error('Mobile number required');
    }
    //generated otp
    const otp = (0, generateOtp_1.generateOTP)();
    //const fullNumber = `+91${mobile}`; //assuming user are indian
    try {
        // Store OTP in Redis
        yield redis_1.redisClient.setEx(`otp:${mobile}`, 300, otp); //expire in 5 min
        //console.log(otp);
        /*
    //send otp on user mobile
    console.log('API KEY:', process.env.FAST2SMS_API_KEY);
        // Send OTP Via SMS
        const response = await axios.post(
          'https://www.fast2sms.com/dev/bulkV2',
          {
            route: 'q',
            message: `your OTP is ${otp}`,
            numbers: mobile,
        flash: 0
          },
          {
            headers: {
             authorization: process.env.FAST2SMS_API_KEY,
            },
          },
        );
        //console.log('FASAT2SMS Response:', response.data);
        */
        return {
            otp: otp,
        };
    }
    catch (error) {
        console.error('otp error', error);
        throw error;
    }
});
exports.sendOtp = sendOtp;
