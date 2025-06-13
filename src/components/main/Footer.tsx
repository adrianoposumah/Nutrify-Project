import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary-background text-white border-t-2 border-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-between">
          <div className="col-span-1 lg:col-span-1 justify-self-start">
            <div className="flex items-center space-x-2 mb-4">
              <Image src="/NutrifyLogo.svg" alt="Nutrify Logo" width={35} height={35} priority />
              <h1 className="text-2xl font-bold text-orange-500">Nutrify</h1>
            </div>
            <p className="text-gray-300 mb-4">Panduan nutrisi cerdas dengan AI terintegrasi. Buat pilihan makanan yang tepat sesuai kondisi kesehatan Anda, langsung dari ujung jari.</p>
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
            <p className="text-gray-300 mb-4">helpcontact@nutrify.web.id</p>
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
