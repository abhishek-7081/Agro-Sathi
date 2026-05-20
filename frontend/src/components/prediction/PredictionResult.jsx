import { ArrowLeft, CheckCircle2, Droplets, ShieldCheck, Sprout, Bug, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function PredictionResult({ result, onBack }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] animate-fade-in-up">
      <Card className="overflow-hidden rounded-[32px] border-none shadow-premium-xl">
        <CardHeader className="bg-primary-600 text-white">
          <CardTitle className="flex items-center gap-3 text-white">
            <ShieldCheck size={22} />
            Prediction Result
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="theme-panel-muted rounded-[28px] p-4">
              {result.imagePreview ? (
                <img src={result.imagePreview} alt="Analyzed crop" className="h-full min-h-[240px] w-full rounded-[22px] object-cover" />
              ) : (
                <div className="flex min-h-[240px] flex-col items-center justify-center rounded-[22px] border border-dashed theme-border">
                  <ImageIcon size={26} className="text-primary-600" />
                  <p className="mt-3 text-sm font-semibold theme-subtle">No image uploaded for this analysis.</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-[28px] bg-primary-50 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary-600">Primary Insight</p>
                <h3 className="mt-2 text-2xl font-black tracking-tight theme-heading">
                  {result.isHealthy ? `${result.crop} is healthy` : `${result.crop}: ${result.disease}`}
                </h3>
                <p className="mt-3 text-sm theme-subtle">
                  Confidence score: <span className="font-black text-primary-600">{result.confidence}%</span>
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="theme-panel-muted rounded-[24px] p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] theme-subtle">Predicted Class</p>
                  <p className="mt-2 text-lg font-black text-primary-600">{result.predictedClass}</p>
                </div>
                <div className="theme-panel-muted rounded-[24px] p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] theme-subtle">Plant Health</p>
                  <p className="mt-2 text-base font-bold theme-heading">{result.crop}</p>
                  <p className="mt-1 text-sm theme-subtle">{result.isHealthy ? 'Healthy sample detected' : result.disease}</p>
                </div>
              </div>

              {result.notes ? (
                <div className="theme-panel rounded-[24px] p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] theme-subtle">Field Notes</p>
                  <p className="mt-2 text-sm leading-6 theme-heading">{result.notes}</p>
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-black uppercase tracking-[0.12em] theme-heading">
              <CheckCircle2 size={18} className="text-primary-600" />
              Recommendations
            </h3>
            <div className="grid gap-3">
              {result.recommendations.map((rec, index) => (
                <div key={index} className="theme-panel-muted flex items-start gap-3 rounded-[22px] p-4">
                  <div className="mt-1 min-w-[20px]">
                    {index === 0 ? <Droplets size={18} className="text-blue-500" /> : index === 2 ? <Bug size={18} className="text-rose-500" /> : <Sprout size={18} className="text-emerald-500" />}
                  </div>
                  <p className="text-sm leading-6 theme-heading">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {result.topPredictions?.length ? (
            <div>
              <h3 className="mb-4 text-lg font-black uppercase tracking-[0.12em] theme-heading">Top Model Matches</h3>
              <div className="grid gap-3">
                {result.topPredictions.map((prediction) => (
                  <div key={prediction.label} className="theme-panel-muted rounded-[22px] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold theme-heading">{prediction.crop}</p>
                        <p className="text-sm theme-subtle">{prediction.disease}</p>
                      </div>
                      <p className="text-sm font-black text-primary-600">{prediction.confidence}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-5">
        <div className="theme-panel rounded-[28px] p-6 shadow-premium-lg">
          <h3 className="text-sm font-black uppercase tracking-[0.16em] theme-heading">Recommended Workflow</h3>
          <ol className="mt-4 space-y-3 text-sm leading-6 theme-subtle">
            <li>Use the prediction as a quick first-pass diagnosis, not the final agronomy decision.</li>
            <li>Inspect nearby plants for similar symptoms before treating the whole field.</li>
            <li>Escalate to a local expert if the disease spreads or symptoms do not match the image result.</li>
          </ol>
        </div>

        <Button onClick={onBack} variant="outline" className="rounded-full px-6 py-3 text-xs uppercase tracking-[0.18em]">
          <ArrowLeft size={16} />
          Analyze Another Image
        </Button>
      </div>
    </div>
  );
}
