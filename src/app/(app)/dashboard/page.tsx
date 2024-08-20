"use client"

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import React from 'react';
import { useSession } from 'next-auth/react';

function Page() {
  const session=useSession();
  return (
    <div>
      <Button onClick={()=>signOut({
        callbackUrl:'/signin'
      })} >Logout</Button>
      <p>{JSON.stringify(session)}</p>
    </div>
  )
}

export default Page;
