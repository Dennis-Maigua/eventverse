const express = require('express');
const router = express.Router();

const { requireSignin, adminOnly } = require('../controllers/auth');
const { loadProfile, updateProfile, deleteProfile, fetchUsers, activeUsers,
    deleteUser, updateUser } = require('../controllers/user');

const { profileValidator } = require('../validators/auth');
const { runValidation } = require('../validators');

router.get('/user/:id', requireSignin, loadProfile);
router.put('/user/update', requireSignin, profileValidator, runValidation, updateProfile);
router.delete('/user/delete', requireSignin, deleteProfile);
router.put('/admin/dashboard', requireSignin, adminOnly);
router.get('/users/all', requireSignin, adminOnly, fetchUsers);
router.get('/users/active', requireSignin, adminOnly, activeUsers);
router.put('/admin/update', requireSignin, adminOnly, profileValidator, runValidation, updateUser);
router.delete('/admin/delete/:id', requireSignin, adminOnly, deleteUser);

module.exports = router;