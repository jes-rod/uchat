'use client';

interface CheckboxProps {
    label: string;
    disabled?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckBox: React.FC<CheckboxProps> = ({
    label,
    disabled,
    onChange
}) => {

    return (
        <div className='flex flex-row-reverse mx-2 mt-5 w-auto place-content-center text-center'>
            <label htmlFor="accept"
                className="
                block 
                text-md 
                font-medium 
                leading-6 
                text-zinc-200
                text-center

            ">
                {label}
            </label>
            <input
                type="checkbox"
                id="accept"
                className="
                appearance-none 
                w-5 
                h-5 
                border-2
                border-blue-500 
                rounded-md
                bg-white
                mx-3 
                shrink-0
                checked:bg-blue-400
                checked:border-0
                disabled:bg-slate-500
                "
                disabled={disabled}
                onChange={onChange}
            >
            </input>
        </div>
    )



}

export default CheckBox;
