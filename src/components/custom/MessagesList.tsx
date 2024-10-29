"use client"

import React from 'react'
import MessageCard from './MessageCard'
import { Message } from '@/model/Messages.model'

function MessagesList({messages}:{messages:Message[]}) {
  return (
    messages?.map((message, index) => (
      <div key={index}>
        <MessageCard
          message={message}
          onMessageDelete={()=>{console.log("Hi")}}
        />
      </div>
    ))
  )
}

export default MessagesList;
