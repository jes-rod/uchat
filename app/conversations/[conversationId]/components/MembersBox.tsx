import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {  Conversation, User } from "@prisma/client";
import Popup from 'reactjs-popup';
import { useRef } from "react";

import Avatar from "@/app/components/Avatar";
import LoadingModal from "@/app/components/modals/LoadingModal";
import MakeAdminModal from "@/app/components/modals/MakeAdminModal";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import RevokeAdminModal from "@/app/components/modals/RevokeAdminModal";
import RemoveMemberModal from "@/app/components/modals/RemoveMemberModal";

interface MembersBoxProps {
  user: User;
  conversation: Conversation & {
    users: User[],
    userIds: []
  },
  currentUser: User;
}

const MembersBox: React.FC<MembersBoxProps> =  ({ 
  user,
  conversation,
  currentUser
}) => {
  const router = useRouter();
  const popUp: any = useRef()
  const [isLoading, setIsLoading] = useState(false);
  const [isMakeAdminModalOpen, setisMakeAdminModalOpen] = useState(false);
  const [isRevokeAdminModalOpen, setisRevokeAdminModalOpen] = useState(false);
  const [removeMemberOpen, setRemoveMemberOpen] = useState(false);
  const isAdmin = conversation.adminIds.includes(user.id);
  
  const handleAdmin = async () => {
    popUp?.current?.close();
    if(!isAdmin){
      setisMakeAdminModalOpen(true)
    }else{
      setisRevokeAdminModalOpen(true);
    }
  }

  return (
    <div className="flex flex-row">
      {isLoading && (
        <LoadingModal />
      )}
      <MakeAdminModal 
        isOpen={isMakeAdminModalOpen} 
        onClose={() => setisMakeAdminModalOpen(false)}
        user={user as User}
        currentUser={currentUser as User}
      />
      <RevokeAdminModal 
        isOpen={isRevokeAdminModalOpen} 
        onClose={() => setisRevokeAdminModalOpen(false)}
        user={user as User}
        currentUser={currentUser as User}
      />
      <RemoveMemberModal
        isOpen={removeMemberOpen}
        user={user as User}
        onClose={() => setRemoveMemberOpen(false)}
        currentUser={currentUser as User}
      />
      <div
        className="
          w-full 
          relative 
          flex 
          items-center 
          space-x-3 
          bg-transparent
          p-3 
          hover:bg-blue-900
          rounded-lg
          transition
        "
      >
        <Avatar user={user} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <div className="flex justify-between flex-col mb-1">
              <p className="text-sm font-medium text-slate-200">
                {user.name}
              </p>
              <p className="text-sm font-medium text-slate-400">
                {user.email}
              </p>
              {
                isAdmin && 
                <p className="text-sm font-medium text-green-700">
                  Admin
                </p>
              }
            </div>
          </div>
        </div>
      </div>
      {
        currentUser.id !== user.id && <div className="flex items-center">
        <Popup ref={popUp as any} trigger={ <button><HiEllipsisHorizontal
          size={32}
          className="
            text-sky-500
            cursor-pointer
            hover:text-sky-600
            transition
          "
        /> </button>} position={"left center"}>
          <div className=" text-slate-200 hover:bg-blue-900 cursor-pointer py-2 px-2" onClick={handleAdmin} >
            {!isAdmin ? 'Make member an admin' : 'Revoke admin rights'}
          </div>
          <div className="text-slate-200 hover:bg-blue-900 cursor-pointer py-2 px-2" onClick={() => {
            popUp?.current?.close();
            setRemoveMemberOpen(true)
          }}>
            Remove member
          </div>
        </Popup>
      </div>
      }
    </div>
  );
}
 
export default MembersBox;
