import { useQuery } from '@tanstack/react-query';
import { UPGRADE_PACKAGE_QUERY_KEYS } from '@/pages/upgrade-packages/constants';
import {
  fetchUpgradePackageDetail,
  fetchUpgradePackageList,
} from '@/pages/upgrade-packages/services/upgrade-package-service';

export function useUpgradePackageList(params) {
  return useQuery({
    queryKey: UPGRADE_PACKAGE_QUERY_KEYS.list(JSON.stringify(params ?? {})),
    queryFn: () => fetchUpgradePackageList(params),
    staleTime: 1000 * 60,
  });
}

export function useUpgradePackageDetail(id) {
  return useQuery({
    queryKey: UPGRADE_PACKAGE_QUERY_KEYS.detail(id),
    queryFn: () => fetchUpgradePackageDetail(id),
    enabled: Boolean(id),
  });
}
