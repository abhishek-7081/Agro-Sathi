import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { useTranslation } from "../../hooks/useTranslation";
import { ChevronRight, Sprout } from "lucide-react";

export default function PredictionForm({ onSubmit, loading }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        cropType: "",
        landArea: "",
        soilType: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="space-y-12">
            <Card className="max-w-xl mx-auto border-none shadow-premium-xl rounded-[40px] overflow-hidden bg-white/90 backdrop-blur-md">
                <CardContent className="p-10 md:p-14">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="flex flex-col items-center text-center mb-10">
                            <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-6 text-primary-600">
                                <Sprout size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-soil-dark tracking-tighter uppercase">
                                {t('prediction.form_title')}
                            </h2>
                            <p className="text-slate-500 font-medium text-sm mt-2">{t('prediction.form_subtitle')}</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('prediction.crop_type')}</Label>
                                <select
                                    className="w-full h-14 rounded-2xl border-slate-100 bg-slate-50 px-6 py-2 text-sm font-bold text-soil-dark focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 transition-all appearance-none outline-none shadow-sm"
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

                            <div className="space-y-3">
                                <Label htmlFor="landArea" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                    {t('prediction.land_area')} (Acres)
                                </Label>
                                <Input
                                    id="landArea"
                                    type="number"
                                    placeholder={t('prediction.enter_land_area')}
                                    className="h-14 rounded-2xl border-slate-100 bg-slate-50 px-6 font-bold text-soil-dark focus:bg-white shadow-sm"
                                    value={formData.landArea}
                                    onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                                    required
                                    min="0.1"
                                    step="0.1"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('prediction.soil_type')}</Label>
                                <select
                                    className="w-full h-14 rounded-2xl border-slate-100 bg-slate-50 px-6 py-2 text-sm font-bold text-soil-dark focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 transition-all appearance-none outline-none shadow-sm"
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

                        <button
                            type="submit"
                            className="btn-premium w-full h-14 bg-primary-600 text-white shadow-agri hover:shadow-agri-lg flex items-center justify-center gap-2 group mt-4 overflow-hidden"
                            disabled={loading || !formData.cropType || !formData.landArea || !formData.soilType}
                        >
                            <span className="relative z-10 transition-transform group-hover:translate-x-1">
                                {loading ? t('prediction.predicting') : t('prediction.predict_button')}
                            </span>
                            {!loading && <ChevronRight size={18} className="relative z-10 transition-transform group-hover:translate-x-1" />}
                            {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        </button>
                    </form>
                </CardContent>
            </Card>

            <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                <div className="p-8 rounded-[40px] bg-white border border-slate-100 shadow-premium-lg">
                    <h4 className="text-sm font-black text-soil-dark uppercase tracking-widest mb-4 border-l-4 border-primary-600 pl-4">How it works</h4>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                        Our AI analyzes historical data and soil profiles to estimate your crop yield for the upcoming season.
                    </p>
                </div>
                <div className="p-8 rounded-[40px] bg-white border border-slate-100 shadow-premium-lg">
                    <h4 className="text-sm font-black text-soil-dark uppercase tracking-widest mb-4 border-l-4 border-primary-600 pl-4">Precision Guarantee</h4>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                        Data is aggregated from over 500+ regional test beds to provide highly localized estimates.
                    </p>
                </div>
            </div>
        </div>
    );
}
