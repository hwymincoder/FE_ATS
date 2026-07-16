import { http } from '@/lib/http';

export const RECRUITER_CV_ENDPOINTS = {
    VIEW: (applicationId) => `/recruiter/cvs/${applicationId}/view`,
    DOWNLOAD: (applicationId) => `/recruiter/cvs/${applicationId}/download`,
};

async function fetchCvBlob(applicationId, mode) {
    const endpoint = mode === 'download'
        ? RECRUITER_CV_ENDPOINTS.DOWNLOAD(applicationId)
        : RECRUITER_CV_ENDPOINTS.VIEW(applicationId);

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

export async function viewRecruiterCv(applicationId, fileName, fileType) {
    const previewWindow = window.open('', '_blank');
    if (previewWindow) previewWindow.opener = null;

    try {
        const responseBlob = await fetchCvBlob(applicationId, 'view');
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

export async function downloadRecruiterCv(applicationId, fileName = `cv-application-${applicationId}`) {
    const blob = await fetchCvBlob(applicationId, 'download');
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
}
