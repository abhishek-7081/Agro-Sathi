import { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, X, Loader2, Stars } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sendVoiceMessage } from '../../services/ai.service';
import { useTranslation } from '../../hooks/useTranslation';

const TARGET_SAMPLE_RATE = 16000;

function audioBufferToWavBlob(buffer) {
  const sampleRate = buffer.sampleRate;
  const numChannels = buffer.numberOfChannels;
  const length = buffer.length;
  const outLength = Math.round((length * TARGET_SAMPLE_RATE) / sampleRate);
  const mono = new Float32Array(outLength);
  for (let i = 0; i < outLength; i++) {
    const srcIndex = (i * sampleRate) / TARGET_SAMPLE_RATE;
    const srcIdx = Math.min(Math.floor(srcIndex), length - 1);
    let s = 0;
    for (let c = 0; c < numChannels; c++) s += buffer.getChannelData(c)[srcIdx];
    mono[i] = s / numChannels;
  }
  const bitDepth = 16;
  const dataLength = outLength * 2;
  const bufferLength = 44 + dataLength;
  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);
  const writeStr = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  view.setUint32(4, bufferLength - 8, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, TARGET_SAMPLE_RATE, true);
  view.setUint32(28, TARGET_SAMPLE_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, bitDepth, true);
  writeStr(36, 'data');
  view.setUint32(40, dataLength, true);
  let offset = 44;
  for (let i = 0; i < outLength; i++) {
    const s = Math.max(-1, Math.min(1, mono[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }
  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

export default function VoiceAssistant() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [canStop, setCanStop] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const minRecordTimerRef = useRef(null);

  const startRecording = useCallback(async () => {
    setError('');
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        if (blob.size < 2000) {
          setError(t('dashboard.voice.too_short'));
          return;
        }
        let base64;
        let contentType = 'wav';
        try {
          const arrayBuffer = await blob.arrayBuffer();
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const decoded = await audioContext.decodeAudioData(arrayBuffer.slice(0));
          const wavBlob = audioBufferToWavBlob(decoded);
          base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result?.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(wavBlob);
          });
        } catch (e) {
          contentType = 'webm';
          base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result?.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        }
        if (!base64) {
          setError('Read error');
          return;
        }
        setLoading(true);
        setError('');
        try {
          const data = await sendVoiceMessage(base64, contentType);
          setResult(data);
          if (data.audioBase64) {
            const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
            audio.play().catch(() => {});
          }
        } catch (err) {
          setError(err.response?.data?.message || err.message || 'Error');
        } finally {
          setLoading(false);
        }
      };
      recorder.start(100);
      mediaRecorderRef.current = recorder;
      setRecording(true);
      setCanStop(false);
      minRecordTimerRef.current = setTimeout(() => setCanStop(true), 2000);
    } catch (err) {
      setError('Microphone denied');
    }
  }, [t]);

  const stopRecording = useCallback(() => {
    if (minRecordTimerRef.current) {
      clearTimeout(minRecordTimerRef.current);
      minRecordTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    setRecording(false);
    setCanStop(false);
  }, []);

  if (!user) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`fixed bottom-8 right-8 z-[60] flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-premium-lg hover:shadow-premium-xl hover:scale-110 active:scale-95 transition-all duration-500 group ${open ? 'rotate-90' : ''}`}
      >
        <Mic size={28} className="group-hover:animate-pulse" />
      </button>

      {open && (
        <div className="fixed bottom-28 right-8 z-[60] w-96 rounded-3xl bg-white shadow-premium-xl border border-slate-100 overflow-hidden animate-fade-in-up">
          <div className="bg-primary-600 p-6 text-white relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Stars size={60} strokeWidth={1} />
            </div>
            <div className="flex items-center justify-between relative z-10">
              <span className="text-sm font-black uppercase tracking-widest">{t('dashboard.voice.title')}</span>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-primary-100 text-xs mt-1 font-medium">{t('dashboard.voice.instruction')}</p>
          </div>

          <div className="p-8 space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold animate-shake">
                {error}
              </div>
            )}

            {result && (
              <div className="space-y-4 animate-fade-in">
                {result.transcript && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('dashboard.voice.you')}</span>
                    <p className="text-sm font-bold text-soil-dark bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      {result.transcript}
                    </p>
                  </div>
                )}
                {result.reply && (
                  <div className="flex flex-col gap-1 items-end">
                    <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">{t('dashboard.voice.assistant')}</span>
                    <p className="text-sm font-bold text-white bg-primary-600 p-4 rounded-2xl shadow-premium rounded-tr-none">
                      {result.reply}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col items-center gap-6">
              {loading ? (
                <div className="flex flex-col items-center gap-3 py-4 text-primary-600">
                  <Loader2 size={32} className="animate-spin" />
                  <span className="text-xs font-black uppercase tracking-widest">{t('dashboard.voice.processing')}</span>
                </div>
              ) : recording ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-25" />
                    <button
                      onClick={stopRecording}
                      disabled={!canStop}
                      className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300 ${canStop ? 'bg-rose-500 text-white shadow-lg' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                    >
                      <MicOff size={32} />
                    </button>
                  </div>
                  <span className="text-xs font-black text-rose-500 uppercase tracking-widest animate-pulse">
                    {canStop ? t('dashboard.voice.stop_and_send') : 'Speak... (2s)'}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={startRecording}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-600 text-white shadow-premium-lg hover:shadow-premium-xl hover:scale-105 active:scale-95 transition-all duration-300 group"
                  >
                    <Mic size={32} className="group-hover:animate-pulse" />
                  </button>
                  <span className="text-xs font-black text-primary-600 uppercase tracking-widest">
                    {t('dashboard.voice.tap_to_speak')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
