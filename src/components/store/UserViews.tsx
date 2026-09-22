import React, { useState } from 'react';
import {
  BookOpen,
  Download,
  Eye,
  Calendar,
  User,
  FileText,
  History,
  Settings,
  LogOut,
  Heart,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Ebook, OrderRecord } from '../../data/ebooks';
import { Button, EditorialBookCover, Input, Modal } from '../ui/Primitives';
import { EbookCard } from './StoreComponents';

/* -------------------------------------------------------------------------- */
/*                                MY LIBRARY VIEW                             */
/* -------------------------------------------------------------------------- */
interface LibraryItem {
  ebook: Ebook;
  purchaseDate: string;
  orderId: string;
}

interface LibraryViewProps {
  libraryItems: LibraryItem[];
  onDownloadBook: (ebook: Ebook) => void;
  onExploreStore: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  libraryItems,
  onDownloadBook,
  onExploreStore,
}) => {
  const [readerBook, setReaderBook] = useState<Ebook | null>(null);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-mono-tech text-xs uppercase tracking-widest text-[#2A5C4D]">
            Personal Digital Vault
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#1E1D1B] mt-1">
            My Library
          </h1>
          <p className="text-sm text-[#5C5852] mt-1">
            All purchased ZenVero editions with lifetime DRM-free access and instant downloads.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 neu-inset-sm px-4 py-2 text-xs font-mono-tech text-[#2A5C4D]">
          <ShieldCheck className="w-4 h-4" />
          <span>{libraryItems.length} VERIFIED EDITIONS OWNED</span>
        </div>
      </div>

      {libraryItems.length === 0 ? (
        <div className="clay-pedestal p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-[22px] clay-tile mx-auto flex items-center justify-center text-[#2A5C4D]">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="font-display font-bold text-xl text-[#1E1D1B]">
            Your Library Shelf Awaits
          </h3>
          <p className="text-sm text-[#5C5852]">
            Purchased eBooks appear here immediately after checkout for reading and download.
          </p>
          <Button variant="clay-primary" onClick={onExploreStore}>
            Browse Bookstore
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {libraryItems.map(({ ebook, purchaseDate, orderId }) => (
            <article
              key={ebook.id}
              className="neu-card neu-card-interactive p-5 flex flex-col justify-between gap-5"
            >
              <div className="flex items-start gap-4">
                <EditorialBookCover ebook={ebook} size="sm" className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono-tech uppercase text-[#2A5C4D] bg-[#E1ECE8] px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Unlocked
                  </span>
                  <h3 className="font-display font-bold text-base sm:text-lg text-[#1E1D1B] mt-1.5 line-clamp-2">
                    {ebook.title}
                  </h3>
                  <p className="text-xs text-[#5C5852] mt-0.5">by {ebook.author}</p>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono-tech text-[#8C867E] mt-2">
                    <Calendar className="w-3 h-3" />
                    <span>Purchased {purchaseDate}</span>
                  </div>
                  <p className="text-[10px] font-mono-tech text-[#8C867E] mt-0.5">
                    Ref: {orderId} • {ebook.format}
                  </p>
                </div>
              </div>

              <div className="pt-3.5 border-t border-[#DED8CF] grid grid-cols-2 gap-3">
                <Button
                  variant="neu"
                  size="sm"
                  onClick={() => setReaderBook(ebook)}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Read Preview</span>
                </Button>
                <Button
                  variant="clay-primary"
                  size="sm"
                  onClick={() => onDownloadBook(ebook)}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Read Preview Modal */}
      <Modal
        isOpen={!!readerBook}
        onClose={() => setReaderBook(null)}
        title={readerBook ? readerBook.title : 'Edition Reader'}
        subtitle={readerBook ? `by ${readerBook.author} • ${readerBook.pages} Pages` : ''}
      >
        {readerBook && (
          <div className="space-y-6">
            <div className="clay-pedestal p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono-tech text-[#8C867E] pb-3 border-b border-[#DED8CF]">
                <span>{readerBook.preview?.[0]?.chapterTitle || 'Chapter 01'}</span>
                <span>ZENVERO WEB READER</span>
              </div>
              <h4 className="font-display font-bold text-xl text-[#1E1D1B]">
                {readerBook.preview?.[0]?.heading || readerBook.subtitle}
              </h4>
              <p className="text-sm sm:text-base text-[#5C5852] leading-relaxed">
                {readerBook.preview?.[0]?.content || readerBook.longDescription}
              </p>
              {readerBook.preview?.[0]?.keyTakeaway && (
                <div className="neu-inset p-4 border-l-4 border-l-[#2A5C4D]">
                  <span className="text-[10px] font-mono-tech uppercase text-[#2A5C4D] block mb-1">
                    Key Takeaway
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-[#1E1D1B]">
                    {readerBook.preview[0].keyTakeaway}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button variant="neu" onClick={() => setReaderBook(null)}>
                Close Reader
              </Button>
              <Button
                variant="clay-primary"
                onClick={() => onDownloadBook(readerBook)}
              >
                <Download className="w-4 h-4" />
                <span>Download Full PDF ({readerBook.pages}p)</span>
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 ACCOUNT VIEW                               */
/* -------------------------------------------------------------------------- */
interface AccountViewProps {
  userProfile: { name: string; email: string; role: string };
  onUpdateProfile: (name: string, email: string) => void;
  orders: OrderRecord[];
  libraryItems: LibraryItem[];
  downloadHistory: { title: string; timestamp: string; format: string }[];
  onDownloadBook: (ebook: Ebook) => void;
  onLogout: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  userProfile,
  onUpdateProfile,
  orders,
  libraryItems,
  downloadHistory,
  onDownloadBook,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<
    'profile' | 'orders' | 'purchased' | 'downloads' | 'settings'
  >('profile');
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', icon: <FileText className="w-4 h-4" /> },
    { id: 'purchased', label: 'Purchased eBooks', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'downloads', label: 'Download History', icon: <History className="w-4 h-4" /> },
    { id: 'settings', label: 'Account Settings', icon: <Settings className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono-tech text-xs uppercase tracking-widest text-[#2A5C4D]">
            Patron Account
          </span>
          <h1 className="font-display font-bold text-3xl text-[#1E1D1B] mt-1">
            {userProfile.name}
          </h1>
          <p className="text-xs font-mono-tech text-[#8C867E]">{userProfile.email}</p>
        </div>

        <Button variant="neu" size="sm" onClick={onLogout}>
          <LogOut className="w-4 h-4 text-[#B84A39]" />
          <span>Logout Session</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Navigation Pills */}
        <div className="lg:col-span-3 neu-card p-3 space-y-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-[14px] text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'neu-pill-active text-[#2A5C4D]'
                  : 'text-[#5C5852] hover:text-[#1E1D1B]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right Panel Content */}
        <div className="lg:col-span-9 neu-chassis p-6 sm:p-8">
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-lg">
              <h2 className="font-display font-bold text-xl text-[#1E1D1B]">
                Reader Profile
              </h2>
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Verified Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                variant="clay-primary"
                onClick={() => onUpdateProfile(name, email)}
              >
                Save Profile Changes
              </Button>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="font-display font-bold text-xl text-[#1E1D1B]">
                Order Receipts ({orders.length})
              </h2>
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="neu-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-tech font-bold text-xs text-[#2A5C4D]">
                        {ord.id}
                      </span>
                      <span className="text-xs text-[#8C867E]">• {ord.date}</span>
                    </div>
                    <p className="text-sm font-medium text-[#1E1D1B] mt-1">
                      {ord.items.map((i) => i.title).join(', ')}
                    </p>
                    <p className="text-[11px] font-mono-tech text-[#8C867E]">
                      Token: {ord.downloadToken}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-display font-bold text-lg text-[#2A5C4D] block">
                      ${ord.total.toFixed(2)}
                    </span>
                    <span className="text-[10px] font-mono-tech uppercase text-[#2E6B4E]">
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'purchased' && (
            <div className="space-y-4">
              <h2 className="font-display font-bold text-xl text-[#1E1D1B]">
                Purchased eBooks ({libraryItems.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {libraryItems.map(({ ebook, purchaseDate }) => (
                  <div
                    key={ebook.id}
                    className="neu-card p-4 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <h4 className="font-display font-bold text-sm text-[#1E1D1B] truncate">
                        {ebook.title}
                      </h4>
                      <p className="text-xs text-[#5C5852]">Purchased {purchaseDate}</p>
                    </div>
                    <Button
                      variant="clay-primary"
                      size="sm"
                      onClick={() => onDownloadBook(ebook)}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'downloads' && (
            <div className="space-y-4">
              <h2 className="font-display font-bold text-xl text-[#1E1D1B]">
                Signed Vault Download Log
              </h2>
              {downloadHistory.length === 0 ? (
                <p className="text-sm text-[#5C5852]">
                  No downloads recorded in this session yet. Click &quot;Download&quot; on any
                  book in My Library to generate a timestamped audit entry.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {downloadHistory.map((entry, idx) => (
                    <div
                      key={idx}
                      className="neu-inset-sm p-3.5 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-[#1E1D1B]">{entry.title}</span>
                      <span className="font-mono-tech text-[#5C5852]">
                        {entry.format} • {entry.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-5 max-w-lg">
              <h2 className="font-display font-bold text-xl text-[#1E1D1B]">
                Delivery & Vault Preferences
              </h2>
              <div className="neu-inset p-4 space-y-3 text-xs text-[#5C5852]">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#1E1D1B]">
                    Automatic Kindle / Remarkable Sync
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#E1ECE8] text-[#2A5C4D] font-mono-tech">
                    ENABLED
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#1E1D1B]">
                    Edition Errata & Revision Alerts
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#E1ECE8] text-[#2A5C4D] font-mono-tech">
                    ENABLED
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                WISHLIST VIEW                               */
/* -------------------------------------------------------------------------- */
interface WishlistViewProps {
  ebooks: Ebook[];
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onViewDetails: (ebook: Ebook) => void;
  onBuyNow: (ebook: Ebook) => void;
  onExploreStore: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  ebooks,
  wishlistIds,
  onToggleWishlist,
  onViewDetails,
  onBuyNow,
  onExploreStore,
}) => {
  const savedBooks = ebooks.filter((b) => wishlistIds.includes(b.id));

  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono-tech text-xs uppercase tracking-widest text-[#2A5C4D]">
          Curated Reading List
        </span>
        <h1 className="font-display font-bold text-3xl text-[#1E1D1B] mt-1">
          Saved Wishlist ({savedBooks.length})
        </h1>
      </div>

      {savedBooks.length === 0 ? (
        <div className="clay-pedestal p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-[22px] clay-tile mx-auto flex items-center justify-center text-[#B84A39]">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="font-display font-bold text-xl text-[#1E1D1B]">
            Your Wishlist Is Empty
          </h3>
          <p className="text-sm text-[#5C5852]">
            Tap the heart icon on any monograph to save it for future reading.
          </p>
          <Button variant="clay-primary" onClick={onExploreStore}>
            Browse Bookstore
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {savedBooks.map((ebook) => (
            <EbookCard
              key={ebook.id}
              ebook={ebook}
              isWishlisted={true}
              onToggleWishlist={onToggleWishlist}
              onViewDetails={onViewDetails}
              onBuyNow={onBuyNow}
            />
          ))}
        </div>
      )}
    </div>
  );
};
