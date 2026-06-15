import { http } from '@/lib/http';
import { DEPARTMENT_ENDPOINTS } from '@/pages/departments/constants';

export const departmentService = {
  async getList() {
    return http.get(DEPARTMENT_ENDPOINTS.LIST);
  },
  async getById(id) {
    return http.get(DEPARTMENT_ENDPOINTS.DETAIL(id));
  },
  async create(data) {
    return http.post(DEPARTMENT_ENDPOINTS.CREATE, data);
  },
  async update(id, data) {
    return http.put(DEPARTMENT_ENDPOINTS.UPDATE(id), data);
  },
  async remove(id) {
    return http.delete(DEPARTMENT_ENDPOINTS.DELETE, { data: { id } });
  },
};
