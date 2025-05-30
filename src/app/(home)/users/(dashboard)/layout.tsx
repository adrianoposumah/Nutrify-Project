import UserSidebar from '@/components/main/UserSidebar';

export default function UserDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div>
        <div className="container mx-auto px-4 py-10 lg:py-25">
          <div className="flex w-full gap-5">
            <UserSidebar />
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
