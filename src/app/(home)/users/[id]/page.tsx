import { UserCard } from '@/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile | Nutrify',
  description: 'User profile dashboard page.',
};

export default function ProfileDashboard() {
  return <UserCard />;
}
