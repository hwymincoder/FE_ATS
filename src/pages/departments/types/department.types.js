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
 * @property {number} size
 *
 * @typedef {Object} DepartmentPaginationResponse
 * @property {Department[]} data
 * @property {number} total
 * @property {number} page
 * @property {number} pageSize
 * @property {number} [totalPages]
 * @property {boolean} [hasNext]
 * @property {boolean} [hasPrevious]
 */

export {};
