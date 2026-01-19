interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onSelectPage: (page: number) => void;
  disabled?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onSelectPage,
  disabled = false,
}: PaginationProps) {
  const pages = buildPages(currentPage, totalPages);

  return (
    <div className="flex items-center justify-end border-t border-slate-200 min-h-[48px] px-4 py-1">
      <div className="flex gap-2" role="navigation" aria-label="Пагинация">
        {pages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="min-w-10 bg-white border border-[#CED5DE] text-center rounded-md px-3 py-2 text-sm font-medium text-slate-400"
                aria-hidden="true"
              >
                …
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              disabled={disabled || isActive}
              onClick={() => onSelectPage(page)}
              className={`min-w-10 rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-[#F2F5F8] text-[#1F2939] border border-[#CED5DE]'
                  : disabled
                    ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                    : 'bg-white cursor-pointer text-[#1F2939] border border-[#CED5DE] hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function buildPages(currentPage: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }).map((_, index) => index + 1);
  }

  const pages: Array<number | 'ellipsis'> = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    pages.push('ellipsis');
  }

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages - 1) {
    pages.push('ellipsis');
  }

  pages.push(totalPages);

  return pages;
}
