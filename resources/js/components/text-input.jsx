import { Input } from './ui/input';
import { Label } from './ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';


export default function TextInput({ labelName, labelTitle,error, icon:Icon, type, ...props }) {

    const [show, setShow] = useState(false);
    const isPassword = type === "password";

    return (
        <>
            {labelTitle && (
                <Label {...props} htmlFor={labelName}>
                    {labelTitle}
                </Label>
            )}
            <div className="relative w-full">
                <Input {...props} autoComplete="off" id={labelName}  type={isPassword ? (show ? "text" : "password") : type}/>
                {Icon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <Icon size={18} />
                    </span>
                )}
                    {/* pass visibility */}
                    {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                        {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            
            {error && (
                <p className=" text-red-500 text-sm mt-1 p-1">{error}</p>
            )}
        </>
    );
}
