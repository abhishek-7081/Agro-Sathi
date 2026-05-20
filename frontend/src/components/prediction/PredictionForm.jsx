import { useMemo, useRef, useState } from 'react';
import { ImagePlus, ChevronRight, ScanLine, Sprout, ClipboardList } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';

export default function PredictionForm({ onSubmit, loading }) {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    notes: '',
    image: null,
    imagePreview: '',
  });

  const summary = useMemo(
    () => [
      formData.image ? 'Image ready' : 'Upload required',
      '38 disease classes',
      'Offline model integration',
    ],
    [formData.image]
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
      <Card className="overflow-hidden rounded-[32px] border-none shadow-premium-xl">
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
                        Upload a clear image of the affected leaf or plant area for the disease classifier.
                      </p>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.18em] theme-subtle">Field Notes</Label>
                  <textarea
                    rows={7}
                    className="theme-input w-full rounded-[22px] px-4 py-3 text-sm font-medium"
                    placeholder="Optional: describe discoloration, wilting, recent weather stress, or pest signs."
                    value={formData.notes}
                    onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
                  />
                </div>

                <div className="theme-panel rounded-[24px] p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] theme-subtle">Supported crops in the trained dataset</p>
                  <p className="mt-2 text-sm leading-6 theme-heading">
                    Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Pepper, Potato, Raspberry, Soybean, Squash,
                    Strawberry, and Tomato.
                  </p>
                </div>

                <div className="theme-panel rounded-[24px] p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] theme-subtle">Best capture guide</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 theme-subtle">
                    <li>Use daylight and keep one affected area clearly visible.</li>
                    <li>Avoid blur, harsh shadows, or multiple plants crowding the frame.</li>
                    <li>Capture the lesion pattern, edge discoloration, and overall leaf surface.</li>
                  </ul>
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
                disabled={loading || !formData.image}
              >
                {loading ? 'Analyzing image...' : 'Detect plant disease'}
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
          <h3 className="text-sm font-black uppercase tracking-[0.16em] theme-heading">What You'll Get</h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 theme-subtle">
            <li>A real disease label from the trained TensorFlow model.</li>
            <li>A confidence score plus the top alternate predictions.</li>
            <li>Field recommendations you can use as a first response.</li>
          </ul>
        </div>

        <div className="theme-panel rounded-[28px] p-6 shadow-premium-lg">
          <h3 className="text-sm font-black uppercase tracking-[0.16em] theme-heading">Model Scope</h3>
          <p className="mt-4 text-sm leading-6 theme-subtle">
            This detector is trained on 38 plant-disease classes from the dataset inside the project, so best results
            come from crops covered by that archive.
          </p>
        </div>
      </div>
    </div>
  );
}
