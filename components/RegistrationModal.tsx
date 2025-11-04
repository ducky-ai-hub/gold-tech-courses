import React, { useEffect, useState, useRef } from 'react';
import type { RegistrationInfo } from '../types';

// --- Environment Flag ---
// This flag determines whether to use the real Cloudflare Turnstile service
// or the mock implementation for development environments like AI Studio.
// To enable the real Turnstile, set the VITE_ENV environment variable to 'production'
// in your deployment environment.
const isProduction = (import.meta.env.VITE_ENV === 'production');

const turnstileSiteKey = isProduction ? import.meta.env.VITE_TURNSTILE_SITE_KEY : '1x0000000000000000000000000000000AA';

// Extend the Window interface to include Turnstile properties for TypeScript
declare global {
  interface Window {
    // FIX: Made the `turnstile` property optional to resolve a potential declaration
    // conflict and to align with its dynamic loading nature, which is checked at runtime.
    turnstile?: {
      render: (container: HTMLElement, params: any) => string;
      remove: (widgetId: string) => void;
    };
    // FIX: Made `onloadTurnstileCallback` optional as it is defined dynamically.
    onloadTurnstileCallback?: () => void;
  }
}

interface RegistrationModalProps {
  courseTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RegistrationInfo) => Promise<void>;
  error?: string | null;
}

const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);

const RegistrationModal: React.FC<RegistrationModalProps> = ({ courseTitle, isOpen, onClose, onSubmit, error }) => {
  const [formData, setFormData] = useState<RegistrationInfo>({
    fullName: '',
    email: '',
    phone: '',
  });
  const [turnstileToken, setTurnstileToken] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- State and Refs for different modes ---
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'verified'>('idle'); // For mock mode
  const turnstileContainerRef = useRef<HTMLDivElement>(null); // For real mode
  const widgetIdRef = useRef<string | null>(null); // For real mode

  // Effect to sync external error prop with internal state
  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);

  // Main effect to handle Turnstile logic based on environment
  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal is closed, regardless of mode
      setFormData({ fullName: '', email: '', phone: '' });
      setFormError(null);
      setTurnstileToken('');
      setIsSubmitting(false);
      setVerificationStatus('idle');
      return;
    }

    let mockTimerId: number | undefined;

    if (isProduction) {
      // --- PRODUCTION LOGIC: Use real Cloudflare Turnstile ---
      const scriptId = 'turnstile-script';
      
      // The callback function that Turnstile will call when its script is loaded and ready.
      window.onloadTurnstileCallback = () => {
        if (turnstileContainerRef.current && window.turnstile && !widgetIdRef.current) {
          const widgetId = window.turnstile.render(turnstileContainerRef.current, {
            sitekey: turnstileSiteKey,
            callback: (token: string) => {
              setTurnstileToken(token);
              setFormError(null);
            },
            'error-callback': () => {
              setFormError('Xác thực thất bại. Vui lòng thử lại.');
              setTurnstileToken('');
            },
          });
          widgetIdRef.current = widgetId;
        }
      };

      // Inject the Turnstile script into the document if it doesn't already exist.
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      } else {
        // If the script is already there, just try to render the widget.
        if (window.turnstile) {
          window.onloadTurnstileCallback();
        }
      }
    } else {
      // --- DEVELOPMENT LOGIC: Use mock verification ---
      setVerificationStatus('verifying');
      mockTimerId = window.setTimeout(() => {
        setTurnstileToken('mock-token-for-ai-studio-env');
        setVerificationStatus('verified');
      }, 1500);
    }

    // --- CLEANUP FUNCTION ---
    // This runs when the modal closes (isOpen becomes false) or the component unmounts.
    return () => {
      if (isProduction) {
        // Clean up the real Turnstile widget to prevent memory leaks.
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
      } else {
        // Clean up the mock timer.
        if (mockTimerId) {
          clearTimeout(mockTimerId);
        }
      }
    };
  }, [isOpen]); // This effect re-runs whenever the modal is opened or closed.

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    
    if (!turnstileToken) {
      setFormError('Vui lòng hoàn tất bước xác thực.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      // Error is set by the parent via props, but we reset Turnstile for a new attempt.
      if (isProduction) {
        // In a real scenario, you might want to reset the widget.
        // For simplicity, we just clear the token to force re-validation if needed.
      } else {
        setVerificationStatus('idle');
      }
      setTurnstileToken('');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) {
    return null;
  }
  
  const renderVerificationWidget = () => {
    if (isProduction) {
      // This div is the container where the real Turnstile widget will be rendered.
      return <div ref={turnstileContainerRef} />;
    }

    // Render the mock UI for development environments.
    switch (verificationStatus) {
      case 'verifying':
        return (
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <svg className="animate-spin h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Đang xác thực... (Môi trường Dev)</span>
          </div>
        );
      case 'verified':
        return (
          <div className="flex items-center justify-center gap-2 text-green-400">
            <CheckCircleIcon className="w-6 h-6" />
            <span>Xác thực thành công! (Môi trường Dev)</span>
          </div>
        );
      case 'idle':
      default:
        return null;
    }
  };

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

          <div className="pt-2">
            <div className="flex min-h-[65px] items-center justify-center p-4 bg-slate-800/50 rounded-md">
              {renderVerificationWidget()}
            </div>
          </div>

          {formError && (
            <p className="text-sm text-red-400 text-center">{formError}</p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !turnstileToken}
              className="w-full text-center flex justify-center bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-3 px-8 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đăng ký'}
            </button>
            {!turnstileToken && !isSubmitting && !formError && verificationStatus !== 'verified' && (
              <p className="text-center text-xs text-slate-500 mt-2">Vui lòng chờ xác thực để đăng ký.</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;
