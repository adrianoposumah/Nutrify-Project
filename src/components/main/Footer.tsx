'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, WifiOff } from 'lucide-react';

import { Button, Input } from '@/components';

const Footer = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Set initial status
    updateOnlineStatus();

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isOnline) {
      alert('You are offline. Please try again when you have an internet connection.');
      return;
    }

    // Handle email submission logic here
    console.log('Email submitted:', email);
    setEmail('');
  };
  return (
    <footer className="bg-secondary-background text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-between">
          <div className="col-span-1 lg:col-span-1 justify-self-start">
            <div className="flex items-center space-x-2 mb-4">
              <Image src="/NutrifyLogo.svg" alt="Nutrify Logo" width={35} height={35} priority />
              <h1 className="text-2xl font-bold text-orange-500">Nutrify</h1>
            </div>
            <p className="text-gray-300 mb-4">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur laborum aperiam nam provident. Deleniti, est minima reprehenderit sed atque dolorem.</p>
            <div className="mt-6">
              <h4 className="font-medium mb-3 text-white">Follow Us</h4>
              <div className="flex space-x-4">
                <Link href="https://www.facebook.com/" aria-label="Facebook" className="hover:text-orange-500 transition-colors">
                  <Image src="/Facebook.svg" alt="Facebook" width={24} height={24} />
                </Link>
                <Link href="https://www.instagram.com/" aria-label="Instagram" className="hover:text-orange-500 transition-colors">
                  <Image src="/Instagram.svg" alt="Instagram" width={24} height={24} />
                </Link>
                <Link href="https://www.twitter.com/" aria-label="Twitter" className="hover:text-orange-500 transition-colors">
                  <Image src="/Twitter.svg" alt="Twitter" width={24} height={24} />
                </Link>
              </div>
            </div>
          </div>
          <div className="col-span-1 justify-self-start md:justify-self-center">
            <h4 className="font-medium mb-4 border-b border-gray-700 text-white pb-2">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/aboutus" className="text-gray-300 hover:text-orange-500 transition-colors flex items-center space-x-2">
                  <ChevronRight size={20} />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-orange-500 transition-colors flex items-center space-x-2">
                  <ChevronRight size={20} />
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-orange-500 transition-colors flex items-center space-x-2">
                  <ChevronRight size={20} />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-300 hover:text-orange-500 transition-colors flex items-center space-x-2">
                  <ChevronRight size={20} />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>{' '}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 justify-self-start lg:justify-self-end">
            <h4 className="font-medium mb-4 border-b border-gray-700 pb-2 text-white">Hubungi Kami</h4>
            <p className="text-gray-300 mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, odit!</p>

            {!isOnline && (
              <div className="flex items-center text-yellow-400 mb-3 text-sm">
                <WifiOff className="h-4 w-4 mr-2" />
                <span>You are offline. Email subscription unavailable.</span>
              </div>
            )}

            <form onSubmit={handleEmailSubmit} className="flex mt-5 max-w-md">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email.."
                className="shadow-none border-none rounded-r-none h-10 focus-visible:ring-offset-0 focus-visible:ring-0 bg-white"
                disabled={!isOnline}
                required
              />
              <Button type="submit" className="ml-[-7] h-10 w-25" disabled={!isOnline || !email.trim()}>
                Kirim
              </Button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 text-center">
          <p className="text-sm text-gray-400">© 2025 Nutrify. All rights reserved. Develop by Capstone Team CC25-CF083</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
