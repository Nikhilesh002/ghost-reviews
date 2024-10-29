"use client"

import Link from 'next/link';
import React from 'react'
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';

function ShareReviewLink({formId}:{formId:string}) {

  const formUrl = `${window.location.origin}/u/form/${formId}/review` ;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formUrl);
    toast({
      title: "Profile URL copied"
    });
  }

  return (
    <div className="flex items-center">
      <div className="bg-gray-50 dark:bg-gray-700 text-blue-500 dark:text-blue-400 underline rounded w-full p-2 mr-2">
        <Link href={formUrl} className="hover:text-blue-600 dark:hover:text-blue-300">{formUrl}</Link>
      </div>
      <Button onClick={copyToClipboard}>Copy</Button>
    </div>
  )
}

export default ShareReviewLink;
