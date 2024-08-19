"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema";
import axios,{AxiosError} from 'axios';
import { IApiResponse } from "@/types/IApiResponse"


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
      
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>Page</div>
  )
}

export default Page;
