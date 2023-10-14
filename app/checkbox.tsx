import { HTMLAttributes } from "react";

export default function Checkbox(props: HTMLAttributes<HTMLInputElement>) {
    return <input {...props} type="checkbox" className={`cursor-pointer w-[30px] h-[30px] rounded-lg appearance-none border-2 border-vtb-blue self-center shrink-0 checkbox ${props.className}`} />
}