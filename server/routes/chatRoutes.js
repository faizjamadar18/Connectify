import { Router } from "express";
import wrapAsync from "../utils/wrapAsync.js";
import {
    getUserChat,

} from "../controllers/chatController.js";

const router = Router();

router.post('/user-chat', wrapAsync(getUserChat));



export default router;