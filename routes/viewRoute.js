const express = require("express");
const viewController = require("./../controllers/viewController");
const authController = require("./../controllers/authController");
const router = express.Router();

router.get('/', viewController.home);
router.get('/dashboard',authController.protect, viewController.dashboard);
// router.get('/adminDashboard',authController.protect, viewController.adminDashboard);
router.get('/questions/:questionNo', authController.protect,viewController.questions);
router.get('/signin',viewController.signin);
router.get('/signup', viewController.signup);
router.get('/footer', viewController.footer);
router.get('/navbar', viewController.navbar);
// router.get('/navbar2', viewController.navbar2);
// router.get('/navbarOriginal', viewController.navbarOriginal);
router.get('/help', viewController.help);
router.get('/instructions', viewController.instructions);
router.get('/updatePassword', authController.protect,viewController.updatePassword);
router.get('/moreTasks', authController.protect,viewController.moreTasks);
router.get('/forgotPassword', viewController.forgotPassword);
router.get('/resetPassword/:token', viewController.resetPassword);

module.exports = router;