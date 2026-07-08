import { useQuery } from '@tanstack/react-query';
import { RECRUITER_JOB_QUERY_KEYS } from '../constants';
import {
    fetchRecruiterJobs,
    fetchRecruiterJobDetail,
    fetchRecruiterJobInterviewers,
    fetchRecruiterJobKanban,
} from '../services/recruiter-job-service';

export function useRecruiterJobList(params) {
    return useQuery({
        queryKey: RECRUITER_JOB_QUERY_KEYS.list(JSON.stringify(params ?? {})),
        queryFn: () => fetchRecruiterJobs(params),
        staleTime: 1000 * 60,
    });
}

export function useRecruiterJobDetail(id) {
    return useQuery({
        queryKey: RECRUITER_JOB_QUERY_KEYS.detail(id),
        queryFn: () => fetchRecruiterJobDetail(id),
        enabled: Boolean(id),
    });
}

export function useRecruiterJobKanban(id) {
    return useQuery({
        queryKey: RECRUITER_JOB_QUERY_KEYS.kanban(id),
        queryFn: () => fetchRecruiterJobKanban(id),
        enabled: Boolean(id),
    });
}

export function useRecruiterJobInterviewers(id) {
    return useQuery({
        queryKey: RECRUITER_JOB_QUERY_KEYS.interviewers(id),
        queryFn: () => fetchRecruiterJobInterviewers(id),
        enabled: Boolean(id),
        staleTime: 1000 * 60,
    });
}
