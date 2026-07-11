import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type FormProps = {
  id: string;
  label: string;
  value: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  required?: boolean;
}

export default function FormComponent({ id, label, type, value, onChange, required = false }: FormProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  const toggleVisible = () => {
    setIsVisible(!isVisible);
  };

  const currentInputType = type === 'password' ? (isVisible ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="font-sans font-bold text-xs uppercase tracking-widest text-ink/80">
        {label} {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      
      <div className="relative flex items-center w-full"> 
        <input 
          type={currentInputType} 
          id={id} 
          className="w-full px-4 py-2.5 bg-white border border-gray-200 outline-none focus:border-burnt-brown transition-colors text-sm text-ink pr-10 rounded-none" 
          required={required} 
          value={value} 
          onChange={onChange} 
        />
        
        {type === 'password' && (
          <button 
            type="button" 
            onClick={toggleVisible}
            className="absolute right-3 text-muted-ink hover:text-ink transition-colors focus:outline-none cursor-pointer"
          >
            {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />} 
          </button>
        )}
      </div>
    </div>
  );
}