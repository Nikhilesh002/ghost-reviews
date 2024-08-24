"use client"

import Link from "next/link";
import { useSession,signOut  } from "next-auth/react";
// import { User } from "next-auth";
import { Button } from "./ui/button";
import Image from "next/image";
import logo from '@/app/icon.png'

const Navbar = () => {

  const session=useSession();

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <Link href="/">
        <div className="flex gap-2">
            <Image className="rounded" src={logo} width="40" height="15" alt="logo" />
            <div className=" mt-1">
              <p className="text-2xl font-bold mb-4 md:mb-0">
                Ghost Reviews
              </p>
            </div>
        </div>
          </Link>

        {session && session.status==="authenticated" && session.data ? (
          <>
            <span className="mr-4">
              Welcome, {session?.data?.user.username || session?.data?.user.email}
            </span>
            <Button onClick={() => signOut()} className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
              Logout
            </Button>
          </>
        ) : (
          <Link href="/signin">
            <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
