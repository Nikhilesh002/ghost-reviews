"use client"

import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { IApiResponse } from '@/types/IApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

const Page = () => {
  const [messages,setMessages]=useState<Message[]>([]);
  const [isLoading,setIsLoading]=useState(false);
  const [isSwitchLoading,setIsSwitchLoading]=useState(false);

  const {toast}=useToast();

  const handleDeleteMessages=(messageId:string)=>{
    setMessages(messages.filter((message)=>message._id!=messageId))
  }

  const session=useSession();

  const form=useForm({
    resolver:zodResolver(AcceptMessageSchema)
  })

  const {register,watch,setValue }=form;

  const acceptMessages=watch('acceptMessages');

  const fetchAcceptMessageStatus=useCallback(async()=>{
    setIsSwitchLoading(true);
    try {
      const res=await axios.get<IApiResponse>('/api/accept-messages');
      setValue('acceptMessages',res.data.isAcceptingMessagess);
    } catch (error) {
      console.error(error);
      toast({
        title:"Error",
        variant:"destructive"
      })
    }
  },[setValue]);

  return (
    <div>Page</div>
  )
}

export default Page;