import api from './api';

export async function predictPlantDisease({ imageBase64, fileName }) {
  const { data } = await api.post('/ml/plant-disease/predict', {
    imageBase64,
    fileName,
  });

  return data.data;
}

export async function getPlantDiseaseHealth() {
  const { data } = await api.get('/ml/plant-disease/health');
  return data;
}
