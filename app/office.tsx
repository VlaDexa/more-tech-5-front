"use client";
import { AtmShow, AtmsService, SalepointService } from "@/openapi";
import { useEffect, useMemo, useState } from "react";
import Znak from "@/public/znak.svg";
import Info from "@/public/info.svg";
import Image from "next/image";

export enum Type {
    Atm, Office
}

async function getInfo(id: string, type: Type): Promise<{ address: string, distance: number, loaded: boolean }> {
    switch (type) {
        case Type.Atm: {
            const req = await fetch(`http://api.lapki.vladexa.ru:8000/api/v1/atms/?id=${id}`);
            const point: AtmShow = await req.json();
            return {
                address: point.address,
                distance: 180,
                loaded: Math.random() > 0.5
            }
        }
        case Type.Office: {
            const req = await fetch(`http://api.lapki.vladexa.ru:8000/api/v1/salepoint/?id=${id}`);
            const point = await req.json();
            return {
                address: point.address,
                distance: point.distance,
                loaded: Math.random() > 0.5
            }
        }
    }
}

export default function Office(props: { id: string, type: Type, distance: number }) {
    const [info, setInfo] = useState<Awaited<ReturnType<typeof getInfo>> | undefined>(undefined);
    useEffect(() => { getInfo(props.id, props.type).then(info => setInfo(info)) }, [props.id, props.type]);
    const address = useMemo(() => <address className="flex flex-row rounded-[10px] hover:bg-vtb-gray group px-[10px] py-[6px] gap-2">
        <Image src={Znak} alt="" />
        <div className="flex flex-col flex-grow">
            <span className="text-xl group-hover:font-bold">{info?.address}</span>
            {info?.loaded ? <></> : <span className="text-[#CA181F] flex flex-row">
                <Image src={Info} alt="Внимание" />
                Сильно загружен
            </span>}
        </div>
        <span className="text-xl text-vtb-blue">{props.distance} м</span>
    </address>, [info?.address, info?.loaded, props.distance]);
    // console.log("info: ", info);
    return info ? address : <></>
}