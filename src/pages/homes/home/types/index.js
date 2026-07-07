/**
 * @typedef {Object} Job
 * @property {number} id
 * @property {number} departmentId
 * @property {string} [departmentName]
 * @property {number} recruiterId
 * @property {string} title
 * @property {string} [description]
 * @property {string} [location]
 * @property {number} [salaryMin]
 * @property {number} [salaryMax]
 * @property {string} status
 */

/**
 * @typedef {Object} JobPage
 * @property {Job[]} items
 * @property {number} page
 * @property {number} size
 * @property {number} totalItems
 * @property {number} totalPages
 * @property {boolean} hasNext
 * @property {boolean} hasPrevious
 */

export {};
