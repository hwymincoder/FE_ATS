export const RECRUITER_APPLICATION_ENDPOINTS = {
    DETAIL: (applicationId) => `/recruiter/applications/${applicationId}`,
    MOVE_STAGE: (applicationId) => `/recruiter/applications/${applicationId}/stage`,
    REVIEW: (applicationId) => `/recruiter/applications/${applicationId}/review`,
    CREATE_INTERVIEW: (applicationId) => `/recruiter/applications/${applicationId}/interviews`,
    UPDATE_INTERVIEW: (applicationId, interviewId) =>
        `/recruiter/applications/${applicationId}/interviews/${interviewId}`,
};

export const RECRUITER_APPLICATION_QUERY_KEYS = {
    all: ['recruiter-applications'],
    detail: (applicationId) => ['recruiter-applications', 'detail', String(applicationId)],
};
