import { Poppins, Work_Sans } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "next-themes";

import Navbar from "@/components/main/Navbar";
import Footer from "@/components/main/Footer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${workSans.variable} antialiased`}>
        <ThemeProvider attribute="class" enableSystem>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
