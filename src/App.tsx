import { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Compass,
  ShieldCheck,
  Award,
  BookOpen,
} from 'lucide-react';
import {
  CATEGORIES,
  Ebook,
  EbookCategory,
  INITIAL_EBOOKS,
  INITIAL_ORDERS,
  OrderRecord,
} from './data/ebooks';
import { Navbar, PageView } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Button, Toast } from './components/ui/Primitives';
import {
  BestSellerCard,
  CategoryCard,
  ClayBookVisual,
  EbookCard,
} from './components/store/StoreComponents';
import { EbookDetailsView } from './components/store/EbookDetailsView';
import { SearchView } from './components/store/SearchView';
import {
  CartView,
  CheckoutView,
  PurchaseSuccessView,
} from './components/store/CommerceViews';
import {
  AccountView,
  LibraryView,
  WishlistView,
} from './components/store/UserViews';
import { AdminPortal } from './components/admin/AdminPortal';

const getViewFromHash = (): PageView | null => {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  const validViews: PageView[] = [
    'home',
    'categories',
    'bestsellers',
    'newreleases',
    'details',
    'search',
    'wishlist',
    'cart',
    'checkout',
    'success',
    'library',
    'account',
    'admin',
  ];

  if (hash === 'store') return 'home';

  if (validViews.includes(hash as PageView)) {
    return hash as PageView;
  }

  return null;
};

