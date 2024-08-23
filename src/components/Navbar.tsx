"use client"

import Link from "next/link";
import { useSession,signOut  } from "next-auth/react";
// import { User } from "next-auth";
import { Button } from "./ui/button";
import Image from "next/image";

const Navbar = () => {

  const session=useSession();

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex gap-2">
          <Image src="/../../app/icon.png" width="20" height="20" />
          <Link href="/" className="text-xl font-bold mb-4 md:mb-0">
            Ghost Reviews
        </Link>
        </div>
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
