const path = require('path');
const fs = require('fs/promises');

const WORKSPACE_ROOT = path.resolve(__dirname, '..', '..', '..');
const ML_DIR = path.join(WORKSPACE_ROOT, 'Plant disease dettection');
const MODEL_PATH = path.join(ML_DIR, 'trained_plant_disease_model.keras');
const METADATA_PATH = path.join(ML_DIR, 'model_metadata.json');
const PREDICT_SCRIPT_PATH = path.join(ML_DIR, 'predict_image.py');
const ML_SERVICE_URL = process.env.PLANT_DISEASE_SERVICE_URL || 'http://127.0.0.1:8008';

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function decodeBase64Image(imageBase64) {
  const match = imageBase64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw createHttpError('Invalid image payload. Expected a base64 data URL.', 400);
  }

  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], 'base64'),
  };
}

async function ensureModelFiles() {
  const requiredPaths = [PREDICT_SCRIPT_PATH, MODEL_PATH, METADATA_PATH];

  for (const filePath of requiredPaths) {
    try {
      await fs.access(filePath);
    } catch (error) {
      throw createHttpError(
        `Missing ML artifact: ${path.basename(filePath)}. Train the model before running predictions.`,
        503
      );
    }
  }
}

async function getModelHealth() {
  const checks = await Promise.all(
    [PREDICT_SCRIPT_PATH, MODEL_PATH, METADATA_PATH].map(async (filePath) => {
      try {
        await fs.access(filePath);
        return true;
      } catch (error) {
        return false;
      }
    })
  );

  let service = { ready: false };
  try {
    const response = await fetch(`${ML_SERVICE_URL}/health`);
    if (response.ok) {
      service = await response.json();
    }
  } catch (error) {
    service = { ready: false, message: error.message };
  }

  return {
    ready: checks.every(Boolean) && Boolean(service.ready),
    serviceUrl: ML_SERVICE_URL,
    paths: {
      predictScript: PREDICT_SCRIPT_PATH,
      model: MODEL_PATH,
      metadata: METADATA_PATH,
    },
    service,
  };
}

async function requestPrediction(imageBase64) {
  const response = await fetch(`${ML_SERVICE_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageBase64 }),
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch (error) {
    payload = {};
  }

  if (!response.ok) {
    throw createHttpError(payload.message || 'Prediction service request failed.', response.status || 502);
  }

  return payload;
}

async function predictFromBase64(imageBase64) {
  await ensureModelFiles();

  const { buffer } = decodeBase64Image(imageBase64);
  if (!buffer.length) {
    throw createHttpError('Uploaded image is empty.', 400);
  }

  try {
    return await requestPrediction(imageBase64);
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    throw createHttpError(`Prediction service is unavailable: ${error.message}`, 503);
  }
}

module.exports = {
  getModelHealth,
  predictFromBase64,
};
