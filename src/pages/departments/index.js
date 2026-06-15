export { default as DepartmentList } from './components/DepartmentList';
export { default as DepartmentForm } from './components/DepartmentForm';
export { departmentService } from './services/department-service';
export {
  useDepartmentList,
  useDepartmentById,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
} from './services/department-queries';
export { DEPARTMENT_ENDPOINTS, DEPARTMENT_ROUTES, DEPARTMENT_QUERY_KEYS } from './constants';
