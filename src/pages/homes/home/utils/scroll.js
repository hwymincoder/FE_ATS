export function scrollToId(id) {
  const el = typeof id === 'string' ? document.querySelector(id) : id;
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
