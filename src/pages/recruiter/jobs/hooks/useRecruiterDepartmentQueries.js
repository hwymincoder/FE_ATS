import { useQuery } from '@tanstack/react-query';

import { RECRUITER_DEPARTMENT_QUERY_KEYS } from '../constants';
import { fetchRecruiterDepartmentSelection } from '../services/recruiter-department-service';

export function useRecruiterDepartmentSelection() {
    return useQuery({
        queryKey: RECRUITER_DEPARTMENT_QUERY_KEYS.selection,
        queryFn: fetchRecruiterDepartmentSelection,
        staleTime: 1000 * 60 * 5,
    });
}
