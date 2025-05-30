'use client';
import React from 'react';
import { Plus, Settings, User } from 'lucide-react';
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
    title: 'Pengaturan',
    url: '/users/settings',
    icon: Settings,
  },
];

const UserSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-1/4 p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6">Menu</h2>
      <nav>
        <ul className="space-y-4">
          {navigationItems.map((item) => {
            const isActive = pathname === item.url;
            return (
              <li key={item.title}>
                <Link
                  href={item.url}
                  className={`flex items-center gap-3 p-3  transition-colors ${isActive ? 'border-l-primary border-l-2 bg-gradient-to-r from-orange-300 to-orange-100 text-primary-foreground font-medium' : 'hover:bg-primary-foreground/10'}`}
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
  );
};

export default UserSidebar;
