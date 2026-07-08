import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { extractErrorMessage } from '@/lib/extract-error';
import { RECRUITER_APPLICATION_QUERY_KEYS } from '@/pages/recruiter/applications/constants';
import {
    createRecruiterApplicationInterview,
    moveRecruiterApplicationStage,
    updateRecruiterApplicationInterview,
} from '@/pages/recruiter/applications/services/recruiter-application-service';
import { RECRUITER_JOB_QUERY_KEYS } from '@/pages/recruiter/jobs/constants';

export function useMoveRecruiterApplicationStage(options = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ applicationId, toStageId }) =>
            moveRecruiterApplicationStage(applicationId, { toStageId }),
        onSuccess: (data, variables) => {
            toast.success('Đã chuyển stage ứng viên');
            queryClient.invalidateQueries({
                queryKey: RECRUITER_APPLICATION_QUERY_KEYS.detail(variables.applicationId),
            });
            if (variables.jobId) {
                queryClient.invalidateQueries({
                    queryKey: RECRUITER_JOB_QUERY_KEYS.kanban(variables.jobId),
                });
            }
            options.onSuccess?.(data, variables);
        },
        onError: (error) => {
            toast.error(extractErrorMessage(error, 'Chuyển stage thất bại'));
        },
    });
}

export function useCreateRecruiterApplicationInterview(options = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ applicationId, payload }) =>
            createRecruiterApplicationInterview(applicationId, payload),
        onSuccess: (data, variables) => {
            toast.success('Đã lên lịch phỏng vấn');
            queryClient.invalidateQueries({
                queryKey: RECRUITER_APPLICATION_QUERY_KEYS.detail(variables.applicationId),
            });
            if (variables.jobId) {
                queryClient.invalidateQueries({
                    queryKey: RECRUITER_JOB_QUERY_KEYS.kanban(variables.jobId),
                });
            }
            options.onSuccess?.(data, variables);
        },
        onError: (error) => {
            toast.error(extractErrorMessage(error, 'Lên lịch phỏng vấn thất bại'));
        },
    });
}

export function useUpdateRecruiterApplicationInterview(options = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ applicationId, interviewId, payload }) =>
            updateRecruiterApplicationInterview(applicationId, interviewId, payload),
        onSuccess: (data, variables) => {
            toast.success('Đã cập nhật lịch phỏng vấn');
            queryClient.invalidateQueries({
                queryKey: RECRUITER_APPLICATION_QUERY_KEYS.detail(variables.applicationId),
            });
            if (variables.jobId) {
                queryClient.invalidateQueries({
                    queryKey: RECRUITER_JOB_QUERY_KEYS.kanban(variables.jobId),
                });
            }
            options.onSuccess?.(data, variables);
        },
        onError: (error) => {
            toast.error(extractErrorMessage(error, 'Cập nhật lịch phỏng vấn thất bại'));
        },
    });
}
