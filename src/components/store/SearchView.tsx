import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, RotateCcw, BookOpen } from 'lucide-react';
import { CATEGORIES, Ebook, EbookCategory } from '../../data/ebooks';
import { Button, Select } from '../ui/Primitives';
import { EbookCard } from './StoreComponents';

interface SearchViewProps {
  ebooks: Ebook[];
  initialCategory?: EbookCategory | 'All';
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onViewDetails: (ebook: Ebook) => void;
  onBuyNow: (ebook: Ebook) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  ebooks,
  initialCategory = 'All',
  wishlistIds,
  onToggleWishlist,
  onViewDetails,
  onBuyNow,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [formatFilter, setFormatFilter] = useState<string>('all');

  const filteredBooks = useMemo(() => {
    return ebooks.filter((b) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.subtitle.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === 'All' || b.category === selectedCategory;

      const effectivePrice = b.salePrice ?? b.price;
      const matchesPrice =
        priceFilter === 'all' ||
        (priceFilter === 'under30' && effectivePrice < 30) ||
        (priceFilter === '30to35' && effectivePrice >= 30 && effectivePrice <= 35) ||
        (priceFilter === 'over35' && effectivePrice > 35);

      const matchesRating =
        ratingFilter === 'all' ||
        (ratingFilter === '4.8' && b.rating >= 4.8) ||
        (ratingFilter === '4.9' && b.rating >= 4.9);

      const matchesFormat =
        formatFilter === 'all' ||
        b.format.toLowerCase().includes(formatFilter.toLowerCase());

      return (
        matchesQuery &&
        matchesCategory &&
        matchesPrice &&
        matchesRating &&
        matchesFormat
      );
    });
  }, [ebooks, query, selectedCategory, priceFilter, ratingFilter, formatFilter]);

  const handleReset = () => {
    setQuery('');
    setSelectedCategory('All');
    setPriceFilter('all');
    setRatingFilter('all');
    setFormatFilter('all');
  };

  return (
    <div className="space-y-10">
      {/* Header & Large Inset Neumorphic Search Bar */}
      <div className="neu-chassis p-6 sm:p-10 space-y-6">
        <div className="max-w-2xl">
          <span className="font-mono-tech text-xs uppercase tracking-widest text-[#2A5C4D]">
            ZenVero Catalog Index
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#1E1D1B] mt-1">
            Search Practical Monographs
          </h1>
          <p className="text-sm text-[#5C5852] mt-1.5">
            Search across title, author, category, or technical topic.
          </p>
        </div>

        {/* Large Inset Neumorphic Search Input */}
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-[#2A5C4D] absolute left-5 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, category, or keyword (e.g., 'Agentic', 'Soren', 'Pricing', 'Calm')..."
            className="w-full neu-inset pl-14 pr-28 py-4 sm:py-5 text-base text-[#1E1D1B] placeholder-[#8C867E] focus:outline-none focus:ring-2 focus:ring-[#2A5C4D]/35"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-4 px-3 py-1.5 rounded-full neu-btn text-xs font-medium text-[#5C5852] cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Neumorphic Filter Panel */}
        <div className="pt-2 border-t border-[#DED8CF] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <Select
            label="Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={[
              { value: 'All', label: 'All Categories' },
              ...CATEGORIES.map((c) => ({ value: c.name, label: c.name })),
            ]}
          />

          <Select
            label="Price Range"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            options={[
              { value: 'all', label: 'Any Price' },
              { value: 'under30', label: 'Under $30' },
              { value: '30to35', label: '$30 – $35' },
              { value: 'over35', label: 'Over $35' },
            ]}
          />

          <Select
            label="Minimum Rating"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Ratings' },
              { value: '4.8', label: '4.8+ Stars' },
              { value: '4.9', label: '4.9+ Stars' },
            ]}
          />

          <Select
            label="Edition Format"
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Formats' },
              { value: 'PDF', label: 'PDF Included' },
              { value: 'Notion', label: 'Includes Notion OS' },
              { value: 'Code', label: 'Includes Code Companion' },
            ]}
          />

          <div className="flex items-center gap-2">
            <Button
              variant="neu"
              size="md"
              onClick={handleReset}
              className="w-full"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-sm text-[#5C5852]">
          <SlidersHorizontal className="w-4 h-4 text-[#2A5C4D]" />
          <span>
            Showing <strong className="text-[#1E1D1B]">{filteredBooks.length}</strong> of{' '}
            {ebooks.length} digital editions
          </span>
        </div>
      </div>

      {/* Results Grid or Claymorphic Empty State */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((ebook) => (
            <EbookCard
              key={ebook.id}
              ebook={ebook}
              isWishlisted={wishlistIds.includes(ebook.id)}
              onToggleWishlist={onToggleWishlist}
              onViewDetails={onViewDetails}
              onBuyNow={onBuyNow}
            />
          ))}
        </div>
      ) : (
        <div className="clay-pedestal p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-[22px] clay-tile mx-auto flex items-center justify-center text-[#2A5C4D]">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="font-display font-bold text-xl text-[#1E1D1B]">
            No Matching Editions Found
          </h3>
          <p className="text-sm text-[#5C5852]">
            We couldn&apos;t find any eBooks matching your current search and filter criteria.
          </p>
          <Button variant="clay-primary" onClick={handleReset}>
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  );
};
