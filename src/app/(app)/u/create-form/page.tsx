"use client"
 
import { createForm } from "@/actions/forms"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createFormSchema } from "@/schemas/createFormSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"


const Page = () => {
  
  const [isSubmitting,setIsSubmitting]=useState(false);
  
  const { toast } = useToast();
  const router=useRouter();

  // zod implementation
  const form=useForm<z.infer<typeof createFormSchema>>({
    resolver:zodResolver(createFormSchema),
    defaultValues:{
      name:"",
      context:"",
      formExpiryDays:"",
      formExpiryHrs:""
    }
  })

  
  const onSubmit = async (data: z.infer<typeof createFormSchema>) => {
    setIsSubmitting(true);

    try {
      const timeLeft = Date.now() + (Number(data.formExpiryDays) * 24 + Number(data.formExpiryHrs)) * 60 * 60;
      const formData = {
        context: data.context,
        formExpiry: timeLeft,
        name:data.name,
        isAcceptingMessages:true,
        isSuggestingMessages:true
      };
      const res= await createForm("Nikhilesh007",formData);
      toast({
        title:res.message
      })
      router.replace("/u")
    } catch (error) {
        console.error('Unexpected error:', error);
        toast({
            title: 'Unexpected Error',
            description: 'Failed to create form',
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
            Create Form
          </h1>
          <p className="mb-4">Create a form to accept anonymous reviews</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter context of this form</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter context" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <p>Expires in</p>
              <div className="flex space-x-3">
                <FormField
                  control={form.control}
                  name="formExpiryDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Days</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Days" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="formExpiryHrs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hours</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Hours" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <>
                    <Loader2 className="mr-1.5 h-5 w-5 animate-spin " /> Please wait
                  </>
                ) : ('Create Form')
              }
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Page;
