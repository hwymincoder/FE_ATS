const CV_FIT_PATTERNS = [
  /cv.*hợp/i,
  /hợp.*cv/i,
  /có phù hợp/i,
  /đánh giá cv/i,
  /so sánh cv/i,
  /cv.*phù hợp/i,
  /phù hợp.*cv/i,
  /cv.*match/i,
  /fit.*cv/i,
];

const CV_REQUIRED_PATTERNS = [
  /dựa.*cv/i,
  /dua.*cv/i,
  /theo.*cv/i,
  /cv.*tôi/i,
  /cv.*toi/i,
  /cv.*của.*tôi/i,
  /cv.*cua.*toi/i,
  /tìm.*job.*cv/i,
  /tim.*job.*cv/i,
  /tìm.*việc.*cv/i,
  /tim.*viec.*cv/i,
  /job.*phù hợp.*cv/i,
  /job.*phu hop.*cv/i,
  /việc.*phù hợp.*cv/i,
  /viec.*phu hop.*cv/i,
  /phù hợp.*với.*cv/i,
  /phu hop.*voi.*cv/i,
  /match.*cv/i,
  /recommend.*cv/i,
];

export function isCvFitQuestion(message) {
  const normalized = String(message ?? '').trim();
  if (!normalized) return false;
  return CV_FIT_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function isCvRequiredQuestion(message) {
  const normalized = String(message ?? '').trim();
  if (!normalized) return false;
  return CV_REQUIRED_PATTERNS.some((pattern) => pattern.test(normalized)) || isCvFitQuestion(normalized);
}

export function getUsableCvs(cvs) {
  return (cvs ?? []).filter((cv) => cv?.hasParsedText);
}
