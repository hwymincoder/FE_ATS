import { http } from '@/lib/http';
import { RECRUITER_DEPARTMENT_ENDPOINTS } from '../constants';

export async function fetchRecruiterDepartmentSelection() {
    const response = await http.get(RECRUITER_DEPARTMENT_ENDPOINTS.LIST, {
        params: { page: 1, size: 1000 },
    });

    return Array.isArray(response) ? response : response?.items ?? response?.data ?? [];
}
