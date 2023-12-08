import express from "express";
import { deleteUser, test, upadateUser, getUserListings, getUser} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUsers.js";

const router = express.Router();

router.get('/test',test);
router.post('/update/:id',verifyToken,upadateUser);
router.delete('/delete/:id',verifyToken,deleteUser);
router.get('/listings/:id',verifyToken,getUserListings);
router.get('/:id',verifyToken,getUser);


export default router;
