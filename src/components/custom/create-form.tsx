"use client"
 
import { createForm } from "@/actions/formActions"
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

const CreateForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof createFormSchema>>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: "",
      context: "",
      formExpiryDays: "",
      formExpiryHrs: ""
    }
  })

  const onSubmit = async (data: z.infer<typeof createFormSchema>) => {
    setIsSubmitting(true);

    try {
      const timeLeft = Date.now() + (Number(data.formExpiryDays) * 24 + Number(data.formExpiryHrs)) * 60 * 60;
      const formData = {
        context: data.context,
        formExpiry: timeLeft,
        name: data.name,
        isAcceptingMessages: true,
        isSuggestingMessages: true
      };
      const res = await createForm("Nikhilesh007", formData);
      toast({
        title: res.message
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
    <div className="flex justify-center items-center mt-5">
      <div className="w-full max-w-2xl pb-2 pt-4 px-4 md:px-6 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Name</FormLabel>
                  <FormControl>
                    <Input 
                      type="text" 
                      placeholder="Name" 
                      {...field} 
                      className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Enter context of this form</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter context" 
                      {...field} 
                      className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">Expires in</p>
              <div className="flex space-x-3">
                <FormField
                  control={form.control}
                  name="formExpiryDays"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-gray-700 dark:text-gray-300">Days</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Days" 
                          {...field} 
                          className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="formExpiryHrs"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-gray-700 dark:text-gray-300">Hours</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Hours" 
                          {...field} 
                          className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1.5 h-5 w-5 animate-spin" /> Please wait
                </>
              ) : (
                'Create Form'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default CreateForm;