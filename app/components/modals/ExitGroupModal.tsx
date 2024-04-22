'use client';

import React, { useCallback, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { FiAlertTriangle } from 'react-icons/fi'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/modals/Modal';
import Button from '@/app/components/Button';
import { toast } from 'react-hot-toast';
import { Conversation, User } from '@prisma/client';

interface ExitGroupModalProps {
  isOpen?: boolean;
  isAdmin: boolean;
  onClose: () => void;
  currentUser: User;
  conversation: Conversation & {
    users: User[],
    userIds: []
  },
}

const ExitGroupModal: React.FC<ExitGroupModalProps> = ({ 
  isOpen, 
  isAdmin,
  onClose,
  currentUser,
  conversation
}) => {
  const router = useRouter();
  const { id: conversationId } = conversation;
  const [isLoading, setIsLoading] = useState(false);
  
  const onRemoval = useCallback( () => {
    setIsLoading(true);
    if(isAdmin && conversation.adminIds.length === 1 ){
        toast.error('Please select a member to be the next admin before leaving the group')
        setIsLoading(false);
        return;
    }
    const messageBody = `${currentUser.name} has left the group`;
    
    axios.post(`/api/messages`, {
        message: messageBody,
        senderId: currentUser.id,
        isSystem: true,
        conversationId: conversationId
    })
    .then(() => {
        axios.post(`/api/conversations/${conversationId}/members/remove`, {
            userId: currentUser.id
        })
      .then(() => {
        onClose();
        router.refresh();
      })
    })
    .catch(() => toast.error('Something went wrong!'))
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
            className="h-6 w-6 text-red-600" 
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
            Exit group
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-300">
              Are you sure you want to leave <strong>{conversation.name}</strong>?
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 flex flex-center sm:flex-row-reverse place-content-center px-3">
        <Button
          disabled={isLoading}
          danger
          onClick={onRemoval}
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

export default ExitGroupModal;
