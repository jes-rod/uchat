'use client';

import React, { useCallback, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { FiAlertTriangle } from 'react-icons/fi'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/modals/Modal';
import Button from '@/app/components/Button';
import useConversation from '@/app/hooks/useConversation';
import { toast } from 'react-hot-toast';
import { User } from '@prisma/client';

interface MakeAdminModalProps {
  isOpen?: boolean;
  onClose: () => void;
  user: User ;
  currentUser: User;
}

const MakeAdminModal: React.FC<MakeAdminModalProps> = ({ 
  isOpen, 
  onClose ,
  user,
  currentUser
}) => {
  const router = useRouter();
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);
  
  const makeAdmin = useCallback( () => {
    setIsLoading(true);
    const messageBody = `${currentUser.name} has made ${user.name} an admin`;

    axios.post(`/api/conversations/${conversationId}/admins/add`, {
        userId: user.id
    })
    .then(() => {

      axios.post('/api/messages', {
        message: messageBody,
        senderId: currentUser.id,
        isSystem: true,
        conversationId: conversationId
      })
      .then(() => {
        onClose();
        router.refresh();
      })
    })
    .catch((error) =>{
      toast.error(error.response.data)
    })
    .finally(() => setIsLoading(false))
  }, [router, conversationId, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex sm:items-start">
        <div 
          className="
            mx-auto 
            flex 
            h-12 
            w-12 
            flex-shrink-0 
            items-center 
            justify-center 
            rounded-full 
            bg-red-100 
            sm:mx-0 
            sm:h-10 
            sm:w-10
          "
        >
          <FiAlertTriangle 
            className="h-6 w-6 text-yellow-600" 
            aria-hidden="true"
          />
        </div>
        <div 
          className="
            mt-3 
            text-center 
            sm:ml-4 
            sm:mt-0 
            sm:text-left
          "
        >
          <Dialog.Title 
            as="h3" 
            className="text-base font-semibold leading-6 text-slate-100"
          >
            Grant admin privilege
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-300">
              Do you want to make {user.name} an admin?
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 flex flex-center sm:flex-row-reverse place-content-center px-3">
        <Button
          disabled={isLoading}
          onClick={makeAdmin}
        >
          Yes
        </Button>
        <Button
          disabled={isLoading}
          secondary
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  )
}

export default MakeAdminModal;
