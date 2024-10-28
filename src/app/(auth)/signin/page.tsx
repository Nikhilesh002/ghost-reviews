"use client"
 
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { signInSchema } from "@/schemas/signInSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"


const Page = () => {
  
  const [isSubmitting,setIsSubmitting]=useState(false);
  
  const { toast } = useToast();
  const router=useRouter();

  // zod implementation
  const form=useForm<z.infer<typeof signInSchema>>({
    resolver:zodResolver(signInSchema),
    defaultValues:{
      identifier:'',
      password:''
    }
  })

  
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);

    try {
        const res = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
            // callbackUrl:'/dashboard'
        });

        // Check for errors and display appropriate messages
        // if (res?.error) {
        //     if (res.error === 'CredentialsSignin') {
        //         toast({
        //             title: 'Login Failed',
        //             description: 'Incorrect username or password',
        //             variant: 'destructive',
        //         });
        //     } else {
        //         toast({
        //             title: 'Error',
        //             description: res.error,
        //             variant: 'destructive',
        //         });
        //     }
        // } else if (res?.ok) {
            // Redirect the user if sign-in was successful
            router.push('/u');
        // } else {
        //     // Handle unexpected responses
        //     toast({
        //         title: 'Unexpected Response',
        //         description: 'An unexpected response was received. Please try again later.',
        //         variant: 'destructive',
        //     });
        // }
    } catch (error) {
        // Handle unexpected errors
        console.error('Unexpected error:', error);
        toast({
            title: 'Unexpected Error',
            description: 'An unexpected error occurred. Please try again later.',
            variant: 'destructive',
        });
    } finally {
        setIsSubmitting(false);
    }
};


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
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email/username" {...field} />
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
