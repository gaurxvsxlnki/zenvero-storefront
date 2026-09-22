import React, { useState } from 'react';
import { ChevronDown, X, CheckCircle2, Sparkles } from 'lucide-react';
import { Ebook } from '../../data/ebooks';

/* -------------------------------------------------------------------------- */
/*                                   BUTTON                                   */
/* -------------------------------------------------------------------------- */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'neu' | 'clay-primary' | 'neu-active' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'neu',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3.5 py-2 text-xs font-medium rounded-[14px]',
    md: 'px-5 py-2.5 text-sm font-medium rounded-[16px]',
    lg: 'px-7 py-3.5 text-base font-semibold rounded-[20px]',
  }[size];

  const variantClasses = {
    neu: 'neu-btn text-[#1E1D1B] hover:text-[#2A5C4D]',
    'clay-primary': 'clay-cta text-white font-medium',
    'neu-active': 'neu-pill-active text-[#2A5C4D] font-semibold',
    ghost: 'text-[#5C5852] hover:text-[#1E1D1B] hover:bg-[#ECE7E0]/60 transition-colors',
  }[variant];

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

/* -------------------------------------------------------------------------- */
/*                                    INPUT                                   */
/* -------------------------------------------------------------------------- */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, hint, icon, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-2">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && <span className="absolute left-4 text-[#8C867E] pointer-events-none">{icon}</span>}
        <input
          className={`w-full neu-inset-sm px-4 py-3 text-sm text-[#1E1D1B] placeholder-[#8C867E] focus:outline-none focus:ring-2 focus:ring-[#2A5C4D]/30 transition-all ${
            icon ? 'pl-11' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {hint && <p className="mt-1.5 text-xs text-[#8C867E]">{hint}</p>}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   SELECT                                   */
/* -------------------------------------------------------------------------- */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`w-full appearance-none neu-inset-sm px-4 py-3 pr-10 text-sm text-[#1E1D1B] focus:outline-none focus:ring-2 focus:ring-[#2A5C4D]/30 cursor-pointer ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-[#5C5852] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                  ACCORDION                                 */
/* -------------------------------------------------------------------------- */
export interface AccordionItemData {
  id: string;
  badge?: string;
  title: string;
  meta?: string;
  content: string;
}

export const Accordion: React.FC<{ items: AccordionItemData[] }> = ({ items }) => {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  return (
    <div className="space-y-3.5">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={`transition-all duration-200 rounded-[20px] p-1 ${
              isOpen ? 'neu-inset' : 'neu-card'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                {item.badge && (
                  <span
                    className={`font-mono-tech text-xs px-2.5 py-1 rounded-full ${
                      isOpen
                        ? 'bg-[#2A5C4D] text-white'
                        : 'neu-inset-sm text-[#5C5852]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                <span className="font-display font-semibold text-base text-[#1E1D1B]">
                  {item.title}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {item.meta && (
                  <span className="hidden sm:inline-block font-mono-tech text-xs text-[#8C867E]">
                    {item.meta}
                  </span>
                )}
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 ${
                    isOpen ? 'neu-inset-sm rotate-180 text-[#2A5C4D]' : 'neu-btn text-[#5C5852]'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </span>
              </div>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-sm text-[#5C5852] leading-relaxed border-t border-[#DCD6CD]/50 mx-2">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                    MODAL                                   */
/* -------------------------------------------------------------------------- */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-3xl',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1E1D1B]/35 animate-fadeIn">
      <div
        className={`relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto neu-card p-6 sm:p-8 border border-white`}
      >
        <div className="flex items-start justify-between gap-4 pb-5 mb-6 border-b border-[#DED8CF]">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1E1D1B]">{title}</h3>
            {subtitle && <p className="text-sm text-[#5C5852] mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full neu-btn flex items-center justify-center text-[#5C5852] hover:text-[#1E1D1B] cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                    TOAST                                   */
/* -------------------------------------------------------------------------- */
export const Toast: React.FC<{
  message: string | null;
  onDismiss: () => void;
}> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 clay-pedestal px-5 py-3.5 border border-white max-w-sm animate-bounce-subtle">
      <span className="w-8 h-8 rounded-full bg-[#2A5C4D] text-white flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-4 h-4" />
      </span>
      <p className="text-sm font-medium text-[#1E1D1B] pr-2">{message}</p>
      <button
        onClick={onDismiss}
        className="text-xs text-[#8C867E] hover:text-[#1E1D1B] ml-auto cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                            EDITORIAL BOOK COVER                            */
/* -------------------------------------------------------------------------- */
/**
 * Renders an authentic, editable architectural monograph cover inside a soft claymorphic 3D frame.
 * Uses real editable artwork thumbnail + crisp readable typography (never fake AI gibberish text).
 */
export const EditorialBookCover: React.FC<{
  ebook: Ebook;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
}> = ({ ebook, size = 'md', className = '' }) => {
  const dimensions = {
    sm: 'w-24 h-32',
    md: 'w-full aspect-[3/4]',
    lg: 'w-full max-w-[340px] aspect-[3/4.1]',
    hero: 'w-[260px] sm:w-[300px] aspect-[3/4.15]',
  }[size];

  return (
    <div
      className={`clay-cover-frame p-2.5 sm:p-3 select-none relative overflow-hidden ${dimensions} ${className}`}
    >
      {/* Subtle 3D Book Spine crease */}
      <div
        className="w-full h-full rounded-[12px] overflow-hidden relative flex flex-col justify-between p-3.5 sm:p-4 border border-white/70"
        style={{ backgroundColor: ebook.coverPalette?.bg || '#EAE4DC' }}
      >
        {/* Left Spine Lighting Strip */}
        <div
          className="absolute inset-y-0 left-0 w-3 opacity-55 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, rgba(30,29,27,0.12) 0%, rgba(255,255,255,0.65) 55%, rgba(30,29,27,0.05) 100%)',
          }}
        />

        {/* Top Editorial Header */}
        <div className="relative z-10 pl-1.5">
          <div className="flex items-center justify-between gap-1 text-[9px] font-mono-tech uppercase tracking-widest text-[#5C5852]">
            <span>ZENVERO PRESS</span>
            <span>{ebook.coverPalette?.badge || 'EDITION'}</span>
          </div>
          <div className="h-[1px] w-full bg-[#1E1D1B]/15 my-1.5" />
          <h4
            className={`font-display font-bold text-[#1E1D1B] leading-[1.12] tracking-tight line-clamp-2 ${
              size === 'sm'
                ? 'text-[10px]'
                : size === 'hero' || size === 'lg'
                ? 'text-lg sm:text-xl'
                : 'text-sm sm:text-base'
            }`}
          >
            {ebook.title}
          </h4>
          {size !== 'sm' && (
            <p className="text-[10px] text-[#5C5852] mt-1 line-clamp-1 font-medium">
              {ebook.author}
            </p>
          )}
        </div>

        {/* Editable Real Photography / Illustration Window */}
        <div className="relative z-10 my-2 pl-1.5 flex-1 min-h-0 flex items-center justify-center">
          <div className="w-full h-full rounded-[8px] overflow-hidden relative shadow-inner border border-white/60 bg-[#DCD5CA]">
            <img
              src={ebook.coverImage}
              alt={ebook.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E1D1B]/25 via-transparent to-transparent" />
            <span
              className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-full text-[8px] font-mono-tech uppercase tracking-wider text-white"
              style={{ backgroundColor: ebook.coverPalette?.accent || '#2A5C4D' }}
            >
              {ebook.category}
            </span>
          </div>
        </div>

        {/* Bottom Monograph Footer */}
        {size !== 'sm' && (
          <div className="relative z-10 pl-1.5 flex items-center justify-between text-[9px] font-mono-tech text-[#5C5852] pt-1 border-t border-[#1E1D1B]/10">
            <span className="flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#2A5C4D]" />
              {ebook.pages} PAGES
            </span>
            <span>DIGITAL MONOGRAPH</span>
          </div>
        )}
      </div>
    </div>
  );
};
