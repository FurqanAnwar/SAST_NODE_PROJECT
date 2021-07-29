const express = require('express');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updatePassword', authController.protect,authController.updatePassword);
router.post('/modifyUser', authController.protect,authController.modifyUser);

router.get('/logout', authController.logout);
router.get('/getAllUsers', authController.getAllUsers);
router.get('/allUsers', authController.protect, authController.restrictTo('admin'),authController.getAllUsers);
router.get('/questions-all',authController.questionsAll);
router.post('/updateMe',authController.protect,authController.updateMe);
router.post('/getUser',authController.getUser);
module.exports = router;