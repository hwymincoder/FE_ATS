/**
 * @typedef {Object} Department
 * @property {number} id
 * @property {number|null} parentId
 * @property {string} departmentName
 * @property {string} [description]
 *
 * @typedef {Object} DepartmentPayload
 * @property {string} departmentName
 * @property {string} [description]
 * @property {number|null} [parentId]
 *
 * @typedef {Object} DepartmentSearchCriteria
 * @property {string} [keyword]
 *
 * @typedef {Object} DepartmentPaginationRequest
 * @property {string} [keyword]
 * @property {number} page
 * @property {number} pageSize
 * @property {string} [sortField]
 * @property {'asc'|'desc'} [sortDirection]
 *
 * @typedef {Object} DepartmentPaginationResponse
 * @property {Department[]} data
 * @property {number} total
 * @property {number} page
 * @property {number} pageSize
 */

export {};
