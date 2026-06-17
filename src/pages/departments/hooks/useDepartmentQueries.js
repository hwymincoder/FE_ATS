import { useQuery } from '@tanstack/react-query';
import { DEPARTMENT_QUERY_KEYS } from '@/pages/departments/constants';
import {
  fetchDepartmentList,
  fetchDepartmentDetail,
  fetchDepartmentSelection,
} from '@/pages/departments/services/department-service';

/**
 * @param {{ keyword?: string, page: number, pageSize: number, sortField?: string, sortDirection?: 'asc'|'desc' }} params
 */
export const useDepartmentList = (params) => {
  return useQuery({
    queryKey: DEPARTMENT_QUERY_KEYS.list(JSON.stringify(params ?? {})),
    queryFn: () => fetchDepartmentList(params),
    staleTime: 1000 * 60 * 5,
  });
};

/** @param {number|string|null|undefined} id */
export const useDepartmentById = (id) => {
  return useQuery({
    queryKey: DEPARTMENT_QUERY_KEYS.detail(id),
    queryFn: () => fetchDepartmentDetail(id),
    enabled: Boolean(id),
  });
};

/** Hook dùng cho các dropdown chọn phòng ban ở các trang khác. */
export const useDepartmentSelection = () => {
  return useQuery({
    queryKey: ['departments', 'selection'],
    queryFn: fetchDepartmentSelection,
    staleTime: 1000 * 60 * 5,
  });
};
