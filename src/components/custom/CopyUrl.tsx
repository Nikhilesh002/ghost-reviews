"use client"

import React from 'react'
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';

function CopyUrl({formUrl}:{formUrl:string}) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(formUrl);
    toast({
      title: "Profile URL copied"
    });
  }
  return (
    <Button onClick={copyToClipboard}>Copy</Button>
  )
}

export default CopyUrl;
