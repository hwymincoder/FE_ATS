import { http } from '@/lib/http';
import { UPGRADE_PACKAGE_ENDPOINTS } from '@/pages/upgrade-packages/constants';

const normalizeListResponse = (response, params = {}) => {
  if (Array.isArray(response)) {
    return {
      data: response,
      total: response.length,
      page: params.page ?? 0,
      pageSize: params.size ?? 10,
      totalPages: response.length ? 1 : 0,
    };
  }

  const data = response?.items ?? response?.data ?? response?.content ?? [];
  return {
    data,
    total: response?.totalItems ?? response?.total ?? response?.totalElements ?? data.length,
    page: response?.page ?? response?.number ?? params.page ?? 0,
    pageSize: response?.size ?? response?.pageSize ?? params.size ?? 10,
    totalPages: response?.totalPages ?? 0,
  };
};

export async function fetchUpgradePackageList(params) {
  const requestParams = {
    page: params?.page ?? 1,
    size: params?.size ?? 10,
  };
  const response = await http.get(UPGRADE_PACKAGE_ENDPOINTS.LIST, { params: requestParams });
  return normalizeListResponse(response, requestParams);
}

export function fetchUpgradePackageDetail(id) {
  return http.get(UPGRADE_PACKAGE_ENDPOINTS.DETAIL(id));
}

export function createUpgradePackage(payload) {
  return http.post(UPGRADE_PACKAGE_ENDPOINTS.CREATE, payload);
}

export function updateUpgradePackage(id, payload) {
  return http.put(UPGRADE_PACKAGE_ENDPOINTS.UPDATE(id), payload);
}

export function deleteUpgradePackage(id) {
  return http.delete(UPGRADE_PACKAGE_ENDPOINTS.DELETE(id));
}
