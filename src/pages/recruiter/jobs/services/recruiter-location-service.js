import { RECRUITER_LOCATION_ENDPOINTS } from '../constants';

export async function fetchVietnamProvinces() {
    const response = await fetch(RECRUITER_LOCATION_ENDPOINTS.PROVINCES);

    if (!response.ok) {
        throw new Error('Không thể tải danh sách tỉnh/thành');
    }

    const provinces = await response.json();

    return Array.isArray(provinces)
        ? provinces.map((province) => ({
            code: province.code,
            name: province.name,
        }))
        : [];
}
