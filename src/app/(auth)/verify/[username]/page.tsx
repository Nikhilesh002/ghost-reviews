"use client"
 
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { verifySchema } from "@/schemas/verifySchema"
import { IApiResponse } from "@/types/IApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"


const Page = () => {

  const router=useRouter();
  const {toast} =useToast();
  const params=useParams<{username:string}>();

  const form=useForm<z.infer<typeof verifySchema>>({
    resolver:zodResolver(verifySchema)
  });

  const onSubmit=async(data:z.infer<typeof verifySchema>)=>{
    try {
      const res= await axios.post('/api/verify-code',{
        username:params.username,
        code:data.code
      })
      if(res.data.success){
        toast({
          description:res.data.message
        })
        router.replace('/signin');
      } else{
        toast({
          description:res.data.message,
          variant:"destructive"
        })
      }
    } catch (error) {
      console.error(error);
      const axiosError=error as AxiosError<IApiResponse>;
      toast({
        title:"SignUp failed",
        description:axiosError.response?.data.message,
        variant:"destructive"
      })
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter code</FormLabel>
              <FormControl>
                <Input placeholder="Enter code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
      </div>
    </div>
  )
}

export default Page;
