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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAcceptSwitchLoading, setIsAcceptSwitchLoading] = useState(false);
  const [isSuggestSwitchLoading, setIsSuggestSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id != messageId));
  }

  const session = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema)
  });

  const { register, watch, setValue } = form;

  const acceptMessages: boolean = watch('acceptMessages');
  const suggestMessages: boolean = watch('suggestMessages');

  // Handle Suggest Switch Change
  const handleSuggestMessagesSwitchChange = useCallback(async () => {
    if (!acceptMessages) {
      return; // Prevent changing suggestions if accept messages is off
    }
    
    setIsSuggestSwitchLoading(true);
    try {
      const res = await axios.post<IApiResponse>('/api/suggestion-status', { type: "toggle" });
      if (res.data.success) {
        setValue('suggestMessages', !suggestMessages);
        toast({
          title: res.data.message
        });
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError<IApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to update suggestion settings",
        variant: "destructive"
      });
    } finally {
      setIsSuggestSwitchLoading(false);
    }
  }, [toast, setValue, suggestMessages, acceptMessages]);

  const fetchAcceptMessageStatus = useCallback(async () => {
    setIsAcceptSwitchLoading(true);
    try {
      if(!session || !session.data || !session.data.user) return;
      const res = await axios.get<IApiResponse>(`/api/accept-messages?username=${session?.data?.user?.username}`);
      if (res.data.success) {
        setValue('acceptMessages', res.data.isAcceptingMessages);
      }
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError<IApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        variant: "destructive"
      });
    } finally {
      setIsAcceptSwitchLoading(false);
    }
  }, [setValue, toast,session]);

  const fetchSuggestMessagesStatus = useCallback(async () => {
    setIsSuggestSwitchLoading(true);
    try {
      if(!session || !session.data || !session.data.user) return;
      const res = await axios.post('/api/suggestion-status', { type: "see",username:session?.data?.user?.username });
      if (res.data.success) {
        setValue('suggestMessages', res.data.isSuggestingMessages);
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError<IApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch suggestion settings",
        variant: "destructive"
      });
    } finally {
      setIsSuggestSwitchLoading(false);
    }
  }, [setValue, toast,session]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsAcceptSwitchLoading(true);
    try {
      const res = await axios.get<IApiResponse>('/api/get-messages');
      setMessages(res.data.messages || []);
      if (refresh) {
        toast({
          title: "Refreshed Messages",
          description: "Showing latest messages"
        });
      }
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError<IApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch messages",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsAcceptSwitchLoading(false);
    }
  }, [setIsLoading, setMessages, toast]);

  useEffect(() => {
    if (!session || !session.data?.user) return;
    fetchSuggestMessagesStatus();
    fetchAcceptMessageStatus();
    fetchMessages();
  }, [session, fetchAcceptMessageStatus, fetchMessages, fetchSuggestMessagesStatus]);

  // Handle Accept Switch Change
  const handleAcceptMessagesSwitchChange = useCallback(async () => {
    setIsAcceptSwitchLoading(true);
    try {
      if (acceptMessages && suggestMessages) {
        await handleSuggestMessagesSwitchChange(); // Ensure suggestions are turned off if accept is turned off
      }
      const res = await axios.post<IApiResponse>('/api/accept-messages');
      if (res.data.success) {
        setValue('acceptMessages', !acceptMessages);
        if (!acceptMessages && suggestMessages) {
          await handleSuggestMessagesSwitchChange()
          setValue('suggestMessages', false); // Disable suggestions if accept is turned off
        }
        toast({
          title: res.data.message
        });
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError<IApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to update message settings",
        variant: "destructive"
      });
    } finally {
      setIsAcceptSwitchLoading(false);
    }
  }, [toast, acceptMessages, suggestMessages, setValue, handleSuggestMessagesSwitchChange]);

  if (!session || !session.data?.user) {
    return <div>Please login</div>
  }

  const profileUrl = `${window.location.origin}/u/${session?.data?.user?.username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Profile URL copied"
    });
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white dark:bg-gray-800 rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <div className="bg-gray-50 dark:bg-gray-700 text-blue-500 dark:text-blue-400 underline rounded w-full p-2 mr-2">
            <Link href={profileUrl} className="hover:text-blue-600 dark:hover:text-blue-300">{profileUrl}</Link>
          </div>
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-14">
        <div className="flex items-center">
          <Switch
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={async () => {await handleAcceptMessagesSwitchChange()}}
            disabled={isAcceptSwitchLoading}
          />
          <span className="ml-2 text-gray-700 dark:text-gray-300">
            Accept Messages: {acceptMessages ? 'On' : 'Off'}
          </span>
        </div>

        <div className="flex items-center">
          <Switch
            {...register('suggestMessages')}
            checked={suggestMessages}
            onCheckedChange={async () => {await handleSuggestMessagesSwitchChange()}}
            disabled={isSuggestSwitchLoading || !acceptMessages}
          />
          <span className="ml-2 text-gray-700 dark:text-gray-300">
            AI suggestions: {suggestMessages ? 'On' : 'Off'}
          </span>
        </div>
      </div>
      <Separator className='mt-4 bg-gray-200 dark:bg-gray-600' />
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
          <p className="text-gray-600 dark:text-gray-400">No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default Page;
