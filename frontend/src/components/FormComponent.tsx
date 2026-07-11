
type FormProps = {
    id : string ;
    label : string
    value : string
    type : string
    onChange : (e: React.ChangeEvent<HTMLInputElement> ) => void ; 
    required? : boolean ;
}

export default function FormComponent({ id ,label  , type, value,  onChange , required = false} : FormProps) {
    return (
        <div className="flex flex-col gap-3">
                    <label htmlFor={id} className="font-semibold text-sm uppercase tracking-wider">{label}  </label>
                    <input type={type} id={id} className="px-4 py-2 border-2 border-gray-100 outline-none focus:border-blue-200 rounded-lg" required={required} value={value} onChange={onChange} />
         </div>
    )
}