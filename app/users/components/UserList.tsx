'use client';


import { User } from "@prisma/client";

import UserBox from "./UserBox";
import { FaUserPlus } from "react-icons/fa";
import AddContactModal from "@/app/components/modals/AddContactModal";
import { useState } from "react";

interface UserListProps {
  items: User[];
}

const UserList: React.FC<UserListProps> = ({ 
  items, 
}) => {

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);


  return ( 
    <>
      <AddContactModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
      />
      <aside className="
        fixed 
        inset-y-0 
        pb-20
        lg:pb-0
        lg:left-20 
        lg:w-80 
        lg:block
        overflow-y-auto 
        block w-full left-0
        bg-blue-950/75
      "
    >
      <div className="px-5">
        <div className="flex justify-between mb-4 pt-4">
          <div 
            className="
              text-2xl 
              font-bold 
              text-slate-100
            "
          >
            Contacts
          </div>
          <div 
              onClick={() => setIsAddModalOpen(true)} 
              className="
                rounded-full 
                p-2 
                bg-blue-300 
                text-blue-900 
                cursor-pointer 
                hover:opacity-75 
                transition
              "
            >
              <FaUserPlus size={20} />
            </div>
        </div>
        {items.map((item) => (
          <UserBox
            key={item.id}
            data={item}
          />
        ))}
      </div>
    </aside>
    </>
  );
}
 
export default UserList;
