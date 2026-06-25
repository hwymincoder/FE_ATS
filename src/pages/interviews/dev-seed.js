import { useAuthStore } from '@/stores/auth-store';

export const seedDevInterviews = () => {
  if (typeof window === 'undefined') return;
  try {
    // set fake interviewer user if not present
    const current = useAuthStore.getState().user;
    if (!current) {
      useAuthStore.setState({ user: { id: 123, username: 'interviewer.dev', fullName: 'Người Phỏng Vấn Dev', email: 'dev@local' } });
    }

    const mocks = [
      {
        id: 101,
        interviewerId: 123,
        interviewerName: 'Người Phỏng Vấn Dev',
        candidateName: 'Nguyen Van A',
        position: 'Frontend',
        startTime: '2026-07-01T09:00:00Z',
        endTime: '2026-07-01T09:45:00Z',
        meetingLink: 'https://meet.example.com/abc-101',
        status: 'SCHEDULED',
        result: null,
      },
      {
        id: 102,
        interviewerId: 123,
        interviewerName: 'Người Phỏng Vấn Dev',
        candidateName: 'Tran Thi B',
        position: 'Backend',
        startTime: '2026-07-01T11:00:00Z',
        endTime: '2026-07-01T11:45:00Z',
        meetingLink: 'https://meet.example.com/abc-102',
        status: 'SCHEDULED',
        result: null,
      },
      {
        id: 103,
        interviewerId: 999,
        interviewerName: 'Other Interviewer',
        candidateName: 'Le Van C',
        position: 'QA',
        startTime: '2026-07-02T10:00:00Z',
        endTime: '2026-07-02T10:45:00Z',
        meetingLink: 'https://meet.example.com/abc-103',
        status: 'SCHEDULED',
        result: null,
      },
      {
        id: 104,
        interviewerId: 123,
        interviewerName: 'Người Phỏng Vấn Dev',
        candidateName: 'Pham Thi D',
        position: 'Fullstack',
        startTime: '2026-07-03T14:00:00Z',
        endTime: '2026-07-03T14:45:00Z',
        meetingLink: 'https://meet.example.com/abc-104',
        status: 'SCHEDULED',
        result: null,
      },
    ];
    localStorage.setItem('mock_interviews', JSON.stringify(mocks));
    console.info('Dev interviews seeded:', mocks.length);
  } catch (err) {
    // ignore
  }
};
