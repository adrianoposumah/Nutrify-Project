import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed w-full z-999 flex items-center p-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/NutrifyLogo.svg" alt="Nutrify Logo" width={35} height={35} priority />
          <h1 className="text-2xl font-bold ml-2 text-orange-500">Nutrify</h1>
        </Link>

        {/* List */}
        <div>
          <ul className="flex items-center space-x-8 font-semibold">
            <li>
              <Link href="/category" className="text-orange-500">
                Home
              </Link>
            </li>
            <li>
              <Link href="/category">Kategori</Link>
            </li>
            <li>
              <Link href="/tools">Tools</Link>
            </li>
            <li>
              <Link href="/api">API</Link>
            </li>
            <li>
              <Link href="/about-us">About</Link>
            </li>
          </ul>
        </div>

        {/* Button */}
        <div className="flex space-x-2">
          <Button variant="outline" className="bg-transparent text-orange-500 border-orange-500 hover:text-white hover:bg-orange-500" asChild>
            <Link href="/sign-up">Sign Up</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
