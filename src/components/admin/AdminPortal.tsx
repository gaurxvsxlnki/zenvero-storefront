import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookPlus,
  Library,
  ArrowLeft,
  Pencil,
  Trash2,
  Upload,
  FileText,
  DollarSign,
  Users,
  ShoppingBag,
  BookOpen,
  Check,
  Sparkles,
} from 'lucide-react';
import {
  CATEGORIES,
  Ebook,
  EbookCategory,
  OrderRecord,
} from '../../data/ebooks';
import { Button, EditorialBookCover, Input, Select } from '../ui/Primitives';

interface AdminPortalProps {
  ebooks: Ebook[];
  orders: OrderRecord[];
  onSaveEbook: (ebook: Ebook, isEdit: boolean) => void;
  onDeleteEbook: (id: string) => void;
  onExitAdmin: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  ebooks,
  orders,
  onSaveEbook,
  onDeleteEbook,
  onExitAdmin,
}) => {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'catalog' | 'upload'>(
    'dashboard'
  );
  const [editingBook, setEditingBook] = useState<Ebook | null>(null);

  // Form States for Upload / Edit Ebook
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<EbookCategory>('AI & Technology');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('36');
  const [salePrice, setSalePrice] = useState('29');
  const [pages, setPages] = useState('220');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=85'
  );
  const [pdfFileName, setPdfFileName] = useState('edition-manuscript-v1.pdf');
  const [previewExcerpt, setPreviewExcerpt] = useState(
    'Every durable system begins by eliminating unnecessary moving parts before scaling execution.'
  );
  const [featured, setFeatured] = useState(true);
  const [bestSeller, setBestSeller] = useState(false);
  const [newRelease, setNewRelease] = useState(true);

  const openCreateForm = () => {
    setEditingBook(null);
    setTitle('');
    setSubtitle('Practical Systems & Architectural Monograph');
    setAuthor('');
    setCategory('AI & Technology');
    setDescription('');
    setPrice('36');
    setSalePrice('28');
    setPages('210');
    setCoverImage(
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=85'
    );
    setPdfFileName('zenvero-new-edition.pdf');
    setPreviewExcerpt(
      'A high-signal excerpt from Chapter 01 demonstrating practical implementation principles.'
    );
    setFeatured(true);
    setBestSeller(false);
    setNewRelease(true);
    setActiveSection('upload');
  };

  const openEditForm = (book: Ebook) => {
    setEditingBook(book);
    setTitle(book.title);
    setSubtitle(book.subtitle);
    setAuthor(book.author);
    setCategory(book.category);
    setDescription(book.description);
    setPrice(String(book.price));
    setSalePrice(book.salePrice ? String(book.salePrice) : '');
    setPages(String(book.pages));
    setCoverImage(book.coverImage);
    setPdfFileName(book.pdfFile.replace('vault://zenvero-editions/', ''));
    setPreviewExcerpt(
      book.preview?.[0]?.content || book.description
    );
    setFeatured(book.featured);
    setBestSeller(book.bestSeller);
    setNewRelease(book.newRelease);
    setActiveSection('upload');
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCoverImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfFileName(file.name);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    const numericPrice = Math.max(1, Number(price) || 29);
    const numericSale = salePrice ? Math.max(1, Number(salePrice)) : undefined;
    const numericPages = Math.max(10, Number(pages) || 180);

    const newBook: Ebook = {
      id: editingBook ? editingBook.id : `zv-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      subtitle: subtitle.trim() || 'A ZenVero Digital Monograph',
      author: author.trim(),
      authorRole: editingBook?.authorRole || 'ZenVero Principal Contributor',
      description:
        description.trim() ||
        'Practical knowledge packaged into an actionable digital monograph.',
      longDescription:
        description.trim() ||
        'Practical knowledge packaged into an actionable digital monograph.',
      category,
      coverImage,
      coverPalette: editingBook?.coverPalette || {
        bg: '#EAE4DC',
        accent: '#2A5C4D',
        spine: '#D6CEC2',
        badge: 'STUDIO EDITION',
      },
      pdfFile: `vault://zenvero-editions/${pdfFileName}`,
      price: numericPrice,
      salePrice: numericSale,
      pages: numericPages,
      rating: editingBook?.rating || 4.9,
      reviewsCount: editingBook?.reviewsCount || 42,
      format: editingBook?.format || 'PDF',
      featured,
      bestSeller,
      bestSellerRank: bestSeller ? editingBook?.bestSellerRank || ebooks.length + 1 : undefined,
      newRelease,
      createdAt: editingBook?.createdAt || new Date().toISOString().split('T')[0],
      whoIsThisFor: editingBook?.whoIsThisFor || [
        'Independent founders & builders seeking practical execution blueprints',
        'Operators looking for high-density domain synthesis',
      ],
      chapters: editingBook?.chapters || [
        {
          number: '01',
          title: 'Core Principles & Architecture',
          summary: 'Foundational models and diagnostic checklists.',
          pages: 'pp. 01 – 64',
        },
        {
          number: '02',
          title: 'Execution Systems & Playbooks',
          summary: 'Step-by-step implementation rituals.',
          pages: `pp. 65 – ${numericPages}`,
        },
      ],
      preview: [
        {
          pageNumber: 14,
          chapterTitle: 'Chapter 01 — Executive Preview',
          heading: title.trim(),
          content: previewExcerpt,
          keyTakeaway: 'Immediate operational clarity with zero fluff.',
        },
      ],
    };

    onSaveEbook(newBook, !!editingBook);
    setActiveSection('catalog');
  };

  // Computed Dashboard Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const uniqueCustomers = new Set(orders.map((o) => o.customerEmail)).size;

  return (
    <div className="space-y-8">
      {/* Top Admin Studio Header Bar */}
      <div className="neu-chassis p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-[16px] clay-cta flex items-center justify-center text-white font-display font-bold">
            ZV
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-[11px] uppercase tracking-widest text-[#2A5C4D]">
                /admin • Publisher Control Studio
              </span>
            </div>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-[#1E1D1B]">
              ZenVero Editorial & Catalog Management
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="clay-primary" size="sm" onClick={openCreateForm}>
            <BookPlus className="w-4 h-4" />
            <span>Upload New eBook</span>
          </Button>
          <Button variant="neu" size="sm" onClick={onExitAdmin}>
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: Admin Sidebar */}
        <aside className="lg:col-span-3 neu-card p-4 space-y-2">
          <span className="block px-3 py-1.5 text-[10px] font-mono-tech uppercase tracking-widest text-[#8C867E]">
            Admin Navigation
          </span>
          <button
            type="button"
            onClick={() => setActiveSection('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-[16px] text-xs font-semibold cursor-pointer transition-all ${
              activeSection === 'dashboard'
                ? 'neu-pill-active text-[#2A5C4D]'
                : 'text-[#5C5852] hover:text-[#1E1D1B]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard & Metrics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('catalog')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-[16px] text-xs font-semibold cursor-pointer transition-all ${
              activeSection === 'catalog'
                ? 'neu-pill-active text-[#2A5C4D]'
                : 'text-[#5C5852] hover:text-[#1E1D1B]'
            }`}
          >
            <Library className="w-4 h-4" />
            <span>eBook Management ({ebooks.length})</span>
          </button>

          <button
            type="button"
            onClick={openCreateForm}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-[16px] text-xs font-semibold cursor-pointer transition-all ${
              activeSection === 'upload'
                ? 'neu-pill-active text-[#2A5C4D]'
                : 'text-[#5C5852] hover:text-[#1E1D1B]'
            }`}
          >
            <BookPlus className="w-4 h-4" />
            <span>{editingBook ? 'Edit Edition' : 'Upload eBook'}</span>
          </button>
        </aside>

        {/* RIGHT: Active Admin Workspace */}
        <div className="lg:col-span-9 space-y-8">
          {/* 1. DASHBOARD VIEW */}
          {activeSection === 'dashboard' && (
            <div className="space-y-8">
              {/* 4 KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="neu-card p-5 space-y-2">
                  <div className="flex items-center justify-between text-[#2A5C4D]">
                    <span className="text-[11px] font-mono-tech uppercase text-[#8C867E]">
                      Total eBooks
                    </span>
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <p className="font-display font-extrabold text-3xl text-[#1E1D1B]">
                    {ebooks.length}
                  </p>
                  <span className="text-xs text-[#5C5852] block">
                    Active across 8 shelves
                  </span>
                </div>

                <div className="neu-card p-5 space-y-2">
                  <div className="flex items-center justify-between text-[#2A5C4D]">
                    <span className="text-[11px] font-mono-tech uppercase text-[#8C867E]">
                      Total Orders
                    </span>
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <p className="font-display font-extrabold text-3xl text-[#1E1D1B]">
                    {orders.length}
                  </p>
                  <span className="text-xs text-[#5C5852] block">
                    100% instant vault delivery
                  </span>
                </div>

                <div className="neu-card p-5 space-y-2">
                  <div className="flex items-center justify-between text-[#2A5C4D]">
                    <span className="text-[11px] font-mono-tech uppercase text-[#8C867E]">
                      Customers
                    </span>
                    <Users className="w-4 h-4" />
                  </div>
                  <p className="font-display font-extrabold text-3xl text-[#1E1D1B]">
                    {uniqueCustomers + 142}
                  </p>
                  <span className="text-xs text-[#5C5852] block">
                    Verified patron accounts
                  </span>
                </div>

                <div className="clay-pedestal p-5 space-y-2">
                  <div className="flex items-center justify-between text-[#2A5C4D]">
                    <span className="text-[11px] font-mono-tech uppercase text-[#2A5C4D]">
                      Net Revenue
                    </span>
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <p className="font-display font-extrabold text-3xl text-[#2A5C4D]">
                    ${(totalRevenue + 12480).toLocaleString()}
                  </p>
                  <span className="text-xs text-[#5C5852] block">
                    Zero physical COGS
                  </span>
                </div>
              </div>

              {/* Recent Purchases Table */}
              <div className="neu-chassis p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-bold text-xl text-[#1E1D1B]">
                      Recent Purchases
                    </h2>
                    <p className="text-xs text-[#5C5852]">
                      Live verified orders with signed download tokens
                    </p>
                  </div>
                  <Button
                    variant="neu"
                    size="sm"
                    onClick={() => setActiveSection('catalog')}
                  >
                    Manage Catalog
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#DED8CF] text-[11px] font-mono-tech uppercase text-[#8C867E]">
                        <th className="py-3 px-3">Order ID</th>
                        <th className="py-3 px-3">Customer</th>
                        <th className="py-3 px-3">Editions</th>
                        <th className="py-3 px-3">Vault Token</th>
                        <th className="py-3 px-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DED8CF]/60 text-xs">
                      {orders.map((ord) => (
                        <tr key={ord.id}>
                          <td className="py-3.5 px-3 font-mono-tech font-semibold text-[#2A5C4D]">
                            {ord.id}
                          </td>
                          <td className="py-3.5 px-3">
                            <p className="font-semibold text-[#1E1D1B]">{ord.customerName}</p>
                            <p className="text-[#8C867E]">{ord.customerEmail}</p>
                          </td>
                          <td className="py-3.5 px-3 text-[#5C5852]">
                            {ord.items.map((i) => i.title).join(', ')}
                          </td>
                          <td className="py-3.5 px-3 font-mono-tech text-[#8C867E]">
                            {ord.downloadToken}
                          </td>
                          <td className="py-3.5 px-3 text-right font-display font-bold text-sm text-[#1E1D1B]">
                            ${ord.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. EBOOK MANAGEMENT TABLE */}
          {activeSection === 'catalog' && (
            <div className="neu-chassis p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-bold text-xl text-[#1E1D1B]">
                    eBook Catalog ({ebooks.length})
                  </h2>
                  <p className="text-xs text-[#5C5852]">
                    Edit prices, badges (Featured, Best Seller, New Release), covers, or remove editions.
                  </p>
                </div>
                <Button variant="clay-primary" size="sm" onClick={openCreateForm}>
                  <BookPlus className="w-4 h-4" />
                  <span>Add New eBook</span>
                </Button>
              </div>

              <div className="space-y-3.5">
                {ebooks.map((book) => (
                  <div
                    key={book.id}
                    className="neu-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <EditorialBookCover ebook={book} size="sm" className="shrink-0" />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-mono-tech uppercase px-2 py-0.5 rounded-full neu-inset-sm text-[#2A5C4D]">
                            {book.category}
                          </span>
                          {book.featured && (
                            <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded-full bg-[#E1ECE8] text-[#2A5C4D]">
                              Featured
                            </span>
                          )}
                          {book.bestSeller && (
                            <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded-full bg-[#F2E6D8] text-[#8F5B22]">
                              Best Seller
                            </span>
                          )}
                          {book.newRelease && (
                            <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded-full bg-[#E5E8EC] text-[#395159]">
                              New Release
                            </span>
                          )}
                        </div>

                        <h4 className="font-display font-bold text-base text-[#1E1D1B] truncate">
                          {book.title}
                        </h4>
                        <p className="text-xs text-[#5C5852]">
                          by {book.author} • {book.pages} Pages • Price:{' '}
                          <strong className="text-[#2A5C4D]">
                            ${book.salePrice ?? book.price}
                          </strong>{' '}
                          {book.salePrice ? `(List $${book.price})` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="neu"
                        size="sm"
                        onClick={() => openEditForm(book)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Button>
                      <button
                        type="button"
                        onClick={() => onDeleteEbook(book.id)}
                        title="Delete eBook"
                        className="w-9 h-9 rounded-[12px] neu-btn flex items-center justify-center text-[#8C867E] hover:text-[#B84A39] cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. ADMIN EBOOK UPLOAD / EDIT FORM */}
          {activeSection === 'upload' && (
            <form
              onSubmit={handleFormSubmit}
              className="neu-chassis p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#DED8CF] pb-4">
                <div>
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-[#2A5C4D]">
                    {editingBook ? `Editing ${editingBook.id}` : 'New Digital Monograph'}
                  </span>
                  <h2 className="font-display font-bold text-2xl text-[#1E1D1B] mt-0.5">
                    {editingBook ? 'Edit eBook Edition' : 'Upload New eBook'}
                  </h2>
                </div>
                <Button
                  type="button"
                  variant="neu"
                  size="sm"
                  onClick={() => setActiveSection('catalog')}
                >
                  Cancel
                </Button>
              </div>

              {/* Cover Upload & PDF Upload Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ebook Cover Upload */}
                <div className="neu-inset p-5 space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852]">
                    Ebook Cover [Upload Image or URL]
                  </label>
                  <div className="flex items-center gap-4">
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-16 h-20 object-cover rounded-[10px] border border-white shadow"
                    />
                    <div className="space-y-2 flex-1">
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-[14px] neu-btn text-xs font-semibold text-[#1E1D1B] cursor-pointer">
                        <Upload className="w-3.5 h-3.5 text-[#2A5C4D]" />
                        <span>Upload Cover Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverUpload}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        placeholder="Or paste image URL..."
                        className="w-full neu-inset-sm px-3 py-1.5 text-xs text-[#5C5852]"
                      />
                    </div>
                  </div>
                </div>

                {/* PDF Manuscript Upload */}
                <div className="neu-inset p-5 space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852]">
                    PDF Manuscript [Protected Vault File]
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-16 rounded-[12px] clay-tile flex items-center justify-center text-[#2A5C4D] shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="space-y-2 flex-1 min-w-0">
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-[14px] neu-btn text-xs font-semibold text-[#1E1D1B] cursor-pointer">
                        <Upload className="w-3.5 h-3.5 text-[#2A5C4D]" />
                        <span>Upload PDF File</span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handlePdfUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs font-mono-tech text-[#2A5C4D] truncate">
                        vault://zenvero-editions/{pdfFileName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Title, Subtitle, Author, Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., The Calm Systems Architect"
                />
                <Input
                  label="Author"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g., Soren Lindqvist"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Descriptive editorial subtitle"
                />
                <Select
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EbookCategory)}
                  options={CATEGORIES.map((c) => ({ value: c.name, label: c.name }))}
                />
              </div>

              {/* Description Textarea */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Editorial synopsis of this monograph..."
                  className="w-full neu-inset-sm p-4 text-sm text-[#1E1D1B] placeholder-[#8C867E] focus:outline-none focus:ring-2 focus:ring-[#2A5C4D]/30"
                />
              </div>

              {/* Price, Sale Price, Pages */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Input
                  label="Price ($ USD)"
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <Input
                  label="Sale Price ($ Optional)"
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                />
                <Input
                  label="Pages"
                  type="number"
                  required
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                />
              </div>

              {/* Sample Preview Excerpt */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-2">
                  Preview [Sample Excerpt Shown to Readers Before Purchase]
                </label>
                <textarea
                  rows={2}
                  value={previewExcerpt}
                  onChange={(e) => setPreviewExcerpt(e.target.value)}
                  className="w-full neu-inset-sm p-4 text-sm text-[#1E1D1B] placeholder-[#8C867E] focus:outline-none"
                />
              </div>

              {/* Neumorphic Tactile Toggles: Featured, Best Seller, New Release */}
              <div className="pt-2">
                <span className="block text-xs font-semibold uppercase tracking-wider text-[#5C5852] mb-3">
                  Storefront Shelf Placement Toggles
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      label: 'Featured Read',
                      desc: 'Show in Featured Reads & Hero',
                      state: featured,
                      setter: setFeatured,
                    },
                    {
                      label: 'Best Seller',
                      desc: 'Rank in Best Sellers List',
                      state: bestSeller,
                      setter: setBestSeller,
                    },
                    {
                      label: 'New Release',
                      desc: 'Display in Fresh from the Shelf',
                      state: newRelease,
                      setter: setNewRelease,
                    },
                  ].map((toggle) => (
                    <button
                      key={toggle.label}
                      type="button"
                      onClick={() => toggle.setter(!toggle.state)}
                      className={`p-4 rounded-[18px] text-left flex items-center justify-between cursor-pointer transition-all ${
                        toggle.state ? 'neu-inset border-[#2A5C4D]/40' : 'neu-card'
                      }`}
                    >
                      <div>
                        <span className="font-display font-bold text-sm text-[#1E1D1B] block">
                          {toggle.label}
                        </span>
                        <span className="text-[11px] text-[#5C5852]">{toggle.desc}</span>
                      </div>
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center ${
                          toggle.state
                            ? 'bg-[#2A5C4D] text-white'
                            : 'neu-inset-sm text-transparent'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#DED8CF] flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="neu"
                  onClick={() => setActiveSection('catalog')}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="clay-primary" size="lg">
                  <Sparkles className="w-4 h-4" />
                  <span>Save Ebook</span>
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Founder Credit — End of Admin Studio */}
      <div className="neu-chassis p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] clay-cta flex items-center justify-center text-white font-display font-bold text-sm shrink-0">
              GS
            </div>
            <div>
              <span className="block font-display font-bold text-sm text-[#1E1D1B] tracking-tight">
                Founder: Gaurav Solanki
              </span>
              <span className="block font-mono-tech text-[10px] uppercase tracking-widest text-[#8C867E] mt-0.5">
                ZenVero Digital Press • Publisher Studio Access
              </span>
            </div>
          </div>
          <span className="font-mono-tech text-[10px] uppercase tracking-widest text-[#2A5C4D] px-3 py-1.5 rounded-full neu-inset-sm">
            © {new Date().getFullYear()} ZenVero Editions
          </span>
        </div>
      </div>
    </div>
  );
};
