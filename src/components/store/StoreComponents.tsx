import React from 'react';
import {
  Star,
  Heart,
  Eye,
  ShoppingBag,
  Cpu,
  Briefcase,
  Compass,
  Megaphone,
  Layers,
  Landmark,
  Award,
  Flame,
  BookOpen,
} from 'lucide-react';
import { Ebook, EbookCategory } from '../../data/ebooks';
import { Button, EditorialBookCover } from '../ui/Primitives';

/* -------------------------------------------------------------------------- */
/*                        CLAYMORPHIC 3D HERO COMPOSITION                     */
/* -------------------------------------------------------------------------- */
interface ClayBookVisualProps {
  featuredBooks: Ebook[];
  activeHeroBook: Ebook;
  onSelectHeroBook: (book: Ebook) => void;
  onOpenDetails: (book: Ebook) => void;
  onBuyNow: (book: Ebook) => void;
}

export const ClayBookVisual: React.FC<ClayBookVisualProps> = ({
  featuredBooks,
  activeHeroBook,
  onSelectHeroBook,
  onOpenDetails,
  onBuyNow,
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center py-4 px-2 sm:px-6 select-none">
      {/* Main Soft Claymorphic Pedestal */}
      <div className="relative w-full max-w-[490px] clay-pedestal p-6 sm:p-9 flex flex-col items-center">
        {/* Floating Claymorphic Decorative Bookmark Pill (Top Left) */}
        <div className="hidden sm:flex items-center gap-2 clay-tile px-3.5 py-2 absolute -top-4 -left-4 z-20 animate-clay-float">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2A5C4D]" />
          <span className="font-mono-tech text-[11px] font-medium text-[#1E1D1B]">
            CURATED EDITION
          </span>
        </div>

        {/* Floating Claymorphic Rating Pebble (Top Right) */}
        <div className="flex items-center gap-1.5 clay-tile px-3.5 py-2 absolute -top-3 right-4 sm:-right-4 z-20 animate-clay-float-delayed">
          <Star className="w-3.5 h-3.5 fill-[#C27D38] text-[#C27D38]" />
          <span className="font-mono-tech text-xs font-semibold text-[#1E1D1B]">
            {activeHeroBook.rating.toFixed(1)}
          </span>
          <span className="text-[11px] text-[#8C867E]">
            ({activeHeroBook.reviewsCount})
          </span>
        </div>

        {/* Background Secondary Soft Floating Book Slab */}
        <div
          aria-hidden="true"
          className="hidden sm:block absolute top-14 right-9 w-[220px] h-[295px] rounded-[22px] opacity-70 pointer-events-none"
          style={{
            background: 'linear-gradient(145deg, #F6F2EC 0%, #E5DFD5 100%)',
            boxShadow:
              '12px 14px 26px rgba(175, 167, 155, 0.35), inset 2px 2px 5px rgba(255, 255, 255, 0.85)',
            transform: 'rotate(5.5deg) translateX(18px)',
          }}
        />

        {/* Primary Editable Ebook Cover in Claymorphic Frame */}
        <div
          onClick={() => onOpenDetails(activeHeroBook)}
          className="relative z-10 cursor-pointer group transition-transform duration-300 hover:-translate-y-1.5"
        >
          <EditorialBookCover ebook={activeHeroBook} size="hero" />
        </div>

        {/* Floating Claymorphic Meta Strip at Base of Pedestal */}
        <div className="relative z-20 w-full mt-6 neu-card p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[#2A5C4D] block">
              {activeHeroBook.category} • {activeHeroBook.pages} Pages
            </span>
            <p className="font-display font-bold text-sm text-[#1E1D1B] truncate">
              {activeHeroBook.title}
            </p>
            <p className="text-xs text-[#5C5852] truncate">by {activeHeroBook.author}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right mr-1">
              {activeHeroBook.salePrice ? (
                <div className="flex flex-col items-end">
                  <span className="text-[10px] line-through text-[#8C867E] font-mono-tech">
                    ${activeHeroBook.price}
                  </span>
                  <span className="font-display font-bold text-base text-[#2A5C4D]">
                    ${activeHeroBook.salePrice}
                  </span>
                </div>
              ) : (
                <span className="font-display font-bold text-base text-[#2A5C4D]">
                  ${activeHeroBook.price}
                </span>
              )}
            </div>
            <Button
              variant="clay-primary"
              size="sm"
              onClick={() => onBuyNow(activeHeroBook)}
            >
              Buy Edition
            </Button>
          </div>
        </div>

        {/* Tactile Switcher Dots to Inspect Different Editions on the Pedestal */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[#8C867E] mr-1">
            Inspect Shelf:
          </span>
          {featuredBooks.slice(0, 4).map((book, idx) => {
            const active = book.id === activeHeroBook.id;
            return (
              <button
                key={book.id}
                type="button"
                onClick={() => onSelectHeroBook(book)}
                className={`px-2.5 py-1 rounded-full font-mono-tech text-[10px] transition-all cursor-pointer ${
                  active
                    ? 'neu-pill-active text-[#2A5C4D] font-bold'
                    : 'neu-pill text-[#5C5852] hover:text-[#1E1D1B]'
                }`}
              >
                0{idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                        HYBRID FEATURED / EBOOK CARD                        */
/* -------------------------------------------------------------------------- */
interface EbookCardProps {
  ebook: Ebook;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onViewDetails: (ebook: Ebook) => void;
  onBuyNow: (ebook: Ebook) => void;
  onAddToCart?: (ebook: Ebook) => void;
}

export const EbookCard: React.FC<EbookCardProps> = ({
  ebook,
  isWishlisted,
  onToggleWishlist,
  onViewDetails,
  onBuyNow,
}) => {
  const effectivePrice = ebook.salePrice ?? ebook.price;

  return (
    <article className="neu-card neu-card-interactive p-5 flex flex-col justify-between h-full group relative">
      <div>
        {/* Top Metadata & Wishlist Tactile Button */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className="px-3 py-1 rounded-full neu-inset-sm text-[11px] font-medium text-[#2A5C4D]">
            {ebook.category}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(ebook.id);
            }}
            aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all ${
              isWishlisted
                ? 'neu-pill-active text-[#B84A39]'
                : 'neu-pill text-[#8C867E] hover:text-[#1E1D1B]'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${isWishlisted ? 'fill-[#B84A39] text-[#B84A39]' : ''}`}
            />
          </button>
        </div>

        {/* Claymorphic Elevated Ebook Cover Container */}
        <div
          onClick={() => onViewDetails(ebook)}
          className="cursor-pointer mb-4"
        >
          <EditorialBookCover ebook={ebook} size="md" />
        </div>

        {/* Rating & Page Count */}
        <div className="flex items-center justify-between text-xs text-[#5C5852] mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-[#C27D38] text-[#C27D38]" />
            <span className="font-semibold text-[#1E1D1B]">{ebook.rating.toFixed(1)}</span>
            <span className="text-[#8C867E]">({ebook.reviewsCount})</span>
          </div>
          <span className="font-mono-tech text-[11px] text-[#8C867E] flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {ebook.pages}p
          </span>
        </div>

        {/* Title & Author */}
        <h3
          onClick={() => onViewDetails(ebook)}
          className="font-display font-bold text-lg text-[#1E1D1B] leading-snug hover:text-[#2A5C4D] transition-colors cursor-pointer line-clamp-1"
        >
          {ebook.title}
        </h3>
        <p className="text-xs font-medium text-[#8C867E] mt-0.5 mb-2">
          by {ebook.author}
        </p>

        {/* Short Description */}
        <p className="text-xs text-[#5C5852] leading-relaxed line-clamp-2 mb-4">
          {ebook.description}
        </p>
      </div>

      {/* Bottom Price & Action Bar */}
      <div className="pt-3.5 border-t border-[#DED8CF]/80 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-mono-tech uppercase text-[#8C867E] block">
            Digital Edition
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-bold text-lg text-[#2A5C4D]">
              ${effectivePrice}
            </span>
            {ebook.salePrice && (
              <span className="text-xs line-through text-[#8C867E] font-mono-tech">
                ${ebook.price}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="neu"
            size="sm"
            onClick={() => onViewDetails(ebook)}
            title="View Edition Details"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </Button>
          <Button
            variant="clay-primary"
            size="sm"
            onClick={() => onBuyNow(ebook)}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Buy Now</span>
          </Button>
        </div>
      </div>
    </article>
  );
};

/* -------------------------------------------------------------------------- */
/*                     CLAYMORPHIC 3D CATEGORY OBJECT CARD                    */
/* -------------------------------------------------------------------------- */
const CATEGORY_ICONS: Record<EbookCategory, React.ReactNode> = {
  'AI & Technology': <Cpu className="w-5 h-5" />,
  Business: <Briefcase className="w-5 h-5" />,
  'Side Hustles': <Compass className="w-5 h-5" />,
  Marketing: <Megaphone className="w-5 h-5" />,
  Productivity: <Layers className="w-5 h-5" />,
  Finance: <Landmark className="w-5 h-5" />,
  Career: <Award className="w-5 h-5" />,
  Entrepreneurship: <Flame className="w-5 h-5" />,
};

interface CategoryCardProps {
  name: EbookCategory;
  tagline: string;
  count: number;
  isSelected?: boolean;
  onSelect: (category: EbookCategory) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  tagline,
  count,
  isSelected = false,
  onSelect,
}) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(name)}
      className={`text-left p-6 clay-tile flex flex-col justify-between cursor-pointer group ${
        isSelected ? 'ring-2 ring-[#2A5C4D]' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-5">
        {/* Sculpted 3D Clay Icon Pebble */}
        <div
          className={`w-12 h-12 rounded-[16px] flex items-center justify-center transition-colors ${
            isSelected
              ? 'clay-cta text-white'
              : 'neu-inset-sm text-[#2A5C4D] group-hover:bg-[#2A5C4D] group-hover:text-white'
          }`}
        >
          {CATEGORY_ICONS[name]}
        </div>
        <span className="font-mono-tech text-[11px] px-2.5 py-1 rounded-full neu-inset-sm text-[#5C5852]">
          {count} {count === 1 ? 'Book' : 'Books'}
        </span>
      </div>

      <div>
        <h3 className="font-display font-bold text-base text-[#1E1D1B] group-hover:text-[#2A5C4D] transition-colors">
          {name}
        </h3>
        <p className="text-xs text-[#5C5852] mt-1.5 leading-relaxed line-clamp-2">
          {tagline}
        </p>
      </div>
    </button>
  );
};

/* -------------------------------------------------------------------------- */
/*                         BOOKSTORE BEST SELLER CARD                         */
/* -------------------------------------------------------------------------- */
interface BestSellerCardProps {
  ebook: Ebook;
  rank: number;
  onViewDetails: (ebook: Ebook) => void;
  onBuyNow: (ebook: Ebook) => void;
}

export const BestSellerCard: React.FC<BestSellerCardProps> = ({
  ebook,
  rank,
  onViewDetails,
  onBuyNow,
}) => {
  const effectivePrice = ebook.salePrice ?? ebook.price;

  return (
    <div className="neu-card neu-card-interactive p-5 flex items-center gap-5 relative">
      {/* Ranking Badge */}
      <div className="w-11 h-11 rounded-full clay-tile flex items-center justify-center shrink-0 font-display font-extrabold text-sm text-[#2A5C4D]">
        0{rank}
      </div>

      {/* Subtle Claymorphic Ebook Cover Thumbnail */}
      <div
        onClick={() => onViewDetails(ebook)}
        className="cursor-pointer shrink-0"
      >
        <EditorialBookCover ebook={ebook} size="sm" />
      </div>

      {/* Product Metadata */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[#2A5C4D]">
            {ebook.category}
          </span>
          <span className="text-[#8C867E]">•</span>
          <span className="flex items-center gap-1 text-xs font-semibold text-[#1E1D1B]">
            <Star className="w-3 h-3 fill-[#C27D38] text-[#C27D38]" />
            {ebook.rating.toFixed(1)}
          </span>
        </div>

        <h4
          onClick={() => onViewDetails(ebook)}
          className="font-display font-bold text-base text-[#1E1D1B] hover:text-[#2A5C4D] cursor-pointer truncate"
        >
          {ebook.title}
        </h4>
        <p className="text-xs text-[#5C5852] truncate mb-3">by {ebook.author}</p>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-bold text-base text-[#2A5C4D]">
              ${effectivePrice}
            </span>
            {ebook.salePrice && (
              <span className="text-xs line-through text-[#8C867E] font-mono-tech">
                ${ebook.price}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="neu"
              size="sm"
              onClick={() => onViewDetails(ebook)}
            >
              Inspect
            </Button>
            <Button
              variant="clay-primary"
              size="sm"
              onClick={() => onBuyNow(ebook)}
            >
              Buy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
