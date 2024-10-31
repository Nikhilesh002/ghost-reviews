"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { sendMessage, getMessageSuggestions } from "@/actions/messageActions";
import { Form } from "@/model/Forms.model";

const formSchema = z.object({
  content: z.string().min(10).max(300),
});

const ReviewForm = ({
  formId,
  reviewForm,
  isAcceptingMessages,
  isSuggestingMessages
}: {
  formId: string;
  reviewForm: Form;
  isAcceptingMessages: boolean;
  isSuggestingMessages:boolean;
}) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<string[]>([]);
  const [isGettingSuggestions, setIsGettingSuggestions] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: "" },
  });
  const { register, handleSubmit, setValue } = form;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const { success } = await sendMessage(formId, data.content);
    if (success) {
      toast({ title: "Message sent" });
      setValue("content", "");
    }
    setIsSubmitting(false);
  };

  const suggestMessages = useCallback(async () => {
    setIsGettingSuggestions(true);
    const res = await getMessageSuggestions(reviewForm.context as unknown as string);
    if (!res.success) {
      toast({
        title: "Error getting AI suggestions",
        variant: "destructive",
      });
      setIsGettingSuggestions(false);
      return;
    }
    setMessages(res.messages.split("||"));
    toast({ title: "Fetched AI suggestions" });
    setIsGettingSuggestions(false);
  }, [reviewForm.context, toast]);

  return (
    <div>
      {isAcceptingMessages ? (
        <>
          <div className="w-3/4 md:w-1/2 lg:w-1/3 mx-auto mb-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Send Message</CardTitle>
                <CardDescription>{reviewForm?.context}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <Textarea placeholder="Enter content" {...register("content")} />
                  <div className="flex gap-2">
                    <Button type="submit">Submit</Button>
                    {isSubmitting && <Loader2 className="w-8 h-8 mt-0.5 animate-spin" />}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {
            isSuggestingMessages &&
            <div className="w-5/6 md:w-3/4 lg:w-1/2 mx-auto mb-10">
              <Card className="w-full">
                <CardHeader>
                  <Button onClick={suggestMessages} className="w-40">Suggest messages</Button>
                  <CardDescription>Get auto-generated suggestions from AI and click to select</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {isGettingSuggestions ? (
                    <div className="flex flex-col gap-2">
                      <Skeleton className="w-full h-[40px] rounded-xl" />
                      <Skeleton className="w-full h-[40px] rounded-xl" />
                      <Skeleton className="w-full h-[40px] rounded-xl" />
                    </div>
                  ) : (
                    messages.length !== 0 ? (
                      messages.map((message, index) => (
                        <Button key={index} onClick={() => setValue("content", message)} variant="outline">
                          {message}
                        </Button>
                      ))
                    ) : (
                      <p>Click above button to generate messages</p>
                    )
                  )}
                </CardContent>
              </Card>
            </div>
          }
        </>
      ) : (
        <p>User is not accepting messages</p>
      )}
    </div>
  );
};

export default ReviewForm;
