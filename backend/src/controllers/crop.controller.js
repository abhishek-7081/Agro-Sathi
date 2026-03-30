exports.getCropCalendar = async (req, res, next) => {
  try {
    const { month, crop } = req.query;
    
    // Mock crop calendar data
    const calendarData = {
      crops: [
        {
          id: 'wheat',
          name: 'Wheat',
          season: 'Rabi',
          months: [10, 11, 0, 1, 2, 3],
          activities: {
            10: { sowing: 'Sow seeds', irrigation: 'Initial irrigation', fertilizer: 'Apply NPK' },
            11: { irrigation: 'Regular irrigation', pest: 'Monitor for pests' },
            0: { irrigation: 'Critical irrigation stage', fertilizer: 'Top dressing' },
            1: { irrigation: 'Maintain soil moisture', pest: 'Check for diseases' },
            2: { harvest: 'Harvest time', irrigation: 'Stop irrigation' },
          }
        },
        {
          id: 'rice',
          name: 'Rice',
          season: 'Kharif',
          months: [5, 6, 7, 8, 9],
          activities: {
            5: { sowing: 'Nursery preparation', irrigation: 'Prepare paddy fields' },
            6: { transplant: 'Transplant seedlings', irrigation: 'Flood fields' },
            7: { irrigation: 'Maintain water level', fertilizer: 'Apply nitrogen' },
            8: { irrigation: 'Critical stage', pest: 'Pest control' },
            9: { harvest: 'Harvest paddy', irrigation: 'Drain fields' },
          }
        },
        {
          id: 'cotton',
          name: 'Cotton',
          season: 'Kharif',
          months: [5, 6, 7, 8, 9, 10],
          activities: {
            5: { sowing: 'Sow cotton seeds', irrigation: 'Initial irrigation' },
            6: { irrigation: 'Regular irrigation', pest: 'Monitor for bollworms' },
            7: { irrigation: 'Critical stage', fertilizer: 'Apply fertilizers' },
            8: { irrigation: 'Maintain moisture', pest: 'Pest control' },
            9: { irrigation: 'Reduce irrigation', pest: 'Final pest check' },
            10: { harvest: 'Harvest cotton', irrigation: 'Stop irrigation' },
          }
        },
      ]
    };

    let filteredCrops = calendarData.crops;
    if (month !== undefined) {
      const monthNum = parseInt(month);
      filteredCrops = filteredCrops.filter(crop => crop.months.includes(monthNum));
    }
    if (crop) {
      filteredCrops = filteredCrops.filter(c => c.id === crop);
    }

    res.json({ crops: filteredCrops });
  } catch (error) {
    next(error);
  }
};

exports.getCropActivities = async (req, res, next) => {
  try {
    const { cropId, month } = req.params;
    const monthNum = parseInt(month);

    // Mock activities data
    const activities = {
      wheat: {
        10: { sowing: 'Sow seeds', irrigation: 'Initial irrigation', fertilizer: 'Apply NPK' },
        11: { irrigation: 'Regular irrigation', pest: 'Monitor for pests' },
        0: { irrigation: 'Critical irrigation stage', fertilizer: 'Top dressing' },
        1: { irrigation: 'Maintain soil moisture', pest: 'Check for diseases' },
        2: { harvest: 'Harvest time', irrigation: 'Stop irrigation' },
      },
      rice: {
        5: { sowing: 'Nursery preparation', irrigation: 'Prepare paddy fields' },
        6: { transplant: 'Transplant seedlings', irrigation: 'Flood fields' },
        7: { irrigation: 'Maintain water level', fertilizer: 'Apply nitrogen' },
        8: { irrigation: 'Critical stage', pest: 'Pest control' },
        9: { harvest: 'Harvest paddy', irrigation: 'Drain fields' },
      },
    };

    const cropActivities = activities[cropId]?.[monthNum] || { general: 'Regular maintenance' };

    res.json({ activities: cropActivities });
  } catch (error) {
    next(error);
  }
};

exports.getCropRecommendations = async (req, res, next) => {
  try {
    const { state, season } = req.query;

    // Mock recommendations based on state and season
    const recommendations = [
      {
        crop: 'Wheat',
        reason: 'Ideal climate conditions',
        yield: 'High',
        marketPrice: 'Good',
        suitability: 95
      },
      {
        crop: 'Rice',
        reason: 'Adequate water availability',
        yield: 'Very High',
        marketPrice: 'Excellent',
        suitability: 90
      },
    ];

    res.json({ recommendations });
  } catch (error) {
    next(error);
  }
};
