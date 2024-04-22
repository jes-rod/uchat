import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {  User } from "@prisma/client";
import { TiDeleteOutline } from "react-icons/ti";


import Avatar from "@/app/components/Avatar";
import LoadingModal from "@/app/components/modals/LoadingModal";
import DeleteUserModal from "./DeleteUserModal";

interface UserBoxProps {
  data: User;
}

const UserBox: React.FC<UserBoxProps> = ({ 
  data
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);

    axios.post('/api/conversations', { userId: data.id })
    .then((data) => {
      router.push(`/conversations/${data.data.id}`);
    })
    .finally(() => setIsLoading(false));
  }, [data, router]);

  return (
    <div className="flex flex-row">
      {isLoading && (
        <LoadingModal />
      )}
      <DeleteUserModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        user={data}
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
          cursor-pointer
        "
        onClick={handleClick}
      >
        <Avatar user={data} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-slate-200">
                {data.name}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="
        place-content-center 
        text-red-300
        hover:bg-red-900/50	
        cursor-pointer
        rounded-lg
      "
        onClick={() => setIsDeleteModalOpen(true)}>
        <TiDeleteOutline size={25}/>
      </div>
      
    </div>
  );
}
 
export default UserBox;
