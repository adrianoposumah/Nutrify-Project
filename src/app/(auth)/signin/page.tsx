/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Button, LoginForm } from '@/components';

export const metadata: Metadata = {
  title: 'Masuk',
  description: 'Masuk ke akun anda untuk melanjutkan',
};

export default function SignIn() {
  return (
    <div className="container mx-auto px-2 h-screen flex items-center">
      <Card className="w-[450px] relative z-10">
        <CardHeader>
          <CardTitle>
            <h1>Masuk ke Akun anda</h1>
          </CardTitle>
          <CardDescription>
            <p>Jadilah bagian dari kontrubusi informasi </p>
          </CardDescription>
        </CardHeader>{' '}
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex flex-col justify-between items-center w-full">
            <p className="text-sm text-gray-500 self-end">Belum punya Akun?</p>
            <Button variant="outline" asChild>
              <Link href="signup" className="w-full">
                Sign Up
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
            Sign in with Google
          </Button> */}
        </CardFooter>
      </Card>
    </div>
  );
}
