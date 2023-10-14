import { HTMLAttributes } from "react";

export enum Type {
    Active, Unactive,
}

function getClasses(type: Type): string {
    const common = "py-[10px] px-[23px] rounded-[10px] transition-colors border-vtb-blue border-2 motion-reduced:transition-none";
    switch (type) {
        case Type.Active: return `${common} text-white bg-vtb-blue`;
        case Type.Unactive: return `${common} text-vtb-blue`;
    }
}

export default function Button(props: { styleType: Type } & HTMLAttributes<HTMLButtonElement>) {
    return <button {...props} className={[getClasses(props.styleType), props.className].join(" ")}>{props.children}</button>
}