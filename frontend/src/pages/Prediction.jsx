import { useState } from 'react';
import { Search, ShieldCheck, UploadCloud } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import PredictionForm from '../components/prediction/PredictionForm';
import PredictionResult from '../components/prediction/PredictionResult';

export default function Prediction() {
  const { t } = useTranslation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = (formData) => {
    setLoading(true);

    setTimeout(() => {
      const issueLabel = formData.image
        ? 'Possible fungal leaf spot detected'
        : `Yield outlook for ${formData.cropType}`;

      setResult({
        crop: formData.cropType,
        growthStage: formData.growthStage,
        landArea: formData.landArea,
        soilType: formData.soilType,
        notes: formData.notes,
        imagePreview: formData.imagePreview || '',
        issueLabel,
        confidence: formData.image ? 91 : 86,
        predictedYield: `${(Number(formData.landArea || 1) * 6.5).toFixed(2)} ${t('prediction.quintal')}`,
        recommendations: [
          t('prediction.rec_irrigation'),
          t('prediction.rec_fertilizer'),
          t('prediction.rec_pest'),
          formData.image ? 'Inspect the affected leaves within 24 hours and remove heavily damaged parts.' : 'Monitor crop vigor weekly and compare growth with expected stage benchmarks.',
        ],
      });

      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen px-4 py-12 animate-fade-in">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border theme-border theme-panel px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] theme-subtle">
              <Search size={14} className="text-primary-600" />
              Crop Intelligence Workspace
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tight theme-heading md:text-6xl">
              {t('prediction.title')}
            </h1>
            <p className="max-w-2xl text-base leading-7 theme-subtle md:text-lg">
              {t('prediction.subtitle')}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="theme-panel rounded-[28px] p-5 shadow-premium-lg">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-white">
                <UploadCloud size={20} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-[0.16em] theme-heading">Upload + Analyze</h2>
              <p className="mt-2 text-sm leading-6 theme-subtle">Add an image, crop details, and field notes in one smooth flow.</p>
            </div>
            <div className="theme-panel rounded-[28px] p-5 shadow-premium-lg">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-white">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-[0.16em] theme-heading">Actionable Output</h2>
              <p className="mt-2 text-sm leading-6 theme-subtle">Receive a quick diagnosis summary, confidence score, and next steps.</p>
            </div>
          </div>
        </header>

        {result ? (
          <PredictionResult result={result} onBack={() => setResult(null)} />
        ) : (
          <PredictionForm onSubmit={handlePredict} loading={loading} />
        )}
      </div>
    </div>
  );
}
