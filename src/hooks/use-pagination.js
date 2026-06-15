import { useMemo, useState } from 'react';

export function usePagination({ total, pageSize = 10 } = {}) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(pageSize);

  const offset = useMemo(() => (page - 1) * size, [page, size]);

  return {
    page,
    size,
    offset,
    setPage,
    setSize,
  };
}
