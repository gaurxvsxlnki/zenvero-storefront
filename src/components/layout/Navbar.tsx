import React, { useState } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  BookOpen,
  User,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export type PageView =
  | 'home'
  | 'categories'
  | 'bestsellers'
  | 'newreleases'
  | 'details'
  | 'search'
  | 'wishlist'
  | 'cart'
  | 'checkout'
  | 'success'
  | 'library'
  | 'account'
  | 'admin';

interface NavbarProps {
  currentView: PageView;
  onNavigate: (view: PageView, sectionId?: string) => void;
  cartCount: number;
  wishlistCount: number;
  libraryCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  cartCount,
  wishlistCount,
  libraryCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const centerLinks: { label: string; view: PageView; sectionId?: string }[] = [
    { label: 'Store', view: 'home' },
    { label: 'Categories', view: 'categories', sectionId: 'categories-section' },
    { label: 'Best Sellers', view: 'bestsellers', sectionId: 'bestsellers-section' },
    { label: 'New Releases', view: 'newreleases', sectionId: 'newreleases-section' },
  ];

  const handleNavClick = (view: PageView, sectionId?: string) => {
    setMobileMenuOpen(false);
    onNavigate(view, sectionId);
  };

  return (
    <header className="sticky top-0 z-40 px-4 sm:px-6 lg:px-10 pt-4 pb-2 bg-[#F3EFEA]/90 backdrop-blur-sm">
      <nav
        aria-label="Primary Bookstore Navigation"
        className="max-w-[1360px] mx-auto neu-chassis px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4"
      >
        {/* LEFT: ZenVero Brand Logo */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group cursor-pointer shrink-0"
        >
          <div className="w-10 h-10 rounded-[14px] clay-cta flex items-center justify-center shadow-sm">
            <span className="font-display font-extrabold text-lg tracking-tighter text-white">
              ZV
            </span>
          </div>
          <div>
            <span className="font-display font-bold text-xl tracking-tight text-[#1E1D1B] block leading-none">
              ZenVero
            </span>
            <span className="text-[10px] font-mono-tech uppercase tracking-widest text-[#8C867E] hidden sm:block mt-1">
              Digital Editions
            </span>
          </div>
        </button>

        {/* CENTER: Desktop Navigation Pills */}
        <div className="hidden lg:flex items-center gap-2 neu-inset-sm p-1.5 rounded-full">
          {centerLinks.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavClick(item.view, item.sectionId)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'neu-pill-active text-[#2A5C4D] shadow-inner'
                    : 'text-[#5C5852] hover:text-[#1E1D1B]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* RIGHT: Desktop Tactile Utility Controls */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Search */}
          <button
            type="button"
            onClick={() => handleNavClick('search')}
            title="Search Catalog"
            className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${
              currentView === 'search'
                ? 'neu-pill-active text-[#2A5C4D]'
                : 'neu-pill text-[#5C5852] hover:text-[#1E1D1B]'
            }`}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Wishlist */}
          <button
            type="button"
            onClick={() => handleNavClick('wishlist')}
            title="Saved Wishlist"
            className={`relative w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${
              currentView === 'wishlist'
                ? 'neu-pill-active text-[#2A5C4D]'
                : 'neu-pill text-[#5C5852] hover:text-[#1E1D1B]'
            }`}
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#2A5C4D] text-white text-[10px] font-bold flex items-center justify-center shadow">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            type="button"
            onClick={() => handleNavClick('cart')}
            title="Shopping Bag"
            className={`relative w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${
              currentView === 'cart' || currentView === 'checkout'
                ? 'neu-pill-active text-[#2A5C4D]'
                : 'neu-pill text-[#5C5852] hover:text-[#1E1D1B]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#2A5C4D] text-white text-[10px] font-bold flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </button>

          {/* My Library */}
          <button
            type="button"
            onClick={() => handleNavClick('library')}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              currentView === 'library'
                ? 'neu-pill-active text-[#2A5C4D]'
                : 'neu-pill text-[#5C5852] hover:text-[#1E1D1B]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#2A5C4D]" />
            <span>My Library</span>
            {libraryCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#E1ECE8] text-[#2A5C4D] font-mono-tech text-[10px]">
                {libraryCount}
              </span>
            )}
          </button>

          {/* Account */}
          <button
            type="button"
            onClick={() => handleNavClick('account')}
            title="Account & Settings"
            className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${
              currentView === 'account'
                ? 'neu-pill-active text-[#2A5C4D]'
                : 'neu-pill text-[#5C5852] hover:text-[#1E1D1B]'
            }`}
          >
            <User className="w-4 h-4" />
          </button>

          {/* Separate /admin Workspace Switcher */}
          <button
            type="button"
            onClick={() => handleNavClick('admin')}
            title="Admin Studio (/admin)"
            className={`px-3 py-2 rounded-full text-xs font-mono-tech flex items-center gap-1.5 cursor-pointer ${
              currentView === 'admin'
                ? 'clay-cta text-white'
                : 'neu-pill text-[#5C5852] hover:text-[#2A5C4D]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">/admin</span>
          </button>

        </div>

        {/* MOBILE CONTROLS: Search, Cart, Hamburger Menu */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => handleNavClick('search')}
            aria-label="Search"
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentView === 'search' ? 'neu-pill-active text-[#2A5C4D]' : 'neu-pill text-[#5C5852]'
            }`}
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('cart')}
            aria-label="Cart"
            className={`relative w-10 h-10 rounded-full flex items-center justify-center ${
              currentView === 'cart' ? 'neu-pill-active text-[#2A5C4D]' : 'neu-pill text-[#5C5852]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2A5C4D] text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            className="w-10 h-10 rounded-full neu-pill flex items-center justify-center text-[#1E1D1B]"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="max-w-[1360px] mx-auto mt-3 neu-card p-5 md:hidden space-y-4 border border-white">
          <div className="flex items-center justify-between pb-3 border-b border-[#DED8CF]">
            <span className="text-xs font-mono-tech uppercase tracking-widest text-[#8C867E]">
              Practical knowledge. Beautifully packaged.
            </span>
            <Sparkles className="w-4 h-4 text-[#2A5C4D]" />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {centerLinks.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavClick(item.view, item.sectionId)}
                className={`px-4 py-3 rounded-[16px] text-left text-sm font-semibold ${
                  currentView === item.view
                    ? 'neu-pill-active text-[#2A5C4D]'
                    : 'neu-btn text-[#1E1D1B]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#DED8CF]">
            <button
              type="button"
              onClick={() => handleNavClick('wishlist')}
              className="px-4 py-2.5 rounded-[14px] neu-btn text-xs font-semibold flex items-center justify-between"
            >
              <span>Wishlist</span>
              <span className="font-mono-tech text-[#2A5C4D]">({wishlistCount})</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('library')}
              className="px-4 py-2.5 rounded-[14px] neu-btn text-xs font-semibold flex items-center justify-between"
            >
              <span>My Library</span>
              <span className="font-mono-tech text-[#2A5C4D]">({libraryCount})</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('account')}
              className="px-4 py-2.5 rounded-[14px] neu-btn text-xs font-semibold flex items-center gap-2"
            >
              <User className="w-3.5 h-3.5" />
              <span>Account</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              className="px-4 py-2.5 rounded-[14px] clay-cta text-xs font-semibold flex items-center gap-2 text-white"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Studio</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
