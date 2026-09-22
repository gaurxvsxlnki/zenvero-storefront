import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  Heart,
  ShoppingBag,
  BookOpen,
  FileText,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Ebook } from '../../data/ebooks';
import { Accordion, Button, EditorialBookCover } from '../ui/Primitives';
import { EbookCard } from './StoreComponents';

interface EbookDetailsViewProps {
  ebook: Ebook;
  allEbooks: Ebook[];
  isWishlisted: boolean;
  wishlistIds: string[];
  isOwned: boolean;
  onBack: () => void;
  onAddToCart: (ebook: Ebook) => void;
  onBuyNow: (ebook: Ebook) => void;
  onToggleWishlist: (id: string) => void;
  onSelectEbook: (ebook: Ebook) => void;
  onGoToLibrary: () => void;
}

export const EbookDetailsView: React.FC<EbookDetailsViewProps> = ({
  ebook,
  allEbooks,
  isWishlisted,
  wishlistIds,
  isOwned,
  onBack,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  onSelectEbook,
  onGoToLibrary,
}) => {
  const [activeSpreadIndex, setActiveSpreadIndex] = useState(0);
  const effectivePrice = ebook.salePrice ?? ebook.price;

  const relatedEbooks = allEbooks
    .filter((b) => b.id !== ebook.id && (b.category === ebook.category || b.featured))
    .slice(0, 4);

  const spreads =
    ebook.preview && ebook.preview.length > 0
      ? ebook.preview
      : [
          { pageNumber: 1, image: '/previews/demo/preview-1.jpg' },
          { pageNumber: 2, image: '/previews/demo/preview-2.jpg' },
          { pageNumber: 3, image: '/previews/demo/preview-3.jpg' },
        ];

  const currentSpread = spreads[activeSpreadIndex] || spreads[0];

  const accordionItems = (ebook.chapters || []).map((ch, idx) => ({
    id: `${ebook.id}-ch-${idx}`,
    badge: `CH ${ch.number}`,
    title: ch.title,
    meta: ch.pages,
    content: ch.summary,
  }));

  return (
    <div className="space-y-16">
      {/* Top Back Navigation */}
      <div>
        <Button variant="neu" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bookstore</span>
        </Button>
      </div>

      {/* MAIN PRODUCT TOP SECTION: LEFT CLAYMORPHIC FRAME / RIGHT DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* LEFT: Large Ebook Cover inside a Soft Claymorphic Pedestal Frame */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full clay-pedestal p-8 sm:p-10 flex flex-col items-center relative">
            <div className="flex items-center gap-2 clay-tile px-3.5 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#2A5C4D]" />
              <span className="font-mono-tech text-[11px] text-[#1E1D1B] uppercase">
                Tactile Digital Monograph
              </span>
            </div>

            <EditorialBookCover ebook={ebook} size="lg" />

            <div className="mt-7 w-full neu-inset-sm p-4 flex items-center justify-between text-xs text-[#5C5852]">
              <span className="font-mono-tech">FORMAT: {ebook.format}</span>
              <span className="font-mono-tech text-[#2A5C4D] font-semibold">
                {ebook.pages} PAGES
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Editorial Metadata, Specs, Price & Tactile Actions */}
        <div className="lg:col-span-7 neu-card p-6 sm:p-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="px-3.5 py-1.5 rounded-full neu-inset-sm text-xs font-semibold text-[#2A5C4D]">
              {ebook.category}
            </span>

            <div className="flex items-center gap-1.5 neu-inset-sm px-3.5 py-1.5 rounded-full text-xs">
              <Star className="w-3.5 h-3.5 fill-[#C27D38] text-[#C27D38]" />
              <span className="font-bold text-[#1E1D1B]">{ebook.rating.toFixed(1)}</span>
              <span className="text-[#8C867E]">({ebook.reviewsCount} verified readers)</span>
            </div>
          </div>

          <div>
            <h1 className="font-display font-bold text-2xl sm:text-4xl text-[#1E1D1B] leading-tight">
              {ebook.title}
            </h1>
            <p className="text-base sm:text-lg text-[#5C5852] mt-2 font-normal leading-relaxed">
              {ebook.subtitle}
            </p>
          </div>

          {/* Author & Edition Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            <div className="neu-inset-sm p-3.5">
              <span className="text-[10px] font-mono-tech uppercase text-[#8C867E] block">
                Author
              </span>
              <p className="font-display font-semibold text-sm text-[#1E1D1B] mt-0.5">
                {ebook.author}
              </p>
              <p className="text-[11px] text-[#5C5852] line-clamp-1">{ebook.authorRole}</p>
            </div>
            <div className="neu-inset-sm p-3.5">
              <span className="text-[10px] font-mono-tech uppercase text-[#8C867E] block">
                Length & Layout
              </span>
              <p className="font-display font-semibold text-sm text-[#1E1D1B] mt-0.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#2A5C4D]" />
                <span>{ebook.pages} Pages</span>
              </p>
              <p className="text-[11px] text-[#5C5852]">Typeset for Screen & Print</p>
            </div>
            <div className="neu-inset-sm p-3.5">
              <span className="text-[10px] font-mono-tech uppercase text-[#8C867E] block">
                Included Files
              </span>
              <p className="font-display font-semibold text-sm text-[#1E1D1B] mt-0.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#2A5C4D]" />
                <span className="truncate">{ebook.format}</span>
              </p>
              <p className="text-[11px] text-[#5C5852]">DRM-Free Instant Vault</p>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-sm sm:text-base text-[#5C5852] leading-relaxed">
            {ebook.description}
          </p>

          {/* Price & CTA Box */}
          <div className="neu-inset p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <span className="text-[10px] font-mono-tech uppercase tracking-widest text-[#8C867E] block">
                Complete Digital Edition
              </span>
              <div className="flex items-baseline gap-2.5 mt-1">
                <span className="font-display font-extrabold text-3xl text-[#2A5C4D]">
                  ${effectivePrice}
                </span>
                {ebook.salePrice && (
                  <>
                    <span className="text-sm line-through text-[#8C867E] font-mono-tech">
                      ${ebook.price}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#E1ECE8] text-[#2A5C4D] text-[10px] font-mono-tech font-semibold">
                      SAVE ${ebook.price - ebook.salePrice}
                    </span>
                  </>
                )}
              </div>
            </div>

            {isOwned ? (
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="clay-primary" size="lg" onClick={onGoToLibrary}>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>In Your Library — Read / Download</span>
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="neu"
                  size="lg"
                  onClick={() => onAddToCart(ebook)}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </Button>

                <Button
                  variant="clay-primary"
                  size="lg"
                  onClick={() => onBuyNow(ebook)}
                >
                  <span>Buy Now</span>
                </Button>

                <button
                  type="button"
                  onClick={() => onToggleWishlist(ebook.id)}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
                  className={`w-12 h-12 rounded-[18px] flex items-center justify-center cursor-pointer transition-all ${
                    isWishlisted
                      ? 'neu-pill-active text-[#B84A39]'
                      : 'neu-btn text-[#5C5852] hover:text-[#1E1D1B]'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isWishlisted ? 'fill-[#B84A39] text-[#B84A39]' : ''
                    }`}
                  />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-[#8C867E]">
            <ShieldCheck className="w-4 h-4 text-[#2A5C4D]" />
            <span>
              Protected digital fulfillment. Lifetime updates included in your ZenVero Library.
            </span>
          </div>
        </div>
      </div>

      {/* BELOW SECTIONS: ABOUT, WHAT'S INSIDE (ACCORDION), WHO IS THIS FOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left 7 Cols: About This eBook + What's Inside */}
        <div className="lg:col-span-7 space-y-10">
          {/* About This eBook */}
          <section className="neu-card p-6 sm:p-8 space-y-4">
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#2A5C4D]">
              01 / Editorial Synopsis
            </span>
            <h2 className="font-display font-bold text-2xl text-[#1E1D1B]">
              About This eBook
            </h2>
            <p className="text-sm sm:text-base text-[#5C5852] leading-relaxed">
              {ebook.longDescription || ebook.description}
            </p>
          </section>

          {/* What's Inside (Neumorphic Accordion) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono-tech text-xs uppercase tracking-widest text-[#2A5C4D]">
                  02 / Table of Contents
                </span>
                <h2 className="font-display font-bold text-2xl text-[#1E1D1B] mt-1">
                  What&apos;s Inside
                </h2>
              </div>
              <span className="font-mono-tech text-xs text-[#8C867E]">
                {accordionItems.length} Core Modules
              </span>
            </div>

            {accordionItems.length > 0 ? (
              <Accordion items={accordionItems} />
            ) : (
              <div className="neu-inset p-6 text-sm text-[#5C5852]">
                Complete {ebook.pages}-page monograph with tactical templates and reference sheets.
              </div>
            )}
          </section>
        </div>

        {/* Right 5 Cols: Who Is This For? */}
        <div className="lg:col-span-5 space-y-6">
          <section className="clay-pedestal p-6 sm:p-8 space-y-5">
            <div>
              <span className="font-mono-tech text-xs uppercase tracking-widest text-[#2A5C4D]">
                03 / Reader Fit
              </span>
              <h2 className="font-display font-bold text-2xl text-[#1E1D1B] mt-1">
                Who Is This For?
              </h2>
            </div>

            <div className="space-y-3.5">
              {(ebook.whoIsThisFor && ebook.whoIsThisFor.length > 0
                ? ebook.whoIsThisFor
                : [
                    'Practitioners seeking structured, high-leverage operating frameworks',
                    'Builders who prefer dense written monographs over fluff',
                    'Leaders upgrading their team workflows and decision architecture',
                  ]
              ).map((persona, i) => (
                <div
                  key={i}
                  className="neu-card p-4 flex items-start gap-3.5"
                >
                  <span className="w-6 h-6 rounded-full bg-[#2A5C4D] text-white text-xs font-mono-tech flex items-center justify-center shrink-0 mt-0.5">
                    0{i + 1}
                  </span>
                  <p className="text-sm text-[#1E1D1B] leading-relaxed">{persona}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* INTERACTIVE SAMPLE PREVIEW SECTION */}
      <section className="neu-chassis p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD7CE] pb-5">
          <div>
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#2A5C4D]">
              04 / Interactive Excerpt
            </span>
            <h2 className="font-display font-bold text-2xl text-[#1E1D1B] mt-1">
              Preview Sample Pages Before Purchase
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="neu"
              size="sm"
              disabled={activeSpreadIndex === 0}
              onClick={() => setActiveSpreadIndex((prev) => Math.max(0, prev - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev Excerpt</span>
            </Button>
            <span className="font-mono-tech text-xs px-3 py-1.5 neu-inset-sm text-[#1E1D1B]">
              Sample {activeSpreadIndex + 1} / {spreads.length}
            </span>
            <Button
              variant="neu"
              size="sm"
              disabled={activeSpreadIndex === spreads.length - 1}
              onClick={() =>
                setActiveSpreadIndex((prev) => Math.min(spreads.length - 1, prev + 1))
              }
            >
              <span>Next Excerpt</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Sample Page Spread Display — rendered as a JPG preview image */}
        <div className="clay-pedestal p-6 sm:p-10 max-w-4xl mx-auto">
          <div className="flex items-center justify-between text-xs font-mono-tech text-[#8C867E] pb-4 mb-6 border-b border-[#DED8CF]">
            <span className="uppercase tracking-widest">ZenVero Sample Preview</span>
            <span>PAGE {currentSpread.pageNumber}</span>
          </div>

          {/* Framed preview page — image keeps its native aspect ratio, never stretched */}
          <figure className="neu-inset p-3 sm:p-5 m-0">
            <div className="rounded-[14px] overflow-hidden bg-[#DCD5CA]/60 border border-white/70 shadow-inner flex items-center justify-center min-h-[280px] sm:min-h-[400px]">
              <img
                src={currentSpread.image}
                alt={`${ebook.title} — sample preview page ${currentSpread.pageNumber}`}
                loading="lazy"
                className="block w-auto h-auto max-w-full max-h-[62vh] sm:max-h-[70vh] object-contain rounded-[10px] select-none"
              />
            </div>
            <figcaption className="pt-3 text-center font-mono-tech text-[11px] text-[#8C867E]">
              Sample page {activeSpreadIndex + 1} of {spreads.length} • {ebook.format}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* RELATED EBOOKS */}
      {relatedEbooks.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="font-mono-tech text-xs uppercase tracking-widest text-[#2A5C4D]">
                05 / Companion Reading
              </span>
              <h2 className="font-display font-bold text-2xl text-[#1E1D1B] mt-1">
                Related eBooks
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedEbooks.map((rel) => (
              <EbookCard
                key={rel.id}
                ebook={rel}
                isWishlisted={wishlistIds.includes(rel.id)}
                onToggleWishlist={onToggleWishlist}
                onViewDetails={onSelectEbook}
                onBuyNow={onBuyNow}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
