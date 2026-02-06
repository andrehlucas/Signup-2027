'use client';

import { useState, useMemo } from 'react';
import { benefits, categories, type Category, type Benefit } from './benefitsData';

const ITEMS_PER_PAGE = 12;

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  'Business Tools': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Setup Your Business': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Marketing Tools': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Shipping Deals': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Travel': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
};

function BenefitCard({ benefit }: { benefit: Benefit }) {
  const color = categoryColors[benefit.category] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
      data-testid={`benefit-card-${benefit.id}`}
    >
      <div className="flex items-center justify-center h-24 border-b border-gray-100 px-4">
        <span className="text-3xl mr-2.5">{benefit.logo}</span>
        <span className="text-xl font-bold text-gray-900 tracking-tight">{benefit.name}</span>
      </div>

      <div className="px-5 pt-4 pb-5 flex flex-col flex-1">
        <div className="mb-3">
          <span
            className={`inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded ${color.bg} ${color.text}`}
            data-testid={`badge-category-${benefit.id}`}
          >
            {benefit.category}
          </span>
        </div>

        <p className="text-sm font-semibold text-gray-900 mb-1.5" data-testid={`text-discount-${benefit.id}`}>
          {benefit.discount}
        </p>

        <p className="text-[13px] text-gray-500 leading-relaxed mb-5 flex-1" data-testid={`text-description-${benefit.id}`}>
          {benefit.description}
        </p>

        <a
          href={benefit.dealUrl}
          className="inline-flex items-center text-sm font-semibold text-red-500 hover:text-red-600 border border-red-200 rounded-lg px-4 py-2 w-fit hover:bg-red-50 transition-colors"
          data-testid={`link-get-deal-${benefit.id}`}
        >
          Get Deal
        </a>
      </div>
    </div>
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

  const filteredBenefits = useMemo(() => {
    if (activeCategory === 'All') return benefits;
    return benefits.filter((b) => b.category === activeCategory);
  }, [activeCategory]);

  const totalPages = Math.ceil(filteredBenefits.length / ITEMS_PER_PAGE);
  const paginatedBenefits = filteredBenefits.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto" data-testid="benefits-page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="text-benefits-title">
          Opus <span className="italic font-extrabold text-gray-900">Benefits</span>
        </h1>
        <p className="text-sm text-gray-500 max-w-3xl leading-relaxed" data-testid="text-benefits-subtitle">
          We&apos;ve selected partners who understand what entrepreneurs and business owners need most. These offers are handpicked to add real value to your business journey—saving you time, money, and effort.
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

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        data-testid="benefits-grid"
      >
        {paginatedBenefits.map((benefit) => (
          <BenefitCard key={benefit.id} benefit={benefit} />
        ))}
      </div>

      {filteredBenefits.length === 0 && (
        <div className="text-center py-16 text-gray-400" data-testid="text-no-benefits">
          No benefits available in this category yet.
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
