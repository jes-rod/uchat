'use client';

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import MobileItem from "./MobileItem";
import { User } from "@prisma/client";
import { IoMdSettings } from "react-icons/io";
import { useState } from "react";
import SettingsModal from "../modals/SettingsModal";
import MobileSettings from "./MobileSettings";


interface MobileFooterProps {
  currentUser: User;
}

const MobileFooter: React.FC<MobileFooterProps> = ({currentUser}) => {
  const routes = useRoutes();
  const { isOpen } = useConversation();
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (isOpen) {
    return null;
  }

  return ( 
    <>
      <SettingsModal currentUser={currentUser} isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <div 
      className="
        fixed 
        justify-between 
        w-full 
        bottom-0 
        z-40 
        flex 
        items-center 
        bg-blue-950 
        lg:hidden
      "
    >
      {routes.map((route) => (
        <MobileItem 
          key={route.href} 
          href={route.href} 
          active={route.active} 
          icon={route.icon}
          onClick={route.onClick}
        />
      ))}
        <MobileSettings 
          key={currentUser.email} 
          active={settingsOpen} 
          icon={IoMdSettings }
          onClick={() => setSettingsOpen(true)}
        />
    </div>
    </>

   );
}
 
export default MobileFooter;