import express from 'express';
import { createListing,deleteListing, updateListing,getLitsting,getListings } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUsers.js';

const router = express.Router();

router.post('/create',verifyToken,createListing);
router.delete('/delete/:id',verifyToken,deleteListing);
router.post('/update/:id',verifyToken,updateListing);
router.get('/get/:id',getLitsting);
router.get('/get', getListings);


export default router;