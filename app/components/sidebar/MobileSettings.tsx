
import clsx from "clsx";

interface MobileSettingsProp {
  icon: any;
  active?: boolean;
  onClick?: () => void;
}

const MobileSettings: React.FC<MobileSettingsProp> = ({ 
  icon: Icon, 
  active,
  onClick
}) => {

  return ( 
    <div 
      onClick={onClick}
      className={clsx(`
        group 
        flex 
        gap-x-3 
        text-sm 
        leading-6 
        font-semibold 
        w-full 
        justify-center 
        p-4 
        text-blue-300
        hover:text-blue-900
        hover:bg-blue-300
      `,
        active && 'bg-blue-900',
      )}>
      <Icon className="h-6 w-6" />
    </div>
   );
}
 
export default MobileSettings;