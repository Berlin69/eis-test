import {Ellipsis} from "./ellipsis.tsx";
import {buildPages} from "../../utils/helpers/build-pages.ts";

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
  const pages = buildPages(currentPage, totalPages)

  return (
    <div className="flex items-center justify-end border-t border-slate-200 min-h-[48px] px-4 py-1">
      <div className="flex gap-2" role="navigation" aria-label="Пагинация">
        {pages.map((page, index) => {
          if (page === 'ellipsis') {
            return <Ellipsis key={`ellipsis-${index}`} totalPages={totalPages} onSelectPage={onSelectPage} />
          }

          const isActive = page === currentPage

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
          )
        })}
      </div>
    </div>
  )
}




