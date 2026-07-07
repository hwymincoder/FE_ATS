import { http } from '@/lib/http';
import { RECRUITER_JOB_ENDPOINTS } from '../constants';

export async function fetchRecruiterJobs(params) {
    const response = await http.get(RECRUITER_JOB_ENDPOINTS.LIST, { params });

    return {
        data: response?.items ?? [],
        total: response?.totalItems ?? 0,
        page: response?.page ?? params?.page ?? 1,
        pageSize: response?.size ?? params?.size ?? 10,
        totalPages: response?.totalPages ?? 0,
    };
}

export function fetchRecruiterJobDetail(id) {
    return http.get(RECRUITER_JOB_ENDPOINTS.DETAIL(id));
}

export function createRecruiterJob(payload) {
    return http.post(RECRUITER_JOB_ENDPOINTS.CREATE, payload);
}

export function updateRecruiterJob(id, payload) {
    return http.put(RECRUITER_JOB_ENDPOINTS.UPDATE(id), payload);
}

export function deleteRecruiterJob(id) {
    return http.delete(RECRUITER_JOB_ENDPOINTS.DELETE(id));
}

export function fetchRecruiterJobKanban(id) {
    return http.get(RECRUITER_JOB_ENDPOINTS.KANBAN(id));
} 