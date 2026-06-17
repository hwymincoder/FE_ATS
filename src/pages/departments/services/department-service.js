import { http } from '@/lib/http';
import { DEPARTMENT_ENDPOINTS } from '@/pages/departments/constants';


export const fetchDepartmentList = async (params) => {
  const response = await http.get(DEPARTMENT_ENDPOINTS.LIST, { params });
  if (Array.isArray(response)) {
    return {
      data: response,
      total: response.length,
      page: 1,
      pageSize: response.length,
    };
  }
  return {
    data: response?.data ?? [],
    total: response?.total ?? 0,
    page: response?.page ?? 1,
    pageSize: response?.pageSize ?? params.pageSize,
  };
};

export const fetchDepartmentDetail = async (id) => {
  return http.get(DEPARTMENT_ENDPOINTS.DETAIL(id));
};

export const createDepartment = async (data) => {
  return http.post(DEPARTMENT_ENDPOINTS.CREATE, data);
};


export const updateDepartment = async (id, data) => {
  return http.put(DEPARTMENT_ENDPOINTS.UPDATE(id), data);
};

export const deleteDepartment = async (id) => {
  return http.delete(DEPARTMENT_ENDPOINTS.DELETE(id));
};

export const fetchDepartmentSelection = async () => {
  const response = await http.get(DEPARTMENT_ENDPOINTS.LIST);
  return Array.isArray(response) ? response : response?.data ?? [];
};

export const departmentService = {
  fetchDepartmentList,
  fetchDepartmentDetail,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  fetchDepartmentSelection,
};
