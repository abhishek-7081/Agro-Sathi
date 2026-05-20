import { ArrowLeft, CheckCircle2, Droplets, ShieldCheck, Sprout, Bug, Image as ImageIcon, Printer, AlertTriangle, FileText, Activity } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useTranslation } from '../../hooks/useTranslation';

export default function PredictionResult({ result, onBack }) {
  const { t } = useTranslation();

  const handlePrint = () => {
    window.print();
  };

  // SVG Circular Ring parameters
  const radius = 36;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.confidence / 100) * circumference;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] animate-fade-in-up print:grid-cols-1">
      {/* Styles for printing layout */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print-card {
            border: 1px solid #ccc !important;
            box-shadow: none !important;
            background: white !important;
          }
        }
      `}</style>

      <Card className="overflow-hidden rounded-[28px] border-none shadow-premium-xl theme-panel print-card">
        {/* Banner header based on health */}
        <div className={`p-6 md:p-8 text-white flex items-center justify-between ${
          result.isHealthy 
            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-800 dark:to-teal-800' 
            : 'bg-gradient-to-r from-amber-600 to-rose-600 dark:from-amber-800 dark:to-rose-800'
        }`}>
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
              {t('Diagnostic Assessment')}
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              <ShieldCheck size={26} />
              {t('Analysis Report')}
            </h2>
          </div>
          
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-xs font-black uppercase tracking-[0.12em]">
            {result.isHealthy ? (
              <>
                <CheckCircle2 size={14} className="text-emerald-300 animate-pulse" />
                {t('Healthy Status')}
              </>
            ) : (
              <>
                <AlertTriangle size={14} className="text-amber-300 animate-pulse" />
                {t('Issue Detected')}
              </>
            )}
          </div>
        </div>

        <CardContent className="space-y-8 p-6 md:p-8">
          
          {/* Main Details block */}
          <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
            {/* Analyzed Image Preview with Target Overlay */}
            <div className="relative theme-panel-muted rounded-2xl overflow-hidden min-h-[250px] flex items-center justify-center border theme-border">
              {result.imagePreview ? (
                <>
                  <img 
                    src={result.imagePreview} 
                    alt="Analyzed crop" 
                    className="h-full w-full object-cover max-h-[280px]" 
                  />
                  {/* Crosshair Target Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative w-28 h-28 border border-white/35 rounded-full flex items-center justify-center">
                      <div className="w-16 h-16 border border-white/20 rounded-full border-dashed" />
                      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/25 -translate-x-1/2" />
                      <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/25 -translate-y-1/2" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur text-[10px] text-white px-2 py-0.5 rounded font-mono">
                    {t('REGIONS ANALYZED')}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <ImageIcon size={32} className="text-primary-600 mb-2" />
                  <p className="text-xs font-bold theme-subtle">{t('No source image recorded.')}</p>
                </div>
              )}
            </div>

            {/* Analysis details & confidence meter */}
            <div className="space-y-6 flex flex-col justify-between">
              
              <div className="flex items-center gap-5">
                {/* SVG circular progress indicator */}
                <div className="relative flex items-center justify-center h-20 w-20 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90">
                    {/* Circle Background */}
                    <circle
                      cx="40"
                      cy="40"
                      r={radius}
                      className="stroke-slate-100 dark:stroke-slate-800 fill-transparent"
                      strokeWidth={strokeWidth}
                    />
                    {/* Circle Foreground */}
                    <circle
                      cx="40"
                      cy="40"
                      r={radius}
                      className={`fill-transparent transition-all duration-1000 ease-out ${
                        result.isHealthy 
                          ? 'stroke-emerald-500' 
                          : result.confidence > 75 
                          ? 'stroke-rose-500' 
                          : 'stroke-amber-500'
                      }`}
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-sm font-black theme-heading">
                    {result.confidence}%
                  </span>
                </div>
                
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-600 dark:text-primary-300">
                    {t('Primary Diagnosis')}
                  </span>
                  <h3 className="text-xl font-black tracking-tight theme-heading mt-0.5">
                    {result.isHealthy 
                      ? t('Healthy Leaf Sample')
                      : t(result.disease)
                    }
                  </h3>
                  <p className="text-xs theme-subtle mt-1 font-semibold">
                    {t('Crop Family')}: <span className="text-primary-600 dark:text-primary-400">{t(result.crop)}</span>
                  </p>
                </div>
              </div>

              {/* Detail Items grid */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="theme-panel-muted rounded-xl p-4 border theme-border">
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] theme-subtle">{t('Classifier output')}</p>
                  <p className="mt-1 text-xs font-mono font-bold theme-heading truncate" title={result.predictedClass}>
                    {result.predictedClass}
                  </p>
                </div>
                
                <div className="theme-panel-muted rounded-xl p-4 border theme-border">
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] theme-subtle">{t('Health Status')}</p>
                  <p className="mt-1 text-xs font-bold theme-heading">
                    {result.isHealthy ? t('Healthy crop sample') : t('Infected / Diseased')}
                  </p>
                </div>
              </div>

              {result.notes && (
                <div className="theme-panel rounded-xl p-4 border border-primary-500/5">
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] theme-subtle">{t('Field Notes')}</p>
                  <p className="mt-1 text-xs leading-relaxed theme-heading">{result.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations block */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] theme-heading border-b theme-border pb-2">
              <Sprout size={16} className="text-primary-600" />
              {t('Agronomic Action Protocol')}
            </h3>
            
            <div className="grid gap-3.5 sm:grid-cols-3">
              {result.recommendations.map((rec, index) => {
                let colorClass = 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20';
                let icon = <Sprout size={16} />;
                let header = t('Culture Response');

                if (index === 0) {
                  colorClass = 'text-blue-500 bg-blue-50 dark:bg-blue-950/20';
                  icon = <Droplets size={16} />;
                  header = t('Water & Airflow');
                } else if (index === 2) {
                  colorClass = 'text-rose-500 bg-rose-50 dark:bg-rose-950/20';
                  icon = <Bug size={16} />;
                  header = t('Pest / Chemical');
                }

                return (
                  <div key={index} className="theme-panel-muted border theme-border rounded-xl p-4 space-y-2 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-[0.12em] theme-subtle">{header}</span>
                      <div className={`p-1.5 rounded-lg ${colorClass}`}>
                        {icon}
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed theme-heading">{t(rec)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alternate matches bar chart */}
          {result.topPredictions?.length > 1 && (
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] theme-heading border-b theme-border pb-2">
                <Activity size={16} className="text-primary-600" />
                {t('Alternative Matches')}
              </h3>
              
              <div className="space-y-3.5">
                {result.topPredictions.map((pred) => (
                  <div key={pred.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="theme-heading">{t(pred.crop)}: <span className="theme-subtle font-medium">{t(pred.disease)}</span></span>
                      <span className="text-primary-600 dark:text-primary-400 font-bold">{pred.confidence}%</span>
                    </div>
                    {/* Progress bar container */}
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-teal-400 rounded-full" 
                        style={{ width: `${pred.confidence}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sidebar options */}
      <div className="flex flex-col gap-4 print:hidden">
        <div className="theme-panel rounded-3xl p-5 shadow-agri border border-primary-500/10 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.14em] theme-heading">
            {t('Diagnostic Actions')}
          </h3>
          <div className="flex flex-col gap-2">
            <Button 
              onClick={handlePrint} 
              variant="outline" 
              className="w-full rounded-full py-2.5 text-xs font-bold uppercase tracking-[0.12em] flex items-center justify-center gap-2 border theme-border"
            >
              <Printer size={14} />
              {t('Export PDF Report')}
            </Button>
            
            <Button 
              onClick={onBack} 
              className="w-full rounded-full py-2.5 text-xs font-bold uppercase tracking-[0.12em] flex items-center justify-center gap-2"
            >
              <ArrowLeft size={14} />
              {t('Assess Another Leaf')}
            </Button>
          </div>
        </div>

        <div className="theme-panel rounded-3xl p-5 shadow-agri border border-primary-500/10 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-[0.12em] theme-heading flex items-center gap-1.5 text-primary-600 dark:text-primary-300">
            <FileText size={14} />
            {t('Assessment Note')}
          </h3>
          <p className="text-xs leading-relaxed theme-subtle">
            {t('This digital evaluation uses deep neural pattern matching. It does not replace on-site diagnostic sample testing by agronomists. For large scale commercial infections, consult state agricultural extension centers.')}
          </p>
        </div>
      </div>
    </div>
  );
}
