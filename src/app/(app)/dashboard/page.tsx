"use client"

import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { IApiResponse } from '@/types/IApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const Page = () => {
  const [messages,setMessages]=useState<Message[]>([]);
  const [isLoading,setIsLoading]=useState(false);
  const [isSwitchLoading,setIsSwitchLoading]=useState(false);

  const {toast}=useToast();

  const handleDeleteMessage=(messageId:string)=>{
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
      setValue('acceptMessages',res.data.isAcceptingMessages);
    } catch (error) {
      console.error(error);
      const axiosError=error as AxiosError<IApiResponse>;
      toast({
        title:"Error",
        description:axiosError.response?.data.message || "Failed to fetch message settings",
        variant:"destructive"
      })
    } finally{
      setIsSwitchLoading(false);
    }
  },[setValue]);

  const fetchMessages=useCallback(async(refresh:boolean=false)=>{
    setIsLoading(true);
    setIsSwitchLoading(true);
    try {
      const res=await axios.get<IApiResponse>('/api/get-messages');
      setMessages(res.data.messages || []);
      if(refresh){
        toast({
          title:"Refreshed Messages",
          description:"Showing latest messages"
        })
      }
    } catch (error) {
      console.error(error);
      const axiosError=error as AxiosError<IApiResponse>;
      toast({
        title:"Error",
        description:axiosError.response?.data.message || "Failed to fetch message settings",
        variant:"destructive"
      })
    } finally{
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  },[setIsLoading,setMessages]);

  useEffect(() => {
    if(!session || !session.data?.user) return;
    fetchAcceptMessageStatus();
    fetchMessages();
  }, [session,setValue,fetchAcceptMessageStatus,fetchMessages]);

  // handle switch change
  const handleSwitchChange=async()=>{
    setIsSwitchLoading(true);
    try{
      const res=await axios.post<IApiResponse>('/api/accept-messages');
      setValue('acceptMessages',!acceptMessages);
      toast({
        title:res.data.message
      })
    } catch (error) {
      console.error(error);
      const axiosError=error as AxiosError<IApiResponse>;
      toast({
        title:"Error",
        description:axiosError.response?.data.message || "Failed to fetch message settings",
        variant:"destructive"
      })
    } finally{
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }

  if(!session || !session.data?.user){
    return <div>Please login</div>
  }

  const profileUrl=`${window.location.origin}/u/${session?.data?.user?.username}`;  
  
  const copyToClipboard=()=>{
    navigator.clipboard.writeText(profileUrl);
    toast({
      title:"Profile URL copied"
    })
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center ">
          <div className="bg-gray-50 text-blue-500 underline rounded w-full p-2 mr-2">
            <Link href={profileUrl} className="" >{profileUrl}</Link>
          </div>
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />
      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default Page;