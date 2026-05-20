const express = require('express');
const rateLimiter = require('../middleware/rateLimiter.middleware');
const plantDiseaseController = require('../controllers/plantDisease.controller');

const router = express.Router();

router.get('/plant-disease/health', plantDiseaseController.health);
router.post(
  '/plant-disease/predict',
  rateLimiter({ windowMs: 60 * 1000, max: 15 }),
  plantDiseaseController.predict
);

module.exports = router;
