import { Poppins, Work_Sans } from "next/font/google";
import "../globals.css";
import Image from "next/image";
import Link from "next/link";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const routes = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/about-us",
    label: "About",
  },
];

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${workSans.variable} antialiased relative w-full  lg:h-screen mt-0`}>
        <Image src="/Background1.png" alt="Jumbotron" fill className="object-cover object-center select-none pointer-events-none" priority />
        <header className="fixed top-0 z-50 w-full">
          <div className="container flex h-20 mx-auto items-center justify-between px-2">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/NutrifyLogo.svg" alt="Nutrify Logo" width={35} height={35} priority />
              <h1 className="text-2xl font-bold text-orange-500">Nutrify</h1>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              {routes.map((route) => (
                <Link key={route.href} href={route.href} className="font-medium transition-colors hover:text-orange-500">
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
