import { useQuery } from '@tanstack/react-query';

import { USER_QUERY_KEYS } from '@/pages/users/constants';
import {
  fetchUserDetail,
  fetchUserRoles,
  fetchUserStatuses,
  fetchUsers,
} from '@/pages/users/services/user-service';

export function useUserList(params) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.list(JSON.stringify(params ?? {})),
    queryFn: () => fetchUsers(params),
    staleTime: 1000 * 60,
  });
}

export function useUserDetail(id) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.detail(id),
    queryFn: () => fetchUserDetail(id),
    enabled: Boolean(id),
  });
}

export function useUserRoles() {
  return useQuery({
    queryKey: USER_QUERY_KEYS.roles,
    queryFn: fetchUserRoles,
    staleTime: 1000 * 60 * 10,
  });
}

export function useUserStatuses() {
  return useQuery({
    queryKey: USER_QUERY_KEYS.statuses,
    queryFn: fetchUserStatuses,
    staleTime: 1000 * 60 * 10,
  });
}
