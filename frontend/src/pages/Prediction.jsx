import { useState } from "react";
import { useTranslation } from "../hooks/useTranslation";
import PredictionForm from "../components/prediction/PredictionForm";
import PredictionResult from "../components/prediction/PredictionResult";

export default function Prediction() {
    const { t } = useTranslation();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePredict = (formData) => {
        setLoading(true);
        setTimeout(() => {
            setResult({
                crop: formData.cropType,
                landArea: formData.landArea,
                soilType: formData.soilType,
                predictedYield: `${(formData.landArea * 6.5).toFixed(2)} ${t('prediction.quintal')}`,
                recommendations: [
                    t('prediction.rec_irrigation'),
                    t('prediction.rec_fertilizer'),
                    t('prediction.rec_pest'),
                ],
            });
            setLoading(false);
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-transparent py-12 px-4 animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-12">
                <header className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-soil-dark tracking-tighter uppercase">
                        {t('prediction.title')}
                    </h1>
                    <p className="text-slate-500 font-medium max-w-xl mx-auto">
                        {t('prediction.subtitle')}
                    </p>
                </header>

                <main className="relative z-10">
                    {result ? (
                        <PredictionResult
                            result={result}
                            onBack={() => setResult(null)}
                        />
                    ) : (
                        <PredictionForm 
                            onSubmit={handlePredict} 
                            loading={loading} 
                        />
                    )}
                </main>
            </div>
        </div>
    );
}
