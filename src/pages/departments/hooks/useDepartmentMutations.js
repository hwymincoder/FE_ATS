import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DEPARTMENT_QUERY_KEYS } from '@/pages/departments/constants';
import { extractErrorMessage } from '@/lib/extract-error';
import {
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '@/pages/departments/services/department-service';


export const useCreateDepartment = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createDepartment(payload),
    onSuccess: (data) => {
      toast.success(options.successMessage || 'Thêm mới phòng ban thành công');
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEYS.lists() });
      options.onSuccess?.(data);
    },
    onError: (error) =>
      toast.error(extractErrorMessage(error, options.errorMessage || 'Thêm mới phòng ban thất bại')),
  });
};


export const useUpdateDepartment = (id, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => updateDepartment(id, payload),
    onSuccess: (data) => {
      toast.success(options.successMessage || 'Cập nhật phòng ban thành công');
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEYS.detail(id) });
      options.onSuccess?.(data);
    },
    onError: (error) =>
      toast.error(extractErrorMessage(error, options.errorMessage || 'Cập nhật phòng ban thất bại')),
  });
};


export const useDeleteDepartment = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteDepartment(id),
    onSuccess: () => {
      toast.success(options.successMessage || 'Đã xoá phòng ban');
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEYS.lists() });
      options.onSuccess?.();
    },
    onError: (error) =>
      toast.error(extractErrorMessage(error, options.errorMessage || 'Xoá phòng ban thất bại')),
  });
};
