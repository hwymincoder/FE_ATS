import { useQuery } from '@tanstack/react-query';

import { RECRUITER_APPLICATION_QUERY_KEYS } from '@/pages/recruiter/applications/constants';
import { fetchRecruiterApplicationDetail } from '@/pages/recruiter/applications/services/recruiter-application-service';

export function useRecruiterApplicationDetail(applicationId) {
    return useQuery({
        queryKey: RECRUITER_APPLICATION_QUERY_KEYS.detail(applicationId),
        queryFn: () => fetchRecruiterApplicationDetail(applicationId),
        enabled: Boolean(applicationId),
    });
}
