import Image from "next/image";
import AuthForm from "./components/AuthForm";
import getSession from "../actions/getSession";
import { redirect } from 'next/navigation';

const Auth = async () => {

  const session = await getSession();
  if(session){
    redirect('/conversations')
  }

  return (
    <div 
      className="
        home
        flex 
        min-h-full 
        flex-col 
        justify-center 
        py-12 
        sm:px-6 
        lg:px-8 
      "
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          height="78"
          width="78"
          className="mx-auto w-auto"
          src="/images/uchat-logo.jpg"
          alt="Logo"
          style={{borderRadius: '10px'}}
        />
      </div>
      <AuthForm /> 
           
  </div>
  )
}

export default Auth;
