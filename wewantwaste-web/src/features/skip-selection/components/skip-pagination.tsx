import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";
import { Skeleton } from "../../../components/ui/skeleton";

export const SkipPagination = ({
  currentPage,
  totalPages,
  handlePageChange,
  loading,
}: {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  loading: boolean;
}) => {
  if (loading) {
    return (
      <div className="sticky bottom-0 bg-background border-t p-4">
        <Skeleton className="h-10 w-full max-w-[400px] mx-auto" />
      </div>
    );
  }

  return (
    <div className="sticky bottom-0 bg-off-white-50 border-t border-medium-gray-100 p-4 max-w-screen">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            />
          </PaginationItem>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNumber = i + 1;
            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  isActive={pageNumber === currentPage}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {totalPages > 5 && currentPage > 3 && (
            <PaginationItem>
              <PaginationLink>...</PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
