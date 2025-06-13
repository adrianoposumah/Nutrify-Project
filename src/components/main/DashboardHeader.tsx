import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import ThemeToggle from '../ui/ThemeToggle';
import Link from 'next/link';

export function DashboardHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">Admin Dashboard</h1>{' '}
        <div className="ml-auto flex justify-between items-center gap-4">
          <Link href="/" className="text-base font-medium text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
