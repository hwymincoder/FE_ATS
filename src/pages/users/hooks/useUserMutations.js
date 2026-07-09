import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { extractErrorMessage } from '@/lib/extract-error';
import { USER_QUERY_KEYS } from '@/pages/users/constants';
import {
  createUser,
  deleteUser,
  toggleUserStatus,
  updateUser,
} from '@/pages/users/services/user-service';

export function useCreateUser(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      toast.success('Thêm người dùng thành công');
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      options.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, 'Thêm người dùng thất bại'));
    },
  });
}

export function useUpdateUser(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateUser(id, payload),
    onSuccess: (data, variables) => {
      toast.success('Cập nhật người dùng thành công');
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.detail(variables.id) });
      options.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, 'Cập nhật người dùng thất bại'));
    },
  });
}

export function useDeleteUser(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('Xóa người dùng thành công');
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      options.onSuccess?.();
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, 'Xóa người dùng thất bại'));
    },
  });
}

export function useToggleUserStatus(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleUserStatus,
    onSuccess: (data) => {
      toast.success('Cập nhật trạng thái người dùng thành công');
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.detail(data.id) });
      }
      options.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, 'Cập nhật trạng thái người dùng thất bại'));
    },
  });
}
