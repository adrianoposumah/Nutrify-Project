import type React from 'react';
// import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Button, RegisterForm } from '@/components';

export const metadata: Metadata = {
  title: 'Daftar',
  description: 'Buat akun baru untuk melanjutkan',
};

export default function SignUp() {
  return (
    <div className="container mx-auto px-2 h-screen flex items-center">
      <Card className="w-[450px] relative z-10">
        <CardHeader>
          <CardTitle>
            <h1>Buat Akun</h1>
          </CardTitle>
          <CardDescription>
            <p>Jadilah bagian dari kontrubusi informasi </p>
          </CardDescription>
        </CardHeader>{' '}
        <CardContent>
          <RegisterForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex flex-col justify-between items-center w-full">
            <p className="text-sm text-gray-500 self-end">Punya Akun?</p>
            <Button variant="outline" asChild>
              <Link href="signin" className="w-full">
                Sign In
              </Link>
            </Button>
          </div>
          {/* <div className="relative w-full flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <Button variant="outline" className="w-full flex items-center">
            <Image src="/Google.svg" alt="Google" width={30} height={30} />
            Sign up with Google
          </Button> */}
        </CardFooter>
      </Card>
    </div>
  );
}
