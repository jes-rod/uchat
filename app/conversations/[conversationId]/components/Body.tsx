'use client';

import './Body.css'
import axios from "axios";
import { useEffect, useRef, useState } from "react";

import { pusherClient } from "@/app/libs/pusher";
import useConversation from "@/app/hooks/useConversation";
import MessageBox from "./MessageBox";
import { FullMessageType } from "@/app/types";
import { find } from "lodash";
import { GroupAdditions } from '@prisma/client';

interface BodyProps {
  initialMessages: FullMessageType[];
  groupAddition?: GroupAdditions;
}

const Body: React.FC<BodyProps> = ({ initialMessages = [], groupAddition }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);
  const { conversationId } = useConversation();


  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId)
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message]
      });

      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) => current.map((currentMessage) => {
        if (currentMessage.id === newMessage.id) {
          return newMessage;
        }

        return currentMessage;
      }))
    };


    pusherClient.bind('messages:new', messageHandler)
    pusherClient.bind('message:update', updateMessageHandler);
    return () => {
      pusherClient.unsubscribe(conversationId)
      pusherClient.unbind('messages:new', messageHandler)
      pusherClient.unbind('message:update', updateMessageHandler)
      
    }

    
    
  }, [conversationId]);


  const visibleMessages = () => {
    if(groupAddition){
      if(groupAddition.dateRemoved){
        const array = messages.filter((message) => (new Date(message.createdAt)) >= (groupAddition.dateAdded) && (new Date(message.createdAt)) <= groupAddition.dateRemoved!)
        return array
      }else{
        return messages.filter((message) => (new Date(message.createdAt) >= groupAddition.dateAdded))
      }
    }else{
      return messages
    } 
  }

  return (
    <div
      className="
      body
      flex-1 
      overflow-y-auto 

    ">
      {visibleMessages().map((message, i) => (
        <MessageBox
          key={message.id}
          data={message}
        />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
}

export default Body;
