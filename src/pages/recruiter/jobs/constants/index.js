export const RECRUITER_JOB_ENDPOINTS = {
    LIST: '/recruiter/jobs',
    DETAIL: (id) => `/recruiter/jobs/${id}`,
    CREATE: '/recruiter/jobs',
    UPDATE: (id) => `/recruiter/jobs/${id}`,
    DELETE: (id) => `/recruiter/jobs/${id}`,
    KANBAN: (id) => `/recruiter/jobs/${id}/kanban`,
    INTERVIEWERS: (id) => `/recruiter/jobs/${id}/interviewers`,
};

export const RECRUITER_DEPARTMENT_ENDPOINTS = {
    LIST: '/admin/departments',
};

export const RECRUITER_LOCATION_ENDPOINTS = {
    PROVINCES: 'https://provinces.open-api.vn/api/v2/',
};

export const RECRUITER_JOB_QUERY_KEYS = {
    all: ['recruiter-jobs'],
    lists: () => ['recruiter-jobs', 'list'],
    list: (params) => ['recruiter-jobs', 'list', params],
    detail: (id) => ['recruiter-jobs', 'detail', String(id)],
    kanban: (id) => ['recruiter-jobs', 'kanban', String(id)],
    interviewers: (id) => ['recruiter-jobs', 'interviewers', String(id)],
};

export const RECRUITER_DEPARTMENT_QUERY_KEYS = {
    selection: ['recruiter', 'departments', 'selection'],
};

export const RECRUITER_LOCATION_QUERY_KEYS = {
    provinces: ['recruiter', 'locations', 'provinces'],
};

export const DEFAULT_PAGE_SIZE = 10;

export const JOB_STATUS = {
    DRAFT: 'DRAFT',
    PUBLISHED: 'PUBLISHED',
    CLOSED: 'CLOSED',
};
