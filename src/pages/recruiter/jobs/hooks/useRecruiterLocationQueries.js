import { useQuery } from '@tanstack/react-query';

import { RECRUITER_LOCATION_QUERY_KEYS } from '../constants';
import { fetchVietnamProvinces } from '../services/recruiter-location-service';

export function useVietnamProvinces() {
    return useQuery({
        queryKey: RECRUITER_LOCATION_QUERY_KEYS.provinces,
        queryFn: fetchVietnamProvinces,
        staleTime: 1000 * 60 * 60 * 24,
    });
}
