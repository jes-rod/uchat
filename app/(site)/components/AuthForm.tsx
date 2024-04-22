'use client';

import axios from "axios";
import { signIn } from 'next-auth/react';
import { useCallback, useState } from 'react';
import { BsGithub, BsGoogle  } from 'react-icons/bs';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from "next/navigation";

import Input from "@/app/components/inputs/Input";
import AuthSocialButton from './AuthSocialButton';
import Button from "@/app/components/Button";
import { toast } from "react-hot-toast";

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER');
    } else {
      setVariant('LOGIN');
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
  
    if (variant === 'REGISTER') {
      axios.post('/api/register', data)
      .then(() => signIn('credentials', {
        ...data,
        redirect: false,
      }))
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials!');
        }

        if (callback?.ok) {
          router.push('/conversations')
        }
      })
      .catch(() => toast.error('Something went wrong!'))
      .finally(() => setIsLoading(false))
    }

    if (variant === 'LOGIN') {
      signIn('credentials', {
        ...data,
        redirect: false
      })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials!');
        }

        if (callback?.ok) {
          router.push('/conversations')
        }
      })
      .finally(() => setIsLoading(false))
    }
  }

  const socialAction = (action: string) => {
    setIsLoading(true);

    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials!');
        }

        if (callback?.ok) {
          router.push('/conversations')
        }
      })
      .finally(() => setIsLoading(false));
  } 

    return ( 
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div 
          className="
          bg-gray-900/75
            px-4
            py-8
            shadow
            sm:rounded-lg
            sm:px-10
          "
        >
          <form 
            className="space-y-6" 
            onSubmit={handleSubmit(onSubmit)}
          >
            {variant === 'LOGIN' ? <h2 
            className="
              text-center 
              text-3xl 
              font-bold 
              tracking-tight 
              text-white
            "
            >
              Sign in to your account
          </h2> : <h2 
            className="
              text-center 
              text-3xl 
              font-bold 
              tracking-tight 
              text-white
            "
            >
              Create an account
          </h2> }
            {variant === 'REGISTER' && (
              <Input
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                id="name" 
                label="Name"
              />
            )}
            <Input 
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              id="email" 
              label="Email address" 
              type="email"
            />
            <Input 
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              id="password" 
              label="Password" 
              type="password"
            />
            <div>
              <Button disabled={isLoading} fullWidth type="submit">
                {variant === 'LOGIN' ? 'Sign in' : 'Register'}
              </Button>
            </div>
          </form>
  
          <div className="mt-6">
            <div className="relative">
              <div 
                className="
                  absolute 
                  inset-0 
                  flex 
                  items-center
                "
              >
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-300">
                  Or continue with
                </span>
              </div>
            </div>
  
            <div className="mt-6 flex gap-2">
              <AuthSocialButton 
                icon={BsGithub} 
                onClick={() => socialAction('github')}
                text='GitHub' 
              />
              <AuthSocialButton 
                icon={BsGoogle} 
                onClick={() => socialAction('google')} 
                text='Google'
              />
            </div>
          </div>
          <div 
            className="
              flex 
              gap-2 
              justify-center 
              text-sm 
              mt-6 
              px-2 
              text-zinc-200
            "
          >
            <div>
              {variant === 'LOGIN' ? "You don't have an account yet?" : 'Already have an account?'} 
            </div>
            <div 
              onClick={toggleVariant} 
              className="underline cursor-pointer"
            >
              {variant === 'LOGIN' ? 'Create one here!' : 'Login'}
            </div>
          </div>
        </div>
      </div>
    );
  }

 
export default AuthForm;
