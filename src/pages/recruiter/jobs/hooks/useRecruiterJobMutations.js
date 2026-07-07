import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { RECRUITER_JOB_QUERY_KEYS } from '@/pages/recruiter/jobs/constants';
import {
    createRecruiterJob,
    deleteRecruiterJob,
    updateRecruiterJob,
} from '@/pages/recruiter/jobs/services/recruiter-job-service';
import { extractErrorMessage } from '@/lib/extract-error';

export function useCreateRecruiterJob(options = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createRecruiterJob,
        onSuccess: (data) => {
            toast.success('Tạo job thành công');
            queryClient.invalidateQueries({ queryKey: RECRUITER_JOB_QUERY_KEYS.lists() });
            options.onSuccess?.(data);
        },
        onError: (error) => {
            toast.error(extractErrorMessage(error, 'Tạo job thất bại'));
        },
    });
}

export function useUpdateRecruiterJob(options = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }) => updateRecruiterJob(id, payload),
        onSuccess: (data, variables) => {
            toast.success('Cập nhật job thành công');
            queryClient.invalidateQueries({ queryKey: RECRUITER_JOB_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({
                queryKey: RECRUITER_JOB_QUERY_KEYS.detail(variables.id),
            });
            options.onSuccess?.(data);
        },
        onError: (error) => {
            toast.error(extractErrorMessage(error, 'Cập nhật job thất bại'));
        },
    });
}

export function useDeleteRecruiterJob(options = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteRecruiterJob,
        onSuccess: () => {
            toast.success('Xóa job thành công');
            queryClient.invalidateQueries({ queryKey: RECRUITER_JOB_QUERY_KEYS.lists() });
            options.onSuccess?.();
        },
        onError: (error) => {
            toast.error(extractErrorMessage(error, 'Xóa job thất bại'));
        },
    });
}