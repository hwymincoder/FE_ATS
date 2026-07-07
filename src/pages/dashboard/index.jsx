import { ROLES } from '@/constants';
import { useAuth } from '@/hooks/use-auth';
import RecruiterDashboard from '@/pages/recruiter/dashboard';
import DefaultDashboard from './default-dashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === ROLES.RECRUITER) {
    return <RecruiterDashboard />;
  }

  return <DefaultDashboard />;
}
