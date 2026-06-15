import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { departmentService } from '@/pages/departments/services/department-service';
import { DEPARTMENT_QUERY_KEYS } from '@/pages/departments/constants';
import { extractErrorMessage } from '@/lib/extract-error';

export function useDepartmentList() {
  return useQuery({
    queryKey: DEPARTMENT_QUERY_KEYS.all,
    queryFn: () => departmentService.getList(),
  });
}

export function useDepartmentById(id) {
  return useQuery({
    queryKey: DEPARTMENT_QUERY_KEYS.detail(id),
    queryFn: () => departmentService.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateDepartment(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => departmentService.create(payload),
    onSuccess: (data) => {
      toast.success(options.successMessage || 'Thêm mới thành công');
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEYS.all });
      options.onSuccess?.(data);
    },
    onError: (error) =>
      toast.error(extractErrorMessage(error, options.errorMessage || 'Thêm mới thất bại')),
    ...options,
  });
}

export function useUpdateDepartment(id, options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => departmentService.update(id, payload),
    onSuccess: (data) => {
      toast.success(options.successMessage || 'Cập nhật thành công');
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEYS.detail(id) });
      options.onSuccess?.(data);
    },
    onError: (error) =>
      toast.error(extractErrorMessage(error, options.errorMessage || 'Cập nhật thất bại')),
    ...options,
  });
}

export function useDeleteDepartment(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => departmentService.remove(id),
    onSuccess: () => {
      toast.success(options.successMessage || 'Đã xóa');
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEYS.all });
      options.onSuccess?.();
    },
    onError: (error) =>
      toast.error(extractErrorMessage(error, options.errorMessage || 'Xóa thất bại')),
    ...options,
  });
}
