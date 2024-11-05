const express = require('express');
const router = express.Router();

const { requireSignin, adminOnly } = require('../controllers/auth');
const { loadProfile, updateProfile, deleteProfile, fetchUsers, activeUsers,
    deleteUser, updateUser, userTrends } = require('../controllers/user');

const { updateValidator } = require('../validators/auth');
const { runValidation } = require('../validators');

router.get('/user/:id', requireSignin, loadProfile);
router.put('/user/update', requireSignin, updateValidator, runValidation, updateProfile);
router.delete('/user/delete', requireSignin, deleteProfile);
router.put('/admin/dashboard', requireSignin, adminOnly);
router.get('/users/fetch', requireSignin, adminOnly, fetchUsers);
router.get('/users/active', requireSignin, adminOnly, activeUsers);
router.get('/users/trends', requireSignin, adminOnly, userTrends);
router.put('/admin/update', requireSignin, adminOnly, updateValidator, runValidation, updateUser);
router.delete('/admin/delete/:id', requireSignin, adminOnly, deleteUser);

module.exports = router;