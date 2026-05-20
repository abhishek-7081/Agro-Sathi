import { useState, useEffect } from 'react';
import { AlertCircle, Search, ShieldCheck, Cpu, HardDrive } from 'lucide-react';
import PredictionForm from '../components/prediction/PredictionForm';
import PredictionResult from '../components/prediction/PredictionResult';
import { predictPlantDisease, getPlantDiseaseHealth } from '../services/plantDisease.service';
import { useTranslation } from '../hooks/useTranslation';

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
  const { t } = useTranslation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modelStatus, setModelStatus] = useState({ checking: true, online: false });

  useEffect(() => {
    let active = true;
    async function checkHealth() {
      try {
        const health = await getPlantDiseaseHealth();
        if (active) {
          setModelStatus({ checking: false, online: !!health.ready });
        }
      } catch (err) {
        if (active) {
          setModelStatus({ checking: false, online: false });
        }
      }
    }
    checkHealth();
    return () => {
      active = false;
    };
  }, []);

  const handlePredict = async (formData) => {
    if (!formData.image) {
      setError(t('Please upload a crop or leaf image before running a prediction.'));
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
        t('Prediction failed. Please make sure the backend and model are running.');

      setError(message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 md:py-12 animate-fade-in">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Dynamic Header */}
        <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-dashed theme-border pb-8">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border theme-border theme-panel px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] theme-subtle">
                <Search size={12} className="text-primary-600" />
                {t('Plant Health Workspace')}
              </div>

              {/* Live Connection Status Badge */}
              <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] shadow-sm transition-all duration-300 ${
                modelStatus.checking
                  ? 'bg-amber-100/50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                  : modelStatus.online
                  ? 'bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-100/50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
              }`}>
                <span className={`h-2 w-2 rounded-full ${
                  modelStatus.checking ? 'bg-amber-500 animate-pulse' : modelStatus.online ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'
                }`} />
                {modelStatus.checking ? t('Checking Model...') : modelStatus.online ? t('TF Service Online') : t('TF Service Offline')}
              </div>
            </div>
            
            <h1 className="text-3xl font-black uppercase tracking-tight theme-heading md:text-5xl lg:text-6xl">
              {t('Plant Disease Detection')}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed theme-subtle md:text-base">
              {t('Upload an image of an affected leaf to run a real-time diagnosis using our offline-integrated TensorFlow model.')}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 sm:flex-nowrap">
            <div className="theme-panel flex items-start gap-3.5 rounded-2xl p-4 shadow-agri w-full sm:w-60 border border-primary-500/10">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-300 flex-shrink-0">
                <Cpu size={18} />
              </div>
              <div>
                <h2 className="text-[11px] font-black uppercase tracking-[0.14em] theme-heading">{t('Active Model')}</h2>
                <p className="mt-1 text-xs leading-relaxed theme-subtle">
                  {t('CNN Classifier')} (38 classes)
                </p>
              </div>
            </div>

            <div className="theme-panel flex items-start gap-3.5 rounded-2xl p-4 shadow-agri w-full sm:w-60 border border-primary-500/10">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-300 flex-shrink-0">
                <HardDrive size={18} />
              </div>
              <div>
                <h2 className="text-[11px] font-black uppercase tracking-[0.14em] theme-heading">{t('Local Inference')}</h2>
                <p className="mt-1 text-xs leading-relaxed theme-subtle">
                  {t('No cloud processing or data leaks')}
                </p>
              </div>
            </div>
          </div>
        </header>

        {error ? (
          <div className="flex items-start gap-3 rounded-[20px] border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 px-5 py-4 text-sm text-red-700 dark:text-red-400 shadow-sm animate-fade-in">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}

        <div className="transition-all duration-500">
          {result ? (
            <PredictionResult result={result} onBack={() => setResult(null)} />
          ) : (
            <PredictionForm onSubmit={handlePredict} loading={loading} modelOnline={modelStatus.online} />
          )}
        </div>
      </div>
    </div>
  );
}
