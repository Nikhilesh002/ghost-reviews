"use client"

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";


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
