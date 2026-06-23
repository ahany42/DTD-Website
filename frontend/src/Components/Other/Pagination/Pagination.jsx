import { useEffect, useMemo, useCallback } from "react";
import { Button } from "@radix-ui/themes";

/* 🔹 Pagination range logic */
function getPaginationRange(current, total) {
  const delta = 4;
  const range = [];
  const rangeWithDots = [];
  let lastPage;

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (lastPage) {
      if (i - lastPage === 2) {
        rangeWithDots.push(lastPage + 1);
      } else if (i - lastPage > 2) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    lastPage = i;
  }

  return rangeWithDots;
}

export default function Pagination({ pagination, onPageChange }) {
  const page = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 0;

  // ✅ Scroll to top on page change
  useEffect(() => {
    if (totalPages > 1) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, totalPages]);

  if (!pagination || totalPages <= 1) return null;

  // Memoize pages to avoid recalculating on every render
  const pages = useMemo(
    () => getPaginationRange(page, totalPages),
    [page, totalPages]
  );

  // Memoized handlers to prevent recreating inline functions
  const handlePrev = useCallback(
    () => onPageChange(page - 1),
    [onPageChange, page]
  );
  const handleNext = useCallback(
    () => onPageChange(page + 1),
    [onPageChange, page]
  );
  const handlePageClick = useCallback(
    (p) => () => onPageChange(p),
    [onPageChange]
  );

  return (
    <div className="pagination">
      {/* Prev */}
      <Button
        size="2"
        variant="soft"
        color="teal"
        disabled={page === 1}
        onClick={handlePrev}
        aria-label="Previous"
      >
        Prev
      </Button>

      {/* Page numbers */}
      {pages.map((p, index) =>
        p === "..." ? (
          <span
            key={`dots-${index}`}
            className="pagination-dots"
          >
            ...
          </span>
        ) : (
          <Button
            key={p}
            size="2"
            variant={p === page ? "surface" : "soft"}
            color="teal"
            onClick={handlePageClick(p)}
            aria-label={`Page ${p}`}
          >
            {p}
          </Button>
        )
      )}

      {/* Next */}
      <Button
        size="2"
        variant="soft"
        color="teal"
        disabled={page === totalPages}
        onClick={handleNext}
        aria-label="Next"
      >
        Next
      </Button>
    </div>
  );
}
