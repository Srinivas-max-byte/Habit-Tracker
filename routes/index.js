const express = require('express');
const router = express.Router();

// getting homepage controller
const homeController = require('../controllers/home_controller');
router.get('/', homeController.home);
// create habit route
router.post('/create-habit', homeController.createHabit);
// delete habit route
router.get('/delete-habit/:id',homeController.deleteHabit);
// Favourite habit route
router.get('/favourite-habit/:id',homeController.favouriteHabit);
// use details routes
router.get('/toggle-status/:id/:day/:date',homeController.toggleStatus);

module.exports=router;