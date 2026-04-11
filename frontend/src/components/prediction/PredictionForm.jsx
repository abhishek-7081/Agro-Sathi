import { useMemo, useRef, useState } from 'react';
import { ImagePlus, ChevronRight, ScanLine, Sprout, ClipboardList } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { useTranslation } from '../../hooks/useTranslation';

export default function PredictionForm({ onSubmit, loading }) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    cropType: '',
    landArea: '',
    soilType: '',
    growthStage: 'vegetative',
    notes: '',
    image: null,
    imagePreview: '',
  });

  const summary = useMemo(
    () => [
      formData.cropType || 'Crop',
      formData.growthStage || 'Stage',
      formData.landArea ? `${formData.landArea} acres` : 'Field area',
    ],
    [formData.cropType, formData.growthStage, formData.landArea]
  );

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setFormData((prev) => ({ ...prev, image: null, imagePreview: '' }));
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, image: file, imagePreview: previewUrl }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="rounded-[32px] border-none shadow-premium-xl overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] theme-subtle">Image Sample</p>
                    <h2 className="mt-1 text-xl font-black uppercase tracking-[0.12em] theme-heading">Leaf or Crop Photo</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="theme-button-secondary inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em]"
                  >
                    <ImagePlus size={14} />
                    Upload
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="theme-panel-muted flex min-h-[300px] w-full flex-col items-center justify-center rounded-[28px] border border-dashed theme-border p-6 text-center transition-all hover:scale-[1.01]"
                >
                  {formData.imagePreview ? (
                    <img
                      src={formData.imagePreview}
                      alt="Crop preview"
                      className="h-[260px] w-full rounded-[22px] object-cover shadow-premium-lg"
                    />
                  ) : (
                    <>
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-600 text-white shadow-agri">
                        <ScanLine size={28} />
                      </div>
                      <p className="text-sm font-black uppercase tracking-[0.16em] theme-heading">Drop a crop photo here</p>
                      <p className="mt-2 max-w-xs text-sm leading-6 theme-subtle">
                        Upload a leaf or canopy image to make the diagnosis flow more useful and visually guided.
                      </p>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.18em] theme-subtle">{t('prediction.crop_type')}</Label>
                    <select
                      className="theme-input h-12 w-full rounded-2xl px-4 text-sm font-bold"
                      value={formData.cropType}
                      onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                      required
                    >
                      <option value="" disabled>{t('prediction.select_crop')}</option>
                      <option value="wheat">{t('prediction.crops.wheat')}</option>
                      <option value="rice">{t('prediction.crops.rice')}</option>
                      <option value="maize">{t('prediction.crops.maize')}</option>
                      <option value="sugarcane">{t('prediction.crops.sugarcane')}</option>
                      <option value="cotton">{t('prediction.crops.cotton')}</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.18em] theme-subtle">Growth Stage</Label>
                    <select
                      className="theme-input h-12 w-full rounded-2xl px-4 text-sm font-bold"
                      value={formData.growthStage}
                      onChange={(e) => setFormData({ ...formData, growthStage: e.target.value })}
                    >
                      <option value="vegetative">Vegetative</option>
                      <option value="flowering">Flowering</option>
                      <option value="grain-filling">Grain Filling</option>
                      <option value="harvest-ready">Harvest Ready</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="landArea" className="text-[10px] font-black uppercase tracking-[0.18em] theme-subtle">
                      {t('prediction.land_area')} (Acres)
                    </Label>
                    <Input
                      id="landArea"
                      type="number"
                      min="0.1"
                      step="0.1"
                      placeholder={t('prediction.enter_land_area')}
                      value={formData.landArea}
                      onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.18em] theme-subtle">{t('prediction.soil_type')}</Label>
                    <select
                      className="theme-input h-12 w-full rounded-2xl px-4 text-sm font-bold"
                      value={formData.soilType}
                      onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                      required
                    >
                      <option value="" disabled>{t('prediction.select_soil')}</option>
                      <option value="loamy">{t('prediction.soils.loamy')}</option>
                      <option value="sandy">{t('prediction.soils.sandy')}</option>
                      <option value="clayey">{t('prediction.soils.clayey')}</option>
                      <option value="silty">{t('prediction.soils.silty')}</option>
                      <option value="peaty">{t('prediction.soils.peaty')}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.18em] theme-subtle">Field Notes</Label>
                  <textarea
                    rows={5}
                    className="theme-input w-full rounded-[22px] px-4 py-3 text-sm font-medium"
                    placeholder="Describe discoloration, wilting, pest signs, or irrigation concerns."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="theme-panel-muted flex flex-col gap-4 rounded-[28px] p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-600 text-white">
                  <ClipboardList size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] theme-subtle">Prediction Summary</p>
                  <p className="mt-1 text-sm font-semibold theme-heading">{summary.join(' • ')}</p>
                </div>
              </div>

              <Button
                type="submit"
                className="min-w-[220px] rounded-full px-6 py-3 text-xs uppercase tracking-[0.18em]"
                disabled={loading || !formData.cropType || !formData.landArea || !formData.soilType}
              >
                {loading ? t('prediction.predicting') : t('prediction.predict_button')}
                {!loading && <ChevronRight size={16} />}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-5">
        <div className="theme-panel rounded-[28px] p-6 shadow-premium-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white">
            <Sprout size={20} />
          </div>
          <h3 className="text-sm font-black uppercase tracking-[0.16em] theme-heading">What You’ll Get</h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 theme-subtle">
            <li>Instant yield estimate based on crop, field size, and soil context.</li>
            <li>Image-assisted disease hinting with a confidence score for triage.</li>
            <li>Next-step recommendations you can act on right away.</li>
          </ul>
        </div>

        <div className="theme-panel rounded-[28px] p-6 shadow-premium-lg">
          <h3 className="text-sm font-black uppercase tracking-[0.16em] theme-heading">Best Upload Tips</h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 theme-subtle">
            <li>Use daylight and keep one affected area clearly visible.</li>
            <li>Avoid blurry images or shadows covering the leaf surface.</li>
            <li>Add field notes if symptoms started after weather changes or spraying.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
