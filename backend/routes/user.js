import express from 'express';
import {
  getOrCreateUser,
  getUserById,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/user.js';

const router = express.Router();

// User routes
router.post('/', getOrCreateUser);
router.get('/:clerkId', getUserById);

// Address routes
router.post('/:clerkId/addresses', addAddress);
router.put('/:clerkId/addresses/:addressId', updateAddress);
router.delete('/:clerkId/addresses/:addressId', deleteAddress);
router.patch('/:clerkId/addresses/:addressId/default', setDefaultAddress);

export default router;
