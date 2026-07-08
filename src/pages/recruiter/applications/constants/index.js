export const RECRUITER_APPLICATION_ENDPOINTS = {
    DETAIL: (applicationId) => `/api/recruiter/applications/${applicationId}`,
    MOVE_STAGE: (applicationId) => `/api/recruiter/applications/${applicationId}/stage`,
    REVIEW: (applicationId) => `/api/recruiter/applications/${applicationId}/review`,
    CREATE_INTERVIEW: (applicationId) => `/api/recruiter/applications/${applicationId}/interviews`,
    UPDATE_INTERVIEW: (applicationId, interviewId) =>
        `/api/recruiter/applications/${applicationId}/interviews/${interviewId}`,
};

export const RECRUITER_APPLICATION_QUERY_KEYS = {
    all: ['recruiter-applications'],
    detail: (applicationId) => ['recruiter-applications', 'detail', String(applicationId)],
};
