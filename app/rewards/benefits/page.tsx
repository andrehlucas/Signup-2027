'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/app/components/ui/dialog';
import { X } from 'lucide-react';
import { type Category } from './benefitsData';

const ITEMS_PER_PAGE = 12;
const SHORT_DESC_MAX_LENGTH = 160;

const categories: readonly Category[] = [
  'All',
  'Business Tools',
  'Setup Your Business',
  'Marketing Tools',
  'Shipping Deals',
  'Travel',
];

interface BenefitAPI {
  id: string;
  name: string;
  logo: string;
  category: string;
  discount: string;
  shortDescription: string;
  fullDescription: string;
  dealUrl: string;
  ctaLabel: string;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  'Business Tools': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  'Setup Your Business': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'Marketing Tools': { bg: 'bg-purple-100', text: 'text-purple-700' },
  'Shipping Deals': { bg: 'bg-amber-100', text: 'text-amber-700' },
  'Travel': { bg: 'bg-rose-100', text: 'text-rose-700' },
};

function truncateDescription(text: string, maxLength: number = SHORT_DESC_MAX_LENGTH): string {
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated);
}

function BenefitCard({ benefit, onLearnMore }: { benefit: BenefitAPI; onLearnMore: (benefit: BenefitAPI) => void }) {
  const color = categoryColors[benefit.category] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  const displayDescription = truncateDescription(benefit.shortDescription);

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
      data-testid={`benefit-card-${benefit.id}`}
    >
      <div className="flex items-center justify-center h-24 border-b border-gray-100 px-4">
        <div className="flex items-center gap-3">
          <img
            src={benefit.logo}
            alt={`${benefit.name} logo`}
            className="h-8 w-8 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.fallback-icon')) {
                const fallback = document.createElement('div');
                fallback.className = 'fallback-icon h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm';
                fallback.textContent = benefit.name.charAt(0);
                parent.prepend(fallback);
              }
            }}
            data-testid={`img-logo-${benefit.id}`}
          />
          <span className="text-xl font-bold text-gray-900 tracking-tight" data-testid={`text-name-${benefit.id}`}>
            {benefit.name}
          </span>
        </div>
      </div>

      <div className="px-5 pt-4 pb-5 flex flex-col flex-1">
        <div className="mb-3">
          <span
            className={`inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm ${color.bg} ${color.text}`}
            data-testid={`badge-category-${benefit.id}`}
          >
            {benefit.category}
          </span>
        </div>

        <p className="text-sm font-semibold text-gray-900 mb-1.5" data-testid={`text-discount-${benefit.id}`}>
          {benefit.discount}
        </p>

        <p
          className="text-[13px] text-gray-500 leading-relaxed mb-4 flex-1"
          style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          data-testid={`text-description-${benefit.id}`}
        >
          {displayDescription}
        </p>

        <div className="flex items-center gap-3 mt-auto">
          <a
            href={benefit.dealUrl}
            className="inline-flex items-center text-sm font-semibold text-red-500 hover:text-red-600 border border-red-200 rounded-lg px-4 py-2 hover:bg-red-50 transition-colors"
            data-testid={`link-get-deal-${benefit.id}`}
          >
            {benefit.ctaLabel}
          </a>
          <button
            onClick={() => onLearnMore(benefit)}
            className="text-sm font-medium text-gray-500 hover:text-gray-700 underline underline-offset-2 transition-colors"
            data-testid={`button-learn-more-${benefit.id}`}
          >
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
}

function BenefitDetailModal({ benefit, open, onClose }: { benefit: BenefitAPI | null; open: boolean; onClose: () => void }) {
  if (!benefit) return null;
  const color = categoryColors[benefit.category] || { bg: 'bg-gray-100', text: 'text-gray-700' };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="sm:max-w-lg" data-testid="modal-benefit-detail">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <img
              src={benefit.logo}
              alt={`${benefit.name} logo`}
              className="h-10 w-10 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <DialogTitle className="text-xl font-bold text-gray-900" data-testid="modal-title">
              {benefit.name}
            </DialogTitle>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm ${color.bg} ${color.text}`}>
              {benefit.category}
            </span>
            <span className="text-sm font-semibold text-gray-900">{benefit.discount}</span>
          </div>
          <DialogDescription className="text-sm text-gray-600 leading-relaxed" data-testid="modal-description">
            {benefit.fullDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex items-center gap-3">
          <a
            href={benefit.dealUrl}
            className="inline-flex items-center text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg px-6 py-2.5 transition-colors"
            data-testid="modal-get-deal"
          >
            {benefit.ctaLabel}
          </a>
          <DialogClose asChild>
            <button
              className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              data-testid="modal-close"
            >
              Close
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages - 2, totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 2, 3, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-10 py-5" data-testid="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        data-testid="button-previous-page"
      >
        &larr; Previous
      </button>

      <div className="flex items-center gap-0.5">
        {getPageNumbers().map((page, idx) =>
          typeof page === 'string' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm select-none">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
              data-testid={`button-page-${page}`}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        data-testid="button-next-page"
      >
        Next &rarr;
      </button>
    </div>
  );
}

export default function BenefitsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBenefit, setSelectedBenefit] = useState<BenefitAPI | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: benefits = [], isLoading } = useQuery<BenefitAPI[]>({
    queryKey: ['/api/benefits'],
    queryFn: async () => {
      const res = await fetch('/api/benefits');
      if (!res.ok) throw new Error('Failed to fetch benefits');
      return res.json();
    },
  });

  const filteredBenefits = useMemo(() => {
    if (activeCategory === 'All') return benefits;
    return benefits.filter((b) => b.category === activeCategory);
  }, [activeCategory, benefits]);

  const totalPages = Math.ceil(filteredBenefits.length / ITEMS_PER_PAGE);
  const paginatedBenefits = filteredBenefits.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleLearnMore = (benefit: BenefitAPI) => {
    setSelectedBenefit(benefit);
    setModalOpen(true);
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto" data-testid="benefits-page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="text-benefits-title">
          Opus <span className="italic font-extrabold text-gray-900">Benefits</span>
        </h1>
        <p className="text-sm text-gray-500 max-w-3xl leading-relaxed" data-testid="text-benefits-subtitle">
          We&apos;ve selected partners who understand what entrepreneurs and business owners need most. These offers are handpicked to add real value to your business journey&mdash;saving you time, money, and effort.
        </p>
      </div>

      <div className="flex flex-wrap gap-0 mb-8" data-testid="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeCategory === cat
                ? 'text-gray-900 border-gray-900'
                : 'text-gray-400 border-transparent hover:text-gray-600 hover:border-gray-300'
            }`}
            data-testid={`tab-${cat.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" data-testid="benefits-grid-skeleton">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
              <div className="h-24 bg-gray-100 border-b border-gray-100" />
              <div className="px-5 pt-4 pb-5 space-y-3">
                <div className="h-5 w-24 bg-gray-100 rounded" />
                <div className="h-4 w-16 bg-gray-100 rounded" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                </div>
                <div className="h-9 w-20 bg-gray-100 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          data-testid="benefits-grid"
        >
          {paginatedBenefits.map((benefit) => (
            <BenefitCard key={benefit.id} benefit={benefit} onLearnMore={handleLearnMore} />
          ))}
        </div>
      )}

      {!isLoading && filteredBenefits.length === 0 && (
        <div className="text-center py-16 text-gray-400" data-testid="text-no-benefits">
          No benefits available in this category yet.
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <BenefitDetailModal
        benefit={selectedBenefit}
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedBenefit(null); }}
      />
    </div>
  );
}
