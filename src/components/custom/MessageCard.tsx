"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/Messages.model";
import { useToast } from "../ui/use-toast";
import { deleteMessage } from "@/actions/messageActions";
import { format } from 'date-fns';
import { enIN } from 'date-fns/locale';

type MessageCardProps = {
  message: Message;
  formId: string;
  onDelete: ()=>void
  setIsLoading:any
};

const MessageCard = ({ message, formId,onDelete,setIsLoading }: MessageCardProps) => {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    setIsLoading(true)
    const res = await deleteMessage(formId, message._id as string);
    onDelete()
    setIsLoading(true);
    toast({
      title: res.message ?? "Message Deleted",
    });
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Message</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-10 h-10 p-0" variant="destructive">
                <X className="w-8 h-8" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  message and remove data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <CardDescription>Received at {format(new Date(message.createdAt), "dd-MMM-yy HH:mm", { locale: enIN })}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{message.content}</p>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
