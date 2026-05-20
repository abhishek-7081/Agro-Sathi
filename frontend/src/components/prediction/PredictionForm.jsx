import { useMemo, useRef, useState, useEffect } from 'react';
import { ImagePlus, ChevronRight, ScanLine, Sprout, ClipboardList, RefreshCw, HelpCircle, FileText, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { useTranslation } from '../../hooks/useTranslation';

const SUPPORTED_CROPS = [
  'Apple', 'Blueberry', 'Cherry', 'Corn', 'Grape', 'Orange', 
  'Peach', 'Pepper', 'Potato', 'Raspberry', 'Soybean', 'Squash', 
  'Strawberry', 'Tomato'
];

export default function PredictionForm({ onSubmit, loading, modelOnline }) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    notes: '',
    image: null,
    imagePreview: '',
  });

  const summary = useMemo(
    () => [
      formData.image ? t('Image ready') : t('Upload required'),
      t('38 disease classes'),
      modelOnline ? t('Local Model Connected') : t('Model Offline'),
    ],
    [formData.image, modelOnline, t]
  );

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const previewUrl = URL.createObjectURL(file);
        setFormData((prev) => ({ ...prev, image: file, imagePreview: previewUrl }));
      }
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setFormData((prev) => ({ ...prev, image: null, imagePreview: '' }));
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, image: file, imagePreview: previewUrl }));
  };

  const clearImage = (e) => {
    e.stopPropagation();
    setFormData((prev) => ({ ...prev, image: null, imagePreview: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] animate-fade-in-up">
      {/* Laser scan animation styles */}
      <style>{`
        @keyframes laser-scan {
          0% { top: 0%; opacity: 0.1; }
          50% { opacity: 0.9; }
          100% { top: 100%; opacity: 0.1; }
        }
        .laser-line {
          animation: laser-scan 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>

      <Card className="overflow-hidden rounded-[28px] border-none shadow-premium-xl theme-panel">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* Image Upload Area */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] theme-subtle">{t('Leaf Photo')}</p>
                    <h2 className="text-lg font-black uppercase tracking-[0.08em] theme-heading">{t('Diagnostic Target')}</h2>
                  </div>
                  {formData.imagePreview && (
                    <button
                      type="button"
                      onClick={clearImage}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                    >
                      <RefreshCw size={12} />
                      {t('Reset')}
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative flex min-h-[320px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-300 ${
                    dragActive 
                      ? 'border-primary-500 bg-primary-50/30 dark:bg-primary-950/10 scale-[1.01]' 
                      : 'theme-border theme-panel-muted hover:border-primary-400 hover:shadow-agri'
                  }`}
                >
                  {formData.imagePreview ? (
                    <div className="relative h-[270px] w-full overflow-hidden rounded-xl group">
                      <img
                        src={formData.imagePreview}
                        alt="Crop preview"
                        className="h-full w-full object-cover shadow-premium-lg transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Scanning Line overlay */}
                      {(loading || formData.imagePreview) && (
                        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary-400 to-transparent shadow-[0_0_12px_#2aacaf] laser-line pointer-events-none" />
                      )}

                      {/* Click overlay hint */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 rounded-xl">
                        <p className="text-white text-xs font-bold uppercase tracking-[0.16em] inline-flex items-center gap-2">
                          <ImagePlus size={14} />
                          {t('Change Image')}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center p-4">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-300 shadow-md">
                        <ScanLine size={24} className="animate-pulse" />
                      </div>
                      <p className="text-sm font-black uppercase tracking-[0.12em] theme-heading">
                        {t('Drag & Drop leaf photo')}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed theme-subtle max-w-xs">
                        {t('or click to browse from device. Support high-resolution JPEG, PNG, or WEBP.')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Form inputs */}
              <div className="flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-black uppercase tracking-[0.18em] theme-subtle">{t('Observations / Notes')}</Label>
                    <span className="text-[10px] theme-subtle font-mono">
                      {formData.notes.length}/350
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    maxLength={350}
                    className="theme-input w-full rounded-xl px-4 py-3 text-sm font-medium leading-relaxed resize-none focus:ring-primary-500/20"
                    placeholder={t('Describe signs like leaf spot color, wilting speed, pest sightings, weather changes, or fertilizer history...')}
                    value={formData.notes}
                    onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
                  />
                </div>

                <div className="rounded-xl border border-primary-500/10 theme-panel-muted p-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-primary-600 dark:text-primary-300">
                    <Sprout size={14} />
                    <h3 className="text-xs font-black uppercase tracking-[0.12em]">{t('Analysis Scope')}</h3>
                  </div>
                  <p className="text-xs leading-relaxed theme-subtle">
                    {t('Our AI detects healthy versus pathological conditions across')} <span className="font-bold theme-heading">14 crop families</span> {t('comprising 38 specific labels.')}
                  </p>
                </div>

                <div className="rounded-xl border border-primary-500/10 theme-panel-muted p-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-primary-600 dark:text-primary-300">
                    <HelpCircle size={14} />
                    <h3 className="text-xs font-black uppercase tracking-[0.12em]">{t('Scanning Tip')}</h3>
                  </div>
                  <p className="text-xs leading-relaxed theme-subtle">
                    {t('Ensure the main symptoms are centered and sharp. Avoid direct blinding sunlight or deep shadows.')}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions Area */}
            <div className="theme-panel-muted flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between border border-primary-500/5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm flex-shrink-0">
                  <ClipboardList size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] theme-subtle">{t('System Ready')}</p>
                  <p className="text-xs font-bold theme-heading">{summary.join(' • ')}</p>
                </div>
              </div>

              <Button
                type="submit"
                className="rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] min-w-[200px]"
                disabled={loading || !formData.image}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw size={14} className="animate-spin" />
                    {t('Running Diagnosis...')}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {t('Start Scanning')}
                    <ChevronRight size={14} />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Sidebar Guidance Panel */}
      <div className="flex flex-col gap-6">
        {/* Supported Dataset Grid */}
        <div className="theme-panel rounded-3xl p-5 shadow-agri border border-primary-500/10 space-y-4">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-primary-600 dark:text-primary-300">
              {t('Dataset Directory')}
            </span>
            <h3 className="text-sm font-black uppercase tracking-[0.1em] theme-heading mt-0.5">
              {t('Covered Crops')}
            </h3>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-[170px] overflow-y-auto pr-1">
            {SUPPORTED_CROPS.map((crop) => (
              <span
                key={crop}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border theme-border theme-panel-muted hover:border-primary-400 hover:text-primary-600 transition-colors"
              >
                {t(crop)}
              </span>
            ))}
          </div>
        </div>

        {/* Dynamic Diagnostics Checklist */}
        <div className="theme-panel rounded-3xl p-5 shadow-agri border border-primary-500/10 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.14em] theme-heading">
            {t('Best Quality Checklist')}
          </h3>
          <ul className="space-y-3">
            {[
              t('Leaf is dry and flat'),
              t('Camera is aligned flat-parallel to leaf'),
              t('Adequate, diffused natural lighting'),
              t('High resolution, details focused')
            ].map((text, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs theme-subtle">
                <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
