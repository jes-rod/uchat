'use client';

import {
  HiPaperAirplane,
  HiPhoto
} from "react-icons/hi2";
import MessageInput from "./MessageInput";
import {
  FieldValues,
  SubmitHandler,
  useForm
} from "react-hook-form";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { v4 } from 'uuid';
import { storage } from "@/app/libs/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import toast from "react-hot-toast";
import { FaPaperclip } from "react-icons/fa";
import { Conversation, Message, User } from "@prisma/client";
import { pusherClient } from "@/app/libs/pusher";

interface FormProps {
  conversation: Conversation & {
    messages: Message[];
  },
  currentUser: User;
}




const Form: React.FC<FormProps> = ({ conversation, currentUser }) => {
  const conversationId = conversation.id;
  const imageButton = useRef<HTMLInputElement>(null);
  const fileButton = useRef<HTMLInputElement>(null);
  const router = useRouter()
  const isMember = conversation.userIds.includes(currentUser.id);
  const isAdmin = conversation.adminIds.includes(currentUser.id);


  const {
    register,
    handleSubmit,
    setValue,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      message: ''
    }
  });

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    const checkMessagingSystem = () => {

      const lastMessage = conversation.messages.slice(-1)
      if(lastMessage[0].isSystem){
        router.refresh();
      }
      
    }
    
    


    pusherClient.bind('conversation:update', checkMessagingSystem);
    return () => {
      pusherClient.unsubscribe(conversationId)
      pusherClient.unbind('conversation:update', checkMessagingSystem)
      
    }

  }, [conversationId])

  const showForm = () => {
    if((!(conversation.onlyAdmins) || (conversation.onlyAdmins && isAdmin)) && isMember){
      return (
        <div
        className="
        py-4 
        px-4 
        bg-blue-900/50	
        flex 
        items-center 
        gap-2 
        lg:gap-4 
        w-auto
        flex-space-evenly
      "
      > <div className="cursor-pointer" onClick={handleSelect}>
          <input type="file" ref={imageButton} onChange={handleImageUpload} hidden />
          <HiPhoto size={30} className="text-sky-500" />
        </div>
        <div className="cursor-pointer" onClick={handleFile}>
          <input type="file" ref={fileButton} onChange={handleFileUpload} hidden />
          <FaPaperclip size={25} className="text-sky-500" />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center gap-2 lg:gap-4 w-full"
        >
          <MessageInput
            id="message"
            register={register}
            errors={errors}
            required
            placeholder="Write a message"
          />
          <button
            type="submit"
            className="
            rounded-full 
            p-2 
            bg-sky-500 
            cursor-pointer 
            hover:bg-sky-600 
            transition
          "
          >
            <HiPaperAirplane
              size={18}
              className="text-white"
            />
          </button>
        </form>
      </div>
      )
    }else{
      return (
        <div className="
            py-4 
            px-4 
            bg-blue-900/50	
            flex 
            place-content-center
            gap-2 
            lg:gap-4 
            w-full
          ">
          <span className="text-slate-200 text-medium ">{isMember ? 'Only admins can send messages on this group' : 'You are no longer a member of this group'}</span>

      </div>
      )
    }
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue('message', '', { shouldValidate: true });
    axios.post('/api/messages', {
      ...data,
      isSystem: false,
      conversationId: conversationId
    })
  }

  const handleSelect = () => {
    imageButton.current?.click();
  }
  const handleFile = () => {
    fileButton.current?.click();
  }

  const handleImageUpload = async (event: any) => {
    const image = event.target.files[0];
    if (!image) {
      toast.error('Image upload failed, please try again');
      return;
    }
    if (image.type.includes('image')) {
      const imageRef = ref(storage, `images/${v4()}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      axios.post('/api/messages', {
        image: imageUrl,
        isSystem: false,
        conversationId: conversationId
      })
      return;
    } else {
      toast.error('Please upload a valid image');
      return;
    }
  }

  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error('File upload failed, please try again');
      return;
    }
    if (!file.type.includes('image')) {
      const fileRef = ref(storage, `files/${v4()}`);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);
      const fileArray = [file.name, fileUrl];

      axios.post('/api/messages', {
        file: fileArray,
        isSystem: false,
        conversationId: conversationId
      })

      return;
    } else if (file.type.includes('image')) {
      await handleImageUpload(event);
      return;
    }
    else {
      toast.error('Please upload a valid image');
      return;
    }
  }

  return (
    <>
      {showForm()}
    </>
  );
}

export default Form;