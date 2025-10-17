import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomPaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
  onViewAll?: () => void;
}

const CustomPagination = ({
  current,
  pageSize,
  total,
  onChange,
  onViewAll,
}: CustomPaginationProps) => {
  const { t, i18n } = useTranslation();
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, current - 1);
      const end = Math.min(totalPages - 1, current + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (current < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {/* Previous Button */}
      <button
        onClick={() => onChange(current - 1, pageSize)}
        disabled={current <= 1}
        className="flex items-center justify-center w-8 h-8 border border-primary rounded-lg bg-white text-primary hover:bg-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        {i18n.language === 'ar' ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Page Numbers */}
      {visiblePages.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
              ...
            </span>
          );
        }

        const pageNumber = page as number;
        const isCurrentPage = pageNumber === current;

        return (
          <button
            key={pageNumber}
            onClick={() => onChange(pageNumber, pageSize)}
            className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
              isCurrentPage
                ? 'bg-primary text-white'
                : 'border border-primary bg-white text-primary hover:bg-primary/50'
            }`}
            aria-label={`Go to page ${pageNumber}`}
            aria-current={isCurrentPage ? 'page' : undefined}
          >
            {pageNumber}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onChange(current + 1, pageSize)}
        disabled={current >= totalPages}
        className="flex items-center justify-center w-8 h-8 border border-primary rounded-lg bg-white text-primary hover:bg-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        {i18n.language === 'ar' ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {/* View All Button */}
      {onViewAll && (
        <button
          onClick={onViewAll}
          className="ml-4 px-4 py-2 bg-gray-100 text-primary rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          {t('common.buttons.viewAll')}
        </button>
      )}
    </div>
  );
};

export default CustomPagination;
