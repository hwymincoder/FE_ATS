import { create } from 'zustand';

export const useChatbotStore = create((set) => ({
  isOpen: false,
  jobId: null,
  jobTitle: null,

  openChat: (context) =>
    set({
      isOpen: true,
      jobId: context?.jobId ?? null,
      jobTitle: context?.jobTitle ?? null,
    }),

  closeChat: () => set({ isOpen: false }),

  clearJobContext: () => set({ jobId: null, jobTitle: null }),

  setJobContext: ({ jobId, jobTitle }) => set({ jobId, jobTitle }),
}));
