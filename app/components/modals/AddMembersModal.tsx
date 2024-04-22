'use client';

import axios from 'axios';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { 
  FieldValues, 
  SubmitHandler, 
  useForm 
} from 'react-hook-form';
import { User } from '@prisma/client';
import Select from '@/app/components/inputs/Select';
import Modal from '@/app/components/modals/Modal';
import Button from '@/app/components/Button';
import { toast } from 'react-hot-toast';
import useConversation from '@/app/hooks/useConversation';

interface AddMembersModalProps {
  isOpen?: boolean;
  onClose: () => void;
  users: User[];
  userIds: String[];
  currentUser: User;
}

const GroupChatModal: React.FC<AddMembersModalProps> = ({ 
  isOpen, 
  onClose, 
  users = [],
  userIds = [],
  currentUser,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      members: []
    }
  });

  const members = watch('members');
  const { conversationId } = useConversation();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    const members = userIds.concat(data.members.map((member: any) => member.value));

    //Fetching the names of the members added to the group to send them as an alert
    const messageBody = `${currentUser.name} has added ${users.map((user) => {
      members.includes(user.id);
      return user.name;
    }) + ', '} to the group`;
    
    axios.post(`/api/conversations/${conversationId}/members/add`, {
      ...data
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
    .catch(() => toast.error('Something went wrong!'))
    .finally(() => setIsLoading(false));
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 
              className="
                text-base 
                font-semibold 
                leading-7 
                text-slate-200
              "
              >
                Add members to the group
              </h2>
            <div className="mt-10 flex flex-col gap-y-8">
              <Select
                disabled={isLoading}
                label="Members" 
                options={users.map((user) => ({ 
                  value: user.id, 
                  label: user.name 
                }))} 
                onChange={(value) => setValue('members', value, { 
                  shouldValidate: true 
                })} 
                value={members}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button
            disabled={isLoading}
            onClick={onClose} 
            type="button"
            secondary
          >
            Cancel
          </Button>
          <Button disabled={isLoading} type="submit">
            Add members
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default GroupChatModal;
