import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { extractErrorMessage } from '@/lib/extract-error';
import { UPGRADE_PACKAGE_QUERY_KEYS } from '@/pages/upgrade-packages/constants';
import {
  createUpgradePackage,
  deleteUpgradePackage,
  updateUpgradePackage,
} from '@/pages/upgrade-packages/services/upgrade-package-service';

export function useCreateUpgradePackage(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUpgradePackage,
    onSuccess: (data) => {
      toast.success('Thêm mới gói nâng cấp thành công');
      queryClient.invalidateQueries({ queryKey: UPGRADE_PACKAGE_QUERY_KEYS.lists() });
      options.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, 'Thêm mới gói nâng cấp thất bại'));
    },
  });
}

export function useUpdateUpgradePackage(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateUpgradePackage(id, payload),
    onSuccess: (data, variables) => {
      toast.success('Cập nhật gói nâng cấp thành công');
      queryClient.invalidateQueries({ queryKey: UPGRADE_PACKAGE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: UPGRADE_PACKAGE_QUERY_KEYS.detail(variables.id) });
      options.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, 'Cập nhật gói nâng cấp thất bại'));
    },
  });
}

export function useDeleteUpgradePackage(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUpgradePackage,
    onSuccess: () => {
      toast.success('Xóa gói nâng cấp thành công');
      queryClient.invalidateQueries({ queryKey: UPGRADE_PACKAGE_QUERY_KEYS.lists() });
      options.onSuccess?.();
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, 'Xóa gói nâng cấp thất bại'));
    },
  });
}
