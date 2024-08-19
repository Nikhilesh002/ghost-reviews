"use client"
 
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { signUpSchema } from "@/schemas/signUpSchema"
import { IApiResponse } from "@/types/IApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from 'axios'
import { Ban, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDebounceValue } from 'usehooks-ts'
import * as z from "zod"


const Page = () => {
  // const [username,setUsername]=useState('');
  const [usernameMessage,setUsernameMessage]=useState('');
  const [isCheckingUsername,setIsCheckingUsername]=useState(false);
  const [isSubmitting,setIsSubmitting]=useState(false);
  const [debouncedUsername, setDebouncedUsername] = useDebounceValue('', 500);
  
  const { toast } = useToast();
  const router=useRouter();

  // zod implementation
  const form=useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username:'',
      email:'',
      password:''
    }
  })

  console.log(debouncedUsername)

  useEffect(() => {
    const checkUsernameUniquesness=async () => {
      if(debouncedUsername){
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const res=await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
          if(res.status===200){
            setUsernameMessage(res.data.message);
          }
        } catch (error) {
          console.log(error);
          const axiosError=error as AxiosError<IApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
        } finally{
          setIsCheckingUsername(false);
        }
      }
    }
    checkUsernameUniquesness();
  }, [debouncedUsername])
  
  const onSubmit=async (data:z.infer<typeof signUpSchema>)=>{
    setIsSubmitting(true);
    try {
      const res=await axios.post<IApiResponse>('/api/signup',data);
      if(res.data.success){
        toast({
          title:"Success",
          description:res.data.message
        })
      }
      if(res.data.success){
        toast({
          title:"Success",
          description:res.data.message
        })
      }
      // router.replace(`/verify/${data.username}`);
    } catch (error) {
      console.error(error);
      const axiosError=error as AxiosError<IApiResponse>;
      toast({
        title:"SignUp failed",
        description:axiosError.response?.data.message,
        variant:"destructive"
      })
    } finally{
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to Ghost Reviews
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <div className="flex">
                    <FormControl>
                      <Input className="pe-10" placeholder="Enter username" {...field}
                        onChange={(e)=>{
                          field.onChange(e);
                          setDebouncedUsername(e.target.value);
                        }}
                      />
                    </FormControl>
                  </div>
                  <div className="flex text-xs gap-1">
                    {isCheckingUsername && <Loader2 className="h-10 mb-0.5 " /> }
                    { usernameMessage!=='' && (usernameMessage==='Username is unique' ?
                            <p className="text-xs text-green-500">
                              <CheckCircle2 className=" inline-block text-green-500 h-4 pb-0.5 "/><p className="font-medium inline-block">{debouncedUsername}</p> is available
                            </p> :
                            <p className="text-xs text-red-500">
                              <Ban className=" inline-block text-red-500 h-4 pb-0.5 "/><p className="font-medium inline-block">{debouncedUsername}</p> is already taken
                            </p>)
                    }
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <>
                    <Loader2 className="mr-1.5 h-5 w-5 animate-spin " /> Please wait
                  </>
                ) : ('Sign In')
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page;
