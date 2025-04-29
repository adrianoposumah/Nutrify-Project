import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Masukkan Email anda disini" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Masukkan Password anda disini" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" type="submit">
            Sign In
          </Button>
          <div className="flex flex-col justify-between items-center w-full">
            <p className="text-sm text-gray-500 self-end">Belum punya Akun?</p>
            <Button variant="outline" asChild>
              <Link href="sign-up" className="w-full">
                Sign Up
              </Link>
            </Button>
          </div>
          <div className="relative w-full flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <Button variant="outline" className="w-full flex items-center">
            <Image src="/Google.svg" alt="Google" width={30} height={30} />
            Sign up with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
