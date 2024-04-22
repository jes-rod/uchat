'use client';

import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { FullMessageType } from "@/app/types";
import { IoIosDocument } from "react-icons/io";
import Link from "next/link";

import Avatar from "@/app/components/Avatar";
import ImageModal from "@/app/components/modals/ImageModal";
import { GroupAdditions, User } from "@prisma/client";

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

const formatDate = ( date: Date ) => {
  const today = new Date();
  if(format(date, 'PP') === format(today, 'PP')){
    return "Today " + format(date, 'p')
  }else{
    return format(date, 'PPp')
  }
}

const MessageBox: React.FC<MessageBoxProps> = ({ 
  data, 
  isLast
}) => {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const isOwn = session.data?.user?.email === data?.sender?.email;
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(', ');

  const container = clsx('flex gap-3 p-4', isOwn && 'justify-end');
  const avatar = clsx(isOwn && 'order-2');
  const body = clsx('flex flex-col gap-2', isOwn && 'items-end');
  const message = clsx(
    'text-sm w-fit overflow-hidden', 
    isOwn ? 'bg-sky-500 text-white' : 'bg-gray-700 text-white', 
    data.image ? 'rounded-md p-0' : 'rounded-full py-2 px-3'
  );


  const messageType = (data: FullMessageType) => {

    if(data.image){
      return (
        <Image
              alt="Image"
              height="288"
              width="288"
              onClick={() => setImageModalOpen(true)} 
              src={data.image} 
              className="
                object-cover 
                cursor-pointer 
                hover:scale-110 
                transition 
                translate
              "
            />
      )
    }else if(data.file.length > 0){
      return (
        <div className="flex flex-row">
          <IoIosDocument size={20}/>
          <Link className="text-slate-200 text-medium underline" href={data.file[1]} target="_blank">{data.file[0]}</Link>
        </div>
      )
    }else{
      return <div>{data.body}</div>
    }
  }


  const displayMessage =  () => {

        return (
          data.isSystem ? (
            <div className="flex place-content-center opacity-75">
              <div className="bg-blue-950 text-center w-auto p-2 rounded-full m-2">
                <span className="text-slate-300 p-2">{data.body}</span>
              </div>
            </div>
          ) : (
            <div className={container}>
              <div className={avatar}>
               <Avatar user={data.sender} />
              </div>
            <div className={body}>
              <div className="flex items-center gap-1">
                <div className="text-sm text-gray-500">
                  {data.sender.name}
                </div>
                <div className="text-xs text-gray-400">
                  {formatDate(new Date(data.createdAt))}
                </div>
              </div>
              <div className={message}>
                <ImageModal src={data.image} isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)} />
                {messageType(data)}
              </div>
              {isOwn && (seenList.length > 0) && (
                <div 
                  className="
                  text-xs 
                  font-light 
                  text-gray-500
                  "
                >
                  {`Seen by ${seenList}`}
                </div>
              )}
            </div>
          </div>
          )
        )
      }
  //}

    

  return ( 
    <>
      {displayMessage()}
    </>
   );
}
 
export default MessageBox;
