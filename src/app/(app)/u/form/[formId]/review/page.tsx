"use client"
 
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { IApiResponse } from '@/types/IApiResponse';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';


// is sent to users to get reviews

const formSchema = z.object({
  content: z.string().min(10).max(300),
})

const Page = ({params:{formId}}:{params:{formId:string}}) => {

  console.log(formId)

  const {toast}=useToast();
  const [messages,setMessages]=useState<string[]>([]);
  const [isGettingSuggestions,setIsGettingSuggestions]=useState<boolean>(false);
  const [isSubmitting,setIsSubmitting]=useState<boolean>(false);

  const [isSuggestingMessages,setIsSuggestingMessages]=useState<boolean>(false);
  const [isAcceptingMessages,setIsAcceptingMessages]=useState<boolean>(false);

  const form=useForm<z.infer <typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues:{
      content:''
    }
  });
  const {register,handleSubmit,setValue}=form;

  useEffect(()=>{
    if(!formId) return;
    const getStatus=async()=>{
      try {
        const acceptRes = await axios.get<IApiResponse>(`/api/accept-messages?formId=${formId}`);
        if(acceptRes.data.success){
          if(!acceptRes.data.isAcceptingMessages){
            setIsAcceptingMessages(false);
            return;
          }
          setIsAcceptingMessages(acceptRes.data.isAcceptingMessages || false);
        } else{
          setIsAcceptingMessages(false);
          return;
        }
        const suggestionRes=await axios.post<IApiResponse>('/api/suggestion-status',{type:"see",formId});
        if(suggestionRes.data.success){
          setIsSuggestingMessages(suggestionRes.data.isSuggestingMessages || false);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getStatus();
  },[formId]);

  const onSubmit=async(data:z.infer<typeof formSchema>)=>{
    setIsSubmitting(true);
    try {
      const res=await axios.post<IApiResponse>('/api/send-message',{...data,formId});
      if(res.status===200 && res.data.success){
        toast({
          title:res.data.message
        })
        setValue("content",'');
      }
    } catch (error) {
      console.error(error);
      const axiosError=error as AxiosError<IApiResponse>;
      toast({
        title:"Error",
        description:axiosError.response?.data.message || "Failed to generate message suggestions",
        variant:"destructive"
      })
    } finally{
      setIsSubmitting(false);
    }
  }

  const suggestMessages=useCallback(async()=>{
    setIsGettingSuggestions(true);
    try {
      const res=await axios.post<IApiResponse>('/api/get-suggestions',{formId});
      const suggestions=res.data.message;
      const temp= suggestions.split('||')
      setMessages(temp);
    } catch (error) {
      console.error(error);
      const axiosError=error as AxiosError<IApiResponse>;
      toast({
        title:"Error",
        description:axiosError.response?.data.message || "Failed to generate message suggestions",
        variant:"destructive"
      })
    } finally{
      setIsGettingSuggestions(false);
    }
  },[toast]);
  

  return (
    <div className=''>
      <h1 className='text-3xl text-center font-medium mt-5 mb-3 '>Welcome to {formId}&apos;s page</h1>

      {/* send anonymous msg */}
      {
        isAcceptingMessages ?
        <>
          <div className="w-3/4 md:w-1/2 lg:w-1/3 mx-auto mb-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Send Message</CardTitle>
              {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="content"
                    render={() => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter content" {...register("content")} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button type="submit">Submit</Button>
                    {
                      isSubmitting && <Loader2 className='w-8 h-8 mt-0.5 animate-spin' />
                    }
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          </div>
          {
            isSuggestingMessages ?
            <div className="w-5/6 md:w-3/4 lg:w-1/2 mx-auto mb-10">
              <Card className="w-full">
                <CardHeader>
                  <Button onClick={suggestMessages} className='w-40'>Suggest messages</Button>
                  <CardDescription>Get auto generated suggestions from AI and click to select</CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-2'>
                  {
                    isGettingSuggestions ? 
                      <div className="flex flex-col gap-2">
                        <Skeleton className="w-full h-[40px] rounded-xl" />
                        <Skeleton className="w-full h-[40px] rounded-xl" />
                        <Skeleton className="w-full h-[40px] rounded-xl" />
                      </div> :
                      messages.length!==0 ? messages?.map((message,index)=>(
                        <Button key={index} onClick={()=>setValue("content",message)} className='text-wrap' variant="outline">{message}</Button>
                      )) : <p>Click above button to generate messages</p>
                  }
                </CardContent>
              </Card>
            </div> : null
          }
        </> : <p>User is not accepting messages</p>
      }
    </div>
  )
}

export default Page;
