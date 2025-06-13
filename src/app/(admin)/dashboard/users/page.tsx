import UserTable from '@/components/view/Admin/UserTable';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Users | Nutrify Admin',
  description: 'Kelola User Nutrify',
};

export default function UsersPage() {
  return (
    <div className="space-y-6 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Kelola User Nutrify</p>
        </div>
      </div>
      <UserTable />
    </div>
  );
}
