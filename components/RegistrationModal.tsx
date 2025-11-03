
import React, { useEffect, useRef, useState } from 'react';
import type { RegistrationInfo } from '../types';

interface RegistrationModalProps {
  courseTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RegistrationInfo) => Promise<void>;
}

const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

type TurnstileRenderOptions = {
  sitekey: string;
  callback?: (token: string) => void;
  'error-callback'?: () => void;
  'timeout-callback'?: () => void;
  'expired-callback'?: () => void;
};

interface TurnstileInstance {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileInstance;
  }
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ courseTitle, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<RegistrationInfo>({
    fullName: '',
    email: '',
    phone: '',
  });
  const [turnstileToken, setTurnstileToken] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const widgetContainerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    try {
      if (turnstileSiteKey && !turnstileToken) {
        setFormError('Vui lòng xác minh bạn không phải robot.');
        return;
      }

      await onSubmit({
        ...formData,
        turnstileToken: turnstileToken || undefined,
      });

      if (widgetIdRef.current) {
        window.turnstile?.reset(widgetIdRef.current);
      }
      setTurnstileToken('');
    } catch (error) {
      console.error("Submission failed", error);
      // Here you could show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const scriptId = 'cf-turnstile-script';
    if (!document.getElementById(scriptId) && turnstileSiteKey) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.setAttribute('data-cfasync', 'false');
      document.body.appendChild(script);
    }
  }, [isOpen, turnstileSiteKey]);

  useEffect(() => {
    if (!isOpen || !turnstileSiteKey) {
      return;
    }

    const renderWidget = () => {
      if (!widgetContainerRef.current || !window.turnstile) {
        return;
      }
      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = window.turnstile.render(widgetContainerRef.current, {
        sitekey: turnstileSiteKey,
        callback: (token) => {
          setTurnstileToken(token);
          setFormError(null);
        },
        'error-callback': () => setTurnstileToken(''),
        'timeout-callback': () => setTurnstileToken(''),
        'expired-callback': () => setTurnstileToken(''),
      });
    };

    const handleTurnstileLoaded = () => {
      window.removeEventListener('turnstile-loaded', handleTurnstileLoaded);
      renderWidget();
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      window.addEventListener('turnstile-loaded', handleTurnstileLoaded);
    }

    return () => {
      window.removeEventListener('turnstile-loaded', handleTurnstileLoaded);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
      setTurnstileToken('');
    };
  }, [isOpen, turnstileSiteKey]);
  
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-300"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative bg-slate-900 rounded-2xl shadow-xl w-full max-w-md p-8 border border-slate-700 m-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <XMarkIcon className="w-6 h-6" />
          <span className="sr-only">Đóng</span>
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-2">Đăng Ký Khóa Học</h2>
        <p className="text-amber-400 mb-6">{courseTitle}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-1">Họ và tên</label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
            />
          </div>

          {turnstileSiteKey ? (
            <div className="pt-2">
              <div ref={widgetContainerRef} className="cf-turnstile" />
            </div>
          ) : (
            <p className="text-sm text-amber-400 pt-2">
              Thiếu cấu hình Turnstile. Vui lòng thêm biến môi trường `VITE_TURNSTILE_SITE_KEY`.
            </p>
          )}

          {formError && (
            <p className="text-sm text-red-400">{formError}</p>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || (Boolean(turnstileSiteKey) && !turnstileToken)}
              className="w-full text-center flex justify-center bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-3 px-8 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-amber-400/50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đăng ký'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;
