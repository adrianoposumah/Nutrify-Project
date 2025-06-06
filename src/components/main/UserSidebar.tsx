'use client';
import React from 'react';
import { Plus, Settings, User, BookOpenCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  {
    title: 'Profil',
    url: '/users/profile',
    icon: User,
  },
  {
    title: 'Tambah Makanan',
    url: '/users/addfood',
    icon: Plus,
  },
  {
    title: 'Request Makanan',
    url: '/users/request',
    icon: BookOpenCheck,
  },
  {
    title: 'Pengaturan',
    url: '/users/settings',
    icon: Settings,
  },
];

const UserSidebar = () => {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-1/4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-6 p-5">Menu</h2>
        <nav>
          <ul className="space-y-4">
            {navigationItems.map((item) => {
              const isActive = pathname === item.url;
              return (
                <li key={item.title}>
                  <Link
                    href={item.url}
                    className={`flex items-center gap-3 p-3 transition-colors ${
                      isActive ? 'border-l-primary border-l-2 bg-gradient-to-r from-orange-300 to-orange-100 text-primary-foreground font-medium' : 'hover:bg-primary-foreground/10'
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Tablet Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg lg:hidden z-50">
        <ul className="flex justify-center items-center">
          {navigationItems.map((item) => {
            const isActive = pathname === item.url;
            return (
              <li key={item.title} className="flex-1">
                <Link href={item.url} className={`flex flex-col items-center justify-center p-4 transition-colors ${isActive ? 'text-orange-500 bg-orange-50' : 'text-gray-600 hover:text-orange-500 hover:bg-gray-50'}`}>
                  <item.icon size={24} />
                  {/* <span className="text-xs mt-1 md:hidden">{item.title}</span> */}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default UserSidebar;
