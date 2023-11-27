import express from "express";
import { deleteUser, test, upadateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUsers.js";

const router = express.Router();

router.get('/test',test);
router.post('/update/:id',verifyToken,upadateUser);
router.delete('/delete/:id',verifyToken,deleteUser);


export default router;
