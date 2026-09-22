import React from 'react';
import { ShieldCheck, BookOpen, Sparkles, ArrowUpRight } from 'lucide-react';
import { CATEGORIES, EbookCategory } from '../../data/ebooks';
import { PageView } from './Navbar';

interface FooterProps {
  onNavigate: (view: PageView, sectionId?: string) => void;
  onSelectCategory: (category: EbookCategory) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectCategory }) => {
  return (
    <footer className="mt-24 px-4 sm:px-6 lg:px-10 pb-12">
      <div className="max-w-[1360px] mx-auto neu-chassis p-8 sm:p-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-[#DDD7CE]">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] clay-cta flex items-center justify-center">
                <span className="font-display font-extrabold text-lg text-white">ZV</span>
              </div>
              <div>
                <span className="font-display font-bold text-xl text-[#1E1D1B] block leading-none">
                  ZenVero
                </span>
                <span className="text-xs text-[#5C5852] mt-1 block">
                  Practical knowledge. Beautifully packaged.
                </span>
              </div>
            </div>
            <p className="text-sm text-[#5C5852] max-w-sm leading-relaxed">
              An independent digital publishing house and bookstore curating tactile, field-tested
              monographs, engineering guides, and operating playbooks for calm builders.
            </p>
            <div className="inline-flex items-center gap-2.5 neu-inset-sm px-4 py-2 text-xs text-[#5C5852]">
              <ShieldCheck className="w-4 h-4 text-[#2A5C4D]" />
              <span>Instant DRM-free PDF Vault Delivery</span>
            </div>
          </div>

          {/* Categories Column */}
          <div className="md:col-span-4">
            <h4 className="font-mono-tech text-xs uppercase tracking-widest text-[#8C867E] mb-4">
              Curated Shelves
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => onSelectCategory(cat.name)}
                  className="text-left text-xs text-[#5C5852] hover:text-[#2A5C4D] transition-colors py-1 cursor-pointer flex items-center gap-1"
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reader Utility Column */}
          <div className="md:col-span-3">
            <h4 className="font-mono-tech text-xs uppercase tracking-widest text-[#8C867E] mb-4">
              Reader Sanctuary
            </h4>
            <ul className="space-y-2.5 text-xs text-[#5C5852]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('search')}
                  className="hover:text-[#2A5C4D] transition-colors cursor-pointer"
                >
                  Full Catalog Search & Filters
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('library')}
                  className="hover:text-[#2A5C4D] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#2A5C4D]" />
                  <span>My Purchased Library</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('account')}
                  className="hover:text-[#2A5C4D] transition-colors cursor-pointer"
                >
                  Reader Account & Receipts
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="hover:text-[#2A5C4D] transition-colors cursor-pointer inline-flex items-center gap-1 font-mono-tech text-[#2A5C4D]"
                >
                  <span>Publisher Studio (/admin)</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C867E]">
          <p>© {new Date().getFullYear()} ZenVero Editions Inc. Crafted with Soft Neumorphism & Claymorphism.</p>
          <div className="flex items-center gap-2 font-mono-tech text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-[#2A5C4D]" />
            <span>ENCRYPTED DIGITAL FULFILLMENT • ZERO PHYSICAL SHIPPING</span>
          </div>
        </div>

        {/* Founder Credit — End of Storefront */}
        <div className="mt-6 pt-5 border-t border-dashed border-[#D4CCC0] flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <div className="w-9 h-9 rounded-[12px] clay-cta flex items-center justify-center text-white font-display font-bold text-sm shrink-0">
            GS
          </div>
          <div className="text-center sm:text-left">
            <span className="block font-display font-bold text-sm text-[#1E1D1B] tracking-tight">
              Founder: Gaurav Solanki
            </span>
            <span className="block font-mono-tech text-[10px] uppercase tracking-widest text-[#8C867E] mt-0.5">
              ZenVero Digital Press • Editorial Direction & Design
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
