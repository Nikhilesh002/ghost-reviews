"use client"
import { useParams } from 'next/navigation';
import React from 'react'

const Page = () => {
  
  const {username}=useParams();
  
  return (
    <div>Welcome to {username} message Page </div>
  )
}

export default Page;
