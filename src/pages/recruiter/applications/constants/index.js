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

export const APPLICATION_PRIORITY = {
    STANDARD: 0,
    PRO: 1,
    PREMIUM: 2,
};

export function getApplicationPriorityLabel(priority) {
    const normalizedPriority = Number(priority ?? 0);

    if (normalizedPriority >= APPLICATION_PRIORITY.PREMIUM) {
        return 'PREMIUM';
    }

    if (normalizedPriority >= APPLICATION_PRIORITY.PRO) {
        return 'PRO';
    }

    return null;
}

export function getApplicationPriorityBadgeVariant(priority) {
    const normalizedPriority = Number(priority ?? 0);

    if (normalizedPriority >= APPLICATION_PRIORITY.PREMIUM) {
        return 'default';
    }

    if (normalizedPriority >= APPLICATION_PRIORITY.PRO) {
        return 'secondary';
    }

    return null;
}

export function getApplicationPriorityDisplayLabel(priority) {
    return getApplicationPriorityLabel(priority) ?? 'Thường';
}
