import { http } from '@/lib/http';
import { USER_ENDPOINTS } from '@/pages/users/constants';

const normalizeListResponse = (response, params = {}) => {
  if (Array.isArray(response)) {
    return {
      data: response,
      total: response.length,
      page: params.page ?? 1,
      pageSize: params.size ?? 10,
      totalPages: response.length ? 1 : 0,
    };
  }

  const data = response?.items ?? response?.data ?? response?.content ?? [];
  return {
    data,
    total: response?.totalItems ?? response?.total ?? response?.totalElements ?? data.length,
    page: response?.page ?? response?.number ?? params.page ?? 1,
    pageSize: response?.size ?? response?.pageSize ?? params.size ?? 10,
    totalPages: response?.totalPages ?? 0,
  };
};

const buildListParams = (params = {}) => ({
  ...(params.keyword ? { keyword: params.keyword } : {}),
  ...(params.role ? { role: params.role } : {}),
  ...(params.status ? { status: params.status } : {}),
  page: params.page ?? 1,
  size: params.size ?? 10,
});

export async function fetchUsers(params) {
  const requestParams = buildListParams(params);
  const response = await http.get(USER_ENDPOINTS.LIST, { params: requestParams });
  return normalizeListResponse(response, requestParams);
}

export async function fetchUserRoles() {
  const response = await http.get(USER_ENDPOINTS.ROLES);
  return Array.isArray(response) ? response : [];
}

export async function fetchUserStatuses() {
  const response = await http.get(USER_ENDPOINTS.STATUSES);
  return Array.isArray(response) ? response : [];
}

export function fetchUserDetail(id) {
  return http.get(USER_ENDPOINTS.DETAIL(id));
}

export function createUser(payload) {
  return http.post(USER_ENDPOINTS.CREATE, payload);
}

export function updateUser(id, payload) {
  return http.put(USER_ENDPOINTS.UPDATE(id), payload);
}

export function toggleUserStatus(id) {
  return http.patch(USER_ENDPOINTS.TOGGLE_STATUS(id));
}

export function deleteUser(id) {
  return http.delete(USER_ENDPOINTS.DELETE(id));
}
