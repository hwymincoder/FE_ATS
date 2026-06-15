export function extractErrorMessage(error, fallback = 'Có lỗi xảy ra') {
  if (!error) return fallback;
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  if (error.error) return error.error;
  if (error.data?.message) return error.data.message;
  return fallback;
}
