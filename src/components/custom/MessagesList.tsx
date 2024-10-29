"use client"

import React from 'react'
import MessageCard from './MessageCard'
import { Message } from '@/model/Messages.model'

function MessagesList({messages,formId}:{messages:Message[],formId:string}) {
  return (
    messages?.map((message, index) => (
      <div key={index}>
        <MessageCard
          message={message}
          formId={formId}
        />
      </div>
    ))
  )
}

export default MessagesList;
