'use client';

import React, { useCallback, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { FiAlertTriangle } from 'react-icons/fi'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/modals/Modal';
import Button from '@/app/components/Button';
import CheckBox from '../inputs/Checkbox';
import useConversation from '@/app/hooks/useConversation';
import { toast } from 'react-hot-toast';
import { User } from '@prisma/client';
import { signOut } from "next-auth/react";

interface DeleteAccountModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentUser: User;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ 
  isOpen, 
  onClose,
  currentUser
}) => {
  const router = useRouter();
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const label = "I want to proceed with the deletion";

  const handleConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirm(e.currentTarget.checked)
  }
  
  const onDelete = useCallback(() => {
    setIsLoading(true);

    axios.delete(`/api/users/delete`)
    .then(() => {
      onClose();
      setIsLoading(false);
      signOut();
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
            Delete your account
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-300">
              Are you sure you want to delete your account? 
            </p>
            <br />
            <p className="text-sm text-gray-300">
            All your data including contact list and conversations will be removed. this action <strong>can&apos;t</strong> be undone.
            </p>
          </div>
        </div>
      </div>
      <CheckBox disabled={isLoading} label={label} onChange={handleConfirm} />
      <div className="mt-5 sm:mt-4 flex flex-center sm:flex-row-reverse place-content-center px-3">
        <Button
          disabled={isLoading || !confirm}
          danger
          onClick={onDelete}
        >
          Delete
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

export default DeleteAccountModal;
