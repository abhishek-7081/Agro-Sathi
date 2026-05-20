const plantDiseaseService = require('../services/plantDisease.service');

exports.health = async (req, res, next) => {
  try {
    const health = await plantDiseaseService.getModelHealth();
    res.json(health);
  } catch (error) {
    next(error);
  }
};

exports.predict = async (req, res, next) => {
  try {
    const { imageBase64, fileName } = req.body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ message: 'imageBase64 is required.' });
    }

    const prediction = await plantDiseaseService.predictFromBase64(imageBase64, fileName);
    res.json({ success: true, data: prediction });
  } catch (error) {
    next(error);
  }
};
