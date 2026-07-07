import { http } from '@/lib/http';
import { DEPARTMENT_ENDPOINTS } from '@/pages/departments/constants';

const buildListParams = (params = {}) => {
  const pageValue = Number.isInteger(params.page) ? params.page : Number(params.page) || 1;
  const page = Math.max(pageValue, 1);
  const sizeValue = params.size ?? params.pageSize;
  const size = Number.isInteger(sizeValue) ? sizeValue : Number(sizeValue) || 10;

  return {
    ...(params.keyword ? { keyword: params.keyword } : {}),
    page,
    size,
  };
};


export const fetchDepartmentList = async (params) => {
  const requestParams = buildListParams(params);
  const response = await http.get(DEPARTMENT_ENDPOINTS.LIST, { params: requestParams });
  if (Array.isArray(response)) {
    return {
      data: response,
      total: response.length,
      page: requestParams.page,
      pageSize: requestParams.size,
      totalPages: response.length ? 1 : 0,
    };
  }
  return {
    data: response?.items ?? response?.data ?? [],
    total: response?.totalItems ?? response?.total ?? 0,
    page: response?.page ?? requestParams.page,
    pageSize: response?.size ?? response?.pageSize ?? requestParams.size,
    totalPages: response?.totalPages,
    hasNext: response?.hasNext,
    hasPrevious: response?.hasPrevious,
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
  const response = await http.get(DEPARTMENT_ENDPOINTS.LIST, {
    params: { page: 1, size: 1000 },
  });
  return Array.isArray(response) ? response : response?.items ?? response?.data ?? [];
};

export const departmentService = {
  fetchDepartmentList,
  fetchDepartmentDetail,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  fetchDepartmentSelection,
};
