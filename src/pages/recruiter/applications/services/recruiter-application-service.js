import { http } from '@/lib/http';
import { RECRUITER_APPLICATION_ENDPOINTS } from '@/pages/recruiter/applications/constants';

export function fetchRecruiterApplicationDetail(applicationId) {
    return http.get(RECRUITER_APPLICATION_ENDPOINTS.DETAIL(applicationId));
}

export function moveRecruiterApplicationStage(applicationId, payload) {
    return http.patch(RECRUITER_APPLICATION_ENDPOINTS.MOVE_STAGE(applicationId), payload);
}

export function reviewRecruiterApplication(applicationId, payload) {
    return http.post(RECRUITER_APPLICATION_ENDPOINTS.REVIEW(applicationId), payload);
}

export function createRecruiterApplicationInterview(applicationId, payload) {
    return http.post(RECRUITER_APPLICATION_ENDPOINTS.CREATE_INTERVIEW(applicationId), payload);
}

export function updateRecruiterApplicationInterview(applicationId, interviewId, payload) {
    return http.put(RECRUITER_APPLICATION_ENDPOINTS.UPDATE_INTERVIEW(applicationId, interviewId), payload);
}
