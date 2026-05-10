import { useState, useRef } from 'react';
import { Send, Mic, Square } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export default function ChatInput({ onSend, onVoiceSend, disabled }) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64String = reader.result.split(',')[1];
          if (onVoiceSend) {
            onVoiceSend(base64String, 'webm');
          }
        };
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied or error:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={isRecording ? 'Recording audio...' : (t('ai_chat.placeholder') || 'Type your message...')}
        disabled={isRecording || disabled}
        className={`flex-1 form-input-agri rounded-agri-lg px-4 py-3 border-primary-100 focus:ring-primary-500/20 bg-white/90 ${isRecording ? 'bg-red-50 text-red-500 placeholder-red-400' : ''}`}
      />
      
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled}
        className={`p-3 rounded-agri-lg shadow-agri hover:shadow-agri-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
          isRecording 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'bg-white text-primary-600 border border-primary-100'
        }`}
      >
        {isRecording ? <Square size={20} fill="currentColor" /> : <Mic size={20} />}
      </button>

      <button
        type="submit"
        disabled={disabled || (!input.trim() && !isRecording)}
        className="p-3 rounded-agri-lg bg-gradient-to-r from-primary-700 to-primary-600 text-white shadow-agri hover:shadow-agri-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      >
        <Send size={20} />
      </button>
    </form>
  );
}

