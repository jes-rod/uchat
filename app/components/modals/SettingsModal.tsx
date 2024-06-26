'use client';

import axios from 'axios';
import React, { useRef, useState } from 'react'
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { User } from '@prisma/client';
import { storage } from '@/app/libs/firebase';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from 'uuid';

import Input from '../inputs/Input';
import Modal from './Modal';
import Button from '../Button';
import Image from 'next/image';
import DeleteAccountModal from './DeleteAccountModal';
import { toast } from 'react-hot-toast';

interface SettingsModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentUser: User;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  currentUser
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const imageButton = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image
    }
  });

  const image = watch('image');

  const handleImageUpload = () => {
    imageButton.current?.click();
  }

  const handleUpload = async (event: any) => {
    const image = event.target.files[0];
    if(!image) {
      toast.error('Image upload failed, please try again');
      return;
    }
    if(image.type.includes('image')){
      const imageRef = ref(storage, `profile-images/${v4()}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);
      setValue('image', imageUrl, { 
        shouldValidate: true 
      });
    }
  }


  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios.post('/api/settings', data)
    .then(() => {
      router.refresh();
      onClose();
    })
    .catch(() => toast.error('Something went wrong!'))
    .finally(() => setIsLoading(false));
  }

  return (
    <>
      <DeleteAccountModal isOpen={isDeleteAccountOpen} onClose={() => setIsDeleteAccountOpen(false)} currentUser={currentUser}/>
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
              Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-300">
              Edit your public information.
            </p>

            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                disabled={isLoading}
                label="Name" 
                id="name" 
                errors={errors} 
                required 
                register={register}
              />
              <div>
                <label 
                  htmlFor="photo" 
                  className="
                    block 
                    text-sm 
                    font-medium 
                    leading-6 
                    text-slate-200
                  "
                >
                  Photo
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <Image
                    width="48"
                    height="48" 
                    className="rounded-full" 
                    src={image || currentUser?.image || '/images/placeholder.jpg'}
                    alt="Avatar"
                  />
                  <input type="file" ref={imageButton} onChange={handleUpload} hidden />
                  <Button
                      disabled={isLoading}
                      secondary
                      type="button"
                      onClick={handleImageUpload}
                    >
                      Change
                  </Button>
                </div>
              </div>
              <div>
                  <Button
                      disabled={isLoading}
                      danger
                      type="button"
                      onClick={() => setIsDeleteAccountOpen(true)}
                    >
                      Delete account
                  </Button>
                </div>
              </div>
          </div>
        </div>

        <div 
          className="
            mt-6 
            flex 
            items-center 
            justify-end 
            gap-x-6
          "
        >
          <Button 
            disabled={isLoading}
            secondary 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            disabled={isLoading}
            type="submit"
          >
            Save
          </Button>
        </div>
      </form>
    </Modal>
    </>
    
  )
}

export default SettingsModal;
