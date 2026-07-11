export const CANDIDATE_CHAT_ENDPOINTS = {
  CHAT: '/candidate/chat',
};

export const CANDIDATE_CV_ENDPOINTS = {
  LIST: '/candidate/cvs',
  DETAIL: (cvId) => `/candidate/cvs/${cvId}`,
};

export const CANDIDATE_CHATBOT_QUERY_KEYS = {
  all: ['candidate-chatbot'],
  cvs: () => ['candidate-chatbot', 'cvs'],
};
