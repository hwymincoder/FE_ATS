import { http } from '@/lib/http';

export const getCandidateUpgradePackages = (params = {}) =>
  http.get('/candidate/upgrade-packages', { params: { page: 1, size: 20, ...params } });
export const createVnPayPayment = (payload) => http.post('/v1/vnpay/create', payload);
export const getVnPayPayment = (transactionId) =>
  http.get(`/v1/vnpay/${encodeURIComponent(transactionId)}`);
export const getCurrentCandidate = () => http.get('/candidate/me');
