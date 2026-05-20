import { useState } from 'react';
import { AlertCircle, Search, ShieldCheck, UploadCloud } from 'lucide-react';
import PredictionForm from '../components/prediction/PredictionForm';
import PredictionResult from '../components/prediction/PredictionResult';
import { predictPlantDisease } from '../services/plantDisease.service';

const MAX_IMAGE_SIDE = 768;
const IMAGE_QUALITY = 0.9;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Unable to read the selected image.'));
    };

    image.src = objectUrl;
  });
}

async function fileToOptimizedDataUrl(file) {
  const image = await loadImage(file);
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Image conversion is not supported in this browser.');
  }

  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', IMAGE_QUALITY);
}

export default function Prediction() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePredict = async (formData) => {
    if (!formData.image) {
      setError('Please upload a crop or leaf image before running a prediction.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const imageBase64 = await fileToOptimizedDataUrl(formData.image);
      const prediction = await predictPlantDisease({
        imageBase64,
        fileName: formData.image.name,
      });

      setResult({
        ...prediction,
        imagePreview: formData.imagePreview || imageBase64,
        notes: formData.notes?.trim() || '',
      });
    } catch (predictionError) {
      const message =
        predictionError.response?.data?.message ||
        predictionError.message ||
        'Prediction failed. Please make sure the backend and model are running.';

      setError(message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 animate-fade-in">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border theme-border theme-panel px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] theme-subtle">
              <Search size={14} className="text-primary-600" />
              Plant Health Workspace
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tight theme-heading md:text-6xl">
              Plant Disease Detection
            </h1>
            <p className="max-w-2xl text-base leading-7 theme-subtle md:text-lg">
              Upload a plant or leaf image to run the trained disease classifier directly from the Smart Agriculture app.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="theme-panel rounded-[28px] p-5 shadow-premium-lg">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-white">
                <UploadCloud size={20} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-[0.16em] theme-heading">Upload + Analyze</h2>
              <p className="mt-2 text-sm leading-6 theme-subtle">
                Use the integrated model to classify crop diseases from a real image instead of the old mock result.
              </p>
            </div>
            <div className="theme-panel rounded-[28px] p-5 shadow-premium-lg">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-white">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-[0.16em] theme-heading">Actionable Output</h2>
              <p className="mt-2 text-sm leading-6 theme-subtle">
                See the predicted disease, model confidence, and next-step field recommendations in one place.
              </p>
            </div>
          </div>
        </header>

        {error ? (
          <div className="flex items-start gap-3 rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 shadow-sm">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}

        {result ? (
          <PredictionResult result={result} onBack={() => setResult(null)} />
        ) : (
          <PredictionForm onSubmit={handlePredict} loading={loading} />
        )}
      </div>
    </div>
  );
}
