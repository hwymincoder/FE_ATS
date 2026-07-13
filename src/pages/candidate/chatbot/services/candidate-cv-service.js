import { http } from '@/lib/http';
import { CANDIDATE_CV_ENDPOINTS } from '@/pages/candidate/chatbot/constants';

export async function fetchCandidateCvs() {
  const response = await http.get(CANDIDATE_CV_ENDPOINTS.LIST);
  return Array.isArray(response) ? response : [];
}

async function fetchCandidateCvBlob(cvId, mode) {
  const endpoint = mode === 'download'
    ? CANDIDATE_CV_ENDPOINTS.DOWNLOAD(cvId)
    : CANDIDATE_CV_ENDPOINTS.VIEW(cvId);

  return http.get(endpoint, { responseType: 'blob' });
}

function resolvePreviewType(fileName, fileType, responseType) {
  const normalizedType = fileType?.trim().toLowerCase();
  if (normalizedType?.includes('/')) return normalizedType;

  const extension = normalizedType || fileName?.split('.').pop()?.toLowerCase();
  const mimeTypes = {
    pdf: 'application/pdf',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
  };

  if (mimeTypes[extension]) return mimeTypes[extension];
  if (responseType && responseType !== 'application/octet-stream') return responseType;
  return 'application/octet-stream';
}

export async function viewCandidateCv(cvId, fileName, fileType) {
  const previewWindow = window.open('', '_blank');
  if (previewWindow) previewWindow.opener = null;

  try {
    const responseBlob = await fetchCandidateCvBlob(cvId, 'view');
    const previewType = resolvePreviewType(fileName, fileType, responseBlob.type);
    const blob = responseBlob.type === previewType
      ? responseBlob
      : new Blob([responseBlob], { type: previewType });
    const objectUrl = URL.createObjectURL(blob);

    if (previewWindow) previewWindow.location.replace(objectUrl);
    else window.location.assign(objectUrl);

    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
  } catch (error) {
    previewWindow?.close();
    throw error;
  }
}

export async function downloadCandidateCv(cvId, fileName = `cv-${cvId}`) {
  const blob = await fetchCandidateCvBlob(cvId, 'download');
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
}