export function App() {
  // Editable Catalog State (managed via /admin)
  const [ebooks, setEbooks] = useState<Ebook[]>(INITIAL_EBOOKS);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);

  // Navigation & Selected Product State — route-aware initialization
  const [currentView, setCurrentView] = useState<PageView>(() => {
    const hashView = getViewFromHash();
    return hashView || 'home';
  });

  const [selectedEbookId, setSelectedEbookId] = useState<string>(
    INITIAL_EBOOKS[0].id
  );

  const [heroBookId, setHeroBookId] = useState<string>(
    INITIAL_EBOOKS[0].id
  );

  const [searchInitialCategory, setSearchInitialCategory] = useState<
    EbookCategory | 'All'
  >('All');

  const [homeCategoryFilter, setHomeCategoryFilter] = useState<
    EbookCategory | 'All'
  >('All');

  // Reader Commerce & Library State
  const [cartIds, setCartIds] = useState<string[]>(['zv-002']);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['zv-003']);

  const [ownedItems, setOwnedItems] = useState<
    { ebookId: string; purchaseDate: string; orderId: string }[]
  >([
    {
      ebookId: 'zv-001',
      purchaseDate: '2025-02-18',
      orderId: 'ORD-9482',
    },
  ]);

  const [couponCode, setCouponCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [latestOrder, setLatestOrder] = useState<OrderRecord | null>(null);
  const [lastPurchasedBooks, setLastPurchasedBooks] = useState<Ebook[]>([]);

  // User Profile & Audit Log
  const [userProfile, setUserProfile] = useState({
    name: 'Alistair Sterling',
    email: 'alistair@sterlingstudio.co',
    role: 'Founding Patron',
  });

  const [downloadHistory, setDownloadHistory] = useState<
    { title: string; timestamp: string; format: string }[]
  >([
    {
      title: 'The Calm Compounding Operator',
      timestamp: '2025-02-18 14:25 UTC',
      format: 'PDF Vault Bundle',
    },
  ]);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);

    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3600);
  };

  // Derived Collections
  const featuredBooks = useMemo(
    () => ebooks.filter((b) => b.featured),
    [ebooks]
  );

  const bestSellers = useMemo(
    () =>
      ebooks
        .filter((b) => b.bestSeller)
        .sort(
          (a, b) =>
            (a.bestSellerRank || 99) - (b.bestSellerRank || 99)
        ),
    [ebooks]
  );

  const newReleases = useMemo(
    () => ebooks.filter((b) => b.newRelease),
    [ebooks]
  );

  const activeHeroBook = useMemo(
    () =>
      ebooks.find((b) => b.id === heroBookId) ||
      featuredBooks[0] ||
      ebooks[0],
    [ebooks, heroBookId, featuredBooks]
  );

  const selectedEbook = useMemo(
    () =>
      ebooks.find((b) => b.id === selectedEbookId) ||
      ebooks[0],
    [ebooks, selectedEbookId]
  );

  const cartItems = useMemo(
    () => ebooks.filter((b) => cartIds.includes(b.id)),
    [ebooks, cartIds]
  );

  const libraryItems = useMemo(() => {
    return ownedItems
      .map((entry) => {
        const found = ebooks.find(
          (b) => b.id === entry.ebookId
        );

        return found
          ? {
              ebook: found,
              purchaseDate: entry.purchaseDate,
              orderId: entry.orderId,
            }
          : null;
      })
      .filter(
        (x): x is NonNullable<typeof x> => x !== null
      );
  }, [ownedItems, ebooks]);

  // Synchronize route state with URL hash
  useEffect(() => {
    const onHashChange = () => {
      const v = getViewFromHash();

      if (v) {
        setCurrentView(v);

        if (v === 'categories') {
          const el = document.getElementById(
            'categories-section'
          );
          el?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        } else if (v === 'bestsellers') {
          const el = document.getElementById(
            'bestsellers-section'
          );
          el?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        } else if (v === 'newreleases') {
          const el = document.getElementById(
            'newreleases-section'
          );
          el?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        } else if (v === 'home') {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      }
    };

    window.addEventListener('hashchange', onHashChange);

    return () =>
      window.removeEventListener(
        'hashchange',
        onHashChange
      );
  }, []);

  // Initial scroll if opening with a specific section hash
  useEffect(() => {
    const hashView = getViewFromHash();

    if (
      hashView === 'categories' ||
      hashView === 'bestsellers' ||
      hashView === 'newreleases'
    ) {
      setTimeout(() => {
        const sectionMap: Record<string, string> = {
          categories: 'categories-section',
          bestsellers: 'bestsellers-section',
          newreleases: 'newreleases-section',
        };

        const el = document.getElementById(
          sectionMap[hashView]
        );

        el?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, []);

  // Navigation Helper
  const handleNavigate = (
    view: PageView,
    sectionId?: string
  ) => {
    setCurrentView(view);

    const hashVal =
      view === 'home' ? 'store' : view;

    if (typeof window !== 'undefined') {
      if (
        window.location.hash.replace(
          /^#\/?/,
          ''
        ) !== hashVal
      ) {
        window.history.pushState(
          null,
          '',
          `#${hashVal}`
        );
      }
    }

    if (sectionId) {
      setTimeout(() => {
        const el =
          document.getElementById(sectionId);

        if (el) {
          el.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 60);
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  // Product Interactions
  const handleOpenDetails = (ebook: Ebook) => {
    setSelectedEbookId(ebook.id);
    handleNavigate('details');
  };

  const handleToggleWishlist = (id: string) => {
    const book = ebooks.find(
      (b) => b.id === id
    );

    setWishlistIds((prev) => {
      const exists = prev.includes(id);

      showToast(
        exists
          ? `Removed "${book?.title}" from Wishlist`
          : `Saved "${book?.title}" to Wishlist`
      );

      return exists
        ? prev.filter((x) => x !== id)
        : [...prev, id];
    });
  };

  const handleAddToCart = (ebook: Ebook) => {
    if (
      ownedItems.some(
        (o) => o.ebookId === ebook.id
      )
    ) {
      showToast(
        `You already own "${ebook.title}" in My Library.`
      );

      handleNavigate('library');
      return;
    }

    if (!cartIds.includes(ebook.id)) {
      setCartIds((prev) => [
        ...prev,
        ebook.id,
      ]);
    }

    showToast(
      `Added "${ebook.title}" to your reading bag.`
    );
  };

  const handleBuyNow = (ebook: Ebook) => {
    if (
      ownedItems.some(
        (o) => o.ebookId === ebook.id
      )
    ) {
      showToast(
        `"${ebook.title}" is already in your Library.`
      );

      handleNavigate('library');
      return;
    }

    if (!cartIds.includes(ebook.id)) {
      setCartIds((prev) => [
        ...prev,
        ebook.id,
      ]);
    }

    handleNavigate('checkout');
  };

  const handleRemoveFromCart = (id: string) => {
    setCartIds((prev) =>
      prev.filter((x) => x !== id)
    );

    showToast(
      'Edition removed from reading bag.'
    );
  };

  const handleApplyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();

    if (
      clean === 'ZENVERO15' ||
      clean === 'CALM15'
    ) {
      setCouponCode(clean);
      setDiscountPercent(15);

      showToast(
        `Patron code ${clean} applied (15% off).`
      );
    } else if (clean === 'CALM10') {
      setCouponCode(clean);
      setDiscountPercent(10);

      showToast(
        `Patron code ${clean} applied (10% off).`
      );
    } else {
      showToast(
        'Invalid coupon code. Try ZENVERO15 for 15% off.'
      );
    }
  };

  // Checkout & Verified Purchase Completion
  const handleCompletePurchase = (
    customerName: string,
    customerEmail: string
  ) => {
    const subtotal = cartItems.reduce(
      (sum, item) =>
        sum + (item.salePrice ?? item.price),
      0
    );

    const discountAmt = Number(
      (
        (subtotal * discountPercent) /
        100
      ).toFixed(2)
    );

    const finalTotal = Number(
      (subtotal - discountAmt).toFixed(2)
    );

    const today =
      new Date()
        .toISOString()
        .split('T')[0];

    const orderId = `ORD-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const token = `zv_sig_${Math.random()
      .toString(36)
      .substring(2, 11)}`;

    const newOrder: OrderRecord = {
      id: orderId,
      customerName,
      customerEmail,
      items: cartItems.map((i) => ({
        ebookId: i.id,
        title: i.title,
        price: i.salePrice ?? i.price,
      })),
      subtotal,
      discount: discountAmt,
      total: finalTotal,
      date: `${today} ${new Date()
        .toTimeString()
        .slice(0, 5)}`,
      downloadToken: token,
      status: 'Verified',
    };

    setOrders((prev) => [
      newOrder,
      ...prev,
    ]);

    setLastPurchasedBooks(cartItems);
    setLatestOrder(newOrder);

    // Unlock purchased editions in user's My Library
    setOwnedItems((prev) => {
      const existingIds = new Set(
        prev.map((p) => p.ebookId)
      );

      const additions = cartItems
        .filter(
          (c) => !existingIds.has(c.id)
        )
        .map((c) => ({
          ebookId: c.id,
          purchaseDate: today,
          orderId,
        }));

      return [
        ...additions,
        ...prev,
      ];
    });

    setUserProfile((prev) => ({
      ...prev,
      name: customerName,
      email: customerEmail,
    }));

    setCartIds([]);
    setCouponCode('');
    setDiscountPercent(0);

    handleNavigate('success');

    showToast(
      'Payment verified! Editions unlocked in your Library.'
    );
  };

  // ============================================================
  // PROTECTED DIGITAL PDF DOWNLOAD
  // ============================================================
  //
  // IMPORTANT:
  // This now downloads the REAL PDF file.
  // It no longer creates a fake TXT receipt.
  //
  // Calm Compounding PDF location:
  // public/ebooks/the-calm-compounding-operator.pdf
  //
  // Browser URL:
  // /ebooks/the-calm-compounding-operator.pdf
  // ============================================================
  const handleProtectedDownload = (
    ebook: Ebook
  ) => {
    const isVerifiedOwner =
      ownedItems.some(
        (o) => o.ebookId === ebook.id
      ) ||
      lastPurchasedBooks.some(
        (b) => b.id === ebook.id
      );

    if (!isVerifiedOwner) {
      showToast(
        'Access denied: Please complete purchase to unlock the ebook download.'
      );
      return;
    }

    let pdfPath = '';

    // Real uploaded PDF for Calm Compounding Operator
    if (ebook.id === 'zv-001') {
      pdfPath =
        '/ebooks/the-calm-compounding-operator.pdf';
    } else {
      // For other ebooks, use the pdfFile value
      // only when it is a normal website path.
      if (
        ebook.pdfFile &&
        ebook.pdfFile.startsWith('/')
      ) {
        pdfPath = ebook.pdfFile;
      }
    }

    if (!pdfPath) {
      showToast(
        `${ebook.title} PDF is not uploaded yet.`
      );
      return;
    }

    const link =
      document.createElement('a');

    link.href = pdfPath;
    link.download =
      ebook.id === 'zv-001'
        ? 'The-Calm-Compounding-Operator.pdf'
        : `${ebook.title
            .replace(/[^a-z0-9]+/gi, '-')
            .replace(/^-+|-+$/g, '')}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadHistory((prev) => [
      {
        title: ebook.title,
        timestamp:
          new Date().toUTCString(),
        format: 'PDF',
      },
      ...prev,
    ]);

    showToast(
      `Downloading "${ebook.title}" PDF...`
    );
  };

  // Admin Catalog Handlers
  const handleSaveEbook = (
    savedBook: Ebook,
    isEdit: boolean
  ) => {
    if (isEdit) {
      setEbooks((prev) =>
        prev.map((b) =>
          b.id === savedBook.id
            ? savedBook
            : b
        )
      );

      showToast(
        `Updated edition "${savedBook.title}".`
      );
    } else {
      setEbooks((prev) => [
        savedBook,
        ...prev,
      ]);

      showToast(
        `Published new edition "${savedBook.title}" to Storefront.`
      );
    }
  };

  const handleDeleteEbook = (
    id: string
  ) => {
    const target = ebooks.find(
      (b) => b.id === id
    );

    if (ebooks.length <= 1) {
      showToast(
        'At least one edition must remain in the bookstore.'
      );
      return;
    }

    setEbooks((prev) =>
      prev.filter((b) => b.id !== id)
    );

    showToast(
      `Removed "${target?.title}" from catalog.`
    );
  };

  const handleCategorySelect = (
    cat: EbookCategory
  ) => {
    setSearchInitialCategory(cat);
    handleNavigate('search');
  };

  // Filtered Featured Books
  const displayedFeaturedBooks =
    useMemo(() => {
      const pool =
        featuredBooks.length > 0
          ? featuredBooks
          : ebooks;

      if (
        homeCategoryFilter === 'All'
      ) {
        return pool;
      }

      const filtered = ebooks.filter(
        (b) =>
          b.category ===
          homeCategoryFilter
      );

      return filtered.length > 0
        ? filtered
        : pool;
    }, [
      featuredBooks,
      ebooks,
      homeCategoryFilter,
    ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F3EFEA] text-[#1E1D1B]">
      {/* Responsive Neumorphic Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        cartCount={cartIds.length}
        wishlistCount={wishlistIds.length}
        libraryCount={ownedItems.length}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8">
        {/* ================================================================ */}
        {/*                        1. HOME / STORE VIEW                      */}
        {/* ================================================================ */}

        {(currentView === 'home' ||
          currentView === 'categories' ||
          currentView === 'bestsellers' ||
          currentView === 'newreleases') && (
          <div className="space-y-20 sm:space-y-24">
            {/* HERO SECTION */}
            <section className="neu-chassis p-6 sm:p-10 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
                {/* LEFT */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2.5 neu-inset-sm px-4 py-2 rounded-full">
                    <Sparkles className="w-3.5 h-3.5 text-[#2A5C4D]" />

                    <span className="font-mono-tech text-xs font-medium text-[#2A5C4D]">
                      ZenVero — Practical knowledge. Beautifully packaged.
                    </span>
                  </div>

                  <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[54px] text-[#1E1D1B] leading-[1.08] tracking-tight">
                    Ideas worth reading.
                    <span className="block text-[#2A5C4D] mt-1">
                      Knowledge worth keeping.
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg text-[#5C5852] max-w-xl leading-relaxed">
                    Discover practical eBooks designed to help you learn, build, create and grow.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Button
                      variant="clay-primary"
                      size="lg"
                      onClick={() => {
                        const el =
                          document.getElementById(
                            'featured-reads-section'
                          );

                        if (el) {
                          el.scrollIntoView({
                            behavior:
                              'smooth',
                          });
                        }
                      }}
                    >
                      <span>
                        Explore eBooks
                      </span>

                      <ArrowRight className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="neu"
                      size="lg"
                      onClick={() =>
                        handleNavigate(
                          'categories',
                          'categories-section'
                        )
                      }
                    >
                      <Compass className="w-4 h-4 text-[#2A5C4D]" />

                      <span>
                        Browse Categories
                      </span>
                    </Button>
                  </div>

                  <div className="pt-5 border-t border-[#DED8CF] grid grid-cols-3 gap-4 max-w-lg">
                    <div>
                      <span className="font-display font-bold text-lg text-[#1E1D1B] block">
                        {ebooks.length}{' '}
                        Editions
                      </span>

                      <span className="text-xs text-[#8C867E]">
                        Peer-reviewed
                        monographs
                      </span>
                    </div>

                    <div>
                      <span className="font-display font-bold text-lg text-[#1E1D1B] block">
                        PDF
                      </span>

                      <span className="text-xs text-[#8C867E]">
                        DRM-free instant
                        vault
                      </span>
                    </div>

                    <div>
                      <span className="font-display font-bold text-lg text-[#1E1D1B] block">
                        4.9 / 5.0
                      </span>

                      <span className="text-xs text-[#8C867E]">
                        Verified reader
                        rating
                      </span>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="lg:col-span-5">
                  <ClayBookVisual
                    featuredBooks={
                      featuredBooks.length >
                      0
                        ? featuredBooks
                        : ebooks
                    }
                    activeHeroBook={
                      activeHeroBook
                    }
                    onSelectHeroBook={(
                      b
                    ) =>
                      setHeroBookId(b.id)
                    }
                    onOpenDetails={
                      handleOpenDetails
                    }
                    onBuyNow={
                      handleBuyNow
                    }
                  />
                </div>
              </div>
            </section>

            {/* FEATURED EBOOKS */}
            <section
              id="featured-reads-section"
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-[#2A5C4D]">
                    Curated Front Table
                  </span>

                  <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1E1D1B] mt-1">
                    Featured Reads
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {(
                    [
                      'All',
                      'Business',
                      'AI & Technology',
                      'Marketing',
                      'Side Hustles',
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() =>
                        setHomeCategoryFilter(
                          cat
                        )
                      }
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        homeCategoryFilter ===
                        cat
                          ? 'neu-pill-active text-[#2A5C4D]'
                          : 'neu-pill text-[#5C5852] hover:text-[#1E1D1B]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayedFeaturedBooks
                  .slice(0, 4)
                  .map((ebook) => (
                    <EbookCard
                      key={ebook.id}
                      ebook={ebook}
                      isWishlisted={wishlistIds.includes(
                        ebook.id
                      )}
                      onToggleWishlist={
                        handleToggleWishlist
                      }
                      onViewDetails={
                        handleOpenDetails
                      }
                      onBuyNow={
                        handleBuyNow
                      }
                    />
                  ))}
              </div>
            </section>

            {/* CATEGORIES */}
            <section
              id="categories-section"
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-[#2A5C4D]">
                    Subject Index • 8
                    Specialized Shelves
                  </span>

                  <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1E1D1B] mt-1">
                    Explore by Category
                  </h2>
                </div>

                <Button
                  variant="neu"
                  size="sm"
                  onClick={() => {
                    setSearchInitialCategory(
                      'All'
                    );
                    handleNavigate(
                      'search'
                    );
                  }}
                >
                  <span>
                    View All Editions
                  </span>

                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {CATEGORIES.map(
                  (cat) => {
                    const count =
                      ebooks.filter(
                        (b) =>
                          b.category ===
                          cat.name
                      ).length;

                    return (
                      <CategoryCard
                        key={
                          cat.name
                        }
                        name={
                          cat.name
                        }
                        tagline={
                          cat.tagline
                        }
                        count={
                          count
                        }
                        onSelect={
                          handleCategorySelect
                        }
                      />
                    );
                  }
                )}
              </div>
            </section>

            {/* BEST SELLERS */}
            <section
              id="bestsellers-section"
              className="neu-chassis p-6 sm:p-10 space-y-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-[#2A5C4D] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    Most Collected
                    Editions
                  </span>

                  <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1E1D1B] mt-1">
                    Best Sellers
                  </h2>
                </div>

                <p className="text-xs text-[#5C5852] max-w-sm">
                  Ranked by reader completion
                  rate, team licenses, and
                  verified library saves.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {bestSellers
                  .slice(0, 4)
                  .map(
                    (
                      ebook,
                      idx
                    ) => (
                      <BestSellerCard
                        key={
                          ebook.id
                        }
                        ebook={
                          ebook
                        }
                        rank={
                          idx + 1
                        }
                        onViewDetails={
                          handleOpenDetails
                        }
                        onBuyNow={
                          handleBuyNow
                        }
                      />
                    )
                  )}
              </div>
            </section>

            {/* NEW RELEASES */}
            <section
              id="newreleases-section"
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-[#2A5C4D]">
                    Newly Typeset &
                    Published
                  </span>

                  <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1E1D1B] mt-1">
                    Fresh from the
                    Shelf
                  </h2>
                </div>

                <Button
                  variant="neu"
                  size="sm"
                  onClick={() =>
                    handleNavigate(
                      'admin'
                    )
                  }
                >
                  <span>
                    Publish or Edit
                    via /admin
                  </span>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(
                  newReleases.length >
                  0
                    ? newReleases
                    : ebooks
                )
                  .slice(0, 4)
                  .map(
                    (ebook) => (
                      <EbookCard
                        key={
                          ebook.id
                        }
                        ebook={
                          ebook
                        }
                        isWishlisted={wishlistIds.includes(
                          ebook.id
                        )}
                        onToggleWishlist={
                          handleToggleWishlist
                        }
                        onViewDetails={
                          handleOpenDetails
                        }
                        onBuyNow={
                          handleBuyNow
                        }
                      />
                    )
                  )}
              </div>
            </section>

            {/* EDITORIAL CALLOUT */}
            <section className="clay-pedestal p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neu-inset-sm text-xs font-mono-tech text-[#2A5C4D]">
                  <ShieldCheck className="w-3.5 h-3.5" />

                  <span>
                    ZENVERO ARCHITECTURAL
                    EDITION GUARANTEE
                  </span>
                </div>

                <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#1E1D1B]">
                  Every edition is
                  field-tested, DRM-free,
                  and yours to keep forever.
                </h3>

                <p className="text-sm text-[#5C5852] leading-relaxed">
                  Unlike subscription feeds
                  that bury signal in noise,
                  ZenVero publishes finite,
                  crystalline monographs you
                  can read on desktop, tablet,
                  or e-ink devices.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button
                  variant="clay-primary"
                  size="lg"
                  onClick={() =>
                    handleNavigate(
                      'search'
                    )
                  }
                >
                  <BookOpen className="w-4 h-4" />

                  <span>
                    Browse Full Catalog
                  </span>
                </Button>
              </div>
            </section>
          </div>
        )}

        {/* ================================================================ */}
        {/*                    2. EBOOK DETAILS VIEW                         */}
        {/* ================================================================ */}

        {currentView === 'details' && (
          <EbookDetailsView
            ebook={selectedEbook}
            allEbooks={ebooks}
            isWishlisted={wishlistIds.includes(
              selectedEbook.id
            )}
            wishlistIds={wishlistIds}
            isOwned={ownedItems.some(
              (o) =>
                o.ebookId ===
                selectedEbook.id
            )}
            onBack={() =>
              handleNavigate('home')
            }
            onAddToCart={
              handleAddToCart
            }
            onBuyNow={handleBuyNow}
            onToggleWishlist={
              handleToggleWishlist
            }
            onSelectEbook={
              handleOpenDetails
            }
            onGoToLibrary={() =>
              handleNavigate(
                'library'
              )
            }
          />
        )}

        {/* SEARCH */}
        {currentView === 'search' && (
          <SearchView
            ebooks={ebooks}
            initialCategory={
              searchInitialCategory
            }
            wishlistIds={
              wishlistIds
            }
            onToggleWishlist={
              handleToggleWishlist
            }
            onViewDetails={
              handleOpenDetails
            }
            onBuyNow={handleBuyNow}
          />
        )}

        {/* WISHLIST */}
        {currentView === 'wishlist' && (
          <WishlistView
            ebooks={ebooks}
            wishlistIds={
              wishlistIds
            }
            onToggleWishlist={
              handleToggleWishlist
            }
            onViewDetails={
              handleOpenDetails
            }
            onBuyNow={handleBuyNow}
            onExploreStore={() =>
              handleNavigate(
                'home'
              )
            }
          />
        )}

        {/* CART */}
        {currentView === 'cart' && (
          <CartView
            cartItems={cartItems}
            couponCode={couponCode}
            discountPercent={
              discountPercent
            }
            onApplyCoupon={
              handleApplyCoupon
            }
            onRemoveItem={
              handleRemoveFromCart
            }
            onContinueToCheckout={() =>
              handleNavigate(
                'checkout'
              )
            }
            onExploreStore={() =>
              handleNavigate(
                'home'
              )
            }
          />
        )}

        {/* CHECKOUT */}
        {currentView === 'checkout' && (
          <CheckoutView
            cartItems={cartItems}
            discountPercent={
              discountPercent
            }
            defaultName={
              userProfile.name
            }
            defaultEmail={
              userProfile.email
            }
            onCompletePurchase={
              handleCompletePurchase
            }
            onBackToCart={() =>
              handleNavigate(
                'cart'
              )
            }
          />
        )}

        {/* PURCHASE SUCCESS */}
        {currentView === 'success' && (
          <PurchaseSuccessView
            order={latestOrder}
            purchasedBooks={
              lastPurchasedBooks
            }
            onDownloadBook={
              handleProtectedDownload
            }
            onGoToLibrary={() =>
              handleNavigate(
                'library'
              )
            }
          />
        )}

        {/* MY LIBRARY */}
        {currentView === 'library' && (
          <LibraryView
            libraryItems={
              libraryItems
            }
            onDownloadBook={
              handleProtectedDownload
            }
            onExploreStore={() =>
              handleNavigate(
                'home'
              )
            }
          />
        )}

        {/* ACCOUNT */}
        {currentView === 'account' && (
          <AccountView
            userProfile={
              userProfile
            }
            onUpdateProfile={(
              name,
              email
            ) => {
              setUserProfile(
                (p) => ({
                  ...p,
                  name,
                  email,
                })
              );

              showToast(
                'Account profile updated.'
              );
            }}
            orders={orders}
            libraryItems={
              libraryItems
            }
            downloadHistory={
              downloadHistory
            }
            onDownloadBook={
              handleProtectedDownload
            }
            onLogout={() => {
              showToast(
                'Session signed out safely. Returning to storefront.'
              );

              handleNavigate(
                'home'
              );
            }}
          />
        )}

        {/* ADMIN */}
        {currentView === 'admin' && (
          <AdminPortal
            ebooks={ebooks}
            orders={orders}
            onSaveEbook={
              handleSaveEbook
            }
            onDeleteEbook={
              handleDeleteEbook
            }
            onExitAdmin={() =>
              handleNavigate(
                'home'
              )
            }
          />
        )}
      </main>

      {/* Editorial Footer */}
      <Footer
        onNavigate={handleNavigate}
        onSelectCategory={
          handleCategorySelect
        }
      />

      {/* Tactile Toast Notification */}
      <Toast
        message={toastMessage}
        onDismiss={() =>
          setToastMessage(null)
        }
      />
    </div>
  );
}

export default App;