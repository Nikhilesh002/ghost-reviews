"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
} from "@/components/ui/alert-dialog"
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/Messages.model";
import { useToast } from "../ui/use-toast";
import { deleteMessage } from "@/actions/forms";


type MessageCardProps={
  message:Message;
  formId:string;
}

const MessageCard = ({message,formId}:MessageCardProps) => {

  const {toast}=useToast();

  const handleDeleteConfirm=async()=>{
    const res=await deleteMessage(formId,message._id as string);
    toast({
      title:res.message ?? "Message Deleted"
    })
  }

  const formattedDate=(date:Date)=>{
    const niceDate=new Date(date).toLocaleString().split(',');
    return "on "+niceDate[0]+" at "+niceDate[1].substring(0,6)+niceDate[1].substring(9,12);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Message</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-10 h-10 p-0" variant="destructive"><X className="w-8 h-8"/></Button>
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
        <CardDescription>Received at {formattedDate(message.createdAt)}</CardDescription>   {/* TODO Date format */}
      </CardHeader>
      <CardContent>
        <p>{message.content}</p>
      </CardContent>
    </Card>
  )
}

export default MessageCard;
