import React, { useState } from 'react';
import {
  Trash2,
  Tag,
  ArrowRight,
  Lock,
  ShieldCheck,
  Download,
  BookOpen,
  Check,
  CreditCard,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { Ebook, OrderRecord } from '../../data/ebooks';
import { Button, EditorialBookCover, Input } from '../ui/Primitives';

/* -------------------------------------------------------------------------- */
/*                                 CART VIEW                                  */
/* -------------------------------------------------------------------------- */
interface CartViewProps {
  cartItems: Ebook[];
  couponCode: string;
  discountPercent: number;
  onApplyCoupon: (code: string) => void;
  onRemoveItem: (id: string) => void;
  onContinueToCheckout: () => void;
  onExploreStore: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cartItems,
  couponCode,
  discountPercent,
  onApplyCoupon,
  onRemoveItem,
  onContinueToCheckout,
  onExploreStore,
}) => {
  const [inputCode, setInputCode] = useState(couponCode || '');

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.salePrice ?? item.price),
    0
  );
  const discountAmount = Number(((subtotal * discountPercent) / 100).toFixed(2));
  const total = Number((subtotal - discountAmount).toFixed(2));

  if (cartItems.length === 0) {
    return (
      <div className="clay-pedestal p-12 sm:p-16 text-center max-w-xl mx-auto space-y-5 my-8">
        <div className="w-20 h-20 rounded-[26px] clay-tile mx-auto flex items-center justify-center text-[#2A5C4D]">
          <ShoppingBag className="w-9 h-9" />
        </div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#1E1D1B]">
          Your Reading Bag Is Empty
        </h1>
        <p className="text-sm text-[#5C5852] max-w-md mx-auto leading-relaxed">
          Discover practical eBooks, operating manuals, and digital monographs ready for instant
          addition to your personal library.
        </p>
        <Button variant="clay-primary" size="lg" onClick={onExploreStore}>
          Explore eBooks
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono-tech text-xs uppercase tracking-widest text-[#2A5C4D]">
          Instant Digital Delivery
        </span>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#1E1D1B] mt-1">
          Your Reading Bag ({cartItems.length})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          {cartItems.map((item) => {
            const effectivePrice = item.salePrice ?? item.price;
            return (
              <div
                key={item.id}
                className="neu-card p-4 sm:p-5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <EditorialBookCover ebook={item} size="sm" className="shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[#2A5C4D]">
                      {item.category} • {item.format}
                    </span>
                    <h3 className="font-display font-bold text-base sm:text-lg text-[#1E1D1B] truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#5C5852] truncate">by {item.author}</p>
                    <p className="text-[11px] font-mono-tech text-[#8C867E] mt-1">
                      Instant PDF Vault Access
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="font-display font-bold text-lg text-[#2A5C4D] block">
                      ${effectivePrice}
                    </span>
                    {item.salePrice && (
                      <span className="text-xs line-through text-[#8C867E] font-mono-tech">
                        ${item.price}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label={`Remove ${item.title}`}
                    className="w-10 h-10 rounded-full neu-btn flex items-center justify-center text-[#8C867E] hover:text-[#B84A39] cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: Summary & Inset Neumorphic Coupon Box */}
        <div className="lg:col-span-5 neu-chassis p-6 sm:p-8 space-y-6">
          <h2 className="font-display font-bold text-xl text-[#1E1D1B]">
            Order Summary
          </h2>

          {/* Coupon Field with Inset Neumorphic Design */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-2">
              Patron Coupon Code (Try: ZENVERO15)
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-[#8C867E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  placeholder="Enter code (e.g. ZENVERO15)"
                  className="w-full neu-inset-sm pl-10 pr-4 py-2.5 text-xs font-mono-tech uppercase text-[#1E1D1B] placeholder-[#8C867E] focus:outline-none"
                />
              </div>
              <Button
                variant="neu"
                size="md"
                onClick={() => onApplyCoupon(inputCode)}
              >
                Apply
              </Button>
            </div>
          </div>

          {/* Totals Breakdown (Strictly Digital - No Shipping) */}
          <div className="neu-inset p-5 space-y-3 text-sm">
            <div className="flex items-center justify-between text-[#5C5852]">
              <span>Subtotal ({cartItems.length} digital editions)</span>
              <span className="font-mono-tech font-medium text-[#1E1D1B]">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#5C5852]">
              <span>Discount {discountPercent > 0 ? `(${discountPercent}% OFF)` : ''}</span>
              <span className="font-mono-tech font-medium text-[#2A5C4D]">
                -${discountAmount.toFixed(2)}
              </span>
            </div>
            <div className="pt-3 border-t border-[#DED8CF] flex items-center justify-between">
              <span className="font-display font-bold text-base text-[#1E1D1B]">
                Total
              </span>
              <span className="font-display font-extrabold text-2xl text-[#2A5C4D]">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            variant="clay-primary"
            size="lg"
            className="w-full"
            onClick={onContinueToCheckout}
          >
            <span>Continue to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <p className="text-[11px] text-[#8C867E] text-center font-mono-tech">
            100% DIGITAL DELIVERY • INSTANT LIBRARY UNLOCK
          </p>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                CHECKOUT VIEW                               */
/* -------------------------------------------------------------------------- */
interface CheckoutViewProps {
  cartItems: Ebook[];
  discountPercent: number;
  defaultName: string;
  defaultEmail: string;
  onCompletePurchase: (name: string, email: string) => void;
  onBackToCart: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cartItems,
  discountPercent,
  defaultName,
  defaultEmail,
  onCompletePurchase,
  onBackToCart,
}) => {
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('08/28');
  const [cvc, setCvc] = useState('842');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.salePrice ?? item.price),
    0
  );
  const discountAmount = Number(((subtotal * discountPercent) / 100).toFixed(2));
  const total = Number((subtotal - discountAmount).toFixed(2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onCompletePurchase(name.trim(), email.trim());
    }, 650);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono-tech text-xs uppercase tracking-widest text-[#2A5C4D]">
            Encrypted Digital Checkout
          </span>
          <h1 className="font-display font-bold text-3xl text-[#1E1D1B] mt-1">
            Complete Your Edition Order
          </h1>
        </div>
        <Button variant="neu" size="sm" onClick={onBackToCart}>
          Back to Cart
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* LEFT: Customer Details & Payment Provider Section */}
        <div className="lg:col-span-7 neu-card p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="font-display font-bold text-lg text-[#1E1D1B]">
              1. Reader Delivery Details
            </h2>
            <p className="text-xs text-[#5C5852] mt-0.5">
              Your receipt and lifetime vault access will be linked to this email.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Alistair Sterling"
            />
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alistair@studio.co"
            />
          </div>

          <div className="pt-4 border-t border-[#DED8CF] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-lg text-[#1E1D1B]">
                  2. Payment Method
                </h2>
                <p className="text-xs text-[#5C5852]">
                  Tokenized Stripe / Payment Gateway Integration
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full neu-inset-sm text-[11px] font-mono-tech text-[#2A5C4D]">
                <Lock className="w-3 h-3" />
                256-BIT TLS
              </span>
            </div>

            <div className="neu-inset p-5 space-y-4">
              <Input
                label="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                icon={<CreditCard className="w-4 h-4" />}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiration"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                />
                <Input
                  label="Security Code (CVC)"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="clay-primary"
            size="lg"
            className="w-full"
            disabled={isProcessing}
          >
            <Lock className="w-4 h-4" />
            <span>
              {isProcessing
                ? 'Verifying Payment & Signing Vault Token...'
                : `Complete Purchase — $${total.toFixed(2)}`}
            </span>
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-[#5C5852] pt-1">
            <ShieldCheck className="w-4 h-4 text-[#2A5C4D]" />
            <span>
              Secure digital payment verification. Download unlocks immediately after checkout.
            </span>
          </div>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="lg:col-span-5 clay-pedestal p-6 sm:p-8 space-y-5">
          <h2 className="font-display font-bold text-lg text-[#1E1D1B]">
            Order Summary
          </h2>

          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {cartItems.map((item) => {
              const effectivePrice = item.salePrice ?? item.price;
              return (
                <div
                  key={item.id}
                  className="neu-card p-3.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <EditorialBookCover ebook={item} size="sm" className="shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-display font-bold text-sm text-[#1E1D1B] truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#5C5852] truncate">{item.author}</p>
                      <span className="text-[10px] font-mono-tech text-[#2A5C4D]">
                        {item.format}
                      </span>
                    </div>
                  </div>
                  <span className="font-display font-bold text-sm text-[#2A5C4D] shrink-0">
                    ${effectivePrice}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="neu-inset p-4 space-y-2.5 text-sm">
            <div className="flex justify-between text-[#5C5852]">
              <span>Subtotal</span>
              <span className="font-mono-tech">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#5C5852]">
              <span>Discount</span>
              <span className="font-mono-tech text-[#2A5C4D]">
                -${discountAmount.toFixed(2)}
              </span>
            </div>
            <div className="pt-2.5 border-t border-[#DED8CF] flex justify-between items-baseline">
              <span className="font-display font-bold text-base text-[#1E1D1B]">
                Final Total
              </span>
              <span className="font-display font-extrabold text-2xl text-[#2A5C4D]">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                     CLAYMORPHIC PURCHASE SUCCESS VIEW                      */
/* -------------------------------------------------------------------------- */
interface PurchaseSuccessViewProps {
  order: OrderRecord | null;
  purchasedBooks: Ebook[];
  onDownloadBook: (ebook: Ebook) => void;
  onGoToLibrary: () => void;
}

export const PurchaseSuccessView: React.FC<PurchaseSuccessViewProps> = ({
  order,
  purchasedBooks,
  onDownloadBook,
  onGoToLibrary,
}) => {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="clay-pedestal p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
        {/* Large Soft 3D Claymorphic Success Icon Object */}
        <div className="relative mx-auto w-24 h-24 rounded-[30px] clay-cta flex items-center justify-center shadow-xl animate-clay-float">
          <Check className="w-12 h-12 text-white stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full neu-inset-sm text-[11px] font-mono-tech text-[#2A5C4D]">
            <Sparkles className="w-3 h-3" />
            {order ? `ORDER ${order.id} • TOKEN ${order.downloadToken}` : 'VERIFIED FULFILLMENT'}
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1E1D1B]">
            Purchase successful
          </h1>
          <p className="text-base text-[#5C5852]">
            Your eBook is now available in your library.
          </p>
        </div>

        {/* Purchased Editions List for Immediate Verified Download */}
        {purchasedBooks.length > 0 && (
          <div className="neu-inset p-5 text-left space-y-3">
            <span className="text-[10px] font-mono-tech uppercase tracking-widest text-[#8C867E] block">
              Unlocked Digital Editions (Signed Vault Access)
            </span>
            {purchasedBooks.map((book) => (
              <div
                key={book.id}
                className="neu-card p-3.5 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-display font-bold text-sm text-[#1E1D1B] truncate">
                    {book.title}
                  </p>
                  <p className="text-xs text-[#5C5852]">
                    {book.format} • {book.pages} Pages
                  </p>
                </div>
                <Button
                  variant="clay-primary"
                  size="sm"
                  onClick={() => onDownloadBook(book)}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download eBook</span>
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          {purchasedBooks[0] && (
            <Button
              variant="clay-primary"
              size="lg"
              onClick={() => onDownloadBook(purchasedBooks[0])}
            >
              <Download className="w-4 h-4" />
              <span>Download eBook</span>
            </Button>
          )}

          <Button variant="neu" size="lg" onClick={onGoToLibrary}>
            <BookOpen className="w-4 h-4 text-[#2A5C4D]" />
            <span>Go to My Library</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
